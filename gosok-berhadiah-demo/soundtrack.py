"""Synthesize the soundtrack for the Gosok Berhadiah demo video (no dependencies).

A light, upbeat pad + pluck bed, plus sound effects placed on the cue times that
record.mjs logs to cues.json (clicks, scratch, reveals, draw roll, card whooshes).
Usage: python3 gosok-berhadiah-demo/soundtrack.py cues.json soundtrack.wav
"""
import json
import math
import random
import struct
import sys
import wave

SR = 44100
spec = json.load(open(sys.argv[1]))
DUR = spec["duration"] + 0.5
N = int(SR * DUR)
buf = [0.0] * N
random.seed(11)


def add(start, samples, gain=1.0):
    i0 = int(start * SR)
    for i, v in enumerate(samples):
        j = i0 + i
        if 0 <= j < N:
            buf[j] += v * gain


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# ── Music bed: I–V–vi–IV in C at 104 bpm ─────────────────────────────────
BPM = 104
BEAT = 60 / BPM
BAR = 4 * BEAT
CHORDS = [[48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 57, 60, 65]]
ARP = [0, 2, 3, 2, 1, 2, 3, 2]


def pad(chord, length):
    n = int(length * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = min(1.0, t / 0.4) * min(1.0, (length - t) / 0.5)
        v = 0.0
        for k, m in enumerate(chord):
            f = hz(m)
            v += math.sin(2 * math.pi * f * t + k) + 0.25 * math.sin(2 * math.pi * f * 1.003 * t)
        out.append(v * e * 0.035)
    return out


def pluck(midi, length=0.32):
    n = int(length * SR)
    f = hz(midi)
    return [(math.sin(2 * math.pi * f * i / SR) + 0.4 * math.sin(4 * math.pi * f * i / SR))
            * math.exp(-i / SR / 0.09) * min(1.0, i / SR / 0.003) * 0.08 for i in range(n)]


def kick():
    n = int(0.25 * SR)
    out, ph = [], 0.0
    for i in range(n):
        t = i / SR
        ph += 2 * math.pi * (50 + 90 * math.exp(-t / 0.03)) / SR
        out.append(math.sin(ph) * math.exp(-t / 0.08) * 0.22)
    return out


def hat():
    n = int(0.05 * SR)
    out, prev = [], 0.0
    for i in range(n):
        x = random.uniform(-1, 1)
        out.append((x - prev) * math.exp(-i / SR / 0.012) * 0.05)
        prev = x
    return out


bar = 0
t = 0.0
KICK, HAT = kick(), hat()
while t < DUR:
    ch = CHORDS[bar % 4]
    add(t, pad(ch, BAR + 0.3))
    for s in range(8):
        add(t + s * BEAT / 2, pluck(ch[ARP[s]] + 12))
        add(t + s * BEAT / 2 + BEAT / 4, HAT, 0.8 if s % 2 else 0.5)
    if bar >= 1:
        for b in range(4):
            add(t + b * BEAT, KICK)
    t += BAR
    bar += 1

# ── Sound effects ────────────────────────────────────────────────────────


def click():
    n = int(0.05 * SR)
    return [math.sin(2 * math.pi * 2400 * i / SR) * math.exp(-i / SR / 0.01) * 0.35 for i in range(n)]


def scratch(length=1.8):
    n = int(length * SR)
    out, lp = [], 0.0
    for i in range(n):
        p = i / n
        lp += 0.35 * (random.uniform(-1, 1) - lp)
        am = 0.55 + 0.45 * math.sin(2 * math.pi * 7 * p * length)
        out.append(lp * am * math.sin(math.pi * p) ** 0.5 * 0.35)
    return out


def chime():
    out = [0.0] * int(1.8 * SR)
    for k, m in enumerate([72, 76, 79, 84]):
        d = int(k * 0.08 * SR)
        f = hz(m)
        for i in range(len(out) - d):
            tt = i / SR
            out[d + i] += (math.sin(2 * math.pi * f * tt) + 0.3 * math.sin(2 * math.pi * 2 * f * tt)) \
                * math.exp(-tt / 0.45) * min(1.0, tt / 0.004) * 0.22
    return out


def whoosh(length=1.0):
    n = int(length * SR)
    out, lp, lp2 = [], 0.0, 0.0
    for i in range(n):
        p = i / n
        c = 0.02 + 0.16 * math.sin(math.pi * p)
        lp += c * (random.uniform(-1, 1) - lp)
        lp2 += c * (lp - lp2)
        out.append(lp2 * math.sin(math.pi * p) ** 2 * 1.4)
    return out


def roll(length=2.6):
    out = []
    t = 0.0
    while t < length:
        out.append(t)
        t += 0.11 - 0.05 * (t / length)
    tick = [math.sin(2 * math.pi * 1500 * i / SR) * math.exp(-i / SR / 0.006) * 0.25 for i in range(int(0.03 * SR))]
    return out, tick


FX = {"click": click(), "scratch": scratch(), "reveal": chime(), "whoosh": whoosh()}
for c in spec["cues"]:
    if c["type"] in FX:
        add(c["t"], FX[c["type"]])
    elif c["type"] == "roll":
        times, tick = roll()
        for tt in times:
            add(c["t"] + tt, tick)
    elif c["type"] == "title":
        add(c["t"] + 0.1, chime(), 0.6)

# Fade in/out, normalize, write 16-bit mono.
fade = int(1.5 * SR)
for i in range(fade):
    buf[i] *= i / fade
    buf[N - 1 - i] *= i / fade
peak = max(abs(v) for v in buf) or 1.0
with wave.open(sys.argv[2], "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(v / peak * 0.85 * 32767)) for v in buf))
print(f"Wrote {sys.argv[2]} ({DUR:.1f}s)")
