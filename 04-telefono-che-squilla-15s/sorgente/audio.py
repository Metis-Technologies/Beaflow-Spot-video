#!/usr/bin/env python3
"""Audio dello spot «Il telefono che squilla» (15 s, v3): voce (../audio/line1..6.mp3, accelerata dell'8%), effetti sintetizzati,
musica della serie (../../comune/musica/beaflow_musica_120bpm.mp3).
Produce spot-musica.mp4 e spot-senza-musica.mp4 a partire da muto.mp4."""
import subprocess
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent
SR, DUR, TEMPO = 48000, 15.0, 1.08
rng = np.random.default_rng(7)
VOICE = [("line1", 0.05), ("line2", 2.55), ("line3", 5.05), ("line4", 8.05), ("line5", 10.55), ("line6", 12.9)]

def env(n, attack=0.002, decay=0.08):
    t = np.arange(n) / SR
    return np.minimum(t / attack, 1.0) * np.exp(-t / decay)
def tone(freq, dur, decay, attack=0.002, sweep=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = freq * sweep ** (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, attack, decay)
def noise(dur, lo, hi):
    n = int(dur * SR); spec = np.fft.rfft(rng.standard_normal(n)); fr = np.fft.rfftfreq(n, 1 / SR)
    spec[(fr < lo) | (fr > hi)] = 0; x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)
def add(*xs):
    out = np.zeros(max(len(x) for x in xs))
    for x in xs: out[: len(x)] += x
    return out
def key():      return 0.6 * tone(1900, 0.03, 0.006) + 0.5 * noise(0.03, 2500, 7000) * env(int(0.03 * SR), 0.001, 0.005)
def click():    return add(tone(2300, 0.05, 0.008), 0.8 * tone(950, 0.08, 0.02))
def pop(f):     return tone(f, 0.16, 0.035, sweep=0.55)
def big_pop():  return add(0.9 * tone(392, 0.5, 0.12, sweep=0.8), 0.5 * tone(784, 0.4, 0.08), 0.8 * tone(130, 0.25, 0.06, sweep=0.6))
def tick(f=1250): return tone(f, 0.05, 0.012)
def thud():     return tone(120, 0.22, 0.05, sweep=0.55) + 0.25 * noise(0.22, 200, 900) * env(int(0.22 * SR), 0.002, 0.02)
def ding(f):    return add(0.7 * tone(f, 1.0, 0.24), 0.3 * tone(2 * f, 0.8, 0.16), 0.15 * tone(3.01 * f, 0.6, 0.1))
def buzz():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 155 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 32 * t))) * np.hanning(n)
def whoosh(dur=0.5):
    return noise(dur, 400, 3200) * np.hanning(int(dur * SR)) ** 1.5
def put(buf, x, at, gain):
    a = int(at * SR); x = x[: max(0, len(buf) - a)]
    buf[a:a + len(x)] += gain * x

def ring(dur=0.4):                    # squillo: due toni modulati a 20 Hz, come una suoneria classica
    n = int(dur * SR); t = np.arange(n) / SR
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 20 * t))
    x = (np.sin(2 * np.pi * 1320 * t) + 0.6 * np.sin(2 * np.pi * 1760 * t)) * am
    fade = np.minimum(1, np.minimum(t / 0.01, (dur - t) / 0.04))
    return x * fade / 1.6

def build_sfx():                      # un effetto per ogni evento visivo, allo stesso istante della timeline (index.html)
    s = np.zeros(int(DUR * SR))
    put(s, pop(520), 0.4, 0.14)                                   # scena 1: arriva la chiamata
    for r in (0.7, 1.7):                                          # uno squillo al secondo, con vibrazione
        put(s, ring(), r, 0.07); put(s, buzz(), r, 0.05)
    for m in (1.1, 1.6, 2.05):                                    # ogni chiamata persa scende nella lista
        put(s, thud(), m, 0.26); put(s, tick(900), m + 0.02, 0.06)
    put(s, click(), 2.5, 0.2); put(s, big_pop(), 2.5, 0.12)       # scena 2: stacco nero -> crema sul battito
    for i in range(3): put(s, pop(600 * 2 ** (i / 12)), 2.52 + i * 0.1, 0.12)
    for c in (3.5, 3.85, 4.2):                                    # Confermata: il ding ricorrente della serie
        put(s, ding(880), c, 0.2)
    put(s, whoosh(0.45), 4.55, 0.07)                              # scena 3: le schede si richiudono nell'orologio
    put(s, pop(500), 4.9, 0.14)
    for m in (5.6, 5.9, 6.2): put(s, tick(1250), m, 0.07)         # 22:57 -> 23:00
    put(s, pop(700), 6.5, 0.14); put(s, ding(880), 6.95, 0.2)     # nuova prenotazione confermata
    put(s, whoosh(0.5), 7.55, 0.07)                               # scena 4: notifica
    put(s, ding(880), 8.3, 0.26); put(s, buzz(), 8.3, 0.06)
    put(s, pop(650), 8.9, 0.12); put(s, pop(760), 9.25, 0.14)
    put(s, whoosh(0.45), 10.05, 0.07)                             # scena 5: agenda piena
    for i, t in enumerate((10.95, 11.15, 11.35)): put(s, pop(600 * 2 ** (i / 12)), t, 0.13)
    put(s, tick(1250), 11.75, 0.06)
    put(s, whoosh(0.5), 12.5, 0.08); put(s, pop(700), 12.8, 0.16) # scena 6: righe -> bottone, logo
    put(s, whoosh(0.45), 13.0, 0.05); put(s, click(), 14.15, 0.2)
    return s

def decode(path, af=None):
    wav = path.with_suffix(".dec.wav")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(path)] + (["-af", af] if af else []) + ["-ar", str(SR), "-ac", "1", str(wav)]
    subprocess.run(cmd, check=True)
    x, _ = sf.read(wav, dtype="float64")
    return x

def trim_pauses(x, max_pause=0.18):
    """Accorcia le pause interne più lunghe di max_pause (es. dopo «Uno:»), tagliando nel silenzio."""
    win = 960
    quiet = np.sqrt(np.convolve(x * x, np.ones(win) / win, "same")) < 0.008
    cuts = np.flatnonzero(np.diff(quiet.astype(int))) + 1
    segs, flags = np.split(x, cuts), np.split(quiet, cuts)
    keep, out = int(max_pause * SR), []
    for k, (seg, fl) in enumerate(zip(segs, flags)):
        if fl[0] and len(seg) > keep and 0 < k < len(segs) - 1:
            h = keep // 2; out += [seg[:h], seg[-h:]]
        else:
            out.append(seg)
    return np.concatenate(out)

def build_voice():
    v = np.zeros(int(DUR * SR))
    for clip, start in VOICE:
        x = decode(ROOT.parent / "audio" / f"{clip}.mp3", f"atempo={TEMPO}")
        nz = np.where(np.abs(x) > 0.004)[0]; x = x[max(nz[0] - 480, 0): nz[-1] + 2400]
        x = trim_pauses(x)
        print(f"  {clip} {start:5.2f} -> {start + len(x) / SR:5.2f}")
        put(v, x, start, 1.0)
    return v * (0.80 / np.abs(v).max())

def tempo_and_phase(x):
    hop, win = 512, 2048
    frames = np.lib.stride_tricks.sliding_window_view(x, win)[::hop] * np.hanning(win)
    mag = np.abs(np.fft.rfft(frames, axis=1))
    flux = np.maximum(mag[1:] - mag[:-1], 0).sum(axis=1); flux -= flux.mean()
    fps = SR / hop
    ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
    lags = np.arange(len(ac)); ok = (lags >= fps * 60 / 180) & (lags <= fps * 60 / 75)
    lag = lags[ok][np.argmax(ac[ok])]; bpm = 60 * fps / lag
    period = 0.5                                   # griglia del video: 120 BPM
    phases = np.arange(0, period, 0.005); t = (np.arange(len(flux)) + 1) * hop / SR
    score = [np.maximum(flux, 0)[np.abs(((t - ph + period / 2) % period) - period / 2) < 0.03].sum() for ph in phases]
    return bpm, float(phases[int(np.argmax(score))])

def mux(wavname, mix, out):
    wav = ROOT.parent / "audio" / wavname
    sf.write(wav, np.stack([mix, mix], axis=1), SR)
    tmp = ROOT / (out + ".tmp.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ROOT / "muto.mp4"), "-i", str(wav), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(tmp)], check=True)
    tmp.rename(ROOT / out)
    print("ok", out, "peak", round(float(np.abs(mix).max()), 3))

if __name__ == "__main__":
    voice, sfx = build_voice(), build_sfx()
    mux("mix-senza-musica.wav", voice + sfx, "spot-senza-musica.mp4")
    m = decode(ROOT.parent.parent / "comune" / "musica" / "beaflow_musica_120bpm.mp3")
    bpm, phase = tempo_and_phase(m)
    print(f"musica: tempo stimato {bpm:.1f} BPM, primo battito a {phase:.3f} s")
    if 117 <= bpm <= 123 and phase > 0.02:          # allinea i battiti ai cambi di scena
        m = m[int(phase * SR):]
    mus = np.zeros(int(DUR * SR)); n = min(len(m), len(mus)); mus[:n] = m[:n]
    mus *= 0.24 / np.abs(mus).max()
    fade = int(0.6 * SR); mus[-fade:] *= np.linspace(1, 0, fade) ** 1.5; mus[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    mix = voice + 0.8 * sfx + mus
    if np.abs(mix).max() > 0.97: mix *= 0.97 / np.abs(mix).max()
    mux("mix-musica.wav", mix, "spot-musica.mp4")
