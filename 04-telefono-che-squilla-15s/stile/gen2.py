import json, pathlib, re
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).parent; P = R / "project"
FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Serif:ital,wght@0,400;1,400&display=swap">'
INK, CREAM, BRASS, RED, GREY_D, GREY_L = "#111111", "#FBF8F4", "#775A18", "#FF5A4F", "#B5B5B5", "#5F5F5F"
PHONE = '<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>'
CHECK = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'

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
# zona sicura a scala 540: alto 125, destra 60, basso 190, sinistra 40
def root(bg, fg, inner, extra=""):
    return f'<div style="width: 540px; height: 960px; box-sizing: border-box; padding: 125px 60px 190px 40px; display: flex; flex-direction: column; background: {bg}; color: {fg}; font-family: Inter, sans-serif; {extra}">\n{inner}\n</div>'
def logo(color, size=30):
    return f'<div style="font-family: \'Noto Serif\', serif; font-style: italic; font-size: {size}px; line-height: 1.2; letter-spacing: -0.02em; color: {color}">Beaflow</div>'
def label(text, color, mt=0):
    return f'<div style="margin-top: {mt}px; font-size: 16px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: {color}">{text}</div>'

def gancio():
    rows = "".join(f'<div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-top: 1px solid #3A3A3A"><span style="font-size: 24px; font-weight: 500">{n}</span><span style="font-size: 20px; font-weight: 600; color: {RED}">Persa · {w}</span></div>\n'
                   for n, w in (("Giulia R.", "9:12"), ("Numero sconosciuto", "9:40"), ("Marco B.", "10:05")))
    inner = "\n".join([
        logo("#FFFFFF"),
        label("Il tuo salone · chiamata in arrivo", GREY_D, 40),
        '<h1 style="margin: 16px 0 0 0; font-size: 88px; font-weight: 800; line-height: 1; letter-spacing: -0.04em">Squilla.</h1>',
        '<div style="margin-top: 12px; font-size: 32px; font-weight: 600; line-height: 1.2; letter-spacing: -0.02em">E hai le mani occupate.</div>',
        f'<div style="margin-top: 30px; display: flex; align-items: center; gap: 18px; padding: 20px; border: 1.5px solid #FFFFFF; border-radius: 6px">'
        f'<div style="width: 56px; height: 56px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; flex: none">{PHONE}</div>'
        f'<div style="display: flex; flex-direction: column; gap: 4px; flex: 1"><span style="font-size: 24px; font-weight: 600">Cliente</span><span style="font-size: 20px; color: {GREY_D}">Sta chiamando…</span></div>'
        f'<span style="font-size: 20px; font-weight: 600; color: {GREY_D}">0:07</span></div>',
        f'<div style="margin-top: 30px; display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px">{label("Chiamate perse oggi", GREY_D)}<span style="font-size: 20px; font-weight: 700; color: {RED}">3 perse</span></div>',
        f'<div style="display: flex; flex-direction: column">\n{rows}</div>',
    ])
    return root(INK, "#FFFFFF", inner)

def svolta():
    cards = "".join(f'<div style="display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: #FFFFFF; border: 1.5px solid {INK}; border-radius: 6px">'
                    f'<div style="display: flex; flex-direction: column; gap: 4px; flex: 1"><span style="font-size: 24px; font-weight: 600">{n}</span><span style="font-size: 20px; color: {GREY_L}">{s} · {w}</span></div>'
                    f'<span style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 6px; background: {BRASS}; color: #FFFFFF; font-size: 16px; font-weight: 700">{CHECK}Confermata</span></div>\n'
                    for n, s, w in (("Giulia R.", "Taglio e piega", "10:30"), ("Marco B.", "Barba", "11:15"), ("Sara T.", "Manicure", "15:00")))
    inner = "\n".join([
        logo(INK),
        label("Prenotazioni online", BRASS, 40),
        '<h1 style="margin: 16px 0 0 0; font-size: 56px; font-weight: 800; line-height: 1.04; letter-spacing: -0.04em">Ora prenotano<br>da soli.</h1>',
        f'<div style="margin-top: 30px; display: flex; flex-direction: column; gap: 12px">\n{cards}</div>',
        f'<div style="margin-top: 24px; font-size: 20px; font-weight: 600">3 prenotazioni. 0 telefonate.</div>',
    ])
    return root(CREAM, INK, inner)

def chiusura():
    inner = "\n".join([
        logo(INK, 104),
        f'<button type="button" style="margin-top: 44px; width: 100%; height: 72px; border: none; border-radius: 6px; background: {INK}; color: #FFFFFF; font-family: Inter, sans-serif; font-size: 24px; font-weight: 700">Inizia gratis</button>',
        f'<div style="margin-top: 22px; font-size: 22px; font-weight: 600">Piano Free · 0 € per sempre</div>',
        f'<div style="margin-top: 10px; font-size: 20px; font-weight: 500; color: {GREY_L}">beaflow.it</div>',
    ])
    return root(CREAM, INK, inner, "justify-content: center; align-items: center; text-align: center")

NEW = {"C2-gancio.dc.html": ("Grafico corretto — gancio", gancio), "C2-svolta.dc.html": ("Grafico corretto — svolta", svolta), "C2-chiusura.dc.html": ("Grafico corretto — chiusura", chiusura)}
index = json.loads((R / "canvas.current.json").read_text(encoding="utf-8"))
for i, (fn, (title, fnc)) in enumerate(NEW.items()):
    (P / fn).write_text(page(title, fnc()), encoding="utf-8")
    index["boards"][fn] = {"x": i * 620, "y": 2460, "w": 540, "h": 960, "title": title}
    if fn not in index["order"]: index["order"].append(fn)
index["notes"]["rowC2"] = {"x": 0, "y": 2160, "text": "C · Grafico corretto (dopo le tre revisioni)", "kind": "title1", "maxW": 1780}
(P / "canvas.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")

# anteprima locale
F = "/home/claude/beaflow-esplora/node_modules/@fontsource/%s/files/%s-latin-%s.woff2"
faces = "".join('@font-face{font-family:Inter;font-weight:%d;src:url(file://%s) format("woff2")}' % (w, F % ("inter", "inter", f"{w}-normal")) for w in (400, 500, 600, 700, 800))
faces += '@font-face{font-family:"Noto Serif";font-style:italic;font-weight:400;src:url(file://%s) format("woff2")}' % (F % ("noto-serif", "noto-serif", "400-italic"))
(R / "review").mkdir(exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome")
    pg = b.new_page(viewport={"width": 540, "height": 960}, device_scale_factor=2)
    for fn in NEW:
        src = (P / fn).read_text(encoding="utf-8")
        body = re.search(r"</helmet>\n(.*)\n</x-dc>", src, re.S).group(1)
        h = R / "review" / fn.replace(".dc.html", ".html")
        h.write_text(f"<!doctype html><meta charset='utf-8'><style>{faces}body{{margin:0}}</style>{body}", encoding="utf-8")
        pg.goto(h.as_uri()); pg.evaluate("document.fonts.ready")
        pg.screenshot(path=str(R / "review" / fn.replace(".dc.html", ".png")))
        ov = pg.evaluate("(() => { const r=document.body.firstElementChild; let maxB=0,maxR=0; r.querySelectorAll('*').forEach(e=>{const b=e.getBoundingClientRect(); maxB=Math.max(maxB,b.bottom); maxR=Math.max(maxR,b.right);}); return [Math.round(maxB), Math.round(maxR)]; })()")
        print(fn, "fondo contenuto y =", ov[0], "(limite 770)  destra x =", ov[1], "(limite 480)")
    b.close()
