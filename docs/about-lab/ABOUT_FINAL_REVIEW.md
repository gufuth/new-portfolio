# ABOUT final review - branch checkpoint

> Status: implementation checkpoint, not shipping approval. Pixel certification and isolated draft deployment remain open because the available Netlify action does not expose a safe unique-preview target and must not be allowed to overwrite the current staging alias.

## Recommended route

**Route A - Surgical continuity**

Reason: it fixes the actual hierarchy problem while preserving the Room 3 premise, keeps every substantive biography claim grounded in current source truth, and uses the existing CRT for discovery without reviving the fake reel.

## Runner-up

**Route C - Found evidence**

Reason: it has the strongest restraint if the CRT proves too dominant after the motel sign is corrected, and its discovery mechanism works naturally on phone without adding a new physical prop.

## Third route

**Route B - Human signal**

Reason: it has the strongest immediate voice and best scanning rhythm, but its lead characterization (`Copywriter first. Creative director by accumulation.`) is more interpretive than the current factual bio and should not outrank Route A without Ian deciding that it is true to his career story.

## Current score - source-level only

These are not rendered-pixel scores. They evaluate concept discipline, source truth, implementation structure and likely hierarchy. Do not use them as final visual approval.

| Criterion | Route A | Route B | Route C |
|---|---:|---:|---:|
| Same-film continuity | 19/20 | 18/20 | 19/20 |
| Ian-first hierarchy intent | 14/15 | 15/15 | 13/15 |
| Factual / specific copy | 15/15 | 11/15 | 14/15 |
| Restraint | 14/15 | 13/15 | 14/15 |
| Rumor discovery logic | 14/15 | 14/15 | 13/15 |
| Accessibility structure | 10/10 | 10/10 | 10/10 |
| Mobile concept | 8/10 | 8/10 | 9/10 |
| **Provisional total** | **94** | **89** | **92** |

Hard-gate note: no route can be called a finalist until rendered inspection proves that the motel sign is no longer the strongest attention island and that the corrective mask/falloff does not read as a CSS patch.

## What changed

- preserved the active Room 3 plate and camera
- preserved shared FilmFrame rails and tour runtime
- left sound behavior under the shared runtime
- demoted the motel sign locally instead of redesigning the room
- strengthened biography scale / position
- tested first-person factual copy, a higher-personality first-person variant, and restrained third-person copy
- restored the old rumor list as optional discoverable material
- built equivalent keyboard/touch activation and Escape dismissal
- kept review routes `noindex`

## What stayed fixed

- Landing remains untouched
- `about.html`, `about.webp` and `og_about.png` remain untouched on `main`
- Ian's portrait remains the existing real source image
- the Room 3 camera, bed, chair, dresser, CRT and dark field remain the baseline
- `The room is paid through Thursday.` remains a keeper
- no new room prop was added
- no decorative motion loop or audio was added

## What was rejected during this pass

### CSS patch over `PAUSE II`

Rejected after visual reasoning because a dark patch over the baked label becomes a visible designer correction. The proper fix is source-level cleanup or a clean source plate. Until then, the label remains an acknowledged image-level defect and has no functional meaning.

### New motel evidence prop

Rejected. A ledger, key tag, receipt, note or similar object would make the motel theme more important than Ian.

### Cute found-evidence copy

Route C initially used `Additional charges disputed`. It was cut back to `Incidentals` because the first line was performing the joke too aggressively.

### Generic portfolio overlay

Rejected: modal cards, tooltips, badges, `RUMORS` CTA and hover-only behavior.

## Strongest criticism of the recommendation

Route A may be too conservative. If the corrected sign falls away but the CRT remains a small secondary portrait and the bio remains visually detached from the room, the page will be cleaner without becoming significantly more memorable. The pixel test must prove that changing hierarchy is enough.

## Current implementation references

- Branch: `about-iteration-lab-20260908-contd`
- Branch checkpoint at time of this review: see current branch HEAD; do not assume this document's commit is the final branch SHA after further corrections.
- Route A: `review/about/route-a/index.html`
- Route B: `review/about/route-b/index.html`
- Route C: `review/about/route-c/index.html`
- Baseline audit: `docs/about-lab/ABOUT_BASELINE_AUDIT.md`
- Copy audit: `docs/about-lab/ABOUT_COPY_AUDIT.md`
- Rumor prototypes: `docs/about-lab/ABOUT_RUMORS_PROTOTYPES.md`

## Production / staging safety

`main` has not been changed by this lab. The production domain has not been changed. The public staging alias has not been changed.

The currently available Netlify write action only exposes a site-level deployment operation. It does not expose the equivalent of `netlify deploy` with a branch/directory plus guaranteed no-alias promotion. Using it would violate the explicit non-destructive preview rule. Therefore the branch is preserved remotely and no staging deploy was attempted from this chat.

## Exact next action

Render the three branch routes at the required desktop/tablet/phone widths using a safe isolated preview or a browser environment that can load the branch assets. Run grayscale / blur / brightness-lift attention checks. If A passes, make only surgical corrections. If A fails because the CRT or bio still feels detached, compare C before reopening the Room 3 premise.

Do not merge any route until Ian selects it.