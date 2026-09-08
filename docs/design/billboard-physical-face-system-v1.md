# Billboard Physical Face System v1

Status: locked production method. Porsche × Lucasfilm is the accepted rendered-pixel master proof for physical integration; final campaign imagery may be upgraded later without changing the method.

## Non-negotiable rule

A clean campaign image placed over the diner render is rejected. No billboard ships as a bare HTML image, CSS rectangle, or pristine video clipped over the plate. Route geometry may be live. Visible desktop art must look photographed inside the cabinet.

A billboard is treated as one physical **assembly**, not necessarily one flat artwork rectangle. If the photographed cabinet has multiple real printable surfaces, such as a main campaign aperture plus a separate lower project-ID strip, design them together but map each component into the physical surface it actually occupies.

## Static face pipeline

1. Freeze the environment plate and measure every relevant physical artwork surface in source pixels. For a simple board this may be one inner aperture. For Porsche it is the main art aperture plus the separate lower ID strip.
2. Build the complete billboard assembly: campaign image, project/client name, title/subtitle and any other board copy. Preserve the photographed cabinet construction instead of forcing all content into one rectangle.
3. Cover-crop the chosen campaign art without distortion, then perspective-map it to the measured main aperture.
4. Rebuild or clean any separate physical label/nameplate surface, print the case-study identity into that surface, and perspective-map it independently.
5. Reapply each surface's source-derived illumination and edge falloff. Match the photographed median exposure instead of preserving pristine source brightness.
6. Reapply acrylic microtexture, grime, dust, glass reflection and distance softness. Reject source-face edges and old lettering so previous artwork cannot ghost through.
7. Composite beneath the original bezel, lamp, posts, mullions, label hardware and foreground obstructions.
8. Export the complete photographic plate. Desktop DOM retains only the semantic link, accessible name, focus state and transition behavior.

The original deterministic reference implementation is `scripts/build-phase-a-porsche-proof.py`. The accepted master-proof path is now `scripts/build-porsche-master-billboard.py` plus `scripts/fix-porsche-label-strip.py`, exercised by `.github/workflows/porsche-master-billboard-qa.yml` on the isolated proof branch.

## Porsche master geometry

On the locked 1792×1008 WORK plate, Porsche uses two real photographed surfaces:

- Main campaign art aperture: `[[830,319],[1066,320],[1066,460],[830,459]]`
- Lower case-study ID strip: `[[830,461],[1066,462],[1066,515],[830,514]]`

The final proof established that forcing the project name into the main image aperture is wrong for this cabinet. The correct treatment is hero art in the main aperture and `Porsche × Lucasfilm / The Designer Alliance` printed into the separate lower physical strip. Both surfaces receive source-derived exposure, material and distance treatment and are then baked into the photographed scene.

## Animated face pipeline

Animated covers are allowed. Raw GIF is an authoring input, not the default delivery format.

1. Normalize the source animation to a short, silent loop with a deliberate poster frame.
2. Run every frame through the same crop, perspective, exposure, texture, reflection, falloff and softness transforms as a static face.
3. Encode the treated result as animated WebP or muted inline WebM, selected by measured quality and payload. Preserve a static poster for reduced motion and loading failure.
4. Place the treated motion plane behind a transparent foreground hardware mask cut from the approved plate. Keep the mask and scene-level glass/grain above the motion.
5. Never animate every board at once. At most one billboard may move in a scene at a time, by hover/focus or a sparse scheduler. Motion stops under `prefers-reduced-motion`.

This keeps static and animated covers on one physical system. Only the media source changes.

## Browser stack

- Environment plate: `<div class="scene-stage">` background.
- Static boards: precomposited into that plate.
- Animated board, when selected: treated `<video>` or animated WebP behind a transparent hardware/mask asset.
- Interaction: one semantic `<a href>` matching the photographed cabinet.
- Surface layers: hardware/mask, source-derived light/detail maps, and scene glass/grain; all `pointer-events:none`.
- No Canvas, WebGL, runtime image warping, or heavy framework.

## Acceptance gate

The method does not pass because the code exists. It passes only when the same rendered plate succeeds at 1440×900, 1366×768 and 1024×768, plus an enlarged crop of the proof board.

Fail when any of these are visible:

- a clean rectangular edge;
- art crossing bezel, lamp, label strip or cabinet hardware;
- brightness or sharpness inconsistent with neighboring boards;
- old campaign art or old label lettering ghosting through the new surface;
- missing grime, reflection, face falloff or distance softness;
- a motion layer that looks cleaner or flatter than its static poster;
- a hover/focus effect that makes the artwork leave the photographed world.

Final human test: hide the cursor, rails and browser chrome. If a viewer would not believe the art was installed when the scene was photographed, reject it.

## Current proof state

Porsche × Lucasfilm is the accepted technical master proof. The isolated QA workflow passed the real WORK page at 1440×900, 1366×768 and 1024×768 with the hero art baked into the main cabinet aperture and the two-line case identity baked into the real lower strip. No deploy or promotion was required for that proof.

The current case image remains provisional. Replace it with the final higher-resolution approved case-study image later, preserve the same physical geometry, and rerun the same pipeline. Do not spend production time physicalizing the other eight temporary covers before their final imagery is selected.

## Phone-width QA

Phone is a separate index-first presentation; the desktop billboard illusion is not squeezed onto it. GitHub Actions runs Playwright Chromium at exact CSS viewports of 390×844 and 430×932 for all nine cases and the main tour surfaces. It saves first-screen and full-page screenshots and fails on horizontal overflow, missing fixed rails, clipped key text, broken images, sub-44px target height, missing first-screen recruiter content, or a non-single-column case hero.
