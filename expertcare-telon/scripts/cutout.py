"""Cut the tube out of the listing photo (purple backdrop -> transparent).

Usage: python3 scripts/cutout.py public/img/product.jpg public/img/tube.png
"""
import sys

import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1:3]
im = Image.open(src).convert('RGB').crop((110, 260, 430, 857))
a = np.asarray(im).astype(np.float32)

# backdrop = purple-grey: blue clearly above green, and not bright like the tube
r, g, b = a[..., 0], a[..., 1], a[..., 2]
lum = (r + g + b) / 3
bgish = (b - g > 14) & (lum < 175)

# The tube is convex left-to-right, so per row keep everything between its
# first and last solid run (6+ non-backdrop pixels); that keeps the purple
# artwork on the label even where it touches the edge.
solid = ~bgish
H, W = solid.shape
RUN = 6
L = np.full(H, -1)
R = np.full(H, -1)
for y in range(H):
    runs = np.convolve(solid[y].astype(np.int32), np.ones(RUN, np.int32), 'valid') == RUN
    idx = np.flatnonzero(runs)
    if len(idx):
        L[y], R[y] = idx[0], idx[-1] + RUN
# the cap's lower ring sits in shadow and reads as backdrop; it is as wide
# as the ring above it, so carry the last span down to the crop bottom
last = np.flatnonzero(L >= 0)[-1]
L[last:], R[last:] = L[last], R[last]
# the outline changes slowly, so a running median over rows irons out notches
# where label art meets the edge
K = 10
keep = np.zeros(solid.shape, bool)
for y in range(H):
    win = slice(max(0, y - K), min(H, y + K + 1))
    l, r = L[win][L[win] >= 0], R[win][R[win] >= 0]
    if L[y] >= 0 and len(l):
        keep[y, int(np.median(l)):int(np.median(r))] = True
region = ~keep
alpha = Image.fromarray(((~region) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
rgba = im.copy()
rgba.putalpha(alpha)
rgba = rgba.crop(rgba.getbbox())
rgba.save(out)
print('saved', out, rgba.size)
