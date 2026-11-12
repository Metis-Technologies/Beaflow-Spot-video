# 05 · «Tutto in un'app» (15 s) — v1 prodotta, da approvare

Stile «Grafico» (`00-linee-guida/STILE.md`). Cambi scena a 0 · 3 · 5,5 · 8 · 10,5 · 13 s; stacco netto nero → crema a 3,0 s.
Il gancio dura 3 s perché la prima frase della voce non sta in 2,5 s.

| Scena | Tempo | Fondo | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 3 | nero | Agenda, cassa, clienti: / tre posti? · tre schede storte (Quaderno, Registratore, Rubrica) con i problemi in rosso | Agenda, cassa e clienti: tre posti? (0,05) |
| 2 | 3 – 5,5 | crema | Un'app sola per tutto. · le tre schede entrano in una sola app (Oggi: 18 appuntamenti, 1.240 €, 212 clienti) | Mettili insieme, in un'app sola. (3,05) |
| 3 | 5,5 – 8 | crema | Prenotazioni e incassi, insieme. · tre appuntamenti con «Pagato» | Prenotazioni e incassi, insieme. (5,55) |
| 4 | 8 – 10,5 | crema | Ogni cliente, con il suo storico. · scheda di Giulia R. con le ultime visite | Ogni cliente, con il suo storico. (8,05) |
| 5 | 10,5 – 13 | crema | A fine giornata, tutto torna. · incasso di oggi che sale a 1.240 € · «Chiusa» | A fine giornata, tutto torna. (10,55) |
| 6 | 13 – 15 | crema | Logo · Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Inizia gratis. (13,50) |

Voce Harrison (Eleven v4) accelerata dell'8%; `line6.mp3` («Inizia gratis.») è la stessa degli altri spot. Musica della serie a 120 BPM.
Rispetto al copione proposto, le frasi 1, 3 e 5 della voce sono state accorciate per stare nei tempi; le scritte a schermo sono quelle approvate.

Nota: cassa, magazzino e report sono funzioni del piano Pro; la chiusura resta «Inizia gratis» (Piano Free).
Nomi, orari, servizi e importi a schermo sono dati dimostrativi.

- `export/` — versione con musica e senza musica.
- `sorgente/` — `index.html` (animazione), `render.js`, `audio.py`, `package.json`.
- `audio/` — clip della voce `line1.mp3` … `line6.mp3`.

Rifare il video: `npm install` in `sorgente/`, poi `node render.js segments && node render.js join && python3 audio.py` (vedi `00-linee-guida/HANDOFF.md`).
