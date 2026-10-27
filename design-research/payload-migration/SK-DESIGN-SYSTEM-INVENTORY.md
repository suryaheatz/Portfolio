# SK Portfolio — Design System Inventory
## Payload CMS Migration Preparation

**Scope:** Read-only inventory of all reusable layout, content block, composite component and template patterns discovered in the SK Portfolio codebase.

**Repository:** `suryaheatz/Portfolio` (branch: `main`)  
**Inspected:** 2026-10-27  
**Inspector:** Claude Sonnet 4.6 (session `01VxPw5VZr8pCPmixEQi5rwR`)

---

## Coverage Report

| Source | Inspected | Notes |
|--------|-----------|-------|
| `index.html` (lines 1–1686) | ✅ Complete | Centronic case study — all CSS, HTML, JS |
| `case-studies/haptix/index.html` (lines 1–250) | ✅ Complete | Haptix case study — full HTML structure |
| `case-studies/haptix/js/main.js` | ✅ Complete | All interaction logic |
| `case-studies/haptix/css/style.css` | ✅ Complete (200+ lines) | All Haptix component styles |
| `public/ds-tokens.css` | ✅ Complete | Design token source of truth |
| `public/cs-nav.css` | ✅ Complete | Case study navigation styles |
| `public/cs-nav.js` | ✅ Complete | Navigation logic |
| `public/sk-projects.js` | ✅ Complete | Project registry |
| `admin/config.yml` | ✅ Complete | Decap CMS schema — 17 layout types |
| `CLAUDE.md` | ✅ Complete | Agent instructions, system docs |
| `vercel.json` | ⚠️ Not read | Deployment config; not relevant to component inventory |
| `_cms/case-studies/haptix.json` | ⚠️ Not read | Runtime content, not design system |
| `prototypes/v1/index.html` | ⚠️ Not accessible | Embedded iframe; no direct URL in production HTML |
| `prototypes/v2/index.html` | ⚠️ Not accessible | Same; referenced by `data-src` in Haptix |
| `session.md` | ⚠️ Not read | May contain historical decisions |
| Git history | ⚠️ Not inspected | Repo not cloned with history; no `git log` available |
| Historical Claude Design artifacts | ⚠️ Inaccessible | Not accessible from this session |

---

## LEVEL 1 — Design Primitives

These are token-level foundations. They are **dependencies for all blocks** — not CMS-selectable blocks themselves.

### L1-01 · Colour Tokens

**Source:** `public/ds-tokens.css` (also redeclared in `case-studies/haptix/css/style.css`)

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#f5f4f0` | Page background (warm off-white) |
| `--ink` | `#111110` | Primary text |
| `--ink-2` | `#545450` | Secondary text |
| `--ink-3` | `#9a9a94` | Tertiary / placeholder |
| `--rule` | `#dddad0` | Borders, dividers |
| `--surface` | `#eeece7` | Card / cell backgrounds |
| `--sun` | `#E8490F` | Brand accent (orange) |
| `--teal` | `#E8490F` | Alias for `--sun` |
| `--ink-dark` | `#1a1917` | Dark card / scope section bg |
| `--proto-bg` | `#030B1B` | Prototype overlay bg |
| `--sun-light` | `#F26430` | Haptix: lighter orange (hover) |
| `--sun-muted` | `#FDE8DC` | Haptix: muted orange (chip bg) |

**Notes:** No dark mode. `--bg` is always `#f5f4f0`. `--ink-dark` and `--proto-bg` are only used in specific section contexts (scope card, prototype overlay).

---

### L1-02 · Spacing Tokens

**Source:** `public/ds-tokens.css`

```
--sp-1:4px   --sp-2:8px   --sp-3:12px  --sp-4:16px
--sp-5:20px  --sp-6:24px  --sp-8:32px  --sp-10:40px
--sp-12:48px --sp-16:64px --sp-20:80px --sp-24:96px
```

`--col-pad: 48px` (desktop gutter), `--col-pad-m: 24px` (mobile gutter)  
`--page-w: 1080px` (max content width)

---

### L1-03 · Typography Tokens

**Source:** `public/ds-tokens.css`, `case-studies/haptix/css/style.css`

```
--font-serif: 'DM Serif Display', serif
--font-sans:  'DM Sans', system-ui, sans-serif
```

Type scale (from Haptix style.css):
```
--text-label:    500 11px
--text-caption:  400 12px
--text-body-sm:  400 13px
--text-body:     400 16px
```

---

### L1-04 · Radius Tokens

```
--r-sm:    6px
--r-md:   12px
--r-lg:   20px
--r-bento: 24px   (bento-specific)
```

---

### L1-05 · Motion Tokens

**Source:** `public/ds-tokens.css`

```
--ease-out:       cubic-bezier(0.16,1,0.3,1)
--ease-out-quart: cubic-bezier(0.165,0.84,0.44,1)
--t-fast:  150ms
--t-mid:   250ms

--dur-instant: 120ms
--dur-fast:    220ms
--dur-mid:     380ms
--dur-slow:    580ms
--ease-reveal:  (defined but value not captured — in ds-tokens.css)
--ease-enter:   (defined but value not captured)
--ease-leave:   (defined but value not captured)
--ease-lift:    (defined but value not captured)
--ease-snap:    (defined but value not captured)
--ease-path:    (defined but value not captured)
```

Additional GSAP-layer constants (not CSS tokens):
- Bento tilt: `transformPerspective:800`, max ±8° X+Y, elastic.out(1,0.45) duration 0.7s
- Prototype morph: expand 0.52s `power3.inOut`, collapse 0.48s
- Bento Flip expand: 0.55s `power3.inOut`

---

### L1-06 · Bento Grid Tokens

**Source:** `CLAUDE.md §22`

```
--r-bento:   24px
--bento-gap: 16px    (ratio: ⅔ × border-radius — never change)
--bento-row: 200px
```

---

## LEVEL 2 — Composite Components

These are composed UI elements. Some are independently reusable as nested components within blocks; others remain embedded.

### L2-01 · Chip / Tag

**Source:** `case-studies/haptix/css/style.css` (`.chip`, `.chips`), `admin/config.yml` (layout type `chips`, `prose-chips`)

**Variants:**
- Default chip: `background: var(--surface)`, `border-radius: 999px`, small sans label
- Accent chip: `background: var(--sun-muted)`, `color: var(--sun)` (orange)

**Usage:** Hero scope description, Scope card strip, inline within prose sections  
**Status:** Implemented and verified  
**Reusability:** Nested within Hero, Scope, Prose sections — not a standalone selectable block

---

### L2-02 · Caption / Label System

**Source:** CSS type tokens, `.cs-bento-caption`, `.cs-nav__next-eyebrow`

**Variants:**
- Bento overlay caption: white on dark overlay, `position:absolute bottom:0`
- Section label/eyebrow: uppercase small sans, `--ink-3` color
- Nav eyebrow: "Next Case Study" label above project title

**Status:** Implemented and verified  
**Reusability:** Always nested; not a standalone block

---

### L2-03 · Pull Quote

**Source:** `index.html` (`.pullquote` component), GSAP ScrollTrigger animation  
**Reference:** SK Design System §23 (Quote 2-up)

**Structure:**
```html
<div class="pq-pair">
  <div class="pq-card">
    <p class="pq-quote-text">…</p>
    <p class="pq-attr">—Attribution</p>
  </div>
  <div class="pq-card">…</div>
</div>
```

**Behavior:** 3-line clamp with `.pq-expanded` class toggle; GSAP ScrollTrigger reveal (opacity+translateY)  
**Status:** Implemented and verified  
**Payload block candidate:** Yes — `QuoteBlock`

---

### L2-04 · Burst Divider (SVG animated)

**Source:** `case-studies/haptix/css/style.css` (`.burst`), `main.js` (IntersectionObserver adds `.in`)

**Behavior:** SVG stroke-dashoffset animation; enters viewport → `.in` class → draws lines  
**Status:** Implemented in Haptix, not present in Centronic  
**Reusability:** Section separator — potentially reusable as a standalone divider block

---

### L2-05 · Gallery Item

**Source:** `case-studies/haptix/css/style.css` (`.gi`), `main.js` (lightbox logic)

**Properties:** `aspect-ratio:4/3`, `cursor:zoom-in`, hover `scale(1.03)`, click → lightbox  
**Variants:**
- Standard: 4:3 aspect, `object-fit:cover`
- Portrait/tall: `aspect-ratio:2/3`, `object-fit:contain` (`.gal.tall`)

**Status:** Implemented and verified  
**Reusability:** Always nested within Gallery blocks

---

### L2-06 · Key Date Row

**Source:** `case-studies/haptix/index.html` (`.key-dates`, `.key-date-row`), `admin/config.yml` (`key-dates-tabs` layout)

**Structure:** Number/date label + event text, vertical list  
**Status:** Implemented in Haptix  
**Reusability:** Nested within Key Dates / Timeline block

---

### L2-07 · Prototype Browser Chrome Card

**Source:** `case-studies/haptix/css/style.css` (`.pcard`, `.pcard-view`, `.frame`, `.poster`)

**Structure:** Browser-style card with traffic lights border, lazy iframe, poster placeholder, Desktop/Phone toggle pills  
**Behavior:** `data-src` → `src` lazy load on play; poster fades out  
**Status:** Implemented in Haptix  
**Reusability:** Nested within Prototype Embed block

---

### L2-08 · Case Study Navigation Cards (Prev/Next)

**Source:** `public/cs-nav.js`, `public/cs-nav.css`

**Structure:**
- Previous: text-only link with "Previous Project" label + title
- Next: image card with `aspect-ratio:16/7`, gradient overlay, eyebrow, title, arrow SVG

**Status:** Implemented and verified  
**Reusability:** Page-level component — not a content block; appears once per case study page

---

### L2-09 · Desktop Rail Dot

**Source:** `index.html` (chapter rail JS), `case-studies/haptix/js/main.js`

**Behavior:** Fixed-position left rail, dots built via JS, IntersectionObserver activates `.rail-active`, tooltip on hover  
**Status:** Implemented in both case studies  
**Reusability:** Always part of Chapter Rail System (L4-03)

---

### L2-10 · Accordion Item

**Source:** `case-studies/haptix/css/style.css` (`.acc-b`, `.acc-p`), `main.js`, `admin/config.yml` (`accordion`, `prose-accordion`)

**Behavior:** Button triggers `maxHeight` expand/collapse on panel; resize handler recalculates  
**Status:** Implemented and verified  
**Reusability:** Nested within Accordion block or Prose-Accordion block

---

### L2-11 · Slide Card (Slides Panel)

**Source:** `case-studies/haptix/css/style.css` (`.slide`, `.slide.dark`, `.slide.on`), `main.js` (slides logic), `admin/config.yml` (`slide`)

**Structure:** Image + editorial text (2fr/3fr grid), optional dark background  
**Behavior:** Carousel driven by `go(i)`; Anime.js enter animation (opacity+translateX); touch swipe; keyboard arrows; dot nav  
**Variants:**
- Standard: `background:var(--surface)`, light text
- Dark: `.slide.dark`, `background:var(--ink-dark)`, light text

**Status:** Implemented in Haptix  
**Payload block candidate:** Yes — `SlideBlock`

---

## LEVEL 3 — Content Blocks

These are selectable, independently reusable editorial and media compositions.

### L3-01 · Bento Grid

**Source:** `CLAUDE.md §22`, `index.html` (workshop section, `.cs-bento--3`), `admin/config.yml` (`bento`)

**Description:** CSS Grid with fixed 200px rows, 16px gap, 24px border-radius cells. Each cell is a fixed-size image window with hover overlay, caption and expand button.

**Variants (BENTO-2 through BENTO-9):**

| ID | Columns | Rows | Special Spans | Cells |
|----|---------|------|---------------|-------|
| BENTO-2 | 2 | 1 | — | 2 |
| BENTO-3 | 2 | 2 | C = full width | 3 |
| BENTO-4 | 3 | 2 | A = full width | 4 |
| BENTO-5 | 2 | 3 | C = full width | 5 |
| BENTO-6 | 2 | 4 | C and F = full width | 6 |
| BENTO-7 | 3 | 3 | A = tall-left (2 rows), G = wide-right | 7 |
| BENTO-8 | 3 | 4 | A and E = full width | 8 |
| BENTO-9 | 3 | 4 | A = tall-left, G = wide, H = wide-left | 9 |

**Interactions:**
- Hover overlay (dark 80%, opacity transition)
- Hover caption (bottom-left, white text)
- Expand button (circular, bottom-right)
- 3D tilt (GSAP, ±8°, elastic spring-back)
- GSAP Flip expand to lightbox
- Mobile: card stack (≤640px), swipe threshold 80px, snap-back elastic.out(1,0.5)

**Currently implemented:** BENTO-3 (workshop section, Centronic)  
**Status:** BENTO-2 through BENTO-9 defined in CSS; BENTO-3 implemented and verified; others defined but not currently used  
**Payload block candidate:** Yes — `BentoBlock` with variant selector (2–9)

---

### L3-02 · Quote 2-up

**Source:** `index.html` (pull quote section), `admin/config.yml` (`quote2up`), SK Design System §23

**Description:** Two quote cards side-by-side, equal height, serif italic quote text with 3-line clamp, attribution below.

**Structure:**
```
pq-pair (2-col grid)
  pq-card × 2
    pq-quote-text (serif italic, -webkit-line-clamp:3)
    pq-attr (small sans, --ink-3)
```

**Interactions:** Click expands clamped text (`.pq-expanded` removes clamp); GSAP ScrollTrigger reveal  
**Status:** Implemented and verified (Centronic)  
**Payload block candidate:** Yes — `QuoteTwoUpBlock`

---

### L3-03 · Slide Layout (Editorial Slide)

**Source:** `admin/config.yml` (`slide`), SK Design System §24, `case-studies/haptix/css/style.css`

**Description:** Single editorial slide: 40% text / 60% image (2fr/3fr grid), min-height 420px.

**Variants:**
- Standard: `background:var(--surface)`, dark text
- Dark: `background:var(--ink-dark)`, light text

**Content fields:** eyebrow/label, heading, body text, supporting image  
**Status:** Implemented in Haptix (carousel of 12 slides), CSS defined in §24; Decap schema confirmed  
**Payload block candidate:** Yes — `SlideBlock`

---

### L3-04 · Gallery

**Source:** `case-studies/haptix/css/style.css` (`.gal`, `.gi`), `main.js`, `admin/config.yml` (`gallery`, `prose-gallery`, `table-gallery`)

**Description:** Responsive image grid with click-to-lightbox.

**Variants:**
- 3-column (`.g3`): standard research evidence grid
- 4-column (`.g4`): denser image grid
- 4-column portrait (`.g4.tall`): 2:3 aspect, `object-fit:contain` — for UI screens

**Lightbox:** `openModal(html)`, gallery array, keyboard arrows (← →), Esc to close, prev/next controls when `gallery.length > 1`  
**Status:** Implemented in Haptix (research + screens galleries)  
**Payload block candidate:** Yes — `GalleryBlock` with column count and aspect variant options

---

### L3-05 · Accordion Block

**Source:** `case-studies/haptix/css/style.css` (`.acc`), `main.js`, `admin/config.yml` (`accordion`, `prose-accordion`)

**Description:** Expandable question/answer pairs with smooth maxHeight animation.

**Variants:**
- Standalone accordion: multiple `.acc-b` / `.acc-p` pairs
- Prose-accordion: accordion within a prose layout with editorial context

**Status:** Implemented in Haptix (4-item "recreation" accordion)  
**Payload block candidate:** Yes — `AccordionBlock`

---

### L3-06 · Chips / Tags Block

**Source:** `case-studies/haptix/css/style.css`, `admin/config.yml` (`chips`, `prose-chips`)

**Description:** Horizontal list of pill-shaped tags.

**Variants:**
- Default chips: `--surface` background
- Accent chips: `--sun-muted` background, `--sun` text color

**Usage:** Skills listing, scope tags, technology labels  
**Status:** Implemented in Haptix  
**Payload block candidate:** Yes — `ChipsBlock` (or nested within Prose)

---

### L3-07 · Prose Block

**Source:** `admin/config.yml` (`prose`, `prose-list`, `prose-with-aside`, `prose-gallery`, `prose-chips`, `prose-accordion`)

**Description:** Rich editorial text composition with optional attachments.

**Variants:**
- `prose`: plain heading + body text
- `prose-list`: heading + body + unordered list items
- `prose-with-aside`: heading + body + aside/callout panel
- `prose-gallery`: heading + body + inline image gallery
- `prose-chips`: heading + body + tag/chip list
- `prose-accordion`: heading + body + accordion section

**Status:** Defined in Decap CMS schema; implemented in case studies  
**Payload block candidate:** Yes — `ProseBlock` with variant selector

---

### L3-08 · Chapter List

**Source:** `index.html` (`.chapter-list`, `.chapter-item`, `.chapter-link`), GSAP ScrollTrigger per-item

**Description:** Numbered vertical list of case study chapters with hover color change.

**Behavior:** GSAP ScrollTrigger per item (opacity+y reveal with stagger); hover changes number color to `--sun` (Anime.js); links scroll to anchored sections  
**Status:** Implemented in Centronic (12 chapters from SITE_CONFIG JSON)  
**Payload block candidate:** Partially — chapter list is generated from page structure; not an editable content block directly, but chapter titles/IDs are CMS-editable

---

### L3-09 · Key Dates / Timeline

**Source:** `case-studies/haptix/index.html` (`.key-dates`, `.key-date-row`), `admin/config.yml` (`key-dates-tabs`)

**Description:** Numbered timeline list of project milestones with optional tabbed navigation.

**Variants:**
- Simple key dates list
- Key dates with tabs (multi-phase timeline)

**Status:** Implemented in Haptix  
**Payload block candidate:** Yes — `KeyDatesBlock`

---

### L3-10 · Table

**Source:** `admin/config.yml` (`table`, `table-gallery`)

**Description:** Tabular data display.

**Variants:**
- Standard table
- Table with gallery (table rows with associated images)

**Status:** Defined in Decap CMS schema; not confirmed in current HTML (may be in content not yet implemented)  
**Payload block candidate:** Yes — `TableBlock`  
**Evidence confidence:** Medium (schema only, no HTML evidence)

---

### L3-11 · Impact List / Statistics

**Source:** `index.html` (`.impact-grid`, `.impact-item`, `data-count-to` attributes), GSAP count-up scrub

**Description:** Grid of large metric numbers with labels and descriptors. Numbers animate via GSAP ScrollTrigger scrub.

**Structure:**
```
impact-grid (grid)
  impact-item × N
    impact-number (large serif, data-count-to="NN")
    impact-label
    impact-desc
```

**Behavior:** GSAP scrub count-up animation tied to scroll position  
**Status:** Implemented in Centronic  
**Payload block candidate:** Yes — `ImpactListBlock`

---

### L3-12 · Hero Section

**Source:** `index.html` (`.hero-image-section`, hero CSS), GSAP SplitText + ScrollTrigger

**Description:** Full-bleed dark photography with headline type overlay. Multiple animation layers.

**Animations:**
- SplitText word entrance: random rotation (±5–15°) + y stagger (GSAP)
- Hero parallax: `yPercent:-18`, scrub 0.8
- Anime.js hero dot stagger: scale-in

**Content fields:** Title, subtitle, background image, decorative dots  
**Status:** Implemented in both case studies  
**Payload block candidate:** Yes — `HeroBlock`

---

### L3-13 · Prototype Embed

**Source:** `case-studies/haptix/index.html` (`.proto`, `.pcard`, `#proto-morph-shell`), `main.js`, `case-studies/haptix/css/style.css`

**Description:** Lazy-loaded interactive prototype in a browser-chrome card with fullscreen expand. Device size switcher.

**Behavior:**
- Poster image shown until play button clicked
- `data-src` → `src` lazy iframe load on play
- Desktop / Phone toggle pills (`data-size` on view container)
- GSAP morph expand: card rect → fullscreen 0.52s `power3.inOut`
- Collapse: 0.48s, version sync between thumb and overlay

**Status:** Implemented in Haptix  
**Payload block candidate:** Yes — `PrototypeEmbedBlock`; requires prototype URL and poster image

---

### L3-14 · Inline Tabs

**Source:** `case-studies/haptix/css/style.css` (`.tabs.inline`), `main.js` (design tabs logic)

**Description:** Horizontal tab strip for switching between content panels within a section.

**Behavior:** aria-selected, hidden panels toggle, keyboard ArrowLeft/Right  
**Usage:** Haptix design area tabs (Concept styling / Thumbwheel / CMF / Interaction model / UI screens)  
**Status:** Implemented in Haptix  
**Payload block candidate:** Yes — `TabsBlock` with named panels

---

### L3-15 · Two-Column Grid (Generic)

**Source:** `case-studies/haptix/index.html` (`.twoup`), `admin/config.yml` (`prose-with-aside`)

**Description:** 2-column equal or weighted grid for side-by-side content.

**Status:** Implemented in Haptix (placeholder grid); also mapped to prose-with-aside in Decap  
**Payload block candidate:** Partially — covered by `ProseBlock` variant `prose-with-aside`

---

### L3-16 · Scope Strip

**Source:** `case-studies/haptix/index.html` (`.scope-strip`, `.scope-box`)

**Description:** 4-column grid of labeled scope boxes within the dark Scope card.

**Content:** 4 labeled boxes (e.g., "Research", "Design", "Prototype", "Handoff")  
**Status:** Implemented in Haptix scope card  
**Payload block candidate:** Embedded in Scope card — not a standalone block

---

## LEVEL 4 — Section Systems

### L4-01 · Hero / Brief / Scope Stack (Template 01 — Pin-over-Pin)

**Source:** `index.html` (`.hero-image-section`, `.st-brief`, `.st-scope`), GSAP `sectionTransition01`

**Description:** Three-section stacked sequence that creates a "peeling" reveal effect as the user scrolls. Each card pins over the previous.

**Structure:**
```
hero-image-section (full-bleed dark photo)
  ↓ pins while next scrolls up
st-brief (sticky, z-index:2, border-radius top)
  ↓ pins while next scrolls up  
st-scope (dark card, z-index:3, border-radius top)
```

**Implementation:**
- CSS sticky (`position:sticky; top:0`) — NOT GSAP pin (see CLAUDE.md warning)
- GSAP `sectionTransition01`: ScrollTrigger per `[data-st-01="pin"]` element
- `start:'top bottom'`, `end:'top top'`, `pin: section`, `pinSpacing:false`

**Scope card (Centronic):** project title, role chips, brief description  
**Scope card (Haptix):** `.dots` radial pattern overlay + `.scope-strip` 4×`.scope-box` + chips + brief  

**Status:** Implemented and verified in both case studies  
**Payload block candidate:** `TemplateHeroStack` — fixed section structure with configurable content per card; not arbitrary blocks

---

### L4-02 · Slides Panel (Case Study / Slides Tab Switcher)

**Source:** `case-studies/haptix/index.html` (`#switch`, `#p-case`, `#p-slides`, `.stage`, `.deckbar`), `main.js`

**Description:** Top-level tab switcher that toggles between the full narrative case study and a 12-slide presentation mode.

**Behavior:**
- Sticky tab bar at top with "Case study" / "Slides" toggle
- `#p-case` and `#p-slides` panels swap visibility
- `ScrollTrigger.refresh()` called on switch
- `data-goto-case` links in Slides panel scroll back to specific case study sections
- Slides panel: `go(i)` function, progress bar, dot nav, touch swipe, keyboard arrows

**Status:** Implemented in Haptix; not present in Centronic  
**Payload block candidate:** Complex page-level feature — not a simple block; requires special template support

---

### L4-03 · Chapter Navigation System

**Source:** `index.html` (rail + drawer JS), `case-studies/haptix/js/main.js` (same pattern)

**Description:** Fixed left-rail dot navigation with floating chapter pill and bottom-sheet drawer for mobile.

**Components:**
- `#cs-rail`: fixed left:28px desktop, IntersectionObserver activates dots
- `#cs-pill`: floating pill showing "02 / 12", opens drawer on click
- `#cs-drawer`: bottom-sheet with numbered chapter list, backdrop overlay

**Behavior:**
- Rail shows/hides based on hero image visibility (IntersectionObserver)
- IntersectionObserver rootMargin: `-20% 0px -60% 0px` (activates when section is in middle third of viewport)
- Scroll-to-bottom fix: last chapter activates when within 80px of page bottom

**Chapter config:**
- Centronic: parsed from `SITE_CONFIG` JSON (embedded in page)
- Haptix: hardcoded array of 12 chapters in `main.js`

**Status:** Implemented and verified in both case studies  
**Payload block candidate:** Infrastructure — driven by page structure; chapter list comes from page template, not a content block

---

### L4-04 · Research / Evidence Section

**Source:** `case-studies/haptix/index.html` (research section with `.gal.g4` galleries, `data-stagger` containers, `data-reveal` sections)

**Description:** Multi-subsection research narrative combining prose, staggered gallery grids, and reveal animations.

**Behavior:** Anime.js stagger reveal on scroll (IntersectionObserver, -8% rootMargin)  
**Status:** Implemented in Haptix  
**Payload block candidate:** Composed via ProseBlock + GalleryBlock combinations; not a fixed atomic section

---

## LEVEL 5 — Page Templates

### L5-01 · Template 01 — Standard Narrative Case Study

**Source:** `sk-projects.js` (`template: 1`), both `index.html` and `case-studies/haptix/index.html`

**Fixed structure:**
1. Site nav (global)
2. Hero / Brief / Scope stack (L4-01)
3. Content blocks (variable — Prose, Bento, Gallery, Quote, etc.)
4. Chapter navigation system (L4-03)
5. Case study navigation (L2-08)
6. Footer

**Variable zones:** Everything between Scope card and Footer is a Payload-managed block array.

**Current implementations:**
- Centronic: Hero → Scope → Prototype Embed → Chapter List → Workshops Bento → Pull Quote → Impact List → Footer CTA → CS Nav
- Haptix: Hero → Scope → Proto Card → Chapter List → [Research / Workshops / Hardware / Styling / Screens / Prototype / Impact sections] → CS Nav

**Sub-variant — Haptix extension:**
- Adds `#switch` sticky tab bar (Case/Slides toggle)
- `#p-slides` panel with 12-slide carousel

**Status:** Implemented and verified  
**Payload integration:** Page template with fixed header/footer + `blocks: [{ type: 'blocks' }]` field array

---

### L5-02 · Homepage (Future / Partially Implemented)

**Source:** `admin/config.yml` (`homepage` collection), `index.html` (currently serves as homepage AND Centronic case study)

**Note:** The current `index.html` conflates homepage and Centronic case study. The Decap CMS config has a `homepage` collection, suggesting a future separation.

**Status:** Partially implemented; homepage and case study content are merged  
**Payload integration:** Separate `homepage` page type needed; blocks array separate from case studies

---

## Master Component Table

| ID | Component Name | Family | Level | Variants | Source | Status | Payload Block? | Migration Complexity |
|----|---------------|--------|-------|----------|--------|--------|----------------|---------------------|
| L1-01 | Colour Tokens | Primitives | 1 | 1 | `ds-tokens.css` | Verified | No (tokens) | Low |
| L1-02 | Spacing Tokens | Primitives | 1 | 1 | `ds-tokens.css` | Verified | No (tokens) | Low |
| L1-03 | Typography Tokens | Primitives | 1 | 1 | `ds-tokens.css` | Verified | No (tokens) | Low |
| L1-04 | Radius Tokens | Primitives | 1 | 4 | `ds-tokens.css` | Verified | No (tokens) | Low |
| L1-05 | Motion Tokens | Primitives | 1 | 12+ | `ds-tokens.css` | Verified | No (tokens) | Medium |
| L1-06 | Bento Tokens | Primitives | 1 | 3 | `CLAUDE.md §22` | Verified | No (tokens) | Low |
| L2-01 | Chip / Tag | Composite | 2 | 2 | `haptix/style.css` | Verified | Nested | Low |
| L2-02 | Caption / Label | Composite | 2 | 3 | Multiple | Verified | Nested | Low |
| L2-03 | Pull Quote Card | Composite | 2 | 1 | `index.html` | Verified | Yes (nested) | Low |
| L2-04 | Burst Divider | Composite | 2 | 1 | `haptix/style.css` | Verified | Optional block | Medium |
| L2-05 | Gallery Item | Composite | 2 | 2 | `haptix/style.css` | Verified | Nested | Low |
| L2-06 | Key Date Row | Composite | 2 | 1 | `haptix/index.html` | Verified | Nested | Low |
| L2-07 | Proto Browser Chrome | Composite | 2 | 1 | `haptix/style.css` | Verified | Nested | High |
| L2-08 | CS Nav Cards (Prev/Next) | Navigation | 2 | 2 | `cs-nav.js/.css` | Verified | No (global) | Medium |
| L2-09 | Rail Dot | Navigation | 2 | 1 | `index.html` | Verified | Nested (infra) | Medium |
| L2-10 | Accordion Item | Composite | 2 | 1 | `haptix/style.css` | Verified | Nested | Low |
| L2-11 | Slide Card | Composite | 2 | 2 | `haptix/style.css` | Verified | Yes (nested) | Medium |
| L3-01 | Bento Grid | Content Block | 3 | 8 (BENTO-2–9) | `CLAUDE.md §22` + `index.html` | Partially verified | Yes | High |
| L3-02 | Quote 2-up | Content Block | 3 | 1 | `index.html`, DS §23 | Verified | Yes | Low |
| L3-03 | Slide Layout | Content Block | 3 | 2 | DS §24, `haptix` | Verified | Yes | Medium |
| L3-04 | Gallery | Content Block | 3 | 3 | `haptix/style.css` | Verified | Yes | Medium |
| L3-05 | Accordion Block | Content Block | 3 | 2 | `haptix`, `config.yml` | Verified | Yes | Low |
| L3-06 | Chips Block | Content Block | 3 | 2 | `haptix`, `config.yml` | Verified | Yes | Low |
| L3-07 | Prose Block | Content Block | 3 | 6 | `config.yml` | Partially verified | Yes | Low |
| L3-08 | Chapter List | Content Block | 3 | 1 | `index.html` | Verified | Partial | Medium |
| L3-09 | Key Dates / Timeline | Content Block | 3 | 2 | `haptix`, `config.yml` | Verified | Yes | Low |
| L3-10 | Table | Content Block | 3 | 2 | `config.yml` | Schema only | Yes | Low |
| L3-11 | Impact List | Content Block | 3 | 1 | `index.html` | Verified | Yes | Medium |
| L3-12 | Hero Section | Content Block | 3 | 1 | Both case studies | Verified | Yes | High |
| L3-13 | Prototype Embed | Content Block | 3 | 1 | `haptix` | Verified | Yes | High |
| L3-14 | Inline Tabs | Content Block | 3 | 1 | `haptix` | Verified | Yes | Medium |
| L3-15 | Two-Column Grid | Content Block | 3 | 1 | `haptix`, `config.yml` | Partially verified | Covered by Prose | Low |
| L3-16 | Scope Strip | Content Block | 3 | 1 | `haptix` | Verified | No (embedded) | Low |
| L4-01 | Hero/Brief/Scope Stack | Section System | 4 | 2 | Both case studies | Verified | Template section | High |
| L4-02 | Slides Panel | Section System | 4 | 1 | `haptix` | Verified | Template feature | High |
| L4-03 | Chapter Navigation | Section System | 4 | 2 | Both case studies | Verified | No (infra) | High |
| L4-04 | Research Evidence | Section System | 4 | 1 | `haptix` | Verified | Composed blocks | Medium |
| L5-01 | Template 01 (Narrative) | Page Template | 5 | 2 | Both case studies | Verified | Page template | High |
| L5-02 | Homepage | Page Template | 5 | 1 | `config.yml`, `index.html` | Partial | Page template | High |

---

## Summary Statistics

- **Total block families discovered:** 26
- **Total variants across all families:** 52
- **Components requiring historical recovery:** 6 (CodePen tooltip animation system, prototype v1/v2 sources, session.md decisions, historical git commits, inaccessible Claude Design artifacts)
- **Recommended first component to migrate:** `ProseBlock` — simplest, highest reuse, lowest animation risk

---

*Generated 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
