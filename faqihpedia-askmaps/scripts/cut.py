"""Cut dead air from the talking-head clip and tone-map it to SDR.

usage: python3 scripts/cut.py <IMG_5077.MOV> public/source.mp4 [cuts.json]

Keeps speech, drops every silence >= MIN_GAP (leaving PAD on each side),
and skips the first two outro takes. Writes the kept ranges to cuts.json
so captions can be remapped from source time to edit time.
"""
import json, os, re, subprocess, sys

SRC, OUT = sys.argv[1], sys.argv[2]
CUTS = sys.argv[3] if len(sys.argv) > 3 else 'cuts.json'

KEEP = [(1.22, 59.95), (74.05, 79.85)]  # main take, then the third (clean) outro take
MIN_GAP, PAD = 0.28, 0.10

log = subprocess.run(
    ['ffmpeg', '-hide_banner', '-i', SRC, '-af', 'silencedetect=n=-30dB:d=%s' % MIN_GAP, '-f', 'null', '-'],
    capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
sil = list(zip(starts, ends))

ranges = []
for a, b in KEEP:
    cur = a
    for s0, s1 in sil:
        if s0 + PAD > cur and s1 - PAD < b and s1 - s0 >= MIN_GAP:
            ranges.append((cur, s0 + PAD))
            cur = s1 - PAD
    ranges.append((cur, b))
ranges = [(round(a, 3), round(b, 3)) for a, b in ranges if b - a > 0.05]

# 1) tone-map HLG -> SDR at output size (one pass, low memory)
TMP = OUT + '.sdr.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC, '-vf',
                'scale=1080:1920,zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,'
                'zscale=t=bt709:m=bt709:r=tv,format=yuv420p', '-map', '0:v:0', '-map', '0:a:0',
                '-c:v', 'libx264', '-crf', '14', '-preset', 'veryfast', '-c:a', 'pcm_s16le', '-f', 'mov', TMP], check=True)
# 2) keep only the speech ranges with select/aselect
expr = '+'.join(f'between(t,{a},{b})' for a, b in ranges)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', TMP,
                '-vf', f"select='{expr}',setpts=N/FRAME_RATE/TB",
                '-af', f"aselect='{expr}',asetpts=N/SR/TB",
                '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-r', '30', '-c:a', 'aac', '-b:a', '192k',
                '-movflags', '+faststart', OUT], check=True)
os.remove(TMP)
json.dump(ranges, open(CUTS, 'w'), indent=1)
total = sum(b - a for a, b in ranges)
print(f'{len(ranges)} segments, {total:.2f}s kept (from {KEEP[-1][1]-KEEP[0][0]:.2f}s span)')
