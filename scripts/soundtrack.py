"""Synthesize the soundtrack for the push-notification Reel (no dependencies).

A soft ambient pad plus sound effects placed on the animation's cue times.
Usage: python3 scripts/soundtrack.py push-notification-android/soundtrack.wav
"""
import math
import random
import struct
import sys
import wave

SR = 44100
DUR = 60.0
N = int(SR * DUR)
buf = [0.0] * N
random.seed(7)


def add(start, samples, gain=1.0):
    i0 = int(start * SR)
    for i, v in enumerate(samples):
        j = i0 + i
        if 0 <= j < N:
            buf[j] += v * gain


def env(i, n, attack=0.005, release=None):
    t = i / SR
    a = min(1.0, t / attack) if attack > 0 else 1.0
    r = 1.0 if release is None else math.exp(-t / release)
    return a * r


def ding():
    """Two-note notification chime."""
    out = []
    n = int(1.4 * SR)
    for i in range(n):
        t = i / SR
        v = 0.0
        for f, delay in ((1318.5, 0.0), (1760.0, 0.12)):
            if t >= delay:
                td = t - delay
                e = math.exp(-td / 0.35) * min(1.0, td / 0.004)
                v += e * (math.sin(2 * math.pi * f * td) + 0.3 * math.sin(2 * math.pi * 2 * f * td))
        out.append(v * 0.35)
    return out


def pop(freq=660):
    n = int(0.18 * SR)
    out = []
    for i in range(n):
        t = i / SR
        f = freq * (1 + 0.6 * math.exp(-t / 0.02))
        out.append(math.sin(2 * math.pi * f * t) * env(i, n, 0.002, 0.05) * 0.4)
    return out


def click():
    n = int(0.06 * SR)
    return [math.sin(2 * math.pi * 2200 * i / SR) * env(i, n, 0.001, 0.012) * 0.35 for i in range(n)]


def whoosh(length=1.1):
    """Band-limited noise with a rising-then-falling envelope."""
    n = int(length * SR)
    out, lp, lp2 = [], 0.0, 0.0
    for i in range(n):
        p = i / n
        cutoff = 0.02 + 0.18 * math.sin(math.pi * p)
        x = random.uniform(-1, 1)
        lp += cutoff * (x - lp)
        lp2 += cutoff * (lp - lp2)
        out.append(lp2 * math.sin(math.pi * p) ** 2 * 0.9)
    return out


def disconnect():
    n = int(0.45 * SR)
    out = []
    for i in range(n):
        t = i / SR
        f = 420 - 260 * (t / 0.45)
        out.append((1 if math.sin(2 * math.pi * f * t) > 0 else -1) * env(i, n, 0.003, 0.15) * 0.08)
    return out


def pad():
    """Slow chord progression, one chord every 4 seconds with crossfades."""
    chords = [
        (220.00, 261.63, 329.63),  # Am
        (174.61, 220.00, 261.63),  # F
        (196.00, 246.94, 293.66),  # G
        (164.81, 207.65, 246.94),  # E
    ]
    seg = 4.0
    out = [0.0] * N
    phases = [0.0] * 6
    for i in range(N):
        t = i / SR
        k = int(t // seg)
        local = (t % seg) / seg
        cur, nxt = chords[k % 4], chords[(k + 1) % 4]
        xf = max(0.0, (local - 0.85) / 0.15)  # crossfade over the last 15%
        v = 0.0
        for c, (a, b) in enumerate(zip(cur, nxt)):
            f = a + (b - a) * xf
            for d, det in enumerate((0.997, 1.003)):
                idx = c * 2 + d
                phases[idx] += 2 * math.pi * f * det / SR
                v += math.sin(phases[idx]) + 0.25 * math.sin(2 * phases[idx])
        lfo = 0.75 + 0.25 * math.sin(2 * math.pi * 0.15 * t)
        fade = min(1.0, t / 1.5) * min(1.0, (DUR - t) / 1.5)
        out[i] = v * 0.018 * lfo * fade
    return out


# --- cue sheet (matches the timeline in push-notification-android/index.html) ---
for i, v in enumerate(pad()):
    buf[i] += v

for t in (1.15, 42.65):
    add(t, ding())
for t in (7.1, 8.9, 15.0, 22.6, 27.7, 38.9):
    add(t, whoosh(), 0.8)
for t, f in ((6.0, 520), (10.3, 880), (14.0, 520), (17.3, 780), (21.6, 660), (29.2, 990),
             (36.5, 600), (40.2, 880), (41.8, 700), (42.8, 740), (46.0, 740), (46.8, 880), (48.4, 740)):
    add(t, pop(f))
add(35.6, disconnect())
add(38.5, pop(990))
add(49.6, click())
for i in range(6):
    add(51.85 + i * 0.62, pop(523.25 * 2 ** (i * 2 / 12)), 0.8)

peak = max(abs(v) for v in buf) or 1.0
scale = 0.89 / peak
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack.wav', 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v * scale)) * 32767)) for v in buf))
