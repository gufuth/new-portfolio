# ABOUT final review - branch checkpoint

> Status: implementation checkpoint, not shipping approval. The branch is isolated. `main`, public staging and production remain untouched.

## Governing September 8 lock

**INCIDENTALS is the locked label for the hidden secondary Ian material.** Earlier branch language using `Rumors`, `Hearsay`, `About, allegedly`, `The rest is hearsay`, or `Found in room 3` is superseded at the user-facing level. The joke is carried by understatement, not by adding a motel receipt, ledger, key tag, card, modal, badge, or other prop.

Routes A, B and C have now been reconciled to this lock. Their semantic controls expose `Show incidentals` / `Hide incidentals`, Escape closes the state, and no visible instructional helper is required.

## Recommendation

**Route B - Human signal**

This remains the strongest direction because it makes Ian arrive before the room mythology without changing the Room 3 premise. It keeps the existing plate, demotes the motel sign, preserves the CRT as an indirect human trace, and gives the first scan an actual person rather than a profile paragraph.

The copy is sourced from the canonical long-form Who material, not newly invented. The risk is proportion: if the English Lit / leather jacket opening feels imported from the longer page or delays the professional read, use Route A copy inside Route B's visual hierarchy rather than inventing a fourth direction.

## Runner-up

**Route A - Surgical continuity**

This is the safest route and the cleanest control. It fixes the actual hierarchy problem with the fewest changes, keeps every substantive claim close to current source truth, and uses the CRT for hidden INCIDENTals discovery without reviving the fake reel.

Its weakness is the exact reason it is second: once the motel sign is reduced, the page can become correct without becoming significantly more human.

## Third route

**Route C - Found-evidence control**

Route C uses the same first-person factual foundation as A, while INCIDENTals discovery lives on existing dresser detail instead of the CRT. It is a valid restraint test, but it carries the highest escape-room risk and should not win unless the CRT interaction proves too self-conscious in real pixels.

The prior phone-coordinate fragility has been corrected: the Route C hotspot is now anchored to the 4:3 visual plate rather than the full mobile stage. Route B received the same correction.

## What the visual audit settled

The Room 3 concept is not the problem.

The same-film qualities are already present: ordinary cheap materials, practical light, darkness as primary material, an asymmetrical but stable frame, human presence withheld rather than staged, and a camera position that feels like the room existed before the portfolio.

The actual break from Landing is hierarchy. The motel sign behaves like a second brand concept. Once it is darker, softer and less immediately legible, the room stops competing with Ian.

## KEEP

- foot-of-bed camera
- bed foreground obstruction
- cheap chair, dresser, lamp and window geography
- existing real CRT portrait
- near-black live-copy field
- shared FilmFrame rails and tour runtime
- sound off default
- `The room is paid through Thursday.`
- no fake reel, loading, coming-soon or decorative loop
- INCIDENTals as subordinate, discoverable secondary material

## CHANGE

- motel sign: darker, less saturated, softer through glass, peripheral
- bio: larger authority, first-person, stronger relationship to CRT
- mobile: 4:3 room crop with CRT near center and sign pushed to edge
- hidden material: optional, keyboard/touch reachable, Escape dismissible, labeled INCIDENTals
- `PAUSE II`: remove only from a clean source plate when found

## KILL

- motel sign as logo / hero
- old play-reel behavior
- visible INCIDENTals cards / CTAs / badges / modal UI
- user-facing `Rumors`, `Hearsay`, `About, allegedly`, `The rest is hearsay`, or `Found in room 3` labels for this material
- new motel lore or prop accumulation
- turning `The room is paid through Thursday.` into a clickable setup
- CSS patch over `PAUSE II`
- any generated or cosmetically altered portrait of Ian

## INCIDENTals behavior

**Preferred:** CRT discovery. The screen gets only a tiny hover/focus lift. Activation swaps the main copy territory to a readable INCIDENTals state. No play icon, no visible instruction, no static loop. Assistive technology gets an explicit semantic label.

**Secondary test:** existing dresser-detail hotspot. It adds no prop, but it is more puzzle-like and therefore less favored.

## Mobile conclusion

The phone version should not mimic desktop coordinates. The 4:3 crop is the right structural move because it keeps enough of the room to preserve the premise and lets the CRT remain a human trace. The motel sign can fall mostly toward the left edge. Live copy then follows as the primary readable block.

Routes B and C now use a `.visual` wrapper so their interaction hit areas stay registered to that 4:3 plate on phone rather than drifting with the full document height.

## Failed experiment retained as a warning

A generated plate experiment was rejected because it altered Ian's likeness, changed room composition and baked live text into the image. It is not a candidate and must never be committed. The failure reinforces the current non-generative, surgical approach.

## Open image debt

The baked `PAUSE II` label remains because a clean source plate has not been located in Drive or repo history. A CSS cover was tested conceptually and rejected because the patch becomes visible. This is source-level cleanup debt, not a reason to redesign the page.

## Branch references

- branch: `about-iteration-lab-20260908-contd`
- Route A: `review/about/route-a/index.html`
- Route B: `review/about/route-b/index.html`
- Route C: `review/about/route-c/index.html`
- source map: `docs/about-lab/ABOUT_SOURCE_MAP.md`
- baseline audit: `docs/about-lab/ABOUT_BASELINE_AUDIT.md`
- hierarchy studies: `docs/about-lab/ABOUT_HIERARCHY_STUDIES.md`
- copy audit: `docs/about-lab/ABOUT_COPY_AUDIT.md`
- older prototype notes: `docs/about-lab/ABOUT_RUMORS_PROTOTYPES.md` (internal filename only; user-facing naming is superseded by INCIDENTals)

## Deployment safety

No Netlify deploy is authorized if it can change the public staging alias. Use only a unique non-promoting draft preview. `main`, the current public staging alias, and production remain untouched.

## Current decision

**Advance Route B for real-pixel comparison. Keep Route A intact as the fallback. Keep Route C available as the interaction-control test. Do not invent a fourth concept. Merge nothing until Ian selects.**