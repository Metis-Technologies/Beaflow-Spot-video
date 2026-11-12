# 04 · «Il telefono che squilla» (15 s) — v4 approvata (chiusura con «Beaflow»)

Stile «Grafico» (`00-linee-guida/STILE.md`). Cambi scena a 0 · 2,5 · 5 · 8 · 10,5 · 13 s; stacco netto nero → crema a 2,5 s.
La v3 sostituisce la v2 con un copione centrato sulle prenotazioni online (anche a salone chiuso) e sulla notifica.

| Scena | Tempo | Fondo | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 2,5 | nero | Squilla / mentre lavori? · scheda «Cliente · Sta chiamando…» · 3 chiamate perse in rosso | Il telefono squilla mentre lavori? (0,05) |
| 2 | 2,5 – 5 | crema | Ti prenotano online, da soli. · le tre righe diventano schede «Confermata» | I clienti prenotano online, da soli. (2,55) |
| 3 | 5 – 8 | crema | Anche di sera, a salone chiuso. · orologio 22:57 → 23:00 · «Prenotazioni aperte» · nuova scheda confermata | Anche di sera, quando sei chiuso. (5,05) |
| 4 | 8 – 10,5 | crema | Nuova prenotazione · notifica che scende · «Agenda di domani» con la riga «Nuova» | E a te arriva solo la notifica. (8,05) |
| 5 | 10,5 – 13 | crema | Tu pensa solo al cliente. · agenda di domani piena · «Agenda piena. 0 telefonate.» | Tu resti concentrato sul cliente. (10,55) |
| 6 | 13 – 15 | crema | Logo · Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Beaflow. Inizia gratis. (12,90) |

Voce Harrison (Eleven v4) accelerata dell'8%; `line6.mp3` («Inizia gratis.») è la stessa della v2. Musica della serie a 120 BPM.
Effetti: squillo con vibrazione nel gancio, tonfo per ogni chiamata persa, il «ding» della serie su ogni «Confermata» e sulla notifica, tic sul cambio dei minuti.

Nomi, orari e servizi a schermo sono dati dimostrativi.

- `export/` — v3 con musica e senza musica; la v2 è in `export/archivio/`.
- `audio/` — voce v3 (`line1.mp3` … `line6.mp3`); le clip della v2 sono in `audio/archivio-v2/`.
- `sorgente/` — `index.html`, `render.js`, `audio.py` della v3 (la v2 è nella storia git).

Rifare il video: `npm install` in `sorgente/`, poi `node render.js segments && node render.js join && python3 audio.py` (vedi `00-linee-guida/HANDOFF.md`).

Chiusura con il nome detto dalla voce («Beaflow. Inizia gratis.», 12,90 → 14,75 s), deciso il 12/11: video invariato, solo audio rifatto.
