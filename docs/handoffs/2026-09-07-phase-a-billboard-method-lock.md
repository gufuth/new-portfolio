# Billboard method correction — rejected live layer / physical-face replacement — 2026-09-08

> **STATUS: HISTORICAL FAILURE RECORD.** The deployed live-layer experiment in this file was rejected after rendered review. Current production law is `docs/design/billboard-physical-face-system-v1.md`.

## Why the prior method failed

The original rectangular paste failed because it crossed photographed hardware and read as a digital rectangle. The later perspective-warped composite preserved the hardware more carefully, but it still baked campaign pixels into the environment plate. In the site, the supposedly independent billboard `<img>` elements were hidden on desktop. That made image replacement expensive and left the billboard feeling like a picture pasted onto a render.

The bare live-layer method is not an accepted production architecture. A measured physical composite is now the required static path; animated faces use the same treatment frame-by-frame behind photographed hardware.

## Current proof

Commit `471461eb7a81e56b4bd83cd74ef99ab2b257d187` implements one Porsche proof:

- `assets/work-panorama-live-proof.webp` keeps the photographed lamp, rail, bezel, cabinet, label strip, posts, road, glass, and diner foreground, but replaces only the Porsche inner art plane with a neutral illuminated face;
- `assets/cases/porsche-hero.webp` remains a separate 1600×900 source asset;
- `work.html` marks only the Porsche anchor with `data-live-proof`;
- `work-system.css` registers that live image inside the measured photographed aperture and adds restrained exposure/glass treatment;
- the whole billboard remains a semantic link to the Porsche case study.

The neutral-face builder is `scripts/build-live-porsche-proof.py`. It exists to reproduce the clean plate, not to bake the selected campaign art back into it.

## Verified public behavior

Netlify deploy `6a9f7902cdbce91289105f05` reached `ready` on 2026-09-08 at `https://last-stop-diner-staging.netlify.app`.

Deployed-browser verification at a 1363×936 viewport confirmed:

- exactly one `[data-live-proof]` billboard;
- the displayed artwork is an independent, loaded 1600×900 image;
- the environment uses `work-panorama-live-proof.webp`;
- the Porsche billboard opens `/work/porsche-lucasfilm-designer-alliance/`;
- browser Back returns visibly to `/work` with no active transition curtain and restores focus to Porsche;
- `node scripts/verify-tour-runtime.mjs` passes.

The initial deploy exposed a stale black transition curtain after browser Back. Commit `19b9edb39f208be5e45495ce1043ddc839a25dba` clears that BFCache state and adds a source regression assertion. Final live verification passed: zero active cut layers after Back, an empty transient body class, restored Porsche focus, and the live billboard visible.

The final pass also found the Landing transition still referenced the old baked plate. Commit `90d9ac306069c1537090b799df71b093f5a3fa5a` points it to the clean proof plate and cache-busts the Landing stylesheet. Public staging verification confirmed the live-proof transition asset loads and the old plate is absent from that transition.

## What is and is not proved

This acceptance was superseded by Ian's later rendered review. The live Porsche `<img>` still read as a pasted rectangle and is rejected. It may not be used as the production architecture. Billboard size, label/copy design and final image selection remain parked, but the physical integration method is active and governed by `docs/design/billboard-physical-face-system-v1.md`.

Proved:

- a clean environment face and a separate live HTML artwork layer can coexist in the deployed photographic scene;
- the live layer can stay within the physical sign aperture and retain normal link/focus/return behavior;
- a future cover swap does not require rebuilding the entire scene plate.

Not approved or complete:

- the Porsche cover image itself;
- final label copy or label legibility;
- the other eight cover selections or conversions;
- the baked non-Porsche billboards still visible in the current plates;
- the perceptual resolution of the underlying WORK and MORE WORK environments. The prior 44 KB and 25 KB plates are aggressively compressed; the proof plate avoids another low-quality export but cannot recover detail already absent from its source.

## Next gates

1. Ian judges the one rendered Porsche physical-composite candidate as an architecture test.
2. Tune only its registration/exposure if needed.
3. Select final cover images.
4. Build genuinely clean higher-quality WORK and MORE WORK environment plates.
5. Produce the remaining eight billboards as static physical composites or treated animated faces behind photographed hardware.
6. Run the full desktop/mobile visual, interaction, accessibility, and performance audit.

HEARSAY remains parked until Ian returns the separately developed current direction.
