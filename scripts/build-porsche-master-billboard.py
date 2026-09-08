from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
import numpy as np
import random
import sys

BASE = Path(sys.argv[1])
HERO = Path(sys.argv[2])
OUT = Path(sys.argv[3])
FACE_OUT = Path(sys.argv[4]) if len(sys.argv) > 4 else None

base = Image.open(BASE).convert("RGB")
hero_source = Image.open(HERO).convert("RGB")

# Measured Porsche billboard art aperture in the locked 1792 x 1008 WORK plate.
quad = np.array(
    [[830.0, 319.0], [1066.0, 320.0], [1066.0, 460.0], [830.0, 459.0]],
    dtype=np.float64,
)
plane_w = round(max(np.linalg.norm(quad[1] - quad[0]), np.linalg.norm(quad[2] - quad[3])))
plane_h = round(max(np.linalg.norm(quad[3] - quad[0]), np.linalg.norm(quad[2] - quad[1])))
plane_corners = np.array(
    [[0.0, 0.0], [plane_w - 1.0, 0.0], [plane_w - 1.0, plane_h - 1.0], [0.0, plane_h - 1.0]],
    dtype=np.float64,
)


def perspective_coefficients(destination, source):
    rows, values = [], []
    for (x, y), (u, v) in zip(destination, source):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); values.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y]); values.append(v)
    return tuple(np.linalg.solve(np.asarray(rows, dtype=np.float64), np.asarray(values, dtype=np.float64)))


# Build the complete billboard face FIRST, at the exact physical aperture ratio.
# The case image and bottom identity strip are one printed/installed surface.
master_w = 1888
master_h = round(master_w * plane_h / plane_w)
label_h = round(master_h * 0.22)
image_h = master_h - label_h

scale = max(master_w / hero_source.width, image_h / hero_source.height)
hero = hero_source.resize(
    (round(hero_source.width * scale), round(hero_source.height * scale)),
    Image.Resampling.LANCZOS,
)
left = max((hero.width - master_w) // 2, 0)
top = max((hero.height - image_h) // 2, 0)
hero = hero.crop((left, top, left + master_w, top + image_h))
hero = ImageEnhance.Color(hero).enhance(0.96)
hero = ImageEnhance.Contrast(hero).enhance(0.97)

face = Image.new("RGB", (master_w, master_h), (96, 81, 50))
face.paste(hero, (0, 0))

# Warm, worn printed lower strip. Texture remains subtle because the later physical pass
# adds the cabinet's photographed optical character over the complete face.
yy, xx = np.mgrid[0:label_h, 0:master_w]
rng = np.random.default_rng(20260908)
base_tone = np.zeros((label_h, master_w, 3), dtype=np.float32)
base_tone[:] = np.array([111, 92, 56], dtype=np.float32)
base_tone *= np.linspace(1.04, 0.92, label_h, dtype=np.float32)[:, None, None]
base_tone += rng.normal(0, 2.2, (label_h, master_w, 1)).astype(np.float32)
label = Image.fromarray(np.uint8(np.clip(base_tone, 0, 255)), mode="RGB")
face.paste(label, (0, image_h))

draw = ImageDraw.Draw(face)
draw.line((0, image_h, master_w, image_h), fill=(49, 42, 28), width=8)
draw.rectangle((2, image_h + 2, master_w - 3, master_h - 3), outline=(78, 65, 40), width=4)

bold_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
regular_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
font1 = ImageFont.truetype(bold_path, round(label_h * 0.28))
font2 = ImageFont.truetype(regular_path, round(label_h * 0.21))
ink = (26, 23, 16)
pad_x = round(master_w * 0.035)
draw.text((pad_x, image_h + round(label_h * 0.12)), "Porsche × Lucasfilm", font=font1, fill=ink)
draw.text((pad_x, image_h + round(label_h * 0.52)), "The Designer Alliance", font=font2, fill=(36, 32, 22))

# Very restrained printed wear on the strip, before the cabinet-level treatment.
wear = Image.new("RGBA", face.size, (0, 0, 0, 0))
wear_draw = ImageDraw.Draw(wear)
rr = random.Random(83)
for _ in range(750):
    x = rr.randrange(master_w)
    y = rr.randrange(image_h, master_h)
    a = rr.randrange(2, 10)
    c = (14, 13, 10, a) if rr.random() < 0.72 else (220, 205, 166, a)
    wear_draw.point((x, y), fill=c)
face = Image.alpha_composite(face.convert("RGBA"), wear).convert("RGB")

if FACE_OUT:
    FACE_OUT.parent.mkdir(parents=True, exist_ok=True)
    face.save(FACE_OUT, "WEBP", quality=92, method=6)

# Downsample the entire designed face as ONE object to the measured board plane.
surface = face.resize((plane_w, plane_h), Image.Resampling.LANCZOS)

# Rectify the photographed board to recover broad source-derived illumination/material.
face_reference = base.transform(
    (plane_w, plane_h),
    Image.Transform.PERSPECTIVE,
    perspective_coefficients(plane_corners, quad),
    Image.Resampling.BICUBIC,
)
reference_gray = np.asarray(face_reference.convert("L"), dtype=np.float32) / 255.0

surface = ImageEnhance.Color(surface).enhance(0.90)
surface = ImageEnhance.Contrast(surface).enhance(0.91)
arr = np.asarray(surface, dtype=np.float32) / 255.0
arr = np.power(np.clip(arr, 0, 1), 1.06)

row_profile = np.quantile(reference_gray, 0.32, axis=1)
col_profile = np.quantile(reference_gray, 0.32, axis=0)
row_profile = np.convolve(row_profile, np.ones(17) / 17, mode="same")
col_profile = np.convolve(col_profile, np.ones(25) / 25, mode="same")
row_profile /= max(float(np.median(row_profile[10:-10])), 1e-4)
col_profile /= max(float(np.median(col_profile[10:-10])), 1e-4)
illumination = np.clip(0.62 * row_profile[:, None] + 0.38 * col_profile[None, :], 0.72, 1.16)

yy, xx = np.mgrid[0:plane_h, 0:plane_w]
xn = xx / max(plane_w - 1, 1)
yn = yy / max(plane_h - 1, 1)
edge = np.minimum.reduce([xn, 1 - xn, yn, 1 - yn])
behind_bezel = 0.70 + 0.30 * np.clip(edge / 0.085, 0, 1)
arr *= (illumination * behind_bezel)[..., None]

current_mid = float(np.quantile(arr.mean(axis=2), 0.50))
target_mid = float(np.quantile(reference_gray, 0.50)) * 1.03
arr *= np.clip(target_mid / max(current_mid, 1e-4), 0.30, 0.84)

reference_blur = np.asarray(
    face_reference.convert("L").filter(ImageFilter.GaussianBlur(2.2)), dtype=np.float32
) / 255.0
micro = np.clip(reference_gray - reference_blur, -0.012, 0.012)
arr += micro[..., None] * 0.55

rng = np.random.default_rng(74)
low_noise = rng.normal(0, 1, (plane_h, plane_w)).astype(np.float32)
low_noise = np.asarray(
    Image.fromarray(np.uint8(np.clip(low_noise * 30 + 128, 0, 255)), mode="L").filter(ImageFilter.GaussianBlur(5.5)),
    dtype=np.float32,
)
low_noise -= 128.0
low_noise /= max(float(low_noise.std()), 1e-4)
fine_noise = rng.normal(0, 0.0045, (plane_h, plane_w)).astype(np.float32)
arr *= (1 + low_noise * 0.013 + fine_noise)[..., None]

reflection_axis = (xn * 0.82 + yn * 0.36 - 0.63) / 0.12
reflection = np.exp(-(reflection_axis**2)) * 0.011
reflection_color = np.array([0.64, 0.67, 0.61], dtype=np.float32)
arr = arr * (1 - reflection[..., None]) + reflection_color * reflection[..., None]
arr = np.clip(arr, 0, 1)

surface = Image.fromarray(np.uint8(arr * 255), mode="RGB").filter(ImageFilter.GaussianBlur(0.72))

dust = Image.new("RGBA", (plane_w, plane_h), (0, 0, 0, 0))
dust_draw = ImageDraw.Draw(dust)
rr = random.Random(55)
for _ in range(86):
    x = rr.randrange(plane_w); y = rr.randrange(plane_h); alpha = rr.randrange(2, 8)
    color = (220, 210, 185, alpha) if rr.random() < 0.42 else (8, 8, 7, alpha)
    dust_draw.point((x, y), fill=color)
surface = Image.alpha_composite(surface.convert("RGBA"), dust)

warped = surface.transform(
    base.size,
    Image.Transform.PERSPECTIVE,
    perspective_coefficients(quad, plane_corners),
    Image.Resampling.BICUBIC,
    fillcolor=(0, 0, 0, 0),
)
mask = Image.new("L", base.size, 0)
ImageDraw.Draw(mask).polygon([tuple(point) for point in quad], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(0.55))

result = Image.composite(warped.convert("RGB"), base, mask)
OUT.parent.mkdir(parents=True, exist_ok=True)
result.save(OUT, "WEBP", quality=84, method=6)
print(f"Wrote {OUT} using one complete {master_w}x{master_h} billboard face into {plane_w}x{plane_h} aperture")
