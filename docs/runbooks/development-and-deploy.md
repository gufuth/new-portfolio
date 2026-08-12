# Development and deployment runbook

> **STATUS: CURRENT FOR THE CHECKED-IN STATIC REPOSITORY.** Deployment remains blocked by `IAN DECISION REQUIRED` items below.

## Verified repository shape

- Runtime pages: `index.html`, `work.html`, `about.html`, `hearsay.html`, `404.html`
- Runtime assets: root `*.webp`, `og_*.png`, `favicon.png`
- Implementation: plain HTML, inline CSS, inline vanilla JavaScript
- Checked-in build system: none
- Checked-in package manager manifest: none
- Checked-in deployment configuration: none
- Referenced legacy `_serve.py`, `_build_site.py`, and `site/` directory: absent

## Local serving

From the repository root:

```bash
python -m http.server 8791 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8791/index.html?v=YYYYMMDDHHMM
```

Use a changing query string after any implementation or asset edit because cached plates can make an old render look current.

If `python` is unavailable, the replacement command must be verified in that environment before it is added here.

## Runtime ownership

- Root HTML and root assets are what the checked-in pages load.
- `docs/renders/06_Site_WebP_Finals/` contains archival copies. They are byte-identical to the root WebPs as of 2026-08-11.
- Other `docs/renders/` files are references, explorations, or verification evidence. They are not runtime files unless explicitly promoted through an approved change.

## Safe change procedure

1. Read `AGENTS.md` and the current handoff.
2. Confirm the requested scope and active locks.
3. Create a task branch.
4. Record the pre-change Git status and relevant file hashes.
5. Change only authorized files.
6. Serve from the repository root with a cache-busted URL.
7. Verify rendered pixels at desktop and mobile widths.
8. Check keyboard/focus behavior, reduced-motion behavior, console errors, navigation targets, metadata, and asset loading.
9. Compare `git diff --name-only` and `git diff --stat` to the approved scope.
10. Commit only after the verification record is complete.

Source inspection is not a rendered-pixel check. Do not call a page verified based only on HTML, CSS, JavaScript, an old screenshot, or an archive image.

## Asset replacement gate

Before replacing a root plate:

- confirm Ian approval for the exact source image;
- preserve the source and previous runtime file;
- confirm dimensions and crop behavior;
- keep editable content out of generated plates where project law requires layering;
- re-measure interaction geometry against the final pixels;
- update any archive copy deliberately;
- verify all affected viewport ratios and reduced-motion states.

The July 15 `/work` render fails this gate today because it is **UNAPPROVED / NOT DEPLOYED**, uses different dimensions, contains baked typography, and has no measured production registration.

## Deployment

Do not deploy from this runbook yet.

Current evidence conflicts:

- Root OG metadata points to `https://last-stop-diner.netlify.app/`.
- July handoff history records Netlify CLI/MCP deployment.
- May decision documents prescribe Cloudflare Pages and an Astro build that are not present in this repository.
- No `netlify.toml`, Wrangler configuration, CI workflow, or verified deploy script is checked in.

Therefore:

- production host: `IAN DECISION REQUIRED`
- deployment command: `IAN DECISION REQUIRED`
- production domain: `IAN DECISION REQUIRED`
- rollback procedure at the host: `UNVERIFIED / NOT APPROVED`

Once Ian selects the production lane, add only the verified commands, account-independent project identifiers, preview procedure, production approval gate, and rollback steps. Do not store credentials in the repository.

## Pre-ship gates

- Current case copy is bracket-free, sourced, credited, and re-reviewed.
- `/work` cast and case routing match the approved manifest.
- Stranger, physics, squint, same-film, one-motion, weirdness-budget, and honesty tests pass.
- Desktop and mobile rendered-pixel checks pass.
- Keyboard and focus order pass.
- Reduced-motion behavior passes.
- Cross-browser checks cover current Safari, Firefox, and Chromium targets.
- No unexpected console errors or missing assets.
- Performance and accessibility audits are recorded.
- OG cards, metadata, domain, host, and deploy target are Ian-approved.

