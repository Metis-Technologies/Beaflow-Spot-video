# 04 · «Il telefono che squilla» (15 s) — v2 prodotta, da approvare

Primo spot nello stile «Grafico» (`00-linee-guida/STILE.md`). Cambi scena a 0 · 2 · 4,5 · 7 · 10 · 13 s; stacco netto nero → crema a 7,0 s.

| Scena | Tempo | Fondo | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 2 | nero | Squilla. · scheda «Cliente · Sta chiamando…» | Il telefono squilla. (0,05) |
| 2 | 2 – 4,5 | nero | E hai le mani occupate. · prima chiamata persa | E tu hai le mani occupate. (2,05) |
| 3 | 4,5 – 7 | nero | «Chiamate perse oggi» · contatore fino a 3 perse | Ogni chiamata persa, un cliente perso. (4,40) |
| 4 | 7 – 10 | crema | Ora prenotano da soli. · le tre righe diventano schede | Ora prenotano da soli, anche mentre lavori. (7,05) |
| 5 | 10 – 13 | crema | tre «Confermata» · 3 prenotazioni. 0 telefonate. | Tre prenotazioni, zero telefonate. (10,05) |
| 6 | 13 – 15 | crema | Logo · Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Inizia gratis. (13,50) |

Nomi uguali in gancio e svolta: Giulia R., Marco B., Sara T. (il «Numero sconosciuto» dell'anteprima è diventato Sara T.).
Riga «3 prenotazioni. 0 telefonate.» confermata.

Voce Harrison (Eleven v4) accelerata dell'8%. Musica della serie a 120 BPM. Effetti: squillo con vibrazione ogni secondo nel gancio, tonfo per ogni chiamata persa, il «ding» della serie su ogni «Confermata».

Nomi, orari, servizi e importi a schermo sono dati dimostrativi.

- `export/` — versione con musica e senza musica (v2: schede senza bordo; la v1 aveva il bordo di 3 px).
- `sorgente/` — `index.html` (animazione), `render.js` (ripresa e codifica), `audio.py` (voce, effetti, musica).
- `audio/` — clip della voce `line1.mp3` … `line6.mp3`.
- `stile/anteprime/` — i tre fotogrammi approvati.
- `stile/canvas/` — tavole del confronto fra i tre stili (A, B, C) e della versione corretta (C2).
- `stile/gen.py`, `stile/gen2.py` — script che hanno generato le tavole.

Rifare il video: `npm install` in `sorgente/`, poi `node render.js segments && node render.js join && python3 audio.py` (vedi `00-linee-guida/HANDOFF.md`).
