# Beaflow · Spot video

Archivio di lavoro degli spot motion design 9:16 per Beaflow: regole, testi, sorgenti, audio e video finali.

## Struttura

```
00-linee-guida/                 regole valide per tutti gli spot
  STILE.md                      stile «Grafico» approvato
  HANDOFF.md                    tecnologie e metodo di produzione
  istruzioni-progetto.md        istruzioni del progetto Claude
  brief-collaboratore-esplora.md
01-gestionale-30s/              consegnato
02-agenda-vuota-15s/            v2 con logo, da riapprovare
  archivio-esplora-20s/         prima versione da 20 s, scartata
03-online-in-5-minuti-15s/      v2 con logo, da riapprovare
04-telefono-che-squilla-15s/    approvato (v5)
05-tutto-in-un-app-15s/         v3 da approvare
06-turni-team-15s/               approvato (v4)
07-cassa-magazzino-15s/         v3 da approvare
08-riprenditi-il-tempo-15s/     v2 da approvare
09-falli-tornare-15s/            v1 da approvare
10-addio-post-it-15s/            v1 da approvare
11-scheda-cliente-15s/           v1 da approvare
12-pagamenti-15s/                v1 da approvare
13-lista-attesa-15s/             v1 da approvare
comune/musica/                  base musicale della serie (120 BPM)
comune/logo/                    logo Beaflow SVG (negativo e positivo)
strumenti/                      script di servizio
```

Ogni cartella di spot ha la stessa forma:

| Cosa | Contenuto |
|---|---|
| `testi.md` | stato, tempi delle scene, testi a schermo, frasi della voce |
| `sorgente/` | pagina HTML dell'animazione e script di render e audio |
| `audio/` | clip della voce (`line1.mp3` …) |
| `export/` | video finali |
| `export/archivio/` | versioni superate |

Nomi dei video: `beaflow_<spot>_<durata>_<variante>_v<numero>.mp4`

## Prima volta sul computer

```bash
git clone https://github.com/Metis-Technologies/beaflow-spot-video.git
cd beaflow-spot-video
bash strumenti/importa-spot-15s.sh     # sorgenti, audio e video dei due spot da 15 s
git add -A && git commit -m "Aggiunge gli spot da 15 s" && git push
```

Su Windows lo script va lanciato da Git Bash.

## Uso di tutti i giorni

```bash
git pull                                              # prima di lavorare
git add -A && git commit -m "cosa è cambiato" && git push   # dopo
```

Quando Claude produce un nuovo spot dalla chat, carica i file su un ramo del repository: si unisce a `main` da GitHub e poi si fa `git pull` sul computer.

## Cosa non entra nel repository

`node_modules/`, fotogrammi di controllo, clip intermedie, file `.wav` e video intermedi in `sorgente/` (vedi `.gitignore`). Per rifare un render: `npm install` dentro `sorgente/`, poi i comandi indicati in `00-linee-guida/HANDOFF.md`.

I video pesano pochi megabyte e stanno nel repository come file normali. GitHub avvisa sopra i 50 MB per file e blocca sopra i 100 MB: se un video supera queste soglie va gestito con Git LFS.
