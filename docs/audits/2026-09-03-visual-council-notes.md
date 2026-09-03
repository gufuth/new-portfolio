# Last Stop — Visual Council Notes — 2026-09-03

Evidence reviewed: the current two-screen WORK / MORE WORK composite (`work 1 and2.png` in the working session), the locked Landing visual law, current live layout CSS, and the current nine-case information architecture.

## Council consensus

The WORK concept is strong enough to keep. The remaining problems are execution regularity, not concept failure.

### WORK

**What survives**
- The diner foreground → glass → road → work depth chain is immediately legible.
- The booth, table and mug establish the viewer inside the same world without becoming the subject.
- Five cases can be scanned as five separate projects.
- Darkness and road separation do most of the atmospheric work; the page does not need additional effects.

**What keeps the current plate from 10**
- Five near-identical centered lamps create a gallery rhythm. The street starts to look curated instead of accumulated.
- Cabinets, posts and spacing are slightly too regular as a group. The law wants common infrastructure with different maintenance histories, not five museum frames.
- The scene is warm enough that the Landing green continuity needs to remain a local contamination/spill, not a whole-frame grade.
- Final art must be judged at the actual projected billboard size; a good standalone image can disappear once perspective and scale are applied.

### MORE WORK

**What survives**
- The more frontal booth/window view differentiates the second room without changing the world.
- Four larger signs are a useful rhythm change from WORK’s five.
- The motel geography makes the second view specific and gives the page a reason to exist beyond `page two`.

**What keeps the current plate from 10**
- The Last Stop Motel sign is currently too readable/clean/bright relative to the intended neglected-object brief. It risks becoming the hero.
- Billboard lamps again repeat too evenly.
- The foreground arrangement is more designed than WORK; final pixel review should make sure the props do not read as a still-life set.
- Motel presence must remain background geography, not navigation or another impossible gesture.

## Layout risk flagged in code

`work-system.css` currently stages the panoramas at **1536 × 548** (2.80:1). Earlier governing implementation work used a **1536 × 864** logical scene. On a 1440 × 900 viewport, the current 2.80:1 stage calculates to roughly 1440 × 514 before the fixed bars, leaving substantial black above and below the scene.

This may be intentional letterboxing, but it is too consequential to bless from source code alone. It is now a specific rendered-pixel gate:

- Does the scene feel like a framed film image, or like a narrow banner floating in black?
- Are billboard IDs large enough at that scale?
- Does the diner foreground still register as a place rather than a sliver?

**Do not change the ratio blindly.** Verify the actual staging plate in a normal browser first. If it reads as a banner, restore more vertical image area rather than enlarging UI.

## Case pages

The recruiter-first structure is directionally right. The main visual risk is template heaviness, not insufficient styling. The case system should pass if:
- the hero media dominates enough that campaign work feels primary;
- the headline does not crowd role/idea/proof below the fold at 1366 × 768;
- paper texture and accent stay quiet;
- proof sections are allowed to disappear on cases with no defensible hard result;
- the mobile first screen remains copy-first and immediately identifies role + idea before media.

## Priority order from the visual council

1. Rendered stage ratio / billboard registration.
2. Remove repeated lamp/gallery rhythm in final WORK/MORE WORK plate pass.
3. Push the motel sign backward through wear, weaker light and less legibility.
4. Final cover selection in-context, not in isolation.
5. Do **not** add new atmospherics, decorative motion, or themed case-page devices to fix any of the above.
