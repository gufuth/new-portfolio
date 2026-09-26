"""Launch check (step 13 of the launch plan). Run before any production publish.

Checks every public route (from _redirects) at 1440, 1024, 430 and 390 px wide:
  - page returns 200, no failed requests (>=400), no console errors
  - no horizontal scroll
  - every <img> has an alt attribute
  - rail links / buttons are at least 24x24 px (WCAG 2.2 target size)
  - no placeholder or unverified proof text, no public "Last Stop" naming
  - still works with reduced motion
Writes reports/launch_check_<timestamp>.md + .json. Exit 0 = all pass, 1 = something failed.

Usage:
  python scripts/launch_check.py                      # serves this folder locally (Netlify-style rewrites)
  python scripts/launch_check.py --base-url https://integration--last-stop-diner-staging.netlify.app
  python scripts/launch_check.py --lighthouse         # also runs Lighthouse (needs --base-url and npx)

Core Web Vitals (LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1) need a deployed URL; use --lighthouse.
"""

from __future__ import annotations

import argparse
import datetime as dt
import functools
import http.server
import json
import re
import socketserver
import subprocess
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
WIDTHS = [(1440, 900), (1024, 768), (430, 932), (390, 844)]
FORBIDDEN = [
    (re.compile(r"Temporary proof value", re.I), "placeholder proof note"),
    (re.compile(r"\byear\s*/\s*category to verify\b", re.I), "unverified award line"),
    (re.compile(r"\bXX[MK]\+?\b"), "placeholder metric"),
    (re.compile(r"\bLast Stop\b", re.I), "public 'Last Stop' naming"),
    (re.compile(r"\bto confirm before launch\b", re.I), "unresolved production note"),
    (re.compile(r"\blorem ipsum\b", re.I), "filler text"),
]
SKIP_PREFIXES = ("/review/",)


def routes() -> list[str]:
    out = ["/"]
    for line in (ROOT / "_redirects").read_text(encoding="utf-8").splitlines():
        parts = line.split()
        if (
            len(parts) >= 3
            and parts[2] == "200"
            and not parts[0].startswith(SKIP_PREFIXES)
        ):
            out.append(parts[0])
    return out


class RewriteHandler(http.server.SimpleHTTPRequestHandler):
    rewrites: dict[str, str] = {}

    def log_message(self, *_):  # keep the report clean
        pass

    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0]
        target = self.rewrites.get(clean)
        return super().translate_path(target or path)


def serve_local() -> tuple[str, socketserver.TCPServer]:
    rw = {}
    for line in (ROOT / "_redirects").read_text(encoding="utf-8").splitlines():
        p = line.split()
        if len(p) >= 3 and p[2] == "200":
            rw[p[0]] = p[1]
    RewriteHandler.rewrites = rw
    handler = functools.partial(RewriteHandler, directory=str(ROOT))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{httpd.server_address[1]}", httpd


def check_page(page, url: str) -> list[str]:
    problems: list[str] = []
    console_errors: list[str] = []
    failed: list[str] = []
    page.on(
        "console",
        lambda m: console_errors.append(m.text) if m.type == "error" else None,
    )
    page.on(
        "response",
        lambda r: failed.append(f"{r.status} {r.url}") if r.status >= 400 else None,
    )
    resp = page.goto(url, wait_until="networkidle")
    if not resp or resp.status != 200:
        problems.append(f"status {resp.status if resp else 'none'}")
    page.wait_for_timeout(600)
    problems += [f"failed request: {f}" for f in failed]
    problems += [f"console error: {c[:160]}" for c in console_errors]
    if page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"):
        problems.append("horizontal scroll")
    missing_alt = page.evaluate(
        "[...document.images].filter(i=>!i.hasAttribute('alt')).map(i=>i.src)"
    )
    problems += [f"img without alt: {s}" for s in missing_alt]
    small = page.evaluate(
        "[...document.querySelectorAll('.rail a,.filmbar button,.pager a')]"
        ".filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.width<24||r.height<24)})"
        ".map(e=>e.textContent.trim())"
    )
    problems += [f"target under 24px: {s}" for s in small]
    text = page.evaluate("document.body.innerText")
    for rx, label in FORBIDDEN:
        m = rx.search(text)
        if m:
            problems.append(f"{label}: '{m.group(0)}'")
    return problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url")
    ap.add_argument("--lighthouse", action="store_true")
    ap.add_argument("--paths", nargs="+", help="check exactly these paths (e.g. /review/cases-2-1/nike.html); written to the report as the coverage manifest")
    a = ap.parse_args()
    httpd = None
    base = a.base_url.rstrip("/") if a.base_url else None
    if not base:
        base, httpd = serve_local()
    results: dict[str, dict[str, list[str]]] = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for w, h in WIDTHS:
            for motion in (
                ("no-preference", "reduce") if w == 1440 else ("no-preference",)
            ):
                ctx = browser.new_context(
                    viewport={"width": w, "height": h}, reduced_motion=motion
                )
                for r in (a.paths or routes()):
                    page = ctx.new_page()
                    key = f"{w}px{' reduced-motion' if motion == 'reduce' else ''}"
                    results.setdefault(r, {})[key] = check_page(page, base + r)
                    page.close()
                ctx.close()
        browser.close()
    lighthouse = {}
    if a.lighthouse and a.base_url:
        for r in ("/", "/work/", "/work/porsche-lucasfilm-designer-alliance/"):
            out = subprocess.run(
                [
                    "npx",
                    "--yes",
                    "lighthouse",
                    base + r,
                    "--quiet",
                    "--output=json",
                    "--only-categories=performance,accessibility",
                    "--chrome-flags=--headless",
                ],
                capture_output=True,
                text=True,
                shell=sys.platform == "win32",
            )
            try:
                j = json.loads(out.stdout)
                aud = j["audits"]
                lighthouse[r] = {
                    "LCP_s": round(
                        aud["largest-contentful-paint"]["numericValue"] / 1000, 2
                    ),
                    "CLS": round(aud["cumulative-layout-shift"]["numericValue"], 3),
                    "TBT_ms (INP proxy)": round(
                        aud["total-blocking-time"]["numericValue"]
                    ),
                    "a11y_score": j["categories"]["accessibility"]["score"],
                }
            except Exception as exc:  # report, never hide
                lighthouse[r] = {"error": str(exc)[:200]}
    if httpd:
        httpd.shutdown()
    fails = {r: {k: v for k, v in d.items() if v} for r, d in results.items()}
    fails = {r: d for r, d in fails.items() if d}
    stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    rep = ROOT / "reports"
    rep.mkdir(exist_ok=True)
    (rep / f"launch_check_{stamp}.json").write_text(
        json.dumps(
            {"base": base, "results": results, "lighthouse": lighthouse}, indent=1
        ),
        encoding="utf-8",
    )
    lines = [
        f"# Launch check {stamp}",
        "",
        f"Base: {base}",
        f"Checked paths (manifest): {', '.join(results)}",
        f"Pages: {len(results)} · widths: {', '.join(str(w) for w, _ in WIDTHS)} (+ reduced motion at 1440)",
        "",
    ]
    lines.append(
        "## Verdict: "
        + (
            "PASS"
            if not fails
            else f"FAIL ({sum(len(v) for d in fails.values() for v in d.values())} problems)"
        )
    )
    for r, d in fails.items():
        lines.append(f"\n### {r}")
        for k, v in d.items():
            for item in sorted(set(v)):
                lines.append(f"- [{k}] {item}")
    if lighthouse:
        lines.append("\n## Lighthouse")
        for r, d in lighthouse.items():
            lines.append(f"- {r}: {d}")
    (rep / f"launch_check_{stamp}.md").write_text(
        "\n".join(lines) + "\n", encoding="utf-8"
    )
    print("\n".join(lines[:8]))
    print(f"report: reports/launch_check_{stamp}.md")
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
