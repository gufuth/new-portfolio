# Billboard method correction — live-layer proof — 2026-09-08

> **STATUS: CURRENT / BINDING FOR BILLBOARD PRODUCTION.** This addendum supersedes both September 7 baked-composite attempts. It records one deployed architecture proof, not approval of a cover image or permission to roll the current imagery across all nine billboards.

## Why the prior method failed

The original rectangular paste failed because it crossed photographed hardware and read as a digital rectangle. The later perspective-warped composite preserved the hardware more carefully, but it still baked campaign pixels into the environment plate. In the site, the supposedly independent billboard `<img>` elements were hidden on desktop. That made image replacement expensive and left the billboard feeling like a picture pasted onto a render.

Neither baked method is an accepted production architecture.

## Current proof

Commit `471461eb7a81e56b4bd83cd74ef99ab2b257d187` implements one Porsche proof:

- `assets/work-panorama-live-proof.webp` keeps the photographed lamp, rail, bezel, cabinet, label strip, posts, road, glass, and diner foreground, but replaces only the Porsche inner art plane with a neutral illuminated face;
- `assets/cases/porsche-hero.webp` remains a separate 1600×900 source asset;
- `work.html` marks only the Porsche anchor with `data-live-proof`;
- `work-system.css` registers that live image inside the measured photographed aperture and adds restrained exposure/glass treatment;
- the whole billboard remains a semantic link to the Porsche case study.

The neutral-face builder is `scripts/build-live-porsche-proof.py`. It exists to reproduce the clean plate, not to bake the selected campaign art back into it.

## Verified public behavior

Netlify deploy `6a9f6ee1d98404011f5a5141` reached `ready` on 2026-09-08 at `https://last-stop-diner-staging.netlify.app`.

Deployed-browser verification at a 1363×936 viewport confirmed:

- exactly one `[data-live-proof]` billboard;
- the displayed artwork is an independent, loaded 1600×900 image;
- the environment uses `work-panorama-live-proof.webp`;
- the Porsche billboard opens `/work/porsche-lucasfilm-designer-alliance/`;
- browser Back returns to `/work` with the live proof intact;
- `node scripts/verify-tour-runtime.mjs` passes.

## What is and is not proved

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

1. Ian judges the one deployed Porsche proof as an architecture test.
2. Tune only its registration/exposure if needed.
3. Select final cover images.
4. Build genuinely clean higher-quality WORK and MORE WORK environment plates.
5. Convert the remaining eight billboards to independent live layers.
6. Run the full desktop/mobile visual, interaction, accessibility, and performance audit.

HEARSAY remains parked until Ian returns the separately developed current direction.
