# Stile «Motion causa → effetto» (storie e spot in 2D animato)

Stile approvato dall'utente il 22/11/2026 sulla storia in evidenza «Come funziona» v3
(`social/instagram/storie-in-evidenza/01-come-funziona/`). Regole di stile: `claude/STILE-MOTION.md` nel progetto.

Nasce dalla skill **Bang Motion** (Bang Tutorial, licenza MIT, https://github.com/bangtutorial/bang-motion):
una sola pagina `index.html` con GSAP, tutto il tempo scritto in UNA timeline, autoplay e loop.

## Cartella
- `modello-causa-effetto.html`: la storia v3, da copiare come punto di partenza (catena di scene, chiusura degli spot già pronta).
- `assets/`: `gsap.min.js`, `fraunces.woff2`, `inter.woff2`, `logo.svg`. Si copiano accanto a ogni nuovo `index.html`
  (niente CDN: il container della sessione non raggiunge jsdelivr).
- `snap.cjs`: fotogrammi di controllo. `export.cjs`: tutti i fotogrammi per l'MP4. Usano `playwright` (già installato nel container).

## Come si produce
1. Style brief + scaletta causa → effetto approvati dall'utente (regola della skill: niente codice prima).
2. Nuova cartella (es. `social/instagram/storie-in-evidenza/02-prenotazioni/`), copia di `modello-causa-effetto.html` come `index.html` + `assets/`.
3. Fotogrammi di controllo:
   `node strumenti/motion/snap.cjs $PWD/<cartella>/index.html shots 0.5 1.5 2.5 …` e si guardano (testi tagliati, sovrapposizioni, scene vuote).
4. MP4:
   `node strumenti/motion/export.cjs $PWD/<cartella>/index.html frames 30`
   `ffmpeg -framerate 30 -i frames/f%05d.png -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -movflags +faststart <nome>_v1.mp4`
5. Versioni vecchie in `archivio/` della cartella; `LEGGIMI.md` con testi e scelte.

La pagina espone `window.OPENER = {tl, DURATION, seek, W, H, ready}`; `?clean=1` niente autoplay (export), `?debug=1` barra per scorrere il tempo.

## Spot in stile Motion con voce (23/11, spot 50)
Uno spot da 15 s con voce si fa come una storia, ma nella cartella dello spot (`NN-nome-15s/`):
1. `spot.json` con le frasi e i `voce_inizio` (4 scene → `audio/line1..4.mp3`; la chiusura comune a 12,9 s si aggiunge da sola) ed `effetti.py`, come negli spot 3D.
   Scriverli sul PC **prima** di chiedere all'utente `spot.py importa-voci ~/Scaricati --sposta` (salta gli spot senza `spot.json`).
2. Pagina in `sorgente/index.html` con `assets/` accanto; tempi delle scene sui `voce_inizio`.
3. `NODE_PATH=$(npm root -g) node strumenti/motion/export.cjs $PWD/<spot>/sorgente/index.html frames 30`, poi
   `ffmpeg -framerate 30 -i frames/f%05d.png -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -movflags +faststart <spot>/sorgente/muto.mp4`.
4. `python3 strumenti/motore/audio.py <spot>`: mix C, due versioni in `export/` con i nomi della serie.
Attenzione: id unici nella pagina (nello spot 50 `#r2`/`#r3` erano sia i contenitori delle scene sia righe dell'elenco).

## Personaggio che parla e spot più lunghi di 15 s (23/11, prova 51)
- `bocca.py <spot>`: scrive `sorgente/bocca.js` (apertura della bocca a 4 livelli per fotogramma, larga o tonda, e i tratti di voce)
  dalle stesse frasi montate da `audio.py`, quindi la bocca va a tempo con il mix. Si lancia dopo aver messo le clip in `audio/`
  e prima di `export.cjs`; la pagina la carica con `<script src="bocca.js">`. Labiale dal volume, non per fonemi.
- Esempio di personaggio 2D (SVG con braccia a due segmenti, sguardo, battito, sopracciglia, pollice, telefono in mano):
  `51-prova-personaggio-20s/sorgente/index.html` (oggetti `G`, `POSE`, `CAM` e funzione `drawGuy`).
- Durata diversa da 15 s: `"durata"` e `"chiusura_inizio"` in `spot.json`; `audio.py` allunga la musica ripetendo le ultime
  4 battute e scrive i file con `_<durata>s_`. `controlli.py` e `spot.py` restano tarati su 15 s (non usarli per questi spot).
