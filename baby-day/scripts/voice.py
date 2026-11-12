"""Generate Migu's voice lines with VoiceStudio's OmniVoice engine.

Usage (inside a venv with VoiceStudio's `omnivoice` package installed):
    python scripts/voice.py <model dir or k2-fsa/OmniVoice> [--instruct "..."] [--only id id]

1. Without --ref, a cute child voice is designed from --instruct and saved as
   public/vo/_ref.wav, so every line is then cloned from the same voice.
2. Each shot's `vo` line in src/theme.ts (or its TTS_FIX spelling below) is
   spoken and written to public/vo/<id>.wav.
3. Clip lengths go to src/vo.json; theme.ts stretches each shot to fit.
"""
import argparse
import json
import pathlib
import re

import numpy as np
import soundfile as sf
import torch
from omnivoice import OmniVoice



def to_np(a):
    """OmniVoice returns tensors or arrays depending on version."""
    return (a.squeeze().float().cpu().numpy() if hasattr(a, 'cpu') else np.asarray(a).squeeze()).astype(np.float32)


def save_audio(path, a, sr):
    sf.write(str(path), to_np(a), sr)


ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'vo'

# Lines come straight from src/theme.ts so subtitles and voice never drift apart.
LINES = dict(re.findall(r"id: '([^']+)', vo: '([^']+)'", (ROOT / 'src' / 'theme.ts').read_text()))
# Spellings that help the model say a word the Indonesian way.
TTS_FIX = {
    'tummy': 'Tami taim sama Baba. Lihat, aku kuat angkat kepala!',
    'teether': 'Titer? Aku gigit!',
    'beras': 'Aku udah mulai main sensori pakai beras loh!',
}
TTS_TEXT = {k: TTS_FIX.get(k, v) for k, v in LINES.items()}
GAP = 0.2  # seconds of silence between the parts of a split line

def pitch_track(x, sr):
    """Per-40ms autocorrelation pitch in Hz (NaN where unvoiced)."""
    n = int(sr * 0.04)
    out = []
    for i in range(0, len(x) - n, n):
        fr = x[i:i + n] - x[i:i + n].mean()
        if np.sqrt((fr ** 2).mean()) < 0.02:
            out.append(np.nan)
            continue
        ac = np.correlate(fr, fr, 'full')[n - 1:]
        lo, hi = int(sr / 400), int(sr / 70)
        k = lo + int(np.argmax(ac[lo:hi]))
        out.append(sr / k if ac[k] > 0.3 * ac[0] else np.nan)
    return np.array(out)


def drift(x, sr, ref_hz):
    """Worst distance (in octaves) of any half-second's pitch from the reference voice."""
    f = pitch_track(x, sr)
    w = 12
    meds = [np.nanmedian(f[i:i + w]) for i in range(0, len(f), w) if np.isfinite(f[i:i + w]).sum() > 3]
    return max((abs(np.log2(m / ref_hz)) for m in meds), default=9.0)


# Voice B, chosen by the family: designed with 'female, child, high pitch', seed 3.
REF_TEXT = 'Halo semua, aku Migu! Ini cerita kegiatan sehari-hariku. Hehe, lucu kan?'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('model')
    ap.add_argument('--instruct', default='female, child, high pitch')
    ap.add_argument('--ref')
    ap.add_argument('--ref-text')
    ap.add_argument('--only', nargs='*', help='regenerate just these beats')
    ap.add_argument('--steps', type=int, default=32)
    ap.add_argument('--tries', type=int, default=4, help='takes per part; the one closest to the reference pitch wins')
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    torch.manual_seed(1)
    model = OmniVoice.from_pretrained(args.model, device_map='cpu', dtype=torch.float32)
    sr = model.sampling_rate

    ref, ref_text = args.ref, args.ref_text
    if not ref:
        ref, ref_text = str(OUT / '_ref.wav'), REF_TEXT
        if not pathlib.Path(ref).exists():
            audio = model.generate(text=REF_TEXT, language='id', instruct=args.instruct, num_step=args.steps)
            save_audio(ref, audio[0], sr)
            print('designed voice ->', ref, flush=True)

    rx, rsr = sf.read(ref)
    ref_hz = float(np.nanmedian(pitch_track(rx if rx.ndim == 1 else rx.mean(1), rsr)))
    print(f'reference pitch {ref_hz:.0f} Hz', flush=True)

    def take(text):
        best = None
        for seed in range(args.tries):
            torch.manual_seed(seed)
            a = model.generate(text=text, language='id', ref_audio=ref, ref_text=ref_text, num_step=args.steps)[0]
            x = to_np(a)
            d = drift(x, sr, ref_hz)
            print(f'  take {seed}: drift {d:.2f} oct', flush=True)
            if best is None or d < best[0]:
                best = (d, x)
            if d < 0.25:
                break
        return best[1]

    durs_path = ROOT / 'src' / 'vo.json'
    durs = json.loads(durs_path.read_text()) if durs_path.exists() else {}
    for beat, text in TTS_TEXT.items():
        if args.only and beat not in args.only:
            continue
        parts = text if isinstance(text, list) else [text]
        gap = np.zeros(int(sr * GAP), dtype=np.float32)
        x = np.concatenate([np.concatenate([take(p), gap]) for p in parts])[: -len(gap) or None]
        sf.write(str(OUT / f'{beat}.wav'), x, sr)
        durs[beat] = round(len(x) / sr, 2)
        durs_path.write_text(json.dumps(durs, indent=2) + '\n')
        print(f'{beat}: {durs[beat]}s', flush=True)


if __name__ == '__main__':
    main()
