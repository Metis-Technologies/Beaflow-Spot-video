#!/usr/bin/env python3
"""Voci di uno spot con la CLI di Higgsfield, sul PC (26/11: alternativa al connettore, quando non carica gli strumenti).

  python3 strumenti/voci-cli.py <cartella-spot> [--rifai] [--solo 2,4] [--prova]

Legge le frasi da <spot>/spot.json e le genera con elevenlabs_v4, voce Harrison, una alla volta;
le salva in <spot>/audio/line1.mp3 … (la chiusura comune non serve: è in comune/voce/chiusura.mp3).
  --prova   controlla solo formato e costo (generate cost, nessun credito speso)
  --rifai   rigenera anche le frasi che hanno già una clip
  --solo    solo le frasi indicate (es. --solo 3)
  --recupera  non genera: scarica le clip dei lavori già fatti (higgsfield generate list), riconosciuti dal testo
26/11: nella risposta di «create --wait» il primo URL audio era l'anteprima della voce (20,6 s, uguale per tutte):
si prende solo l'URL del risultato (chiavi con «result»), e la risposta si salva in audio/lineN.risposta.json.
Prima volta: npm i -g @higgsfield/cli && higgsfield auth login
"""
import json, re, shutil, subprocess, sys, urllib.request
from pathlib import Path

MODELLO = "elevenlabs_v4"
HARRISON = "573e5163-59b3-4926-aab1-951ef2985f81"
# il formato degli elementi di «dialogue» non è documentato: si prova con «generate cost», che non spende crediti
FORMATI = [   # «voice_type» è obbligatorio (26/11); Harrison è una voce preset di Higgsfield
    lambda t, vt=vt: [{"text": t, "voice_id": HARRISON, "voice_type": vt}]
    for vt in ("preset", "default", "library", "system", "elevenlabs", "voice")
]


def hf(*args):
    r = subprocess.run(["higgsfield", *args], capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr


def trova_formato(testo):
    for k, f in enumerate(FORMATI):
        code, out, err = hf("generate", "cost", MODELLO, "--dialogue", json.dumps(f(testo), ensure_ascii=False))
        if code == 0:
            print(f"formato {k + 1} accettato · costo: {out.strip() or '?'}")
            return f
        print(f"formato {k + 1} ({f('x')[0]['voice_type']}) rifiutato: {(err or out).strip().splitlines()[-1] if (err or out).strip() else code}")
    sys.exit("ERRORE: nessun formato accettato per «dialogue». Incolla questi messaggi a Claude.")


def url_audio(obj, path=""):
    """[(percorso, url)] di tutti i file audio dentro la risposta JSON."""
    out = []
    if isinstance(obj, dict):
        for k, v in obj.items(): out += url_audio(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for k, v in enumerate(obj): out += url_audio(v, f"{path}[{k}]")
    elif isinstance(obj, str) and re.match(r"https?://", obj) and re.search(r"\.(mp3|wav|m4a|ogg|aac)(\?|$)", obj, re.I):
        out.append((path, obj))
    return out


def url_risultato(obj):
    """L'URL del risultato: chiavi con «result», mai anteprime della voce."""
    tutti = url_audio(obj)
    buoni = [(p, u) for p, u in tutti if "result" in p.lower() and not re.search(r"voice|preview|sample|dialogue|param", p, re.I)]
    if not buoni: buoni = [(p, u) for p, u in tutti if not re.search(r"voice|preview|sample|dialogue|param", p, re.I)]
    return buoni[0][1] if buoni else None, tutti


def scarica(url, d, i):
    ext = re.search(r"\.(mp3|wav|m4a|ogg|aac)", url, re.I).group(1).lower()
    dst = d / "audio" / f"line{i}.mp3"; tmp = d / "audio" / f"line{i}.scaricata.{ext}"
    urllib.request.urlretrieve(url, tmp)
    if ext == "mp3": tmp.replace(dst)
    elif shutil.which("ffmpeg"):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-b:a", "192k", str(dst)], check=True); tmp.unlink()
    else: print(f"  salvata come {tmp.name} (manca ffmpeg per convertirla: la converte Claude)"); return
    print(f"  ok audio/{dst.name} ({dst.stat().st_size // 1024} KB)")


def recupera(d, frasi):
    code, out, err = hf("generate", "list", "--json")
    if code != 0: sys.exit(f"ERRORE: {(err or out).strip()}")
    lavori = json.loads(out); lavori = lavori.get("items", lavori.get("jobs", lavori)) if isinstance(lavori, dict) else lavori
    for i, testo in frasi:
        job = next((j for j in lavori if testo in json.dumps(j, ensure_ascii=False) and "complet" in json.dumps(j).lower()), None)
        if not job: print(f"line{i}: nessun lavoro completato con «{testo}»"); continue
        url, tutti = url_risultato(job)
        if not url: print(f"line{i}: lavoro trovato ma senza URL del risultato: {tutti}"); continue
        print(f"line{i}: «{testo}»"); scarica(url, d, i)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args: sys.exit(__doc__)
    if not shutil.which("higgsfield"): sys.exit("ERRORE: manca la CLI: npm i -g @higgsfield/cli && higgsfield auth login")
    d = Path(args[0]).resolve(); s = json.loads((d / "spot.json").read_text(encoding="utf-8"))
    solo = sys.argv[sys.argv.index("--solo") + 1] if "--solo" in sys.argv else None
    scelte = {int(x) for x in solo.split(",")} if solo else None
    frasi = [(i, sc["voce"]) for i, sc in enumerate(s["scene"], 1) if not scelte or i in scelte]
    (d / "audio").mkdir(exist_ok=True)
    if "--recupera" in sys.argv: recupera(d, frasi)
    else:
        fmt = trova_formato(frasi[0][1])
        if "--prova" in sys.argv: return
        for i, testo in frasi:
            dst = d / "audio" / f"line{i}.mp3"
            if dst.exists() and "--rifai" not in sys.argv: print(f"line{i}: c'è già, salto (--rifai per rigenerarla)"); continue
            print(f"line{i}: «{testo}» …", flush=True)
            code, out, err = hf("generate", "create", MODELLO, "--dialogue", json.dumps(fmt(testo), ensure_ascii=False), "--wait", "--json")
            if code != 0: sys.exit(f"ERRORE line{i}: {(err or out).strip()}")
            (d / "audio" / f"line{i}.risposta.json").write_text(out, encoding="utf-8")
            try: url, tutti = url_risultato(json.loads(out))
            except json.JSONDecodeError: url, tutti = None, out[:1500]
            if not url: sys.exit(f"ERRORE line{i}: nessun URL del risultato nella risposta (salvata in audio/line{i}.risposta.json): {tutti}")
            scarica(url, d, i)
    import hashlib
    impronte = {}
    for i, _ in frasi:
        f = d / "audio" / f"line{i}.mp3"
        if f.exists(): impronte.setdefault(hashlib.md5(f.read_bytes()).hexdigest(), []).append(f.name)
    for v in impronte.values():
        if len(v) > 1: print("ATTENZIONE: file identici " + ", ".join(v) + ": non sono le frasi giuste")
    print("Fatto. Dillo a Claude: prende le clip da audio/ e fa il mix.")


if __name__ == "__main__":
    main()
