# 07 · «Cassa e magazzino» (15 s) — v2 prodotta, da approvare

Stile «Grafico» (`00-linee-guida/STILE.md`). Cambi scena a 0 · 2,5 · 5 · 8 · 10,5 · 13 s; stacco netto nero → crema a 2,5 s.
«Beaflow» compare scritto in scena 2; la voce non lo pronuncia.

| Scena | Tempo | Fondo | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 2,5 | nero | Cassa e magazzino / Non tornano? · «Cassa −40 €» e «Shampoo −3 pezzi» in rosso · «2 differenze» | Cassa e magazzino non tornano mai? (0,05) |
| 2 | 2,5 – 5 | crema | Con Beaflow, tutto collegato. · schede Cassa (1.180 €) e Magazzino (128) unite da un collegamento | Con un solo gestionale, sono collegati. (2,55) |
| 3 | 5 – 8 | crema | Vendi, e le giacenze scendono. · vendita al banco «Shampoo × 1 · 18 €» → «Pagato», giacenza 5 → 4 | Vendi, e le giacenze si aggiornano. (5,05) |
| 4 | 8 – 10,5 | crema | Sai sempre cosa c'è. · inventario aggiornato (Shampoo, Crema mani, Olio corpo, Gift card) | Sai sempre cosa c'è in magazzino. (8,05) |
| 5 | 10,5 – 13 | crema | Chiusura cassa in un attimo. · incasso 1.240 € (contanti 420, carta 820), «Tutto torna» | E la chiusura cassa è un attimo. (10,55) |
| 6 | 13 – 15 | crema | Logo · Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Beaflow. Inizia gratis. (12,90) |

Nota: la scritta di scena 2 doveva essere «Con Beaflow, cassa e magazzino insieme», ma a 112 px non entra nell'area utile.
Cassa (POS) e magazzino sono funzioni Pro; la chiusura resta «Inizia gratis». Nessun avviso di scorta bassa mostrato (non risulta tra le funzioni).
Nomi, prodotti e importi a schermo sono dati dimostrativi.

Rifare il video: `npm install` in `sorgente/`, poi `node render.js segments && node render.js join && python3 audio.py` (vedi `00-linee-guida/HANDOFF.md`).

Chiusura con il nome detto dalla voce («Beaflow. Inizia gratis.», 12,90 → 14,75 s), deciso il 12/11: video invariato, solo audio rifatto.
