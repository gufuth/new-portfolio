# Rendered-pixel QA note

The current execution environment exposes Chromium but headless navigation never reaches first paint, even for a trivial local HTML file; the process times out before producing a screenshot. This is a runtime/browser limitation, not a visual pass. Do not mark rendered-pixel QA complete from source inspection.

Local asset inspection is still valid for supplied images and contact sheets. Source/layout math and semantic QA can proceed autonomously. A normal staging browser remains the final visual gate.
