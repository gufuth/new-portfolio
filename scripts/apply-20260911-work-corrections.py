from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_required(path, old, new):
    p = ROOT / path
    text = p.read_text()
    if old not in text:
        raise RuntimeError(f'Expected text not found in {path}: {old[:80]!r}')
    p.write_text(text.replace(old, new))


# 1. SCOOBA is a More Work case. Fix origin/return classification.
replace_required(
    'tour-runtime.js',
    "var moreCaseIds=['alita-te-connectivity','jose-cuervo','outdoor-voices','the-atlantic'];",
    "var moreCaseIds=['alita-te-connectivity','jose-cuervo','outdoor-voices','the-atlantic','scooba-love'];",
)
replace_required(
    'tour-runtime.js',
    "atlantic:'the-atlantic'};",
    "atlantic:'the-atlantic',scooba:'scooba-love'};",
)

# 2. Match the fifth clickable region to the equal-size physical cabinet.
replace_required(
    'work-system.css',
    "/* More Work remains the distinct Gemini-family frontal/compressed shot. Five physical destinations now live in this plate. 110vw keeps the boards recruiter-readable while allowing the far-right motel clue to remain visible as a cropped peripheral fact. */",
    "/* More Work remains the distinct Gemini-family frontal/compressed shot. Five physical destinations now live in this plate. The motel sign is intentionally absent; the diner remains unnamed. */",
)
replace_required(
    'work-system.css',
    ".more-scene .b5{left:78.55%;top:16.55%;width:12.95%;height:47.65%}",
    ".more-scene .b5{left:78.55%;top:16.55%;width:14.58%;height:47.65%}",
)

# 3. Public-facing naming cleanup. Keep internal Last Stop references in docs,
# branch names and comments, but remove the fictional property name from visitor UI.
replace_required('index.html', '<title>Ian Luna — The Last Stop Diner</title>', '<title>Ian Luna — Creative Director</title>')
replace_required('index.html', '<meta name="description" content="The Last Stop Diner — the portfolio of Ian Luna, creative director.">', '<meta name="description" content="The portfolio of Ian Luna, creative director.">')
replace_required('index.html', '<meta property="og:title" content="Ian Luna — The Last Stop Diner">', '<meta property="og:title" content="Ian Luna — Creative Director">')
replace_required('index.html', '<span>EXT. · THE LAST STOP DINER · NIGHT</span>', '<span>EXT. · DINER · NIGHT</span>')
replace_required('index.html', '<span>THE LAST STOP DINER</span>', '<span>DINER · NIGHT</span>')

for rel in ['work.html', 'more-work.html', 'about.html', 'hearsay.html']:
    p = ROOT / rel
    text = p.read_text()
    text = text.replace('THE LAST STOP DINER', 'DINER')
    text = text.replace('The Last Stop Diner', 'Ian Luna')
    p.write_text(text)

for p in (ROOT / 'cases').glob('*.html'):
    text = p.read_text()
    text = text.replace('THE LAST STOP DINER', 'DINER')
    text = text.replace('The Last Stop Diner', 'Ian Luna')
    p.write_text(text)

print('Applied 2026-09-11 Work/runtime/public-name corrections.')
