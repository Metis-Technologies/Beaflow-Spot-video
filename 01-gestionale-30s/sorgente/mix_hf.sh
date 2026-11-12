#!/bin/bash
# Monta le 6 clip vocali di Higgsfield sul video.
#   bash mix_hf.sh <cartella-clip> <file-uscita.mp4>
# Le clip si chiamano line1.mp3 … line6.mp3. S = inizio di ogni frase in millisecondi.
set -e
cd "$(dirname "$0")"
DIR=${1:-../audio}; OUT=${2:-beaflow-saas-animation-voce-harrison.mp4}
S=(150 4700 10300 15800 20950 25150)
ffmpeg -y -loglevel error \
  -i $DIR/line1.mp3 -i $DIR/line2.mp3 -i $DIR/line3.mp3 -i $DIR/line4.mp3 -i $DIR/line5.mp3 -i $DIR/line6.mp3 \
  -filter_complex "[0]aresample=48000,adelay=${S[0]}[a0];[1]aresample=48000,adelay=${S[1]}[a1];[2]aresample=48000,adelay=${S[2]}[a2];[3]aresample=48000,adelay=${S[3]}[a3];[4]aresample=48000,adelay=${S[4]}[a4];[5]aresample=48000,adelay=${S[5]}[a5];[a0][a1][a2][a3][a4][a5]amix=inputs=6:normalize=0,apad=whole_dur=31,atrim=0:31,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[a]" \
  -map "[a]" -ac 2 $DIR/voiceover.wav
ffmpeg -y -loglevel error -i beaflow-saas-animation.mp4 -i $DIR/voiceover.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart mix.tmp.mp4
mv mix.tmp.mp4 "$OUT"
