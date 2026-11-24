"""Cut the Ask Maps screen recording into the two clips the edit uses.

usage: python3 scripts/screen.py <ScreenRecording.mp4> public/

ask_typing.mp4  the prompt being typed, cropped to header + prompt box,
                sped up to TYPING_LEN. 15.5-23s is skipped (a notification
                covers the header there).
ask_result.mp4  loading -> answer -> pin on the map, status bar cropped,
                each part sped up to fit RESULT_LEN.
"""
import os, subprocess, sys

SRC, OUT = sys.argv[1], sys.argv[2]

def build(name, parts, crop, width):
    """parts: [(start, end, out_seconds)]"""
    args, chains, labels = [], [], []
    for i, (a, b, d) in enumerate(parts):
        args += ['-ss', str(a), '-t', str(b - a), '-i', SRC]
        chains.append(f'[{i}:v]{crop},setpts=PTS*{d/(b-a):.5f},fps=30,scale={width}:-2[v{i}]')
        labels.append(f'[v{i}]')
    graph = ';'.join(chains) + ';' + ''.join(labels) + f'concat=n={len(parts)}:v=1:a=0[o]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args, '-filter_complex', graph, '-map', '[o]', '-an',
                    '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
                    os.path.join(OUT, name)], check=True)

# 13s + 28.8s of typing -> 16.2s
build('ask_typing.mp4', [(2.0, 15.0, 5.05), (23.0, 51.8, 11.15)], 'crop=1170:1360:0:140', 1000)
# loading 6.2s -> 1.2s, answer 8s -> 3.6s, map pin 3s -> 1.4s
build('ask_result.mp4', [(51.8, 58.0, 1.2), (58.0, 66.0, 3.6), (66.0, 69.0, 1.4)], 'crop=1170:2400:0:130', 780)
