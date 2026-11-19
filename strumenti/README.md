# Strumenti · come si produce uno spot Premium 3D

Motore comune, modello della pagina e script per creare, renderizzare e controllare gli spot.
Le regole (testi, voce, stile, consegna) stanno nel progetto Claude: `claude/REGOLE-PROGETTO.md`, `claude/FUNZIONI.md`, `claude/AVANZAMENTO-3D.md`. Qui c'è solo il «come si fa».

## Una volta per sessione

```bash
bash strumenti/prepara.sh        # Three.js, font, librerie Python, browser: una sola installazione per tutti gli spot
```

## Uno spot, dall'inizio alla fine

| Passo | Comando | Cosa produce |
|---|---|---|
| 1 · Cartella | `python3 strumenti/spot.py nuovo 41 sai-sempre-cosa-ce --titolo "Sai sempre cosa c'è" --ossatura A --da 40-chiusura-cassa-15s` | `41-sai-sempre-cosa-ce-15s/` con `spot.json`, `scena.js`, `effetti.py` (copiati dallo spot indicato con `--da`, o dallo scheletro) |
| 2 · Copione | si scrive `spot.json`, poi `python3 strumenti/spot.py costruisci 41-…` | controlla le regole dei testi; genera `sorgente/index.html` e `testi.md` |
| 3 · Voci | `python3 strumenti/spot.py voci 41-… 42-… 43-…` | le frasi da mandare a Higgsfield, già a gruppi di 4, con il file di destinazione e il nome con cui scaricarle |
| 3b · Clip | `python3 strumenti/spot.py scarica 41-… 1=<url> 2=<url>` oppure `python3 strumenti/spot.py importa-voci ~/Scaricati --sposta` | le clip in `audio/line1…5.mp3`, controllate una per una (vedi sotto) |
| 3c · Tempi | `python3 strumenti/spot.py tempi 41-…` | inizio e fine reali di ogni frase, senza render: chi sfora la scena si vede subito (parte da solo dopo `scarica` e `importa-voci`) |
| 4 · Scena | si scrive `scena.js`, poi `python3 strumenti/spot.py fotogrammi 41-…` | `sorgente/sheet.jpg`: 13 fotogrammi da guardare prima del render |
| 5 · Render | `python3 strumenti/spot.py render 41-…` (una scena sola: `render 41-… s3`) | `sorgente/muto.mp4` |
| 6 · Audio | si scrive `effetti.py`, poi `python3 strumenti/spot.py audio 41-…` | i due video in `export/` con i nomi della serie; stampa i tempi di ogni frase |
| 7 · Controlli | `python3 strumenti/spot.py controlli 41-…` | esito dei controlli e `sorgente/controllo.jpg` |

`python3 strumenti/spot.py tutto 41-…` fa i passi 5, 6 e 7 di fila.

Tempi misurati (container a 2 core, senza scheda grafica): fotogrammi 11 s, render dei 15 s circa 3 minuti, audio e controlli meno di un minuto.

## Portare le clip della voce in `audio/`

I link delle clip generate da Higgsfield non si raggiungono dal container cloud delle sessioni. Due strade:

- **Con un terminale sul computer** (rete libera): `spot.py scarica <spot> 1=<url> 2=<url> …` scrive direttamente `audio/line1.mp3`, `line2.mp3`… Nessun passaggio dalla cartella dei download.
- **Senza terminale**: le clip si scaricano col browser integrato, con i nomi indicati da `spot.py voci` (`beaflow_<cartella-spot>_line<N>.mp3`). Poi `spot.py importa-voci <cartella dei download> --sposta` le mette al posto giusto e le toglie dai download. I file rimasti con nome temporaneo (`.org.chromium.Chromium.*`) vengono elencati con dimensione e durata, da sistemare a mano.

In entrambi i casi un file che non è un audio valido (scaricamento incompleto) viene rifiutato.

## I tre file di uno spot

**`spot.json`** — testi, voce e dati. È l'unica fonte: `testi.md` e i titoli della pagina si generano da qui.

```json
{
  "numero": 40, "nome": "chiusura-cassa", "titolo": "Chiusura cassa in un attimo",
  "ossatura": "A", "tema": "chiaro", "versione": 1, "seme": 401,
  "funzione": "cassa (Pro)", "note": "Importi dimostrativi.",
  "scene": [
    { "schermo": ["Chiudere", "la cassa?"], "accento": ["Mezz'ora."],
      "voce": "Chiudere la cassa? Mezz'ora.", "voce_inizio": 0.05, "si_vede": "scontrino che scende…" }
  ],
  "dati": {}
}
```

- `scene`: sempre 5 (la sesta è la chiusura comune). `schermo` è una riga per elemento: gli a capo si decidono qui. `accento` è la riga colorata del gancio. Solo nella scena 1, `gancio_px` e `accento_px` (da 96 a 112) rimpiccioliscono un gancio lungo, come nelle versioni di settore.
- `ossatura`: `A` problema → soluzione (accento e luce rossi fino a 2,5 s, poi oro) · `B` dimostrazione · `C` numero o risultato (per B e C niente rosso: luce oro dall'inizio, accento ottone).
- `voce_tts` (facoltativo): grafia da mandare alla voce quando è diversa da quella da leggere (es. «Ognùno»); `pronuncia`: aiuto aggiunto al prompt.
- `versione`: per una correzione si alza il numero; il video precedente si sposta in `export/archivio/`. Lo script non sovrascrive mai un video già in `export/` (serve `--sovrascrivi`).
- `dati`: valori liberi che `scena.js` legge come `SPOT.dati` (etichette, prezzi dimostrativi): utile per le versioni di settore.

**`scena.js`** — solo la parte 3D dello spot: formazioni delle tessere (`F`), trasformazioni (`TR`), camera (`camAt`), oggetti extra e `render3d(t)`. Lo scheletro commentato è `motore/scena-base.js`. In `TR` un quinto elemento `{arco:0}` toglie l'arco alle tessere di quella trasformazione. Se servono, `scena.css`, `scena.html` e `timeline.js` aggiungono stile, elementi e animazioni 2D alla pagina.

**`effetti.py`** — gli effetti sonori, uno per ogni evento visivo: `def effetti(s, a)`. Lo scheletro è `motore/effetti-base.py`.

## Chiusura e mix audio

- **Chiusura** (scelta dall'utente il 19/11): niente anello di tessere; le tessere spariscono nel punto dell'implosione e sotto il logo si disegna un filo oro. È il valore `"chiusura": "linea"` di `riferimento.json`. Altri valori, anche per un solo spot con `"chiusura"` in `spot.json`: `pulita` (solo il logo), `tessere` (nove tessere oro in fila), `alone` (luce calda dietro il logo), `anello` (com'era fino al lotto A). Prova rapida senza cambiare nulla: `CHIUSURA=tessere node strumenti/motore/render.js <spot> stills 14.6`.
- **Profilo del mix** in `riferimento.json` → `audio.profilo`: `chiaro-brillante` (in uso, scelto dall'utente all'ascolto il 19/11: musica ed effetti si abbassano mentre la voce parla, e la voce è filtrata per essere più nitida), `chiaro` (uguale, senza filtri sulla voce), `attuale` (come gli spot fino al lotto A). `audio` stampa di quanti dB la voce sta sopra il resto. Prova senza cambiare l'impostazione: `python3 strumenti/motore/audio.py <spot> --profilo=attuale`.

## Versioni di settore e ganci alternativi

```bash
python3 strumenti/spot.py nuovo --variante-di 41-sai-sempre-cosa-ce-15s --settore barbieri
```

Crea `41-sai-sempre-cosa-ce-barbieri-15s/` con un `spot.json` che contiene solo ciò che cambia (di solito la scena 1 e qualche valore in `dati`). Scena, effetti e le voci non cambiate si ereditano dallo spot base: si genera una sola frase nuova. Lo stesso comando con `--settore gancio-b` serve per provare un secondo gancio nelle sponsorizzate.

## Controlli già al momento di `costruisci`

- **Copione**: le stesse regole dei testi di `controlli`, più una stima della durata di ogni frase (circa 16 caratteri al secondo, più 0,3 s per ogni pausa): avvisa se rischia di sforare la scena, prima ancora di generare la voce.
- **Sintassi della pagina**: se `scena.js` ha un errore o ridichiara un nome già usato dal modello, `costruisci` si ferma e indica la riga di `scena.js`.
- **Spot già consegnati con la loro `sorgente/`** (fino al 40): `costruisci`, `fotogrammi` e `render` non riscrivono più la loro pagina né `testi.md`. Per rifarli dal modello attuale serve `costruisci --rigenera`.

## Cosa controlla `controlli`

| Controllo | Errore o avviso quando |
|---|---|
| Copione | più di 6 parole a schermo, punti esclamativi, «Beaflow» detto fuori da «Con Beaflow, …» e dalla chiusura, voce che parte fuori dalla sua scena, numeri in cifre nella voce, un solo mestiere in uno spot generico, parole del lessico di pronuncia |
| Zone sicure | un testo o il logo esce da 80 / 120 / 250 / 380 px, o una riga va a capo da sola perché è troppo lunga |
| Voce | una frase finisce dopo l'inizio della successiva o oltre il cambio scena; manca una clip |
| Video | non è 1080×1920, 30 fps, 15 s, h264 + aac; manca una delle due versioni |
| Momenti vuoti | primo fotogramma, cambi scena o metà scena quasi senza contenuto |
| Volume | più di 1 LU di differenza dalla serie (−15,6 LUFS) o picco troppo alto |

Non può controllare: pronuncia e volumi all'ascolto, funzioni mostrate, titoli che toccano gli oggetti 3D. Il foglio `controllo.jpg` va sempre guardato.

## File di questa cartella

| File | A cosa serve |
|---|---|
| `spot.py` | comando unico (`nuovo`, `costruisci`, `voci`, `scarica`, `importa-voci`, `tempi`, `fotogrammi`, `render`, `audio`, `controlli`, `tutto`) |
| `controlli.py` | i controlli automatici |
| `pronuncia.json` | parole difficili per la voce e rimedi: si aggiorna a ogni correzione di pronuncia |
| `riferimento.json` | soglie dei controlli (volume della serie, fotogrammi vuoti) |
| `motore/modello.html` | pagina comune: stile, motore 2D e 3D, tessere, luci, chiusura con logo |
| `motore/render.js` | ripresa fotogramma per fotogramma, due scene insieme, unione |
| `motore/audio.py` | voce, effetti, musica, mix, export |
| `motore/scena-base.js`, `motore/effetti-base.py` | scheletri per uno spot nuovo |
| `importa-spot-15s.sh` | vecchio script di importazione degli spot 02 e 03 |
| `build.py`, `scaffold.py`, `settore25.py`, `scene/` | script usati per gli spot 34–40 e per le versioni di settore del 25: hanno percorsi legati al container di quella sessione e partono dallo spot 33. Restano come archivio: per gli spot nuovi si usa `spot.py`, che fa lo stesso lavoro (stessa divisione fra modello e scena) senza percorsi fissi |

Una modifica a `motore/` vale per tutti gli spot costruiti dopo. Gli spot fino al 40 restano riproducibili dalla loro `sorgente/` (hanno la loro copia del motore); i 34, 35, 36, 39 e 40 sono anche convertiti al nuovo formato (`spot.json`, `scena.js`, `effetti.py`): ricostruiti con questi strumenti danno la stessa pagina e gli stessi effetti sonori degli originali, quindi possono fare da base per versioni di settore o da partenza per uno spot nuovo (`--da`).
