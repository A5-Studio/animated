"""Coach whistle (pea-whistle trill) for the Spreadsheet Gym opening: two short blasts.

usage: python3 scripts/whistle.py public/sfx/whistle.wav
"""
import sys, wave
import numpy as np

SR = 48000

def blast(dur):
    t = np.arange(int(dur * SR)) / SR
    trill = np.sin(2 * np.pi * 38 * t)  # the pea rattling inside the whistle
    f = 2750 + 90 * trill
    phase = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(phase) + 0.25 * np.sin(2 * phase) + 0.08 * np.sin(3 * phase)
    am = 0.75 + 0.25 * trill
    noise = np.random.default_rng(1).normal(0, 0.05, len(t))
    env = np.minimum(1, t / 0.015) * np.minimum(1, (dur - t) / 0.04)
    return (tone * am + noise) * env

sig = np.concatenate([blast(0.16), np.zeros(int(0.07 * SR)), blast(0.42)])
sig = 0.6 * sig / np.max(np.abs(sig))
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((sig * 32767).astype(np.int16).tobytes())
