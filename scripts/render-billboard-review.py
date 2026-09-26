"""Render review/billboards/{work,more-work}.html at the QA viewports and crop every board.

python scripts/render-billboard-review.py OUT_DIR [--base http://localhost:8765]
Writes <page>-<w>x<h>.png, <page>-<w>x<h>-<case>.png (1:1 board crops) and checks.json.
"""

import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

VIEWPORTS = [(1440, 900), (1366, 768), (1024, 768), (390, 844)]
PAGES = ["work", "more-work"]
EXPECT = {
    "nike-sb-panda-pigeon",
    "virgin-galactic-unity-22",
    "porsche-lucasfilm-designer-alliance",
    "selsun-blue-dan-driff",
    "moneylion-beast-games",
    "alita-te-connectivity",
    "jose-cuervo",
    "outdoor-voices",
    "the-atlantic",
    "scooba-love",
}


def main():
    out = Path(sys.argv[1])
    base = (
        sys.argv[sys.argv.index("--base") + 1]
        if "--base" in sys.argv
        else "http://localhost:8765"
    )
    out.mkdir(parents=True, exist_ok=True)
    pages = sys.argv[sys.argv.index("--pages") + 1].split(",") if "--pages" in sys.argv else PAGES
    checks = []
    with sync_playwright() as p:
        br = p.chromium.launch()
        for w, h in VIEWPORTS:
            ctx = br.new_context(
                viewport={"width": w, "height": h},
                device_scale_factor=1,
                is_mobile=w < 700,
                has_touch=w < 700,
            )
            pg = ctx.new_page()
            for name in pages:
                pg.goto(
                    f"{base}/review/billboards/{name}.html?v=bb1",
                    wait_until="networkidle",
                )
                pg.wait_for_timeout(600)
                shot = out / f"{name}-{w}x{h}.png"
                pg.screenshot(path=str(shot))
                info = pg.evaluate("""() => {
                  const bg = getComputedStyle(document.querySelector('.scene-stage')).backgroundImage;
                  const boards = [...document.querySelectorAll('a.billboard')].map(a => {
                    const r = a.getBoundingClientRect();
                    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.4;
                    const hit = document.elementFromPoint(cx, cy);
                    return {href: a.getAttribute('href'), label: a.getAttribute('aria-label'),
                            box: [r.left, r.top, r.width, r.height],
                            hit: hit ? (hit.closest('a') || {}).getAttribute?.('href') || null : null,
                            visible: r.width > 0 && r.height > 0};
                  });
                  return {bg, boards, overflowX: document.documentElement.scrollWidth > innerWidth,
                          mobileCards: [...document.querySelectorAll('.mobile-card')].filter(c => c.offsetParent).length};
                }""")
                bad = []
                if w >= 700:
                    if "physical-v" not in info["bg"]:
                        bad.append("new plate not applied")
                    for b in info["boards"]:
                        if b["hit"] != b["href"]:
                            bad.append(f"hit-test {b['href']} -> {b['hit']}")
                        slug = b["href"].strip("/").split("/")[-1]
                        if slug not in EXPECT:
                            bad.append(f"unexpected href {b['href']}")
                        x, y, bw, bh = b["box"]
                        pg.screenshot(
                            path=str(out / f"{name}-{w}x{h}-{slug}.png"),
                            clip={
                                "x": max(0, x - 6),
                                "y": max(0, y - 6),
                                "width": bw + 12,
                                "height": bh + 12,
                            },
                        )
                if info["overflowX"]:
                    bad.append("horizontal overflow")
                checks.append(
                    {
                        "page": name,
                        "viewport": [w, h],
                        "bg": info["bg"],
                        "boards": info["boards"],
                        "mobile_cards_visible": info["mobileCards"],
                        "problems": bad,
                    }
                )
                print(name, w, h, "OK" if not bad else bad)
            ctx.close()
        br.close()
    (out / "checks.json").write_text(json.dumps(checks, indent=1, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    main()
