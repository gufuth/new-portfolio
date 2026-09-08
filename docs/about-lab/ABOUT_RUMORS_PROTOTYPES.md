# ABOUT rumor discovery prototypes

Status: functioning source prototypes on the isolated About branch. No mechanism is approved for production.

## Goal

Recover the original page's feeling of discovering Ian's absurd self-mythology without advertising a `rumors` feature, building a scavenger hunt, or making the page depend on hover.

All mechanisms use semantic buttons, support click/tap and keyboard activation, expose state with `aria-expanded` / `aria-controls`, close on Escape, and keep the biography usable without opening the rumors.

## Prototype 1: CRT discovery

Used by Routes A and B.

### Behavior

The existing CRT is the control. It receives only a very small focus/hover lift. Activating it reveals the rumor list in the dark biography territory. There is no `play`, `reel`, `coming soon`, instruction label or looping static.

### Why it fits

- uses an existing object rather than adding a prop
- Ian is already physically present on the screen
- curiosity is plausible without a `click here` instruction
- it inherits the old page's discoverability without copying the old hover behavior

### Risks

- the baked `PAUSE II` text can accidentally imply playback even though the control no longer does
- if the CRT glow becomes too visible, the page starts advertising its trick
- the control's accessible name necessarily reveals `rumors` to assistive technology before the visual reveal, which is acceptable because accessibility outranks preserving the joke from a screen reader

### Current judgment

**Winner on interaction logic, pending pixel proof.** It is the most native mechanism because no additional visual object is required.

## Prototype 2: Paid-through-Thursday seam

Used by Route C.

### Behavior

`The room is paid through Thursday.` remains visually part of the biography but is a semantic button. Activating it reveals the historical rumor list below under the restrained motel-native label `Incidentals`.

### Why it fits

- uses the strongest existing line rather than adding a new visual prop
- discovery is editorial rather than gadget-driven
- the joke is already about the room, so the reveal has a physical logic without requiring lore
- on mobile, it remains reachable after the basic biography rather than becoming a hidden hotspot on a cropped image

### Risks

- making a good line clickable can make it feel like a setup rather than a throwaway
- `Incidentals` is close to the edge of being a designed motel joke
- keyboard focus necessarily makes the line look interactive when focused

### Current judgment

**Runner-up.** Stronger as a mobile mechanism than the CRT, but more self-conscious conceptually. Keep it only if rendered behavior feels deadpan rather than cute.

## Rejected prototype family: new physical evidence

Examples considered and rejected at this stage: motel ledger, key tag, bedside note, receipt, postcard, phone message, room-service slip.

Reason: the Room 3 baseline already contains enough set dressing and narrative implication. Adding a new object primarily to hold rumors converts discovery into prop design and makes the motel theme more important than Ian.

## Rejected prototype family: generic overlays

Rejected: modal card, tooltip cloud, floating panel, bottom sheet styled as a UI component, dedicated `RUMORS` link, badge, instructions, hover-only reveal.

Reason: these expose the mechanism as portfolio interface rather than something quietly found inside the scene.

## Accessibility / motion law

Any selected mechanism must preserve:

- a real semantic control
- activation by touch and keyboard
- visible focus
- Escape to dismiss
- no focus trap
- no hover-only content
- no autoplay audio
- no decorative loop required for discoverability
- no essential transition under `prefers-reduced-motion`
- core biography and navigation available without opening the rumors

## Current ranking

1. CRT discovery
2. Paid-through-Thursday seam
3. New physical evidence: rejected

The decisive visual question is whether the CRT can remain quiet enough after the motel sign is demoted. If it becomes the new hero, Route C's editorial seam becomes the better restraint choice.