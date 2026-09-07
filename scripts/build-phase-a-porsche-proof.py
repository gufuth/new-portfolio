from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import numpy as np
import random
import sys


BASE = Path(sys.argv[1])
ART = Path(sys.argv[2])
OUT = Path(sys.argv[3])

base = Image.open(BASE).convert("RGB")
source_art = Image.open(ART).convert("RGB")

# Measured inner art plane of the Porsche cabinet in the 1792 x 1008 WORK plate.
# The previous proof began at y=300, in front of the top cabinet rail and lamp stem.
# These four points sit inside the photographed bezel and stop above the label strip.
quad = np.array(
    [
        [830.0, 319.0],
        [1066.0, 320.0],
        [1066.0, 460.0],
        [830.0, 459.0],
    ],
    dtype=np.float64,
)

plane_w = round(max(np.linalg.norm(quad[1] - quad[0]), np.linalg.norm(quad[2] - quad[3])))
plane_h = round(max(np.linalg.norm(quad[3] - quad[0]), np.linalg.norm(quad[2] - quad[1])))
plane_corners = np.array(
    [[0.0, 0.0], [plane_w - 1.0, 0.0], [plane_w - 1.0, plane_h - 1.0], [0.0, plane_h - 1.0]],
    dtype=np.float64,
)


def perspective_coefficients(destination, source):
    """Return Pillow coefficients mapping destination pixels back to source pixels."""
    rows = []
    values = []
    for (x, y), (u, v) in zip(destination, source):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        values.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        values.append(v)
    return tuple(np.linalg.solve(np.asarray(rows, dtype=np.float64), np.asarray(values, dtype=np.float64)))


# Rectify the original face to recover its broad, source-derived illumination. Robust
# profiles keep the cabinet falloff but reject most of the old campaign subject.
face_reference = base.transform(
    (plane_w, plane_h),
    Image.Transform.PERSPECTIVE,
    perspective_coefficients(plane_corners, quad),
    Image.Resampling.BICUBIC,
)
reference_gray = np.asarray(face_reference.convert("L"), dtype=np.float32) / 255.0

# Cover-crop without distorting the Porsche artwork.
scale = max(plane_w / source_art.width, plane_h / source_art.height)
resized = source_art.resize(
    (round(source_art.width * scale), round(source_art.height * scale)),
    Image.Resampling.LANCZOS,
)
crop_left = (resized.width - plane_w) // 2
crop_top = (resized.height - plane_h) // 2
art = resized.crop((crop_left, crop_top, crop_left + plane_w, crop_top + plane_h))

# Preserve the campaign's neutral palette, but match the photographed board's distance,
# contrast and exposure rather than presenting pristine source pixels across the road.
art = ImageEnhance.Color(art).enhance(0.88)
art = ImageEnhance.Contrast(art).enhance(0.90)
arr = np.asarray(art, dtype=np.float32) / 255.0
arr = np.power(np.clip(arr, 0, 1), 1.07)

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

# Match the old photographed face's middle exposure. The first proof's brighter median
# was one of the cues that made it detach as a digital rectangle.
current_mid = float(np.quantile(arr.mean(axis=2), 0.50))
target_mid = float(np.quantile(reference_gray, 0.50)) * 1.03
arr *= np.clip(target_mid / max(current_mid, 1e-4), 0.30, 0.82)

# Recover only acrylic microtexture from the old face. Strong edges are rejected so the
# previous ship image cannot ghost through the replacement.
reference_blur = np.asarray(
    face_reference.convert("L").filter(ImageFilter.GaussianBlur(2.2)), dtype=np.float32
) / 255.0
micro = np.clip(reference_gray - reference_blur, -0.012, 0.012)
arr += micro[..., None] * 0.55

rng = np.random.default_rng(74)
low_noise = rng.normal(0, 1, (plane_h, plane_w)).astype(np.float32)
low_noise = np.asarray(
    Image.fromarray(np.uint8(np.clip(low_noise * 30 + 128, 0, 255)), mode="L").filter(
        ImageFilter.GaussianBlur(5.5)
    ),
    dtype=np.float32,
)
low_noise -= 128.0
low_noise /= max(float(low_noise.std()), 1e-4)
fine_noise = rng.normal(0, 0.0045, (plane_h, plane_w)).astype(np.float32)
arr *= (1 + low_noise * 0.013 + fine_noise)[..., None]

# One soft oblique pane reflection breaks the perfectly clean digital surface without
# globally recoloring the official art.
reflection_axis = (xn * 0.82 + yn * 0.36 - 0.63) / 0.12
reflection = np.exp(-(reflection_axis**2)) * 0.011
reflection_color = np.array([0.64, 0.67, 0.61], dtype=np.float32)
arr = arr * (1 - reflection[..., None]) + reflection_color * reflection[..., None]
arr = np.clip(arr, 0, 1)

surface = Image.fromarray(np.uint8(arr * 255), mode="RGB").filter(ImageFilter.GaussianBlur(0.72))

dust = Image.new("RGBA", (plane_w, plane_h), (0, 0, 0, 0))
draw = ImageDraw.Draw(dust)
rr = random.Random(55)
for _ in range(86):
    x = rr.randrange(plane_w)
    y = rr.randrange(plane_h)
    alpha = rr.randrange(2, 8)
    color = (220, 210, 185, alpha) if rr.random() < 0.42 else (8, 8, 7, alpha)
    draw.point((x, y), fill=color)
surface = Image.alpha_composite(surface.convert("RGBA"), dust)

# Warp the rectified plane into the actual aperture. The sub-pixel feather remains
# wholly behind the photographed frame, cabinet, lamp and label hardware.
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
result.save(OUT, "WEBP", quality=82, method=6)
print(
    f"Wrote {OUT} at {result.size[0]}x{result.size[1]} "
    f"using {plane_w}x{plane_h} measured Porsche art plane"
)
