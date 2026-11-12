"""Soft music-box lullaby for the background (synthesised, no samples).

    python3 scripts/music.py public/music.wav [seconds]
"""
import sys
import wave

import numpy as np

SR = 44100
out = sys.argv[1]
length = float(sys.argv[2]) if len(sys.argv) > 2 else 115.0
BPM = 84
beat = 60 / BPM
rng = np.random.default_rng(3)


def hz(n):  # MIDI note -> Hz
    return 440 * 2 ** ((n - 69) / 12)


def bell(f, dur, amp):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 3.2) * (1 - np.exp(-t * 400))
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 6) + 0.12 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 9)
    return amp * env * x


def pad(fs, dur, amp):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 0.8)
    return amp * env * sum(np.sin(2 * np.pi * f * t) * 0.5 + 0.5 * np.sin(2 * np.pi * f * 1.003 * t) for f in fs) / len(fs)


# I - vi - IV - V in C major, two bars each chord (4/4)
CHORDS = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
# gentle 8-bar melody over the progression (one note per beat, None = rest)
MEL = [76, 79, 77, 76, 74, None, 72, None, 72, 76, 74, 72, 69, None, None, None,
       69, 72, 71, 69, 65, None, 69, None, 67, 71, 74, 72, 71, None, 67, None]
bar = 4 * beat
n = int(SR * (length + 3))
mix = np.zeros(n)
t0, i = 0.0, 0
while t0 < length:
    ch = CHORDS[(i // 2) % 4]
    s = int(t0 * SR)
    p = pad([hz(m - 12) for m in ch], bar, 0.05)
    mix[s:s + len(p)] += p[: n - s]
    for k in range(4):  # soft broken-chord bells underneath
        note = ch[[0, 1, 2, 1][k]]
        b = bell(hz(note), 2.0, 0.07)
        st = int((t0 + k * beat) * SR)
        mix[st:st + len(b)] += b[: n - st]
    for k in range(4):
        m = MEL[(i % 8) * 4 + k]
        if m is None:
            continue
        b = bell(hz(m), 2.5, 0.16 * (0.9 + 0.2 * rng.random()))
        st = int((t0 + k * beat + rng.uniform(0, 0.012)) * SR)
        mix[st:st + len(b)] += b[: n - st]
    t0 += bar
    i += 1

# simple room: a few soft echoes
rev = mix.copy()
for d, g in [(0.11, 0.25), (0.23, 0.16), (0.37, 0.1)]:
    k = int(d * SR)
    rev[k:] += g * mix[:-k]
mix = rev[: int(SR * length)]
fade = int(SR * 3)
mix[:int(SR * 0.5)] *= np.linspace(0, 1, int(SR * 0.5))
mix[-fade:] *= np.linspace(1, 0, fade)
mix /= np.abs(mix).max() / 0.8
data = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print(out, f'{length:.1f}s')
