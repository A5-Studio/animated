"""Clean self-recorded VO clips so they sound like one take.

usage: python3 scripts/clean_vo.py OUT_DIR clip1.m4a clip2.m4a ...

Per clip:
  0. spectral noise reduction (noisereduce) with a noise profile taken from the
     quietest 15% of the clip
  1. same chain for every clip: 80 Hz high-pass, light FFT denoise, a little
     presence (+2 dB at 3 kHz), gentle compression, and 1.07x speed (atempo keeps
     the pitch; TEMPO env to change)
  2. leveled to the same loudness (two-pass loudnorm, -16 LUFS; the final mix
     is normalized again to -14 LUFS by build_vo.py)
  3. silence cut (speech = 6 dB above the clip's noise floor): leading/trailing silence removed, and any pause inside the
     clip longer than MAX_GAP is shortened to MAX_GAP
  4. gentle gate: what's left of the room noise in the short pauses between
     words is turned down GATE_DB, with 30 ms ramps
Writes OUT_DIR/NN.wav (48 kHz mono) in the order the clips are given.
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np
import noisereduce as nr

SR = 48000
RNNN = os.environ.get("RNNN", "")  # optional RNNoise model for ffmpeg arnndn (neural denoise)
CHAIN = ("arnndn=m=" + RNNN + ":mix=0.95," if RNNN else "") + "highpass=f=80,afftdn=nr=8:nf=-45:tn=1,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2,atempo=" + os.environ.get("TEMPO", "1.07")
TARGET = "I=-16:TP=-1.5:LRA=7"
MAX_GAP = 0.22   # longest pause kept inside a clip (s)
PAD = 0.05       # speech kept around each cut (s)
GATE_DB = -18    # level of the pauses between words after the gate
HOLE = 15        # quiet stretches shorter than this many 10 ms frames count as speech (keeps soft syllables like "per")


def run(*a, **k):
    return subprocess.run(list(a), capture_output=True, text=True, check=True, **k)


def denoise(src):
    """decode, spectral noise reduction with a profile from the quietest frames; returns a temp wav path"""
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    y = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    hop = SR // 50
    frames = [y[i:i + hop] for i in range(0, len(y) - hop, hop)]
    rms = np.array([np.sqrt(np.mean(fr ** 2) + 1e-12) for fr in frames])
    quiet = np.argsort(rms)[: max(10, int(0.15 * len(frames)))]
    noise = np.concatenate([frames[i] for i in sorted(quiet)])
    out = nr.reduce_noise(y=y, sr=SR, y_noise=noise, stationary=True, prop_decrease=float(os.environ.get("NR_PROP", "0.8")), n_fft=2048)
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
    with wave.open(tmp, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    return tmp


def floor_db(a):
    hop = SR // 100
    e = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2) + 1e-12) for i in range(0, len(a) - hop, hop)])
    return float(np.percentile(20 * np.log10(e), 10))


def process(src, dst):
    src = denoise(src)
    # pass 1: measure after the chain
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-af", f"{CHAIN},loudnorm={TARGET}:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
    m = json.loads(r.stderr[r.stderr.rindex("{"): r.stderr.rindex("}") + 1])
    af = (f"{CHAIN},loudnorm={TARGET}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
          f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-af", af, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768

    # silence map: 10 ms frames, threshold relative to the clip's speech level
    hop = SR // 100
    e = np.array([np.sqrt(np.mean(a[i:i + hop] ** 2) + 1e-12) for i in range(0, len(a) - hop, hop)])
    db = 20 * np.log10(e)
    noise = np.percentile(db, 10)
    speech_level = np.percentile(db, 90)
    voiced = db > max(noise + 6, speech_level - 30)
    # close short holes (< HOLE frames) so soft syllables aren't gated or chopped
    v = voiced.copy()
    i = 0
    while i < len(v):
        if not v[i]:
            j = i
            while j < len(v) and not v[j]:
                j += 1
            if 0 < i and j < len(v) and (j - i) < HOLE:
                v[i:j] = True
            i = j
        else:
            i += 1
    # gate: pauses between words down GATE_DB, 30 ms ramps
    g = np.where(v, 1.0, 10 ** (GATE_DB / 20))
    g = np.convolve(g, np.ones(3) / 3, mode="same")
    gain = np.repeat(g, hop)
    gain = np.concatenate([gain, np.full(len(a) - len(gain), gain[-1] if len(gain) else 1.0)])
    a = a * gain
    idx = np.where(v)[0]
    if not len(idx):
        out = a
    else:
        pad = int(PAD * 100)
        start, end = max(0, idx[0] - pad), min(len(v), idx[-1] + pad + 1)
        pieces, run_start, k = [], start, start
        gap_max = int(MAX_GAP * 100)
        while k < end:
            if not v[k]:
                g = k
                while g < end and not v[g]:
                    g += 1
                if g - k > gap_max:  # long pause: keep pad on both sides, total MAX_GAP
                    keep = gap_max // 2
                    pieces.append(a[run_start * hop:(k + keep) * hop])
                    run_start = g - (gap_max - keep)
                k = g
            else:
                k += 1
        pieces.append(a[run_start * hop:end * hop])
        out = np.concatenate(pieces)
        # 8 ms fades at the edges
        f = int(0.008 * SR)
        out[:f] *= np.linspace(0, 1, f)
        out[-f:] *= np.linspace(1, 0, f)
    with wave.open(dst, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    os.remove(src)
    return len(a) / SR, len(out) / SR, floor_db(out)


out_dir = sys.argv[1]
os.makedirs(out_dir, exist_ok=True)
for n, src in enumerate(sys.argv[2:], 1):
    dst = os.path.join(out_dir, f"{n:02d}.wav")
    before, after, li = process(src, dst)
    print(f"{n:02d} {os.path.basename(src):30s} {before:5.2f}s -> {after:5.2f}s  noise floor {li:.1f} dB")
