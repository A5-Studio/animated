"""Cut the person out of the talking-head clip with Robust Video Matting.

Usage: python3 scripts/matte.py <model.onnx> <source.mp4> <out_alpha.mp4> [seconds]
Writes a grayscale matte video (white = person) at the source size. The
recurrent state carries across frames, so edges stay steady over time.
Model: rvm_mobilenetv3_fp32.onnx from
https://github.com/PeterL1n/RobustVideoMatting/releases/tag/v1.0.0
"""
import subprocess
import sys
import time

import numpy as np
import onnxruntime as ort

W, H = 1080, 1920
model, src, out = sys.argv[1:4]
dur = sys.argv[4] if len(sys.argv) > 4 else None

sess = ort.InferenceSession(model, providers=['CPUExecutionProvider'])
rec = [np.zeros([1, 1, 1, 1], np.float32)] * 4
ratio = np.array([0.25], np.float32)  # RVM's recommendation for 1080p-class input

rd = subprocess.Popen(
    ['ffmpeg', '-v', 'error', '-i', src, *(['-t', dur] if dur else []), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    stdout=subprocess.PIPE,
)
wr = subprocess.Popen(
    ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
     '-c:v', 'libx264', '-crf', '12', '-pix_fmt', 'yuv420p', out],
    stdin=subprocess.PIPE,
)
n, t0 = 0, time.time()
while True:
    buf = rd.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    x = np.frombuffer(buf, np.uint8).reshape(H, W, 3).transpose(2, 0, 1)[None].astype(np.float32) / 255
    _, pha, *rec = sess.run(None, {'src': x, 'r1i': rec[0], 'r2i': rec[1], 'r3i': rec[2], 'r4i': rec[3], 'downsample_ratio': ratio})
    wr.stdin.write((pha[0, 0] * 255).clip(0, 255).astype(np.uint8).tobytes())
    n += 1
    if n % 150 == 0:
        print(f'{n} frames, {n / (time.time() - t0):.1f} fps', flush=True)
wr.stdin.close()
wr.wait()
print(f'done: {n} frames in {time.time() - t0:.0f}s')
