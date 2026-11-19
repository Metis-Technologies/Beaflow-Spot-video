#!/usr/bin/env python3
"""Strumento unico per gli spot Beaflow Premium 3D.

Dalla cartella principale del repo:

  python3 strumenti/spot.py nuovo 41 sai-sempre-cosa-ce --titolo "Sai sempre cosa c'è" --ossatura A --da 40-chiusura-cassa-15s
  python3 strumenti/spot.py costruisci 41-sai-sempre-cosa-ce-15s      # spot.json + scena.js -> sorgente/index.html, testi.md
  python3 strumenti/spot.py voci 41-... 42-...                        # frasi da generare, a gruppi di 4
  python3 strumenti/spot.py scarica 41-... 1=<url> 2=<url>            # clip dritte in audio/ (dove la rete lo permette)
  python3 strumenti/spot.py importa-voci ~/Scaricati --sposta         # clip scaricate col browser -> audio/, download puliti
  python3 strumenti/spot.py tempi 41-...                              # tempi reali delle frasi, prima del render
  python3 strumenti/spot.py fotogrammi 41-...  [tempi]                # fotogrammi di controllo + foglio
  python3 strumenti/spot.py render 41-...  [s3 ...]                   # scene -> muto.mp4
  python3 strumenti/spot.py audio 41-...                              # voce + effetti + musica -> export/
  python3 strumenti/spot.py controlli 41-...                          # verifiche automatiche
  python3 strumenti/spot.py tutto 41-...                              # costruisci, render, audio, controlli

Dettagli in strumenti/README.md. Le regole del progetto stanno in claude/REGOLE-PROGETTO.md (progetto Claude).
"""
import sys; sys.dont_write_bytecode = True      # niente __pycache__ nelle cartelle degli spot
import argparse, copy, json, re, shutil, subprocess, sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
REPO = QUI.parent
MOTORE = QUI / "motore"
GRIGLIA = [0, 2.5, 5, 7.5, 10, 12.5, 15]          # cambi scena (120 BPM, multipli di 0,5 s)
CHIUSURA = {"schermo": "Inizia gratis · Piano Free · 0 € per sempre · beaflow.it", "voce": "Beaflow. Inizia gratis.", "voce_inizio": 12.9}
VOCE = {"model": "elevenlabs_v4", "voice_type": "preset", "voice_id": "573e5163-59b3-4926-aab1-951ef2985f81",
        "prompt": "voce maschile calma e precisa, pronuncia italiana naturale, nessun accento inglese"}
MESTIERI = ["barbier", "parrucchier", "estetist", "unghie", "nail", "tattoo", "tatuator", "massaggiat", "spa "]
OSSATURE = {"A": "Problema → soluzione", "B": "Dimostrazione", "C": "Numero o risultato"}


def it(x):                                   # 2.5 -> «2,5»
    return f"{x:g}".replace(".", ",")


def s2(x):                                   # 2.6 -> «2,60»
    return f"{x:.2f}".replace(".", ",")


def fonde(base, sopra):                      # unione profonda: «sopra» vince
    out = copy.deepcopy(base)
    for k, v in sopra.items():
        if k == "scene" and isinstance(v, dict):              # {"1": {...}} cambia solo quelle scene
            for n, cambi in v.items():
                out["scene"][int(n) - 1].update(cambi)
        elif isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = fonde(out[k], v)
        else:
            out[k] = copy.deepcopy(v)
    return out


def cartella(nome):
    d = Path(nome)
    if not d.is_absolute():
        d = REPO / nome
    d = d.resolve()
    if not (d / "spot.json").exists():
        sys.exit(f"ERRORE: {d.name}/spot.json non esiste. Gli spot fino al 40 (tranne quelli convertiti) usano ancora la loro cartella sorgente/.")
    return d


def carica(d):
    """spot.json dello spot; se ha «base», eredita testi, scena ed effetti dallo spot base."""
    s = json.loads((d / "spot.json").read_text(encoding="utf-8"))
    base = None
    if s.get("base"):
        base = cartella(s["base"])
        s = fonde(carica(base)[0], {k: v for k, v in s.items() if k != "base"})
        s["base"] = base.name
    return s, base


def trova(d, base, nome):                    # file dello spot, altrimenti quello dello spot base
    if (d / nome).exists():
        return d / nome
    if base:
        b = carica(base)[1]
        return trova(base, b, nome)
    return None


def nome_file(s, variante):
    return f"beaflow_{s['nome']}_15s_{variante}_v{s.get('versione', 1)}.mp4"


# ───────── controlli sul copione ─────────

def controlla_copione(s, d):
    err, avv = [], []
    lessico = json.loads((QUI / "pronuncia.json").read_text(encoding="utf-8"))
    if s.get("ossatura") not in OSSATURE: err.append("ossatura: deve essere A, B o C")
    if s.get("tema", "chiaro") not in ("chiaro", "scuro"): err.append("tema: chiaro o scuro")
    sc = s.get("scene", [])
    if len(sc) != 5:
        err.append(f"servono 5 scene di testo (la sesta è la chiusura fissa), trovate {len(sc)}")
        return err, avv
    for i, x in enumerate(sc, 1):
        righe = list(x.get("schermo", [])) + list(x.get("accento", []))
        testo = " ".join(righe)
        parole = [p for p in testo.split() if re.search(r"\w", p)]
        if not righe: err.append(f"scena {i}: manca il testo a schermo")
        if len(parole) > 6: err.append(f"scena {i}: {len(parole)} parole a schermo (massimo 6): «{testo}»")
        for r in x.get("schermo", []):
            px = x.get("gancio_px", 112) if i == 1 else 112
            if len(r) > 16 * 112 / px: avv.append(f"scena {i}: riga lunga ({len(r)} caratteri, a {px} px ne stanno circa {int(16 * 112 / px)}): «{r}»")
        for r in x.get("accento", []):
            px = x.get("accento_px", 112) if i == 1 else 112
            if len(r) > 16 * 112 / px: avv.append(f"scena {i}: riga lunga ({len(r)} caratteri, a {px} px ne stanno circa {int(16 * 112 / px)}): «{r}»")
        for k in ("gancio_px", "accento_px"):
            if k in x and not (i == 1 and 96 <= x[k] <= 112): err.append(f"scena {i}: {k} vale solo per la scena 1, fra 96 e 112 px")
        voce = x.get("voce", "")
        if not voce: err.append(f"scena {i}: manca la frase della voce")
        if "!" in testo + voce: err.append(f"scena {i}: niente punti esclamativi")
        ini = x.get("voce_inizio")
        if ini is None or not (GRIGLIA[i - 1] <= ini <= GRIGLIA[i - 1] + 0.6):
            err.append(f"scena {i}: voce_inizio {ini} fuori da {it(GRIGLIA[i-1])}–{it(GRIGLIA[i-1]+0.6)} s")
        dove = (2,) if s.get("ossatura") == "A" else (2, 3)          # nelle ossature B e C «Con Beaflow» può arrivare a metà
        if "beaflow" in voce.lower() and not (i in dove and voce.lower().startswith("con beaflow")):
            err.append(f"scena {i}: la voce dice «Beaflow» solo in «Con Beaflow, …» (scena {' o '.join(map(str, dove))}) e nella chiusura")
        if voce and ini is not None:
            fine_utile = (sc[i]["voce_inizio"] if i < 5 and sc[i].get("voce_inizio") is not None else CHIUSURA["voce_inizio"]) - ini
            stima = durata_stimata(voce)
            if stima > fine_utile - 0.25:
                avv.append(f"scena {i}: frase forse troppo lunga per la sua scena (stima {stima:.1f} s su {fine_utile:.2f} disponibili): accorciarla o verificare con  spot.py tempi  appena arriva la clip: «{voce}»")
        if re.search(r"\d", x.get("voce_tts", voce)): avv.append(f"scena {i}: numeri in cifre nella voce, scriverli in lettere: «{voce}»")
        basso = (testo + " " + voce).lower()
        for parola, r in lessico["parole"].items():
            if re.search(rf"\b{re.escape(parola)}\b", voce.lower()):
                if r.get("solo_gancio") and i != 1: continue
                if r.get("scrivi") and r["scrivi"].lower() in x.get("voce_tts", "").lower(): continue
                avv.append(f"scena {i}: «{parola}» è una parola difficile per la voce. {r.get('nota', '')}"
                           + (f" Rimedio: voce_tts con «{r['scrivi']}» e pronuncia «{r['prompt']}»." if r.get("scrivi") else ""))
        for parola, alt in lessico["evita"].items():
            if parola in basso: avv.append(f"scena {i}: evitare «{parola}» nella voce, meglio «{alt}»")
        if not s.get("settore"):
            for m in MESTIERI:
                if m in basso + " ": avv.append(f"scena {i}: nomina un solo mestiere («{m.strip()}»): gli spot generici valgono per tutte le attività")
    if sum("beaflow" in x.get("voce", "").lower() for x in sc) > 1: err.append("la voce dice «Con Beaflow, …» una volta sola")
    if s["ossatura"] == "A" and not sc[0].get("accento"):
        avv.append("ossatura A: di solito il gancio ha una riga d'accento rossa (campo «accento» della scena 1)")
    if s["ossatura"] == "A" and not sc[1].get("voce", "").lower().startswith("con beaflow"):
        avv.append("ossatura A: la scena 2 di solito parte con «Con Beaflow, …»")
    if not s.get("funzione"): avv.append("manca «funzione»: va controllata in claude/FUNZIONI.md prima di produrre")
    return err, avv


# ───────── costruisci ─────────

def parole(riga):
    return " ".join(f'<span class="w">{p}</span>' for p in riga.split())


def righe_html(righe):
    return "<br>".join(parole(r) for r in righe)


def propria(d):
    """True per gli spot fino al 40: hanno in sorgente/ la loro copia del motore e una pagina già consegnata, da non riscrivere."""
    return (d / "sorgente" / "render.js").exists()


def sintassi(pagina, scena_js, d):
    """Controlla la sintassi della pagina generata (es. un nome di scena.js già usato dal modello) senza aprire il browser."""
    import tempfile
    m = re.search(r'<script type="module">\n(.*?)</script>', pagina, re.S)
    if not m: return None
    with tempfile.NamedTemporaryFile("w", suffix=".mjs", delete=False, encoding="utf-8") as f: f.write(m.group(1)); tmp = f.name
    r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True); Path(tmp).unlink()
    if r.returncode == 0: return None
    riga = re.search(r"\.mjs:(\d+)", r.stderr); msg = next((l for l in r.stderr.splitlines() if "Error" in l), r.stderr.strip()[:200])
    dove = ""
    if riga:
        inizio = m.group(1).find(scena_js); n0 = m.group(1)[:inizio].count("\n") + 1 if inizio >= 0 else None
        n = int(riga.group(1))
        if n0 and n0 <= n < n0 + scena_js.count("\n") + 1: dove = f" (scena.js, riga {n - n0 + 1})"
    return msg + dove


def durata_stimata(frase):                   # tarata sulle clip degli spot 26 e 40: circa 16 caratteri al secondo più 0,3 s per ogni pausa interna
    return len(frase) / 16 + 0.3 * len(re.findall(r"[,;:.?](?=\s)", frase.strip()))


def costruisci(d, quiet=False, rigenera=False):
    s, base = carica(d)
    err, avv = controlla_copione(s, d)
    for a in avv: print("  ATTENZIONE ·", a)
    for e in err: print("  ERRORE ·", e)
    if err: sys.exit("Copione da correggere: sorgente non generato.")
    sc = s["scene"]
    rosso = s["ossatura"] == "A"
    titoli = ['<div id="h1" class="ui">', f'  <div id="t1">{righe_html(sc[0]["schermo"])}</div>',
              f'  <div id="t1b">{righe_html(sc[0].get("accento", []))}</div>', "</div>"]
    titoli += [f'<div id="t{i}" class="ui tt">{righe_html(sc[i-1]["schermo"] + sc[i-1].get("accento", []))}</div>' for i in range(2, 6)]
    g = GRIGLIA
    riassunto = " · ".join(f"{it(g[i])} {' '.join(sc[i]['schermo'] + sc[i].get('accento', []))}" for i in range(5))
    tl = [f"/* ───────── timeline UI ─────────\n   scene: {riassunto} · {it(g[5])} chiusura */",
          "hidden('#logoS'); tw('#logoS',0.05,0.4,{opacity:[0,1]},'enter'); tw('#logoS',12.25,0.3,{opacity:[1,0]},'exit');",
          "tw('#shade',0,0.01,{opacity:[1,1]}); tw('#shade',12.4,0.4,{opacity:[1,0]},'exit');",
          "titleIn('#t1',0.1); hidden('#t1b .w'); stagger('#t1b .w',0.6,0.06,0.4,{opacity:[0,1],y:[24,0],blur:[8,0]},'enter');",
          f"outT('#h1',{g[1]-0.3:g});"]
    tl += [f"titleIn('#t{i}',{g[i-1]+0.1:g}); outT('#t{i}',{g[i]-0.35:g});" for i in range(2, 6)]
    tl += ["hidden('#logoB'); tw('#logoB',13.05,0.12,{opacity:[0,1]},'lin'); tw('#logoB',13.05,SO,{scale:[.86,1],blur:[10,0]},'soft');",
           "popIn('#btn',13.3,40); tw('#btn',14.15,0.1,{scale:[1,.93]},'exit'); tw('#btn',14.25,SO,{scale:[.93,1]},'soft');",
           "hidden('#offer'); tw('#offer',13.5,0.4,{opacity:[0,1],y:[24,0]},'enter');",
           "hidden('#url'); tw('#url',13.6,0.4,{opacity:[0,1],y:[24,0]},'enter');"]
    scena = trova(d, base, "scena.js")
    if not scena: sys.exit("ERRORE: manca scena.js (né nello spot né nello spot base)")
    scena_js = scena.read_text(encoding="utf-8").rstrip("\n")
    if s.get("dati"):
        scena_js = "const SPOT = " + json.dumps({"dati": s["dati"], "settore": s.get("settore")}, ensure_ascii=False) + ";\n" + scena_js
    css = trova(d, base, "scena.css"); html = trova(d, base, "scena.html"); extra_tl = trova(d, base, "timeline.js")
    if extra_tl: tl.append(extra_tl.read_text(encoding="utf-8").rstrip("\n"))
    css_accento = "" if rosso else "body.scuro #t1b{color:var(--oro)}"
    pezzi = {
        "TITOLO": s["titolo"], "PX_GANCIO": str(sc[0].get("gancio_px", 112)), "PX_ACCENTO": str(sc[0].get("accento_px", 112)), "COLORE_ACCENTO": "var(--rosso)" if rosso else "var(--ottone)",
        "CSS_SCENA": "\n".join(x for x in [css_accento, css.read_text(encoding="utf-8").rstrip("\n") if css else ""] if x),
        "TITOLI": "\n".join(titoli), "HTML_SCENA": html.read_text(encoding="utf-8").rstrip("\n") if html else "",
        "TIMELINE": "\n".join(tl), "SEME": str(s.get("seme", 100 + 10 * int(s["numero"]) + 1)),
        "K_GANCIO": "E.inout(clamp((t-2.35)/0.3))" if rosso else "1", "SCENA": scena_js,
    }
    chiusura = "anello" if s.get("anello") else s.get("chiusura") or json.loads((QUI / "riferimento.json").read_text(encoding="utf-8")).get("chiusura", "pulita")
    if chiusura not in ("pulita", "linea", "tessere", "alone", "anello"): sys.exit("ERRORE: chiusura deve essere pulita, linea, tessere, alone o anello")
    pezzi["CHIUSURA"] = chiusura
    pagina = (MOTORE / "modello.html").read_text(encoding="utf-8")
    for k, v in pezzi.items():
        pagina = pagina.replace("{{" + k + "}}", v)
    if "{{" in pagina: sys.exit("ERRORE: segnaposto non sostituito nel modello")
    if propria(d) and not rigenera:
        if not quiet: print(f"ok {d.name}: copione valido. Spot già consegnato con la sua sorgente/: pagina e testi.md non riscritti (--rigenera per rifarli dal modello attuale).")
        return s
    guasto = sintassi(pagina, scena_js, d)
    if guasto: sys.exit(f"ERRORE nella pagina: {guasto}\n  Se dice «has already been declared»: quel nome è già usato dal modello, cambiarlo in scena.js.")
    (d / "sorgente").mkdir(exist_ok=True)
    (d / "sorgente" / "index.html").write_text(pagina, encoding="utf-8")
    (d / "testi.md").write_text(testi_md(s), encoding="utf-8")
    if not quiet: print(f"ok {d.name}/sorgente/index.html e testi.md" + (f"  (base: {s['base']})" if s.get("base") else ""))
    return s


def testi_md(s):
    g, sc = GRIGLIA, s["scene"]
    var = "variante " + ("chiara" if s.get("tema", "chiaro") == "chiaro" else "scura")
    r = [f"# {s['numero']:02d} · «{s['titolo']}» (15 s) · Premium 3D, {var}", "",
         f"Generato da `spot.json` con `strumenti/spot.py costruisci`: non modificare a mano. Ossatura {s['ossatura']} ({OSSATURE[s['ossatura']]})."
         + (f" Versione di settore ({s['settore']}) dello spot `{s['base']}`." if s.get("settore") and s.get("base") else "")
         + f" Funzione: {s.get('funzione', '—')}. Cambi scena a {' · '.join(it(x) for x in g[:-1])} s.", "",
         "| Scena | Tempo | Cosa si vede | Testo a schermo | Voce (inizio) |", "|---|---|---|---|---|"]
    for i, x in enumerate(sc):
        r.append(f"| {i+1} | {it(g[i])} – {it(g[i+1])} | {x.get('si_vede', '')} | {' '.join(x['schermo'] + x.get('accento', []))} | {x['voce']} ({s2(x['voce_inizio'])}) |")
    r.append(f"| 6 | {it(g[5])} – 15 | implosione, logo con alone | {CHIUSURA['schermo']} | {CHIUSURA['voce']} ({s2(CHIUSURA['voce_inizio'])}) |")
    if s.get("note"): r += ["", s["note"]]
    return "\n".join(r) + "\n"


# ───────── nuovo ─────────

def nuovo(a):
    if a.variante_di:
        base = cartella(a.variante_di); sb = carica(base)[0]
        if not a.settore: sys.exit("ERRORE: con --variante-di serve --settore (es. barbieri) o un'etichetta (es. gancio-b)")
        d = REPO / f"{sb['numero']:02d}-{sb['nome']}-{a.settore}-15s"
        js = {"base": base.name, "settore": a.settore, "nome": f"{sb['nome']}-{a.settore}", "versione": 1,
              "scene": {"1": {k: sb["scene"][0][k] for k in ("schermo", "accento", "gancio_px", "accento_px", "voce", "voce_inizio") if k in sb["scene"][0]}}, "dati": {}}
    else:
        if a.numero is None or not a.nome: sys.exit("ERRORE: servono numero e nome (es. nuovo 41 sai-sempre-cosa-ce)")
        d = REPO / f"{a.numero:02d}-{a.nome}-15s"
        vuota = lambda i: {"schermo": ["Testo scena", str(i)], "voce": "Frase della voce.", "voce_inizio": GRIGLIA[i - 1] + (0.05 if i == 1 else 0.1 if i > 2 else 0.1), "si_vede": ""}
        js = {"numero": a.numero, "nome": a.nome, "titolo": a.titolo or a.nome, "ossatura": a.ossatura, "tema": "chiaro", "versione": 1,
              "seme": 100 + 10 * a.numero + 1, "funzione": "", "note": "Dati dimostrativi.", "scene": [vuota(i) for i in range(1, 6)], "dati": {}}
        js["scene"][0]["accento"] = ["Accento."]
    if d.exists(): sys.exit(f"ERRORE: {d.name} esiste già")
    for sub in ("sorgente", "audio", "export"): (d / sub).mkdir(parents=True)
    (d / "spot.json").write_text(json.dumps(js, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (d / ".gitignore").write_text("*.log\nsheet.jpg\ncontrollo.jpg\nnode_modules\n", encoding="utf-8")
    if not a.variante_di:
        da = cartella(a.da) if a.da else None
        for f in ("scena.js", "effetti.py"):
            origine = (da / f) if da and (da / f).exists() else MOTORE / ("scena-base.js" if f == "scena.js" else "effetti-base.py")
            shutil.copy(origine, d / f)
    print(f"ok creata {d.name}/" + (f"  (scena ed effetti copiati da {a.da})" if a.da else ""))
    print("   poi: scrivere spot.json" + ("" if a.variante_di else ", scena.js, effetti.py") + f" e lanciare  python3 strumenti/spot.py costruisci {d.name}")


# ───────── voci ─────────

def voci(a):
    lessico = json.loads((QUI / "pronuncia.json").read_text(encoding="utf-8"))
    lavori = []
    for nome in a.spot:
        d = cartella(nome); s, base = carica(d)
        for i, x in enumerate(s["scene"], 1):
            clip = d / "audio" / f"line{i}.mp3"
            ereditata = base and "voce" not in json.loads((d / "spot.json").read_text(encoding="utf-8")).get("scene", {}).get(str(i), {})
            if ereditata or (clip.exists() and not a.tutte): continue
            testo = x.get("voce_tts", x["voce"]); prompt = VOCE["prompt"]
            aiuti = [x["pronuncia"]] if x.get("pronuncia") else []
            aiuti += [f"«{r['scrivi']}» si pronuncia {r['prompt']}" for p, r in lessico["parole"].items() if r.get("scrivi") and r["scrivi"].lower() in testo.lower()]
            if aiuti: prompt += "; " + "; ".join(aiuti)
            lavori.append({"file": f"{d.name}/audio/line{i}.mp3", "scarica_come": f"beaflow_{d.name}_line{i}.mp3", "richiesta": {"model": VOCE["model"], "prompt": prompt,
                           "dialogue": [{"text": testo, "voice_type": VOCE["voice_type"], "voice_id": VOCE["voice_id"]}]}})
    if not lavori: print("Nessuna frase da generare (le clip esistono già: --tutte per rigenerarle)."); return
    print(f"{len(lavori)} frasi da generare con Higgsfield (generate_audio_batch), al massimo 4 per gruppo. La chiusura «Beaflow. Inizia gratis.» è comune: comune/voce/chiusura.mp3\n")
    for k in range(0, len(lavori), 4):
        print(f"── gruppo {k//4 + 1}"); print(json.dumps(lavori[k:k + 4], ensure_ascii=False, indent=1))
    print("\nPoi: con un terminale che raggiunge Higgsfield  →  spot.py scarica <spot> 1=<url> 2=<url> …"
          "\n     altrimenti scaricare col browser usando i nomi «scarica_come»  →  spot.py importa-voci <cartella dei download> --sposta")


def durata_mp3(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except ValueError: return None


def tempi(d, quiet=False):
    """Tempi reali delle frasi (clip già in audio/), senza render: da lanciare appena arrivano le voci."""
    sys.path.insert(0, str(MOTORE)); import audio as A
    fr = A.frasi(d); g = GRIGLIA; guai = 0
    for k, (clip, ini, fine, x) in enumerate(fr):
        if x is None: print(f"  {clip}: clip mancante"); continue
        limite = fr[k + 1][1] if k + 1 < len(fr) else 15.0
        nota = ""
        if fine > limite: nota = f"  ERRORE: finisce dopo l'inizio della frase successiva ({limite:.2f})"; guai += 1
        elif fine > g[k + 1] + 0.05: nota = f"  ATTENZIONE: oltre il cambio scena ({it(g[k+1])} s) di {fine - g[k+1]:.2f} s: anticipare voce_inizio o accorciare"; guai += 1
        print(f"  {clip} {ini:5.2f} -> {fine:5.2f}{nota}")
    if not quiet: print(f"{d.name}: " + ("tempi a posto." if not guai else f"{guai} frasi da sistemare prima del render."))
    return guai


def scarica(a):
    """Scarica le clip direttamente in <spot>/audio/ (serve una rete che raggiunge i link di Higgsfield: il PC sì, il container cloud no)."""
    import urllib.request
    d = cartella(a.spot); (d / "audio").mkdir(exist_ok=True); guai = 0
    for voce in a.clip:
        m = re.match(r"^([1-5])=(https://.+)$", voce)
        if not m: sys.exit(f"ERRORE: «{voce}» non è nella forma  numero=https://…  (numero della scena da 1 a 5)")
        dst = d / "audio" / f"line{m.group(1)}.mp3"; tmp = dst.with_suffix(".mp3.parziale")
        try:
            with urllib.request.urlopen(urllib.request.Request(m.group(2), headers={"User-Agent": "curl/8"}), timeout=60) as r: tmp.write_bytes(r.read())
        except Exception as e:
            tmp.unlink(missing_ok=True); guai += 1; print(f"  NON scaricata line{m.group(1)}: {str(e)[:120]}"); continue
        sec = durata_mp3(tmp)
        if not sec: tmp.unlink(); guai += 1; print(f"  NON valida line{m.group(1)}: il file scaricato non è un audio"); continue
        tmp.replace(dst); print(f"  ok {d.name}/audio/{dst.name}  ({sec:.2f} s)")
    if guai: sys.exit("Da qui i link non si raggiungono o non sono validi: scaricare col browser e usare  spot.py importa-voci")
    tempi(d)


def importa_voci(a):
    """Porta in <spot>/audio/lineN.mp3 le clip scaricate col browser con i nomi beaflow_<cartella-spot>_lineN.mp3 (campo «scarica_come» di spot.py voci)."""
    src = Path(a.cartella).expanduser()
    if not src.is_dir(): sys.exit(f"ERRORE: {src} non è una cartella")
    fatti, altri, toccati = 0, [], []
    for f in sorted(src.iterdir()):
        m = re.match(r"^beaflow_(.+-15s)_line([1-5])(?: ?\(\d+\))?\.mp3$", f.name)
        if not m:
            if f.name.startswith(".org.chromium.Chromium.") or f.name.startswith("beaflow"): altri.append(f)
            continue
        d = REPO / m.group(1)
        if not (d / "spot.json").exists(): print(f"  saltata {f.name}: lo spot {m.group(1)} non esiste"); continue
        sec = durata_mp3(f)
        if not sec: print(f"  saltata {f.name}: non è un audio valido (scaricamento incompleto?)"); continue
        (d / "audio").mkdir(exist_ok=True); dst = d / "audio" / f"line{m.group(2)}.mp3"
        shutil.copy(f, dst); fatti += 1
        if d not in toccati: toccati.append(d)
        if a.sposta: f.unlink()
        print(f"  ok {m.group(1)}/audio/{dst.name}  ({sec:.2f} s)" + ("  · tolta dai download" if a.sposta else ""))
    for f in altri:
        sec = durata_mp3(f)
        print(f"  DA SISTEMARE A MANO: {f.name}  ({f.stat().st_size} byte" + (f", audio di {sec:.2f} s" if sec else ", non è un audio") + "): nome non riconosciuto")
    print(f"{fatti} clip importate." + ("" if a.sposta or not fatti else "  Con --sposta le clip vengono anche tolte dalla cartella dei download."))
    for d in toccati:
        if all((d / "audio" / f"line{k}.mp3").exists() for k in range(1, 6)): print(f"Tempi di {d.name}:"); tempi(d)


# ───────── comandi che usano il motore ─────────

def lancia(cmd, **kw):
    r = subprocess.run([str(c) for c in cmd], **kw)
    if r.returncode != 0: sys.exit(r.returncode)


def fotogrammi(d, tempi):
    s = costruisci(d, quiet=True)
    tempi = tempi or ["0.6", "1.8", "2.5", "3.8", "5", "6.3", "7.5", "8.8", "10", "11.3", "12.5", "13.2", "14.4"]
    lancia(["node", MOTORE / "render.js", d, "stills", *tempi], env=ambiente(s))
    from PIL import Image
    fs = [d / "sorgente" / "frames" / f"s_{float(t):05.2f}.jpg" for t in tempi]
    W, H, n = 270, 480, len(fs); per = 7 if n > 7 else n; righe = (n + per - 1) // per
    foglio = Image.new("RGB", (per * (W + 4), righe * (H + 4)), "white")
    for i, f in enumerate(fs): foglio.paste(Image.open(f).resize((W, H)), ((i % per) * (W + 4), (i // per) * (H + 4)))
    foglio.save(d / "sorgente" / "sheet.jpg", quality=85)
    print(f"ok {d.name}/sorgente/sheet.jpg  ({n} fotogrammi: {' '.join(tempi)})")


def ambiente(s):
    import os
    e = dict(os.environ); e.setdefault("TEMA", s.get("tema", "chiaro")); return e


def render(d, scene):
    s = costruisci(d, quiet=True)
    lancia(["node", MOTORE / "render.js", d, "segments", *scene], env=ambiente(s))
    lancia(["node", MOTORE / "render.js", d, "join"])


def main():
    p = argparse.ArgumentParser(description="Spot Beaflow Premium 3D", formatter_class=argparse.RawDescriptionHelpFormatter, epilog=__doc__)
    sub = p.add_subparsers(dest="cmd", required=True)
    n = sub.add_parser("nuovo"); n.add_argument("numero", nargs="?", type=int); n.add_argument("nome", nargs="?")
    n.add_argument("--titolo"); n.add_argument("--ossatura", default="A", choices=list(OSSATURE)); n.add_argument("--da", help="spot da cui copiare scena.js ed effetti.py")
    n.add_argument("--variante-di", help="spot base: crea una versione di settore o con un altro gancio"); n.add_argument("--settore")
    for c in ("costruisci", "audio", "controlli", "tutto", "tempi"):
        x = sub.add_parser(c); x.add_argument("spot"); x.add_argument("--sovrascrivi", action="store_true", help="sostituisce un video già presente in export/")
        x.add_argument("--rigenera", action="store_true", help="riscrive pagina e testi.md anche per uno spot già consegnato con la sua sorgente/")
    v = sub.add_parser("voci"); v.add_argument("spot", nargs="+"); v.add_argument("--tutte", action="store_true")
    sc = sub.add_parser("scarica"); sc.add_argument("spot"); sc.add_argument("clip", nargs="+", help="numero=url, es. 1=https://…")
    iv = sub.add_parser("importa-voci"); iv.add_argument("cartella"); iv.add_argument("--sposta", action="store_true", help="toglie le clip dalla cartella dei download dopo averle copiate")
    f = sub.add_parser("fotogrammi"); f.add_argument("spot"); f.add_argument("tempi", nargs="*")
    r = sub.add_parser("render"); r.add_argument("spot"); r.add_argument("scene", nargs="*")
    a = p.parse_args()
    if a.cmd == "nuovo": return nuovo(a)
    if a.cmd == "voci": return voci(a)
    if a.cmd == "scarica": return scarica(a)
    if a.cmd == "importa-voci": return importa_voci(a)
    d = cartella(a.spot)
    extra = ["--sovrascrivi"] if getattr(a, "sovrascrivi", False) else []
    if a.cmd == "costruisci": costruisci(d, rigenera=a.rigenera)
    elif a.cmd == "tempi": sys.exit(1 if tempi(d) else 0)
    elif a.cmd == "fotogrammi": fotogrammi(d, a.tempi)
    elif a.cmd == "render": render(d, a.scene)
    elif a.cmd == "audio": lancia([sys.executable, MOTORE / "audio.py", d, *extra])
    elif a.cmd == "controlli": lancia([sys.executable, QUI / "controlli.py", d])
    elif a.cmd == "tutto":
        render(d, []); lancia([sys.executable, MOTORE / "audio.py", d, *extra]); lancia([sys.executable, QUI / "controlli.py", d])


if __name__ == "__main__":
    main()
