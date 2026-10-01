"""Synthesize the music bed and extra SFX for the neobrutalism video (no dependencies).

Writes into public/: music-brutal.wav plus sfx/pop.wav, sfx/thud.wav, sfx/water.wav.
Usage (from data-pipeline-analogy/): python3 scripts/brutal_audio.py
"""
import math
import os
import random
import struct
import wave

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public")
random.seed(11)


def write(path, buf, peak=0.9):
    m = max(1e-9, max(abs(v) for v in buf))
    scale = peak / m
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v * scale)) * 32767)) for v in buf))


def add(buf, start, samples, gain=1.0):
    i0 = int(start * SR)
    for i, v in enumerate(samples):
        j = i0 + i
        if 0 <= j < len(buf):
            buf[j] += v * gain


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ---------- instruments ----------

def bass(freq, dur):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = min(1, t / 0.005) * math.exp(-t / 0.25)
        ph = (freq * t) % 1.0
        tri = 4 * abs(ph - 0.5) - 1
        out.append((0.7 * math.sin(2 * math.pi * freq * t) + 0.3 * tri) * e)
    return out


def stab(freqs, dur=0.16):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = min(1, t / 0.003) * math.exp(-t / 0.06)
        v = 0.0
        for f in freqs:
            for h, a in ((1, 1.0), (2, 0.35), (3, 0.18)):
                v += a * math.sin(2 * math.pi * f * h * t)
        out.append(v * e / len(freqs))
    return out


def marimba(freq, dur=0.45):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        e = min(1, t / 0.002) * math.exp(-t / 0.14)
        out.append((math.sin(2 * math.pi * freq * t) + 0.25 * math.sin(2 * math.pi * 4 * freq * t) * math.exp(-t / 0.03)) * e)
    return out


def kick():
    n = int(0.3 * SR)
    out = []
    ph = 0.0
    for i in range(n):
        t = i / SR
        f = 50 + 110 * math.exp(-t / 0.03)
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * math.exp(-t / 0.12))
    return out


def noise_hit(dur, decay, hp=True):
    n = int(dur * SR)
    out = []
    prev = 0.0
    for i in range(n):
        t = i / SR
        x = random.uniform(-1, 1)
        y = x - prev if hp else x
        prev = x
        out.append(y * math.exp(-t / decay))
    return out


# ---------- music bed ----------

def music(seconds=53.0, bpm=112):
    buf = [0.0] * int(seconds * SR)
    beat = 60 / bpm
    bar = 4 * beat
    # I – vi – IV – V in C
    chords = [(48, [60, 64, 67]), (45, [60, 64, 69]), (41, [60, 65, 69]), (43, [59, 62, 67])]
    hook = [(0, 72), (0.5, 76), (1, 79), (2, 76), (2.5, 79), (3, 81)]
    hook2 = [(0, 74), (0.5, 76), (1, 72), (2, 69), (3, 67)]
    kick_s, clap_s, hat_s = kick(), noise_hit(0.18, 0.05), noise_hit(0.05, 0.012)
    bars = int(seconds / bar) + 1
    for b in range(bars):
        t0 = b * bar
        root, notes = chords[b % 4]
        freqs = [midi(n) for n in notes]
        full = b >= 2
        # offbeat chord stabs
        for k in range(4):
            add(buf, t0 + (k + 0.5) * beat, stab(freqs), 0.22)
        # hats on every 8th
        for k in range(8):
            add(buf, t0 + k * beat / 2, hat_s, 0.10 if k % 2 else 0.06)
        if full:
            add(buf, t0, bass(midi(root), beat * 1.2), 0.5)
            add(buf, t0 + 1.5 * beat, bass(midi(root + 12), beat * 0.5), 0.35)
            add(buf, t0 + 2 * beat, bass(midi(root), beat * 1.2), 0.5)
            for k in (0, 2):
                add(buf, t0 + k * beat, kick_s, 0.55)
            for k in (1, 3):
                add(buf, t0 + k * beat, clap_s, 0.22)
        if b >= 4 and b % 2 == 0:
            for off, n in (hook if b % 4 == 0 else hook2):
                add(buf, t0 + off * beat, marimba(midi(n)), 0.18)
    return buf


# ---------- sfx ----------

def pop():
    n = int(0.14 * SR)
    out, ph = [], 0.0
    for i in range(n):
        t = i / SR
        f = 380 + 900 * math.exp(-t / 0.025)
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * min(1, t / 0.002) * math.exp(-t / 0.04))
    return out


def thud():
    body = kick()[: int(0.22 * SR)]
    click = noise_hit(0.22, 0.006)
    return [0.9 * a + 0.5 * b for a, b in zip(body, click)]


def water():
    buf = [0.0] * int(0.9 * SR)
    for k in range(14):
        start = k * 0.055 + random.uniform(0, 0.02)
        f0 = random.uniform(500, 900) + k * 25
        n = int(0.07 * SR)
        blip = []
        for i in range(n):
            t = i / SR
            f = f0 * (1 + 2.5 * t / 0.07)
            blip.append(math.sin(2 * math.pi * f * t) * math.sin(math.pi * i / n))
        add(buf, start, blip, random.uniform(0.4, 0.8))
    return buf


if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
    write(os.path.join(OUT, "sfx", "pop.wav"), pop())
    write(os.path.join(OUT, "sfx", "thud.wav"), thud())
    write(os.path.join(OUT, "sfx", "water.wav"), water(), peak=0.7)
    write(os.path.join(OUT, "music-brutal.wav"), music(), peak=0.8)
    print("done")
