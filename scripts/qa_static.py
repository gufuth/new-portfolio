from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CASE_DIR = ROOT / "cases"
HTML_FILES = [ROOT / "index.html", ROOT / "work.html", ROOT / "more-work.html", ROOT / "about.html", ROOT / "hearsay.html", ROOT / "404.html", *sorted(CASE_DIR.glob("*.html"))]

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids: list[str] = []
        self.hrefs: list[str] = []
        self.h1 = 0
        self.images: list[dict[str, str | None]] = []
        self.visible_text: list[str] = []
        self._ignored_depth = 0
    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self._ignored_depth += 1
        d = dict(attrs)
        if "id" in d:
            self.ids.append(d["id"])
        if tag == "a" and "href" in d:
            self.hrefs.append(d["href"])
        if tag == "h1":
            self.h1 += 1
        if tag == "img":
            self.images.append({"src": d.get("src"), "alt": d.get("alt")})
    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self._ignored_depth:
            self._ignored_depth -= 1
    def handle_data(self, data):
        if not self._ignored_depth and data.strip():
            self.visible_text.append(data.strip())

errors: list[str] = []
redirects: dict[str, str] = {}
for line in (ROOT / "_redirects").read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    parts = line.split()
    if len(parts) >= 2:
        redirects[parts[0]] = parts[1]

for path in HTML_FILES:
    text = path.read_text(encoding="utf-8")
    p = AuditParser(); p.feed(text)
    rel = path.relative_to(ROOT)
    if p.h1 != 1 and path.name not in {"404.html"}:
        errors.append(f"{rel}: expected exactly one h1, found {p.h1}")
    duplicates = sorted({x for x in p.ids if p.ids.count(x) > 1})
    if duplicates:
        errors.append(f"{rel}: duplicate ids: {duplicates}")
    for img in p.images:
        if img["alt"] is None:
            errors.append(f"{rel}: image missing alt: {img['src']}")
    visible = " ".join(p.visible_text)
    if re.search(r"\[[^\]]{2,}\]", visible):
        errors.append(f"{rel}: bracketed placeholder-like visible copy present")
    for href in p.hrefs:
        if not href or href.startswith(("mailto:", "http://", "https://", "#", "tel:")):
            continue
        if href.startswith("/"):
            route = href.split("?",1)[0].split("#",1)[0]
            if route == "/":
                continue
            target = redirects.get(route)
            if target is None:
                errors.append(f"{rel}: internal clean route missing from _redirects: {route}")
            elif not (ROOT / target.lstrip("/")).exists():
                errors.append(f"{rel}: redirect target missing: {target}")
        else:
            target = (path.parent / href.split("?",1)[0].split("#",1)[0]).resolve()
            try:
                target.relative_to(ROOT)
            except ValueError:
                continue
            if href and not target.exists():
                errors.append(f"{rel}: relative target missing: {href}")

for index in (ROOT / "work.html", ROOT / "more-work.html"):
    text = index.read_text(encoding="utf-8").lower()
    if ".gif" in text:
        errors.append(f"{index.name}: animated GIF present on billboard index")

work = (ROOT / "work.html").read_text(encoding="utf-8")
more = (ROOT / "more-work.html").read_text(encoding="utf-8")
if work.count('class="billboard') != 5:
    errors.append("work.html: expected 5 desktop billboards")
if more.count('class="billboard') != 4:
    errors.append("more-work.html: expected 4 desktop billboards")
if work.count('class="mobile-card') != 5:
    errors.append("work.html: expected 5 mobile case cards")
if more.count('class="mobile-card') != 4:
    errors.append("more-work.html: expected 4 mobile case cards")

landing = (ROOT / "index.html").read_text(encoding="utf-8")
if "getItem('lsd_sound')==='on'" not in landing:
    errors.append("index.html: first-visit sound is not explicitly opt-in")
if "Sound · Off" not in landing:
    errors.append("index.html: sound control does not start visibly OFF")

hearsay = (ROOT / "hearsay.html").read_text(encoding="utf-8")
for forbidden in ("Point at a frame", "hearsay.webp", "class=\"spot\""):
    if forbidden in hearsay:
        errors.append(f"hearsay.html: rejected historical implementation residue: {forbidden}")
for required in ("sweets.jpg", "neighbor.jpg", "mother.jpg", "vidal.jpg", "ex.jpg"):
    if required not in hearsay:
        errors.append(f"hearsay.html: missing real portrait {required}")

contact_surfaces = [ROOT / "work.html", ROOT / "more-work.html", ROOT / "hearsay.html", ROOT / "about.html", *sorted(CASE_DIR.glob("*.html"))]
for path in contact_surfaces:
    text = path.read_text(encoding="utf-8")
    if "mailto:Ianr.luna@gmail.com" not in text:
        errors.append(f"{path.relative_to(ROOT)}: direct Contact path missing")

if errors:
    print("STATIC QA FAILED")
    for error in errors:
        print(" -", error)
    sys.exit(1)
print(f"STATIC QA PASSED: {len(HTML_FILES)} HTML surfaces checked; routes, IDs, alts, visible placeholders, case counts, billboard motion, opt-in sound, Hearsay direction and direct Contact are clean.")
