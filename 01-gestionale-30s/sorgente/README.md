# Beaflow · SaaS animation (9:16, 30 s, 30 fps)

- `index.html` — tutte le scene e la timeline (testi, colori, tempi). Apri `index.html?play` in Chrome per l'anteprima.
- `render.py` — render in MP4: `python3 render.py segments && python3 render.py join`
  (richiede Python con Playwright, Google Chrome e ffmpeg; i font si installano con `npm install`).
- Per rifare una sola scena: `python3 render.py segments s3_booking && python3 render.py join`
