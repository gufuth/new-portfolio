# Billboard geometry — all ten boards (v1, 2026-09-26)

Status: measured source-pixel geometry for the baked physical-face pipeline in
`docs/design/billboard-physical-face-system-v1.md`. Consumed by `scripts/build-all-billboards.py`.

Method: each edge was located from median-luminance profiles taken across the edge
(`scripts/build-all-billboards.py --measure` reprints them). Coordinates are continuous pixel
edges (x.5 = between two pixels). Quads run TL, TR, BR, BL. Both plates are frontal, so every
quad is axis-aligned; the keystone is below one pixel on every board.

## WORK plate — base `assets/work-panorama-physical-v2.webp` (1792×1008) → `assets/work-panorama-physical-v3.webp`

| # | Board | Main art aperture | Lower ID strip | Notes |
|---|---|---|---|---|
| 01 | Nike SB × Staple | [[161.5,297.5],[454.5,297.5],[454.5,457.5],[161.5,457.5]] | [[163.5,460.5],[456.5,460.5],[456.5,500.5],[163.5,500.5]] | 455–456 lit bezel lip kept |
| 02 | Virgin Galactic | [[505.5,310.5],[765,310.5],[765,457.5],[505.5,457.5]] | [[506.5,462.5],[766,462.5],[766,500.5],[506.5,500.5]] | Right ~31% sits behind the diner window mullion. Art is mapped to the full cabinet but the photographed mullion is kept: face occluder x ≥ 685.5, strip occluder x ≥ 688.5. Crop and type sit in the visible left part. |
| 03 | Porsche × Lucasfilm | [[829.5,319.5],[1067.5,319.5],[1067.5,460],[829.5,460]] | [[822.5,465.5],[1071.5,465.5],[1071.5,501.5],[822.5,501.5]] | Strip is wider than the art aperture. The older doc quad (label 461–514) overlaps the strip's top rail and bottom rail on this plate; re-measured here. |
| 04 | Selsun Blue | [[1128.5,316.5],[1368.5,316.5],[1368.5,459.5],[1128.5,459.5]] | [[1129,466],[1368.5,466],[1368.5,501.5],[1129,501.5]] | Old bake overpainted the left cabinet frame (x 1110–1128) and left a pale unprinted band 1352–1368. Left frame rebuilt by mirroring the photographed right frame about x = 1248.5. |
| 05 | MoneyLion × Beast Games | [[1416,310.5],[1674.5,310.5],[1674.5,460.5],[1416,460.5]] | [[1416.5,468],[1673.5,468],[1673.5,503.5],[1416.5,503.5]] | Old bake overflowed the cabinet to x ≈ 1388. Left frame (1404–1416) rebuilt by mirroring the right frame about x = 1545.25; the background 1386–1404 is inpainted from the surrounding night. |

## MORE WORK plate — base `assets/more-work-panorama-five-v1.webp` (1440×447) → `assets/more-work-panorama-physical-v2.webp`

| # | Board | Main art aperture | Lower ID strip | Notes |
|---|---|---|---|---|
| 06 | TE Connectivity × Alita | [[155.5,91.5],[346.5,91.5],[346.5,218.5],[155.5,218.5]] | [[154.5,218.5],[349,218.5],[349,264.5],[154.5,264.5]] | |
| 07 | Jose Cuervo | [[417.5,92.5],[604.5,92.5],[604.5,219],[417.5,219]] | [[412.5,219.5],[607.5,219.5],[607.5,265],[412.5,265]] | Old face was leftover Stella Artois art; fully replaced. |
| 08 | Outdoor Voices | [[658.5,94.5],[843,94.5],[843,221],[658.5,221]] | [[654.5,221.5],[845.5,221.5],[845.5,265],[654.5,265]] | |
| 09 | The Atlantic | [[891.5,95.5],[1072.5,95.5],[1072.5,222.5],[891.5,222.5]] | [[889.5,222.5],[1077.5,222.5],[1077.5,264.5],[889.5,264.5]] | |
| 10 | SCOOBA LOVE | [[1137.4,96.8],[1296.7,96.8],[1296.7,208.6],[1137.4,208.6]] | [[1135.7,208.6],[1301.1,208.6],[1301.1,245.6],[1135.7,245.6]] | The fifth cabinet is the 0.88× clone of board 09's photographed cabinet placed at (1115,48) by `build-work-visual-lock-20260909.py`. The earlier SCOOBA face/band was mis-registered (band cut across the face), so the cabinet is re-cloned from `more-work-panorama-current.webp` with the same recipe, then faced. Geometry = board 09 geometry × 0.88 + (1115,48). |

Lamps, top rails, posts, bezels, mullions and the diner foreground stay photographed pixels; only
the areas inside these quads (and the named frame repairs) are rebuilt.

## Faces and strips as built (2026-09-26)

| # | Face source | Crop (focus x, focus y, zoom) | Strip, line 1 / line 2 |
|---|---|---|---|
| 01 | `assets/cases/nike-hero.webp`, right edge trimmed at x 796 to drop a cut-off red swatch | 0.47, 0.54, 1.0 | Nike SB × Staple / Panda Pigeon |
| 02 | **Alt:** `assets/cases/virgin-work-01.webp` (carrier + spaceship + contrails), framed so the ship sits left of the mullion. The hero's rocket is a ~20 px speck at billboard scale. A second candidate, the engine-firing frame from `zc_pull_20260925/virgin-galactic/02.gif` (`scripts/billboard-src/virgin-face.png`, `--virgin-alt`), read as a dark wedge at 1440 and 1024 and was rejected; side-by-side crops in the run folder as `board02-compare-*.png`. | 0.47, 0.25, 1.12 | Virgin Galactic / Unity 22 |
| 03 | `assets/cases/porsche-hero.webp` (accepted master approach) | 0.50, 0.50, 1.0 | Porsche × Lucasfilm / The Designer Alliance |
| 04 | `assets/cases/selsun-hero.webp` | 0.50, 0.50, 1.0 | Selsun Blue / Dan Driff |
| 05 | `assets/cases/moneylion-hero.webp`, cropped below the baked GIVEAWAY headline (vault + MrBeast) | 0.55, 0.68, 1.0 | MoneyLion × Beast Games / Beast Games Giveaway |
| 06 | **Alt:** `assets/cases/alita-work-01.webp` (Alita key visual). The listed hero is a Facebook UI screenshot, which the brief rules out. Cropped to the key-visual half; the Instagram UI half is outside the crop. | 0.32, 0.53, 1.12 | TE Connectivity × Alita / The Science Behind Science Fiction |
| 07 | `assets/cases/cuervo-hero-poster.webp` | 0.50, 0.42, 1.0 | Jose Cuervo / Playamar + Tradicional Cristalino |
| 08 | `assets/cases/outdoor-voices-hero.webp` | 0.50, 0.45, 1.0 | Outdoor Voices / Let’s Play |
| 09 | `assets/cases/atlantic-hero-poster.webp`, cropped inside the logo and tagline | 0.50, 0.52, 1.25 | The Atlantic / Social voice |
| 10 | `assets/cases/scooba-hero.svg`, rasterised by Chromium at 1600×900 to `scripts/billboard-src/scooba-hero.png` | 0.4125, 0.48, 1.06 | SCOOBA LOVE / How to Evaluate Work |

Type: Barlow Condensed (SIL OFL 1.1, the face the site already loads), 700 on the client line and
500 on the case line, left aligned, rasterised once by Chromium into `scripts/billboard-type/`
(`--render-type`). The plate build reads those masks, so it is offline and byte-deterministic.

Light and exposure: each face takes its lamp colour, white level and left-right falloff from that
cabinet's own photographed cream strip (strip RGB ÷ cream albedo). A top-centre lamp pool, a bezel
falloff, the WORK window's glass/rain texture (high-pass of the sky above each cabinet), grain, dust,
a faint reflection band and a resample to the plate's detail level follow. Faces are then pulled
35% of the way toward the plate's median face exposure so a bright-ground print (cyan, white paper)
does not read as a lit screen beside a dark one.

Verification: `python scripts/render-billboard-review.py OUT` renders `review/billboards/*.html` at
1440×900, 1366×768, 1024×768 and 390×844, crops every board 1:1, and hit-tests every billboard link.

## Round 2 fixes (2026-09-26)

- MORE WORK: the far-right "..ST OP" neon box and the vertical MOTEL neon (the internal name) are
  painted out with row-matched night from the plain pane beside them (`remove_motel_signs`), then the
  remaining red halo is knocked down. The pendant lamp, sign pole, window frame and wet-street
  reflections stay photographed.
- Glass-texture patch now sits 48 px above each face, clear of the lamp hoods. At 26 px it picked up
  the lamp hood and printed it as a faint dark pill low on each WORK face (visible on Porsche, Virgin).
- review/billboards/work.html: NEXT BAY control offset by the stage overflow so it keeps the film
  bar's 28 px right inset at every desktop width (live work.html still clips it; not touched).
