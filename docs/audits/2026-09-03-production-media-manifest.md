# Last Stop — Production Media Manifest

**Date:** 2026-09-03  
**Purpose:** move from hotlinked working art to controlled production media without blocking layout/build work.

## Governing rule

**Last Stop can frame the work. It should not recolor the work.**

The current remote URLs are acceptable for prototype/staging only. Before production launch, every critical hero/billboard asset should be either locally hosted in this repo/site or delivered through a controlled source with a documented fallback.

| Case | Current billboard / hero source | Current supporting source | Production action | Priority |
|---|---|---|---|---|
| Nike SB × Staple | Seain Kennady campaign archive / Squarespace CDN | Same campaign archive | Download chosen cover + 2 supporting originals; create responsive WebP/AVIF variants; preserve native black/white/green | P2 |
| Virgin Galactic | Official Virgin Galactic Bynder Unity 22 Boost | Official Bynder release / Earth / microgravity | Vendor official press assets locally; preserve dark indigo/orange flame; add intrinsic dimensions | P1 |
| Porsche × Lucasfilm | Official Porsche Newsroom Pegasus image | Official model + sketch assets | Vendor locally from Porsche newsroom; keep one hero, one model, one process image; add intrinsic dimensions | P1 |
| Selsun Blue | Vimeo thumbnail | Collaborator archive still | Replace thumbnail with deliberate original Dinner Date / Gaming / Pool film still; export exact billboard crop + 2–3 case stills | **P0 art** |
| MoneyLion × Beast Games | Official MoneyLion square promo | MoneyLion participation mechanic | Replace billboard/hero with stronger TVC/game-world still when secured; keep participation mechanic as supporting evidence; localize both | **P0 art** |
| TE Connectivity × Alita | Shorty Awards campaign asset | Shorty campaign assets | Find stronger Weta/engineering/Alita detail if available; localize final hero + award-entry supporting images | **P0 art** |
| Jose Cuervo | Ian/current portfolio Cristalino GIF | Agave Bar + Cuervo animation GIFs | Extract intentional poster frames from GIFs; avoid auto-playing hero motion; localize stills and optionally lazy-load motion lower on page | **P0 art** |
| Outdoor Voices | Ian/current portfolio movement image | Ian/current portfolio OV imagery | Current visual direction is already strong; vendor originals locally and preserve daylight/native color | P1 |
| The Atlantic | Local `assets/atlantic-poster.webp` | Ian/current portfolio GIFs | Keep local poster direction; extract/localize best supporting stills from GIFs and avoid dependence on Squarespace CDN | P1 |

## File naming convention

Use stable case-first names so swaps remain cheap:

- `assets/cases/nike/cover.webp`
- `assets/cases/nike/work-01.webp`
- `assets/cases/nike/work-02.webp`
- `assets/cases/virgin/cover.webp`
- etc.

Billboard art should reference a case-local `cover` file. Case pages may reference the same cover or a different case hero if the crop requires it.

## Required derivatives per final hero

At minimum:
- source/original retained outside runtime when licensing permits
- 1600px wide production master
- 1200px wide
- 800px wide
- 480px wide mobile
- WebP; AVIF optional after browser/performance test
- explicit width/height attributes in HTML
- focal-point note if `object-fit: cover` is used

## Production acceptance

A media asset is production-ready only when:
- authentic campaign provenance is known
- native campaign color is preserved
- crop survives actual billboard perspective and case hero
- no important text/face/detail is cut at 1024px desktop or 390px mobile
- page remains understandable if motion is disabled
- asset does not depend on a third-party URL remaining alive
- dimensions are reserved before load to protect CLS
