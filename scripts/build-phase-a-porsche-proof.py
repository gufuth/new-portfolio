from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import numpy as np
import random
import sys

BASE = Path(sys.argv[1])
ART = Path(sys.argv[2])
OUT = Path(sys.argv[3])

base = Image.open(BASE).convert('RGB')
art = Image.open(ART).convert('RGB')

# Exact inner image aperture of the Porsche billboard in the approved 1792x1008 WORK plate.
# The photographed frame, lamp, label strip and supports stay untouched around this aperture.
box = (826, 300, 1069, 468)
w, h = box[2] - box[0], box[3] - box[1]

# Cover-fit without distortion.
scale = max(w / art.width, h / art.height)
resized = art.resize((round(art.width * scale), round(art.height * scale)), Image.Resampling.LANCZOS)
left = (resized.width - w) // 2
top = (resized.height - h) // 2
art = resized.crop((left, top, left + w, top + h))

# Environmental integration. This is intentionally modest: preserve authentic campaign pixels,
# but photograph them through the same distance, lamp falloff and dirty glass as the scene.
rng = np.random.default_rng(74)
yy, xx = np.mgrid[0:h, 0:w]
xn = xx / (w - 1)
yn = yy / (h - 1)

# Overhead billboard lamp: a restrained top-center pool that falls away toward edges/bottom.
rad = ((xn - 0.47) / 0.62) ** 2 + ((yn + 0.08) / 0.78) ** 2
spot = 0.73 + 0.33 * np.exp(-rad * 1.25)

# Cabinet/glass edge falloff.
edge = np.minimum.reduce([xn, 1 - xn, yn, 1 - yn])
vignette = 0.78 + 0.22 * np.clip(edge / 0.13, 0, 1)

# Low-frequency glass/print variation plus very fine photographic dirt.
noise = rng.normal(0, 1, (h, w)).astype('float32')
noise_img = Image.fromarray(np.uint8(np.clip(noise * 32 + 128, 0, 255))).filter(ImageFilter.GaussianBlur(5))
low = (np.asarray(noise_img, dtype=np.float32) - 128) / 255.0
fine = rng.normal(0, 0.013, (h, w)).astype('float32')

art = ImageEnhance.Color(art).enhance(0.80)
art = ImageEnhance.Contrast(art).enhance(0.88)
arr = np.asarray(art, dtype='float32') / 255.0
arr = np.power(np.clip(arr, 0, 1), 1.08) * 0.64
arr *= (spot * vignette * (1 + low * 0.95 + fine))[..., None]

# Extremely light warm contamination only in brighter portions, not a global campaign recolor.
luminance = arr.mean(2, keepdims=True)
warm = np.array([0.90, 0.82, 0.68], dtype='float32')
alpha = np.clip((luminance - 0.22) * 0.09, 0, 0.035)
arr = arr * (1 - alpha) + warm[None, None, :] * luminance * alpha
arr = np.clip(arr, 0, 1)

surface = Image.fromarray(np.uint8(arr * 255)).filter(ImageFilter.GaussianBlur(0.52))

# Sparse glass dust/scratches. Fixed seed keeps the production plate deterministic.
overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)
rr = random.Random(55)
for _ in range(240):
    x = rr.randrange(w)
    y = rr.randrange(h)
    a = rr.randrange(3, 12)
    color = (230, 218, 188, a) if rr.random() < 0.45 else (12, 12, 10, a)
    draw.point((x, y), fill=color)
for _ in range(10):
    x = rr.randrange(10, w - 10)
    y = rr.randrange(5, h - 5)
    length = rr.randrange(10, 42)
    draw.line(
        (x, y, min(w - 2, x + length), min(h - 2, y + rr.choice([-2, -1, 0, 1]))),
        fill=(210, 200, 175, rr.randrange(3, 8)),
        width=1,
    )
surface = Image.alpha_composite(surface.convert('RGBA'), overlay).convert('RGB')

result = base.copy()
result.paste(surface, box)
OUT.parent.mkdir(parents=True, exist_ok=True)
result.save(OUT, 'WEBP', quality=64, method=6)
print(f'Wrote {OUT} at {result.size[0]}x{result.size[1]}')
