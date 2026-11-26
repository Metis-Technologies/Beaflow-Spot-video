#!/usr/bin/env python3
"""Audio comune a tutti gli spot Premium 3D. Di solito si lancia da strumenti/spot.py.

  python3 strumenti/motore/audio.py <cartella-spot> [--sovrascrivi]

Voce: <spot>/audio/line1..5.mp3 (accelerata dell'8%, pause interne a 0,18 s) agli istanti «voce_inizio» di spot.json;
la chiusura «Beaflow. Inizia gratis.» è comune (comune/voce/chiusura.mp3, inizio a 12,9 s).
Durata diversa da 15 s (23/11, prova 51 da 20 s): «durata» e «chiusura_inizio» in spot.json; la musica si allunga ripetendo
le ultime 4 battute (8 s a 120 BPM) con una dissolvenza incrociata; nel nome del file «_<durata>s_».
Effetti: funzione effetti(s, a) in <spot>/effetti.py. Musica: comune/musica/beaflow_musica_120bpm.mp3.
Parte da <spot>/sorgente/muto.mp4 e scrive le due versioni in <spot>/export/ con i nomi della serie.
"""
import sys; sys.dont_write_bytecode = True      # niente __pycache__ nelle cartelle degli spot
import importlib.util, json, re, shutil, subprocess, sys
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
def imposta_durata(s):
    """Durata dello spot e inizio della chiusura da spot.json (di serie 15 s e 12,9 s)."""
    global DUR, CHIUSURA
    DUR = float(s.get("durata", 15.0)); CHIUSURA = ("line6", float(s.get("chiusura_inizio", 12.9)))

def secondi(s):
    d = float(s.get("durata", 15.0)); return f"{d:g}s"

def allunga_musica(m, dur, periodo=8.0, fine=14.0, xf=0.25):
    """Musica più corta dello spot: ripete il tratto [fine-periodo, fine] (battute intere) con una dissolvenza incrociata."""
    n = int(dur * SR) + SR
    if len(m) >= n: return m
    a, b, x = int((fine - periodo) * SR), int(fine * SR), int(xf * SR)
    out = m[:b].copy(); giro = m[a:b]
    while len(out) < n:
        r = np.linspace(0, 1, x); out[-x:] = out[-x:] * (1 - r) + giro[:x] * r
        out = np.concatenate([out, giro[x:]])
    return out

def carica(d):
    s = json.loads((d / "spot.json").read_text(encoding="utf-8"))
    catena = [d]
    while s.get("base"):                                   # versione di settore: eredita dallo spot base
        b = REPO / s["base"]; sb = json.loads((b / "spot.json").read_text(encoding="utf-8"))
        scene = sb["scene"]
        for n, cambi in (s.get("scene") or {}).items(): scene[int(n) - 1].update(cambi)
        s = {**sb, **{k: v for k, v in s.items() if k not in ("scene", "base")}, "scene": scene, "base": sb.get("base")}
        catena.append(b)
    imposta_durata(s)
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

def lufs(mix, tmpdir):
    """Loudness integrata (LUFS) di un mix, misurata con ffmpeg ebur128 come fa controlli.py."""
    wav = tmpdir / "_misura.wav"; sf.write(wav, np.stack([mix, mix], axis=1), SR)
    err = subprocess.run(["ffmpeg", "-nostats", "-i", str(wav), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    wav.unlink(missing_ok=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", err)
    return float(m[-1]) if m else None

def alla_serie(mix, tmpdir, nome):
    """Riporta il mix al volume della serie (riferimento.json) se se ne discosta di più di 0,5 LU; il picco resta sotto 0,97."""
    rif = json.loads((REPO / "strumenti" / "riferimento.json").read_text(encoding="utf-8"))["lufs_serie"]
    l = lufs(mix, tmpdir)
    if l is None or abs(l - rif) <= 0.5: return mix
    g = 10 ** ((rif - l) / 20); g = min(g, 0.97 / max(np.abs(mix).max(), 1e-9))
    print(f"  volume {nome}: {l:.1f} LUFS -> {rif} (guadagno {20*np.log10(g):+.1f} dB)")
    return mix * g

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
        dst = d / "export" / f"beaflow_{s['nome']}_{secondi(s)}_{variante}_v{s.get('versione', 1)}.mp4"
        if dst.exists() and not sovrascrivi:
            print(f"  NON copiato: {dst.name} esiste già. Per una correzione alzare «versione» in spot.json (la precedente va in export/archivio/); --sovrascrivi solo se il video non è stato ancora consegnato.")
            continue
        shutil.copy(d / "sorgente" / f"spot-{variante}.mp4", dst); print("  export/" + dst.name)
        v = s.get('versione', 1)                     # 20/11: le versioni precedenti vanno da sole in export/archivio/
        for vecchio in sorted((d / "export").glob(f"beaflow_{s['nome']}_{secondi(s)}_{variante}_v*.mp4")):
            m = re.search(r"_v(\d+)\.mp4$", vecchio.name)
            if m and int(m.group(1)) < v:
                (d / "export" / "archivio").mkdir(exist_ok=True); shutil.move(str(vecchio), d / "export" / "archivio" / vecchio.name)
                print("  in archivio: " + vecchio.name)

# ───────── voce più chiara: voce in primo piano, musica ed effetti che si abbassano mentre parla ─────────
def profilo_audio():
    """Impostazioni del mix da strumenti/riferimento.json («audio»); --profilo attuale|chiaro le forza per una prova."""
    rif = json.loads((REPO / "strumenti" / "riferimento.json").read_text(encoding="utf-8")).get("audio", {})
    nome = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--profilo=")), rif.get("profilo", "attuale"))
    if nome not in rif.get("profili", {}): return nome, {}
    return nome, rif["profili"][nome]

def presenza(v, anticipo=0.06, attacco=0.03, rilascio=0.30):
    """Da 0 a 1: quanto la voce sta parlando, con salita rapida, discesa morbida e un piccolo anticipo."""
    win = int(0.03 * SR); rms = np.sqrt(np.convolve(v * v, np.ones(win) / win, "same"))
    on = (rms > 0.03 * np.abs(v).max()).astype(float)
    k = int(anticipo * SR); on = np.maximum(on, np.concatenate([on[k:], np.zeros(k)]))
    passo = 48; x = on[::passo]; y = np.zeros(len(x)); a = np.exp(-passo / (attacco * SR)); r = np.exp(-passo / (rilascio * SR)); z = 0.0
    for i, t in enumerate(x):
        c = a if t > z else r; z = c * z + (1 - c) * t; y[i] = z
    return np.interp(np.arange(len(v)), np.arange(len(x)) * passo, y)

def voce_chiara(v, filtri, tmpdir):
    """Filtri di ffmpeg sulla traccia della voce (taglio dei bassi, presenza, compressione leggera), poi stesso picco di prima."""
    a, b = tmpdir / "_voce_in.wav", tmpdir / "_voce_out.wav"; sf.write(a, v, SR)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(a), "-af", filtri, "-ar", str(SR), "-ac", "1", str(b)], check=True)
    x, _ = sf.read(b, dtype="float64"); a.unlink(); b.unlink()
    x = np.pad(x, (0, max(0, len(v) - len(x))))[: len(v)]
    return x * (np.abs(v).max() / max(np.abs(x).max(), 1e-9))

def rapporto(voice, fondo, p):
    """Di quanti dB la voce sta sopra musica ed effetti mentre parla."""
    m = p > 0.5; rv = np.sqrt(np.mean(voice[m] ** 2)); rf = np.sqrt(np.mean(fondo[m] ** 2)) + 1e-12
    return 20 * np.log10(rv / rf)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args: sys.exit(__doc__)
    d = Path(args[0]).resolve(); s, catena = carica(d)
    if not (d / "sorgente" / "muto.mp4").exists(): sys.exit("ERRORE: manca sorgente/muto.mp4 (prima il render)")
    voice, sfx = build_voice(d), build_sfx(catena)
    nome_p, P = profilo_audio(); p = presenza(voice)
    if P.get("voce_filtri"): voice = voce_chiara(voice, P["voce_filtri"], d / "audio")
    giu = lambda db: 10 ** (-db * p / 20)                 # abbassa di «db» mentre la voce parla
    sfx_m = sfx * giu(P.get("effetti_sotto_voce_db", 0))
    print(f"profilo audio: {nome_p}")
    mux(d, "mix-senza-musica.wav", alla_serie(voice + sfx_m, d / "audio", "senza musica"), "spot-senza-musica.mp4")
    m = decode(REPO / "comune" / "musica" / "beaflow_musica_120bpm.mp3", d / "audio")
    bpm, phase = tempo_and_phase(m)
    print(f"musica: tempo stimato {bpm:.1f} BPM, primo battito a {phase:.3f} s")
    if 117 <= bpm <= 123 and phase > 0.02:          # allinea i battiti ai cambi di scena
        m = m[int(phase * SR):]
    if DUR > 15.0: m = allunga_musica(m, DUR); print(f"  musica allungata a {DUR:g} s (ultime 4 battute ripetute)")
    mus = np.zeros(int(DUR * SR)); n = min(len(m), len(mus)); mus[:n] = m[:n]
    mus *= P.get("musica_picco", 0.24) / np.abs(mus).max()
    fade = int(0.6 * SR); mus[-fade:] *= np.linspace(1, 0, fade) ** 1.5; mus[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    mus = mus * giu(P.get("musica_sotto_voce_db", 0))
    print(f"  voce sopra musica ed effetti, mentre parla: {rapporto(voice, 0.8 * sfx_m + mus, p):+.1f} dB")
    mix = voice + 0.8 * sfx_m + mus
    if np.abs(mix).max() > 0.97: mix *= 0.97 / np.abs(mix).max()
    mux(d, "mix-musica.wav", alla_serie(mix, d / "audio", "musica"), "spot-musica.mp4")
    esporta(d, s, "--sovrascrivi" in sys.argv)

if __name__ == "__main__":
    main()
