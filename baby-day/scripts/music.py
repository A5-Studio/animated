"""Cheerful, bouncy background track (synthesised, no samples).

Ukulele-like plucks on the off-beats, a glockenspiel melody, a soft
bass and a light shaker/clap groove, in a bright major key.

    python3 scripts/music.py public/music.wav [seconds]
"""
import sys
import wave

import numpy as np

SR = 44100
out = sys.argv[1]
length = float(sys.argv[2]) if len(sys.argv) > 2 else 115.0
BPM = 118
beat = 60 / BPM
rng = np.random.default_rng(5)


def hz(n):  # MIDI note -> Hz
    return 440 * 2 ** ((n - 69) / 12)


def env(n, attack, decay):
    t = np.arange(n) / SR
    return (1 - np.exp(-t / attack)) * np.exp(-t * decay)


def pluck(f, dur, amp):
    """Karplus-Strong string: a warm ukulele-ish pluck."""
    n = int(SR * dur)
    p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p)
    y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]
        buf[i % p] = 0.996 * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return amp * y * env(n, 0.002, 2.5)


def glock(f, dur, amp):
    t = np.arange(int(SR * dur)) / SR
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 8) + 0.15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 14)
    return amp * x * env(len(t), 0.001, 3.5)


def bass(f, dur, amp):
    t = np.arange(int(SR * dur)) / SR
    return amp * (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)) * env(len(t), 0.005, 4)


def noise_hit(dur, amp, bright):
    n = int(SR * dur)
    x = rng.uniform(-1, 1, n)
    if bright:  # crude high-pass for the shaker
        x = np.diff(np.concatenate([[0], x]))
    return amp * x * env(n, 0.001, 40 if bright else 18)


# I - V - vi - IV in F major, one bar each
CHORDS = [[65, 69, 72], [60, 64, 67], [62, 65, 69], [58, 62, 65]]
ROOTS = [41, 36, 38, 34]
# bouncy 4-bar melody in eighth notes (None = rest), loops every 4 bars, varied on repeats
MEL = [
    [77, None, 81, 79, 77, None, 72, None],
    [76, None, 79, 77, 76, 74, 72, None],
    [74, None, 77, 76, 74, None, 81, None],
    [79, 77, 76, None, 77, None, None, None],
]
bar = 4 * beat
eighth = beat / 2
n = int(SR * (length + 3))
mix = np.zeros(n)


def add(x, t):
    s = int(t * SR)
    if s >= n:
        return
    mix[s:s + len(x)] += x[: n - s]


t0, i = 0.0, 0
pluck_cache, glock_cache = {}, {}
while t0 < length:
    ch, root = CHORDS[i % 4], ROOTS[i % 4]
    add(bass(hz(root), beat * 0.9, 0.22), t0)
    add(bass(hz(root + 7), beat * 0.9, 0.16), t0 + 2 * beat)
    for k in range(8):  # strummed plucks on the off-beats
        if k % 2 == 1:
            for j, m in enumerate(ch):
                key = m
                if key not in pluck_cache:
                    pluck_cache[key] = pluck(hz(m), 0.6, 0.12)
                add(pluck_cache[key], t0 + k * eighth + j * 0.012)
        add(noise_hit(0.06, 0.035, True), t0 + k * eighth + 0.003)  # shaker
    for k in (1, 3):  # soft claps on 2 and 4
        add(noise_hit(0.12, 0.06, False), t0 + k * beat)
    if i >= 2:  # melody enters after a two-bar intro
        row = MEL[i % 4]
        for k, m in enumerate(row):
            if m is None:
                continue
            if i % 8 >= 4 and k == 0:
                m += 12 if m < 80 else 0  # little lift on the repeat
            if m not in glock_cache:
                glock_cache[m] = glock(hz(m), 1.2, 0.2)
            add(glock_cache[m], t0 + k * eighth + rng.uniform(0, 0.006))
    t0 += bar
    i += 1

rev = mix.copy()
for d, g in [(0.09, 0.18), (0.19, 0.1)]:
    k = int(d * SR)
    rev[k:] += g * mix[:-k]
mix = rev[: int(SR * length)]
mix[: int(SR * 0.3)] *= np.linspace(0, 1, int(SR * 0.3))
fade = int(SR * 3)
mix[-fade:] *= np.linspace(1, 0, fade)
mix /= np.abs(mix).max() / 0.8
data = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print(out, f'{length:.1f}s')
