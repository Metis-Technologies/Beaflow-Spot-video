# 06 · «Turni senza confusione» (15 s) — v2 prodotta, da approvare

Stile «Grafico» (`00-linee-guida/STILE.md`). Cambi scena a 0 · 2,5 · 5 · 8 · 10,5 · 13 s; stacco netto nero → crema a 2,5 s.
Il nome «Beaflow» compare scritto in due scene (2 e 5); la voce non lo pronuncia.

| Scena | Tempo | Fondo | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 2,5 | nero | Chi lavora / sabato? · tre messaggi del gruppo del team · «Turni da sistemare» con contatore rosso | Chi lavora sabato? Nessuno lo sa. (0,05) |
| 2 | 2,5 – 5 | crema | Con Beaflow, turni chiari per tutti. · i messaggi diventano la griglia dei turni della settimana | Con i turni in agenda, è tutto chiaro. (2,55) |
| 3 | 5 – 8 | crema | Ognuno vede la sua agenda. · la riga di Marco diventa la sua agenda di oggi | Ognuno vede i suoi appuntamenti. (5,05) — v2: rigenerata con «Ognùno» per la pronuncia |
| 4 | 8 – 10,5 | crema | Si prenota solo chi è libero. · sabato 10:00: Giulia e Sara «Libera», Marco «Non disponibile» → «Confermata» | I clienti prenotano solo chi è libero. (8,05) |
| 5 | 10,5 – 13 | crema | Provvigioni? Le calcola Beaflow. · provvigioni di novembre che salgono (totale 840 €) | E le provvigioni si calcolano da sole. (10,55) |
| 6 | 13 – 15 | crema | Logo · Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Inizia gratis. (13,50) |

Voce Harrison (Eleven v4) accelerata dell'8%; `line6.mp3` è la stessa degli altri spot. Musica della serie a 120 BPM.

Nota: team e provvigioni sono funzioni del piano Pro (il Free ha 2 operatori). Turni per operatore e prenotazione solo sugli operatori liberi sono stati dati per confermati: verificarli sul prodotto prima di pubblicare.
Nomi, orari e importi a schermo sono dati dimostrativi.

Rifare il video: `npm install` in `sorgente/`, poi `node render.js segments && node render.js join && python3 audio.py` (vedi `00-linee-guida/HANDOFF.md`).

v2: solo la frase 3 rigenerata (in v1 «ognuno» suonava inglese); video invariato. La v1 è in `export/archivio/` e la vecchia frase in `audio/archivio-v1/line3.mp3`.
