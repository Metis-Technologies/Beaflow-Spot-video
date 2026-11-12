# 12 · «Pagamenti» (15 s) — v1 prodotta, da approvare

Stile «Grafico» (`00-linee-guida/STILE.md`), logo vero. Cambi scena a 0 · 2,5 · 5 · 8 · 10,5 · 13 s; stacco netto nero → crema a 2,5 s.
«Beaflow» compare scritto in scena 2 e nella chiusura; la voce lo dice solo nella frase finale.

| Scena | Tempo | Fondo | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 2,5 | nero | Fine giornata: / Chi ha pagato? · «Oggi»: Giulia R. ?, Marco B. da pagare, Anna S. acconto? (rosso) · «3 incassi da controllare» | Chi ha pagato, e quanto? (0,05) |
| 2 | 2,5 – 5 | crema | Paga come / vuole, con / Beaflow. · Online (alla prenotazione) e In sede (al banco), con spunte | Il cliente paga come preferisce. (2,55) |
| 3 | 5 – 8 | crema | Online, già alla prenotazione. · Trattamento viso, sabato 10:00, 45,00 € · «Paga e prenota» → «Pagato» | Online, già quando prenota. (5,05) |
| 4 | 8 – 10,5 | crema | Oppure in sede, al banco. · Cassa: Manicure, 25,00 € · Contanti / Carta → «Incassato» | Oppure in sede, al banco. (8,05) |
| 5 | 10,5 – 13 | crema | Ogni incasso, al suo posto. · Incassi di oggi: Online 135 €, In sede 210 €, Totale 345 € | E ogni incasso è già al suo posto. (10,40) |
| 6 | 13 – 15 | crema | Logo · Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Beaflow. Inizia gratis. (12,90) |

Da verificare sul prodotto prima di pubblicare: metodo di pagamento registrabile in cassa (contanti/carta) e riepilogo incassi diviso online / in sede (se è una funzione Pro, va bene ma la chiusura invita al Free).
Nomi, servizi e importi a schermo sono dati dimostrativi.

Rifare il video: `npm install` in `sorgente/`, poi `node render.js segments && node render.js join && python3 audio.py` (vedi `00-linee-guida/HANDOFF.md`).
