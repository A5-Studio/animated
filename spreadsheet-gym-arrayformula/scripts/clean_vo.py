"""Clean self-recorded VO clips so they sound like one take.

usage: python3 scripts/clean_vo.py OUT_DIR clip1.m4a clip2.m4a ...

Per clip:
  1. same chain for every clip: 80 Hz high-pass, FFT denoise (14 dB, noise tracking), a little
     presence (+2 dB at 3 kHz), gentle compression
  2. leveled to the same loudness (two-pass loudnorm, -16 LUFS; the final mix
     is normalized again to -14 LUFS by build_vo.py)
  3. silence cut (speech = 6 dB above the clip's noise floor): leading/trailing silence removed, and any pause inside the
     clip longer than MAX_GAP is shortened to MAX_GAP
Writes OUT_DIR/NN.wav (48 kHz mono) in the order the clips are given.
"""
import json, os, subprocess, sys, wave
import numpy as np

SR = 48000
CHAIN = "highpass=f=80,afftdn=nr=14:nf=-40:tn=1,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80:makeup=2"
TARGET = "I=-16:TP=-1.5:LRA=7"
MAX_GAP = 0.32   # longest pause kept inside a clip (s)
PAD = 0.07       # speech kept around each cut (s)


def run(*a, **k):
    return subprocess.run(list(a), capture_output=True, text=True, check=True, **k)


def process(src, dst):
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
    # close tiny holes (< 60 ms) so syllables aren't chopped
    v = voiced.copy()
    i = 0
    while i < len(v):
        if not v[i]:
            j = i
            while j < len(v) and not v[j]:
                j += 1
            if 0 < i and j < len(v) and (j - i) < 6:
                v[i:j] = True
            i = j
        else:
            i += 1
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
    return len(a) / SR, len(out) / SR, float(m["input_i"])


out_dir = sys.argv[1]
os.makedirs(out_dir, exist_ok=True)
for n, src in enumerate(sys.argv[2:], 1):
    dst = os.path.join(out_dir, f"{n:02d}.wav")
    before, after, li = process(src, dst)
    print(f"{n:02d} {os.path.basename(src):30s} {before:5.2f}s -> {after:5.2f}s  (in {li:.1f} LUFS)")
