# Billboard Physical Face System v1

Status: locked production method; one-board visual proof still requires Ian's rendered-pixel approval.

## Non-negotiable rule

A clean campaign image placed over the diner render is rejected. No billboard ships as a bare HTML image, CSS rectangle, or pristine video clipped over the plate. Route geometry may be live. Visible desktop art must look photographed inside the cabinet.

## Static face pipeline

1. Freeze the environment plate and measure the four inner-aperture corners in source pixels.
2. Cover-crop the chosen campaign art without distortion, then perspective-map it to those corners.
3. Reapply the face's source-derived illumination and edge falloff. Match the photographed median exposure instead of preserving pristine source brightness.
4. Reapply acrylic microtexture, grime, dust, glass reflection and distance softness. Reject source-face edges so old artwork cannot ghost through.
5. Composite beneath the original bezel, lamp, label strip, posts and foreground obstructions.
6. Export the complete photographic plate. Desktop DOM retains only the semantic link, accessible name, focus state and transition behavior.

The deterministic reference implementation is `scripts/build-phase-a-porsche-proof.py`. Its current proof input is the neutral Porsche face in `assets/work-panorama-live-proof.webp`; its output is `assets/work-panorama-physical-v1.webp`.

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

The method does not pass because the code exists. It passes only when the same rendered plate succeeds at 1440×900, 1366×768 and 1024×768, plus a 2× crop of the proof board.

Fail when any of these are visible:

- a clean rectangular edge;
- art crossing bezel, lamp, label strip or cabinet hardware;
- brightness or sharpness inconsistent with neighboring boards;
- missing grime, reflection, face falloff or distance softness;
- a motion layer that looks cleaner or flatter than its static poster;
- a hover/focus effect that makes the artwork leave the photographed world.

Final human test: hide the cursor, rails and browser chrome. If a viewer would not believe the art was installed when the scene was photographed, reject it.

## Current proof state

The deployed live Porsche `<img>` proof is rejected and disabled on desktop. `work-panorama-physical-v1.webp` is the new static physical-composite candidate. It demonstrates the production path but is not final cover selection, scale, copy or nine-board rollout approval.

## Phone-width QA

Phone is a separate index-first presentation; the desktop billboard illusion is not squeezed onto it. GitHub Actions runs Playwright Chromium at exact CSS viewports of 390×844 and 430×932 for all nine cases and the main tour surfaces. It saves first-screen and full-page screenshots and fails on horizontal overflow, missing fixed rails, clipped key text, broken images, sub-44px target height, missing first-screen recruiter content, or a non-single-column case hero.

