#!/usr/bin/env bash
# Scarica sorgenti, audio e video finali dei due spot da 15 s e li mette nelle cartelle giuste.
# Uso, dalla cartella principale del repository (Git Bash su Windows, terminale su Mac/Linux):
#   bash strumenti/importa-spot-15s.sh
set -euo pipefail
cd "$(dirname "$0")/.."
BASE=https://d2ol7oe51mr4n9.cloudfront.net/user_3LsB4XoxzLiS0ETnC5BLa6AO1hD
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

echo "Scarico il kit dei sorgenti..."
curl -fsSL -o "$TMP/kit.zip" "$BASE/f48cb638-53dd-45df-9189-5bcdfbc57bdd.zip"
unzip -q "$TMP/kit.zip" -d "$TMP"
K="$TMP/kit-spot-motion-design"

importa() {   # <cartella nel kit> <cartella dello spot>
  local src="$K/$1" dst="$2"
  mkdir -p "$dst/sorgente" "$dst/audio"
  cp "$src/index.html" "$src/render.js" "$src/audio.py" "$src/package.json" "$dst/sorgente/"
  cp "$src"/vo/line*.mp3 "$dst/audio/"
  # gli script cercavano le clip in vo/: ora stanno in audio/, la musica in comune/musica/
  sed -i.bak -e 's|ROOT / "vo" / "music.mp3"|ROOT.parent.parent / "comune" / "musica" / "beaflow_musica_120bpm.mp3"|' \
             -e 's|ROOT / "vo"|ROOT.parent / "audio"|g' "$dst/sorgente/audio.py"
  rm -f "$dst/sorgente/audio.py.bak"
}
importa esempio-agenda-vuota       02-agenda-vuota-15s
importa esempio-online-in-5-minuti 03-online-in-5-minuti-15s
mkdir -p comune/musica
cp "$K/esempio-agenda-vuota/vo/music.mp3" comune/musica/beaflow_musica_120bpm.mp3

scarica() {   # <file sul server> <destinazione>
  echo "Scarico $2..."
  mkdir -p "$(dirname "$2")"
  curl -fsSL -o "$2" "$BASE/$1"
}
scarica f9b22259-38c7-408f-9226-02961379b6a8.mp4 02-agenda-vuota-15s/export/beaflow_agenda-vuota_15s_musica_v1.mp4
scarica ff38ba12-163c-4850-88bd-745926d60455.mp4 02-agenda-vuota-15s/export/beaflow_agenda-vuota_15s_senza-musica_v1.mp4
scarica 8776744a-6e07-426c-a83f-203b04b31c66.mp4 02-agenda-vuota-15s/export/archivio/beaflow_ti-stanno-cercando_15s_musica_v1.mp4
scarica b590332e-0d74-4c31-a9ed-e3923fda5547.mp4 02-agenda-vuota-15s/export/archivio/beaflow_ti-stanno-cercando_15s_senza-musica_v1.mp4
scarica f0e447b7-50c6-455c-bdc0-70d56a0a03ee.mp4 03-online-in-5-minuti-15s/export/beaflow_online-in-5-minuti_15s_musica_v1.mp4
scarica 1c094501-ecee-4e64-9883-dd28699c17f1.mp4 03-online-in-5-minuti-15s/export/beaflow_online-in-5-minuti_15s_senza-musica_v1.mp4

echo
echo "Fatto. Ora:  git add -A && git commit -m \"Aggiunge gli spot da 15 s\" && git push"
