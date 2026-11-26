#!/usr/bin/env python3
"""Labiale per un personaggio 2D in stile Motion (23/11, prova 51; idea dalla modalità «vector» di AI-Video-Factory).

  python3 strumenti/motion/bocca.py <cartella-spot>

Usa le stesse frasi montate da strumenti/motore/audio.py (accelerate dell'8 %, pause accorciate, agli istanti di
spot.json), quindi la bocca va a tempo con il mix finale. Scrive <spot>/sorgente/bocca.js:
  window.BOCCA = {fps: 30, a: [...], w: [...], parla: [[inizio, fine], ...]}
  a = apertura per fotogramma, 0 chiusa · 1 poco · 2 media · 3 larga
  w = forma: 1 larga (e, i: più energia sopra i 2 kHz), 0 tonda (o, u)
  parla = tratti di voce (per gesti e sguardi), in secondi
Non è un labiale per fonemi: segue il volume, come un cartone semplice.
"""
import sys; sys.dont_write_bytecode = True
import json
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "motore"))
import audio as A  # noqa: E402

FPS = 30


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    d = Path(sys.argv[1]).resolve()
    s, _ = A.carica(d)
    v = np.zeros(int(A.DUR * A.SR))
    for clip, ini, fine, x in A.frasi(d):
        if x is None: print("  manca", clip); continue
        if clip == "line6": continue                       # la chiusura comune la dice il logo, non il personaggio
        A.put(v, x, ini, 1.0)
    n = int(A.DUR * FPS); hop = A.SR // FPS; win = int(0.045 * A.SR)
    rms, hi = np.zeros(n), np.zeros(n)
    for k in range(n):
        c = k * hop + hop // 2; seg = v[max(0, c - win // 2): c + win // 2]
        if len(seg) < 64: continue
        rms[k] = np.sqrt(np.mean(seg ** 2))
        sp = np.abs(np.fft.rfft(seg * np.hanning(len(seg)))) ** 2; fr = np.fft.rfftfreq(len(seg), 1 / A.SR)
        tot = sp[(fr > 150) & (fr < 6000)].sum() + 1e-12; hi[k] = sp[(fr > 2000) & (fr < 6000)].sum() / tot
    ref = np.percentile(rms[rms > 0], 95) if (rms > 0).any() else 1
    o = np.clip(rms / ref, 0, 1)
    o = np.maximum(o, np.concatenate([[0], o[:-1]]) * 0.6)    # chiusura un po' più morbida dell'apertura
    a = np.digitize(o, [0.10, 0.32, 0.62]).astype(int)          # 0..3
    a[1:-1] = np.where((a[1:-1] == 0) & (a[:-2] > 0) & (a[2:] > 0), 1, a[1:-1])   # niente scatti chiusa-aperta di 1 fotogramma
    w = (hi > 0.22).astype(int)
    on = rms > 0.06 * ref; parla = []; k = 0
    while k < n:
        if on[k]:
            j = k
            while j < n and (on[j:j + 5].any()): j += 1
            parla.append([round(k / FPS, 2), round(j / FPS, 2)]); k = j
        else: k += 1
    out = d / "sorgente" / "bocca.js"
    out.write_text("window.BOCCA=" + json.dumps({"fps": FPS, "a": a.tolist(), "w": w.tolist(), "parla": parla}, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"ok {out.relative_to(d)}: {n} fotogrammi, bocca aperta nel {100 * (a > 0).mean():.0f} %")
    print("tratti di voce:", " · ".join(f"{p[0]:.2f}–{p[1]:.2f}" for p in parla))


if __name__ == "__main__":
    main()
