"""Build the two depth planes for the billboard push-in (review only).

near mask  = everything on OUR side of the glass (frame posts, mullions, sill, booth, table, mug, lamp),
             white = near. Soft-edged so the split never shows as a cut line.
far plate  = the plate with the near regions inpainted, so when the foreground slides past the lens
             the room behind it is not a hole.

Geometry is in plate percentages, read off gridded plates (docs: detail_pass_v2 round 2).
Run from the repo root:  python review/details/build_depth.py
"""

from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "review" / "details" / "depth"

# far = the glass (what is outside). Polygons in % of the plate.
PLATES = {
    "work": {
        "src": "assets/work-panorama-physical-v4.webp",
        "far": [
            [(6.6, 3.5), (38.3, 3.0), (38.3, 72.0), (6.6, 67.5)],
            [(42.4, 3.0), (97.0, 3.0), (97.0, 81.0), (42.4, 74.5)],
        ],
    },
    "more": {
        "src": "assets/more-work-panorama-physical-v3.webp",
        "far": [
            [(5.6, 3.0), (76.4, 3.0), (76.4, 74.0), (5.6, 74.0)],
            [
                (77.6, 3.0),
                (91.5, 3.0),
                (91.5, 14.0),
                (100.0, 14.0),
                (100.0, 74.0),
                (77.6, 74.0),
            ],
        ],
    },
}


def build(name, spec):
    im = Image.open(ROOT / spec["src"]).convert("RGB")
    w, h = im.size
    far = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(far)
    for poly in spec["far"]:
        d.polygon([(x * w / 100, y * h / 100) for x, y in poly], fill=255)
    near = Image.eval(far, lambda v: 255 - v)

    # the mask the browser uses: soft edge, small file (the plate itself supplies the pixels)
    soft = near.filter(ImageFilter.GaussianBlur(3))
    # CSS masks read ALPHA by default (mask-mode: match-source): white pixels with the mask in the alpha
    # channel. A greyscale PNG has no alpha, so it would mask nothing.
    a_ch = soft.resize((w // 2, h // 2), Image.LANCZOS)
    rgba = Image.new("RGBA", a_ch.size, (255, 255, 255, 0))
    rgba.putalpha(a_ch)
    rgba.save(OUT / f"{name}-near-mask.png", optimize=True)

    # the far plate: fill the near regions from the glass around them
    hole = np.array(near.filter(ImageFilter.MaxFilter(9)))
    bgr = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)
    small = cv2.resize(bgr, (w // 2, h // 2), interpolation=cv2.INTER_AREA)
    small_hole = cv2.resize(hole, (w // 2, h // 2), interpolation=cv2.INTER_NEAREST)
    filled = cv2.inpaint(small, small_hole, 9, cv2.INPAINT_TELEA)
    filled = cv2.resize(filled, (w, h), interpolation=cv2.INTER_CUBIC)
    filled = cv2.GaussianBlur(
        filled, (0, 0), 6
    )  # it is only ever seen out of focus, behind moving glass edges
    # below the glass (sill, booth, table) the camera would look past the booth into shadow, not into more
    # glass: darken the fill there so the uncovered area reads as depth, not as a bright smear
    glass_rows = np.where(np.array(far).max(axis=1) > 0)[0]
    shade = np.ones((h, w), np.float32)
    for x in range(0, w, 8):
        col = np.where(np.array(far)[:, x] > 0)[0]
        bottom = col.max() if len(col) else glass_rows.max()
        shade[bottom:, x:x + 8] = 0.28
    shade = cv2.GaussianBlur(shade, (0, 0), 24)
    filled = (filled.astype(np.float32) * shade[..., None]).clip(0, 255).astype(np.uint8)
    keep = (np.array(far) > 0)[..., None]
    out = np.where(keep, bgr, filled)
    Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB)).save(
        OUT / f"{name}-far.webp", quality=80, method=6
    )
    print(
        name,
        (OUT / f"{name}-far.webp").stat().st_size // 1024,
        "KB far;",
        (OUT / f"{name}-near-mask.png").stat().st_size // 1024,
        "KB mask",
    )


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for n, s in PLATES.items():
        build(n, s)
