#!/usr/bin/env python3
"""Voce narrante: genera una traccia per scena e la monta sul video.
  python3 vo.py <cartella-modello> [voce] [velocità]
"""
import subprocess, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent
MODEL = Path(sys.argv[1])
VOICE = sys.argv[2] if len(sys.argv) > 2 else "if_sara"
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 0.9
SR_OUT, TOTAL = 48000, 30.0

# (inizio in secondi, fine massima, testo)
LINES = [
    (0.45, 3.9, "Agenda, incassi e clienti. In un solo posto."),
    (4.35, 9.8, "Prima di aprire, l'agenda è già aggiornata, con le prenotazioni online."),
    (10.35, 15.3, "I clienti prenotano da soli, giorno e notte."),
    (15.85, 20.7, "Al banco, incassi con pagamenti e depositi."),
    (21.2, 25.2, "A fine giornata, leggi statistiche e report."),
    (25.1, 29.85, "Il gestionale per saloni, barbieri e centri estetici. Link in bio."),
]

k = Kokoro(str(MODEL / "kokoro-v1.0.onnx"), str(MODEL / "voices-v1.0.bin"))
out = ROOT / "vo"
out.mkdir(exist_ok=True)
mix = np.zeros(int(TOTAL * SR_OUT), dtype=np.float32)
for i, (start, limit, text) in enumerate(LINES):
    samples, sr = k.create(text, voice=VOICE, speed=SPEED, lang="it")
    samples = np.asarray(samples, dtype=np.float32)
    # taglia il silenzio in testa e in coda
    nz = np.where(np.abs(samples) > 0.004)[0]
    samples = samples[max(nz[0] - int(0.02 * sr), 0): nz[-1] + int(0.12 * sr)]
    wav = out / f"line{i + 1}.wav"
    sf.write(wav, samples, sr)
    # ricampiona a 48 kHz
    up = out / f"line{i + 1}_48k.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ar", str(SR_OUT), "-ac", "1", str(up)], check=True)
    s48, _ = sf.read(up, dtype="float32")
    dur = len(s48) / SR_OUT
    flag = "" if start + dur <= limit else "  <-- SFORA"
    print(f"line{i + 1}: {start:5.2f} -> {start + dur:5.2f} (max {limit})  {dur:.2f}s{flag}  {text}")
    a = int(start * SR_OUT)
    mix[a:a + len(s48)] += s48[: len(mix) - a]
peak = float(np.abs(mix).max())
mix = mix / peak * 0.89
sf.write(out / "voiceover.wav", mix, SR_OUT)
print("peak", round(peak, 3), "->", out / "voiceover.wav")
