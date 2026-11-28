"""Trim what's left after the last spoken word of each cleaned clip, in place.

usage: python3 scripts/trim_tails.py clean/01.wav clean/02.wav ...

clean_vo.py cuts silence by level, so a breath or a quiet room sound after the
last word can survive it. This uses faster-whisper word timestamps instead:
anything more than KEEP seconds after the last word's end is cut (with a short
fade). Heads are left alone, since whisper start times run late.
"""
import sys, wave
import numpy as np
from faster_whisper import WhisperModel

KEEP = 0.2
model = WhisperModel("medium", device="cpu", compute_type="int8")
for path in sys.argv[1:]:
    w = wave.open(path)
    sr = w.getframerate()
    a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    w.close()
    a16 = np.interp(np.arange(0, len(a), sr / 16000), np.arange(len(a)), a).astype(np.float32)
    segs, _ = model.transcribe(a16, language="id", word_timestamps=True, beam_size=5)
    words = [wd for s in segs for wd in s.words]
    if not words:
        continue
    end = min(len(a), int((words[-1].end + KEEP) * sr))
    cut = (len(a) - end) / sr
    if cut > 0.05:
        a = a[:end].copy()
        f = int(0.04 * sr)
        a[-f:] *= np.linspace(1, 0, f)
        with wave.open(path, "wb") as o:
            o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr)
            o.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())
    print(f"{path.split('/')[-1]}: cut {cut:.2f}s after '{words[-1].word.strip()}'", flush=True)
