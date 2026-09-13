# ABOUT final review - September 13 branch checkpoint

> Status: rendered finalist checkpoint, not shipping approval. The branch is isolated. `main`, the public staging alias, production, and the old production site remain untouched.

## Current governing decisions

- Room 3 stays.
- Public-facing `Last Stop` naming is retired. It remains an internal project codename only.
- The diner is unnamed. The motel is unnamed.
- Visitor-facing location metadata is `INT. MOTEL · ROOM 3 · NIGHT`.
- Ian's real CRT portrait stays. Do not generate or cosmetically alter his likeness.
- `The room is paid through Thursday.` stays.
- **INCIDENTALS** remains locked as the understated label for the hidden secondary Ian material.
- Preferred INCIDENTals behavior is CRT activation that swaps the live About copy territory. No visible instruction, accordion, card, modal, badge, or added motel prop.
- The locked Landing diner may appear only as distant, subordinate geography through the Room 3 window. It is not interactive and not an Easter egg.

## Current finalist set

The comparison is intentionally limited to three controlled copy states on the same visual and interaction system.

### 1. Route B refined - current leader

`English Lit. Leather jacket.` is followed immediately by `I'm Ian. Creative director and copywriter.`

Why it currently wins:

- It gives the page a person before it gives the room more mythology.
- Professional identification arrives immediately after the two-beat personal lead, so the earlier recruiter-latency problem is materially reduced.
- The body copy is specific and sourced.
- In the rendered page it feels authored without becoming a long autobiography.
- It retains the same Room 3, CRT, navigation, window geography, and INCIDENTals interaction as the controls.

Risk: the lead is terse and consciously written. Do not expand it back into the longer anecdote unless Ian explicitly reopens the copy.

### 2. Route A refined - safe control

The direct first-person professional version remains the clarity benchmark.

Why it remains valuable:

- fastest professional comprehension
- factual and compact
- least likely to distract from the work
- useful fallback if B feels too writerly to Ian in the actual page

Why it is currently second: the room and CRT already carry atmosphere and character, so A can read as a conventional portfolio bio placed inside an unusual setting.

### 3. A/B hybrid - third

The hybrid starts with A's direct professional identification and then adds `English Lit. Leather jacket.`

Rendered judgment: the personal beat feels appended after the introduction has already completed its job. It gains less personhood than B and carries more copy than A. Keep it as a controlled hedge, not the recommendation.

### Route C

Historical interaction-control evidence only. It is no longer a current creative finalist. The current direction favors CRT discovery, so C should not be promoted back into the primary comparison without new evidence.

## Shared implementation

The three current finalists share:

- `/review/about/about-refined.css`
- `/review/about/about-refined.js`
- `/review/about/diner-window-crop.svg`

This prevents visual and technical drift between copy candidates.

The current diner crop is derived directly from the locked Landing source and contains practical light and human trace without readable portfolio typography. It is deliberately dim, soft, and subordinate. It is an interim implementation, not the final diner-identity solution.

On phone, the diner overlay is allowed to disappear. The Room 3 plate crops to the right so the old readable motel sign does not re-enter the public page.

## Diner identity proof - governing method

Two September 11 proof artifacts now govern how the geography should be refined:

- `about-diner-mechanical-proof-v1.png`
- `landing-about-diner-identity-proof-v1.png`

The important learning is methodological, not that the exact proof crop should ship.

**What the proof solved:** it used actual Landing pixels, so the diner immediately read as the same physical building rather than a generated roadside-diner lookalike. Ian's response was: `Yeah, this is much closer. I think this is the way we might pull it off.` Treat that as a strong provisional endorsement of the mechanical/compositing method.

**Why the exact proof does not ship:** the proof is too literal for final About because the giant `WORK` becomes readable and begins turning the window into a miniature portfolio page.

**Why the current branch crop is not final either:** it removes readable typography successfully, but it narrows the source enough that some building identity is lost. Recognition becomes mostly practical lights, a human trace, and color rather than clearly the same architecture.

The final window pass must land between those extremes:

- actual locked Landing pixels as the identity source
- recognizable right-side architecture and/or window rhythm
- no readable `WORK`, `ABOUT`, `HEARSAY`, `IAN LUNA`, or other portfolio words
- darker exterior and greater distance
- oblique/downward perspective where physically plausible
- glass contamination, softness, partial obstruction, and uneven detail
- no new generated diner architecture
- no increase in exterior prominence

Success criterion: not `looks like the Landing diner`, but `reads as the same physical diner from a different camera position`.

A mechanical right-side-architecture test was also evaluated after recovering the proof. It preserved real pixels and removed readable typography, but the narrow Room 3 window compressed the architecture enough that the diner read mainly as lamps, silhouette, and a magenta door edge. Useful evidence, but not strong enough to replace the interim crop yet.

## Real browser QA

Chromium rendering was completed for Route A refined, Route B refined, and the hybrid at:

- 1440x900
- 1366x768
- 1024x768
- 430x932
- 390x844

Direct localhost and `file://` navigation are blocked by the execution environment. The test therefore loaded the exact branch-local HTML/CSS/JS and real Room 3/Landing assets into Chromium using Playwright `page.set_content`. This validates browser layout, pixel rendering, CSS behavior, viewport behavior, interaction, focus, and console state. It is not a deployed-URL QA claim.

### Functional results

- no horizontal document overflow in the tested viewport/candidate combinations
- no page/console errors in the tested candidate/viewport combinations
- CRT discovery control remains comfortably larger than the minimum target at every tested size
- INCIDENTals toggles `aria-expanded` correctly
- revealed INCIDENTals becomes available while the hidden bio becomes `aria-hidden` and `inert`
- Escape closes the revealed state and returns focus to the CRT control
- reduced-motion removes the relevant transitions
- the 1024 tablet copy-clipping defect is corrected
- the mobile public-name leak is corrected because the readable old motel sign is cropped out

### Visual hierarchy results

Grayscale, heavy-blur, and brightness-lift diagnostics were run on the current B desktop render.

Result:

- CRT remains the strongest compact human/light signal.
- The room's practical lamp remains a secondary environmental light source.
- The live copy maintains strong readable authority.
- The current diner/window trace is materially quieter and nearly disappears under heavy blur.
- Brightness lift does not expose readable Landing typography in the window.
- The diner geography no longer behaves like a miniature portfolio page or branded sign.

The desired order is now much closer to:

1. Ian / About copy
2. CRT human trace
3. Room 3 geography
4. distant diner geography

## KEEP

- foot-of-bed camera
- bed foreground obstruction
- chair, dresser, lamp, window, and ordinary motel materials
- existing real CRT portrait
- near-black copy field
- fixed FilmFrame rails and existing navigation
- sound off by default
- `The room is paid through Thursday.`
- INCIDENTals through CRT discovery
- unnamed diner/motel geography
- mechanical use of actual Landing diner pixels as the continuity method

## KILL / DO NOT REINTRODUCE

- public-facing `Last Stop Motel`
- readable motel sign as geography
- generated or reinterpreted diner architecture
- fake reel, play, loading, or coming-soon behavior
- `Rumors`, `Hearsay`, `About, allegedly`, or equivalent user-facing names for INCIDENTals
- visible INCIDENTals CTA, accordion, modal, card, badge, or instruction copy
- `Some rooms stay with you.`
- `Ideas travel well.`
- VIEW WORK CTA inside About
- new motel props or lore
- generated Ian likenesses
- CSS rectangle covering `PAUSE II`
- a fourth About concept before Ian reviews the current three

## Remaining source debt / next gate

`PAUSE II` remains baked into the current Room 3 source. A clean source plate has not been located. This is source-level cleanup debt and is not a reason to redesign the page.

The only active visual problem worth another pass before Ian chooses is diner continuity: preserve enough actual architecture to read as the same building without exposing readable portfolio typography or increasing exterior prominence.

## Deployment safety

No Netlify deployment was performed in this pass. Use only a unique non-promoting draft preview when a safe path is available. Do not overwrite the public staging alias. Do not merge or promote anything until Ian selects a finalist.

## Current decision

**Advance Route B refined for Ian's selection. Keep Route A refined as the safe fallback. Keep the A/B hybrid available as the controlled hedge. Route C is historical evidence only. Keep the live branch on the quieter interim diner crop until a mechanically sourced same-building treatment clearly beats it.**
