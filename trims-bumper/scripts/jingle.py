"""Synthesize the 3-second TRIMS opening jingle (needs numpy).

Usage: python3 scripts/jingle.py public/jingle.wav

Cue times match the animation in src/Bumper.tsx (60 fps):
  0.00  whoosh in            plate slams in (thud + kick)  0.13
  0.33-0.87  T R I M S       one rising marimba note per letter + clap
  1.10  "?" pops             cartoon boing
  1.27  ribbon slides in     short swish
  1.43  fork + spoon         metal clink
  1.73  @faqihpedia stamp    kick + snare + "ta-da" chord, confetti sparkles
  2.33  letters hop again    little marimba run + clap
  2.67  iris close           whoosh out
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 3.0
FPS = 60
rng = np.random.default_rng(14)
N = int(DUR * SR)
L = np.zeros(N)
R = np.zeros(N)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def add(sig, at, gain=1.0, pan=0.0):
    """Mix a mono signal in at `at` seconds. pan: -1 left .. 1 right."""
    i = int(at * SR)
    sig = sig[: max(0, N - i)]
    lg, rg = np.sqrt((1 - pan) / 2) * 1.414, np.sqrt((1 + pan) / 2) * 1.414
    L[i : i + len(sig)] += sig * gain * lg
    R[i : i + len(sig)] += sig * gain * rg


def env(t, a=0.002, d=8.0):
    return np.minimum(1, t / a) * np.exp(-t * d)


def lowpass(x, k):
    """One-pole low-pass; k can be an array (0..1, higher = brighter)."""
    y = np.zeros_like(x)
    k = np.broadcast_to(k, x.shape)
    acc = 0.0
    for i in range(len(x)):
        acc += k[i] * (x[i] - acc)
        y[i] = acc
    return y


def whoosh(sec, up=True):
    t = t_(sec)
    x = t / sec
    shape = x if up else 1 - x
    k = 0.02 + 0.5 * shape**2
    n = lowpass(rng.uniform(-1, 1, len(t)), k)
    return n * np.sin(np.pi * x) ** 1.2


def kick():
    t = t_(0.35)
    f = 50 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.001, 9)


def thud():
    t = t_(0.3)
    f = 55 + 140 * np.exp(-t * 12)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return (body + 0.3 * rng.uniform(-1, 1, len(t)) * np.exp(-t * 60)) * np.exp(-t * 14)


def clap():
    t = t_(0.12)
    n = rng.uniform(-1, 1, len(t))
    n = n - lowpass(n, 0.15)  # high-pass-ish
    bursts = sum(np.exp(-np.maximum(0, t - o) * 90) * (t >= o) for o in (0, 0.008, 0.016))
    return n * bursts * 0.5


def snare():
    t = t_(0.25)
    n = rng.uniform(-1, 1, len(t))
    n = n - lowpass(n, 0.2)
    tone = np.sin(2 * np.pi * 190 * t)
    return (n * 0.8 + tone * 0.5) * env(t, 0.001, 16)


def marimba(freq):
    t = t_(0.45)
    v = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 4 * t) * np.exp(-t * 40)
    return v * env(t, 0.001, 9)


def boing():
    t = t_(0.4)
    f = 330 + 260 * np.sin(2 * np.pi * 14 * t) * np.exp(-t * 6) + 200 * np.exp(-t * 10)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(t, 0.003, 7)


def clink():
    t = t_(0.6)
    parts = [(2637, 1.0, 9), (3951, 0.6, 12), (5274, 0.4, 16), (6912, 0.25, 22)]
    return sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in parts) * np.minimum(1, t / 0.0005)


def brass(freq, sec):
    """Bright saw-ish stab: a few harmonics, slight vibrato, quick attack."""
    t = t_(sec)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.3)
    ph = 2 * np.pi * np.cumsum(freq * vib) / SR
    v = sum(np.sin(h * ph) / h for h in range(1, 9))
    a = np.minimum(1, t / 0.015)
    rel = np.clip((sec - t) / 0.25, 0, 1)
    return v * a * (0.55 + 0.45 * np.exp(-t * 6)) * rel


def sparkle():
    t = t_(0.18)
    f = rng.uniform(3000, 6500)
    return np.sin(2 * np.pi * f * t) * env(t, 0.001, 30)


C4, C5, D5, E5, G5, A5, C6 = 261.63, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5

# --- intro ---------------------------------------------------------------
add(whoosh(0.16, up=True), 0.0, 0.35)
add(kick(), 8 / FPS, 0.9)
add(thud(), 8 / FPS, 0.6)

# --- T R I M S: rising pentatonic, panned left -> right ---------------------
letter_times = [n / FPS for n in (20, 28, 36, 44, 52)]
for i, (tt, f) in enumerate(zip(letter_times, (C5, D5, E5, G5, A5))):
    pan = -0.6 + 0.3 * i
    add(marimba(f), tt, 0.45, pan)
    add(marimba(f * 2), tt, 0.12, pan)
    add(clap(), tt, 0.35, pan)
add(kick(), letter_times[2], 0.5)
add(kick(), letter_times[4], 0.5)

# --- "?" boing, ribbon swish, cutlery clink ---------------------------------
add(boing(), 66 / FPS, 0.4, 0.4)
add(whoosh(0.18, up=True), 76 / FPS, 0.25, -0.3)
add(clink(), 86 / FPS, 0.22, -0.4)
add(clink(), 89 / FPS, 0.18, 0.4)

# --- @faqihpedia stamp + ta-da ---------------------------------------------
STAMP = 104 / FPS
add(kick(), STAMP, 1.0)
add(snare(), STAMP, 0.55)
add(thud(), STAMP, 0.4)
# short pickup "ta-" then held "DAA"
for f, g in ((C4, 0.25), (C5, 0.22), (E5, 0.18), (G5, 0.16), (C6, 0.1)):
    add(brass(f, 0.11), STAMP - 0.13, g * 0.8)
    add(brass(f, 0.75), STAMP, g)
add(marimba(C6), STAMP, 0.3)
add(marimba(C6 * 1.5), STAMP + 0.06, 0.2)
for k in range(14):
    add(sparkle(), STAMP + 0.04 + k * 0.04 + rng.uniform(0, 0.02), 0.1, rng.uniform(-0.9, 0.9))

# --- second hop while the logo holds ---------------------------------------
HOP = 140 / FPS
for k, f in enumerate((G5, A5, C6)):
    add(marimba(f), HOP + k * 0.06, 0.35, -0.5 + 0.5 * k)
add(clap(), HOP, 0.35)
add(kick(), HOP, 0.6)
add(sparkle(), HOP + 0.15, 0.1, 0.5)

# --- out --------------------------------------------------------------------
add(whoosh(0.25, up=False), 160 / FPS, 0.3)
add(kick(), 172 / FPS, 0.5)

# --- master: gentle soft-clip, normalize, tail fade -----------------------
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.2)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89
fade = np.ones(N)
fade[-int(0.03 * SR):] = np.linspace(1, 0, int(0.03 * SR))
mix *= fade[:, None]

out = sys.argv[1] if len(sys.argv) > 1 else 'public/jingle.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out)
