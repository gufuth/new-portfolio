from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import random
import sys


BASE = Path(sys.argv[1])
OUT = Path(sys.argv[2])

base = Image.open(BASE).convert("RGB")

# Measured inner face of the photographed Porsche cabinet in the 1792 x 1008
# Booth 01 plate. This output is environment only: campaign pixels are supplied
# by a live browser layer in work-system.css.
quad = np.array(
    [[830.0, 319.0], [1066.0, 320.0], [1066.0, 460.0], [830.0, 459.0]],
    dtype=np.float64,
)
plane_w = 236
plane_h = 141
plane = np.array(
    [[0.0, 0.0], [plane_w - 1.0, 0.0], [plane_w - 1.0, plane_h - 1.0], [0.0, plane_h - 1.0]],
    dtype=np.float64,
)


def perspective_coefficients(destination, source):
    rows = []
    values = []
    for (x, y), (u, v) in zip(destination, source):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        values.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        values.append(v)
    return tuple(np.linalg.solve(np.asarray(rows), np.asarray(values)))


# Build a cheap, pre-existing acrylic face rather than trying to blur the old
# artwork away. Broad illumination follows the photographed cabinet; tiny wear
# remains uneven and quiet so the live art does not read as a pristine screen.
old_face = base.transform(
    (plane_w, plane_h),
    Image.Transform.PERSPECTIVE,
    perspective_coefficients(plane, quad),
    Image.Resampling.BICUBIC,
)
gray = np.asarray(old_face.convert("L"), dtype=np.float32) / 255.0
row = np.quantile(gray, 0.22, axis=1)
col = np.quantile(gray, 0.22, axis=0)
row = np.convolve(row, np.ones(25) / 25, mode="same")
col = np.convolve(col, np.ones(41) / 41, mode="same")
illumination = 0.64 * row[:, None] + 0.36 * col[None, :]
target = float(np.quantile(gray, 0.42))
illumination *= target / max(float(np.median(illumination[18:-18, 22:-22])), 1e-4)
illumination = np.clip(illumination, target * 0.72, target * 1.18)

yy, xx = np.mgrid[0:plane_h, 0:plane_w]
edge = np.minimum.reduce(
    [xx / (plane_w - 1), 1 - xx / (plane_w - 1), yy / (plane_h - 1), 1 - yy / (plane_h - 1)]
)
illumination *= 0.74 + 0.26 * np.clip(edge / 0.09, 0, 1)

rng = np.random.default_rng(319)
noise = rng.normal(0, 0.006, (plane_h, plane_w)).astype(np.float32)
rgb = np.stack([illumination * 0.88, illumination * 0.91, illumination * 0.87], axis=2)
rgb = np.clip(rgb + noise[:, :, None], 0, 1)
surface = Image.fromarray(np.uint8(rgb * 255), "RGB").filter(ImageFilter.GaussianBlur(0.45)).convert("RGBA")

dust = Image.new("RGBA", surface.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(dust)
rr = random.Random(91)
for _ in range(70):
    x = rr.randrange(plane_w)
    y = rr.randrange(plane_h)
    light = rr.random() < 0.38
    draw.point((x, y), fill=(206, 195, 168, rr.randrange(2, 7)) if light else (6, 6, 5, rr.randrange(2, 8)))
surface = Image.alpha_composite(surface, dust)

warped = surface.transform(
    base.size,
    Image.Transform.PERSPECTIVE,
    perspective_coefficients(quad, plane),
    Image.Resampling.BICUBIC,
    fillcolor=(0, 0, 0, 0),
)
mask = Image.new("L", base.size, 0)
ImageDraw.Draw(mask).polygon([tuple(point) for point in quad], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.45))
result = Image.composite(warped.convert("RGB"), base, mask)

OUT.parent.mkdir(parents=True, exist_ok=True)
result.save(OUT, "WEBP", quality=94, method=6)
print(f"Wrote clean live-layer environment plate: {OUT} ({result.width}x{result.height})")
