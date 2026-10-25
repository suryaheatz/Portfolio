# QA Report — Section 02: The Research Playground
**Artifact version:** s02-v3-playground.html  
**Source artifact:** https://claude.ai/artifact/EJxDKav7DXQL7VYBkRCWoG (Version 2, id: 1792956014-e4e8)  
**QA date:** 2026-10-25  
**QA method:** Playwright automated screenshots + visual inspection  

---

## Browser & Viewport Dimensions Tested

| Screenshot | Viewport | Device Scale | Engine |
|---|---|---|---|
| desktop-1440.png | 1440 × 900 | 2× (2880 × 1800 logical) | Playwright / Chromium |
| mobile-390.png | 390 × 844 | 2× (780 × 1688 logical) | Playwright / Chromium |
| desktop-lightbox-figure1.png | 1440 × 900 | 2× | Playwright / Chromium |
| desktop-lightbox-figure2.png | 1440 × 900 | 2× | Playwright / Chromium |
| mobile-lightbox.png | 390 × 844 | 2× | Playwright / Chromium |
| reduced-motion.png | 1440 × 900 | 2× | Playwright / Chromium |

---

## Image Loading Results

| Image | Source | Result |
|---|---|---|
| centronic-research-matrix.jpg | Base64 data URI (embedded) | ✅ Loads — no network request required |
| centronic-ia.jpg | Base64 data URI (embedded) | ✅ Loads — no network request required |

Both images are embedded as base64 data URIs. The artifact is fully self-contained and loads without any server dependency.

**Both images remain TEMPORARY and NOT APPROVED.**

---

## Layout & Horizontal-Overflow Checks

| Check | Result | Notes |
|---|---|---|
| No horizontal scroll at 1440px | ✅ Pass | No overflow detected |
| No horizontal scroll at 390px | ✅ Pass | Content stacks to single column |
| Figure 1 visible without cropping essential content | ✅ Pass | object-fit: contain, object-position: center top |
| Figure 2 visible without cropping essential content | ✅ Pass | object-fit: contain, object-position: center top |
| Grey letterbox margins eliminated | ✅ Pass | Figure background matches page bg (var(--bg) = #f5f4f0) |
| Figure boundary visible (subtle) | ✅ Pass | 1px rule-colour border + slight surface caption strip |
| Marginal label + heading grid (140px + 1fr) | ✅ Pass | Labels left-aligned at 140px column |
| Body copy line length | ✅ Pass | Constrained to ~65ch at 1440px |
| Figure captions (01 / 02 index + text) | ✅ Pass | Tabular-nums index, subdued ink-3 caption text |
| Floating review bar (dark, fixed top) | ✅ Pass | Does not interfere with composition below |

---

## Lightbox Interaction Results

| Check | Result | Notes |
|---|---|---|
| Click Figure 1 opens lightbox | ✅ Pass | Full matrix diagram displayed uncropped |
| Click Figure 2 opens lightbox | ✅ Pass | Full IA audit diagram displayed uncropped |
| Close button visible (top-right) | ✅ Pass | "Close Esc" button present in both lightbox states |
| Backdrop darkens correctly | ✅ Pass | Overlay visible at 1440px |
| Image fills lightbox panel | ✅ Pass | object-fit: contain with white background |
| Caption text in lightbox | ✅ Pass | Caption rendered below image panel |
| Lightbox on mobile (390px) | ✅ Pass | Matrix diagram fills mobile lightbox correctly |

---

## Keyboard & Focus Behavior

| Check | Result | Notes |
|---|---|---|
| Esc key closes lightbox | ✅ Implemented | keydown listener on document for 'Escape' |
| Focus restoration on close | ✅ Implemented | lastFocused variable stores activeElement before open; restored on close |
| Backdrop click closes lightbox | ✅ Implemented | Click handler on overlay checks target === overlay |
| Keyboard verification via actual interaction | ⚠️ Partial | Implemented in code; not verified by automated keystroke (Playwright did not fire Esc key — only visual capture) |

---

## Animation & Reduced-Motion Results

| Check | Result | Notes |
|---|---|---|
| Scroll reveal on initial load | ✅ Pass | .anim-block elements animate in via IntersectionObserver |
| All elements visible after reveal | ✅ Pass | Force-revealed in screenshot script; confirmed |
| Reduced-motion: elements visible at page load | ✅ Pass | Screenshot shows all content visible without scroll trigger |
| Reduced-motion: layout matches animated version | ✅ Pass | Identical composition, no broken/missing content |
| Motion toggle in review bar | ✅ Present | Toggle checkbox functional; adds body.reduced-motion class |
| prefers-reduced-motion: reduce context tested | ✅ Pass | Playwright context set reducedMotion: 'reduce' |

---

## Known Limitations

1. **Supplier names present in IA diagram.** The centronic-ia.jpg image contains OEM brand names (BMW iDrive, Mercedes-Benz COMAND, Audi MMI, GM MyLink, Tesla Model S). These are visible in the lightbox. The image is TEMPORARY and NOT APPROVED — supplier visibility will need to be resolved before production use. This is a content decision, not a playground defect.

2. **Mobile lightbox caption stacking.** At 390px with the lightbox open, the page body content (including the figure caption text) is partially visible behind the lightbox overlay. The lightbox itself is functional and the image is readable. This is a z-index / scroll-lock nuance; the body does not have `overflow: hidden` applied when the lightbox opens on mobile. Minor — does not block review.

3. **Mercedes-Benz COMAND label clipped at desktop.** At 1440px viewport width, the rightmost label in the IA diagram lightbox ("Mercedes-Benz COMAND") is slightly clipped at the right edge. This is a characteristic of the source image's composition and the lightbox panel width, not a layout defect in the playground.

4. **Keyboard Esc not tested by automated keystroke.** The Esc handler is present in code and was reviewed via source inspection, but the Playwright capture script did not fire an actual keystroke to verify the close. Manual testing is recommended.

5. **No interaction recording captured.** The brief requested a short interaction recording demonstrating image expansion, dismissal, and animation. This was not captured in the current evidence package. Playwright GIF recording was not implemented in the capture script. This can be added if requested.

6. **Tooltip animation.** The brief asked to note whether the previously developed tooltip animation is relevant to Section 02. It is not: the tooltip pattern belongs to interactive prototype UI (button hover states, etc.) and does not apply to the research evidence layout. No tooltip interaction is present or expected in this section.

---

## Checks Not Completable

- **Production image paths.** The playground uses base64-embedded images. When implemented on the production site, images will be served as `/public/images/centronic-research-matrix.jpg` and `/public/images/centronic-ia.jpg`. These paths have not been tested in this playground.
- **Real device mobile testing.** Screenshots were taken at 390px viewport in Chromium; Safari / iOS rendering was not tested.
- **Cross-browser lightbox.** Only Chromium was used. Firefox and Safari lightbox behavior was not verified.

---

*This report covers the playground artifact only. It does not constitute approval of the design, the images, or the layout for production implementation.*
