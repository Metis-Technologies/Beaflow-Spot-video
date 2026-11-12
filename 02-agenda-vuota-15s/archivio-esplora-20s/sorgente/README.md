# Spot Beaflow · Esplora (9:16, 20 s, 30 fps)

- `index.html` — le 6 scene e la timeline (testi, colori, tempi, curve del brief). Anteprima: apri `index.html?play` in Chrome.
- `render.py` — render fotogramma per fotogramma: `python3 render.py segments && python3 render.py join`
  (Python con Playwright, Google Chrome, ffmpeg; font con `npm install`). Una sola scena: `python3 render.py segments s2_mappa && python3 render.py join`
- `audio.py` — effetti sonori sintetizzati + clip vocali in `vo/` (line1…line7.mp3), poi montaggio sul video.
- I cambi di scena cadono su 0 · 2,5 · 7 · 11 · 15 · 17,5 s (battiti a 120 BPM): la musica si può agganciare in montaggio.
