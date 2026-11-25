"""Synthesize the quiet music bed (original, no samples).

Light, curious lo-fi loop: 85 BPM, Fmaj7 - Em7 - Dm7 - Cmaj7, soft keys
arpeggio over a warm pad, a muffled kick and a quiet shaker. It sits far
under the voice; the level is set in src/Video.tsx.

Usage: python3 scripts/music.py public/music.wav [seconds]
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 85
BEAT = 60 / BPM
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 114.0
N = int(SR * DUR)
rng = np.random.default_rng(23)

def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

CHORDS = [  # midi notes, one chord per bar
    [53, 57, 60, 64],  # Fmaj7
    [52, 55, 59, 62],  # Em7
    [50, 53, 57, 60],  # Dm7
    [48, 52, 55, 59],  # Cmaj7
]
BAR = 4 * BEAT
L = np.zeros(N)
R = np.zeros(N)

def add(buf, start, sig):
    a = int(start * SR)
    if a >= N:
        return
    b = min(N, a + len(sig))
    buf[a:b] += sig[: b - a]

def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y

# pad: soft detuned sines, slow swell per bar
t_bar = np.arange(int(BAR * SR)) / SR
env_bar = np.minimum(1, t_bar / 0.6) * np.minimum(1, (BAR - t_bar) / 0.5)
bars = int(DUR / BAR) + 1
for b in range(bars):
    notes = CHORDS[b % 4]
    sig = np.zeros_like(t_bar)
    for m in notes:
        f = hz(m)
        sig += np.sin(2 * np.pi * f * t_bar) + 0.6 * np.sin(2 * np.pi * f * 1.003 * t_bar + 1.0)
    sig *= env_bar * 0.05
    add(L, b * BAR, sig)
    add(R, b * BAR, sig * 0.9)

# keys: plucked arpeggio on 8th notes (sine + a bit of 2nd harmonic, fast decay)
pluck_t = np.arange(int(0.9 * SR)) / SR
pattern = [0, 2, 1, 3, 2, 1, 3, 2]
for b in range(bars):
    notes = CHORDS[b % 4]
    for k, idx in enumerate(pattern):
        m = notes[idx] + 12
        f = hz(m)
        sig = (np.sin(2 * np.pi * f * pluck_t) + 0.25 * np.sin(4 * np.pi * f * pluck_t)) * np.exp(-pluck_t * 5.5)
        sig *= np.minimum(1, pluck_t / 0.004) * (0.11 if k % 2 == 0 else 0.07)
        pan = 0.35 if k % 2 else -0.35
        start = b * BAR + k * BEAT / 2
        add(L, start, sig * (1 - pan))
        add(R, start, sig * (1 + pan))

# kick on beats 1 and 3, shaker on off-beats
kt = np.arange(int(0.35 * SR)) / SR
kick = np.sin(2 * np.pi * (45 + 70 * np.exp(-kt * 30)) * kt) * np.exp(-kt * 9) * 0.35
st = np.arange(int(0.08 * SR)) / SR
for b in range(bars):
    for beat in range(4):
        t0 = b * BAR + beat * BEAT
        if beat in (0, 2):
            add(L, t0, kick)
            add(R, t0, kick)
        shaker = rng.uniform(-1, 1, len(st)) * np.exp(-st * 60) * 0.035
        add(L, t0 + BEAT / 2, shaker * 0.8)
        add(R, t0 + BEAT / 2, shaker)

# warm it up: gentle low-pass, then fade in/out
L = lowpass(L, 3200)
R = lowpass(R, 3200)
fade = np.ones(N)
fi, fo = int(1.5 * SR), int(3.0 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fade[-fo:] = np.linspace(1, 0, fo)
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
st = np.stack([L, R], axis=1) / peak * 0.89
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('wrote', sys.argv[1], f'{DUR:.1f}s')
