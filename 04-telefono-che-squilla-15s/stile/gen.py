import json, pathlib
ROOT = pathlib.Path(__file__).parent / "project"
FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;1,400&display=swap">'
THEMES = {
  "A": dict(name="Notte", bg="#0E0E0F", fg="#F4F1EC", muted="#9A958C", acc="#C8A45A", card="#18181A", border="1px solid rgba(255,255,255,0.12)", r="14px",
            tf="'Noto Serif', serif", tw="400", ts="-0.02em", onacc="#0E0E0F", btnbg="#F4F1EC", btnfg="#0E0E0F", rule="rgba(255,255,255,0.10)"),
  "B": dict(name="Editoriale", bg="#FAF8F5", fg="#1A1A1A", muted="#6B665F", acc="#775A18", card="#FFFFFF", border="1px solid #E4DED4", r="12px",
            tf="'Noto Serif', serif", tw="400", ts="-0.02em", onacc="#FFFFFF", btnbg="#1A1A1A", btnfg="#FFFFFF", rule="#EAE4DA"),
  "C": dict(name="Grafico", bg="#FFFFFF", fg="#111111", muted="#5F5F5F", acc="#775A18", card="#FFFFFF", border="1.5px solid #111111", r="6px",
            tf="Inter, sans-serif", tw="700", ts="-0.035em", onacc="#FFFFFF", btnbg="#111111", btnfg="#FFFFFF", rule="#111111"),
}
PHONE = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'
CHECK = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'

def page(title, body):
    return f'''<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONTS}
<style>
body{{margin:0}}
</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":540,"height":960}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''

def root(t, inner):
    return f'<div style="width: 540px; height: 960px; box-sizing: border-box; padding: 150px 40px 190px 40px; display: flex; flex-direction: column; gap: 26px; background: {t["bg"]}; color: {t["fg"]}; font-family: Inter, sans-serif">\n{inner}\n</div>'

def eyebrow(t, text):
    return f'<div style="font-size: 13px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: {t["acc"]}">{text}</div>'

def h1(t, html):
    return f'<h1 style="margin: 0; font-family: {t["tf"]}; font-weight: {t["tw"]}; font-size: 52px; line-height: 1.06; letter-spacing: {t["ts"]}">{html}</h1>'

def hook(t):
    rows = ""
    for name, when in (("Giulia R.", "9:12"), ("Numero sconosciuto", "9:40"), ("Marco B.", "10:05")):
        rows += f'<div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-top: 1px solid {t["rule"]}"><span style="font-size: 17px; font-weight: 500">{name}</span><span style="font-size: 15px; color: {t["muted"]}">Persa · {when}</span></div>\n'
    inner = "\n".join([
        eyebrow(t, "Chiamata in arrivo"),
        h1(t, "Squilla.<br>E hai le mani occupate."),
        f'<div style="display: flex; align-items: center; gap: 16px; padding: 18px 20px; background: {t["card"]}; border: {t["border"]}; border-radius: {t["r"]}">'
        f'<div style="width: 46px; height: 46px; border-radius: 50%; background: {t["acc"]}; display: flex; align-items: center; justify-content: center; flex: none">{PHONE.format(c=t["onacc"])}</div>'
        f'<div style="display: flex; flex-direction: column; gap: 3px; flex: 1"><span style="font-size: 18px; font-weight: 600">Cliente</span><span style="font-size: 15px; color: {t["muted"]}">Sta chiamando…</span></div>'
        f'<span style="font-size: 15px; font-weight: 600; color: {t["muted"]}">0:07</span></div>',
        f'<div style="display: flex; flex-direction: column"><div style="font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: {t["muted"]}; padding-bottom: 10px">Chiamate perse oggi</div>\n{rows}</div>',
    ])
    return root(t, inner)

def agenda(t):
    cards = ""
    for name, svc, when in (("Giulia R.", "Taglio e piega", "10:30"), ("Marco B.", "Barba", "11:15"), ("Sara T.", "Manicure", "15:00")):
        cards += (f'<div style="display: flex; align-items: center; gap: 14px; padding: 16px 18px; background: {t["card"]}; border: {t["border"]}; border-radius: {t["r"]}">'
                  f'<div style="display: flex; flex-direction: column; gap: 3px; flex: 1"><span style="font-size: 17px; font-weight: 600">{name}</span><span style="font-size: 15px; color: {t["muted"]}">{svc} · {when}</span></div>'
                  f'<span style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: {t["acc"]}">{CHECK.format(c=t["acc"])}Confermata</span></div>\n')
    inner = "\n".join([
        eyebrow(t, "Prenotazioni online"),
        h1(t, "Ora prenotano<br>da soli."),
        f'<div style="display: flex; flex-direction: column; gap: 10px">\n{cards}</div>',
        f'<button type="button" style="margin-top: 6px; height: 58px; border: none; border-radius: {t["r"]}; background: {t["btnbg"]}; color: {t["btnfg"]}; font-family: Inter, sans-serif; font-size: 18px; font-weight: 600">Inizia gratis</button>',
    ])
    return root(t, inner)

files = {"Main.dc.html": ("A", hook), "B-gancio.dc.html": ("B", hook), "C-gancio.dc.html": ("C", hook),
         "A-agenda.dc.html": ("A", agenda), "B-agenda.dc.html": ("B", agenda), "C-agenda.dc.html": ("C", agenda)}
boards, order = {}, []
for i, (fn, (k, fnc)) in enumerate(files.items()):
    t = THEMES[k]; scene = "gancio" if fnc is hook else "svolta"
    (ROOT / fn).write_text(page(f'{k} · {t["name"]} · {scene}', fnc(t)), encoding="utf-8")
    boards[fn] = {"x": (i % 3) * 620, "y": (i // 3) * 1080, "w": 540, "h": 960, "title": f'{k} · {t["name"]} — {scene}'}
    order.append(fn)
notes = {f"col{k}": {"x": j * 620, "y": -300, "text": f'{k} · {t["name"]}', "kind": "title1", "maxW": 540} for j, (k, t) in enumerate(THEMES.items())}
index = {"v": 3, "createdOnFiles": {"v": 1, "at": "2026-11-12T16:50:00Z"}, "title": "Beaflow · tre stili per lo spot «Il telefono che squilla»",
         "launch": {"view": "canvas"}, "pages": [], "boards": boards, "order": order, "notes": notes, "designSystems": []}
(ROOT / "canvas.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
print(sorted(p.name for p in ROOT.iterdir()))
