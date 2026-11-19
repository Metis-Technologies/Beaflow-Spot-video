#!/usr/bin/env python3
"""Controlli automatici su uno spot finito. Di solito si lancia da strumenti/spot.py.

  python3 strumenti/controlli.py <cartella-spot>

Verifica: copione (regole dei testi), testi dentro le zone sicure, tempi della voce, formato dei due video,
momenti vuoti nelle transizioni, volume percepito rispetto alla serie. Salva sorgente/controllo.jpg (foglio dei
fotogrammi presi dal video finale) da guardare prima di consegnare.
Esce con errore se c'è almeno un ERRORE. Quello che non può controllare (pronuncia, funzioni del prodotto) lo ricorda in fondo.
"""
import sys; sys.dont_write_bytecode = True      # niente __pycache__ nelle cartelle degli spot
import io, json, re, subprocess, sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
sys.path.insert(0, str(QUI)); sys.path.insert(0, str(QUI / "motore"))
import spot as S                     # noqa: E402

RIF = json.loads((QUI / "riferimento.json").read_text(encoding="utf-8"))
esiti = []                           # (livello, voce, dettaglio)


def segna(livello, voce, dettaglio=""):
    esiti.append((livello, voce, dettaglio))


def sonda(f):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(f)], capture_output=True, text=True)
    return json.loads(r.stdout or "{}")


def fotogramma(f, t):
    from PIL import Image
    b = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", str(t), "-i", str(f), "-frames:v", "1", "-f", "image2pipe", "-c:v", "png", "-"], capture_output=True).stdout
    return Image.open(io.BytesIO(b)).convert("RGB")


def dettaglio(im):                   # quanta «roba» c'è nel fotogramma: 0,7 = solo sfondo, 4–14 = scena normale
    from PIL import ImageFilter, ImageStat
    return ImageStat.Stat(im.convert("L").resize((270, 480)).filter(ImageFilter.FIND_EDGES).crop((2, 2, 268, 478))).mean[0]


def volume(f):
    out = subprocess.run(["ffmpeg", "-nostats", "-i", str(f), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    fine = out[out.rfind("Summary:"):]
    i = re.search(r"I:\s*(-?[\d.]+) LUFS", fine); p = re.search(r"Peak:\s*(-?[\d.]+) dBFS", fine)
    return (float(i.group(1)) if i else None, float(p.group(1)) if p else None)


def main():
    if len(sys.argv) < 2: sys.exit(__doc__)
    d = S.cartella(sys.argv[1]); s, base = S.carica(d)
    print(f"Controlli · {d.name} · «{s['titolo']}» · ossatura {s['ossatura']} · v{s.get('versione', 1)}\n")

    # 1 · copione
    err, avv = S.controlla_copione(s, d)
    for e in err: segna("ERRORE", "copione", e)
    for a in avv: segna("ATTENZIONE", "copione", a)
    if not err and not avv: segna("OK", "copione", "5 scene, massimo 6 parole a schermo, voce nei tempi")

    # 2 · zone sicure (nella pagina)
    if (d / "sorgente" / "index.html").exists():
        r = subprocess.run(["node", str(QUI / "motore" / "render.js"), str(d), "zone"], capture_output=True, text=True, env=S.ambiente(s))
        try:
            z = json.loads(r.stdout.strip().splitlines()[-1])
            for p in z["problemi"]: segna("ERRORE", "zone sicure", f"a {S.it(p['t'])} s {p['elemento']}: {p['problema']}")
            if not z["problemi"]: segna("OK", "zone sicure", f"testi e logo dentro 80 / 120 / 250 / 380 px in {len(z['tempi'])} istanti, nessun a capo imprevisto")
        except Exception:
            segna("ERRORE", "zone sicure", "la pagina non si apre: " + (r.stderr.strip().splitlines() or ["?"])[-1])
    else:
        segna("ERRORE", "sorgente", "manca sorgente/index.html (spot.py costruisci)")

    # 3 · tempi della voce
    import audio as A
    g = S.GRIGLIA; fr = A.frasi(d)
    for k, (clip, ini, fine, x) in enumerate(fr):
        if x is None: segna("ERRORE", "voce", f"manca audio/{clip}.mp3"); continue
        limite = fr[k + 1][1] if k + 1 < len(fr) else 15.0
        if fine > limite: segna("ERRORE", "voce", f"{clip} finisce a {fine:.2f} s, dopo l'inizio della frase successiva ({limite:.2f} s): accorciare il testo o anticipare l'inizio")
        elif fine > g[k + 1] + 0.05: segna("ATTENZIONE", "voce", f"{clip} finisce a {fine:.2f} s, oltre il cambio scena ({S.it(g[k+1])} s)")
        elif fine > limite - 0.15: segna("ATTENZIONE", "voce", f"{clip} finisce a {fine:.2f} s, a meno di 0,15 s dalla frase successiva")
    if all(x is not None for *_, x in fr) and not any(v == "voce" for _, v, _ in esiti):
        segna("OK", "voce", "6 frasi, nessuna sovrapposta: " + " · ".join(f"{i:.2f}–{f:.2f}" for _, i, f, _ in fr))

    # 4 · i due video finali
    finali = {v: d / "export" / S.nome_file(s, v) for v in ("musica", "senza-musica")}
    for v, f in finali.items():
        if not f.exists(): segna("ERRORE", "video", f"manca export/{f.name}"); continue
        p = sonda(f); vs = [x for x in p.get("streams", []) if x["codec_type"] == "video"]; au = [x for x in p.get("streams", []) if x["codec_type"] == "audio"]
        guai = []
        if not vs: guai.append("nessuna traccia video")
        else:
            x = vs[0]
            if (x["width"], x["height"]) != (1080, 1920): guai.append(f"{x['width']}×{x['height']} invece di 1080×1920")
            if x["r_frame_rate"] != "30/1": guai.append(f"{x['r_frame_rate']} fps invece di 30")
            if x["codec_name"] != "h264" or x.get("pix_fmt") != "yuv420p": guai.append(f"{x['codec_name']} {x.get('pix_fmt')} invece di h264 yuv420p")
            if abs(float(x.get("duration", 0)) - 15.0) > 0.04: guai.append(f"video di {float(x.get('duration', 0)):.2f} s invece di 15")
        if not au: guai.append("nessuna traccia audio")
        if guai: segna("ERRORE", "video", f"{f.name}: " + "; ".join(guai))
        else: segna("OK", "video", f"{f.name}: 1080×1920, 30 fps, 15 s, h264 + aac, {f.stat().st_size/1e6:.1f} MB")

    # 5 · momenti vuoti e foglio di controllo (dal video con musica)
    f = finali["musica"]
    if f.exists():
        from PIL import Image
        tempi = [0.0, 1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75, 10, 11.25, 12.5, 13.6, 14.4]
        ims = [fotogramma(f, t) for t in tempi]; vuoti = []
        for t, im in zip(tempi, ims):
            v = dettaglio(im); soglia = RIF["dettaglio_minimo_transizione"] if t in (2.5, 5, 7.5, 10, 12.5) else RIF["dettaglio_minimo_scena"]
            if t == 0.0 or t > 12.5: soglia = RIF["dettaglio_minimo_transizione"]      # primo fotogramma e chiusura comune
            if v < soglia: vuoti.append(f"{S.it(t)} s ({v:.1f})")
        if vuoti: segna("ATTENZIONE", "momenti vuoti", "fotogramma quasi vuoto a " + ", ".join(vuoti) + ": guardare controllo.jpg")
        else: segna("OK", "momenti vuoti", "primo fotogramma, 5 cambi scena e metà di ogni scena hanno contenuto")
        W, H, per = 270, 480, 7
        foglio = Image.new("RGB", (per * (W + 4), ((len(ims) + per - 1) // per) * (H + 4)), "white")
        for i, im in enumerate(ims): foglio.paste(im.resize((W, H)), ((i % per) * (W + 4), (i // per) * (H + 4)))
        foglio.save(d / "sorgente" / "controllo.jpg", quality=85)

    # 6 · volume percepito
    for v, f in finali.items():
        if not f.exists(): continue
        lufs, picco = volume(f)
        if lufs is None: segna("ATTENZIONE", "volume", f"{v}: non misurabile"); continue
        scarto = lufs - RIF["lufs_serie"]
        testo = f"{v}: {lufs:.1f} LUFS (serie {RIF['lufs_serie']:.1f}), picco {picco:.1f} dB"
        if abs(scarto) > RIF["lufs_tolleranza"]: segna("ATTENZIONE", "volume", testo + f": {'più forte' if scarto > 0 else 'più piano'} degli altri spot di {abs(scarto):.1f} LU")
        elif picco is not None and picco > -0.3: segna("ATTENZIONE", "volume", testo + ": picco troppo vicino allo zero")
        else: segna("OK", "volume", testo)

    larg = max(len(v) for _, v, _ in esiti)
    for liv, voce, det in esiti: print(f"  {liv:<10} {voce:<{larg}}  {det}")
    ne = sum(1 for l, *_ in esiti if l == "ERRORE"); na = sum(1 for l, *_ in esiti if l == "ATTENZIONE")
    print(f"\n{ne} errori, {na} avvisi." + ("  Foglio dei fotogrammi: sorgente/controllo.jpg" if (d / "sorgente" / "controllo.jpg").exists() else ""))
    print("Non verificabile da qui: pronuncia e volumi all'ascolto (li controlla l'utente), funzioni mostrate (claude/FUNZIONI.md), titoli che toccano gli oggetti 3D (guardare il foglio).")
    sys.exit(1 if ne else 0)


if __name__ == "__main__":
    main()
