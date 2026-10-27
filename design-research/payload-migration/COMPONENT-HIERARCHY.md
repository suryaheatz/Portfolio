# SK Portfolio — Component Hierarchy
## Payload CMS Migration Preparation

**Scope:** Relationships between design primitives, nested components, selectable blocks, section systems and page templates.

**Generated:** 2026-10-27

---

## Hierarchy Overview

```
PAGE TEMPLATE (L5)
├── SECTION SYSTEMS (L4)
│   ├── CONTENT BLOCKS (L3) ← Selectable in Payload
│   │   ├── COMPOSITE COMPONENTS (L2) ← Nested, not selectable
│   │   │   └── DESIGN PRIMITIVES (L1) ← Token dependencies
│   │   └── DESIGN PRIMITIVES (L1)
│   └── DESIGN PRIMITIVES (L1)
└── GLOBAL COMPONENTS (navigation, rail — not content blocks)
```

---

## Level 1 → Level 2 Dependencies

All composite components inherit from the L1 token set. The following specific dependencies are notable:

| Composite Component | Critical Token Dependencies |
|--------------------|-----------------------------|
| Bento Cell (in Bento Grid) | `--r-bento`, `--bento-gap`, `--bento-row`, `--surface`, `--ink` |
| Pull Quote Card | `--font-serif`, `--surface`, `--r-lg`, `--sp-8` |
| Burst Divider | `--sun`, `--ease-out`, `--t-mid` (SVG stroke animation) |
| Gallery Item | `--r-md`, `--ease-out`, `--t-mid` |
| Slide Card | `--font-serif`, `--surface` / `--ink-dark`, `--col-pad`, `--r-lg` |
| Chip / Tag | `--surface`, `--sun-muted`, `--sun`, `--r-sm` |
| Accordion Item | `--rule`, `--ink`, `--ease-out`, `--t-mid` |

---

## Level 2 → Level 3 Containment

Each content block that accepts nested components:

### Bento Grid (L3-01) contains:
- Bento Cell (L2 — fixed-size image window)
  - `cs-bento-overlay` (hover dark overlay)
  - `cs-bento-caption` (hover text)
  - `cs-bento-expand` (expand button)
- Optional: text cards (no image, surface background only)

**Constraint:** All cells must be direct children of `.cs-bento`. No intermediate wrappers. Cell count must match the `BENTO-N` variant (2–9 cells).

---

### Quote 2-up (L3-02) contains:
- Pull Quote Card × 2 (L2-03)
  - Quote text (serif, italic, 3-line clamp)
  - Attribution text

**Constraint:** Always exactly 2 cards. Not variable count.

---

### Slides Panel (L4-02) contains:
- Slide Card × N (L2-11)
  - Eyebrow / label
  - Heading
  - Body text
  - Image (60% column)

**Constraint:** Slide count drives the `.deckbar` progress bar. Currently 12 slides in Haptix. Cards must be ordered.

---

### Gallery (L3-04) contains:
- Gallery Item × N (L2-05)
  - Image
  - Caption (`data-cap` attribute)
  - Alt text (`data-src`, `data-flip-id`)

**Constraint:** Gallery variant (g3/g4/tall) must be chosen at the block level. Items share one lightbox gallery array per `.gal` container.

---

### Accordion Block (L3-05) contains:
- Accordion Item × N (L2-10)
  - Question / heading (`.acc-b` button)
  - Answer / body (`.acc-p` panel)

**Constraint:** Items are a variable-length ordered list.

---

### Chips Block (L3-06) contains:
- Chip × N (L2-01)
  - Label text
  - Variant (default / accent)

**Constraint:** Items are a variable-length ordered list.

---

### Prose Block (L3-07) contains:
- Heading
- Body text (rich text)
- Optional nested component (depends on variant):
  - `prose-list`: unordered list items
  - `prose-with-aside`: aside panel (heading + body)
  - `prose-gallery`: Gallery (L3-04) — reduced variant
  - `prose-chips`: Chips block (L3-06)
  - `prose-accordion`: Accordion block (L3-05)

**Constraint:** Each prose variant has exactly one optional nested component type. Nesting depth = 1.

---

### Key Dates Block (L3-09) contains:
- Key Date Row × N (L2-06)
  - Date / number label
  - Event description

---

### Inline Tabs Block (L3-14) contains:
- Tab item × N
  - Tab label
  - Panel content (arbitrary blocks — may include Gallery, Prose, etc.)

**Constraint:** Panel content is not arbitrary blocks in the current implementation — each tab panel contains manually authored HTML. For Payload, panels would need to support a sub-blocks array.

---

### Prototype Embed (L3-13) contains:
- Proto Browser Chrome Card (L2-07)
  - Poster image
  - Prototype URL (`data-src`)
  - Version switcher (V1/V2 labels + URLs)
  - Device toggle (Desktop / Phone)
- Expand overlay (`#proto-morph-shell`, GSAP Flip morph)

**Constraint:** Only one prototype per block. Version switcher is optional (1 or 2 versions).

---

### Impact List (L3-11) contains:
- Impact Item × N
  - Number (`data-count-to` for GSAP count-up)
  - Unit (optional, e.g. "%")
  - Label
  - Description

---

## Level 3 → Level 4 Containment

Section systems contain and orchestrate content blocks:

### Hero / Brief / Scope Stack (L4-01) contains:
- Hero Section (L3-12) — full-bleed dark image zone
- Brief Card — surface background, heading + summary
- Scope Card — dark background (`--ink-dark`), with:
  - In Centronic: role chips + brief description
  - In Haptix: `.dots` radial pattern + Scope Strip (4 boxes) + chips + brief

**Constraint:** Fixed 3-section sequence. Not reorderable. Content within each card is configurable.

---

### Chapter Navigation System (L4-03) — Infrastructure

Contains but does not expose as blocks:
- Rail Dot × N (L2-09) — generated from chapter list
- Mobile Pill + Drawer — generated from chapter list

**Data source:**
- Centronic: `SITE_CONFIG` JSON embedded in `<script>` tag
- Haptix: hardcoded array in `main.js`

**Payload requirement:** Chapter list should be derived from page sections/slugs, not a separate editable block. OR: a dedicated "chapter list" configuration field on the case study page.

---

### Slides Panel (L4-02) — Haptix-specific

Contains:
- Slide Card × N (L2-11)
- Deckbar (progress bar + prev/next + count)
- Dot navigation

**Integration constraint:** Requires `#switch` sticky tab bar at page level. Only activates when a case study has a `slides` array defined.

---

## Level 4 → Level 5 Containment

### Template 01 — Standard Narrative Case Study (L5-01)

**Fixed zones (not editable as blocks):**
- Site navigation (global component)
- Hero / Brief / Scope Stack (L4-01) — configurable content, fixed structure
- Chapter Navigation System (L4-03) — derived from page structure
- Case Study Navigation (L2-08) — derived from `SK_PROJECTS` registry
- Footer

**Variable zone (Payload `blocks` field):**
```
blocks[] → any combination of:
  ProseBlock (6 variants)
  BentoBlock (8 variants)
  QuoteTwoUpBlock
  SlideBlock (2 variants)
  GalleryBlock (3 variants)
  AccordionBlock (2 variants)
  ChipsBlock (2 variants)
  KeyDatesBlock (2 variants)
  TableBlock (2 variants)
  ImpactListBlock
  PrototypeEmbedBlock
  TabsBlock
  HeroBlock (only at top — constrained)
```

**Sub-variant — Haptix extension (`template: 1` with slides):**
- Adds `#switch` tab bar + `#p-slides` panel
- Requires `slides[]` array in page document

---

## Selectable Blocks vs. Nested Components

### Selectable in Payload (content blocks)
- `ProseBlock` (6 variants)
- `BentoBlock` (8 variants: BENTO-2 through BENTO-9)
- `QuoteTwoUpBlock`
- `SlideBlock` (2 variants)
- `GalleryBlock` (3 variants)
- `AccordionBlock` (2 variants)
- `ChipsBlock` (2 variants)
- `KeyDatesBlock` (2 variants)
- `TableBlock` (2 variants)
- `ImpactListBlock`
- `PrototypeEmbedBlock`
- `TabsBlock`
- `HeroBlock` (constrained to page top)

**Total: 13 selectable block types**

### NOT selectable — nested only
- Pull Quote Card (L2-03) — nested within QuoteTwoUpBlock
- Bento Cell (L2) — nested within BentoBlock
- Gallery Item (L2-05) — nested within GalleryBlock
- Accordion Item (L2-10) — nested within AccordionBlock
- Chip (L2-01) — nested within ChipsBlock or ProseBlock
- Key Date Row (L2-06) — nested within KeyDatesBlock
- Slide Card (L2-11) — nested within SlideBlock or Slides Panel
- Burst Divider (L2-04) — embedded in Haptix template
- Scope Strip (L3-16) — embedded in Scope Card
- Proto Browser Chrome (L2-07) — nested within PrototypeEmbedBlock

### Infrastructure (not blocks)
- Chapter Navigation System (L4-03)
- Case Study Navigation (L2-08)
- Site navigation
- Modal/Lightbox

---

## Shared Behaviors

The following behaviors are shared across multiple block types. They must be initialized once and not duplicated per block:

| Behavior | Shared Across |
|----------|--------------|
| GSAP ScrollTrigger | HeroBlock, ImpactListBlock, QuoteTwoUpBlock, ProseBlock (reveal) |
| Anime.js reveals (`data-reveal`, `data-stagger`) | All blocks with enter animations |
| Lightbox modal | GalleryBlock, BentoBlock (expand), PrototypeEmbedBlock |
| IntersectionObserver | GalleryBlock items, ChapterNavigation, all reveal animations |
| `prefers-reduced-motion` guard | All animation behaviors |

**Payload/React implication:** These behaviors should be initialized at the page level or via a shared React context/hook, not inside each block's component file.

---

## Incompatible Combinations

| Constraint | Reason |
|-----------|--------|
| BentoBlock cannot be nested inside TabsBlock | Animation complexity — 3D tilt + Flip expand inside a hidden tab panel breaks GSAP |
| PrototypeEmbedBlock must not appear inside Bento cells | GSAP morph requires fixed viewport coordinates |
| Slides Panel (L4-02) is incompatible with arbitrary block ordering | It is a page-level tab panel, not a content block |
| HeroBlock must appear first in block array if used | Pin-over-pin sequence depends on DOM order |

---

*Generated 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
