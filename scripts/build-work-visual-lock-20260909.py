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

    # Latest explicit user law: Work 1 contains no motel / Last Stop signage.
    # Remove only the peripheral sign and upper support. Do not change camera,
    # billboard geography, road, booth or plate scale.
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
    original_rgb = Image.open(MORE_SRC).convert('RGB')
    W, H = original_rgb.size
    if (W, H) != (1440, 447):
        raise RuntimeError(f'Unexpected More Work plate size {(W,H)}')

    # Work 2 identity law: preserve the Gemini camera, four-board grouping,
    # foreground architecture and separate right-hand pane. The motel belongs
    # here only and remains a dim, peripheral background fact.
    base = original_rgb.convert('RGBA')
    veil = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(veil)
    d.rectangle((1245, 75, 1439, 305), fill=(0, 0, 0, 28))
    veil = veil.filter(ImageFilter.GaussianBlur(12))
    base = Image.alpha_composite(base, veil)

    # Fifth SCOOBA destination: duplicate a real photographed Work-2 cabinet,
    # including its lamp, wear and posts, then replace only the face and ID band.
    # This keeps the new object in the physical vocabulary of the existing shot.
    src_box = (866, 40, 1105, 327)
    cabinet = original_rgb.crop(src_box).convert('RGBA')
    scale = 0.88
    nw = int(cabinet.width * scale)
    nh = int(cabinet.height * scale)
    cabinet = cabinet.resize((nw, nh), Image.Resampling.LANCZOS)

    # Coordinates below are scaled from the photographed fourth board surface.
    fx0, fy0 = int(25 * scale), int(53 * scale)
    fx1, fy1 = int(217 * scale), int(160 * scale)
    by0, by1 = fy1, int(214 * scale)

    bold = font_path(True)
    regular = font_path(False)
    face = Image.new('RGB', (fx1 - fx0, fy1 - fy0), '#091012')
    fd = ImageDraw.Draw(face)
    fd.text((int(10 * scale), int(14 * scale)), 'SCOOBA LOVE',
            font=ImageFont.truetype(bold, max(10, int(19 * scale))), fill='#d6ccb5')
    fd.text((int(10 * scale), int(42 * scale)), 'SHOW THE MATH',
            font=ImageFont.truetype(bold, max(6, int(7 * scale))), fill='#789495')
    small = ImageFont.truetype(regular, max(6, int(7 * scale)))
    fd.text((int(10 * scale), int(62 * scale)), 'STRATEGY / CLIENT GOAL', font=small, fill='#8d887c')
    fd.text((int(10 * scale), int(77 * scale)), 'OWNABLE / ONE SENTENCE', font=small, fill='#8d887c')
    fd.text((int(10 * scale), int(92 * scale)), 'BUY / ACHIEVABLE / LOVE', font=small, fill='#8d887c')

    photographed_face = cabinet.crop((fx0, fy0, fx1, fy1)).convert('L')
    illumination = photographed_face.filter(ImageFilter.GaussianBlur(11))
    illum = np.asarray(illumination, dtype=np.float32) / 255.0
    illum = 0.64 + 0.44 * illum
    arr = np.asarray(face, dtype=np.float32)
    arr = np.clip(arr * illum[..., None], 0, 255)
    face = Image.fromarray(arr.astype('uint8'), 'RGB')
    face = ImageEnhance.Brightness(face).enhance(0.78)
    face = ImageEnhance.Contrast(face).enhance(0.82)
    low = photographed_face.filter(ImageFilter.GaussianBlur(3.0))
    hf = ImageChops.subtract(photographed_face, low, scale=1.0, offset=128)
    hf_rgb = Image.merge('RGB', (hf, hf, hf))
    face = Image.blend(face, hf_rgb, 0.09).filter(ImageFilter.GaussianBlur(0.65))

    band = cabinet.crop((fx0, by0, fx1, by1)).convert('RGB')
    band = Image.blend(band, Image.new('RGB', band.size, (170, 157, 126)), 0.48)
    bd = ImageDraw.Draw(band)
    bd.text((int(8 * scale), int(8 * scale)), 'SCOOBA LOVE',
            font=ImageFont.truetype(bold, max(6, int(8 * scale))), fill='#2f2a22')
    bd.text((int(8 * scale), int(23 * scale)), 'INTERNAL CREATIVE SYSTEM',
            font=ImageFont.truetype(regular, max(5, int(6 * scale))), fill='#3a342b')
    band = band.filter(ImageFilter.GaussianBlur(0.45))

    cabinet.alpha_composite(face.convert('RGBA'), (fx0, fy0))
    cabinet.alpha_composite(band.convert('RGBA'), (fx0, by0))

    # Feather the copied photographic patch so its background disappears into
    # the existing black road/sky instead of reading as a pasted rectangle.
    alpha = Image.new('L', (nw, nh), 255)
    ad = ImageDraw.Draw(alpha)
    edge = 14
    for i in range(edge):
        val = int(255 * (i + 1) / edge)
        ad.rectangle((i, i, nw - 1 - i, nh - 1 - i), outline=val, width=1)
    alpha = alpha.filter(ImageFilter.GaussianBlur(3))
    cabinet.putalpha(ImageChops.multiply(cabinet.getchannel('A'), alpha))

    # Crucial composition rule: fifth destination lives in the separate right
    # window pane. The original four boards do not move. This preserves the
    # frontal Gemini rhythm instead of turning Work 2 into Work 1.
    x, y = 1115, 48
    scene = base.copy()
    scene.alpha_composite(cabinet, (x, y))

    # Reapply the real diner architecture over the exterior object so the new
    # board remains physically behind the mullion / foreground, not above it.
    original = original_rgb.convert('RGBA')
    scene.alpha_composite(original.crop((1097, 0, 1132, H)), (1097, 0))
    scene.alpha_composite(original.crop((1075, 302, 1170, H)), (1075, 302))

    scene.convert('RGB').save(MORE_OUT, 'WEBP', quality=90, method=6)


if __name__ == '__main__':
    build_work_1()
    build_more_work()
    print(WORK_OUT)
    print(MORE_OUT)
