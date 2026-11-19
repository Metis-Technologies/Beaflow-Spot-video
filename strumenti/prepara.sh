#!/usr/bin/env bash
# Prepara la macchina (o il container di una sessione nuova) per produrre gli spot: si lancia una volta, dalla cartella del repo.
#   bash strumenti/prepara.sh
set -euo pipefail
cd "$(dirname "$0")/motore"

for c in node npm python3 ffmpeg ffprobe; do
  command -v "$c" >/dev/null || { echo "MANCA: $c"; exit 1; }
done

echo "· Three.js e font (strumenti/motore/node_modules, comuni a tutti gli spot)"
npm install --no-audit --no-fund --silent

echo "· Librerie Python (numpy, soundfile, pillow)"
python3 -c "import numpy, soundfile, PIL" 2>/dev/null || pip install -q numpy soundfile pillow 2>/dev/null || pip install -q --break-system-packages numpy soundfile pillow

echo "· Playwright e browser"
if ! node -e "for (const p of ['playwright', require('child_process').execSync('npm root -g').toString().trim() + '/playwright', '/opt/npm-tools/node_modules/playwright']) { try { require(p); process.exit(0) } catch {} } process.exit(1)" 2>/dev/null; then
  npm install --no-audit --no-fund --silent --no-save playwright
fi
if [ -z "${CHROME:-}" ] && ! ls /usr/bin/google-chrome /usr/bin/chromium /usr/bin/chromium-browser >/dev/null 2>&1; then
  npx --yes playwright install chromium || echo "ATTENZIONE: nessun browser trovato. Installare Chrome o indicarlo con CHROME=/percorso"
fi
echo "Pronto. Prova:  python3 strumenti/spot.py fotogrammi 40-chiusura-cassa-15s"
