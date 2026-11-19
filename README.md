# Beaflow · Spot video

Archivio di lavoro degli spot motion design 9:16 per Beaflow: regole, testi, sorgenti, audio e video finali.

## Struttura

```
00-linee-guida/        documenti storici (stile «Grafico», primo metodo di produzione)
01 … 15                spot 2D, stile «Grafico»
16 … 40                spot Premium 3D (16 scuro, dal 17 variante chiara)
25-agenda-piena-<settore>-15s/   versioni di settore di uno spot base
comune/                musica della serie, logo, frase di chiusura della voce
strumenti/             motore comune e script per creare, renderizzare e controllare gli spot
consegne/              zip da inviare (fuori da git)
```

Stato e prossimi spot: `claude/AVANZAMENTO-3D.md` nel progetto Claude. Regole: `claude/REGOLE-PROGETTO.md`.

Ogni cartella di spot ha la stessa forma:

| Cosa | Contenuto |
|---|---|
| `spot.json` | testi, voce, tempi, ossatura (spot nuovi: è la fonte di tutto) |
| `scena.js`, `effetti.py` | parte 3D e effetti sonori dello spot (spot nuovi) |
| `testi.md` | tempi delle scene, testi a schermo, frasi della voce (negli spot nuovi è generato da `spot.json`) |
| `sorgente/` | pagina HTML dell'animazione (negli spot fino al 40 anche la loro copia degli script) |
| `audio/` | clip della voce (`line1.mp3` …) |
| `export/` | video finali |
| `export/archivio/` | versioni superate |

Nomi dei video: `beaflow_<spot>_<durata>_<variante>_v<numero>.mp4`

## Produrre uno spot

```bash
bash strumenti/prepara.sh                                  # una volta per sessione
python3 strumenti/spot.py nuovo 41 nome-spot --titolo "Titolo" --ossatura A --da 40-chiusura-cassa-15s
python3 strumenti/spot.py costruisci 41-nome-spot-15s      # dopo aver scritto spot.json
python3 strumenti/spot.py fotogrammi 41-nome-spot-15s      # dopo aver scritto scena.js
python3 strumenti/spot.py tutto 41-nome-spot-15s           # render, audio, controlli, video in export/
```

Tutti i passi, i campi di `spot.json` e i controlli: `strumenti/README.md`.

## Prima volta sul computer

```bash
git clone https://github.com/Metis-Technologies/beaflow-spot-video.git
cd beaflow-spot-video
bash strumenti/prepara.sh
```

## Uso di tutti i giorni

```bash
git pull                                              # prima di lavorare
git add -A && git commit -m "cosa è cambiato" && git push   # dopo
```

Quando Claude produce un nuovo spot dalla chat, carica i file su un ramo del repository: si unisce a `main` da GitHub e poi si fa `git pull` sul computer.

## Cosa non entra nel repository

`node_modules/`, fotogrammi di controllo, clip intermedie, file `.wav`, video intermedi in `sorgente/` e la cartella `consegne/` (vedi `.gitignore`). Per rifare il render di uno spot fino al 40: `npm install` dentro la sua `sorgente/`, poi i comandi indicati in `00-linee-guida/HANDOFF.md`.

I video pesano pochi megabyte e stanno nel repository come file normali. GitHub avvisa sopra i 50 MB per file e blocca sopra i 100 MB: se un video supera queste soglie va gestito con Git LFS.
