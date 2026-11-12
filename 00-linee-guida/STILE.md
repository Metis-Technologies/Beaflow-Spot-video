# Spot Beaflow · regole di stile «Grafico»

Approvato il 12 novembre 2026. Vale per i nuovi spot a partire da «Il telefono che squilla».
I primi spot («Agenda vuota», «Online in 5 minuti») usano lo stile precedente (crema, Noto Serif, ombre morbide).
Tutte le misure in px sono riferite al video a 1080×1920.

## 1. Formato

| Voce | Valore |
|---|---|
| Durata | 15 secondi |
| Formato | 9:16, 1080×1920, 30 fps (450 fotogrammi) |
| Ritmo | 120 BPM: i cambi di scena cadono su multipli di 0,5 s |
| Zone sicure | 250 px liberi in alto, 120 px a destra, 380 px in basso |
| Margine sinistro | 80 px |
| Area utile | x da 80 a 960, y da 250 a 1540 |

## 2. Colori

| Nome | Valore | Uso |
|---|---|---|
| Nero | `#111111` | Fondo del gancio; testo e bottoni sulle scene chiare |
| Bianco | `#FFFFFF` | Testo sul fondo nero; fondo delle schede sulle scene chiare |
| Crema | `#FBF8F4` | Fondo di svolta e chiusura |
| Ottone | `#775A18` | Solo dalla svolta in poi: etichette e conferme |
| Rosso | `#FF5A4F` | Solo nel gancio: il problema (es. chiamate perse) |
| Grigio chiaro | `#B5B5B5` | Testo secondario sul fondo nero |
| Grigio scuro | `#5F5F5F` | Testo secondario sul fondo crema |
| Divisori | `#3A3A3A` su nero | Linee fra le righe di un elenco |
| Scheda su nero | `#1E1E1E` | Fondo delle schede sul fondo nero (nessun bordo) |

Logica dei colori: il **problema** è nero con rosso, la **soluzione** è crema con ottone.
Rosso e ottone non compaiono mai nella stessa scena.

## 3. Caratteri

Misure riferite al video a 1080 px di larghezza.

| Elemento | Carattere | Misura |
|---|---|---|
| Logo «Beaflow» | Noto Serif corsivo 400 | 60 px in alto a sinistra; 208 px in chiusura |
| Titolo del gancio | Inter 800, spaziatura −4% | 176 px, interlinea 1 |
| Seconda riga del gancio | Inter 600, spaziatura −2% | 64 px |
| Titolo di scena | Inter 800, spaziatura −4% | 112 px, interlinea 1,04 |
| Etichetta maiuscola | Inter 700, spaziatura +12% | 32 px |
| Nomi e voci principali | Inter 600 | 48 px |
| Testo secondario | Inter 400–600 | 40 px (minimo ammesso) |
| Bottone | Inter 700 | 48 px |
| Riga dell'offerta | Inter 600 | 44 px |

Nessun testo sotto i 32 px. Numeri con cifre tabellari.

## 4. Bordi, angoli, ombre

- Schede senza bordo (aggiornato il 12 novembre 2026): fondo Scheda su nero `#1E1E1E` sul fondo nero, fondo bianco sulle scene chiare.
- Raggio degli angoli: 12 px per schede, bottoni ed etichette piene.
- Nessuna ombra e nessuna sfumatura di fondo.
- Stato positivo («Confermata»): etichetta piena ottone con testo bianco e spunta.
- Bottone principale: pieno nero, largo quanto l'area utile, alto 144 px.

## 5. Struttura delle scene

1. **Gancio** (fondo nero): logo, etichetta di contesto, titolo molto grande, il problema in rosso con un contatore.
2. **Svolta** (fondo crema): logo, etichetta ottone, titolo, gli stessi nomi del gancio diventati conferme.
3. **Chiusura** (fondo crema): logo grande, bottone «Inizia gratis», «Piano Free · 0 € per sempre», «beaflow.it».

Il logo resta in alto dal primo fotogramma. Il contenuto riempie l'area utile, senza lasciare vuota la metà bassa.

## 6. Testi

- Scritte a schermo: al massimo 6 parole, a schermo almeno 1,2 secondi.
- Tono calmo e diretto, senza punti esclamativi.
- Valgono per tutte le attività: non citare un solo mestiere. Come esempio generico si usa «Salone».
- Chiusura fissa: «Inizia gratis» e «Piano Free · 0 € per sempre».
- Nomi, orari e importi nelle schermate sono dati dimostrativi.

## 7. Voce, musica, effetti

- Voce: Eleven v4 «Harrison» (Higgsfield), accelerata dell'8%, pause sotto il mezzo secondo.
- La voce pronuncia «Beaflow» solo nella frase finale: «Beaflow. Inizia gratis.» (deciso il 12/11/2026; clip `line6.mp3` comune, inizio a 12,9 s). Nel resto dello spot il nome compare solo scritto.
- Musica: la stessa traccia strumentale a 120 BPM in tutta la serie, bassa sotto la voce.
- Suono ricorrente: lo stesso «ding» di notifica in ogni spot.

## 8. Movimento

| Tipo | Curva | Durata |
|---|---|---|
| Entrata | cubic-bezier(0.22, 1, 0.36, 1) | 0,4 s |
| Uscita | cubic-bezier(0.4, 0, 1, 1) | 0,3 s |
| Rimbalzo | molla 420 / 26 | notifiche, etichette, spunte |
| Molla morbida | molla 260 / 30 | schede, bottoni, interruttori |
| Titoli | parola per parola, 0,05 s di scarto | salita di 24 px |

- Nessuno stacco secco: ogni scena passa alla successiva con un oggetto che si trasforma.
- Fa eccezione il passaggio nero → crema fra gancio e svolta, che deve essere netto e cadere sul battito.
- Al massimo tre elementi in movimento nello stesso istante.
- Le scritte non si muovono mentre devono essere lette.
