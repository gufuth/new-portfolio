from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter, ImageChops

ROOT = Path(__file__).resolve().parents[1]
WORK_SRC = ROOT / 'assets' / 'work-panorama-physical-v1.webp'
MORE_SRC = ROOT / 'assets' / 'more-work-panorama-current.webp'
WORK_OUT = ROOT / 'assets' / 'work-panorama-physical-v2.webp'
MORE_OUT = ROOT / 'assets' / 'more-work-panorama-five-v1.webp'


def build_work_1():
    im = cv2.imread(str(WORK_SRC))
    if im is None:
        raise RuntimeError(f'Could not open {WORK_SRC}')
    h, w = im.shape[:2]
    if (w, h) != (1792, 1008):
        raise RuntimeError(f'Unexpected Work plate size {(w,h)}')

    # Latest explicit user law: no motel / Last Stop motel signage in Work 1.
    # Remove only the peripheral sign and upper support, preserving board 5.
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(mask, (1555, 105), (1730, 285), 255, -1)
    cv2.rectangle(mask, (1635, 250), (1668, 335), 255, -1)
    mask = cv2.GaussianBlur(mask, (11, 11), 0)
    out = cv2.inpaint(im, mask, 11, cv2.INPAINT_TELEA)
    cv2.imwrite(str(WORK_OUT), out, [cv2.IMWRITE_WEBP_QUALITY, 90])


def font_path(bold=False):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    ]
    for p in candidates:
        if Path(p).exists():
            return p
    raise RuntimeError('No usable system sans font found')


def build_more_work():
    base = Image.open(MORE_SRC).convert('RGB')
    W, H = base.size
    if (W, H) != (1440, 447):
        raise RuntimeError(f'Unexpected More Work plate size {(W,H)}')

    # Keep the motel exclusively in More Work, but demote it further.
    veil = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(veil)
    d.rectangle((1250, 80, 1439, 305), fill=(0, 0, 0, 38))
    veil = veil.filter(ImageFilter.GaussianBlur(10))
    base = Image.alpha_composite(base.convert('RGBA'), veil).convert('RGB')

    # Build fifth SCOOBA cabinet from photographed board-4 hardware so scale,
    # grime, falloff and material response come from the real Work-2 plate.
    template = base.crop((881, 58, 1094, 302)).convert('RGB')
    new_w, new_h = 202, 231
    template = template.resize((new_w, new_h), Image.Resampling.LANCZOS)

    fx0, fy0, fx1, fy1 = 10, 28, 192, 138
    bx0, by0, bx1, by1 = 10, 138, 192, 184

    face = Image.new('RGB', (fx1-fx0, fy1-fy0), '#081114')
    fd = ImageDraw.Draw(face)
    bold = font_path(True)
    regular = font_path(False)
    f_head = ImageFont.truetype(bold, 18)
    f_small = ImageFont.truetype(regular, 7)
    f_mid = ImageFont.truetype(bold, 8)
    fd.text((10, 13), 'SCOOBA LOVE', font=f_head, fill='#e3dac6')
    fd.text((10, 40), 'SHOW THE MATH', font=f_mid, fill='#789c9e')
    fd.text((10, 59), 'STRATEGY  ·  CLIENT GOAL', font=f_small, fill='#a79f8c')
    fd.text((10, 72), 'OWNABLE  ·  ONE SENTENCE', font=f_small, fill='#a79f8c')
    fd.text((10, 85), 'BUY  ·  ACHIEVABLE  ·  LOVE', font=f_small, fill='#a79f8c')

    photographed_face = template.crop((fx0, fy0, fx1, fy1)).convert('L')
    illumination = photographed_face.filter(ImageFilter.GaussianBlur(12))
    arr = np.asarray(illumination, dtype=np.float32) / 255.0
    arr = 0.70 + 0.50 * arr
    face_arr = np.asarray(face, dtype=np.float32)
    face_arr = np.clip(face_arr * arr[..., None], 0, 255)
    face = Image.fromarray(face_arr.astype('uint8'), 'RGB')
    low = photographed_face.filter(ImageFilter.GaussianBlur(2.2))
    hf = ImageChops.subtract(photographed_face, low, scale=1.0, offset=128)
    hf_rgb = Image.merge('RGB', (hf, hf, hf))
    face = Image.blend(face, hf_rgb, 0.12)
    face = ImageEnhance.Contrast(face).enhance(0.88).filter(ImageFilter.GaussianBlur(0.55))

    band = template.crop((bx0, by0, bx1, by1)).convert('RGB')
    band = Image.blend(band, Image.new('RGB', band.size, (183, 169, 133)), 0.62)
    bd = ImageDraw.Draw(band)
    bd.text((8, 9), 'SCOOBA LOVE', font=ImageFont.truetype(bold, 9), fill='#252019')
    bd.text((8, 23), 'Internal creative system', font=ImageFont.truetype(regular, 7), fill='#2e2921')
    band = band.filter(ImageFilter.GaussianBlur(0.30))

    cabinet = template.convert('RGBA')
    cabinet.alpha_composite(face.convert('RGBA'), (fx0, fy0))
    cabinet.alpha_composite(band.convert('RGBA'), (bx0, by0))
    cabinet = cabinet.filter(ImageFilter.GaussianBlur(0.22))

    # Crucial identity rule: SCOOBA lives in Work 2's separate right-hand pane.
    # We do not redistribute the four main boards or import Work-1 geometry.
    x, y = 1114, 63
    scene = base.convert('RGBA')
    shadow = Image.new('RGBA', scene.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rectangle((x+8, y+10, x+new_w+8, y+new_h+12), fill=(0, 0, 0, 55))
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    scene = Image.alpha_composite(scene, shadow)
    scene.alpha_composite(cabinet, (x, y))

    draw = ImageDraw.Draw(scene)
    for px in (x+49, x+145):
        draw.rectangle((px, y+183, px+5, 326), fill=(45, 39, 30, 205))

    # Reapply the real diner foreground over the exterior object so the window
    # mullion remains physically in front of the new board.
    original = Image.open(MORE_SRC).convert('RGBA')
    scene.alpha_composite(original.crop((1097, 0, 1133, H)), (1097, 0))
    scene.alpha_composite(original.crop((1080, 315, 1165, H)), (1080, 315))

    scene.convert('RGB').save(MORE_OUT, 'WEBP', quality=90, method=6)


if __name__ == '__main__':
    build_work_1()
    build_more_work()
    print(WORK_OUT)
    print(MORE_OUT)
