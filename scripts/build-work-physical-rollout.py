from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
import argparse
import json
import numpy as np
import random


# Source-pixel measurements in the locked 1792 x 1008 WORK plate.
# Porsche b3 is intentionally omitted: the approved Phase A candidate already lives
# in work-panorama-physical-v1.webp and must not be regenerated during rollout QA.
BOARDS = {
    "nike": {
        "quad": [[158.0, 301.0], [452.0, 301.0], [452.0, 459.0], [158.0, 459.0]],
        "seed": 51,
    },
    "virgin": {
        "quad": [[501.0, 309.0], [763.0, 309.0], [763.0, 463.0], [501.0, 463.0]],
        "seed": 61,
        # The right side of this cabinet sits behind the photographed diner window mullion.
        # Do not paint over it; the art remains mapped to the full board but is visible only
        # where the photographed face is actually visible.
        "occluders": [[684, 255, 780, 520]],
    },
    "selsun": {
        "quad": [[1118.0, 319.0], [1355.0, 319.0], [1355.0, 460.0], [1118.0, 460.0]],
        "seed": 81,
    },
    "moneylion": {
        "quad": [[1395.0, 317.0], [1674.0, 317.0], [1674.0, 465.0], [1395.0, 465.0]],
        "seed": 91,
    },
}


def perspective_coefficients(destination, source):
    rows = []
    values = []
    for (x, y), (u, v) in zip(destination, source):
        rows.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        values.append(u)
        rows.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        values.append(v)
    return tuple(
        np.linalg.solve(
            np.asarray(rows, dtype=np.float64), np.asarray(values, dtype=np.float64)
        )
    )


def cover_crop(source, width, height):
    scale = max(width / source.width, height / source.height)
    resized = source.resize(
        (round(source.width * scale), round(source.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = max(0, (resized.width - width) // 2)
    top = max(0, (resized.height - height) // 2)
    return resized.crop((left, top, left + width, top + height))


def physicalize(base, source_art, spec):
    quad = np.asarray(spec["quad"], dtype=np.float64)
    plane_w = round(
        max(np.linalg.norm(quad[1] - quad[0]), np.linalg.norm(quad[2] - quad[3]))
    )
    plane_h = round(
        max(np.linalg.norm(quad[3] - quad[0]), np.linalg.norm(quad[2] - quad[1]))
    )
    plane_corners = np.asarray(
        [[0.0, 0.0], [plane_w - 1.0, 0.0], [plane_w - 1.0, plane_h - 1.0], [0.0, plane_h - 1.0]],
        dtype=np.float64,
    )

    # Rectify the photographed face so broad cabinet illumination is inherited from
    # the source plate instead of invented as a generic overlay.
    face_reference = base.transform(
        (plane_w, plane_h),
        Image.Transform.PERSPECTIVE,
        perspective_coefficients(plane_corners, quad),
        Image.Resampling.BICUBIC,
    )
    reference_gray = np.asarray(face_reference.convert("L"), dtype=np.float32) / 255.0

    art = cover_crop(source_art.convert("RGB"), plane_w, plane_h)
    # Keep this intentionally close to the proven Porsche treatment. This is optical
    # integration, not a Last Stop grade applied to client work.
    art = ImageEnhance.Color(art).enhance(0.91)
    art = ImageEnhance.Contrast(art).enhance(0.91)
    arr = np.asarray(art, dtype=np.float32) / 255.0
    arr = np.power(np.clip(arr, 0, 1), 1.055)

    row_profile = np.quantile(reference_gray, 0.32, axis=1)
    col_profile = np.quantile(reference_gray, 0.32, axis=0)
    row_kernel = np.ones(max(5, min(17, plane_h // 5)))
    row_kernel /= row_kernel.sum()
    col_kernel = np.ones(max(7, min(25, plane_w // 6)))
    col_kernel /= col_kernel.sum()
    row_profile = np.convolve(row_profile, row_kernel, mode="same")
    col_profile = np.convolve(col_profile, col_kernel, mode="same")
    row_slice = row_profile[max(1, len(row_profile)//12):max(2, len(row_profile)-len(row_profile)//12)]
    col_slice = col_profile[max(1, len(col_profile)//12):max(2, len(col_profile)-len(col_profile)//12)]
    row_profile /= max(float(np.median(row_slice)), 1e-4)
    col_profile /= max(float(np.median(col_slice)), 1e-4)
    illumination = np.clip(
        0.62 * row_profile[:, None] + 0.38 * col_profile[None, :], 0.74, 1.15
    )

    yy, xx = np.mgrid[0:plane_h, 0:plane_w]
    xn = xx / max(plane_w - 1, 1)
    yn = yy / max(plane_h - 1, 1)
    edge = np.minimum.reduce([xn, 1 - xn, yn, 1 - yn])
    behind_bezel = 0.72 + 0.28 * np.clip(edge / 0.085, 0, 1)
    arr *= (illumination * behind_bezel)[..., None]

    current_mid = float(np.quantile(arr.mean(axis=2), 0.50))
    target_mid = float(np.quantile(reference_gray, 0.50)) * 1.03
    arr *= np.clip(target_mid / max(current_mid, 1e-4), 0.32, 0.86)

    # Reuse only small-scale face texture. Large old-image edges are rejected so the
    # previous baked campaign cannot ghost through the new campaign.
    reference_blur = np.asarray(
        face_reference.convert("L").filter(ImageFilter.GaussianBlur(2.2)),
        dtype=np.float32,
    ) / 255.0
    micro = np.clip(reference_gray - reference_blur, -0.012, 0.012)
    arr += micro[..., None] * 0.52

    rng = np.random.default_rng(spec["seed"])
    low_noise = rng.normal(0, 1, (plane_h, plane_w)).astype(np.float32)
    low_noise = np.asarray(
        Image.fromarray(
            np.uint8(np.clip(low_noise * 30 + 128, 0, 255)), mode="L"
        ).filter(ImageFilter.GaussianBlur(5.5)),
        dtype=np.float32,
    )
    low_noise -= 128.0
    low_noise /= max(float(low_noise.std()), 1e-4)
    fine_noise = rng.normal(0, 0.0042, (plane_h, plane_w)).astype(np.float32)
    arr *= (1 + low_noise * 0.012 + fine_noise)[..., None]

    reflection_axis = (xn * 0.82 + yn * 0.36 - 0.63) / 0.12
    reflection = np.exp(-(reflection_axis**2)) * 0.009
    reflection_color = np.asarray([0.64, 0.67, 0.61], dtype=np.float32)
    arr = arr * (1 - reflection[..., None]) + reflection_color * reflection[..., None]
    arr = np.clip(arr, 0, 1)

    surface = Image.fromarray(np.uint8(arr * 255), mode="RGB").filter(
        ImageFilter.GaussianBlur(0.72)
    )
    dust = Image.new("RGBA", (plane_w, plane_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(dust)
    rr = random.Random(spec["seed"] + 101)
    count = max(50, round((plane_w * plane_h) / 480))
    for _ in range(count):
        x = rr.randrange(plane_w)
        y = rr.randrange(plane_h)
        alpha = rr.randrange(2, 8)
        color = (220, 210, 185, alpha) if rr.random() < 0.42 else (8, 8, 7, alpha)
        draw.point((x, y), fill=color)
    surface = Image.alpha_composite(surface.convert("RGBA"), dust)

    warped = surface.transform(
        base.size,
        Image.Transform.PERSPECTIVE,
        perspective_coefficients(quad, plane_corners),
        Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )
    mask = Image.new("L", base.size, 0)
    md = ImageDraw.Draw(mask)
    md.polygon([tuple(point) for point in quad], fill=255)
    for x1, y1, x2, y2 in spec.get("occluders", []):
        md.rectangle((x1, y1, x2, y2), fill=0)
    mask = mask.filter(ImageFilter.GaussianBlur(0.55))
    return Image.composite(warped.convert("RGB"), base, mask)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("base", type=Path)
    parser.add_argument("art_dir", type=Path)
    parser.add_argument("out", type=Path)
    parser.add_argument("--manifest", type=Path)
    args = parser.parse_args()

    base = Image.open(args.base).convert("RGB")
    if base.size != (1792, 1008):
        raise SystemExit(f"Expected locked WORK plate 1792x1008, got {base.size}")

    result = base
    manifest = {"base": str(args.base), "size": list(base.size), "boards": {}}
    for name, spec in BOARDS.items():
        art_path = args.art_dir / f"{name}.jpg"
        if not art_path.exists():
            raise SystemExit(f"Missing source art: {art_path}")
        source = Image.open(art_path).convert("RGB")
        result = physicalize(result, source, spec)
        manifest["boards"][name] = {
            "quad": spec["quad"],
            "occluders": spec.get("occluders", []),
            "source": str(art_path),
            "source_size": list(source.size),
        }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    result.save(args.out, "WEBP", quality=84, method=6)
    if args.manifest:
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        args.manifest.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.out} at {result.size[0]}x{result.size[1]} with 4 new physical faces; Porsche preserved")


if __name__ == "__main__":
    main()
