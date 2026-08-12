# HEARSAY testimonials — handoff

Corridor: `pz_portfolio_last_stop_diner`. This subfolder is scoped to one thread of work inside that corridor: designing and generating the HEARSAY (testimonials) wall for the Last Stop Diner portfolio site. Read this file first. Everything referenced below lives in this folder unless a path says otherwise.

Last updated: 2026-07-09.

## 1. Where this stands right now

- **Venue is decided and locked:** wall of fame (framed photos on a diner wall). This reopens and reverses an earlier decision — see `hearsay_concepts_v1.md` (copied into this folder, canonical original one level up), which had rejected the wall as "the default AI answer" and recommended a payphone/voicemail device instead. Operator override, 2026-07-07/08: "It's just clear and simple and it gets the jokes across." Payphone and the booth-wallbox alternative are fully designed in that file if the wall ever gets reconsidered, but it isn't in question right now.
- **Current best image: `renders/hearsay_wall_v7_treated.png`.** This is the plate to build the real page from.
- **Captions are not finalized.** A proof-of-concept exists (`captions/hearsay_wall_v6_captioned_preview3.png`) showing the real copy composited onto an earlier plate (v6, not v7) in handwriting-style fonts. It proves the direction but is not production quality — see Section 5.
- **Nothing is wired into the live site yet.** This is still a floating concept plate. The actual HEARSAY page (HTML) hasn't been built. When it is, it should follow the pattern already used by `about_live.html`: an atmospheric image plate with real, live HTML/CSS text positioned on top — never text baked into the image. This is deliberate, not a shortcut; see Section 4.

## 2. The real copy (already final, no writing needed)

Confirmed live on **ianrluna.com/testimonials** on 2026-07-08, word for word:

1. "That boy good." — Sweets
2. "He's never caused any problems in the building." — Neighbor
3. "The sweetest boy you'll ever meet." — My mother
4. "A creative genius second to none." — Gore Vidal
5. "Five stars." — Ex girlfriend

This is the operator's actual existing copy, not a placeholder and not something generated during this session. Do not rewrite it. If more testimonials get added later, match this register: short, deadpan, escalating from mundane (neighbor) to absurd (Gore Vidal) to a final flat joke (ex-girlfriend "five stars").

## 3. The photos are placeholders — explicit operator instruction

Every photo in every render so far is a generic AI-generated stranger. **Operator has explicitly said the final photos will be supplied by him later, and placeholder genericness must not count against the design now.** Do not score, critique, or iterate on photo-subject specificity until real photos are in hand. When they arrive, they replace the placeholders directly in the existing frame composition — this should not require a full re-render of the whole scene, just compositing real photos into the established frames (or re-rendering with the real photos as reference/IP-adapter input if a from-scratch regeneration is preferred at that time).

## 4. Why captions are HTML text, not baked into the image

Early renders baked the captions directly into the AI-generated image as part of the prompt. This was abandoned deliberately, not by accident:

- AI image models render angled or small text unreliably — letters warp and smear, especially on a wall shot at any camera angle.
- Even shot dead-on, baked text is a gamble every single render.
- The site already has an established, better pattern: the `/work` page's project index and the About page's bio copy are both **real HTML text overlaid on an atmospheric image plate**, not text drawn into the image. This is also an accessibility win (screen readers, no fixed resolution ceiling) that an outside design audit flagged early in this corridor and that never got explicitly adopted until this thread forced the issue.

So the plates (v1–v7) are all generated with **blank cream mat strips** at the bottom third of each frame — reserved, intentional blank space for a nameplate — and the actual caption text is meant to be added as a live HTML/CSS layer positioned over those blank strips when the real page gets built. The `.png` composites in `captions/` are flat-image proof-of-concepts only, built to answer "what will this look like," not the final implementation.

## 5. Captions — open work, not done

Two problems surfaced and only one is fixed:

- **Fixed:** font family. First proof-of-concept used a monospace/typewriter font (matching the site's frame-counter/meta-text convention in the FilmFrame bars). Operator correctly called this wrong: typewriter belongs to the film apparatus layer (frame counters, timestamp bars), handwriting belongs to the people who supposedly wrote these notes on a real diner wall. Switched to handwriting-style fonts (Windows Segoe Print / Segoe Script / Lucida Handwriting fallback chain).
- **Not fixed:** legibility and variety. The proof-of-concept (`captions/hearsay_wall_v6_captioned_preview3.png`) only cycles through 3 font "hands" across 5 captions (two pairs share a font), and even after a fix pass the smallest one (Neighbor) is barely legible. **Operator wants all 5 captions in genuinely distinct handwriting, each one appropriate in character to its speaker** (e.g., Sweets casual/loose, Neighbor terse/practical, My mother warm and rounded, Gore Vidal elegant cursive, Ex girlfriend quick and breezy), and all of them fully legible, no exceptions. This has not been attempted yet — the existing preview only varies font family, not character or legibility per-caption.
- Also unresolved: the caption proof-of-concept was built against **v6**, not the current-best **v7**. The two plates have different frame layouts/positions in places, so the pixel coordinates in `scripts/_composite_hearsay_captions.py` do not line up with v7 and would need re-measuring, or (better) this whole approach should just be skipped in favor of building it directly as real HTML/CSS against the final page, per Section 4.

## 6. Full version history — what changed and why, in order

All renders used `gpt-image-2` (OpenAI) via `dispatch_openai_image.py`, quality=high, 1536x1024, then a local grain/grade treatment pass (PIL, no AI) to match the site's other locked plates. See `scripts/` for the exact code.

| Version | What changed | Why | Operator verdict |
|---|---|---|---|
| v1 | First render: taped/pinned polaroids, green neon accent | Matched the operator's reference mockup style | Green was wrong — green is `/work`'s signature color (the WORK sign), not HEARSAY's |
| v2 | Same tape/pin style, neon corrected to pink/magenta | Pink matches the HEARSAY door on the landing plate | Correct color, but shot at an angle — caused baked-in caption text to warp/smear |
| v3 | Frontal dead-on camera angle, blank caption cards (no baked text), heavier grain (`_treat_film_heavy.py` created here) | Fixed the angle-causes-bad-text problem; moved to the HTML-overlay caption plan (Section 4) | "Kitsch... too orderly... dead, lifeless, not interesting." Tape+pins in an even grid read as costume-vintage, not lived-in |
| v4 | Switched to real mismatched picture frames (5, no two alike), salon-style tight staggered hang | Direct response to the kitsch/orderly critique | "No room for the copy" — frames were matted edge-to-edge with the photo, zero blank space for captions |
| v5 | Added old-fashioned portrait matting: photo in top two-thirds, blank cream strip across bottom third reserved for a nameplate; real gaps between frames | Fixed the room-for-copy problem while keeping the frame variety | Compared unfavorably to the original operator reference: "doesn't it have more personality than what you're giving me?" |
| v6 | Mixed photo treatment (b&w + faded color, not one uniform sepia wash); two frames overlap slightly with a bleached "ghost" photo peeking out from behind one (implies something was replaced over the years); one photo has a creased/torn corner | Diagnosed root cause: every prior fix was the "safe" fix (frontal angle, formal frames, even spacing) and each one sanded off exactly the imperfection that reads as lived-in. This pass explicitly re-anchored on the operator's original reference image instead of just reacting to the last complaint | Approved as best at the time. Also cross-checked against other models here — see Section 7 |
| v7 (**current best**) | Added diner-specific grounding objects: neon fragment now legibly reads "...RSAY" (echoes the site's own HEARSAY signage from the landing plate) instead of an anonymous pink glow; a chrome diner ticket-spike with curled old order tickets and a worn matchbook resting on a shelf below the frames | Response to an explicit VK Creative pass (Section 8) that scored Differentiation at 2/5: the panel could have been dropped into any generic "vintage diner aesthetic" mood board with nothing tying it to this specific place | Confirmed as a real improvement — "undoubtedly us or me" achieved through specific objects, not photo content (which stays placeholder per Section 3) |

Note: the torn-corner photo detail from v6 did not carry into v7's generation. Not flagged as a problem yet, but worth re-adding if a future pass revisits this plate.

## 7. Cross-model comparison (don't skip this if reconsidering the model choice)

Operator explicitly asked not to default to one image model. Before locking v6/v7, ran the same brief through two alternatives:

- **Imagen 4 Ultra** (`dispatch_imagen.py`, `renders/hearsay_wall_imagen_v1.png`): genuinely photorealistic, but ignored nearly all the wear/history/asymmetry instructions in the prompt — came back clean, evenly spaced, studio-lit. Wrong direction for this specific brief. Would be the right pick for a brief that wants pure photorealism with no atmosphere/wear requirement and no baked text.
- **Local Flux2 Klein** (`dispatch_visual_pipeline.py`, ComfyUI, `pz_house_style` LoRA, `grainy_35mm` film profile): **timed out after 600 seconds.** GPU VRAM was pinned at ~11/12GB in use the entire time (checked via `--check-health` mid-run), so it wasn't crashed, just either queue-stuck or too heavy a workflow for available memory. Not resolved this session — flagged as a separate infrastructure question, not a creative one. If picking this back up: check VRAM contention with other running jobs before re-firing, and consider a lighter workflow/resolution as a first diagnostic step.

Verdict: gpt-image-2 stays the right model for this specific brief. This is a capability finding (it's the only one of the three that actually followed the aging/wear/history instructions), not a default-to-familiar habit — the comparison was run and the result was legitimate.

## 8. VK Creative pass — applied to a visual panel, not copy (unusual use, worth noting)

Operator asked for an honest "VK" gut-check on why the panel felt "plain Jane" despite the composition fixes. VK Creative's 4 dimensions (Clarity, Specificity, Differentiation, Emotional Resonance — see `vk_auditor.md` / `VK_CREATIVE.md`) were applied to the image itself, which is a non-standard use (VK is built for copy), adapted in spirit rather than by the literal mechanism:

- Clarity: 4 — reads instantly as a wall of fame.
- Specificity: 2 — photo subjects are generic posed portraits, not peculiar candid human moments. **Operator ruling: do not score this against placeholders (Section 3).**
- Differentiation: 2 — the actionable finding. Fixed in v7 (Section 6, Section 1).
- Emotional Resonance: 2 — image alone (without reading captions) doesn't land a feeling yet. Not directly addressed by v7; may resolve once real photos + real legible captions are both in place, may need its own pass.

Verdict at time of audit: REVISE. Differentiation is the only dimension acted on since (see v7). Specificity is placeholder-gated per operator instruction. Emotional Resonance is still open and not yet worked.

## 9. Mistakes made this session — read before repeating

- **Wasted ~$0.12 on two real paid renders** before catching a bug: `dispatch_openai_image.py` checks `plan.json.status == "open"` literally (not `"active"`) before it will save a render. The API call still fires and gets billed even when the save step later fails on this check — so the mistake isn't free just because the file didn't save. Fixed by correcting the status value via `plan_json_write.py`. If a future session sees "no active corridor" errors from an image dispatcher, check the exact string value of `plan.json.status` first, don't assume the corridor field alone is the problem.
- **Repeatedly made the "safe" fix instead of the true one** (v3 through v5): frontal camera angle fixed a real legibility problem but was also the safest possible framing; formal picture frames fixed a real kitsch problem but were also the safest possible object; even wide mats fixed a real "no room for text" problem but were also the safest possible layout. Each fix solved the stated complaint and quietly drained personality at the same time, because nothing was checking new versions against the original creative reference, only against the most recent complaint. The general lesson: any fix needs a second test after it passes the stated problem — does it still look like it has a history, or did solving the complaint flatten it.
- **Reused the site's typewriter font reflexively** for testimonial captions without asking whether it was the right register for this specific object. It wasn't — see Section 5.
- **First caption-compositing pass had a placement bug** (a two-line caption overlapping its photo instead of sitting in the blank mat) from eyeballing pixel coordinates on a flat image rather than measuring actual frame boundaries. Second pass fixed the specific bug but this whole approach is a stopgap — see Section 4 and 5 on why the real fix is live HTML, not better pixel-guessing.
- **Local Flux2 attempt cost about 10 minutes of session time for zero usable output.** No time-box was set going in. If trying local generation again, decide up front how long to wait before giving up and set that expectation before firing.
- **Images didn't reliably display in the operator's client** during this session even when generation succeeded. `mcp__cowork__present_files` (explicit file cards) worked more reliably than inline image display from the Read tool. Default to `present_files` for anything the operator needs to actually see, don't assume inline rendering landed.

## 10. What the operator likes / dislikes — read before designing anything else on this site

**Likes / wants:**
- Real personality, imperfection, and a sense of accumulated history over anything that reads clean or orderly.
- Real mismatched objects (picture frames, not taped scrapbook items).
- Design elements that are undoubtedly, unmistakably tied to this specific diner and this specific person — not swappable into a generic mood board.
- Full legibility on any text, always, no compromise.
- Honest, critical feedback when asked for it (explicitly requested a VK pass rather than reassurance).
- Seeing actual rendered output, not descriptions of output — confirm files are actually viewable, don't just say a task is done.

**Dislikes:**
- Tape-and-pin "scrapbook" styling — reads as kitsch/costume-vintage.
- Perfectly even grid spacing or symmetric layouts — reads as designed rather than grown/lived-in.
- Typewriter or monospace fonts used for anything that's supposed to be in a human voice (that register is reserved for the film-apparatus layer: frame counters, timestamp bars).
- Being told something is ready when he can't independently verify it himself.

## 11. Known gap in this handoff

**The two original reference mockup images the operator shared at the start of this thread are not included in `references/`.** They were shared as inline chat attachments, and this session's sandbox has no file-system access to chat-uploaded images that aren't explicitly saved to the mounted project folder — there is no accessible copy to pull from. If those reference images matter for a future session, the operator will need to re-share them directly into this folder (or re-upload them in a session that can save them to disk). Description for reference, from memory of the conversation: a diner-adjacent wall with photos taped/pinned to wood paneling, mixed formats (black-and-white and color), a blank/faded "ghost" polaroid peeking out from behind another, a torn corner on one photo, green neon in one version — this is what originally established that photo-content variety and physical wear were the missing ingredients, and is the reference v6/v7 were checked against in Section 6.

## 12. Suggested next steps, in order

1. Decide: fix captions as a better flat-image composite for review purposes, or skip straight to building the real HTML/CSS caption layer against v7 (recommended — avoids doing the positioning work twice).
2. Build 5 distinct, fully legible, per-character handwriting treatments for the captions (Section 5).
3. Build the actual HEARSAY page (`hearsay_live.html` or similar, following `about_live.html`'s plate-plus-live-text pattern) and wire it into `_build_site.py` / the Netlify deploy.
4. When real photos are supplied, composite them into the v7 frame layout (or re-render with them as reference).
5. Optional: revisit Emotional Resonance (Section 8) once photos + captions are both real — may resolve on its own, may need its own pass.
6. Optional/separate: debug the local Flux2 timeout (Section 7) if local generation capacity matters for other parts of the site later — this is infrastructure work, not creative work, and shouldn't block anything above.


---
**2026-07-10 UPDATE: see HANDOFF_ADDENDUM_v8.md** — v8 rendered (two seeds, a/b), exact photo sources found on ianrluna.com/testimonials, Gemini mockups described in references/, raw-vs-narrative numbering trap documented.
