# SK Portfolio — Block Variant Matrix
## Payload CMS Migration Preparation

**Scope:** Comparison of all layout variants, capabilities, configurable settings and reusability constraints for every candidate Payload content block.

**Generated:** 2026-10-27

---

## How to Read This Document

Each block entry lists:
- All confirmed variants (with source evidence)
- Configurable settings vs. fixed structure
- Reusability constraints
- Content capabilities (what editors can set)

**Evidence levels:**
- ✅ Implemented and verified in production HTML
- 🟡 Defined in CSS/schema but not confirmed in live pages
- 🔴 Missing or inaccessible (historical only)

---

## BK-01 · Prose Block

**Block ID:** `BK-01`  
**Family:** Editorial Text  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Source | Status | Description |
|-----------|------|--------|--------|-------------|
| BK-01-A | Prose | `config.yml` | 🟡 Schema only | Heading + body text. No attachments. |
| BK-01-B | Prose with List | `config.yml` | 🟡 Schema only | Heading + body + unordered list items. |
| BK-01-C | Prose with Aside | `config.yml` | 🟡 Schema only | Heading + body + right aside panel. |
| BK-01-D | Prose with Gallery | `config.yml` | 🟡 Schema only | Heading + body + inline image gallery. |
| BK-01-E | Prose with Chips | `config.yml` | ✅ Verified | Heading + body + tag/chip list. |
| BK-01-F | Prose with Accordion | `config.yml` | ✅ Verified | Heading + body + expandable accordion. |

### Configurable Settings
- Variant selector (A–F)
- Heading level (h2 / h3)
- Heading text
- Body text (rich text — paragraphs, strong, em, links)
- Aside content (BK-01-C only): label + body
- List items (BK-01-B only): ordered array of strings
- Gallery images (BK-01-D): see GalleryBlock settings
- Chips (BK-01-E): see ChipsBlock settings
- Accordion items (BK-01-F): see AccordionBlock settings

### Fixed Structure
- Single-column layout at mobile
- Typography governed entirely by design tokens
- No background customization (always `--bg`)

### Reusability
- ✅ Can appear multiple times per page
- ✅ Can appear on multiple page templates
- ✅ Can be reordered
- ❌ Cannot be nested within another block (always top-level)

### Animation
- Scroll reveal via `data-reveal` (Anime.js, opacity+y, 700ms outExpo)
- Staggered children via `data-stagger` (40ms delay between children)

---

## BK-02 · Bento Grid Block

**Block ID:** `BK-02`  
**Family:** Media Grid  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Grid | Rows | Special | Cells | Status |
|-----------|------|------|------|---------|-------|--------|
| BK-02-2 | Bento 2 | 2 col | 1 | None | 2 | 🟡 CSS defined |
| BK-02-3 | Bento 3 | 2 col | 2 | C=full width | 3 | ✅ Verified (workshop section) |
| BK-02-4 | Bento 4 | 3 col | 2 | A=full width | 4 | 🟡 CSS defined |
| BK-02-5 | Bento 5 | 2 col | 3 | C=full width | 5 | 🟡 CSS defined |
| BK-02-6 | Bento 6 | 2 col | 4 | C+F=full width | 6 | 🟡 CSS defined |
| BK-02-7 | Bento 7 | 3 col | 3 | A=tall-left, G=wide | 7 | 🟡 CSS defined |
| BK-02-8 | Bento 8 | 3 col | 4 | A+E=full width | 8 | 🟡 CSS defined |
| BK-02-9 | Bento 9 | 3 col | 4 | A=tall-left, G+H=wide | 9 | 🟡 CSS defined |

### Configurable Settings (per cell)
- Image source URL
- Image alt text
- Caption text (shown on hover)
- Lightbox enabled (yes/no — all cells currently lightbox-capable)

### Fixed Structure
- Cell count = variant choice (cannot mix)
- Row height: always `200px` base (`--bento-row`)
- Gap: always `16px` (`--bento-gap`)
- Border radius: always `24px` (`--r-bento`)
- `object-fit: cover` always — no contain option
- Image anchor: always `center center`

### Reusability
- ✅ Can appear multiple times per page
- ✅ Can appear on multiple page templates
- ✅ Can be reordered
- ❌ Cannot be nested (animation complexity)

### Animation
- Hover: 3D tilt ±8° (GSAP, `transformPerspective:800`, elastic.out(1,0.45), 0.7s)
- Hover: overlay opacity transition (`--t-mid`)
- Expand: GSAP Flip (0.55s `power3.inOut`, nested:true)
- Mobile: card stack (swipe, elastic snap-back)

### Notes
- Cell type is currently always "image cell". Text-only cells are possible but not implemented.
- The mobile card stack independently manages its own clone/swipe system — no CSS media query involvement.

---

## BK-03 · Quote 2-up Block

**Block ID:** `BK-03`  
**Family:** Editorial Pull Quote  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-03-A | Two Quote Cards | ✅ Verified |

**Note:** No other variants confirmed. Single-quote or 3+ quote arrangements are not implemented.

### Configurable Settings (per card — always 2 cards)
- Quote text (serif italic)
- Attribution text (name / role)

### Fixed Structure
- Always 2 cards side-by-side (1fr 1fr grid)
- 3-line clamp on quote text; click to expand
- Attribution always below quote text
- Background: `--surface`; padding: `--sp-8`; radius: `--r-lg`

### Reusability
- ✅ Can appear multiple times per page
- ✅ Can appear on multiple page templates
- ✅ Can be reordered

### Animation
- GSAP ScrollTrigger reveal

---

## BK-04 · Slide Block

**Block ID:** `BK-04`  
**Family:** Editorial Slide  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Background | Text Color | Status |
|-----------|------|-----------|-----------|--------|
| BK-04-A | Standard Slide | `--surface` | `--ink` | ✅ Verified |
| BK-04-B | Dark Slide | `--ink-dark` | `--bg` (white) | ✅ Verified (`.slide.dark`) |

### Configurable Settings
- Variant (A or B)
- Eyebrow / label text
- Heading text
- Body text
- Image (right column, 60% width)

### Fixed Structure
- Grid: `2fr 3fr` (40% text / 60% image) at desktop
- Single column at mobile (≤640px)
- Min-height: 420px
- Image: `object-fit:cover`, `object-position:center center`
- Border radius: `--r-lg`

### Reusability
- ✅ Can appear multiple times per page
- ✅ When multiple slides appear in sequence, a carousel can be activated (Haptix pattern)
- ✅ Can be reordered

### Notes
- In Haptix, 12 slides form a carousel panel with separate navigation UI. In Payload, a "Slides carousel" arrangement should be modeled separately (see L4-02 in hierarchy).
- A single `SlideBlock` appearing standalone (e.g., inside `#p-case`) is a different use case from the carousel.

---

## BK-05 · Gallery Block

**Block ID:** `BK-05`  
**Family:** Image Gallery  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Columns | Aspect | `object-fit` | Status |
|-----------|------|---------|--------|-------------|--------|
| BK-05-A | 3-column gallery | 3 | 4:3 | cover | ✅ Verified |
| BK-05-B | 4-column gallery | 4 | 4:3 | cover | ✅ Verified |
| BK-05-C | 4-column portrait gallery | 4 | 2:3 | contain | ✅ Verified (screens) |

### Configurable Settings (per item)
- Image URL
- Caption text (`data-cap`)
- Alt text
- Flip ID (for GSAP Flip — optional)

### Block-level settings
- Variant (A, B, or C)
- Optional: section heading

### Fixed Structure
- Hover: `scale(1.03)`, transition
- Click → lightbox modal (shared with all gallery items in the block)
- Lightbox: image + caption + prev/next controls (when count > 1) + keyboard arrows + Esc

### Reusability
- ✅ Can appear multiple times per page
- ✅ Multiple galleries per page each have independent lightbox state (gallery array per `.gal` container)

---

## BK-06 · Accordion Block

**Block ID:** `BK-06`  
**Family:** Expandable Content  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-06-A | Standalone Accordion | ✅ Verified |
| BK-06-B | Prose-Accordion (within Prose) | 🟡 Schema defined |

### Configurable Settings (per item)
- Question / heading text
- Answer / body text (rich text)
- Initial state (open / closed — not currently implemented, always starts closed)

### Fixed Structure
- `maxHeight` expand/collapse (no fixed height)
- Resize listener updates open panel height
- `aria-expanded` attribute toggled

### Reusability
- ✅ Can appear multiple times per page
- ✅ Independent expand state per block
- ✅ Can be reordered
- ❌ Cannot be nested within Bento

---

## BK-07 · Chips Block

**Block ID:** `BK-07`  
**Family:** Tags / Labels  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Style | Status |
|-----------|------|-------|--------|
| BK-07-A | Default Chips | `--surface` bg | ✅ Verified |
| BK-07-B | Accent Chips (mixed) | Mix of default + `--sun-muted`/`--sun` | ✅ Verified |

### Configurable Settings (per chip)
- Label text
- Accent variant (yes/no)

### Fixed Structure
- Flex wrap layout
- Pill shape (`border-radius: 999px`)
- Small label (`--text-label` scale)

### Reusability
- ✅ Can appear multiple times
- ✅ Also appears nested within Prose and Hero sections

---

## BK-08 · Key Dates / Timeline Block

**Block ID:** `BK-08`  
**Family:** Timeline / Milestones  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-08-A | Key Dates List | ✅ Verified |
| BK-08-B | Key Dates with Tabs | 🟡 Schema defined (`key-dates-tabs`) |

### Configurable Settings (per row)
- Date or number label
- Event / milestone description

### Block-level settings (BK-08-B)
- Tab labels (for multi-phase timeline)
- Items per tab

### Reusability
- ✅ Can appear multiple times per page

---

## BK-09 · Table Block

**Block ID:** `BK-09`  
**Family:** Tabular Data  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-09-A | Standard Table | 🟡 Schema defined |
| BK-09-B | Table with Gallery | 🟡 Schema defined |

### Configurable Settings
- Column headers
- Row data (cells)
- Gallery images per row (BK-09-B)

### Evidence Note
No table HTML found in inspected case study pages. Schema-only evidence from `admin/config.yml`.

---

## BK-10 · Impact List Block

**Block ID:** `BK-10`  
**Family:** Statistics / Metrics  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-10-A | Impact Grid | ✅ Verified |

### Configurable Settings (per item)
- Number value (`data-count-to`)
- Unit suffix (e.g., "%", "x", "ms")
- Label text
- Description text

### Block-level settings
- Optional section heading
- Grid columns (2 or 3 — not currently configurable, hardcoded to grid layout)

### Animation
- GSAP count-up scrub: number animates from 0 → target as user scrolls through section
- `data-count-to` attribute drives the animation

### Reusability
- ✅ Can appear once per page (multiple instances untested — GSAP selector conflict risk)
- ⚠️ Should verify GSAP selector uniqueness if used multiple times

---

## BK-11 · Hero Block

**Block ID:** `BK-11`  
**Family:** Hero / Page Header  
**Level:** L3 Content Block (constrained to page top)

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-11-A | Full-bleed Dark Hero | ✅ Verified |

### Configurable Settings
- Background image (full-bleed dark photography)
- Project title (headline — GSAP SplitText entrance)
- Subtitle / role text
- Decorative dot pattern (presence only — no configurable count)

### Fixed Structure
- Full viewport height
- Dark background with dark overlay
- White/light text
- Parallax on scroll (`yPercent:-18`)

### Constraint
- Must appear first in the block array (before Brief/Scope cards)
- Only one per page

---

## BK-12 · Prototype Embed Block

**Block ID:** `BK-12`  
**Family:** Interactive Media  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-12-A | Single Version Prototype | 🟡 Partial |
| BK-12-B | Two-Version Prototype (V1/V2) | ✅ Verified (Haptix) |

### Configurable Settings
- Prototype URL (V1)
- Prototype URL V2 (optional)
- Poster image URL
- Version labels (V1 label, V2 label — e.g., "V2 Recreation", "V1 Original")
- Device mode support (Desktop only / Desktop+Phone / Phone only)

### Fixed Structure
- Browser chrome card (`.pcard`) with traffic light dots
- Poster image visible until interaction
- Lazy iframe load on play
- GSAP morph expand to fullscreen on "↗ Expand" button
- Version switcher synced between card and expanded overlay

### Animation
- GSAP Flip morph: card rect → viewport (0.52s `power3.inOut`)
- Collapse: 0.48s
- Esc key to close

### Reusability
- 🟡 Only used once (Haptix). Multiple instances per page untested — GSAP morph requires unique anchor elements.

---

## BK-13 · Inline Tabs Block

**Block ID:** `BK-13`  
**Family:** Tabbed Content  
**Level:** L3 Content Block

### Variants

| Variant ID | Name | Status |
|-----------|------|--------|
| BK-13-A | Inline Tabs | ✅ Verified (Haptix design tabs) |

### Configurable Settings (per tab)
- Tab label
- Panel content (currently authored as HTML; for Payload: sub-blocks array)

### Fixed Structure
- Horizontal tab strip with `aria-selected` states
- Keyboard ArrowLeft/Right navigation
- Panel visibility toggled with `hidden` attribute

### Reusability
- ✅ Can appear multiple times per page
- ⚠️ Tab panel sub-blocks in Payload require nested block array support (Payload `blocks` within a block field)

---

## Reusability Constraint Summary

| Block | Multi-page | Multi-instance | Nested | Reorderable | Requires Adjacent Block |
|-------|-----------|---------------|--------|-------------|------------------------|
| BK-01 Prose | ✅ | ✅ | ❌ | ✅ | No |
| BK-02 Bento | ✅ | ✅ | ❌ | ✅ | No |
| BK-03 Quote 2-up | ✅ | ✅ | ❌ | ✅ | No |
| BK-04 Slide | ✅ | ✅ | ❌ | ✅ | No (solo) / Yes (carousel) |
| BK-05 Gallery | ✅ | ✅ | ❌ | ✅ | No |
| BK-06 Accordion | ✅ | ✅ | ❌ | ✅ | No |
| BK-07 Chips | ✅ | ✅ | ✅ (in Prose) | ✅ | No |
| BK-08 Key Dates | ✅ | ✅ | ❌ | ✅ | No |
| BK-09 Table | ✅ | ✅ | ❌ | ✅ | No |
| BK-10 Impact List | ✅ | ⚠️ (untested) | ❌ | ✅ | No |
| BK-11 Hero | ✅ | ❌ (1 per page) | ❌ | ❌ (must be first) | Yes (Brief/Scope follow) |
| BK-12 Prototype | ✅ | ⚠️ (untested) | ❌ | ✅ | No |
| BK-13 Tabs | ✅ | ✅ | ✅ (sub-blocks) | ✅ | No |
| BK-14 Statistical Chart | ✅ | ✅ | ❌ | ✅ | No |
| BK-15 Case Media | ✅ | ✅ | ❌ | ✅ | No |

---

## BK-14 · Statistical Chart Block — Added G6.1

**Block ID:** `BK-14`  
**Family:** Statistical Visualization  
**Level:** L3 Content Block  
**Rule:** SK Design System §25 / `sk-data-viz/SKILL.md`

### Variants

| Variant ID | Name | Rendering Engine | Status | Description |
|-----------|------|-----------------|--------|-------------|
| BK-14-A | Horizontal Ranked Bar | Observable Plot | ✅ Approved reference (`sk-bar-chart.js`) | Survey results, ranked comparisons |
| BK-14-B | Line Chart | Observable Plot | 🟡 Specified, not yet implemented | Time series, trends |
| BK-14-C | Scatterplot | Observable Plot | 🟡 Specified, not yet implemented | Correlation analysis |

### Settings

| Setting | Type | Notes |
|---------|------|-------|
| `chartType` | Enum (`bar` / `line` / `scatter`) | Selects variant |
| `dataSource` | JSON upload or inline array | `sk-data-viz/data/<id>.json` schema |
| `title` | String | Chart heading |
| `subtitle` | String | Optional sub-heading |
| `source` | String | Attribution line (e.g. "KPMG Global Tech Report 2024") |
| `unit` | String | Axis unit label (e.g. "% of respondents") |
| `note` | String | Optional methodology note |

### Constraints

- Observable Plot is the mandatory rendering engine for all new charts. No custom statistical renderers without approval.
- `sk-bar-chart.js` is a reference implementation only — do not modify or migrate it.
- Left-aligned category labels always. Never right-align.
- Raw data editors must never appear on public-facing pages.

---

## BK-15 · Case Media Block — Added G6.1

**Block ID:** `BK-15`  
**Family:** Case Study Media  
**Level:** L3 Content Block  
**Rule:** SK Design System §26 / `sk-case-media/SK-CASE-MEDIA-001.md`

### Variants

| Variant ID | Pattern | `object-fit` | Status | Use when |
|-----------|---------|-------------|--------|----------|
| BK-15-A | Full-Width Figure | `contain` | ✅ Approved (`.fig-full` CSS defined) | Single important image; no cropping acceptable |
| BK-15-B | Adaptive Bento | `cover` | ✅ Approved (§22 system reused) | Multiple images with compatible proportions; cropping safe |
| BK-15-C | Two-Up Comparison | `contain` | ✅ Approved (`.twoup` confirmed in Haptix) | Before/after, V1/V2, related states |
| BK-15-D | Evolution / Sequence | `contain` | ✅ Approved | Temporal or process order |
| BK-15-E | Annotated Media | `contain` | ✅ Approved | Technical callouts, gesture maps, hardware specs |
| BK-15-F | Evidence Gallery | `cover`/`contain` | ✅ Approved (`SK-CASE-GALLERY-001` spec) | Large secondary collections |

### Settings

| Setting | Type | Notes |
|---------|------|-------|
| `pattern` | Enum (A–F) | Selects which media pattern to use |
| `images[]` | Upload array | All images in the `I[]` shared object — never duplicate base64 |
| `caption` | String | Per-image caption |
| `alt` | String | Accessibility alt text |
| `expandable` | Boolean | Whether fullscreen viewer is available |

### Constraints

- `object-fit: contain` is the default for evidentiary content (wireframes, IA diagrams, research maps, workshop scans, annotated screenshots). Never use `cover` on these.
- Bento (BK-15-B) is NOT the default pattern — evaluate content type first.
- Evidence Gallery (BK-15-F): images wired from shared `I[]` object; never duplicate base64.
- GSAP + Flip required for gallery transitions (BK-15-F).
- Never crop wireframes, IA diagrams, research maps, workshop scans, or annotated screenshots.

---

*Generated 2026-10-27 · Updated G6.1 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
