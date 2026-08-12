# `/work` real-cast render audit

> **STATUS: CURRENT EVIDENCE / DECISION REQUIRED.** The July 15 render is **UNAPPROVED / NOT DEPLOYED**. This document is an audit, not approval or implementation authorization.

## Artifacts compared

| Artifact | Verified repository fact |
|---|---|
| `work.html` | Current implementation; four measured live sign slots; legacy real-project array; 1536×864 stage |
| `work.webp` | Current runtime plate; 1536×863; SHA-256 `cbbc8b25a2035a89005a29884aef8b5a7c88e1dc25b326e43176d42406578208` |
| `work_signs_v4_softlock_16x9.png` | Soft-lock source plate; 1536×863 |
| `pz_lastdiner_work_real_v1_v1.png` | July 15 render; 1536×1024; SHA-256 `56ba0de7c7017e4af7afe1371032dc3083d2996523b8308137d6fc6a117f3f87` |
| `current-work-concept-generation-prompt.md` | Generation prompt and provenance for the July 15 render |
| `case-manifest.md` | Current copy-book cast and unresolved book decisions |

## What the July 15 render gets right

- It stays inside the diner, at booth height, looking across an ordinary wet street.
- It uses practical interior and exterior light.
- It contains no readable WORK reflection or reflected W/O fragments.
- It brings five current-book cases into the physical sign world: Beast Games, Nike SB, Porsche × Star Wars, Virgin Galactic, and Selsun Blue.
- It feels like the same broad physical premise as the current `/work` surface, so it is useful evidence and a possible correction base.

## Conflicts and gaps

### 1. It is not implementation-compatible as-is

The render is 1536×1024. The current `/work` runtime plate is 1536×863 and the code uses a 1536×864 stage with four measured sign footprints. Using the July render would require a new crop and a new measured registration pass. No such production asset or geometry exists in the repository.

### 2. Typography is baked into the image

All five case labels are rendered into the plate. That conflicts with the production rule to keep sign faces layered and editable. It would also make title corrections, ordering changes, accessibility behavior, and future cast changes dependent on another image edit.

### 3. Hero hierarchy uses scale

The Beast Games cabinet is physically much larger than the supporting signs. The active lock says hero status is expressed by light, not sign scale, and signs do not grow. The render therefore conflicts with the lock even though Beast Games is the intended lead case.

### 4. One sign area is obstructed

The Nike SB region is interrupted by the window/mullion structure and an adjacent pale panel. The current visual kill list prohibits readable titles being blocked by mullions, reflections, beams, or foreground objects. A measured correction would be required.

### 5. It shows only part of the book

The render shows five cases. The current copy book describes a longer running order and still contains unresolved book-size and inclusion decisions. The image cannot settle the full cast or index.

### 6. Approval and deployment are absent

The archive documents a July 15 generation. It does not contain an Ian approval, a production conversion, updated `work.html` geometry, or a root runtime replacement. The root `work.webp` remains the legacy plate.

## Decision options

| Option | Meaning | Status |
|---|---|---|
| Reference only | Keep its useful physical and casting cues; do not build from its pixels | `IAN DECISION REQUIRED` |
| Surgical correction base | Authorize a scoped correction/crop/layering plan against current locks | `IAN DECISION REQUIRED` |
| Reject | Preserve it as history and continue from the current soft-lock by another route | `IAN DECISION REQUIRED` |

## Audit verdict

Do not restart `/work` from zero. Do not deploy this render. The next step is an Ian decision on its disposition. If correction is authorized, the first implementation document should define the exact crop, blank/editable cabinet strategy, measured sign geometry, and final cast source before any pixels or code change.

