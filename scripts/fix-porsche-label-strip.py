from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance
import numpy as np
import sys

SCENE = Path(sys.argv[1])
REFERENCE = Path(sys.argv[2])
OUT = Path(sys.argv[3])

scene = Image.open(SCENE).convert('RGB')
reference_scene = Image.open(REFERENCE).convert('RGB')
quad = np.array([[830.0,461.0],[1066.0,462.0],[1066.0,515.0],[830.0,514.0]], dtype=np.float64)
w, h = 236, 54
corners = np.array([[0.0,0.0],[w-1.0,0.0],[w-1.0,h-1.0],[0.0,h-1.0]], dtype=np.float64)


def coeff(destination, source):
    rows=[]; vals=[]
    for (x,y),(u,v) in zip(destination, source):
        rows.append([x,y,1,0,0,0,-u*x,-u*y]); vals.append(u)
        rows.append([0,0,0,x,y,1,-v*x,-v*y]); vals.append(v)
    return tuple(np.linalg.solve(np.asarray(rows,dtype=np.float64), np.asarray(vals,dtype=np.float64)))

ref = reference_scene.transform((w,h), Image.Transform.PERSPECTIVE, coeff(corners,quad), Image.Resampling.BICUBIC)
arr = np.asarray(ref, dtype=np.float32)
# Remove old lettering by deriving each row from robust horizontal color quantiles rather than blurring glyphs.
row_med = np.median(arr, axis=1)
row_lo = np.quantile(arr, 0.35, axis=1)
row_tone = row_med * 0.72 + row_lo * 0.28
bg = np.repeat(row_tone[:,None,:], w, axis=1)
# Preserve gentle left-right material variation without retaining glyph shapes.
col_lum = np.median(arr.mean(axis=2), axis=0)
col_lum /= max(float(np.median(col_lum)), 1e-4)
bg *= np.clip(col_lum[None,:,None], 0.88, 1.10)
bg = np.clip(bg, 0, 255)
label = Image.fromarray(np.uint8(bg), 'RGB').resize((w*8,h*8), Image.Resampling.BICUBIC)
label = ImageEnhance.Contrast(label).enhance(0.96)

d = ImageDraw.Draw(label)
bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
regular='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f1=ImageFont.truetype(bold, 58)
f2=ImageFont.truetype(regular, 40)
ink=(35,31,22)
d.text((55,58),'Porsche × Lucasfilm',font=f1,fill=ink)
d.text((55,150),'The Designer Alliance',font=f2,fill=(45,40,28))
label = label.resize((w,h), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(0.18))

# Fold a restrained amount of original strip microtexture back in.
ref_gray=np.asarray(ref.convert('L'),dtype=np.float32)/255.0
ref_blur=np.asarray(ref.convert('L').filter(ImageFilter.GaussianBlur(1.7)),dtype=np.float32)/255.0
micro=np.clip(ref_gray-ref_blur,-0.012,0.012)
lab=np.asarray(label,dtype=np.float32)/255.0
lab += micro[...,None]*0.28
label=Image.fromarray(np.uint8(np.clip(lab,0,1)*255),'RGB').convert('RGBA')

warped=label.transform(scene.size, Image.Transform.PERSPECTIVE, coeff(quad,corners), Image.Resampling.BICUBIC, fillcolor=(0,0,0,0))
mask=Image.new('L',scene.size,0)
ImageDraw.Draw(mask).polygon([tuple(p) for p in quad],fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(0.35))
result=Image.composite(warped.convert('RGB'),scene,mask)
result.save(OUT,'WEBP',quality=84,method=6)
print(f'Cleaned Porsche physical label strip in {OUT}')
