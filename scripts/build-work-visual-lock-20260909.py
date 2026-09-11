from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter, ImageChops

ROOT = Path(__file__).resolve().parents[1]
WORK_SRC = ROOT / 'assets' / 'work-panorama-physical-v1.webp'
MORE_SRC = ROOT / 'assets' / 'more-work-panorama-current.webp'
WORK_OUT = ROOT / 'assets' / 'work-panorama-physical-v2.webp'
MORE_OUT = ROOT / 'assets' / 'more-work-panorama-five-v1.webp'


def font_path(bold=False):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    ]
    for p in candidates:
        if Path(p).exists():
            return p
    raise RuntimeError('No usable system sans font found')


def fit_font(text, box_w, max_size, min_size=7, bold=True):
    path = font_path(bold)
    for size in range(max_size, min_size - 1, -1):
        f = ImageFont.truetype(path, size)
        bb = f.getbbox(text)
        if bb[2] - bb[0] <= box_w:
            return f
    return ImageFont.truetype(path, min_size)


def draw_physical_label(im, box, client, project, title_max, sub_max, pad_x=8, pad_y=4):
    """Draw readable identity into the photographed cream strip, not as browser UI."""
    x0, y0, x1, y1 = box
    w = x1 - x0
    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    client_font = fit_font(client, w - 2 * pad_x, title_max, 8, True)
    project_font = fit_font(project, w - 2 * pad_x, sub_max, 7, False)
    ink = (31, 27, 21, 246)
    sub_ink = (43, 37, 28, 228)
    d.text((x0 + pad_x, y0 + pad_y), client, font=client_font, fill=ink)
    bb = client_font.getbbox(client)
    line_h = bb[3] - bb[1]
    d.text((x0 + pad_x, y0 + pad_y + line_h + 2), project, font=project_font, fill=sub_ink)
    # Tiny optical softness so the text inherits the photographed strip rather than reading as vector UI.
    layer = layer.filter(ImageFilter.GaussianBlur(0.14))
    return Image.alpha_composite(im.convert('RGBA'), layer)


def build_work_1():
    im = cv2.imread(str(WORK_SRC))
    if im is None:
        raise RuntimeError(f'Could not open {WORK_SRC}')
    h, w = im.shape[:2]
    if (w, h) != (1792, 1008):
        raise RuntimeError(f'Unexpected Work plate size {(w, h)}')

    # Public naming lock: the diner remains unnamed. Remove the old LAST STOP sign
    # while preserving camera, road, booth, five boards, lamps and window geometry.
    sx0, sy0, sx1, sy1 = 1360, 105, 1535, 285
    source = im[sy0:sy1, sx0:sx1].copy()
    mask = np.full(source.shape[:2], 255, dtype=np.uint8)
    mask = cv2.GaussianBlur(mask, (19, 19), 0)
    out = cv2.seamlessClone(source, im, mask, (1642, 195), cv2.NORMAL_CLONE)
    support = np.zeros((h, w), dtype=np.uint8)
    cv2.rectangle(support, (1636, 245), (1668, 338), 255, -1)
    support = cv2.GaussianBlur(support, (9, 9), 0)
    out = cv2.inpaint(out, support, 7, cv2.INPAINT_TELEA)

    scene = Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB)).convert('RGBA')
    # Left-anchored identification wins the legibility test. Client is dominant,
    # campaign/project is the supporting line. The window mullion may obscure art,
    # but the labels themselves stay as readable as the photographed geometry allows.
    labels = [
        ((151, 450, 457, 497), 'Nike SB × Staple', 'Panda Pigeon'),
        ((507, 450, 671, 497), 'Virgin Galactic', 'Unity 22'),
        ((813, 450, 1052, 497), 'Porsche × Lucasfilm', 'The Designer Alliance'),
        ((1111, 450, 1349, 497), 'Selsun Blue', 'Dan Driff'),
        ((1387, 450, 1650, 497), 'MoneyLion × Beast Games', 'Beast Games Giveaway'),
    ]
    for box, client, project in labels:
        scene = draw_physical_label(scene, box, client, project, title_max=16, sub_max=10, pad_x=8, pad_y=4)

    scene.convert('RGB').save(WORK_OUT, 'WEBP', quality=90, method=6)


def clean_more_work_signage(original_rgb):
    """Remove the public-facing LAST STOP / MOTEL sign from the right pane."""
    arr = cv2.cvtColor(np.asarray(original_rgb), cv2.COLOR_RGB2BGR)
    mask = np.zeros(arr.shape[:2], dtype=np.uint8)
    cv2.rectangle(mask, (1260, 100), (1395, 265), 255, -1)
    cv2.rectangle(mask, (1315, 230), (1375, 332), 255, -1)
    mask = cv2.GaussianBlur(mask, (9, 9), 0)
    cleaned = cv2.inpaint(arr, mask, 9, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(cleaned, cv2.COLOR_BGR2RGB))


def build_more_work():
    original_rgb = Image.open(MORE_SRC).convert('RGB')
    W, H = original_rgb.size
    if (W, H) != (1440, 447):
        raise RuntimeError(f'Unexpected More Work plate size {(W, H)}')

    # Latest visual lock: preserve the Gemini camera and existing four cabinets.
    # The motel sign is gone. SCOOBA becomes a full-size fifth physical destination
    # in the separate right pane rather than a floating DOM marker or small afterthought.
    cleaned = clean_more_work_signage(original_rgb)
    scene = cleaned.convert('RGBA')

    labels = [
        ((154, 220, 348, 267), 'TE Connectivity × Alita', 'Science Behind Science Fiction'),
        ((414, 220, 602, 267), 'Jose Cuervo', 'Playamar + Cristalino'),
        ((650, 220, 850, 267), 'Outdoor Voices', 'Let’s Play'),
        ((899, 220, 1072, 267), 'The Atlantic', 'Social voice'),
    ]
    for box, client, project in labels:
        scene = draw_physical_label(scene, box, client, project, title_max=14, sub_max=9, pad_x=6, pad_y=3)

    # Duplicate a real photographed Work-2 cabinet, including lamp, wear and posts.
    # This is a physical-plate operation, not browser geometry pretending to be a board.
    src_box = (866, 40, 1105, 327)
    cabinet = cleaned.crop(src_box).convert('RGBA')
    scale = 0.98
    nw = int(cabinet.width * scale)
    nh = int(cabinet.height * scale)
    cabinet = cabinet.resize((nw, nh), Image.Resampling.LANCZOS)

    fx0, fy0 = int(25 * scale), int(53 * scale)
    fx1, fy1 = int(217 * scale), int(160 * scale)
    by0, by1 = fy1, int(214 * scale)

    face = Image.new('RGB', (fx1 - fx0, fy1 - fy0), '#091011')
    fd = ImageDraw.Draw(face)
    fd.text((9, 10), 'SCOOBA LOVE',
            font=fit_font('SCOOBA LOVE', face.width - 18, 18, 10, True), fill='#d8cfba')
    fd.text((9, 35), 'HOW TO EVALUATE WORK',
            font=fit_font('HOW TO EVALUATE WORK', face.width - 18, 8, 7, True), fill='#91a197')
    small = ImageFont.truetype(font_path(False), max(6, int(7 * scale)))
    for i, line in enumerate([
        'STRATEGY  /  CLIENT GOAL',
        'OWNABLE  /  ONE SENTENCE',
        'BUY  /  ACHIEVABLE  /  LOVE',
    ]):
        fd.text((9, 55 + i * 14), line, font=small, fill='#8d887c')

    photographed_face = cabinet.crop((fx0, fy0, fx1, fy1)).convert('L')
    illumination = photographed_face.filter(ImageFilter.GaussianBlur(11))
    illum = np.asarray(illumination, dtype=np.float32) / 255.0
    illum = 0.62 + 0.42 * illum
    arr = np.asarray(face, dtype=np.float32)
    arr = np.clip(arr * illum[..., None], 0, 255)
    face = Image.fromarray(arr.astype('uint8'), 'RGB')
    face = ImageEnhance.Brightness(face).enhance(0.76)
    face = ImageEnhance.Contrast(face).enhance(0.84)
    low = photographed_face.filter(ImageFilter.GaussianBlur(3.0))
    hf = ImageChops.subtract(photographed_face, low, scale=1.0, offset=128)
    hf_rgb = Image.merge('RGB', (hf, hf, hf))
    face = Image.blend(face, hf_rgb, 0.08).filter(ImageFilter.GaussianBlur(0.55))
    cabinet.alpha_composite(face.convert('RGBA'), (fx0, fy0))

    band = cabinet.crop((fx0, by0, fx1, by1)).convert('RGBA')
    band = Image.blend(band.convert('RGB'), Image.new('RGB', band.size, (178, 164, 132)), 0.30).convert('RGBA')
    bd = ImageDraw.Draw(band)
    cfont = fit_font('SCOOBA LOVE', band.width - 12, 12, 7, True)
    pfont = fit_font('How to evaluate work', band.width - 12, 8, 6, False)
    bd.text((6, 3), 'SCOOBA LOVE', font=cfont, fill=(38, 33, 26, 242))
    bb = cfont.getbbox('SCOOBA LOVE')
    line_h = bb[3] - bb[1]
    bd.text((6, 4 + line_h), 'How to evaluate work', font=pfont, fill=(44, 38, 29, 226))
    band = band.filter(ImageFilter.GaussianBlur(0.20))
    cabinet.alpha_composite(band, (fx0, by0))

    # Feather only the outer donor crop. The cabinet face, label and hardware remain crisp
    # relative to the photographed distance, while the duplicated environmental edge disappears.
    alpha = Image.new('L', (nw, nh), 255)
    ad = ImageDraw.Draw(alpha)
    edge = 12
    for i in range(edge):
        val = int(255 * (i + 1) / edge)
        ad.rectangle((i, i, nw - 1 - i, nh - 1 - i), outline=val, width=1)
    alpha = alpha.filter(ImageFilter.GaussianBlur(2.2))
    cabinet.putalpha(ImageChops.multiply(cabinet.getchannel('A'), alpha))

    x, y = 1127, 44
    scene.alpha_composite(cabinet, (x, y))

    # Re-apply the actual diner foreground over the new board so the right-pane
    # mullion and sill physically occlude the exterior installation.
    foreground = cleaned.convert('RGBA')
    scene.alpha_composite(foreground.crop((1097, 0, 1134, H)), (1097, 0))
    scene.alpha_composite(foreground.crop((1072, 303, 1180, H)), (1072, 303))

    # Small natural edge falloff keeps the fifth destination from becoming a hero.
    veil = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(veil)
    vd.rectangle((1330, 0, W - 1, H - 1), fill=(0, 0, 0, 16))
    veil = veil.filter(ImageFilter.GaussianBlur(18))
    scene = Image.alpha_composite(scene, veil)

    scene.convert('RGB').save(MORE_OUT, 'WEBP', quality=90, method=6)


if __name__ == '__main__':
    build_work_1()
    build_more_work()
    print(WORK_OUT)
    print(MORE_OUT)
