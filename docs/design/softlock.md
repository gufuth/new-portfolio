# /work page — SOFT-LOCK (2026-07-03)

## Soft-locked base
`work_signs_v4_softlock_16x9.png` — 1536x863 (16:9), fills a full screen, no letterbox.

Lineage: gpt-image-2 render (v4, big dominant signs, warm lived-in, film-language prompt) → film-treatment pass (grain, warm grade, halation bloom, vignette) → 16:9 crop that keeps the billboards large and trims the table to a foreground sliver.

Why locked: solved the two standing problems — signs big and clickable-inviting, AI veneer knocked down by the real film pass. Warm, moody, lived-in, not derelict. Reads as a photograph, not a render.

## Backups (do not delete)
- `work_signs_v4_treated.png` — full film-treated frame before the crop.
- `work_signs_v4_reframe.png` — 2.3:1 wide reframe.
- `work_signs_v4_raw_backup.png` — raw untreated gpt-image v4.
- `work_BASE_chosen.png` — copy of treated v4.
- `candidates/candidate_D_bigsigns_filmtreated.png` — candidate D.
- Candidates A (first gpt-image signs), B (green-owned cabinets at depth), C (warm lived-in, quiet signs) in `candidates/`.

## Case content (placeholders until real case studies written)
Beast Games / Amazon Prime Video (HERO), Go / ESPN, Hometown / HBO, The Quiet Issue / New York Times.

## Residual carried into live build
- Signs are big and legible but sit in a fairly even row. Address when we go live: stagger depth/size, or composite the faces as controlled layers for full hover/click control and editable titles.
- Titles are baked into this frame. For final production, composite sign faces separately so case studies stay editable.

## Next
Wire the live bottom-left soft-lock nav (HTML/CSS) and click-to-hero interaction over this base. Landing-to-work threshold transition last.
