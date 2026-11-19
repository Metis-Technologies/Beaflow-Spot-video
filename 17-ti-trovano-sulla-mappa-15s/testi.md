# 17 · «Ti trovano sulla mappa» (15 s) · Premium 3D, variante chiara

Piano: `claude/PIANO-30-SPOT.md` (spot 17). Stile: `claude/STILE-PREMIUM-3D.md` §6 (variante chiara).
Cambi scena a 0 · 2,5 · 5 · 7,5 · 10 · 12,5 s.

| Scena | Tempo | Cosa si vede | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 2,5 | città di isolati bianchi che sale, radar rosso, segnaposto neri degli altri saloni | Ti cercano. · Ti trovano? | Ti cercano. Ma ti trovano? (0,05) |
| 2 | 2,5 – 5 | il tuo segnaposto d'oro cade sul battito con onda d'urto, cresce e illumina la città; picchiata della camera | Con Beaflow sei su Esplora. | Su Esplora, il tuo salone c'è. (2,60) |
| 3 | 5 – 7,5 | il segnaposto si apre nella scheda del salone; anello bianco, nero e oro dietro; tocco su «Prenota» | Servizi e prezzi in vetrina. · Il tuo salone ★ 4,9 · Servizio base 30 min 20,00 € · Servizio completo 1 h 45,00 € | Servizi e prezzi, in vetrina. (5,00) |
| 4 | 7,5 – 10 | griglia di fasce orarie nere, il tocco ne accende una d'oro | Prenotano con un tocco. | Prenotano con un tocco. (7,60) |
| 5 | 10 – 12,5 | sfera di tessere che pulsa, notifica | Nuova prenotazione · Il tuo salone · sabato, 10:30 · Confermata | E tu lo sai subito. (10,10) |
| 6 | 12,5 – 15 | implosione, logo positivo con alone | Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Beaflow. Inizia gratis. (12,90, clip comune) |

Dati della scheda dimostrativi. Variante scura: `TEMA=scuro node render.js segments`.
Rifare: `node render.js segments && node render.js join && python3 audio.py` (pagina servita via http da `render.js`).
