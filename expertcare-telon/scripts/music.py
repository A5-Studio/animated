"""Soft, royalty-free background loop: plucked pentatonic melody over a warm pad.

Usage: python3 scripts/music.py public/music.wav [seconds]
Plucks use Karplus-Strong; everything is synthesized, so there is nothing to license.
"""
import math
import random
import struct
import sys
import wave

import numpy as np

SR = 44100
out = sys.argv[1]
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 24.0
BPM = 96
beat = 60 / BPM
random.seed(4)

n = int(dur * SR)
mix = np.zeros(n)


def pluck(freq, t0, length=1.6, amp=0.32):
    if t0 * SR >= n:
        return
    period = int(SR / freq)
    buf = np.random.uniform(-1, 1, period)
    m = int(length * SR)
    y = np.zeros(m)
    for i in range(m):
        y[i] = buf[i % period]
        buf[i % period] = 0.5 * (buf[i % period] + buf[(i + 1) % period]) * 0.996
    s = int(t0 * SR)
    e = min(n, s + m)
    mix[s:e] += amp * y[: e - s]


def pad(freqs, t0, length, amp=0.05):
    if t0 * SR >= n:
        return
    t = np.arange(int(length * SR)) / SR
    env = np.minimum(1, t / 0.6) * np.minimum(1, (length - t) / 0.8)
    y = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.003 * t) for f in freqs)
    s = int(t0 * SR)
    e = min(n, s + len(y))
    mix[s:e] += amp * (y * env)[: e - s]


note = lambda m: 440 * 2 ** ((m - 69) / 12)
# C major pentatonic, gentle I-vi-IV-V
chords = [[48, 55, 64], [45, 52, 60], [41, 48, 57], [43, 50, 59]]
scale = [72, 74, 76, 79, 81, 84]
bar = 4 * beat
t = 0.0
i = 0
while t < dur:
    ch = chords[i % 4]
    pad([note(m) for m in ch], t, bar + 0.3)
    pluck(note(ch[0]), t, 2.0, 0.22)
    for k in range(8):  # eighth-note melody, a few rests
        if random.random() < 0.72:
            pluck(note(random.choice(scale)), t + k * beat / 2, 1.2, 0.18 + 0.06 * random.random())
    t += bar
    i += 1

# fade in/out, normalize
fade = int(1.5 * SR)
mix[:fade] *= np.linspace(0, 1, fade)
mix[-fade:] *= np.linspace(1, 0, fade)
mix = mix / (np.abs(mix).max() + 1e-9) * 0.8
with wave.open(out, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<h', int(v * 32767)) for v in mix))
print('wrote', out, f'{dur:.1f}s')
