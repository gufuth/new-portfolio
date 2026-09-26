"""Rights gate: fails (exit 1) if any public page references an asset whose rights status is not
CONFIRMED or OWNED in docs/rights/rights_register.csv. Mirrors the Drive sheet
'03 — RIGHTS REGISTER'; update the CSV when Ian confirms. Runs in CI before any production deploy.
Usage: python scripts/rights_gate.py [--include-review]"""
import csv, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
OK = {"CONFIRMED", "OWNED"}
reg = {r["asset"]: r for r in csv.DictReader(open(ROOT / "docs/rights/rights_register.csv", encoding="utf-8"))}
pages = [p for p in ROOT.rglob("*.html") if not any(s in p.parts for s in (".git", "node_modules", "reports", "docs", "artifacts"))]
if "--include-review" not in sys.argv:
    pages = [p for p in pages if "review" not in p.parts]
bad = {}
for p in pages:
    text = p.read_text(encoding="utf-8", errors="ignore")
    for asset, row in reg.items():
        needle = asset.rstrip("/")
        if needle and re.search(re.escape(needle), text) and row["status"] not in OK:
            bad.setdefault(asset, set()).add(str(p.relative_to(ROOT)))
if bad:
    print(f"RIGHTS GATE: BLOCKED — {len(bad)} unconfirmed asset(s) on public pages")
    for a, ps in sorted(bad.items()):
        print(f"  {a} [{reg[a]['status']}] used by {', '.join(sorted(ps)[:3])}{' …' if len(ps) > 3 else ''}")
    sys.exit(1)
print("RIGHTS GATE: PASS"); sys.exit(0)
