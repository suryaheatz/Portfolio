# Design Decisions — Section 02: The Research Playground
**Version:** v3  
**Date:** 2026-10-25  
**Status:** PLAYGROUND ONLY — not approved for production implementation  

---

## What Changed from the Previous Playground (v2 → v3)

### 1. Grey letterbox margins eliminated
**Problem:** `object-fit: contain` on the figure images caused letterbox padding. Because `.research-figure-window` had `background: var(--surface)` (#eeece7), this padding showed as a visible grey zone around the image.

**Fix:** Both `.research-figure` and `.research-figure-window` backgrounds were changed to `var(--bg)` (#f5f4f0), matching the page background. The letterbox padding area is now invisible. The figure card remains visually distinct via:
- `box-shadow: 0 0 0 1px var(--rule)` — a 1px hairline border in the rule colour
- A `var(--surface)` caption strip at the bottom with a `1px var(--rule)` top border

This preserves `object-fit: contain` (required for evidentiary content — diagrams must not be cropped) while removing the grey margin artefact.

### 2. Figure window heights differentiated
**Before:** Both figures had the same fixed height.  
**After:** Figure 1 uses `--tall` (460px desktop / 260px mobile), Figure 2 uses `--mid` (400px desktop / 220px mobile). This creates deliberate visual progression: the matrix (more spatial, more data-dense) gets more vertical breathing room; the IA audit (columnar, reads top-to-bottom) is slightly more compact.

### 3. Caption structure redesigned
**Before:** Caption was plain text, single style.  
**After:** Caption uses a flex row with two elements:
- `.research-figure-index` — tabular-numeral index ("01" / "02"), ink-3 colour, fixed minimum width. Provides sequential reading cue.
- `.research-figure-caption-text` — the actual caption string.

### 4. `object-position` changed from `center center` to `center top`
Both research diagrams have more meaningful content in the upper half (the matrix axis intersections and sticky notes; the IA pattern headers). Anchoring to the top ensures the most diagnostic content is visible in the cropped card view, before the user expands to the lightbox.

### 5. Inter-figure gap increased
Gap between figures increased from `var(--sp-8)` (32px) to `var(--sp-10)` (40px). Provides cleaner visual separation between the two research lenses.

### 6. Lightbox: focus restoration added
Added `lastFocused` variable that stores `document.activeElement` before the lightbox opens. On close (via button, backdrop click, or Esc), focus is restored to that element. Addresses WCAG 2.1 SC 2.4.3 (Focus Order).

### 7. Figure card surface area
The overall `background` of the figure container was changed from `var(--surface)` to `var(--bg)`. The caption strip retains `var(--surface)` background to provide a visible bottom anchor. This gives the figure an asymmetric feel: clean/neutral image window above, slightly warm caption shelf below.

---

## What Remained Unchanged

- **Section heading:** "What people reach for, and what they ignore." — provisional, unchanged.
- **Marginal label:** "Two lenses" — provisional, unchanged.
- **Section label:** "The Research" — provisional, unchanged.
- **Body copy:** Verbatim from the research design brief. No editorial changes.
- **Figure captions:** Verbatim from the research design brief.
- **Two-figure stacked layout:** Preserved. Both figures occupy the full content column width.
- **Lightbox pattern:** Same mechanism — click to open, backdrop click or Esc to close, full uncropped image display.
- **Scroll reveal animations:** Same `.anim-block` / `IntersectionObserver` pattern.
- **Reduced-motion behaviour:** Same `prefers-reduced-motion` media query + `body.reduced-motion` class override.
- **Floating review bar:** Unchanged — "IMAGES TEMPORARY" label, animation toggle.
- **SK Design System tokens:** All colour, spacing, radius, and typography values from the token system. No hardcoded values.
- **Font system:** Bricolage Grotesque (display) + Manrope (body), loaded from Google Fonts.
- **`object-fit: contain`:** Preserved. Evidentiary images must not be cropped. This is a hard constraint from SK Design System §26 (Case Study Media System).

---

## Why the Layout Suits the Research Content

The research section presents two complementary analytical frameworks:
1. A **frequency-vs-importance matrix** — a spatial diagram that requires the full horizontal width to read the quadrant distribution of cabin controls.
2. A **competitive IA audit** — a structured table comparing five OEM navigation patterns side by side.

Both are evidentiary artefacts, not decorative images. They require:
- **Sufficient height** to read without excessive zoom
- **No cropping** of any label or data point in the card view
- **Lightbox access** for full-resolution inspection

The single-column stacked layout (full content-width figures, no two-up bento grid) is correct for this content type. A two-up bento would crop both diagrams to 50% width, making label text illegible. Stacking with differentiated heights gives each diagram the space it needs while creating vertical rhythm through the section.

The `object-position: center top` anchor is deliberate: both diagrams have their most diagnostic content in the upper portion (matrix axis intersections; IA pattern names).

---

## Provisional Elements

The following elements are explicitly NOT APPROVED and must not be implemented without explicit user sign-off:

| Element | Status | Notes |
|---|---|---|
| Figure 1 image (`centronic-research-matrix.jpg`) | TEMPORARY / NOT APPROVED | Placeholder image — final asset not confirmed |
| Figure 2 image (`centronic-ia.jpg`) | TEMPORARY / NOT APPROVED | Placeholder image — final asset not confirmed |
| Section heading: "What people reach for, and what they ignore." | Provisional | Language not approved |
| Marginal label: "Two lenses" | Provisional | Label not approved |
| Section label: "The Research" | Provisional | Label not approved |
| Overall Section 02 layout direction | Direction 1 provisionally accepted for refinement only | Not approved for production implementation |

---

## Decisions Requiring User Approval Before Implementation

1. **Final image assets.** Both images are placeholders. The user must provide or approve the final assets before this section can be implemented. Asset decisions include: file format, resolution, whether the IA diagram should be replaced with a non-branded version (supplier names currently visible).

2. **Section heading and label copy.** All text marked provisional above must be approved.

3. **Figure heights.** The `--tall` / `--mid` height differentiation (460px / 400px desktop) is a design proposal. The user should confirm whether this progression is correct, or whether equal heights are preferred.

4. **Mobile lightbox z-index / scroll-lock.** The minor stacking issue at mobile (page content partially visible behind lightbox) should be reviewed and a decision made on whether to add `overflow: hidden` to `body` when the lightbox is open on mobile.

5. **IA diagram supplier visibility.** The competitive audit image shows OEM brand names. If ZF confidentiality constraints apply to this content in the production case study, the image must be replaced or obscured before production use. This is a content decision, not a playground issue.

6. **Overall Section 02 implementation authorisation.** Per PORTFOLIO_GATE_STATUS.md: no implementation or deployment is authorised until explicit user approval is given.

---

*This document covers design decisions for the playground artifact only. It does not authorise or constitute approval for production implementation.*
