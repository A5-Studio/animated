"""Two-pass EBU R128 loudness normalisation to -14 LUFS (TikTok/Reels level).

Usage: python3 scripts/loudnorm.py trims-menu-001.mp4
The video stream is copied; only the audio is re-encoded.
"""
import json
import os
import subprocess
import sys

src = sys.argv[1]
target = 'loudnorm=I=-14:TP=-1.5:LRA=11'
err = subprocess.run(['ffmpeg', '-hide_banner', '-i', src, '-af', target + ':print_format=json', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
m = json.loads(err[err.rindex('{'):err.rindex('}') + 1])
af = (f"{target}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
tmp = src + '.tmp.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-c:v', 'copy', '-af', af, '-ar', '48000',
                '-c:a', 'aac', '-b:a', '192k', tmp], check=True)
os.replace(tmp, src)
