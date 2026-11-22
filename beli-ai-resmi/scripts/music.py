"""Minimal music bed: soft kick, offbeat hat and a low pulse, 100 bpm (numpy).

Usage: python3 scripts/music.py public/music.wav [seconds]
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 53.0
N = int(SR * DUR)
beat = 60 / 100
out = np.zeros(N)
rng = np.random.default_rng(5)


def place(t, x, g):
    i = int(t * SR)
    j = min(N, i + len(x))
    if i < N:
        out[i:j] += x[: j - i] * g


tk = np.arange(int(0.35 * SR)) / SR
kick = np.sin(2 * np.pi * np.cumsum(50 + 90 * np.exp(-tk * 30)) / SR) * np.exp(-tk * 9)
th = np.arange(int(0.06 * SR)) / SR
hat = np.diff(rng.standard_normal(len(th) + 1)) * np.exp(-th * 70)
tb = np.arange(int(beat * 2 * SR)) / SR
bass_notes = [55.0, 55.0, 43.65, 49.0]  # A1 A1 F1 G1

bar = 0
t = 0.0
while t < DUR:
    for b in range(4):
        tb0 = t + b * beat
        place(tb0, kick, 0.9 if b % 2 == 0 else 0.6)
        place(tb0 + beat / 2, hat, 0.12)
    f0 = bass_notes[bar % 4]
    bass = np.sin(2 * np.pi * f0 * tb) * np.minimum(1, tb / 0.02) * np.exp(-tb * 1.2)
    place(t, bass, 0.35)
    place(t + 2 * beat, bass, 0.3)
    t += 4 * beat
    bar += 1

fade = np.minimum(1, np.minimum(np.arange(N) / (SR * 0.8), (N - np.arange(N)) / (SR * 2.0)))
out *= fade
out = out / np.max(np.abs(out)) * 0.8
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
