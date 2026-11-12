# HANDOFF · Spot motion design da codice (HTML → MP4) con voce e musica

Documento di passaggio del lavoro fatto per Beaflow (novembre 2026), scritto per rifare lo stesso tipo di video su un altro prodotto. Chi lo legge non ha visto la chat originale: qui c'è tutto quello che serve.

**Kit con i sorgenti reali** (due spot completi: HTML, script di render, script audio, clip voce, musica):
https://d2ol7oe51mr4n9.cloudfront.net/user_3LsB4XoxzLiS0ETnC5BLa6AO1hD/f48cb638-53dd-45df-9189-5bcdfbc57bdd.zip

Il codice riportato in questo documento è copiato da quei file. In caso di differenze, vale il kit.

---

## 1. Cosa si ottiene

Spot verticali 9:16 (1080×1920, 30 fps, 15 secondi) in stile motion design: titoli animati, schede dell'interfaccia ricostruite, cursore, notifiche, logo e pulsante finale. Voce italiana sintetica, effetti sonori, base musicale. Ogni spot esce in due versioni: con musica e senza.

Fatti finora per Beaflow:

| Spot | Durata | Stato |
|---|---|---|
| Gestionale (primo video) | 30 s | consegnato |
| «Agenda vuota il martedì?» (Esplora) | 15 s | approvato |
| «Online in 5 minuti» | 15 s | approvato |
| «Il telefono che squilla» | 15 s | stile approvato, video da produrre |

## 2. Perché questa strada

La richiesta iniziale era un'animazione in After Effects tramite Higgsfield (`/saas-animation`). Non era fattibile: After Effects non è installato sul PC e il ponte Higgsfield richiede il plugin Adobe. La soluzione è stata scrivere l'animazione come pagina HTML e filmarla fotogramma per fotogramma. Vantaggi: nessun software da installare, ogni modifica è una riga di codice, il risultato è identico a ogni render.

## 3. Tecnologie

| Parte | Strumento |
|---|---|
| Animazione | Una pagina `index.html` (HTML + CSS + JavaScript puro, nessuna libreria) con un piccolo motore a timeline |
| Font | Inter e Noto Serif da `@fontsource` (npm), caricati in locale |
| Ripresa | Playwright con Chromium headless: per ogni fotogramma chiama `seek(t)` e fa uno screenshot JPEG |
| Codifica video | ffmpeg, `libx264 -crf 17 -preset medium -pix_fmt yuv420p`, 30 fps |
| Voce | Higgsfield, modello `elevenlabs_v4`, voce preset «Harrison» |
| Musica | Higgsfield, modello `elevenlabs_music_v2_5`, traccia strumentale a 120 BPM |
| Effetti sonori | Sintetizzati in Python con numpy (nessun file esterno) |
| Mix audio | Python (numpy + soundfile), poi ffmpeg per unire audio e video (AAC 192 kb/s) |
| Ambiente | Sandbox cloud di Higgsfield (`sandbox_exec`): Node 22, Playwright, ffmpeg, ImageMagick, Python con numpy e soundfile |
| Proposte di stile | Canvas Claude Design (tavole statiche) + tre agenti revisori |

Costi Higgsfield osservati: voce circa 0,3 crediti a frase, musica 2,18 crediti a traccia. Uno spot da 6 frasi costa circa 2 crediti se riusa la musica, circa 4 con una traccia nuova.

## 4. Vincoli dell'ambiente (importanti)

- **Rete.** La sandbox di Claude non raggiunge i server Higgsfield né i link `cloudfront`. La sandbox Higgsfield sì. Per questo tutto il lavoro (render, download delle voci, mix, caricamento) si fa dentro la sandbox Higgsfield.
- **Scadenza.** I file in `/home/user` della sandbox Higgsfield durano 24 ore dall'ultimo uso. A fine lavoro va sempre fatto uno zip dei sorgenti e caricato con `media_upload` (link permanente).
- **Comandi.** Ogni `sandbox_exec` dura al massimo 120 secondi. Per i render lunghi usare `background:true` e poi controllare il log.
- **Computer dell'utente.** I file arrivano sul PC solo se la chat è aperta dall'app desktop. Altrimenti si consegnano link e file in chat.
- **Ascolto.** Claude non può ascoltare l'audio. Intonazione, pronuncia e bilanciamento voce/musica li verifica una persona.

## 5. Metodo di lavoro con il cliente

Ordine che ha funzionato, da rispettare:

1. **Proposte prima del video.** Si propongono più storie o più ganci testuali; il cliente sceglie.
2. **Testi definiti per intero**: frase a schermo e frase della voce per ogni scena, con i tempi.
3. **Fotogrammi di controllo** prima del render completo.
4. **Render, voce, mix, consegna** delle due versioni.
5. **Correzioni** su una singola scena senza rifare tutto (vedi §8).

Feedback ricevuti, diventati regole:

- 20 secondi con pause erano «troppo lenti»: meglio **15 secondi, voce continua, ingressi rapidi, musica**.
- Il gancio iniziale deve nominare un problema concreto. «Ti stanno cercando» non funzionava, «Agenda vuota il martedì?» sì.
- Testi validi per **tutte** le categorie di clienti: mai un solo mestiere. Per Beaflow si usa «Salone» come esempio generico.
- La voce **non pronuncia il nome del marchio** se lo legge male: il nome compare solo scritto.
- Massimo 6 parole a schermo per volta, visibili almeno 1,2 secondi.
- Chiusura fissa: logo, pulsante con l'invito all'azione, sito.

## 6. Struttura di uno spot

```
spot/
  index.html      animazione completa (stile, scene, timeline)
  render.js       ripresa e codifica
  audio.py        voce + effetti + musica + unione al video
  package.json    font (@fontsource/inter, @fontsource/noto-serif)
  vo/             line1.mp3 … line6.mp3, music.mp3
  frames/         fotogrammi di controllo
  out/            una clip per scena (s1.mp4 … s6.mp4)
  muto.mp4        video senza audio
  spot-musica.mp4, spot-senza-musica.mp4
```

Griglia dei tempi: la musica è a 120 BPM, quindi un battito ogni 0,5 secondi. **Ogni cambio scena cade su un multiplo di 0,5 s.** Esempi usati: `0 · 2 · 5 · 8 · 10,5 · 13 · 15` e `0 · 2 · 5,5 · 8,5 · 11 · 13 · 15`.

Zone sicure a 1080×1920 (aree coperte dall'interfaccia dei social): 250 px in alto, 120 px a destra, 380 px in basso; margine sinistro 80 px. Niente testo o elementi importanti fuori da quest'area.

## 7. Il motore di animazione

Idea: nessuna animazione «in tempo reale». La funzione `seek(t)` calcola e disegna lo stato esatto al secondo `t`. Il render chiama `seek` 30 volte per ogni secondo di video. Così il risultato non dipende dalla velocità della macchina.

```html
<script>
/* tw(target, inizio, durata, {prop:[da, a]}, curva) = coppia di keyframe. */
const DURATION = 15, FPS = 30, SP = 0.8, SO = 0.9;
function bez(x1,y1,x2,y2){ const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
  const fx=t=>((ax*t+bx)*t+cx)*t, fy=t=>((ay*t+by)*t+cy)*t, dx=t=>(3*ax*t+2*bx)*t+cx;
  return p=>{ if(p<=0)return 0; if(p>=1)return 1; let t=p; for(let i=0;i<10;i++){ const e=fx(t)-p; if(Math.abs(e)<1e-6)break; const d=dx(t); if(Math.abs(d)<1e-6)break; t-=e/d; } return fy(Math.min(1,Math.max(0,t))); }; }
function spr(k,c,dur){ const w0=Math.sqrt(k), z=c/(2*Math.sqrt(k)), wd=w0*Math.sqrt(1-z*z);
  return p=>{ if(p>=1)return 1; const t=p*dur; return 1-Math.exp(-z*w0*t)*(Math.cos(wd*t)+(z*w0/wd)*Math.sin(wd*t)); }; }
const E = { lin:p=>p, enter:bez(.22,1,.36,1), exit:bez(.4,0,1,1), inout:bez(.65,0,.35,1), spring:spr(420,26,SP), soft:spr(260,30,SO) };
const reg = new Map();
const $ = s=>[...document.querySelectorAll(s)];
const els = t => typeof t==='string' ? $(t) : (t instanceof Element ? [t] : [...t]);
const ent = el => { if(!reg.has(el)) reg.set(el,{p:{},fx:[]}); return reg.get(el); };
function tw(target,s,d,props,e='enter'){ els(target).forEach(el=>{ const r=ent(el);
  for(const k in props){ (r.p[k]??=[]).push({s,d,a:props[k][0],b:props[k][1],e}); r.p[k].sort((x,y)=>x.s-y.s);} }); }
function stagger(target,s,gap,d,props,e){ els(target).forEach((el,i)=>tw(el,s+i*gap,d,props,e)); }
function fx(target,fn){ els(target).forEach(el=>ent(el).fx.push(fn)); }
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
function val(list,t){ let cur=null; for(const k of list){ if(t>=k.s) cur=k; else break; }
  if(!cur) return list[0].a; const p=cur.d<=0?1:clamp((t-cur.s)/cur.d); return cur.a+(cur.b-cur.a)*E[cur.e](p); }
function seek(t){
  reg.forEach((r,el)=>{
    const v={}; for(const k in r.p) v[k]=val(r.p[k],t);
    const has=k=>v[k]!==undefined;
    if(has('x')||has('y')||has('scale')||has('sx')||has('sy')||has('rot'))
      el.style.transform=`translate(${v.x??0}px,${v.y??0}px) rotate(${v.rot??0}deg) scale(${(v.scale??1)*(v.sx??1)},${(v.scale??1)*(v.sy??1)})`;
    if(has('opacity')){ el.style.opacity=v.opacity; el.style.visibility=v.opacity<=0.001?'hidden':'visible'; }
    if(has('blur')) el.style.filter=v.blur>0.05?`blur(${v.blur}px)`:'none';
    for(const f of r.fx) f(el,t);
  });
}
const titleIn = (sel,s) => stagger(`${sel} .w`, s, 0.05, 0.4, {opacity:[0,1], y:[24,0]}, 'enter');
const fadeOut = (sel,s) => tw(sel, s, 0.3, {opacity:[1,0]}, 'exit');
const hidden  = sel => tw(sel, 0, 0.01, {opacity:[0,0]});
const fadeIn  = (sel,s,y=24) => tw(sel, s, 0.4, {opacity:[0,1], y:[y,0]}, 'enter');

/* … qui la timeline dello spot … */

window.ready = document.fonts.ready.then(()=>{ /* initGeometry(); */ seek(0); return true; });
if(location.search.includes('play')){ window.ready.then(()=>{ const t0=performance.now();
  (function loop(){ seek(((performance.now()-t0)/1000)%DURATION); requestAnimationFrame(loop); })(); }); }
</script>
```

Come si usa:

| Funzione | Cosa fa |
|---|---|
| `tw(sel, inizio, durata, {prop:[da,a]}, curva)` | Anima una proprietà fra due valori |
| `stagger(sel, inizio, scarto, durata, props, curva)` | Come `tw`, ma ogni elemento parte `scarto` secondi dopo il precedente |
| `fx(sel, (el,t)=>…)` | Codice libero a ogni fotogramma: testo che si scrive, contatori, cambio di classe |
| `titleIn(sel, inizio)` | Titolo che entra parola per parola (ogni parola in `<span class="w">`) |
| `fadeIn`, `fadeOut`, `hidden` | Scorciatoie per entrata, uscita ed elemento nascosto dall'inizio |

Proprietà animabili: `x`, `y` (pixel), `scale`, `sx`, `sy`, `rot` (gradi), `opacity`, `blur` (pixel).

Curve: `enter` per le entrate, `exit` per le uscite, `inout` per gli spostamenti, `spring` (0,8 s) e `soft` (0,9 s) per comparse «a molla» e pressioni dei pulsanti, `lin` per le dissolvenze brevi.

Regole pratiche:

- Tutti gli elementi di tutte le scene stanno nella stessa pagina, in posizione assoluta. Ogni scena fa entrare i propri e li fa uscire circa 0,45 s prima del cambio scena (uscita di 0,3 s).
- Prima del primo keyframe di una proprietà vale il valore di partenza di quel keyframe. Un elemento che compare tardi deve avere `hidden()` oppure una prima animazione di `opacity` che parte da 0.
- Entrate standard: 0,4 s. Comparsa a molla: `opacity` 0→1 in 0,12 s lineare più `scale` 0,8→1 con `spring`.
- Pressione di un pulsante: `scale` 1→0,93 in 0,1 s (`exit`), poi 0,93→1 con `soft`.
- Le posizioni che dipendono dal layout (cursore che va su un pulsante, etichetta che vola da una scheda all'altra) si misurano in una funzione `initGeometry()` chiamata dopo il caricamento dei font: `seek(t)` al momento giusto, `getBoundingClientRect()`, poi si creano i `tw`.
- Il render aspetta `window.ready`. Aprendo `index.html?play` nel browser si vede l'anteprima in ciclo.
- Nei testi a schermo usare `font-variant-numeric: tabular-nums` per i numeri che cambiano.

Esempio di una scena (da «Online in 5 minuti», scena 5, da 10,5 a 13 s):

```js
titleIn('#t5',10.5);
hidden('#notif'); tw('#notif',10.8,0.12,{opacity:[0,1]},'lin'); tw('#notif',10.8,SP,{y:[-160,0],scale:[.9,1]},'spring');
hidden('#slot');  tw('#slot',11.7,0.12,{opacity:[0,1]},'lin');  tw('#slot',11.7,SP,{y:[-70,0],scale:[.8,1]},'spring');
fadeOut('#t5',12.65); tw('#notif',12.65,0.3,{opacity:[1,0]},'exit'); tw('#slot',12.65,0.3,{opacity:[1,0]},'exit');
```

## 8. Render

`render.js` completo:

```js
// node render.js stills 0.5 3.9 ...   |   node render.js segments [nome ...]   |   node render.js join
const { chromium } = require('/usr/local/lib/node_modules/playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const FPS = 30;
const SEG = [['s1',0,2],['s2',2,5],['s3',5,8],['s4',8,10.5],['s5',10.5,13],['s6',13,15]];
const ENC = ['-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-profile:v','high','-r',String(FPS)];
(async () => {
  const [mode, ...rest] = process.argv.slice(2);
  if (mode === 'join') {
    fs.writeFileSync('out/list.txt', SEG.map(s => `file '${s[0]}.mp4'\n`).join(''));
    execFileSync('ffmpeg', ['-y','-loglevel','error','-f','concat','-safe','0','-i','out/list.txt','-c','copy','-movflags','+faststart','out/join.tmp.mp4']);
    fs.renameSync('out/join.tmp.mp4', 'muto.mp4'); console.log('ok muto.mp4'); return;
  }
  const b = await chromium.launch({ args: ['--force-color-profile=srgb', '--font-render-hinting=none'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/index.html'); await p.evaluate('window.ready');
  if (mode === 'stills') {
    for (const t of rest) { await p.evaluate(t => seek(t), +t); await p.screenshot({ path: `frames/s_${(+t).toFixed(2).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
  } else {
    fs.mkdirSync('out', { recursive: true });
    for (const [name, a, z] of SEG) {
      if (rest.length && !rest.includes(name)) continue;
      const n = Math.round((z - a) * FPS), t0 = Date.now();
      const ff = spawn('ffmpeg', ['-y','-loglevel','error','-f','image2pipe','-c:v','mjpeg','-framerate',String(FPS),'-i','-',...ENC,`out/${name}.tmp.mp4`], { stdio: ['pipe','inherit','inherit'] });
      for (let i = 0; i < n; i++) { await p.evaluate(t => seek(t), a + i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
      ff.stdin.end(); const code = await new Promise(r => ff.on('close', r)); if (code !== 0) process.exit(1);
      fs.renameSync(`out/${name}.tmp.mp4`, `out/${name}.mp4`); console.log(name, n, 'frames', ((Date.now() - t0) / 1000).toFixed(1) + 's');
    }
  }
  await b.close();
})();
```

Punti chiave:

- **Una clip per scena** (`SEG` va tenuto uguale ai cambi scena della timeline), tutte con le stesse impostazioni, poi unite con il concat demuxer e `-c copy`: l'unione non ricodifica nulla.
- **Correggere una scena** = `node render.js segments s3` e poi `node render.js join`. Le altre scene non si toccano.
- Ogni clip si scrive con nome temporaneo e si rinomina solo se ffmpeg finisce bene.
- Gli screenshot passano a ffmpeg via pipe come JPEG qualità 92: niente migliaia di file su disco.
- Cambiare solo l'audio non richiede render: l'unione finale usa `-c:v copy`.

Sequenza dei comandi:

```bash
npm install @fontsource/inter @fontsource/noto-serif
mkdir -p frames out vo
node render.js stills 0.6 1.4 3.9 6.5 9.2 11.8 14.4     # controllo
montage frames/s_*.jpg -tile 7x -geometry 216x384+4+4 sheet.jpg
node render.js segments && node render.js join            # muto.mp4
```

Il foglio `sheet.jpg` si guarda passando il percorso in `image_paths` di `sandbox_exec` (limite 512 KiB in totale).

Alternativa senza Higgsfield: lo stesso render funziona nella sandbox di Claude con Playwright per Python (così sono stati fatti i primi due video). Lì però non si scaricano le voci di Higgsfield.

## 9. Voce

Strumento `generate_audio_batch` del connettore Higgsfield, una clip per frase:

```json
{
  "model": "elevenlabs_v4",
  "dialogue": [{ "text": "Agenda vuota il martedì?", "voice_type": "preset",
                 "voice_id": "573e5163-59b3-4926-aab1-951ef2985f81" }],
  "prompt": "voce maschile calma e precisa, italiano naturale"
}
```

- `voice_id` qui sopra è «Harrison» (Eleven v4), scelta dopo un confronto fra più voci: la prima provata parlava italiano con accento britannico. Per un altro progetto conviene rifare il confronto con `list_voices` e 3–4 campioni sulla stessa frase.
- Dopo il batch: `jobs_wait`, poi `show_generation_by_ids` (obbligatorio). I nomi dei parametri possono cambiare: controllare sempre lo schema dello strumento o `models_explore`.
- Le clip si scaricano **dentro la sandbox Higgsfield** con `curl -o vo/line1.mp3 <url>`.
- Scrivere i numeri in lettere («cinque minuti»), usare i due punti per le pause brevi («Uno: crei l'account…»).
- Una frase per scena, più corta della scena. Le frasi di due spot fatti:
  - «Agenda vuota il martedì?» · «Su Esplora ti trovano subito, con servizi e prezzi.» · «Prenotano quando vogliono, anche quando sei chiuso.» · «E tu lo sai subito, con una notifica.» · «Agenda piena, in automatico.» · «Inizia gratis.»
  - «Online in cinque minuti.» · «Uno: crei l'account e scegli la tua attività.» · «Due: orari e servizi li trovi già pronti.» · «Tre: pubblichi, e sei prenotabile.» · «Ecco la prima prenotazione.» · «Inizia gratis.»

## 10. Musica, effetti e mix

Musica: `generate_audio` con modello `elevenlabs_music_v2_5`, traccia strumentale a 120 BPM (passare prima `get_cost:true` per vedere il costo). La stessa traccia si riusa per tutta la serie. Nota sulla licenza: dal centro assistenza Higgsfield l'uso commerciale non risulta limitato, ma possono valere i termini del modello di terze parti. Non è un parere legale.

`audio.py` completo (versione «Online in 5 minuti»):

```python
#!/usr/bin/env python3
import subprocess
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent
SR, DUR, TEMPO = 48000, 15.0, 1.08
rng = np.random.default_rng(7)
VOICE = [("line1", 0.05), ("line2", 1.97), ("line3", 5.07), ("line4", 8.15), ("line5", 11.15), ("line6", 13.5)]

def env(n, attack=0.002, decay=0.08):
    t = np.arange(n) / SR
    return np.minimum(t / attack, 1.0) * np.exp(-t / decay)
def tone(freq, dur, decay, attack=0.002, sweep=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    f = freq * sweep ** (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, attack, decay)
def noise(dur, lo, hi):
    n = int(dur * SR); spec = np.fft.rfft(rng.standard_normal(n)); fr = np.fft.rfftfreq(n, 1 / SR)
    spec[(fr < lo) | (fr > hi)] = 0; x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)
def add(*xs):
    out = np.zeros(max(len(x) for x in xs))
    for x in xs: out[: len(x)] += x
    return out
def key():      return 0.6 * tone(1900, 0.03, 0.006) + 0.5 * noise(0.03, 2500, 7000) * env(int(0.03 * SR), 0.001, 0.005)
def click():    return add(tone(2300, 0.05, 0.008), 0.8 * tone(950, 0.08, 0.02))
def pop(f):     return tone(f, 0.16, 0.035, sweep=0.55)
def big_pop():  return add(0.9 * tone(392, 0.5, 0.12, sweep=0.8), 0.5 * tone(784, 0.4, 0.08), 0.8 * tone(130, 0.25, 0.06, sweep=0.6))
def tick(f=1250): return tone(f, 0.05, 0.012)
def thud():     return tone(120, 0.22, 0.05, sweep=0.55) + 0.25 * noise(0.22, 200, 900) * env(int(0.22 * SR), 0.002, 0.02)
def ding(f):    return add(0.7 * tone(f, 1.0, 0.24), 0.3 * tone(2 * f, 0.8, 0.16), 0.15 * tone(3.01 * f, 0.6, 0.1))
def buzz():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 155 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 32 * t))) * np.hanning(n)
def whoosh(dur=0.5):
    return noise(dur, 400, 3200) * np.hanning(int(dur * SR)) ** 1.5
def put(buf, x, at, gain):
    a = int(at * SR); x = x[: max(0, len(buf) - a)]
    buf[a:a + len(x)] += gain * x

def build_sfx():                      # un effetto per ogni evento visivo, allo stesso istante della timeline
    s = np.zeros(int(DUR * SR))
    put(s, click(), 0.12, 0.18)
    put(s, whoosh(0.45), 1.45, 0.07)                              # ogni uscita di scena: whoosh leggero
    for i, ch in enumerate("Il tuo salone"):                      # digitazione: un tasto per lettera
        if ch != " ": put(s, key(), 2.3 + i * 0.04, 0.07)
    for i in range(7): put(s, tick(1100 + 50 * i), 2.9 + i * 0.05 + 0.03, 0.06)
    put(s, click(), 3.97, 0.18); put(s, ding(523.25), 4.1, 0.2)   # passaggio 1: do
    put(s, whoosh(0.45), 4.55, 0.07)
    for i in range(4): put(s, pop(600 * 2 ** (i / 12)), 5.6 + i * 0.3, 0.16)
    put(s, ding(659.25), 7.2, 0.2)                                # passaggio 2: mi
    put(s, whoosh(0.5), 7.6, 0.07)
    put(s, click(), 8.82, 0.18)
    put(s, thud(), 8.95, 0.3); put(s, ding(783.99), 8.97, 0.24)   # passaggio 3: sol
    put(s, whoosh(0.45), 10.05, 0.07)
    put(s, ding(880), 10.88, 0.28); put(s, buzz(), 10.88, 0.06)   # notifica: suono ricorrente della serie
    put(s, pop(700), 11.83, 0.16)
    put(s, whoosh(0.5), 12.95, 0.08); put(s, click(), 14.15, 0.2)
    return s

def decode(path, af=None):
    wav = path.with_suffix(".dec.wav")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(path)] + (["-af", af] if af else []) + ["-ar", str(SR), "-ac", "1", str(wav)]
    subprocess.run(cmd, check=True)
    x, _ = sf.read(wav, dtype="float64")
    return x

def trim_pauses(x, max_pause=0.18):
    """Accorcia le pause interne più lunghe di max_pause, tagliando nel silenzio."""
    win = 960
    quiet = np.sqrt(np.convolve(x * x, np.ones(win) / win, "same")) < 0.008
    cuts = np.flatnonzero(np.diff(quiet.astype(int))) + 1
    segs, flags = np.split(x, cuts), np.split(quiet, cuts)
    keep, out = int(max_pause * SR), []
    for k, (seg, fl) in enumerate(zip(segs, flags)):
        if fl[0] and len(seg) > keep and 0 < k < len(segs) - 1:
            h = keep // 2; out += [seg[:h], seg[-h:]]
        else:
            out.append(seg)
    return np.concatenate(out)

def build_voice():
    v = np.zeros(int(DUR * SR))
    for clip, start in VOICE:
        x = decode(ROOT / "vo" / f"{clip}.mp3", f"atempo={TEMPO}")
        nz = np.where(np.abs(x) > 0.004)[0]; x = x[max(nz[0] - 480, 0): nz[-1] + 2400]
        x = trim_pauses(x)
        print(f"  {clip} {start:5.2f} -> {start + len(x) / SR:5.2f}")
        put(v, x, start, 1.0)
    return v * (0.80 / np.abs(v).max())

def tempo_and_phase(x):
    hop, win = 512, 2048
    frames = np.lib.stride_tricks.sliding_window_view(x, win)[::hop] * np.hanning(win)
    mag = np.abs(np.fft.rfft(frames, axis=1))
    flux = np.maximum(mag[1:] - mag[:-1], 0).sum(axis=1); flux -= flux.mean()
    fps = SR / hop
    ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
    lags = np.arange(len(ac)); ok = (lags >= fps * 60 / 180) & (lags <= fps * 60 / 75)
    lag = lags[ok][np.argmax(ac[ok])]; bpm = 60 * fps / lag
    period = 0.5                                   # griglia del video: 120 BPM
    phases = np.arange(0, period, 0.005); t = (np.arange(len(flux)) + 1) * hop / SR
    score = [np.maximum(flux, 0)[np.abs(((t - ph + period / 2) % period) - period / 2) < 0.03].sum() for ph in phases]
    return bpm, float(phases[int(np.argmax(score))])

def mux(wavname, mix, out):
    wav = ROOT / "vo" / wavname
    sf.write(wav, np.stack([mix, mix], axis=1), SR)
    tmp = ROOT / (out + ".tmp.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ROOT / "muto.mp4"), "-i", str(wav), "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(tmp)], check=True)
    tmp.rename(ROOT / out)
    print("ok", out, "peak", round(float(np.abs(mix).max()), 3))

if __name__ == "__main__":
    voice, sfx = build_voice(), build_sfx()
    mux("mix-senza-musica.wav", voice + sfx, "spot-senza-musica.mp4")
    m = decode(ROOT / "vo" / "music.mp3")
    bpm, phase = tempo_and_phase(m)
    print(f"musica: tempo stimato {bpm:.1f} BPM, primo battito a {phase:.3f} s")
    if 117 <= bpm <= 123 and phase > 0.02:          # allinea i battiti ai cambi di scena
        m = m[int(phase * SR):]
    mus = np.zeros(int(DUR * SR)); n = min(len(m), len(mus)); mus[:n] = m[:n]
    mus *= 0.24 / np.abs(mus).max()
    fade = int(0.6 * SR); mus[-fade:] *= np.linspace(1, 0, fade) ** 1.5; mus[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    mix = voice + 0.8 * sfx + mus
    if np.abs(mix).max() > 0.97: mix *= 0.97 / np.abs(mix).max()
    mux("mix-musica.wav", mix, "spot-musica.mp4")
```

Cosa fa, in ordine:

1. **Voce.** Ogni clip viene accelerata dell'8% (`atempo=1.08`), ripulita dal silenzio iniziale e finale, con le pause interne ridotte a 0,18 s, e messa al secondo indicato in `VOICE`. Lo script stampa inizio e fine di ogni frase: **la fine deve cadere prima dell'inizio della frase successiva e dentro la propria scena**. Se sfora, si accorcia il testo o si sposta l'inizio.
2. **Effetti.** Suoni sintetici (tasto, clic, pop, tic, tonfo, campanella, vibrazione, fruscio) piazzati agli stessi istanti degli eventi della timeline. Volumi bassi (0,06–0,3).
3. **Musica.** Stima tempo e primo battito della traccia (119,7 BPM misurati), taglia l'inizio per far cadere i battiti sui cambi scena, volume al 24% del picco, dissolvenza finale di 0,6 s.
4. **Unione** al video senza ricodificarlo. Escono le due versioni.

## 11. Consegna

1. `media_upload` con il nome del file → restituisce un comando `curl` di caricamento e l'identificativo.
2. Eseguire quel `curl -f -X PUT …` **nella sandbox Higgsfield**, dove sta il file. Deve rispondere HTTP 200.
3. `media_confirm` (tipo `video` per gli MP4, `file` per gli zip).
4. `show_result` per mostrare il video in chat con anteprima e download. Il link `cloudfront` è pubblico.
5. Zip di backup dei sorgenti, caricato allo stesso modo.
6. Se il computer è collegato: copia anche nella cartella di lavoro dell'utente.

Nomi dei file: `<marca>_<spot>_<durata>_<variante>_v<numero>.mp4`.

## 12. Controlli prima di consegnare

- Fotogrammi di controllo nei momenti più affollati di ogni scena: niente sovrapposizioni, niente testo fuori dalle zone sicure.
- Fotogramma a metà di ogni transizione: nessun momento vuoto.
- Tempi della voce stampati da `audio.py`: nessuna frase sopra un'altra.
- `ffprobe` sul file finale: 1080×1920, 30 fps, durata esatta, traccia audio presente.
- Dire sempre all'utente cosa non è stato verificato (ascolto, affermazioni di prodotto, prezzi di esempio mostrati a schermo).

## 13. Errori già fatti, da non ripetere

| Errore | Rimedio |
|---|---|
| Elementi sovrapposti (notifica sopra l'intestazione di una scheda, etichetta sopra un totale) | Controllare i fotogrammi prima del render completo |
| Cursore invisibile sullo sfondo chiaro | Cerchio semitrasparente con bordo scuro, 92 px |
| Sfumatura di una mappa che copriva i segnaposto | Segnaposto in un livello separato sopra la sfumatura |
| Vuoto di mezzo secondo fra due scene | Far entrare la scena nuova prima che la vecchia sia sparita |
| Ultima frase della voce oltre la fine del video | Verificare i tempi stampati, accorciare o anticipare |
| Voce con accento straniero | Campioni di più voci sulla stessa frase prima di scegliere |
| Nome del marchio letto male | Il nome non va nel testo della voce |
| Spot da 20 s giudicato lento | 15 s, voce continua, musica |
| Margine destro di 80 px e metà inferiore vuota | Misurare le zone sicure (120 px a destra) e riempire l'area utile |
| `font-family:"Noto Serif"` dentro un attributo `style="…"` | Apici singoli dentro gli attributi |
| Download dei file audio dal browser, inaffidabile | Scaricare con `curl` dentro la sandbox Higgsfield |
| Somma di suoni di lunghezza diversa in numpy | Funzione `add()` che allinea le lunghezze |

## 14. Come è stato definito lo stile

1. Tre stili alternativi disegnati come tavole statiche su un canvas Claude Design, due fotogrammi per stile (gancio e scena centrale).
2. L'utente ne sceglie uno.
3. Tre agenti revisori con ruoli diversi criticano lo stile scelto. Sono emersi: zona sicura destra violata, metà schermo vuota, testi troppo piccoli.
4. Correzione e anteprima dei tre fotogrammi chiave (gancio, svolta, chiusura), controllati con misure reali.
5. Regole scritte in un file `STILE.md`: formato, colori con codice, caratteri con dimensioni, bordi, struttura delle scene, regole dei testi, voce, musica, movimento.

Per un altro prodotto: rifare i passi 1–5 e scrivere un nuovo `STILE.md`. Quello di Beaflow serve da modello della struttura, non dei valori.

## 15. Lista per adattarlo a un altro prodotto

1. Raccogliere: sito, a chi si rivolge, cosa promette, invito all'azione finale, colori e caratteri del marchio.
2. Proporre 4–6 storie da 15 s (gancio, svolta, chiusura) e far scegliere.
3. Definire lo stile (§14) e scriverlo.
4. Scrivere il copione: per ogni scena tempi, testo a schermo, frase della voce, cosa si vede.
5. Copiare una cartella del kit, cambiare variabili CSS (`:root`), font, contenuto delle scene, `SEG` in `render.js`, `VOICE` e `build_sfx()` in `audio.py`.
6. Scegliere la voce con campioni; generare le frasi; generare o riusare la musica a 120 BPM.
7. Fotogrammi di controllo → render → audio → controlli (§12) → consegna (§11) → zip di backup.

## 16. Riferimenti

- Kit sorgenti: link in cima.
- Spot «Agenda vuota» con musica: https://d2ol7oe51mr4n9.cloudfront.net/user_3LsB4XoxzLiS0ETnC5BLa6AO1hD/f9b22259-38c7-408f-9226-02961379b6a8.mp4
- Spot «Online in 5 minuti» con musica: https://d2ol7oe51mr4n9.cloudfront.net/user_3LsB4XoxzLiS0ETnC5BLa6AO1hD/f0e447b7-50c6-455c-bdc0-70d56a0a03ee.mp4
- Tavole di stile (canvas): https://claude.ai/artifact/YMV3ALeKo2u5H9kL8AxRZz
- Regole di stile Beaflow: file `STILE.md` consegnato a parte.
