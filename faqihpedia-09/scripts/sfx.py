"""Synthesize the small sound effects used under the voice (no dependencies).

Usage: python3 scripts/sfx.py public/sfx
Writes pop.wav, whoosh.wav, thud.wav, ding.wav, tick.wav, zoom.wav and buzz.wav. They are kept
soft on purpose; loudness under the voice is set in src/sfx.tsx.
"""
import math
import os
import random
import struct
import sys
import wave

SR = 44100
random.seed(9)


def write(path, samples):
    peak = max(1e-9, max(abs(v) for v in samples))
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b''.join(struct.pack('<h', int(v / peak * 0.8 * 32767)) for v in samples))


def pop():
    """Short bubbly blip: a sine that drops in pitch."""
    n = int(0.12 * SR)
    out, ph = [], 0.0
    for i in range(n):
        t = i / SR
        ph += 2 * math.pi * (900 * math.exp(-t * 30) + 300) / SR
        out.append(math.sin(ph) * min(1, t / 0.002) * math.exp(-t * 35))
    return out


def whoosh():
    """Air swish: noise through a low-pass filter whose cutoff sweeps up and down."""
    n = int(0.45 * SR)
    out, y = [], 0.0
    for i in range(n):
        x = i / n
        a = 0.02 + 0.25 * math.sin(math.pi * x) ** 2  # filter amount
        y += a * (random.uniform(-1, 1) - y)
        out.append(y * math.sin(math.pi * x) ** 1.5)
    return out


def thud():
    """Rubber-stamp hit: low sine knock plus a little noise."""
    n = int(0.3 * SR)
    out, ph = [], 0.0
    for i in range(n):
        t = i / SR
        ph += 2 * math.pi * (140 * math.exp(-t * 12) + 55) / SR
        out.append((math.sin(ph) + 0.25 * random.uniform(-1, 1) * math.exp(-t * 60)) * math.exp(-t * 14))
    return out


def ding():
    """Soft two-note chime."""
    n = int(0.9 * SR)
    out = []
    for i in range(n):
        t = i / SR
        v = 0.0
        for f0, start in ((1046.5, 0.0), (1568.0, 0.09)):
            if t >= start:
                tt = t - start
                v += (math.sin(2 * math.pi * f0 * tt) + 0.3 * math.sin(4 * math.pi * f0 * tt)) * math.exp(-tt * 5)
        out.append(v * min(1, t / 0.003))
    return out


def tick():
    """Tiny click for the day counter."""
    n = int(0.04 * SR)
    return [math.sin(2 * math.pi * 2200 * i / SR) * math.exp(-i / SR * 120) for i in range(n)]


def zoom():
    """Punch-in swish for the camera zooms: noise that brightens, then a soft low knock."""
    n = int(0.32 * SR)
    out, y, ph = [], 0.0, 0.0
    for i in range(n):
        x = i / n
        t = i / SR
        y += (0.03 + 0.4 * x ** 2) * (random.uniform(-1, 1) - y)
        v = y * x ** 1.2 * (1 - x) ** 0.3 * 1.6
        if t > 0.22:
            tt = t - 0.22
            ph += 2 * math.pi * (110 * math.exp(-tt * 20) + 50) / SR
            v += 0.7 * math.sin(ph) * math.exp(-tt * 30)
        out.append(v)
    return out


def buzz():
    """Short low 'nope' buzz for the wrong spots on the scale."""
    n = int(0.28 * SR)
    out = []
    for i in range(n):
        t = i / SR
        sq = 1 if math.sin(2 * math.pi * 150 * t) > 0 else -1
        gate = 0 if 0.11 < t < 0.14 else 1
        out.append((0.6 * sq + 0.4 * math.sin(2 * math.pi * 300 * t)) * gate * min(1, t / 0.004) * math.exp(-t * 6))
    return out


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'public/sfx'
    os.makedirs(out, exist_ok=True)
    for name, fn in (('pop', pop), ('whoosh', whoosh), ('thud', thud), ('ding', ding), ('tick', tick), ('zoom', zoom), ('buzz', buzz)):
        write(os.path.join(out, f'{name}.wav'), fn())
        print('wrote', name)
