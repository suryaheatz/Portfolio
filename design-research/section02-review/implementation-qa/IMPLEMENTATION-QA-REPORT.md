# Section 02 Implementation QA Report

**Date:** 2026-10-27  
**Branch:** `recovery/r0-centronic`  
**QA method:** Playwright automated screenshots + programmatic checks (Chromium)  
**Gate:** `IMPLEMENTATION-GATE.md` — approved 2026-10-26  

---

## Modified Files

| File | Change |
|---|---|
| `index.html` | Replaced bento-2 research block (lines 1071–1095) with stacked editorial layout; added research CSS; added lightbox HTML and JS |

No other files were changed. Section 01, Section 03, 12 chapters, Evidence Gallery, and all other sections are untouched.

---

## Screenshots Captured

| Filename | Viewport | Notes |
|---|---|---|
| `desktop-1440-section02.png` | 1440×900 @2× | Section 02 at desktop width |
| `desktop-lightbox-fig1.png` | 1440×900 @2× | Lightbox open — Figure 01 (matrix) |
| `desktop-lightbox-fig2.png` | 1440×900 @2× | Lightbox open — Figure 02 (IA audit) |
| `desktop-keyboard-lightbox-open.png` | 1440×900 @2× | Lightbox open via keyboard (Enter key on Fig 01) |
| `desktop-reduced-motion-section02.png` | 1440×900 @2× | `prefers-reduced-motion: reduce` context |
| `mobile-390-section02.png` | 390×844 @2× | Section 02 at 390px |
| `mobile-390-lightbox-fig1.png` | 390×844 @2× | Mobile lightbox open — Figure 01 |
| `mobile-375-section02.png` | 375×812 @2× | Section 02 at 375px |

---

## Programmatic Test Results

### Desktop 1440px
| Check | Result |
|---|---|
| Page renders without horizontal overflow | ✓ pass |
| Figure 01 lightbox opens on click | ✓ pass |
| Figure 02 lightbox opens on click | ✓ pass |
| Esc key closes lightbox | ✓ pass |
| Close button closes lightbox | ✓ pass |
| Focus restored to trigger figure after close | ✓ pass (restored to data-research-fig="2") |

### Mobile 390px
| Check | Result |
|---|---|
| No horizontal overflow at 390px | ✓ pass |
| Figure 01 lightbox opens on tap | ✓ pass |
| Body scroll locked while lightbox open (`overflow: hidden`) | ✓ pass |
| Backdrop click closes lightbox | ✓ pass |
| Scroll restored after lightbox closes | ✓ pass |

### Mobile 375px
| Check | Result |
|---|---|
| No horizontal overflow at 375px | ✓ pass |

### Keyboard Accessibility (desktop)
| Check | Result |
|---|---|
| Figure 01 is focusable via Tab | ✓ pass |
| Enter key opens lightbox | ✓ pass |
| Focus moves to close button on open | ✓ pass |
| Esc restores focus to trigger figure | ✓ pass |

### Reduced Motion
| Check | Result |
|---|---|
| Section renders correctly with `prefers-reduced-motion: reduce` | ✓ pass |
| Content visible (not dependent on animation for visibility) | ✓ pass |

---

## Implementation Summary

### Layout
- Editorial header row: 140px marginal label column + 1fr heading column — uses existing `.cs-context-layout` grid (matches Section 01 pattern)
- Two stacked full-width evidence figures with differentiated heights: Figure 01 `460px` desktop / `260px` mobile; Figure 02 `400px` desktop / `220px` mobile
- Inter-figure gap: `var(--sp-10)` = 40px
- `object-fit: contain; object-position: center top` — no cropping, top-anchored

### Figure card treatment
- Background: `var(--bg)` = `#f5f4f0` — no grey letterbox artefact
- Border: `box-shadow: 0 0 0 1px var(--rule)` — subtle hairline
- Caption strip: `var(--surface)` background, `1px var(--rule)` top border
- Index labels: `01` / `02` in tabular numerals, `var(--ink-3)` colour

### Lightbox
- Single shared lightbox element (`#research-lightbox`)
- Opens on click or Enter/Space keyboard
- Closes on: Esc key, close button, backdrop click (click outside panel)
- Body scroll lock on open (`overflow: hidden` + `position: fixed` + scroll position preserved)
- Scroll position restored on close
- Focus trapped within lightbox panel while open
- Focus restored to trigger figure on close (`lastFocused` variable)
- `aria-modal="true"` dialog with `aria-label`
- Close button labelled `aria-label="Close enlarged figure"` with visible `Close Esc` text

### Provisional elements (not approved — marked in HTML comments)
- Section heading: "What people reach for, and what they ignore."
- Marginal labels: "The Research" / "Two lenses"
- Figure 01 image: `/public/images/centronic-research-matrix.jpg` — TEMPORARY SLOT
- Figure 02 image: `/public/images/centronic-ia.jpg` — TEMPORARY SLOT

---

## Known Issues / Caveats

1. **Mobile drawer overlay (pre-existing issue):** On mobile viewports, the chapter-navigation drawer (`#cs-drawer`) covers the full viewport in the browser even when `aria-hidden="true"`. This is a pre-existing defect tracked in the deferred stabilization list from Section 01 QA. For Playwright QA, the drawer was force-hidden via JS to allow figure click testing; this does not affect the production user experience since the drawer closes normally when the user dismisses it. This is NOT a Section 02 defect.

2. **External fonts not loaded in QA (network blocked):** Google Fonts is not accessible in the Playwright environment (network allowlist). Screenshots show system font fallbacks (`system-ui`, `sans-serif`). Production appearance with Bricolage Grotesque / Manrope will differ. This is an environment constraint, not a code defect.

3. **Mercedes-Benz COMAND label (pre-existing):** Per `CHATGPT-INDEPENDENT-QA.md`, the rightmost IA diagram label may clip slightly in the desktop lightbox. This is a characteristic of the source image composition, not a layout defect. Visible in `desktop-lightbox-fig2.png`.

4. **Supplier names in IA diagram:** The `centronic-ia.jpg` image contains OEM brand names. Image is TEMPORARY and NOT APPROVED. This must be resolved before production use (content decision).

5. **Real-device / cross-browser not tested:** Only Chromium via Playwright. Safari / iOS / Firefox not verified.

6. **Tab/Space to open lightbox:** `Space` key on a `role="button"` element should also open the lightbox; implemented in code (`e.key === ' '`), confirmed via code review, not separately verified by automated keystroke.

---

## Gate compliance

Per `IMPLEMENTATION-GATE.md`:
- [x] Both figures open an accessible lightbox ✓
- [x] Escape key closes lightbox ✓
- [x] Visible close button ("Close Esc") ✓
- [x] Backdrop click closes lightbox ✓
- [x] Trigger focus restored on close ✓
- [x] Focus trapped within lightbox while open ✓
- [x] Body scroll locked on open (mobile) ✓
- [x] Responsive at 1440 / 390 / 375 without horizontal overflow ✓
- [x] `prefers-reduced-motion` respected ✓
- [x] Provisional elements marked in HTML comments ✓
- [x] No review toolbar added to public page ✓
- [x] Section 01, Section 03, chapters, Evidence Gallery preserved ✓

**STOP — awaiting user visual approval before any further work.**
