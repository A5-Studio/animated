#!/usr/bin/env bash
# Insert the 3s TRIMS opening bumper (from trims-bumper/) after the hook,
# then normalize loudness for Reels/TikTok (-14 LUFS).
#
# Usage: scripts/splice.sh <main render.mp4> <out.mp4> [at seconds, default 9.5 = BUMPER_AT in src/theme.ts]
set -euo pipefail
MAIN=$1
OUT=$2
AT=${3:-9.5}
BUMPER=$(dirname "$0")/../public/trims-bumper.mp4
TMP=$(mktemp -d)
ENC=(-c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 48000 -ac 2)

ffmpeg -v error -y -i "$MAIN" -t "$AT" -af "afade=t=out:st=$(python3 -c "print($AT-0.04)"):d=0.04" "${ENC[@]}" "$TMP/a.mp4"
ffmpeg -v error -y -i "$BUMPER" -af "afade=t=in:d=0.01" "${ENC[@]}" "$TMP/b.mp4"
ffmpeg -v error -y -ss "$AT" -i "$MAIN" -af "afade=t=in:d=0.04" "${ENC[@]}" "$TMP/c.mp4"
printf "file '%s'\n" "$TMP/a.mp4" "$TMP/b.mp4" "$TMP/c.mp4" > "$TMP/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/joined.mp4"
# two-pass loudnorm: measure, then apply one linear gain so it lands on -14 LUFS
M=$(ffmpeg -hide_banner -i "$TMP/joined.mp4" -vn -af loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
AF=$(python3 -I -c "import json,sys; m=json.loads(sys.argv[1]); print(f\"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true\")" "$M")
# then a limiter: the bumper's "ta-da" hit would otherwise overshoot 0 dBFS after AAC encoding
ffmpeg -v error -y -i "$TMP/joined.mp4" -c:v copy -af "$AF" -c:a aac -b:a 192k -ar 48000 "$TMP/loud.mp4"
ffmpeg -v error -y -i "$TMP/loud.mp4" -c:v copy -af "alimiter=limit=0.75:level=false:attack=1:release=40" -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
rm -r "$TMP"
echo "wrote $OUT"
