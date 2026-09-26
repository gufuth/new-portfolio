"""Build all ten WORK / MORE WORK billboard faces into the photographed plates.

Implements the locked 8-step baked pipeline in docs/design/billboard-physical-face-system-v1.md,
generalising the accepted Porsche master proof (scripts/build-porsche-master-billboard.py +
scripts/fix-porsche-label-strip.py) to every cabinet. Geometry: docs/design/billboard-geometry-all-v1.md.

Usage:
  python scripts/build-all-billboards.py --render-type   # (network) rasterise the strip type + SCOOBA svg via Chromium
  python scripts/build-all-billboards.py                 # deterministic rebuild of both plates (offline)
  python scripts/build-all-billboards.py --faces DIR     # also dump the designed surfaces before mapping

Type: Barlow Condensed (SIL OFL 1.1, already loaded by the site), 700 for the client line and 500 for
the case line, rasterised once by Chromium from the site's own Google Fonts request into
scripts/billboard-type/*.png so the plate build is offline and deterministic. No image model draws text.
"""

from pathlib import Path
import argparse
import json
import random

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
TYPE_DIR = ROOT / "scripts" / "billboard-type"
SRC_DIR = ROOT / "scripts" / "billboard-src"
WORK_BASE = ASSETS / "work-panorama-physical-v2.webp"
MORE_BASE = ASSETS / "more-work-panorama-five-v1.webp"
MORE_CLONE_SRC = ASSETS / "more-work-panorama-current.webp"
WORK_OUT = ASSETS / "work-panorama-physical-v4.webp"
MORE_OUT = ASSETS / "more-work-panorama-physical-v3.webp"
FACES_JSON = ROOT / "docs" / "design" / "billboard-faces-v2.json"  # face picks (source + crop box)

CREAM_ALBEDO = np.array([0.93, 0.87, 0.72], dtype=np.float32)


def Q(x0, y0, x1, y1):
    return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]


# face: source image, crop = (focus_x, focus_y, zoom) in source-normalised coords.
BOARDS = {
    "work": [
        dict(
            id="nike",
            client="Nike SB × Staple",
            title="Panda Pigeon",
            face=Q(161.5, 297.5, 454.5, 457.5),
            strip=Q(163.5, 460.5, 456.5, 500.5),
            src="assets/cases/nike-hero.webp",
            pre=(0, 0, 796, 985),  # drop the hero's cut-off red swatch at the right edge
            crop=(0.47, 0.54, 1.0),
            seed=11,
        ),
        dict(
            id="virgin",
            client="Virgin Galactic",
            title="Unity 22",
            face=Q(505.5, 310.5, 765, 457.5),
            strip=Q(506.5, 462.5, 766, 500.5),
            face_occ=[(689.5, 0, 9999, 9999)],
            strip_occ=[(688.5, 0, 9999, 9999)],
            # Chosen face: virgin-work-01 (carrier + spaceship + contrails). The hero's rocket is a ~20px
            # speck at billboard scale; two silhouettes read as aircraft/spacecraft at 1024 and 1440.
            src="assets/cases/virgin-work-01.webp",
            grade=dict(cyan=0.55),  # daylight-blue sky would otherwise read as a lit screen at night
            crop=(0.47, 0.25, 1.12),
            # Rejected candidate (compare with --virgin-alt): frame 10 of zc_pull virgin-galactic/02.gif,
            # the engine firing. It read as a dark wedge at board scale.
            alt=dict(src="scripts/billboard-src/virgin-face.png", crop=(0.58, 0.50, 1.25)),
            seed=12,
        ),
        dict(
            id="porsche",
            client="Porsche × Lucasfilm",
            title="The Designer Alliance",
            face=Q(829.5, 319.5, 1067.5, 460),
            strip=Q(822.5, 465.5, 1071.5, 501.5),
            src="assets/cases/porsche-hero.webp",
            crop=(0.50, 0.50, 1.0),
            seed=13,
        ),
        dict(
            id="selsun",
            client="Selsun Blue",
            title="Dan Driff",
            face=Q(1128.5, 316.5, 1368.5, 459.5),
            strip=Q(1129, 466, 1368.5, 501.5),
            src="assets/cases/selsun-hero.webp",
            crop=(0.50, 0.50, 1.0),
            seed=14,
        ),
        dict(
            id="moneylion",
            client="MoneyLion × Beast Games",
            title="Beast Games Giveaway",
            face=Q(1416, 310.5, 1674.5, 460.5),
            strip=Q(1416.5, 468, 1673.5, 503.5),
            src="assets/cases/moneylion-hero.webp",
            # Council round: read pasted (too bright, cyan too saturated). Grade into the night.
            grade=dict(cyan=0.40, knee=0.50, exposure=0.84),
            crop=(0.55, 0.68, 1.0),
            seed=15,
        ),
    ],
    "more": [
        dict(
            id="alita",
            client="TE Connectivity × Alita",
            # Longest identity on either plate: balance the two lines (client a touch smaller, case
            # line larger, 600 weight, opened tracking, denser ink) so the case line reads like the others.
            type=dict(cap1=0.215, cap2=0.21, gap=0.115, top=0.125, w2=600, track2=0.02, pad=0.04, ink=0.88),
            title="The Science Behind Science Fiction",
            face=Q(155.5, 91.5, 346.5, 218.5),
            strip=Q(154.5, 218.5, 349, 264.5),
            src="assets/cases/alita-work-01.webp",
            crop=(0.32, 0.53, 1.12),
            seed=21,
        ),
        dict(
            id="cuervo",
            client="Jose Cuervo",
            title="Playamar + Tradicional Cristalino",
            face=Q(417.5, 92.5, 604.5, 219),
            strip=Q(412.5, 219.5, 607.5, 265),
            src="assets/cases/cuervo-hero-poster.webp",
            crop=(0.50, 0.42, 1.0),
            seed=22,
        ),
        dict(
            id="outdoor",
            client="Outdoor Voices",
            title="Let’s Play",
            face=Q(658.5, 94.5, 843, 221),
            strip=Q(654.5, 221.5, 845.5, 265),
            src="assets/cases/outdoor-voices-hero.webp",
            crop=(0.50, 0.45, 1.0),
            seed=23,
        ),
        dict(
            id="atlantic",
            client="The Atlantic",
            title="Social voice",
            face=Q(891.5, 95.5, 1072.5, 222.5),
            strip=Q(889.5, 222.5, 1077.5, 264.5),
            src="assets/cases/atlantic-hero-poster.webp",
            crop=(0.50, 0.52, 1.25),
            seed=24,
        ),
        dict(
            id="scooba",
            client="SCOOBA LOVE",
            title="How to Evaluate Work",
            face=Q(1137.4, 96.8, 1296.7, 208.6),
            strip=Q(1135.7, 208.6, 1301.1, 245.6),
            src="scripts/billboard-src/scooba-hero.png",
            crop=(0.4125, 0.48, 1.06),
            seed=25,
        ),
    ],
}

PLATE = {
    # soft = resample factor that reproduces the plate's own detail level; type = strip layout.
    "work": dict(
        soft=0.62,
        blur=0.45,
        grain=0.010,
        veil=0.55,
        glass=0.9,
        veil_light=0.025,
        pull=0.55,
        type=dict(top=0.12, cap1=0.33, gap=0.13, cap2=0.25, pad=0.045),
    ),
    "more": dict(
        soft=0.72,
        blur=0.40,
        grain=0.012,
        veil=0.0,
        pull=0.55,
        veil_light=0.045,
        glass=0.0,  # above these cabinets is lamp hardware, not open glass: no glass-texture transfer
        type=dict(top=0.12, cap1=0.245, gap=0.13, cap2=0.175, pad=0.05),
    ),
}


# ---------------------------------------------------------------- geometry helpers
def coeffs(dst, src):
    rows, vals = [], []
    for (x, y), (u, v) in zip(dst, src):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        vals.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        vals.append(v)
    return tuple(np.linalg.solve(np.asarray(rows, float), np.asarray(vals, float)))


def plane_size(quad):
    q = np.asarray(quad, float)
    w = round(max(np.linalg.norm(q[1] - q[0]), np.linalg.norm(q[2] - q[3])))
    h = round(max(np.linalg.norm(q[3] - q[0]), np.linalg.norm(q[2] - q[1])))
    return w, h


def corners(w, h):
    return [[0.0, 0.0], [w - 1.0, 0.0], [w - 1.0, h - 1.0], [0.0, h - 1.0]]


def rectify(img, quad, w, h):
    return img.transform(
        (w, h),
        Image.Transform.PERSPECTIVE,
        coeffs(corners(w, h), quad),
        Image.Resampling.BICUBIC,
    )


def composite(scene, surface, quad, occluders=(), feather=0.5):
    w, h = surface.size
    warped = surface.convert("RGB").transform(
        scene.size,
        Image.Transform.PERSPECTIVE,
        coeffs(quad, corners(w, h)),
        Image.Resampling.BICUBIC,
    )
    # Supersampled polygon mask so half-pixel edges land as partial coverage.
    S = 4
    big = Image.new("L", (scene.width * S, scene.height * S), 0)
    d = ImageDraw.Draw(big)
    d.polygon([(x * S, y * S) for x, y in quad], fill=255)
    for x0, y0, x1, y1 in occluders:
        d.rectangle((x0 * S, y0 * S, x1 * S, y1 * S), fill=0)
    mask = big.resize(scene.size, Image.Resampling.BOX).filter(
        ImageFilter.GaussianBlur(feather)
    )
    return Image.composite(warped, scene, mask)


# ---------------------------------------------------------------- source-derived light
def strip_light(base, strip_quad, occ):
    """Lamp colour, white level and horizontal falloff, derived from the photographed ID strip.

    The strip is the one surface on each cabinet that is still original photography of a cream
    plate under that cabinet's lamp, so it calibrates exposure for the face above it."""
    w, h = plane_size(strip_quad)
    ref = np.asarray(rectify(base, strip_quad, w, h), np.float32) / 255.0
    x_vis = w
    for x0, *_ in occ:
        x_vis = min(
            x_vis,
            int((x0 - strip_quad[0][0]) / (strip_quad[1][0] - strip_quad[0][0]) * w)
            - 1,
        )
    vis = ref[:, : max(8, x_vis)]
    rgb = np.median(vis.reshape(-1, 3), axis=0)
    light = rgb / CREAM_ALBEDO  # irradiance x camera, per channel
    lum = light.mean()
    light = lum + 0.78 * (light - lum)  # keep most of the lamp's warmth
    col = np.median(vis.mean(axis=2), axis=0)
    k = max(5, len(col) // 5) | 1
    col = np.convolve(np.pad(col, k // 2, mode="edge"), np.ones(k) / k, mode="valid")
    col /= max(float(np.median(col)), 1e-4)
    return light.astype(np.float32), np.clip(col, 0.82, 1.18), x_vis / w


def resample(profile, n):
    return np.interp(
        np.linspace(0, len(profile) - 1, n), np.arange(len(profile)), profile
    )


def glass_texture(base, quad, w, h):
    """High-pass of the sky/glass directly above the cabinet: the same window glass (rain, smear,
    compression grain) sits between the camera and the board face."""
    q = np.asarray(quad, float)
    lift = min(h + 48, float(q[:, 1].min()) - 2)  # clear the lamp hoods (they sit ~20-35px above each face)
    sky = [[x, y - lift] for x, y in quad]
    patch = rectify(base, sky, w, h).convert("L")
    a = np.asarray(patch, np.float32) / 255.0
    b = np.asarray(patch.filter(ImageFilter.GaussianBlur(2.2)), np.float32) / 255.0
    return np.clip(a - b, -0.03, 0.03), float(
        np.median(
            np.asarray(rectify(base, sky, w, h), np.float32).reshape(-1, 3), axis=0
        ).mean()
    )


def sky_rgb(base, quad, h):
    q = np.asarray(quad, float)
    x0, x1 = int(q[:, 0].min()), int(q[:, 0].max())
    y1 = int(q[:, 1].min()) - 48
    y0 = max(0, y1 - h)
    a = np.asarray(base, np.float32)[y0:y1, x0:x1] / 255.0
    return np.median(a.reshape(-1, 3), axis=0)


def finish(arr, w, h, plate, seed, reflect=0.010):
    """Steps 5-6 shared tail: grain, reflection, distance softness, dust."""
    rng = np.random.default_rng(seed)
    low = rng.normal(0, 1, (h, w)).astype(np.float32)
    low = (
        np.asarray(
            Image.fromarray(np.uint8(np.clip(low * 30 + 128, 0, 255)), "L").filter(
                ImageFilter.GaussianBlur(5.0)
            ),
            np.float32,
        )
        - 128.0
    )
    low /= max(float(low.std()), 1e-4)
    arr = arr * (1 + low * 0.018)[..., None]
    yy, xx = np.mgrid[0:h, 0:w]
    xn, yn = xx / max(w - 1, 1), yy / max(h - 1, 1)
    band = np.exp(-(((xn * 0.82 + yn * 0.36 - 0.63) / 0.13) ** 2)) * reflect
    arr = (
        arr * (1 - band[..., None])
        + np.array([0.55, 0.60, 0.56], np.float32) * band[..., None] * 0.35
    )
    arr = np.clip(arr, 0, 1)
    img = Image.fromarray(np.uint8(arr * 255 + 0.5), "RGB")
    sw, sh = max(8, round(w * plate["soft"])), max(6, round(h * plate["soft"]))
    img = img.resize((sw, sh), Image.Resampling.BOX).resize(
        (w, h), Image.Resampling.BICUBIC
    )
    img = img.filter(ImageFilter.GaussianBlur(plate["blur"]))
    a = np.asarray(img, np.float32) / 255.0
    a += (
        rng.normal(0, plate["grain"], (h, w))[..., None]
        * a.mean(axis=2, keepdims=True) ** 0.5
    )
    img = Image.fromarray(np.uint8(np.clip(a, 0, 1) * 255 + 0.5), "RGB").convert("RGBA")
    dust = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dust)
    rr = random.Random(seed + 7)
    for _ in range(max(40, w * h // 420)):
        x, y = rr.randrange(w), rr.randrange(h)
        c = (
            (215, 205, 180, rr.randrange(3, 10))
            if rr.random() < 0.4
            else (6, 6, 5, rr.randrange(4, 14))
        )
        dd.point((x, y), fill=c)
    return Image.alpha_composite(img, dust).convert("RGB")


# ---------------------------------------------------------------- face (steps 3, 5, 6)
_RAW_MEANS = []
def cover_crop(src, w, h, crop):
    fx, fy, zoom = crop
    scale = max(w / src.width, h / src.height) * zoom
    rs = src.resize(
        (max(w, round(src.width * scale)), max(h, round(src.height * scale))),
        Image.Resampling.LANCZOS,
    )
    cx, cy = fx * rs.width, fy * rs.height
    left = int(np.clip(round(cx - w / 2), 0, rs.width - w))
    top = int(np.clip(round(cy - h / 2), 0, rs.height - h))
    return rs.crop((left, top, left + w, top + h))


def build_face(base, b, plate, light, colprof, vis_frac):
    w, h = plane_size(b["face"])
    src = Image.open(ROOT / b["src"])
    if getattr(src, "n_frames", 1) > 1:
        src.seek(b.get("frame", 0))
    src = src.convert("RGB")
    if b.get("pre"):
        src = src.crop(b["pre"])
    for bo in b.get("blackout", []):  # paint over stray marks with the image's own ground colour
        x0, y0, x1, y1 = bo[:4]
        ImageDraw.Draw(src).rectangle((x0, y0, x1, y1), fill=bo[4] if len(bo) > 4 else "#000000")
    if b.get("box"):
        # Crop box in source pixels; may run past the image where the ground is black (PIL fills 0).
        src = src.crop(tuple(b["box"]))
    # For a partly occluded cabinet, frame the art on the visible part of the aperture.
    art = cover_crop(src, w, h, b["crop"])
    art = ImageEnhance.Color(art).enhance(0.86)
    art = ImageEnhance.Contrast(art).enhance(0.88)
    a = np.asarray(art, np.float32) / 255.0
    # Printed inks under a warm sodium/tungsten lamp: cyan/blue grounds go dull and greyer, they do
    # not glow. Hue-selective desaturation (all boards, stronger where a board sets grade.cyan).
    g = b.get("grade", {})
    hsv = np.asarray(Image.fromarray(np.uint8(a * 255 + 0.5)).convert("HSV"), np.float32)
    hue = hsv[..., 0] * (360.0 / 255.0)
    band = np.clip(1 - np.abs(hue - 195.0) / 50.0, 0, 1)  # cyan-blue centred at 195 deg
    lum = a.mean(axis=2, keepdims=True)
    keep = 1 - band[..., None] * (1 - g.get("cyan", 0.70))
    if g.get("green") is not None:  # tame a neon-green accent that would glow at night
        gband = np.clip(1 - np.abs(hue - 115.0) / 40.0, 0, 1)
        keep = keep * (1 - gband[..., None] * (1 - g["green"]))
    if g.get("red"):  # keep a hero red alive after the night grade (dist. to 0/360 deg)
        rband = np.clip(1 - np.minimum(hue, 360 - hue) / 28.0, 0, 1)
        keep = keep * (1 + rband[..., None] * (g["red"] - 1))
    a = lum + (a - lum) * keep
    a = np.power(a, 1.08)  # print on a lit face, not an emissive screen

    yy, xx = np.mgrid[0:h, 0:w]
    xn, yn = xx / max(w - 1, 1), yy / max(h - 1, 1)
    hx = resample(colprof, w)[None, :]
    fo = b.get("grade", {}).get("falloff", 1.0)  # >1 = steeper top-down lamp falloff
    vert = 1.10 - 0.26 * fo * yn
    hot = 0.60 * fo * np.exp(-(((xn - 0.5) / 0.30) ** 2) - ((yn + 0.04) / 0.34) ** 2)
    edge = np.minimum.reduce([xn * w, (1 - xn) * w, yn * h, (1 - yn) * h])
    bezel = 0.70 + 0.30 * np.clip(edge / max(4.0, 0.045 * min(w, h) * 1.6), 0, 1)
    illum = (vert + hot) * hx * bezel  # peak ~1.5 under the lamp, ~0.8 low corners
    out = a * illum[..., None] * light[None, None, :]
    # Soft-knee highlight compression relative to the lamp's white level: paper can't out-shine
    # the cream plate under the same lamp.
    wl = float(light.mean())
    knee = g.get("knee", 0.62) * wl
    over = np.clip(out - knee, 0, None)
    out = np.minimum(out, knee) + over / (1 + over / max(0.35 * wl, 1e-4))
    # Neighbour harmonisation: pull each face part-way toward the plate's shared mean exposure,
    # so a bright-ground campaign (cyan, white paper) does not read as a lit screen next to a dark one.
    _RAW_MEANS.append(float(out.mean()))
    if plate.get("mean_target"):
        m = float(out.mean())
        out *= (plate["mean_target"] / max(m, 1e-4)) ** plate.get("pull", 0.35)
    out *= g.get("exposure", 1.0)

    tex, _ = glass_texture(base, b["face"], w, h)
    # Atmospheric haze between cabinet and camera: part sky colour, part the lamp's own scatter,
    # so no face keeps a deeper black than the night around it (council v2: blacks too rich).
    veil = sky_rgb(base, b["face"], h) * plate["veil"] + light * plate.get("veil_light", 0.0)
    out = out + veil[None, None, :] + tex[..., None] * plate["glass"]
    face = finish(out, w, h, plate, b["seed"])
    if g.get("soft"):
        face = face.filter(ImageFilter.GaussianBlur(g["soft"]))
    return face


# ---------------------------------------------------------------- strip (step 4)
_type_cache = {}


def type_mask(key):
    if key not in _type_cache:
        m = Image.open(TYPE_DIR / f"{key}.png").convert("L")
        meta = json.loads((TYPE_DIR / f"{key}.json").read_text(encoding="utf-8"))
        _type_cache[key] = (m, meta)
    return _type_cache[key]


def build_strip(base, b, plate, light, occ, vis_frac):
    w, h = plane_size(b["strip"])
    ref = rectify(base, b["strip"], w, h)
    r = np.asarray(ref, np.float32)
    # Rebuild the cream from robust row tones (keeps the photographed top-lip / bottom-rust gradient,
    # rejects glyph-shaped marks) and a smoothed column falloff.
    vis = r[:, : max(8, int(w * vis_frac))]
    row = np.median(vis, axis=1) * 0.72 + np.quantile(vis, 0.35, axis=1) * 0.28
    bg = np.repeat(row[:, None, :], w, axis=1)
    col = np.median(vis.mean(axis=2), axis=0)
    col = resample(col, w) if vis.shape[1] != w else col
    k = max(9, w // 14) | 1
    col = np.convolve(np.pad(col, k // 2, mode="edge"), np.ones(k) / k, mode="valid")
    col /= max(float(np.median(col)), 1e-4)
    bg *= np.clip(col, 0.86, 1.12)[None, :, None]
    bg /= 255.0

    # Procedural grime so the rebuilt plate stays a dirty, weathered physical object.
    rng = np.random.default_rng(b["seed"] + 100)
    grime = np.ones((h, w), np.float32)
    for _ in range(max(4, w // 22)):  # thin run-off drips from the top lip
        x = rng.integers(0, w)
        ln = rng.integers(h // 5, int(h * 0.8))
        s = rng.uniform(0.06, 0.16)
        grime[:ln, x] *= 1 - s * np.linspace(1, 0.2, ln)
    blot = rng.normal(0, 1, (h, w)).astype(np.float32)
    blot = cv2.GaussianBlur(blot, (0, 0), 3.0)
    blot /= max(float(blot.std()), 1e-4)
    grime *= 1 + 0.035 * blot
    bg *= grime[..., None]

    # Print the case identity (supersampled), left aligned in the visible part of the plate.
    S = 8
    big = Image.fromarray(np.uint8(np.clip(bg, 0, 1) * 255), "RGB").resize(
        (w * S, h * S), Image.Resampling.BICUBIC
    )
    ink = Image.new("L", big.size, 0)
    t = dict(plate["type"], **{k: v for k, v in b.get("type", {}).items() if k in ("top", "cap1", "gap", "cap2", "pad", "ink")})
    usable = w * vis_frac - 2 * t["pad"] * w
    lines = [("l1", b["client"], t["cap1"]), ("l2", b["title"], t["cap2"])]
    caps = [t["cap1"] * h, t["cap2"] * h]
    widths = []
    for (kind, _, _), cap in zip(lines, caps):
        m, meta = type_mask(f"{b['id']}-{kind}")
        widths.append(m.width * cap / meta["cap"])
    y = t["top"] * h
    for i, ((kind, _, _), cap) in enumerate(zip(lines, caps)):
        slot = cap
        cap *= min(1.0, usable / widths[i])  # each line shrinks only as far as it must to fit
        m, meta = type_mask(f"{b['id']}-{kind}")
        sc = cap * S / meta["cap"]
        mm = m.resize(
            (max(1, round(m.width * sc)), max(1, round(m.height * sc))),
            Image.Resampling.LANCZOS,
        )
        ox = round(t["pad"] * w * S)
        oy = round(y * S - meta["cap_top"] * sc)
        ink.paste(mm, (ox, oy), mm)
        y += slot + t["gap"] * h
    inkf = np.asarray(ink, np.float32) / 255.0
    bigf = np.asarray(big, np.float32) / 255.0
    printed = (
        bigf * (1 - t.get("ink", 0.80) * inkf[..., None])
        + np.array([0.06, 0.05, 0.03]) * t.get("ink", 0.80) * inkf[..., None] * 0.5
    )
    lab = Image.fromarray(np.uint8(np.clip(printed, 0, 1) * 255), "RGB").resize(
        (w, h), Image.Resampling.LANCZOS
    )
    la = np.asarray(lab, np.float32) / 255.0

    # Fold back a restrained amount of the photographed strip micro-texture (not its glyph-scale marks).
    g = np.asarray(ref.convert("L"), np.float32) / 255.0
    gb = (
        np.asarray(ref.convert("L").filter(ImageFilter.GaussianBlur(1.1)), np.float32)
        / 255.0
    )
    la += np.clip(g - gb, -0.02, 0.02)[..., None] * 0.30
    la = np.clip(la, 0, 1)
    img = Image.fromarray(np.uint8(la * 255 + 0.5), "RGB").filter(
        ImageFilter.GaussianBlur(0.30)
    )
    return img


# ---------------------------------------------------------------- plate repairs
def mirror_frame(scene, x_from, x_to, y0, y1, center, feather=3):
    a = np.asarray(scene, np.float32).copy()
    out = a.copy()
    for x in range(x_from, x_to):
        sx = int(round(2 * center - x))
        wgt = 1.0 if x - x_from >= feather else (x - x_from + 1) / (feather + 1)
        out[y0:y1, x] = a[y0:y1, sx] * wgt + a[y0:y1, x] * (1 - wgt)
    return Image.fromarray(np.uint8(np.clip(out, 0, 255)), "RGB")


def inpaint(scene, x0, y0, x1, y1, radius=5):
    arr = cv2.cvtColor(np.asarray(scene), cv2.COLOR_RGB2BGR)
    m = np.zeros(arr.shape[:2], np.uint8)
    m[y0:y1, x0:x1] = 255
    res = cv2.inpaint(arr, m, radius, cv2.INPAINT_TELEA)
    # Inpaint is flat; restore the plate's grain in the filled area.
    rng = np.random.default_rng(x0 * 7 + y0)
    res = res.astype(np.float32)
    res[y0:y1, x0:x1] += rng.normal(0, 1.1, (y1 - y0, x1 - x0, 1))
    return Image.fromarray(
        cv2.cvtColor(np.uint8(np.clip(res, 0, 255)), cv2.COLOR_BGR2RGB)
    )


def repair_work(scene):
    # Board 04: rebuild the overpainted left frame from the photographed right frame.
    scene = mirror_frame(scene, 1108, 1129, 306, 466, 1248.5)
    # Board 05: old bake overflowed the cabinet; night background, then frame.
    scene = inpaint(scene, 1384, 303, 1405, 464)
    scene = mirror_frame(scene, 1402, 1416, 300, 468, 1545.25, feather=2)
    return scene


def remove_motel_signs(scene):
    """Public site law: no 'Last Stop' anywhere. Paint the '..ST OP' neon box and the vertical MOTEL
    neon out of the far-right pane with the surrounding night. The sign pole, window frame, pendant
    lamp and street reflections stay photographed; only a faint unreadable red spill can remain."""
    # Fill from the plain night pane just right of the signs (row-matched, so the vertical light
    # falloff of the pane survives), not from a boundary inpaint that would smear the SCOOBA frame.
    a0 = np.asarray(scene, np.float32)
    src_cols = a0[:, 1384:1398]
    row_tone = np.median(src_cols, axis=1)
    row_tone = cv2.GaussianBlur(row_tone[:, None, :], (1, 9), 0)[:, 0, :]
    m = np.zeros(a0.shape[:2], np.float32)
    m[114:188, 1307:1349] = 1.0   # ..ST OP box (glyphs + halo)
    m[168:264, 1347:1381] = 1.0   # vertical MOTEL + halo
    m = cv2.GaussianBlur(m, (0, 0), 1.6)
    rng = np.random.default_rng(1377)
    fill = np.repeat(row_tone[:, None, :], a0.shape[1], axis=1) + rng.normal(0, 1.0, a0.shape[:2])[..., None]
    scene = Image.fromarray(np.uint8(np.clip(a0 * (1 - m[..., None]) + fill * m[..., None], 0, 255)), "RGB")
    # Knock the leftover neon halo down so it cannot read as a sign.
    a = np.asarray(scene, np.float32).copy()
    y0, y1, x0, x1 = 100, 275, 1292, 1392
    reg = a[y0:y1, x0:x1]
    red = np.clip(reg[..., 0] - reg[..., 1:].mean(axis=2) - 6, 0, None)
    reg[..., 0] -= red * 0.8
    a[y0:y1, x0:x1] = reg
    return Image.fromarray(np.uint8(np.clip(a, 0, 255)), "RGB")


def reclone_scooba_cabinet(scene):
    """Re-seat the fifth cabinet with the recipe of build-work-visual-lock-20260909.py, minus its
    mis-registered face/band, so the new face lands on real (cloned) cabinet geometry."""
    original = Image.open(MORE_CLONE_SRC).convert("RGB")
    cab = original.crop((866, 40, 1105, 327)).convert("RGBA")
    nw, nh = int(cab.width * 0.88), int(cab.height * 0.88)
    cab = cab.resize((nw, nh), Image.Resampling.LANCZOS)
    alpha = Image.new("L", (nw, nh), 255)
    ad = ImageDraw.Draw(alpha)
    for i in range(14):
        ad.rectangle(
            (i, i, nw - 1 - i, nh - 1 - i), outline=int(255 * (i + 1) / 14), width=1
        )
    alpha = alpha.filter(ImageFilter.GaussianBlur(3))
    cab.putalpha(alpha)
    out = scene.convert("RGBA")
    out.alpha_composite(cab, (1115, 48))
    o = original.convert("RGBA")
    out.alpha_composite(o.crop((1097, 0, 1132, o.height)), (1097, 0))
    out.alpha_composite(o.crop((1075, 302, 1170, o.height)), (1075, 302))
    return out.convert("RGB")


# ---------------------------------------------------------------- plate build
def build_plate(name, base_path, out_path, faces_dir=None):
    base = Image.open(base_path).convert("RGB")
    plate = PLATE[name]
    scene = base
    if name == "work":
        if base.size != (1792, 1008):
            raise SystemExit(f"unexpected WORK plate size {base.size}")
        scene = repair_work(scene)
    else:
        if base.size != (1440, 447):
            raise SystemExit(f"unexpected MORE WORK plate size {base.size}")
        scene = reclone_scooba_cabinet(scene)
        scene = remove_motel_signs(scene)
    light_ref = scene  # measure light after repairs (strips are untouched by them)
    record = {}
    # First pass: raw mean exposure of every face under its own lamp -> shared plate target.
    means = []
    for b in BOARDS[name]:
        light, colprof, vis = strip_light(light_ref, b["strip"], b.get("strip_occ", []))
        tmp = dict(plate, mean_target=None)
        _RAW_MEANS.clear()
        build_face(light_ref, b, tmp, light, colprof, 1.0)
        means.append(_RAW_MEANS[0])
    plate = dict(plate, mean_target=float(np.median(means)))
    for b in BOARDS[name]:
        occ_s = b.get("strip_occ", [])
        light, colprof, vis = strip_light(light_ref, b["strip"], occ_s)
        face_vis = 1.0
        for x0, *_ in b.get("face_occ", []):
            face_vis = (x0 - b["face"][0][0]) / (b["face"][1][0] - b["face"][0][0])
        face = build_face(light_ref, b, plate, light, colprof, face_vis)
        strip = build_strip(light_ref, b, plate, light, occ_s, vis)
        scene = composite(scene, face, b["face"], b.get("face_occ", []))
        scene = composite(scene, strip, b["strip"], occ_s, feather=0.4)
        record[b["id"]] = dict(
            face=b["face"],
            strip=b["strip"],
            src=b["src"],
            crop=b["crop"],
            light=[round(float(v), 4) for v in light],
        )
        if faces_dir:
            fw, fh = face.size
            sw, sh = strip.size
            prev = Image.new("RGB", (max(fw, sw) * 4, (fh + sh) * 4), (0, 0, 0))
            prev.paste(face.resize((fw * 4, fh * 4), Image.Resampling.NEAREST), (0, 0))
            prev.paste(
                strip.resize((sw * 4, sh * 4), Image.Resampling.NEAREST), (0, fh * 4)
            )
            prev.save(Path(faces_dir) / f"surface-{b['id']}.png")
    scene.save(out_path, "WEBP", quality=90, method=6)
    return record


# ---------------------------------------------------------------- type + svg rasterisation (network, run once)
def render_type():
    from playwright.sync_api import sync_playwright

    TYPE_DIR.mkdir(parents=True, exist_ok=True)
    SRC_DIR.mkdir(parents=True, exist_ok=True)
    html = (
        "<html><head><link rel='stylesheet' href='https://fonts.googleapis.com/css2?"
        "family=Barlow+Condensed:wght@500;600;700&display=block'></head>"
        "<body style='margin:0;background:#000'><span id=t style='font-family:\"Barlow Condensed\";"
        "color:#fff;font-size:240px;line-height:1.5;white-space:pre;padding:0 40px;display:inline-block'>H</span>"
        "</body></html>"
    )
    with sync_playwright() as p:
        br = p.chromium.launch()
        pg = br.new_page(viewport={"width": 6000, "height": 600}, device_scale_factor=1)
        pg.set_content(html)
        pg.wait_for_function("document.fonts.ready.then(()=>true)")
        for wt in (500, 600, 700):
            pg.evaluate(f"document.fonts.load('{wt} 240px \"Barlow Condensed\"')")
            ok = pg.evaluate(f"document.fonts.check('{wt} 240px \"Barlow Condensed\"')")
            if not ok:
                raise SystemExit(f"Barlow Condensed {wt} did not load")

        def shot(text, wt, track=0.0):
            pg.evaluate(
                "([t,w,k])=>{const e=document.getElementById('t');e.textContent=t;e.style.fontWeight=w;"
                "e.style.letterSpacing=k+'em'}",
                [text, wt, track],
            )
            pg.wait_for_timeout(50)
            png = pg.locator("#t").screenshot()
            import io

            return Image.open(io.BytesIO(png)).convert("L")

        def cap_metrics(wt):
            m = np.asarray(shot("H", wt)) > 128
            rows = np.where(m.any(axis=1))[0]
            return int(rows[0]), int(rows[-1] - rows[0] + 1)

        caps = {wt: cap_metrics(wt) for wt in (500, 600, 700)}
        for plate in BOARDS.values():
            for b in plate:
                to = b.get("type", {})
                for kind, text, wt, track in (
                    ("l1", b["client"], to.get("w1", 700), to.get("track1", 0.0)),
                    ("l2", b["title"], to.get("w2", 500), to.get("track2", 0.0)),
                ):
                    img = shot(text, wt, track)
                    a = np.asarray(img)
                    cols = np.where((a > 20).any(axis=0))[0]
                    img = img.crop((max(0, cols[0] - 2), 0, cols[-1] + 3, img.height))
                    img.save(TYPE_DIR / f"{b['id']}-{kind}.png")
                    cap_top, cap = caps[wt]
                    (TYPE_DIR / f"{b['id']}-{kind}.json").write_text(
                        json.dumps(
                            {
                                "text": text,
                                "font": "Barlow Condensed",
                                "weight": wt,
                                "letter_spacing_em": track,
                                "cap": cap,
                                "cap_top": cap_top,
                                "license": "SIL OFL 1.1",
                            },
                            ensure_ascii=False,
                        ),
                        encoding="utf-8",
                    )
        # SCOOBA hero is an SVG; rasterise it once at its native 1600x900.
        pg2 = br.new_page(viewport={"width": 1600, "height": 900})
        pg2.goto((ASSETS / "cases" / "scooba-hero.svg").as_uri())
        pg2.wait_for_timeout(300)
        pg2.screenshot(path=str(SRC_DIR / "scooba-hero.png"))
        br.close()
    print(f"type masks + scooba raster written to {TYPE_DIR} / {SRC_DIR}")


# Content travels between cabinets; geometry (face, strip, occluders) stays with the cabinet.
CONTENT_KEYS = ("id", "client", "title", "src", "crop", "pre", "grade", "type", "alt")
# Crops re-framed for the other cabinet's aspect when content moves.
SWAP_CROPS = {"atlantic": (0.50, 0.52, 1.30), "selsun": (0.50, 0.50, 1.0)}


# Swap build only: on the Work plate The Atlantic uses the hummingbird + red hibiscus key visual
# (zacharyconnolly.com the-atlantic/01.jpg). The sunglasses hero graded to a grey blank at Work scale.
# Cropped to the bird and flowers; the wordmark, tagline and subscribe box fall outside the crop.
SWAP_FACES = {
    "atlantic": dict(
        src="scripts/billboard-src/atlantic-swap-face.jpg",
        crop=(0.547, 0.495, 1.34),
        grade=dict(knee=0.58, red=1.35),
    )
}


def apply_face_picks(path=FACES_JSON):
    """Default build: faces come from docs/design/billboard-faces-v2.json (shared with the case pages)."""
    picks = {f["id"]: f for f in json.loads(Path(path).read_text(encoding="utf-8"))["faces"]}
    for b in (x for pl in BOARDS.values() for x in pl):
        f = picks.get(b["id"])
        if not f:
            continue
        b["src"] = f["build_source"]
        b["box"] = f["crop_box"]
        b["crop"] = (0.5, 0.5, 1.0)
        b.pop("pre", None)
        for k in ("frame", "blackout"):
            if k in f:
                b[k] = f[k]
        if "grade" in f:
            b["grade"] = f["grade"]


def swap_boards(id_a, id_b):
    a = next(b for pl in BOARDS.values() for b in pl if b["id"] == id_a)
    b = next(x for pl in BOARDS.values() for x in pl if x["id"] == id_b)
    ca = {k: a.pop(k) for k in CONTENT_KEYS if k in a}
    cb = {k: b.pop(k) for k in CONTENT_KEYS if k in b}
    a.update(cb)
    b.update(ca)
    for x in (a, b):
        x["crop"] = SWAP_CROPS.get(x["id"], x["crop"])
        x.update(SWAP_FACES.get(x["id"], {}))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--render-type", action="store_true")
    ap.add_argument("--faces", type=Path)
    ap.add_argument("--only", choices=["work", "more"])
    ap.add_argument("--virgin-alt", action="store_true", help="use board 02's alt face")
    ap.add_argument("--work-out", type=Path, default=WORK_OUT)
    ap.add_argument("--more-out", type=Path, default=MORE_OUT)
    ap.add_argument(
        "--order",
        choices=["atlantic-first", "legacy"],
        default="atlantic-first",
        help="atlantic-first (default since 2026-09-26, Ian): The Atlantic on Work board 04, Selsun Blue on "
        "More Work board 09, faces from billboard-faces-v2.json. legacy: the v3/v2 order and faces.",
    )
    ap.add_argument("--face", action="append", default=[],
                    help="candidate override id=path|x0,y0,x1,y1 (testing only)")
    args = ap.parse_args()
    if args.render_type:
        render_type()
        return
    if args.faces:
        args.faces.mkdir(parents=True, exist_ok=True)
    if args.virgin_alt:
        for b in BOARDS["work"]:
            if b.get("alt"):
                b.update(b["alt"])
    if args.order == "atlantic-first":
        swap_boards("selsun", "atlantic")
        apply_face_picks()
    else:
        if args.work_out == WORK_OUT:
            args.work_out = ASSETS / "work-panorama-physical-v3.webp"
        if args.more_out == MORE_OUT:
            args.more_out = ASSETS / "more-work-panorama-physical-v2.webp"
    for spec in args.face:
        fid, rest = spec.split("=", 1)
        path, box = rest.split("|")
        b = next(x for pl in BOARDS.values() for x in pl if x["id"] == fid)
        b.update(src=path, box=[int(v) for v in box.split(",")], crop=(0.5, 0.5, 1.0))
        b.pop("pre", None)
        b.pop("blackout", None)
    rec = {}
    if args.only in (None, "work"):
        rec["work"] = build_plate("work", WORK_BASE, args.work_out, args.faces)
        print(f"wrote {args.work_out}")
    if args.only in (None, "more"):
        rec["more"] = build_plate("more", MORE_BASE, args.more_out, args.faces)
        print(f"wrote {args.more_out}")
    if args.faces:
        (args.faces / "build-record.json").write_text(
            json.dumps(rec, indent=1, ensure_ascii=False)
        , encoding="utf-8")


if __name__ == "__main__":
    main()
