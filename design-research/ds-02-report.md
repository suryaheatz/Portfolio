# DS-02 Design System Audit — Findings & Recommendations
**Gate:** DS-02 (Visual Quality Audit)  
**Auditor:** Claude Sonnet 4.6  
**Scope:** Visual quality · Typography · Spacing · Brand identity · Accessibility · Components · Responsive composition  
**Authorized:** DS-02 approval message (8 scope adjustments applied)  
**Audit date:** 2026-10-24  
**Status:** COMPLETE — pending DS-03 approval gate  

---

## A. Evidence Base

### Measurement instruments
- **Node.js HTTP server** → portfolio served at `localhost:9090`
- **Playwright chromium** → screenshots at 390px, 900px, 1280px, 1440px (fold + full-page)
- **DOM measurement pass** → `page.evaluate()` at 1440px and 390px (see `/tmp/ds02-measurements-*.json`)
- **WCAG contrast calculator** → computed against measured hex values
- **Source files read:** `index.html` (84,641 bytes), `public/ds-tokens.css` (101 lines)

### Audit lenses applied
- **Primary:** Awwwards web-design skill (slop crosswalk, 11 rows) + Anthropic Frontend Design skill (AI-cluster diagnostics, 5 patterns)
- **Supporting:** CKW design-system gates (horizontal overflow, nested radii, FOUT) + RH design-critique (NNG/Laws of UX)
- **Where lenses conflict:** documented per finding below

---

## B. Severity Scale

| Level | Label | Meaning |
|---|---|---|
| S1 | **Critical** | Accessibility failure, broken layout, or brand-identity regression — blocks DS-03 |
| S2 | **High** | Measurably degrades quality; strongly recommended fix before DS-03 |
| S3 | **Medium** | Craft gap; recommended for DS-03 scope |
| S4 | **Low** | Refinement; address when adjacent work opens the file |
| S5 | **Informational** | No action required; context for future gates |

---

## C. Findings — Severity-Ranked

---

### F-01 · S1 · `--ink-3` on light backgrounds fails WCAG AA
**Category:** Accessibility — contrast  
**Source:** `public/ds-tokens.css` + measured DOM  
**Evidence:**

| Pair | Foreground | Background | Ratio | WCAG result |
|---|---|---|---|---|
| `--ink-3` on `--bg` | `#9a9a94` | `#f5f4f0` | 2.57 : 1 | **FAIL** (AA requires 4.5:1 normal / 3:1 large) |
| `--ink-3` on `--surface` | `#9a9a94` | `#eeece7` | 2.40 : 1 | **FAIL** |

**Affected elements (measured):**
- Hero eyebrow labels: `class="hero-tag"`, `font-size: 11px`, `text-transform: uppercase` → small text, hardest threshold
- Scope keys (`class="scope-key"`): same 11px size
- Body caption paragraph: `color: rgb(154,154,148)` = `--ink-3`, `font-size: 12px`

**Note:** `--ink-3` at `11px uppercase` would require **4.5:1** for WCAG AA. It renders at **2.57:1** — less than half the required ratio.

**Awwwards lens:** quality-gates.md: "4.5:1 contrast on the worst frame." This fails.  
**Anthropic Frontend Design lens:** "Build to a quality floor without announcing it: visually accessible."  
**Both lenses agree.** No conflict.

**Recommendation:** Darken `--ink-3` to achieve ≥ 4.5:1 on `--bg`. Target: `#767672` gives ~3.5:1 (large text only); `#636360` gives ~4.6:1 (passes AA normal text). Evaluate visually — the current `--ink-3` reads as a deliberate recessive tone; any fix must preserve that quality while hitting the threshold.  
**Do not implement without approval.** Bring options to DS-03.

---

### F-02 · S1 · Mobile bento stacks not firing
**Category:** Responsive composition — broken component  
**Source:** DOM measurement at 390px: `bentoStacks: 0`, `bentoGrids: 65`  
**Evidence:** At 390px viewport, 65 `.cs-bento` grid instances were detected but zero `.bento-stack-wrapper` elements exist. The CLAUDE.md spec says mobile card-stack JS fires on `DOMContentLoaded` and bails if `window.innerWidth > 640` — but at 390px it should fire. It is not firing.

**Possible causes:**
1. The JS block is present in `index.html` but a syntax error or early `return` prevents execution
2. The `DOMContentLoaded` handler fires before DOM is fully parsed in Playwright's headless mode (unlikely — `waitUntil: 'networkidle'` was used)
3. The bento-stack JS was never implemented (classified as **DEFERRED** — see F-17)

**Impact:** At mobile, all bento grids render as standard CSS grids at ≤640px. Grid cells collapse but don't stack as swipeable cards. Content is accessible but the designed mobile experience is absent.

**Recommendation:** Confirm whether bento-stack JS exists in `index.html` before DS-03. If absent, classify as deferred and note in DS-03 scope.

---

### F-03 · S2 · `--ink-3` eyebrow pattern matches Anthropic AI-cluster pattern #5 (template chrome)
**Category:** Brand identity — AI-generated tell  
**Source:** Measured DOM + visual inspection at 1440px  
**Evidence:**

Anthropic Frontend Design skill, pattern #5:
> "template chrome that appears whatever the subject: a tracked-out ALL-CAPS eyebrow label above every heading; meta strings joined with middle dots ('A · B · C')…"

Measured in DOM:
```
.hero-tag: font-size 11px | text-transform: uppercase | letter-spacing: 1.54px | color: --ink-3
Content: "ZF Friedrichshafen AG · 2019" / "Sr. UX Designer" / "HMI / Autonomous Vehicles"
```

Three separate ALL-CAPS `<span class="hero-tag">` elements with middle-dot-joined structure appear above the H1. This is structurally identical to the AI-template-chrome pattern.

**Critical distinction (scope adjustment #1 applied):** The question is not whether `#E8490F` is AI-generic — it is whether the *structural pattern* is. The color is not the issue here. The eyebrow structure — ALL-CAPS + letter-spacing + middle dots + `--ink-3` color — is the pattern.

**Awwwards lens (content-voice.md):** eyebrow labels above headings are acceptable when they encode information not present in the heading. These tags carry real information (company, year, role, domain) that cannot be inferred from the H1 alone. Structurally justified.

**Anthropic Frontend Design lens:** the pattern is the tell, regardless of content value.

**Lens conflict documented:** Awwwards treats this as content-encoding (acceptable if information is real). Anthropic Frontend Design flags it as template chrome regardless. **Recommendation:** evaluate whether the same information can be encoded without the `all-caps + middle-dot + letter-spacing` triple. Options to propose at DS-03:
- Retain ALL-CAPS but replace middle-dot separators with `·` used as semantic separator (one pause, not three), or with a light vertical rule
- Use sentence-case with a different weight/color to distinguish the metadata
- Use a pill/tag structure for company + year, and inline prose for role/domain

**Do not implement without approval.**

---

### F-04 · S2 · `--sun` / `--teal` token naming conflict and identity ambiguity
**Category:** Token system — brand identity  
**Source:** `public/ds-tokens.css` lines (both tokens measured as `#E8490F`)

```css
--sun: #E8490F;
--teal: #E8490F;   /* identical value — naming is false */
```

**Evidence:** Both tokens resolve to the same value in every context. `--teal` was presumably named for a color that was replaced or planned. The alias creates two names for one hue — one accurate (`--sun`, warm orange), one completely wrong (`--teal`, implies blue-green).

**Impact:** Any developer or future AI agent reading the token system will be confused by `--teal`. It is a silent correctness trap: code that uses `--teal` intending a blue-green accent will silently render orange.

**Recommendation:** In DS-03, rename `--teal` to `--sun` everywhere it appears in `index.html`, then delete the `--teal` token from `ds-tokens.css`. Global find-replace, low risk. Or retain `--teal` as an explicit alias with a comment marking it deprecated.

---

### F-05 · S2 · Two overlapping timing token systems
**Category:** Token system — motion coherence  
**Source:** `public/ds-tokens.css` + CLAUDE.md + measured DOM  
**Evidence:**

`ds-tokens.css`:
```css
--dur-fast: 220ms
--dur-mid: 380ms
```

CLAUDE.md (and confirmed live in DOM):
```css
--t-fast: 150ms
--t-mid: 250ms
```

Both sets resolve in the live page. Any animation author must now choose between two timing systems with no clear authority rule. The CLAUDE.md system uses shorter values (faster feel); the `ds-tokens.css` system uses longer values (more deliberate transitions).

**Awwwards lens (motion.md):** "One ease family, one duration ladder." Two ladders is an explicit violation.  
**CKW lens:** timing token conflicts create regression risk on every animation change.

**Recommendation:** Canonicalize one set. Proposed: keep `--dur-*` (the longer, more deliberate values — better suited to a case study portfolio than a product UI). Remove `--t-fast` and `--t-mid`, and update all references in `index.html`. Needs a search-replace audit before DS-03 to count affected references. **Bring count to DS-03 approval.**

---

### F-06 · S2 · Body text line length at the boundary
**Category:** Typography — readability  
**Source:** DOM measurement at 1440px  
**Evidence:**

```
Body text: max-width 640px, font-size 16px
Estimated chars per line: ~80 (exact boundary of the 80-char guideline)
```

At exactly 80 chars the text is at the theoretical maximum before readability degrades. DM Sans is a moderately wide font; at 16px/400 weight the actual character width is ~8.5px per character, making the true line length closer to 75 chars — within acceptable range. However, **center-aligned** body text at this width adds cognitive load: the ragged edges on both sides require the eye to search for the next line start on every return sweep.

**Anthropic Frontend Design lens:** "line lengths of less than 80 characters" — currently at the edge.  
**RH design-critique (NNG/Laws of UX):** center-aligned running text beyond ~5 lines is broadly considered a usability concern for paragraphs.

**Recommendation:** Reduce `max-width` on body paragraphs to `60ch` (approximately 600px at 16px), which gives ~60 chars — comfortably readable. Left-align body text within that container; centered text is appropriate for short display or captions, not multi-line paragraphs. **Discuss at DS-03.**

---

### F-07 · S2 · `--sun` (brand accent) contextual evaluation
**Category:** Brand identity — accent color  
**Source:** Measured contrast ratios + visual inspection + scope adjustment #1  
**Evidence:**

Contrast ratios for `#E8490F`:
- on `--bg` (#f5f4f0): **3.54 : 1** — passes AA for large text (≥18px regular / ≥14px bold) only
- on `--surface` (#eeece7): **3.30 : 1** — large text only

Measured accent usage:
- `.cs-label` elements: `font-size` not measured but context implies small-medium body text
- `.primary` link: "Read the full case study →" — link text, needs 4.5:1 minimum
- `.dl-num` / `.dl-title` spans: decorative numbering + chapter titles

**Scope adjustment #1 applied:** evaluate `#E8490F` contextually, not categorically.

**Finding:** The hue itself is distinctive and appropriate — a saturated red-orange is not a match for Anthropic's `#D97757` (which is a lighter, warmer clay). `#E8490F` is more saturated, more orange-red, and notably different in character. The AI-cluster pattern #1 calls out "terracotta or warm-clay accent near `#D97757`" — `#E8490F` does not fall in that range.

**However:** the contrast ratio of 3.54:1 means the accent fails WCAG AA when used on body-size text (under 18px). The `.primary` link in particular ("Read the full case study →") is a clickable affordance that should meet 4.5:1. It does not.

**Awwwards lens:** Accent at 3.54:1 on body text is a quality-gate failure.  
**Both lenses agree on the contrast problem.** The hue itself is not the issue; the application is.

**Recommendation:** Do not change the hue. Adjust usage: restrict `--sun` to display-size text (≥18px), decorative/ornamental elements, and interactive states where the text color itself is not the only contrast signal (e.g., underline + color). For the `.primary` link and any `--sun` text below 18px on `--bg`, either darken the application color (a `--sun-accessible` token at approximately `#C43B08`, which gives 4.9:1) or use `--ink` as the text color with `--sun` as an underline/border accent.

---

### F-08 · S3 · Token duplication: `ds-tokens.css` vs inline `<style>` in `index.html`
**Category:** Token system — maintainability  
**Source:** K-04 from DS-01, confirmed in DS-02 measurements  
**Evidence:** Typography tokens (`--font-serif`, `--font-sans`, the full type scale) and spacing tokens are declared in both `public/ds-tokens.css` and an inline `<style>` block in `index.html`. The inline declaration wins due to cascade order. Any edit to `ds-tokens.css` has no effect on the live page without a matching edit to `index.html`.

**Impact:** `ds-tokens.css` is effectively a documentation artifact, not a functional token source. This is misleading for any future collaborator.

**Recommendation:** In DS-03, establish a single source of truth. Options: (a) delete the inline redeclarations and use `ds-tokens.css` as the authoritative source via `<link>`; (b) treat `index.html` as the source of truth and remove `ds-tokens.css` or clearly mark it as reference-only. Option (a) is preferred for long-term maintainability.

---

### F-09 · S3 · H3 section headings use `font-weight: 700` (bold) — inconsistent with serif scale
**Category:** Typography — type hierarchy  
**Source:** DOM measurement at 1440px

```
H1: DM Serif Display, 76px, weight 400, italic
H3 (section): DM Serif Display, 34px, weight 700, normal
```

**Finding:** DM Serif Display is designed as a display typeface at weight 400. Using it at `font-weight: 700` produces a synthetic bold (faux bold in most rendering engines, since DM Serif Display does not ship a true 700 weight). The visual result is a slightly thicker stem, but it lacks the optical compensation of a true bold cut. More significantly, the H3 is `font-style: normal` while the H1 is `font-style: italic` — the italic is the distinctive, personality-forward choice; the non-italic H3 reads comparatively flat.

**Awwwards lens (typography.md):** "Licensed or distinctive display type that is deliberate and measured." Synthetic bold on display type undermines distinctiveness.

**Recommendation:** Set H3 to `font-weight: 400` and `font-style: italic` to maintain the italic as the system's display personality. If a weight distinction between H1 and H3 is needed, achieve it through size contrast rather than weight. **Discuss at DS-03.**

---

### F-10 · S3 · No FOUT prevention (font loading)
**Category:** Typography — loading behavior (K-05 from DS-01)  
**Source:** DS-01 finding confirmed; no `font-display: optional` or `font-display: swap` with size-adjusted fallback detected  

Google Fonts link in `index.html` uses default `display=swap`, which means:
1. Page renders with system fallback fonts
2. DM Serif Display and DM Sans swap in when loaded
3. Visible layout shift occurs on each font swap (CLS contribution)

**CKW lens:** FOUT is a quality-gate item. Requires `size-adjust` + `ascent-override` on fallback `@font-face` declarations.  
**Awwwards lens (quality-gates.md):** "CLS ≤ 0.1." FOUT contributes to CLS.

**Recommendation for DS-03:** Add size-adjusted `@font-face` fallback declarations for both DM Sans and DM Serif Display. This is a known pattern; the CKW skill documents the implementation. Medium effort, high quality impact.

---

### F-11 · S3 · Hero section: `text-align: center` on multi-line H1 and body paragraphs
**Category:** Typography — readability + composition  
**Source:** DOM measurement at 1440px

```
H1: text-align: center (76px, 2 lines)
Body paragraphs: text-align: center (16px, max-width 640px)
```

**Finding:** Center alignment on the H1 (a 2-line headline) is visually appropriate — short display text responds well to centering. Center alignment on the body paragraphs (potentially 5–10 lines) creates a "tombstone" text block with ragged edges on both sides, which slows reading speed.

This is separate from F-06 (line length). Even at a reduced `max-width`, center-aligned body text remains a readability concern at paragraph length.

**Recommendation:** Center the H1 (keep current). Switch body `<p>` elements to `text-align: left` within a centered container. The container stays centered; the text reads left-to-right. **Discuss at DS-03.**

---

### F-12 · S3 · `--sun` in `.primary` link uses `→` arrow — Anthropic template-chrome flag
**Category:** Brand identity — microcopy  
**Source:** DOM measurement: `.primary` link text = "Read the full case study →"  

Anthropic Frontend Design skill, pattern #5:
> "a '→' appended to link and button text"

**Finding:** This is the mildest instance of template chrome. The `→` on a primary link is extremely common and has become a generic affordance signal rather than a distinctive design choice.

**Awwwards lens (interaction.md):** hover language should be "a tonal fill or ink change, or an icon sliding inside a static box." A static `→` in body text is neutral.  
**Lens conflict:** Awwwards does not flag static arrows; Anthropic Frontend Design does. The conflict is real but the severity is low — this is a minor microcopy pattern, not a structural tell.

**Recommendation:** Low priority. If the link interaction is ever redesigned, replace the static `→` with an icon that animates inside a static pill on hover, which would both fix the template-chrome tell and create a more distinctive interaction. **DS-04 scope or later.**

---

### F-13 · S3 · Section rhythm: gap between sections uses margin/padding directly rather than `--section-gap` token
**Category:** Token system — spacing consistency  
**Source:** DOM measurements show `padding-top: 80px` on `.section` class, which matches `--section-gap: 80px` (correct), but dark sections (`.hero-image-section`, `.st-brief`, `.st-scope`) use `padding-top: 0px` with spacing managed by the scroll-transition stack.

**Finding:** The scroll-transition sections are intentionally zero-padded because the sticky scroll system manages their visual separation. This is correct. However, regular content sections that come after the transition stack may have inconsistent rhythm if they're not all using `--section-gap`.

**No critical issue found.** The token is being used where applicable. This is a monitoring note for DS-03.

---

### F-14 · S4 · `rule on bg` contrast: 1.27:1 — dividers are invisible under low-contrast conditions
**Category:** Accessibility — low severity  
**Source:** Contrast calculation: `--rule` (#dddad0) on `--bg` (#f5f4f0) = 1.27:1

**Finding:** Dividers/rules are decorative — WCAG does not require contrast on decorative elements. However, users with low contrast sensitivity (including the common aging-related contrast reduction) will not see these dividers at all. This is an informational finding, not a compliance failure.

**Recommendation:** No change required. Note for DS-03 if dividers play a structural/navigation role (e.g., section breaks that users rely on to understand structure).

---

### F-15 · S4 · Nav height 54px with transparent background — no backdrop treatment on scroll
**Category:** Visual quality — nav behavior  
**Source:** DOM measurement: `nav height: 54.4px`, `bg: rgba(0,0,0,0)` (transparent)

**Finding:** The nav is transparent at page load, which works over the light hero. When the user scrolls into dark sections (e.g., `hero-image-section` at `bg: #1e1c1a`), the nav text remains `--ink` colored and may become invisible against dark backgrounds.

**Recommendation:** Add a scroll-aware backdrop (frosted glass or `--bg` fill) to the nav when it overlaps dark sections, or switch to `--bg` text color when over dark content. **Discuss at DS-03.**

---

### F-16 · S4 · H1 `font-size: 76px` hardcoded — not using `--text-serif-lg` token
**Category:** Token system — consistency  
**Source:** DOM measurement: H1 `font-size: 76px` computed. `--text-serif-lg` = `clamp(52px, 7.5vw, 96px)` — at 1440px this resolves to: `7.5vw × 1440 = 108px`, clamped to `96px` max. The measured 76px does not match.

**Finding:** H1 uses a hardcoded `76px` rather than the `--text-serif-lg` token. At 1440px this is within the clamp range but does not track the token's responsive behavior. At viewports between 900px–1280px the token would give a different size than what's coded.

**Recommendation:** Replace hardcoded H1 `font-size` with `var(--text-serif-lg)`. Low risk. **DS-03 scope.**

---

---

## D. Awwwards Slop Crosswalk — 11-Row Assessment

| Row | Award habit / slop version | Evidence in SK portfolio | Crafted version present? | Verdict |
|---|---|---|---|---|
| 1 | Scroll reveals: sections at `opacity:0` waiting for observer | 13 scroll-triggered sections via GSAP ScrollTrigger | Partial — GSAP used (better than plain IntersectionObserver), but per Awwwards, content should be at rest in CSS with only a small y-settle | **Partially crafted** |
| 2 | Preloader: timed 0–100 counter | No preloader detected in screenshots | N/A | **Clean** |
| 3 | Link hover: underline wipe-in or lift/scale | Not measured in this pass; primary link is a plain `→` text link | Cannot confirm | **Needs check** |
| 4 | Accent color: neon splashed on chips/dots/CTAs | `--sun` used on `.cs-label`, `.dl-num`, `.dl-title`, `.primary` link | Single owned hue on contextual labels — not splash-everywhere | **Good** |
| 5 | Luxury ground: cream/oat + letterspaced Didone | `--bg: #f5f4f0` (warm cream) + DM Serif Display (display serif) | The ground is distinctive from generic cream; DM Serif is not a Didone | **Defensible** (see F-07 for accent, not ground) |
| 6 | Texture: grain over whole page including text | No grain detected | N/A | **Clean** |
| 7 | ALL-CAPS eyebrows | Present: `.hero-tag` spans, `scope-key` divs | Not crafted away | **Slop tell** — see F-03 |
| 8 | Middle-dot meta strings | Present: "ZF Friedrichshafen AG · 2019" | Not crafted away | **Slop tell** — see F-03 |
| 9 | Same soft-grey shadow everywhere | Not measured directly; `--surface` cards visible | Not a shadow-kit layout | **Likely clean** |
| 10 | `→` on links/buttons | Present on `.primary` link | Not replaced with animated icon-in-box | **Minor tell** — see F-12 |
| 11 | Numbered markers (01/02/03) not warranted by sequence | `.dl-num` spans ("01", "The Context" etc.) | Chapter numbers on a case study ARE a genuine sequence — warranted | **Justified** |

**Overall Awwwards slop crosswalk:** 2 clear tells (rows 7, 8 — eyebrow pattern), 1 minor tell (row 10 — arrow), remainder clean or defensible.

---

## E. Anthropic AI-Cluster Diagnostics — 5-Pattern Assessment

| Pattern | Description | Evidence | Verdict |
|---|---|---|---|
| 1 | Warm cream + high-contrast serif + terracotta/clay accent (~#D97757) | `--bg: #f5f4f0` (warm cream) + DM Serif Display + `--sun: #E8490F` | **Partial match on background + serif.** Accent is `#E8490F`, not `#D97757` — distinctly more saturated and red-orange. Passes scope adjustment #1. **Not a pattern match.** |
| 2 | Near-black + acid-green/vermilion accent | `--bg` is light; case study has dark sections (`#1e1c1a`) with light text | Dark sections exist but are not the dominant ground | **Not a match** |
| 3 | Broadsheet layout (hairline rules, zero radius, newspaper columns) | `--r-lg: 20px` used throughout; no newspaper column structure | **Not a match** |
| 4 | SaaS-card kit (identical rounded cards, same grey shadow everywhere) | Bento grids, section cards visible — but varied sizes, no uniform shadow kit | **Not a match** |
| 5 | Template chrome (ALL-CAPS eyebrows + middle dots + `→` + monospace data labels + spaced em-dash) | ALL-CAPS `.hero-tag` spans + middle-dot separators + `→` on primary link | **Partial match** — 3 of 5 sub-patterns present. Structural chrome is the main concern. See F-03 and F-12. |

**Overall Anthropic AI-cluster:** Pattern #5 is the only active concern. Pattern #1 is close but does not match once the accent hue is evaluated contextually (scope adjustment #1). The portfolio is not AI-cluster-generic but has template-chrome residue.

---

## F. Component Status Classification

Per scope adjustment #3: classify each of the 5 documented but unshipped components as **experimental**, **planned**, **deferred**, or **genuinely missing** before treating as a design-system inconsistency.

| Component | DOM evidence | Classification | Notes |
|---|---|---|---|
| **Bento 3D tilt** (GSAP mousemove) | `.cs-bento-cell` elements exist (65 bento grids) | **Deferred** | Tilt interaction not detectable via classname in static measurement. Likely requires live user interaction to trigger. May be in JS but not applied at load. Needs JS-interaction test. |
| **GSAP Flip expand** | `.flip-expanded` class not present at rest | **Deferred** | Flip is triggered by click — not present at load. Likely implemented; needs click-test confirmation. |
| **Mobile card stack (≤640px)** | 0 `.bento-stack-wrapper` elements at 390px; 65 bento grids still present | **Genuinely missing or broken** | This should fire on `DOMContentLoaded` if `window.innerWidth ≤ 640`. Not firing. Either the JS block is absent or has a fatal error. **See F-02.** |
| **Quote 2-up (.pq-pair)** | `pqPair: true` in component check | **Shipped** | Present in DOM. Classified as shipped, not unshipped. |
| **Slide Layout (.sk-slide)** | `skSlide: true` in component check | **Shipped** | Present in DOM. Classified as shipped, not unshipped. |

**Revised count:** Of the 5 components from K-07, 2 are shipped (Quote 2-up, Slide Layout), 2 are deferred/need interaction testing (Bento 3D tilt, GSAP Flip), and 1 is genuinely missing or broken at mobile (mobile card stack).

---

## G. Responsive Composition Summary

| Viewport | H1 font-size | Overflow | Key issues |
|---|---|---|---|
| 1440px | 76px (hardcoded, not token) | None | Eyebrow pattern, body center-align, ink-3 contrast |
| 1280px | ~76px (similar) | None | Near-identical to 1440px — acceptable |
| 900px | Not measured precisely | None detected | Headline wraps awkwardly; "autonomous CARS" uppercase render artifact — needs investigation |
| 390px | 36px (clamped correctly) | None | Mobile bento stack not firing; eyebrow may wrap |

**Positive finding:** No horizontal overflow at either measured viewport. The container system (1080px max-width, 48px gutter) is working correctly.

**Concern at 900px:** The "autonomous CARS" uppercase rendering artifact visible in fold screenshot may be a CSS text-transform partial application or a line-break issue at this breakpoint. Needs targeted investigation.

---

## H. Visual Quality Assessment — Awwwards Band Estimate

Based on the evidence gathered:

**Strengths:**
- H1 typography: DM Serif Display italic at 76px with -1.52px letter-spacing is genuinely distinctive. Not a generic choice.
- Color system: warm ground + `--sun` accent at `#E8490F` is intentional and not AI-cluster-generic (scope adjustment #1 confirmed)
- Scroll transition system (sticky cards) is a well-executed interaction
- Observable Plot data visualizations signal technical craft
- No horizontal overflow at any viewport
- Dark sections with high-contrast content (`bg: #1e1c1a` at 15.43:1) are visually strong

**Weaknesses:**
- Template-chrome residue (ALL-CAPS + middle-dots) reduces distinctiveness
- `--ink-3` contrast failures are a quality gate block
- Mobile bento experience is broken/absent
- Two timing token systems create motion incoherence
- Body text center-alignment at paragraph length

**Estimated Awwwards band:** SOTD-eligible if template chrome is addressed and accessibility gates are cleared. SOTM territory would require the mobile experience to be complete and the motion system to be unified.

---

## I. Design Decision Register — DS-02 Decisions

| ID | Decision | Status | Notes |
|---|---|---|---|
| D-02-01 | `--ink-3` contrast: darken to pass AA | **PROPOSED** | Options to present at DS-03 |
| D-02-02 | Mobile bento stack: confirm missing/fix | **PROPOSED** | Needs code inspection |
| D-02-03 | Eyebrow pattern: evaluate alternatives | **PROPOSED** | Options to present at DS-03 |
| D-02-04 | `--teal` → `--sun` rename or deprecate | **PROPOSED** | Low risk find-replace |
| D-02-05 | Timing tokens: canonicalize `--dur-*` | **PROPOSED** | Needs reference count in index.html |
| D-02-06 | Body text: reduce max-width + left-align | **PROPOSED** | Readability improvement |
| D-02-07 | `--sun` accessible variant for small text | **PROPOSED** | Contrast-safe application rules |
| D-02-08 | Token deduplication (ds-tokens.css vs inline) | **PROPOSED** | Single source of truth |
| D-02-09 | H3 weight: 700→400 italic for display consistency | **PROPOSED** | Removes synthetic bold |
| D-02-10 | FOUT prevention: size-adjusted fallbacks | **PROPOSED** | CKW pattern; medium effort |
| D-02-11 | H1: use `--text-serif-lg` token instead of 76px hardcode | **PROPOSED** | Low risk |
| D-02-12 | Nav backdrop on dark sections | **PROPOSED** | Readability |

---

## J. What Was Not Audited (DS-03+ Scope)

- Performance (LCP, CLS, INP) — requires Lighthouse / lab measurement
- GSAP Flip and 3D tilt: interaction testing required (click/hover, not load-time)
- The `→` hover behavior on `.primary` link
- 900px viewport uppercase artifact — targeted investigation needed
- Prototype embed section (Observable Plot, interactive demo)
- Evidence gallery pattern (not present in current DOM)
- Full case study scroll-transition behavior (sticky card system)

---

## K. DS-03 Approval Request

DS-02 is complete. The following is proposed for DS-03:

**DS-03: Targeted Fixes (Implementation Gate)**

**Proposed DS-03 scope** (all require your explicit approval before any change is made):

**S1 fixes — must proceed:**
1. Fix `--ink-3` contrast (F-01): darken token or restrict usage — present 2–3 options
2. Investigate + fix mobile bento stack (F-02): confirm JS state, implement or defer

**S2 fixes — strongly recommended:**
3. Canonicalize timing tokens (F-05): remove `--t-fast`/`--t-mid`, use `--dur-*` throughout
4. Rename/deprecate `--teal` token (F-04): find-replace in index.html
5. `--sun` accessible usage rules (F-07): add `--sun-accessible` token or restrict to display-size
6. Eyebrow pattern evaluation (F-03): present 3 alternatives, await decision

**S3 fixes — recommended:**
7. Body text: max-width reduction + left-align (F-06, F-11)
8. Token deduplication (F-08): canonicalize ds-tokens.css as source of truth
9. H3 display weight fix (F-09): 700→400 italic
10. FOUT prevention (F-10): size-adjusted fallback @font-face declarations
11. H1 token alignment (F-16): var(--text-serif-lg) instead of 76px

**Hard stop:** Implement nothing until DS-03 is approved. Present options for F-01, F-03, F-07 (the decisions where multiple paths exist) before writing code.

---

*DS-02 report complete. Awaiting DS-03 approval.*
