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

# The Porsche cabinet has TWO physical printed surfaces:
# 1) the main campaign-art aperture, behind the bezel
# 2) the separate lower case-study ID strip
# They are art-directed as one billboard assembly, but mapped to their real surfaces.
ART_QUAD = np.array(
    [[830.0, 319.0], [1066.0, 320.0], [1066.0, 460.0], [830.0, 459.0]],
    dtype=np.float64,
)
LABEL_QUAD = np.array(
    [[830.0, 461.0], [1066.0, 462.0], [1066.0, 515.0], [830.0, 514.0]],
    dtype=np.float64,
)


def plane_size(quad):
    w = round(max(np.linalg.norm(quad[1] - quad[0]), np.linalg.norm(quad[2] - quad[3])))
    h = round(max(np.linalg.norm(quad[3] - quad[0]), np.linalg.norm(quad[2] - quad[1])))
    return w, h


def perspective_coefficients(destination, source):
    rows, values = [], []
    for (x, y), (u, v) in zip(destination, source):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); values.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y]); values.append(v)
    return tuple(np.linalg.solve(np.asarray(rows, dtype=np.float64), np.asarray(values, dtype=np.float64)))


def rectified_reference(source_image, quad, w, h):
    corners = np.array([[0.0, 0.0], [w - 1.0, 0.0], [w - 1.0, h - 1.0], [0.0, h - 1.0]], dtype=np.float64)
    return source_image.transform(
        (w, h),
        Image.Transform.PERSPECTIVE,
        perspective_coefficients(corners, quad),
        Image.Resampling.BICUBIC,
    )


def physicalize(surface, reference, seed, blur=0.72, target_boost=1.03):
    w, h = surface.size
    reference_gray = np.asarray(reference.convert("L"), dtype=np.float32) / 255.0
    surface = ImageEnhance.Color(surface).enhance(0.90)
    surface = ImageEnhance.Contrast(surface).enhance(0.91)
    arr = np.asarray(surface, dtype=np.float32) / 255.0
    arr = np.power(np.clip(arr, 0, 1), 1.06)

    row_profile = np.quantile(reference_gray, 0.32, axis=1)
    col_profile = np.quantile(reference_gray, 0.32, axis=0)
    row_kernel = min(17, h if h % 2 else max(h - 1, 3))
    col_kernel = min(25, w if w % 2 else max(w - 1, 3))
    row_kernel = max(row_kernel, 3)
    col_kernel = max(col_kernel, 3)
    row_profile = np.convolve(row_profile, np.ones(row_kernel) / row_kernel, mode="same")
    col_profile = np.convolve(col_profile, np.ones(col_kernel) / col_kernel, mode="same")
    row_profile /= max(float(np.median(row_profile)), 1e-4)
    col_profile /= max(float(np.median(col_profile)), 1e-4)
    illumination = np.clip(0.62 * row_profile[:, None] + 0.38 * col_profile[None, :], 0.74, 1.14)

    yy, xx = np.mgrid[0:h, 0:w]
    xn = xx / max(w - 1, 1)
    yn = yy / max(h - 1, 1)
    edge = np.minimum.reduce([xn, 1 - xn, yn, 1 - yn])
    behind_bezel = 0.72 + 0.28 * np.clip(edge / 0.085, 0, 1)
    arr *= (illumination * behind_bezel)[..., None]

    current_mid = float(np.quantile(arr.mean(axis=2), 0.50))
    target_mid = float(np.quantile(reference_gray, 0.50)) * target_boost
    arr *= np.clip(target_mid / max(current_mid, 1e-4), 0.35, 0.90)

    reference_blur = np.asarray(reference.convert("L").filter(ImageFilter.GaussianBlur(2.0)), dtype=np.float32) / 255.0
    micro = np.clip(reference_gray - reference_blur, -0.012, 0.012)
    arr += micro[..., None] * 0.50

    rng = np.random.default_rng(seed)
    low_noise = rng.normal(0, 1, (h, w)).astype(np.float32)
    low_noise = np.asarray(
        Image.fromarray(np.uint8(np.clip(low_noise * 30 + 128, 0, 255)), mode="L").filter(ImageFilter.GaussianBlur(4.8)),
        dtype=np.float32,
    )
    low_noise -= 128.0
    low_noise /= max(float(low_noise.std()), 1e-4)
    fine_noise = rng.normal(0, 0.0040, (h, w)).astype(np.float32)
    arr *= (1 + low_noise * 0.012 + fine_noise)[..., None]

    reflection_axis = (xn * 0.82 + yn * 0.36 - 0.63) / 0.12
    reflection = np.exp(-(reflection_axis**2)) * 0.010
    reflection_color = np.array([0.64, 0.67, 0.61], dtype=np.float32)
    arr = arr * (1 - reflection[..., None]) + reflection_color * reflection[..., None]
    arr = np.clip(arr, 0, 1)

    out = Image.fromarray(np.uint8(arr * 255), mode="RGB").filter(ImageFilter.GaussianBlur(blur))
    dust = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dust_draw = ImageDraw.Draw(dust)
    rr = random.Random(seed + 19)
    for _ in range(max(30, round(w * h / 385))):
        x = rr.randrange(w); y = rr.randrange(h); alpha = rr.randrange(2, 8)
        color = (220, 210, 185, alpha) if rr.random() < 0.42 else (8, 8, 7, alpha)
        dust_draw.point((x, y), fill=color)
    return Image.alpha_composite(out.convert("RGBA"), dust)


def composite_plane(scene, surface, quad):
    w, h = surface.size
    corners = np.array([[0.0, 0.0], [w - 1.0, 0.0], [w - 1.0, h - 1.0], [0.0, h - 1.0]], dtype=np.float64)
    warped = surface.transform(
        scene.size,
        Image.Transform.PERSPECTIVE,
        perspective_coefficients(quad, corners),
        Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )
    mask = Image.new("L", scene.size, 0)
    ImageDraw.Draw(mask).polygon([tuple(point) for point in quad], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.50))
    return Image.composite(warped.convert("RGB"), scene, mask)


art_w, art_h = plane_size(ART_QUAD)
label_w, label_h = plane_size(LABEL_QUAD)
art_reference = rectified_reference(base, ART_QUAD, art_w, art_h)
label_reference = rectified_reference(base, LABEL_QUAD, label_w, label_h)

# Main hero artwork, cover-cropped without distortion.
scale = max(art_w / hero_source.width, art_h / hero_source.height)
hero = hero_source.resize((round(hero_source.width * scale), round(hero_source.height * scale)), Image.Resampling.LANCZOS)
left = max((hero.width - art_w) // 2, 0)
top = max((hero.height - art_h) // 2, 0)
hero = hero.crop((left, top, left + art_w, top + art_h))
hero = physicalize(hero, art_reference, seed=74, blur=0.72, target_boost=1.03)

# Rebuild the REAL lower ID strip from its photographed material, then print the case name into it.
# The broad source texture stays; old lettering is removed by a strong blur before new text is added.
label_bg = label_reference.filter(ImageFilter.GaussianBlur(7.0)).resize((label_w * 6, label_h * 6), Image.Resampling.BICUBIC)
label_draw = ImageDraw.Draw(label_bg)
bold_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
regular_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
font1 = ImageFont.truetype(bold_path, max(22, round(label_h * 6 * 0.26)))
font2 = ImageFont.truetype(regular_path, max(18, round(label_h * 6 * 0.21)))
pad_x = round(label_w * 6 * 0.04)
ink = (35, 31, 21)
label_draw.text((pad_x, round(label_h * 6 * 0.10)), "Porsche × Lucasfilm", font=font1, fill=ink)
label_draw.text((pad_x, round(label_h * 6 * 0.49)), "The Designer Alliance", font=font2, fill=(44, 39, 27))
label_surface = label_bg.resize((label_w, label_h), Image.Resampling.LANCZOS)
label_surface = physicalize(label_surface, label_reference, seed=91, blur=0.46, target_boost=1.02)

# Optional audit preview: the two designed physical surfaces shown together before scene mapping.
if FACE_OUT:
    preview_scale = 6
    preview = Image.new("RGB", (art_w * preview_scale, (art_h + label_h) * preview_scale), (0, 0, 0))
    preview.paste(hero.convert("RGB").resize((art_w * preview_scale, art_h * preview_scale), Image.Resampling.NEAREST), (0, 0))
    preview.paste(label_surface.convert("RGB").resize((label_w * preview_scale, label_h * preview_scale), Image.Resampling.NEAREST), (0, art_h * preview_scale))
    FACE_OUT.parent.mkdir(parents=True, exist_ok=True)
    preview.save(FACE_OUT, "WEBP", quality=92, method=6)

result = composite_plane(base, hero, ART_QUAD)
result = composite_plane(result, label_surface, LABEL_QUAD)
OUT.parent.mkdir(parents=True, exist_ok=True)
result.save(OUT, "WEBP", quality=84, method=6)
print(f"Wrote {OUT}; hero {art_w}x{art_h}, lower ID strip {label_w}x{label_h}; both baked into their real photographed surfaces")
