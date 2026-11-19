#!/usr/bin/env python3
"""Audio comune a tutti gli spot Premium 3D. Di solito si lancia da strumenti/spot.py.

  python3 strumenti/motore/audio.py <cartella-spot> [--sovrascrivi]

Voce: <spot>/audio/line1..5.mp3 (accelerata dell'8%, pause interne a 0,18 s) agli istanti «voce_inizio» di spot.json;
la chiusura «Beaflow. Inizia gratis.» è comune (comune/voce/chiusura.mp3, inizio a 12,9 s).
Effetti: funzione effetti(s, a) in <spot>/effetti.py. Musica: comune/musica/beaflow_musica_120bpm.mp3.
Parte da <spot>/sorgente/muto.mp4 e scrive le due versioni in <spot>/export/ con i nomi della serie.
"""
import sys; sys.dont_write_bytecode = True      # niente __pycache__ nelle cartelle degli spot
import importlib.util, json, shutil, subprocess, sys
from pathlib import Path
import numpy as np
import soundfile as sf

REPO = Path(__file__).resolve().parents[2]
SR, DUR, TEMPO = 48000, 15.0, 1.08
CHIUSURA = ("line6", 12.9)
rng = np.random.default_rng(7)

# ───────── suoni sintetici (a disposizione di effetti.py come a.tick, a.impact, …) ─────────
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
def coin():     return add(0.6 * tone(2637, 0.25, 0.06), 0.4 * tone(3951, 0.2, 0.04), 0.3 * tone(1760, 0.15, 0.03))   # moneta
def buzz():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 155 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 32 * t))) * np.hanning(n)
def whoosh(dur=0.5):
    return noise(dur, 400, 3200) * np.hanning(int(dur * SR)) ** 1.5
def riser(dur=0.6):                   # salita prima dello stacco: rumore filtrato che cresce
    n = int(dur * SR); return noise(dur, 800, 6000) * np.linspace(0, 1, n) ** 2
def impact():                         # colpo sul battito: basso + coda luminosa
    return add(tone(55, 0.6, 0.18, sweep=0.7), 0.6 * tone(110, 0.4, 0.1, sweep=0.8), 0.25 * noise(0.5, 2000, 9000) * env(int(0.5 * SR), 0.002, 0.08))
def shimmer(f=1760):                  # brillio del glow
    return add(*[0.3 * tone(f * r, 0.7, 0.18) for r in (1, 1.5, 2.01)])
def put(buf, x, at, gain):
    a = int(at * SR); x = x[: max(0, len(buf) - a)]
    buf[a:a + len(x)] += gain * x


# ───────── spot ─────────
def carica(d):
    s = json.loads((d / "spot.json").read_text(encoding="utf-8"))
    catena = [d]
    while s.get("base"):                                   # versione di settore: eredita dallo spot base
        b = REPO / s["base"]; sb = json.loads((b / "spot.json").read_text(encoding="utf-8"))
        scene = sb["scene"]
        for n, cambi in (s.get("scene") or {}).items(): scene[int(n) - 1].update(cambi)
        s = {**sb, **{k: v for k, v in s.items() if k not in ("scene", "base")}, "scene": scene, "base": sb.get("base")}
        catena.append(b)
    return s, catena

def trova(catena, rel):
    for d in catena:
        if (d / rel).exists(): return d / rel
    return None

def decode(path, tmp, af=None):
    wav = tmp / (path.stem + ".dec.wav")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(path)] + (["-af", af] if af else []) + ["-ar", str(SR), "-ac", "1", str(wav)]
    subprocess.run(cmd, check=True)
    x, _ = sf.read(wav, dtype="float64"); wav.unlink()
    return x

def trim_pauses(x, max_pause=0.18):
    """Accorcia le pause interne più lunghe di max_pause, tagliando nel silenzio."""
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

def frasi(d):
    """[(clip, inizio, fine, campioni | None)] per le 5 frasi dello spot e la chiusura comune. Usata anche da controlli.py."""
    s, catena = carica(d)
    tmp = d / "audio"; tmp.mkdir(exist_ok=True)
    elenco = [(f"line{i}", x["voce_inizio"]) for i, x in enumerate(s["scene"], 1)] + [CHIUSURA]
    out = []
    for clip, start in elenco:
        f = trova(catena, f"audio/{clip}.mp3")
        if not f and clip == "line6": f = REPO / "comune" / "voce" / "chiusura.mp3"
        if not f or not f.exists(): out.append((clip, start, None, None)); continue
        x = decode(f, tmp, f"atempo={TEMPO}")
        nz = np.where(np.abs(x) > 0.004)[0]; x = x[max(nz[0] - 480, 0): nz[-1] + 2400]
        x = trim_pauses(x)
        out.append((clip, start, start + len(x) / SR, x))
    return out

def build_voice(d):
    v = np.zeros(int(DUR * SR))
    for clip, start, fine, x in frasi(d):
        if x is None: print("  manca", clip); continue
        print(f"  {clip} {start:5.2f} -> {fine:5.2f}")
        put(v, x, start, 1.0)
    if not np.abs(v).max(): sys.exit("ERRORE: nessuna clip della voce in audio/")
    return v * (0.80 / np.abs(v).max())

def build_sfx(catena):
    s = np.zeros(int(DUR * SR))
    f = trova(catena, "effetti.py")
    if not f: print("  nessun effetti.py: solo voce e musica"); return s
    spec = importlib.util.spec_from_file_location("effetti_spot", f); mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    mod.effetti(s, sys.modules[__name__])
    return s

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

def mux(d, wavname, mix, out):
    wav = d / "audio" / wavname
    sf.write(wav, np.stack([mix, mix], axis=1), SR)
    tmp = d / "sorgente" / (out + ".tmp.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(d / "sorgente" / "muto.mp4"), "-i", str(wav), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(tmp)], check=True)
    tmp.rename(d / "sorgente" / out)
    print("ok", out, "peak", round(float(np.abs(mix).max()), 3))

def esporta(d, s, sovrascrivi):
    (d / "export").mkdir(exist_ok=True)
    for variante in ("musica", "senza-musica"):
        dst = d / "export" / f"beaflow_{s['nome']}_15s_{variante}_v{s.get('versione', 1)}.mp4"
        if dst.exists() and not sovrascrivi:
            print(f"  NON copiato: {dst.name} esiste già. Per una correzione alzare «versione» in spot.json (la precedente va in export/archivio/); --sovrascrivi solo se il video non è stato ancora consegnato.")
            continue
        shutil.copy(d / "sorgente" / f"spot-{variante}.mp4", dst); print("  export/" + dst.name)

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args: sys.exit(__doc__)
    d = Path(args[0]).resolve(); s, catena = carica(d)
    if not (d / "sorgente" / "muto.mp4").exists(): sys.exit("ERRORE: manca sorgente/muto.mp4 (prima il render)")
    voice, sfx = build_voice(d), build_sfx(catena)
    mux(d, "mix-senza-musica.wav", voice + sfx, "spot-senza-musica.mp4")
    m = decode(REPO / "comune" / "musica" / "beaflow_musica_120bpm.mp3", d / "audio")
    bpm, phase = tempo_and_phase(m)
    print(f"musica: tempo stimato {bpm:.1f} BPM, primo battito a {phase:.3f} s")
    if 117 <= bpm <= 123 and phase > 0.02:          # allinea i battiti ai cambi di scena
        m = m[int(phase * SR):]
    mus = np.zeros(int(DUR * SR)); n = min(len(m), len(mus)); mus[:n] = m[:n]
    mus *= 0.24 / np.abs(mus).max()
    fade = int(0.6 * SR); mus[-fade:] *= np.linspace(1, 0, fade) ** 1.5; mus[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    mix = voice + 0.8 * sfx + mus
    if np.abs(mix).max() > 0.97: mix *= 0.97 / np.abs(mix).max()
    mux(d, "mix-musica.wav", mix, "spot-musica.mp4")
    esporta(d, s, "--sovrascrivi" in sys.argv)

if __name__ == "__main__":
    main()
