# Section 02 implementation gate — approved layout only

Authority: user's "go ahead" 2026-10-26; gate file commit f9b2098. Target: `recovery/r0-centronic`. Never deploy or merge.

## Required reference material
Read `PORTFOLIO_GATE_STATUS.md`, `design-research/section02-review/playground.html`, `QA-REPORT.md`, `DESIGN-DECISIONS.md`, and `CHATGPT-INDEPENDENT-QA.md` first. Compare to actual Section 01 styles in `index.html`.

## Allowed changes
Implement only the Section 02 `#cs-research` block and CSS/JS strictly required for this block, on recovery branch. Preserve 12 chapters, Evidence Gallery, Section 01 and Section 03. Layout is full-width stacked evidence figures, marginal label and editorial headline, figure indexes/captions, existing research paragraph, relevant scroll reveals. Preserve semantic figure/figcaption and keyboard-accessible buttons.

Use the existing image files as **temporary slots** only. No new fetches, substitutions, content/image approvals, AI-generated content or images. New proposed heading and "Two lenses" label remain **provisional**, not user-approved copy; if implemented to match layout, explicitly mark provisional in the handoff so editor can revise later. Preserve current textual research evidence and caption semantics.

Functional acceptance: both figures open an accessible lightbox; Escape and visible close button; clicking backdrop where appropriate; restore trigger focus; trap focus while open; lock background scrolling at mobile; responsive at 1440/390/375 without horizontal overflow. Respect prefers-reduced-motion; do not add fictitious tooltips. Do not add review toolbar or implementation metadata to public page.

## Evidence + stop
Real browser QA screenshots at 1440/390/375, expanded lightbox desktop and mobile, source-load/console check, keyboard Escape/focus test, reduced-motion test. Record exact modified files and caveats. Save under `design-research/section02-review/implementation-qa/` and commit only on recovery branch. **STOP for user approval**; no automatic Section 03 or CMS work.

If the required integration would change shared functionality or another section, report the conflict and seek approval instead of proceeding.
