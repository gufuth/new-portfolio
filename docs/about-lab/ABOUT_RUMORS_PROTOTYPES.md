# ABOUT rumor discovery prototypes

Status: functioning source prototypes on the isolated About branch. No mechanism is approved for production.

## Goal

Recover the original page's feeling of discovering Ian's absurd self-mythology without advertising a `rumors` feature, building a scavenger hunt, or making the page depend on hover.

All current mechanisms use semantic buttons, support click/tap and keyboard activation, expose state with `aria-expanded` / `aria-controls`, close on Escape, and keep the biography usable without opening the rumors.

## Prototype 1: CRT discovery

Used by Routes A and B.

### Behavior

The existing CRT is the control. It receives only a very small focus/hover lift. Activating it reveals the rumor list in the dark biography territory. Route B temporarily gives the rumor list the main copy field so it is actually readable rather than appearing as tiny secondary text.

There is no `play`, `reel`, `coming soon`, instruction label or looping static.

### Why it fits

- uses an existing object rather than adding a prop
- Ian is already physically present on the screen
- curiosity is plausible without a `click here` instruction
- it inherits the old page's discoverability without copying the old hover behavior

### Risks

- the baked `PAUSE II` text can accidentally imply playback even though the control no longer does
- if the CRT glow becomes too visible, the page starts advertising its trick
- the accessible name necessarily reveals `rumors` to assistive technology before the visual reveal, which is acceptable because accessibility outranks preserving the joke from a screen reader

### Current judgment

**Winner on interaction logic.** It spends no new prop and keeps the joke secondary.

## Prototype 2: Found dresser evidence

Used by Route C.

### Behavior

A small semantic hotspot sits over existing dresser clutter. Hover/focus gives only a faint local lift. Activation reveals the historical rumor list as text in the right-hand dark field. No new receipt, key tag, note or object is added to the image.

### Why it fits

- tests a genuinely different discovery logic without changing the room
- lets the CRT remain purely a human trace
- keeps `The room is paid through Thursday.` as a throwaway line rather than turning it into a setup
- the discovered text can feel like something left in the room rather than a feature announced by the interface

### Risks

- highest escape-room risk of the three routes
- visual discoverability must remain low enough not to become a puzzle prompt
- mobile hotspot placement is more fragile because the crop changes
- a label such as `Found in Room 3` is already close to explaining the joke

### Current judgment

**Useful third-route test, not the current favorite.** Keep only if it feels accidental in rendered pixels.

## Rejected prototype: paid-through-Thursday seam

The earlier version made `The room is paid through Thursday.` clickable and revealed rumors under `Incidentals`.

Rejected because it turns the best deadpan line into an obvious setup and makes the motel joke feel authored twice. The line is stronger when it can simply sit there.

## Rejected prototype family: new physical evidence

Examples rejected: motel ledger, key tag, bedside note, receipt, postcard, phone message, room-service slip.

Reason: the Room 3 baseline already contains enough set dressing and narrative implication. Adding a new object primarily to hold rumors converts discovery into prop design and makes the motel theme more important than Ian.

## Rejected prototype family: generic overlays

Rejected: modal card, tooltip cloud, floating panel, dedicated `RUMORS` link, badge, instructions, hover-only reveal.

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
2. Found dresser evidence, only if it remains nearly invisible
3. Paid-through-Thursday seam: rejected
4. New physical evidence: rejected