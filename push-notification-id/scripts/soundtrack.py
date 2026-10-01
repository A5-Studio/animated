"""Synthesize the soundtrack for the Indonesian push-notification Reel (no dependencies).

A bouncy beat plus sound effects placed on the scene cues in src/theme.ts / src/scenes.tsx.
Usage: python3 scripts/soundtrack.py public/soundtrack.wav
"""
import math
import random
import struct
import sys
import wave

SR = 44100
DUR = 67.0
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


def beat():
    """Playful 112 BPM groove: kick, off-beat hat, plucky bass."""
    bpm = 112
    spb = 60 / bpm
    out = [0.0] * N
    bass = [110.0, 110.0, 87.31, 98.0]  # A A F G, one per bar
    t = 0.0
    k = 0
    while t < DUR - 0.5:
        i0 = int(t * SR)
        # kick on every beat
        for i in range(int(0.18 * SR)):
            tt = i / SR
            f = 50 + 90 * math.exp(-tt / 0.03)
            if i0 + i < N:
                out[i0 + i] += math.sin(2 * math.pi * f * tt) * math.exp(-tt / 0.08) * 0.22
        # hat on the off-beat
        h0 = int((t + spb / 2) * SR)
        for i in range(int(0.04 * SR)):
            if h0 + i < N:
                out[h0 + i] += random.uniform(-1, 1) * math.exp(-i / SR / 0.01) * 0.05
        # bass pluck
        bf = bass[(k // 4) % 4]
        b0 = int((t + spb / 2) * SR)
        for i in range(int(0.25 * SR)):
            tt = i / SR
            if b0 + i < N:
                ph = 2 * math.pi * bf * tt
                out[b0 + i] += (math.sin(ph) + 0.3 * math.sin(2 * ph)) * math.exp(-tt / 0.12) * 0.12
        t += spb
        k += 1
    for i in range(N):
        tt = i / SR
        out[i] *= min(1.0, tt / 1.0) * min(1.0, (DUR - tt) / 1.5)
    return out


def boop(f0=300, f1=180):
    """'nope' buzzer for the red callout"""
    n = int(0.35 * SR)
    return [(1 if math.sin(2 * math.pi * (f0 + (f1 - f0) * i / n) * i / SR) > 0 else -1) * env(i, n, 0.003, 0.12) * 0.07 for i in range(n)]


FPS = 30
S = dict(hook=0, cast=150, step1=390, step2=690, step3=930, step4=1230, step5=1560, recap=1770)
fr = lambda scene, f: (S[scene] + f) / FPS

for i, v in enumerate(beat()):
    buf[i] += v
for name in list(S)[1:]:
    add(fr(name, -9), whoosh(0.5), 0.7)   # wipe between scenes

add(fr('hook', 22), ding())
add(fr('hook', 30), pop(700))
for i in range(3):
    add(fr('cast', 20 + i * 35), pop(520 + i * 120))
add(fr('step1', 40), whoosh(), 0.8)
add(fr('step1', 82), pop(600))
add(fr('step1', 95), pop(880))
add(fr('step1', 165), whoosh(), 0.8)
add(fr('step1', 200), pop(990))
add(fr('step2', 25), whoosh(), 0.8)
add(fr('step2', 70), pop(660))
add(fr('step2', 82), pop(990))
add(fr('step3', 15), pop(700))
add(fr('step3', 40), pop(560))
add(fr('step3', 124), whoosh(), 0.8)
add(fr('step3', 165), pop(880))
add(fr('step3', 178), boop())
add(fr('step4', 10), whoosh(), 0.7)
add(fr('step4', 40), pop(660))
add(fr('step4', 155), disconnect())
add(fr('step4', 172), pop(600))
add(fr('step4', 230), pop(880))
add(fr('step4', 245), whoosh(1.4), 0.9)
add(fr('step4', 290), pop(990))
add(fr('step5', 10), ding())
add(fr('step5', 95), pop(660))
add(fr('step5', 150), click())
for i in range(5):
    add(fr('recap', 12 + i * 14), pop(523.25 * 2 ** (i * 2 / 12)), 0.8)
add(fr('recap', 100), ding(), 0.6)

peak = max(abs(v) for v in buf) or 1.0
scale = 0.89 / peak
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack.wav', 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v * scale)) * 32767)) for v in buf))
