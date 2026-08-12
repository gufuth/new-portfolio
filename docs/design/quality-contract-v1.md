# QUALITY CONTRACT v1 — for any model, any session
> **STATUS: CURRENT / BINDING QUALITY LAW.** For current state and authority, use `../handoffs/2026-08-11-master-handoff-v6.md`. The references to v3 and old paths below are corrected by this banner and the hierarchy update.

2026-07-04. Model-agnostic operating contract for the Last Stop Diner build. This is not advice. It is the procedure that produced the current quality bar, extracted from working sessions so it no longer depends on which model is running. If the agent reading this follows the rituals below mechanically, the bar holds.

## THE LAW HIERARCHY (when anything conflicts, higher wins)
1. LOCKS (`../handoffs/2026-08-11-master-handoff-v6.md`, `filmframe-lock.md`, and current surface specs). Never relitigated silently. If a change genuinely requires touching a lock, STOP, name the lock, give the reason, and ask Ian. Read the reason before proposing the exception.
2. KILL LISTS (Visual Rules doc + handoff non-negotiables). These exist because each item already happened once and was killed. They are scars, not preferences.
3. CURRENT HANDOFF AND CURRENT SURFACE SPECS. `build-plan-v2.md` is historical and cannot set current sequence.
4. Taste and register (deadpan, dry, restrained; the room does the mythology, the words stay dry).

## THE SEVEN TESTS (run before showing Ian anything substantial)
1. STRANGER TEST: a recruiter with 40 seconds on a phone reaches Beast Games and understands Ian's role in under 15 seconds and 3 interactions. Any change that fails this loses, no matter how beautiful.
2. PHYSICS TEST: every light source visible or explained in frame; nothing attractive-but-impossible ships. Signs emit, glass sits between viewer and street, signs never grow.
3. SQUINT TEST: squint at the frame; the light pools must be countable and intentional (three in the motel room).
4. SAME-FILM TEST: flip between any two surfaces; grade, grain, and bars must read as consecutive frames from one negative.
5. ONE-MOTION TEST: each surface has at most ONE ambient motion source (landing: none; /work: the passing headlights; ABOUT: the TV). Interaction feedback is exempt. Nothing loops decoratively, ever.
6. WEIRDNESS-BUDGET TEST: each surface gets one impossibility (/work spends its on sign cabinets serving as a portfolio). A second oddity tips the world from "place that shouldn't exist but does" into "render."
7. HONESTY TEST: no placeholder content anywhere a visitor can see it lit up. Whetstone caught this once (P1, verify_v1.md); it does not get caught twice.

## AGENT BEHAVIORAL RULES (how to work, not what to build)
- AUDIT, DON'T ADMIRE. Every review names what is wrong or names that it went looking and found nothing. "Looks great" is not a review.
- MEASURE, DON'T EYEBALL. Sign footprints came from luminance-blob extraction, not visual guessing. Any geometry work: measure programmatically off the plate.
- VERIFY RENDERED PIXELS. After every change to a live page: reload with cache-bust (?v=N — Chrome caches the dev server hard), screenshot or probe with JS, confirm the change is actually on screen. Twice tonight the "verified" page was a stale cache.
- SHOW, DON'T ARGUE. When Ian is unsure about a direction (hero-as-light, bio placement), build the ten-minute demo instead of writing the persuasive paragraph. The demo settles it in one look.
- ONE CORRECTION BEATS ONE HUNDRED ADDITIONS. The default answer to "how do we improve this" is subtraction or a single fix, never a feature.
- SMALLER INTERPRETATION WINS. When a request is ambiguous between review and rewrite, review. Between tweak and rebuild, tweak.
- EVERY "ACCEPTED TRADE-OFF" GETS ATTACKED ONCE. Run Whetstone (or an equivalent adversarial pass) on anything substantial, and hand it your accepted trade-offs explicitly — the P1 that mattered most tonight was hiding inside one.
- NAME YOUR OWN MISSES. The bell shipped as a notification ding because the agent ported a sound without listening with the world's ears. When Ian catches drift, log what the miss was so the next agent inherits the scar.
- SAVE BEFORE ITERATING. Anything Ian says he wants to keep gets written to a named file immediately, confirmed, before the next change touches it.

## GENERATION RULES (images)
- Poison words never drive a prompt: cinematic, moody, glowing, atmospheric, dramatic, neon, noir, surreal, epic, dystopian, apocalyptic, dreamlike, hyper-detailed, richly textured, ultra-polished, concept art.
- The working idiom (proven on /work v4 and the ABOUT plates): open with "Photograph shot on 35mm film with visible natural grain," then spatial layout in plain nouns, then named practical light sources, then the negative closers "not digital, not glossy, not clean CGI. No people. No readable text inside [the space]."
- Pipeline is always: gpt-image-2 plate (blank surfaces where content will live) → _treat_film.py (the exact grain/grade/halation recipe — never a new recipe) → 16:9 crop → composite content as live or layered elements → shared treatment on top. One generation never solves atmosphere and editable content at once.
- Renders land in the ACTIVE plan.json corridor, not this folder. Move them after.

## SOUND RULES
Sound only from gestures or thresholds. Never on load, never ambient loops (the May ambient engine is archived with reasoning in filmframe/ — do not port it back). The bell belongs to the diner door only. Synthesis over samples, tunables commented. A sound switch ships before the site does.

## COPY RULES
The register is dry against a haunted world; the contrast IS the voice. No AI-slop vocabulary. Diner idiom over app idiom ("+ six more on the way", never "+6 more in the pipeline"). Case-study metadata never appears on signage. The bio stays under ~80 words. "The room is paid through Thursday" is the keeper line and the register benchmark.

## SESSION RITUALS
- OPEN: read `AGENTS.md`, the v6 handoff, then this contract, then inspect every relevant checked-in surface before touching anything. If a live host is available, verify it separately and say what was directly observed. State back to Ian what is locked and what the target is. Do not generate images by default.
- DURING: kill-list check on anything new; the seven tests before presenting; cache-bust every verification.
- CLOSE: update the handoff (new version if substantial), mirror to Drive, list every new file, name any lock added or challenged, and write down any miss that got caught.

## WHAT DRIFT LOOKS LIKE ON THIS PROJECT (all of these happened; all were killed)
Gray UI cards floating over warm plates. A green status dot (terminal grammar) in a gold world. Four instructions where zero were needed. A notification ding standing in for a brass bell. Placeholder titles glowing on real cabinets. Rooftop signage duplicating /work's grammar. Polaroids-on-a-wall as the first testimonials idea (the default AI answer). Atmosphere added to fix a problem that subtraction owned. If the current session's output resembles any of these, stop and reread the kill lists.

## THE ONE-SENTENCE THESIS
This site reaches 10/10 not by adding atmosphere but by making its three or four moving things behave with perfect physical manners — and this contract exists so that sentence survives every model that ever works on it.
