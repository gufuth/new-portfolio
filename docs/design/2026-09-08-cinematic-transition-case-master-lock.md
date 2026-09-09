# Last Stop cinematic transition + case-study master lock

Status: active design/implementation lock on `work/cinematic-case-master-scooba-20260908`.

## Governing idea

Clicking a billboard is not entering another room. It is leaving the Last Stop browsing world and entering the work itself.

Landing = exterior proposition.
Work / More Work = physical browsing world.
Case study = evidence cut.

The transition must feel like an edit inside one film, not a website animation.

## Transition language

### Landing -> Work

Kill the old aperture-expansion reveal. It reads as a browser rectangle growing over the facade.

New cut:
1. The WORK surface receives a very small local exposure lift.
2. The entire image falls to black quickly, like an editorial cut at the end of a shot.
3. Work arrives fractionally underexposed.
4. A faint non-legible green practical contamination hangs at the left edge for less than half a second and dies.

No zoom. No camera flight. No rectangle opening. Rails remain fixed.

### Work <-> More Work

This is a physical move to another window bay in the same diner.

Use a short asymmetric occlusion/exposure cut, not a generic fade. The destination arrives with its own local color geography: Work carries a faint green return; More Work carries a faint red-magenta return. The color is residue, never a wipe or graphic effect.

### Billboard -> case

The billboard acknowledges selection locally. Neighboring boards recede slightly. Then the scene cuts hard through black into the campaign image at useful editorial scale.

Do not fly the billboard forward. Do not turn it into a browser panel. Do not animate a card into a page. The cut should feel like an editor choosing the next shot.

The destination first frame must immediately answer:
- what project is this;
- what was the problem / assignment;
- what did Ian own;
- what was the idea;
- what is the strongest factual proof available.

Reduced motion gets the same narrative order with immediate cuts and no decorative movement.

## Case-study visual system

The current cream-paper page is retired as the visual master. It remains historical scaffolding only.

The new master is a dark editorial evidence cut:
- black / brown-black / black-green field;
- dirty-cream type;
- mono/narrow type only for metadata, rails, labels and sourcing;
- strong grotesk/sans type for the actual argument and shipped writing;
- client media stays true color;
- large inactive areas remain dark;
- fine rules organize evidence without becoming dashboard chrome;
- body copy stays readable, short, and approximately 58-68 characters per line;
- no cards, glass panels, fake film-edit UI, paper distress, or themed archive props;
- no giant clever headline that delays basic hiring comprehension.

### First-screen hierarchy

1. Client / project identity.
2. One short authored hook or central proposition.
3. Assignment / problem.
4. Ian's role / ownership.
5. Named idea.
6. Strongest verified proof, when one exists.
7. Dominant campaign image.

A reviewer should understand the case before deciding whether to scroll.

### Natural extension of the billboard

The billboard is a distant physical object. The case page is the same work viewed without distance.

Therefore the case page should not imitate the billboard cabinet. It should remove the road, glass and hardware and let the campaign image occupy the frame. The Last Stop author remains only in the rails, darkness, typography, pacing and editing judgment.

## Porsche prototype

Porsche is the first master because its evidence arc is unusually clean:
finished impossible object -> brief/role/idea -> sketches/process -> physical build -> proof.

The page should feel closer to a design-film treatment than a portfolio template.

## Cuervo stress test

Cuervo proves the system can handle a relationship instead of a single campaign.

The page is two chapters:
1. Playamar.
2. Tradicional Cristalino.

One governing thought holds them together: make heritage feel current without pretending it is young.

Do not let the line `Nobody talks about the 250-year-old at the party.` become more important than understanding the case.

## SCOOBA

SCOOBA LOVE is now case 10.

Source truth from Drive establishes:
- it is an internal creative-evaluation system;
- it stress-tests work and helps teams `show the math`;
- the acronym criteria are Strategy, Client Goal, Ownable, One sentence, Buy, Achievable, LOVE;
- tone target was charming, funny, self-aware, memorable, not cutesy or solemn;
- documented team includes Katerina, Weston and Ian.

Until final approved illustration / film assets are harvested, SCOOBA should be represented honestly as a typographic/process-led case, not with invented campaign imagery.

Placement: case 10 belongs to MORE WORK as an additional case in the portfolio system, but do not fabricate a fifth physical billboard into the existing four-board photographic plate. Desktop discovery uses an understated physical-world-adjacent secondary index cue while mobile can expose the fifth case directly. A future approved Work 2 plate may physically add the fifth board if the composition earns it.

## Work / More Work legibility

The correct scale test is not a CSS-scaled campaign rectangle. The physical scene must stay intact.

Test a modest increase in apparent board size by changing scene crop/seat framing as a whole. Compare current vs approximately 6-9% tighter scene framing at 1440x900, 1366x768 and 1024x768. Reject if outer boards feel cramped or the lonely roadside spacing collapses.

The More Work cue must not be a polished CTA. Use a small operational/property marker at the edge of Work 1, supported by the explicit rail navigation. It should be discoverable on a second glance and read like something that existed before the portfolio.

## Release bar

Do not call these systems final until rendered QA proves:
- no transition reads as a rectangle/wipe/web animation;
- identity, role, idea and proof are visible immediately on Porsche and Cuervo;
- Work/More Work remain readable at laptop scale;
- keyboard and reduced-motion behavior remain intact;
- no horizontal overflow at 390 and 430 widths;
- SCOOBA route is navigable and truthful without fabricated assets.
