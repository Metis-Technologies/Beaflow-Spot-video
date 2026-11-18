# 16 · «Tutto si trasforma» (15 s) — v1 in lavorazione

Primo spot in stile «Premium 3D» (`claude/STILE-PREMIUM-3D.md` nel progetto): Three.js, camera sempre in movimento, 48 tessere che si trasformano da una scena all'altra, glow (bloom), fondo scuro per tutto lo spot, luci oro `#C9B16C`.
Cambi scena a 0 · 2,5 · 5 · 7,5 · 10 · 12,5 s; lampo sul battito a 2,5 s (rosso → oro) e a 12,85 s (implosione → logo).

| Scena | Tempo | Cosa si vede | Testo a schermo | Voce (inizio) |
|---|---|---|---|---|
| 1 | 0 – 2,5 | fogli sparsi in volo, luce rossa | Agenda, cassa, clienti? · Tutto sparso. | Agenda, cassa, clienti? (0,05) |
| 2 | 2,5 – 5 | i fogli implodono in un anello d'oro | Tutto in un'app sola. | Ora tutto in un'app sola. (2,60) |
| 3 | 5 – 7,5 | l'anello diventa un'agenda, gli appuntamenti si accendono | Prenotano online, 24 ore su 24. | Ti prenotano online, giorno e notte. (5,00) |
| 4 | 7,5 – 10 | l'agenda diventa un grafico che sale | Incassi e clienti, sempre chiari. · Incassi di oggi € 1.240 | Incassi e clienti, sempre chiari. (7,60) |
| 5 | 10 – 12,5 | sfera di tessere che pulsa, notifica | Nuova prenotazione · Salone · domani, 10:30 · Confermata | Il salone lavora anche per te. (10,10) |
| 6 | 12,5 – 15 | implosione, logo con alone d'oro | Logo · Inizia gratis · Piano Free · 0 € per sempre · beaflow.it | Beaflow. Inizia gratis. (12,90, clip comune) |

Frasi 1 e 4 rigenerate più corte (le prime versioni duravano 3,6 e 3,1 s).
Voci 1–5 generate su Higgsfield il 17/11 e scaricate dal browser integrato (il container non raggiunge cloudfront).

Rifare il video: `npm install` in `sorgente/` (three, @fontsource/inter, playwright), poi `node render.js segments && node render.js join && python3 audio.py`.
La pagina va servita via http (lo fa `render.js`); WebGL software, circa 45 s per scena.

## v2 e v3 (18/11): calendario

Stessi testi, voce e tempi della v1. Le tessere portano i numeri dei giorni (atlante di cifre su piani istanziati sopra le tessere).
- **v2** (`render.js` con `VAR=a`): nella scena 3 le tessere compongono un calendario mensile 3D (iniziali L M M G V S D, 31 giorni, barra e due anelli della spirale); i giorni prenotati si accendono d'oro uno dopo l'altro; sul battito di 7,5 s la pagina si sfoglia attorno agli anelli e i giorni diventano le barre del grafico.
- **v3** (`VAR=b`): come la v2, in più fogli del calendario strappati nella scena 1, ruota dei 31 giorni numerati nella scena 2 e alone di giorni attorno al logo in chiusura.

Rifare: `VAR=a node render.js segments && node render.js join && python3 audio.py` (v2), idem con `VAR=b` (v3).
