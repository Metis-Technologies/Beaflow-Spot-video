#!/usr/bin/env python3
"""Render di index.html in MP4.
  python3 render.py stills 2.9 8.0 ...      -> frames/still_<t>.jpg
  python3 render.py segments [nome ...]     -> out/<nome>.mp4 (uno per scena)
  python3 render.py join                    -> beaflow-spot-esplora-muto.mp4
"""
import os, subprocess, sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
FPS, W, H = 30, 1080, 1920
# segmenti: tagli nei punti in cui il frame è continuo (stessa timeline), quindi il concat è invisibile
SEGMENTS = [("s1_ricerca", 0.0, 2.5), ("s2_mappa", 2.5, 7.0), ("s3_orario", 7.0, 11.0),
            ("s4_notifiche", 11.0, 15.0), ("s5_agenda", 15.0, 17.5), ("s6_chiusura", 17.5, 20.0)]
ENC = ["-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p",
       "-profile:v", "high", "-r", str(FPS), "-movflags", "+faststart"]


def open_page(p):
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--force-color-profile=srgb", "--font-render-hinting=none"])
    pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
    pg.goto((ROOT / "index.html").as_uri())
    pg.evaluate("window.ready")
    return b, pg


def shot(pg, t, **kw):
    pg.evaluate("t => seek(t)", t)
    return pg.screenshot(type="jpeg", quality=92, **kw)


def stills(times):
    (ROOT / "frames").mkdir(exist_ok=True)
    with sync_playwright() as p:
        b, pg = open_page(p)
        for t in times:
            shot(pg, float(t), path=str(ROOT / "frames" / f"still_{float(t):05.2f}.jpg"))
        b.close()


def segments(names):
    (ROOT / "out").mkdir(exist_ok=True)
    with sync_playwright() as p:
        b, pg = open_page(p)
        for name, a, z in SEGMENTS:
            if names and name not in names:
                continue
            n = round((z - a) * FPS)
            tmp, final = ROOT / "out" / f"{name}.tmp.mp4", ROOT / "out" / f"{name}.mp4"
            ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-c:v", "mjpeg",
                                   "-framerate", str(FPS), "-i", "-", *ENC, str(tmp)], stdin=subprocess.PIPE)
            t0 = time.time()
            for i in range(n):
                ff.stdin.write(shot(pg, a + i / FPS))
            ff.stdin.close()
            if ff.wait() != 0:
                sys.exit(f"ffmpeg failed on {name}")
            os.replace(tmp, final)
            print(f"{name}: {n} frames in {time.time() - t0:.1f}s", flush=True)
        b.close()


def join():
    lst = ROOT / "out" / "list.txt"
    lst.write_text("".join(f"file '{name}.mp4'\n" for name, _, _ in SEGMENTS))
    tmp, final = ROOT / "out" / "joined.tmp.mp4", ROOT / "beaflow-spot-esplora-muto.mp4"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-c", "copy", "-movflags", "+faststart", str(tmp)], check=True)
    os.replace(tmp, final)
    print("ok", final)


if __name__ == "__main__":
    cmd = sys.argv[1]
    {"stills": lambda: stills(sys.argv[2:]), "segments": lambda: segments(sys.argv[2:]), "join": join}[cmd]()
