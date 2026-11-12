#!/usr/bin/env python3
"""Audio dello spot: effetti sonori sintetizzati + voce (clip in vo/), poi montaggio sul video.
  python3 audio.py
Produce: beaflow-spot-esplora-voce.mp4 (senza nome) e beaflow-spot-esplora-voce-con-nome.mp4
"""
import subprocess
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent
SR, DUR = 48000, 20.0
rng = np.random.default_rng(7)


def env(n, attack=0.002, decay=0.08):
    t = np.arange(n) / SR
    return np.minimum(t / attack, 1.0) * np.exp(-t / decay)


def tone(freq, dur, decay, attack=0.002, sweep=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * sweep ** (t / dur)                     # glissando esponenziale
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, attack, decay)


def noise(dur, lo, hi):
    n = int(dur * SR)
    spec = np.fft.rfft(rng.standard_normal(n))
    fr = np.fft.rfftfreq(n, 1 / SR)
    spec[(fr < lo) | (fr > hi)] = 0
    x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)


def add(*xs):
    out = np.zeros(max(len(x) for x in xs))
    for x in xs:
        out[: len(x)] += x
    return out


def key():      return 0.6 * tone(1900, 0.03, 0.006) + 0.5 * noise(0.03, 2500, 7000) * env(int(0.03 * SR), 0.001, 0.005)
def click():    return add(tone(2300, 0.05, 0.008), 0.8 * tone(950, 0.08, 0.02))
def pop(f):     return tone(f, 0.16, 0.035, sweep=0.55)
def big_pop():  return add(0.9 * tone(392, 0.5, 0.12, sweep=0.8), 0.5 * tone(784, 0.4, 0.08), 0.8 * tone(130, 0.25, 0.06, sweep=0.6))
def tick(f=1250): return tone(f, 0.05, 0.012)
def thud():     return tone(120, 0.22, 0.05, sweep=0.55) + 0.25 * noise(0.22, 200, 900) * env(int(0.22 * SR), 0.002, 0.02)
def ding(f):    return add(0.7 * tone(f, 1.1, 0.28), 0.3 * tone(2 * f, 0.9, 0.18), 0.15 * tone(3.01 * f, 0.6, 0.1))
def buzz():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 155 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 32 * t))) * np.hanning(n)
def whoosh(dur=0.5):
    n = int(dur * SR)
    return noise(dur, 400, 3200) * np.hanning(n) ** 1.5


def put(buf, x, at, gain):
    a = int(at * SR); x = x[: max(0, len(buf) - a)]
    buf[a:a + len(x)] += gain * x


def build_sfx():
    s = np.zeros(int(DUR * SR), dtype=np.float64)
    q = "parrucchiere vicino a me"
    for i, ch in enumerate(q):                                   # scena 1: tasti + invio
        if ch != " ":
            put(s, key(), 0.15 + i * 0.05, 0.10)
    put(s, click(), 1.6, 0.22)
    put(s, whoosh(0.45), 2.1, 0.07)                               # barra che sale
    for i in range(6):                                            # scena 2: segnaposto, tono che sale
        put(s, pop(520 * 2 ** (i / 12)), 3.0 + i * 0.08 + 0.13, 0.20)
    put(s, big_pop(), 3.7 + 0.13, 0.30)
    put(s, whoosh(0.55), 4.38, 0.09)                              # scheda che sale
    put(s, thud(), 7.05, 0.30)                                    # scena 3: prenotazioni che atterrano
    for base in (8.6, 9.8):
        for i in range(4):
            put(s, tick(1250 + 60 * i), base + i * 0.05 + 0.18, 0.13)
    put(s, thud(), 9.12, 0.30); put(s, thud(), 10.32, 0.30)
    put(s, whoosh(0.4), 10.6, 0.07)
    for k, t0 in enumerate((11.4, 12.0, 12.6)):                   # scena 4: ding (+1 semitono) e vibrazione
        put(s, ding(880 * 2 ** (k / 12)), t0 + 0.08, 0.26)
        put(s, buzz(), t0 + 0.08, 0.07)
    put(s, whoosh(0.6), 14.4, 0.08)
    for k in range(15):                                           # scena 5: raffica di tic
        put(s, tick(1500 if k % 2 else 1300), 15.2 + k * 0.05 + 0.03, 0.09)
    put(s, whoosh(0.5), 17.45, 0.08)                              # scena 6
    put(s, click(), 18.9, 0.22)
    return s


def load(path):
    wav = path.with_suffix(".wav")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(path), "-ar", str(SR), "-ac", "1", str(wav)], check=True)
    x, _ = sf.read(wav, dtype="float64")
    return x


def build(name, lines, out):
    v = np.zeros(int(DUR * SR), dtype=np.float64)
    for clip, start in lines:
        x = load(ROOT.parent / "audio" / clip)
        end = start + len(x) / SR
        print(f"  {clip} {start:5.2f} -> {end:5.2f}")
        assert end <= DUR, clip
        put(v, x, start, 1.0)
    v *= 0.80 / np.abs(v).max()                                   # voce: picco a circa -2 dBFS
    mix = v + build_sfx()
    mix = np.tanh(mix * 1.0) if np.abs(mix).max() > 0.97 else mix
    wav = ROOT.parent / "audio" / f"mix-{name}.wav"
    sf.write(wav, np.stack([mix, mix], axis=1), SR)
    tmp = ROOT / f"{name}.tmp.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ROOT / "beaflow-spot-esplora-muto.mp4"), "-i", str(wav),
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(tmp)], check=True)
    tmp.rename(ROOT / out)
    print("ok", out, "peak", round(float(np.abs(mix).max()), 3))


if __name__ == "__main__":
    print("senza nome")
    build("voce", [("line1.mp3", 0.45), ("line2.mp3", 4.15), ("line3.mp3", 7.7), ("line4.mp3", 13.0), ("line5.mp3", 18.3)],
          "beaflow-spot-esplora-voce.mp4")
    print("con nome")
    build("voce-con-nome", [("line1.mp3", 0.45), ("line6.mp3", 3.95), ("line3.mp3", 7.7), ("line4.mp3", 13.0), ("line7.mp3", 17.6)],
          "beaflow-spot-esplora-voce-con-nome.mp4")
    sf.write(ROOT.parent / "audio" / "sfx.wav", build_sfx(), SR)
