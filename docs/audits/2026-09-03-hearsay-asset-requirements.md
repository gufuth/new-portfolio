# HEARSAY — Asset Requirements for Current Implementation

**Date:** 2026-09-03

The current repo page uses a superseded framed-photo wall. Do not use that visual system as a production base.

## Required real assets

For each quote/person pair:
- original/highest-resolution real photo
- source/ownership note
- preferred crop if known
- quote exactly as approved
- attribution exactly as approved

Current known quote set from Ian's existing testimonial page:
- “That boy good.” — Sweets
- “He's never caused any problems in the building.” — Neighbor
- “The sweetest boy you’ll ever meet.” — My mother
- “A creative genius second to none.” — Gore Vidal
- “Five stars.” — Ex girlfriend

Do not assume these five are the final production set merely because they exist on the old site. The newer Hearsay sessions selected a larger/curated set; use the latest approved list when those source assets are available.

## Image preparation

- no generated/reconstructed faces
- full color
- preserve normal skin texture; no AI smoothing/gloss
- masks may soften into black but should not turn people into monochrome cutouts
- keep face and quote visually attached
- export 2x desktop source where possible
- use independently replaceable image layers, not one baked montage

## Layout data per person

Store per-item values rather than hardcoding bespoke CSS selectors:
- `x`, `y`
- `scale`
- `depth`
- `opacityRest`
- `opacityActive`
- optional `blurRest` (very small)
- quote width
- quote side/alignment

This allows the apparition choreography to be tuned without recreating the page.

## Motion ceiling

- no obvious looping orbit/drift
- no constellation behavior
- no more than one strong foreground presence at a time
- depth/perception shift should be subtle enough to miss
- reduced-motion = fully complete static composition

## Production blocker

The current implementation cannot be completed honestly until the actual approved photos from the later Hearsay work are available to the repo/runtime. Do not substitute stock faces, generated faces, or the old framed-wall composite.
