# SK Portfolio — Missing Components & Artifacts
## Payload CMS Migration Preparation

**Scope:** Components found in historical references, design system documentation or task brief that could not be confirmed in the current codebase, or that exist in sources inaccessible to this inspection.

**Generated:** 2026-10-27

---

## Category A — Referenced in Brief but Not Found in Codebase

These components were specifically named in the G6 inventory brief as previously developed or approved components that should be located.

### MC-01 · CodePen-Inspired Tooltip Animation System

**Referenced in brief:**
> "The previously developed CodePen-inspired tooltip animation system."

**What was expected:**
A reusable interactive content block combining:
- Background visual (an image or diagram)
- Trigger elements (hotspot points on the image)
- Tooltip content (text, media previews)
- Animated reveals (likely GSAP or Anime.js)

**Search performed:**
- `index.html` (full, 1686 lines): No `.tooltip` components found beyond standard CSS title attributes
- `case-studies/haptix/index.html` (250 lines): No tooltip animation system found
- `case-studies/haptix/css/style.css` (200+ lines): No tooltip animation classes
- `admin/config.yml` (528 lines): No tooltip layout type in Decap schema
- `CLAUDE.md`: Mentions tooltip in SK Design System §14 ("Tooltip" listed as a design system section)

**Evidence trail:**
- SK Design System reference URL (`https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`) mentions "Tooltip" as §14
- Brief calls it "CodePen-inspired" — suggests it may have been developed as an external CodePen prototype, not yet integrated into the portfolio HTML

**Recovery path:**
1. Access the SK Design System artifact (`https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`) and navigate to §14 Tooltip to retrieve the specification
2. Search the user's CodePen account for tooltip animation experiments
3. Search git history for any tooltip-related commits (not possible from current session — no git history access)

**Status:** 🔴 Missing — no source evidence in current codebase  
**Requires recovery before Payload migration:** Yes, if this block is intended for new case studies

---

### MC-02 · Continuous Scrolling Image Gallery with Right-Side Navigation

**Referenced in brief:**
> "Continuous scrolling image gallery with right-side navigation."

**What was expected:**
- Horizontally or vertically scrolling image sequence
- Navigation anchored on the right side of the viewport
- Possibly IntersectionObserver-driven activation

**Search performed:**
- `index.html`: No continuous scroll gallery found. Existing galleries are standard grid layouts (not scroll-based)
- `case-studies/haptix/index.html`: `.gal.g3`, `.gal.g4`, `.gal.g4.tall` — all are standard CSS grids, not scroll galleries
- `admin/config.yml`: No "scroll-gallery" layout type in Decap schema

**Evidence trail:**
- Not present in any inspected source file
- The right-side navigation concept is partially echoed by the chapter rail (`#cs-rail`) but that is section navigation, not image gallery navigation

**Recovery path:**
1. Access git history for any "scroll gallery" or "continuous gallery" commits
2. Search Claude Design artifact history or user's design prototypes
3. May be a concept that was discussed but never implemented

**Status:** 🔴 Missing — no source evidence  
**Requires recovery before Payload migration:** Verify with user whether this is intended for the Payload migration

---

### MC-03 · Image Comparison / Before-After Block

**Referenced in brief (section 8):**
> "Image comparison and multi-image arrangements."

**What was expected:**
- Side-by-side image comparison (possibly slider-based)
- Before/after reveal mechanism

**Search performed:**
- `index.html`: No comparison slider found
- `case-studies/haptix/index.html`: `.twoup` class found (2-column grid) but it's a generic placeholder, not a comparison slider
- `admin/config.yml`: No comparison layout type

**Evidence trail:**
- `.twoup` in Haptix is the closest match — a simple 2-column layout — but has no comparison interaction
- The brief's §8 may refer to the existing multi-column gallery variants (`.g3`, `.g4`) rather than a true comparison slider

**Recovery path:**
1. Clarify with user whether a true drag-to-compare slider is needed
2. If yes: not implemented anywhere in current codebase; would be a new block

**Status:** 🟡 Ambiguous — may refer to existing gallery variants or may be a missing component  
**Requires recovery:** Needs user clarification

---

## Category B — Defined but Not Confirmed in Live Pages

These items have source evidence in schema or CSS but have not been verified in rendered production HTML.

### MC-04 · Standalone Table Block

**Status:** 🟡 Schema-defined, not verified in HTML  
**Source:** `admin/config.yml` (layout types `table`, `table-gallery`)  
**Likely explanation:** Table content exists but in a case study that has not yet been added to the portfolio

---

### MC-05 · Prose Variants (A, B, C, D — plain, list, aside, gallery)

**Status:** 🟡 Schema-defined  
**Source:** `admin/config.yml`  
**Note:** Variants E (prose-chips) and F (prose-accordion) are confirmed in Haptix. Variants A–D are defined in schema but not seen in current HTML. They are low-risk — straightforward prose compositions.

---

### MC-06 · Key Dates with Tabs Variant

**Status:** 🟡 Schema-defined (`key-dates-tabs`)  
**Source:** `admin/config.yml`  
**Note:** Plain key dates list is confirmed in Haptix. Tabbed variant is schema-defined but no HTML evidence found.

---

### MC-07 · BENTO-2, BENTO-4, BENTO-5, BENTO-6, BENTO-7, BENTO-8, BENTO-9

**Status:** 🟡 CSS-defined, not live in production  
**Source:** `CLAUDE.md §22`  
**Note:** Only BENTO-3 is confirmed in the workshops section of Centronic. All other bento variants are fully specified in CSS but have no current content using them. They are ready to use.

---

## Category C — Sources Inaccessible to This Inspection

### MC-08 · Historical Claude Design Artifacts

**Context:** The SK Design System is maintained in a Claude artifact (`https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`). This session cannot access that artifact's content directly.

**What may be there:**
- §14 Tooltip specification (see MC-01)
- Any component added to the design system after the last CLAUDE.md update
- Complete token definitions for `--ease-reveal`, `--ease-enter`, `--ease-leave`, `--ease-lift`, `--ease-snap`, `--ease-path` (motion tokens present in `ds-tokens.css` but values not captured in this inspection)

**Recovery path:** Open `https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt` and read all sections, particularly §14 (Tooltip), §15 (Image Block), §16 (Pullquote), §17 (Tags), §18 (Buttons), §19 (Patterns), §20 (Templates), §21 (Motion).

---

### MC-09 · Git History

**Context:** The git repository was not cloned with history for this inspection. The local `/home/claude/portfolio` directory appears to be a working copy without `.git` history accessible.

**What may be there:**
- Previous implementations of tooltip animation (MC-01)
- Removed or refactored components
- Design decisions captured in commit messages
- Version of continuous scroll gallery (MC-02)

**Recovery path:** Run `git log --oneline --all` and `git log --stat` in the repository. Search for commits mentioning "tooltip", "gallery", "scroll", "bento", "slide".

---

### MC-10 · Prototype Source Files

**Context:** The Haptix case study embeds two prototype iframes referenced by `data-src` attributes. The source files for these prototypes were not accessible.

**Expected content:**
- `prototypes/v1/index.html` — V1 thumbwheel prototype
- `prototypes/v2/index.html` — V2 recreation prototype

**Why relevant:** These may contain additional UI patterns, component states or animation techniques developed for the thumbwheel interaction that are not yet reflected in the main case study HTML.

**Recovery path:** Read `/home/claude/portfolio/prototypes/` directory if it exists locally.

---

### MC-11 · session.md

**Context:** A `session.md` file was referenced in the project structure but not read during this inspection.

**Why relevant:** May contain historical design decisions, approved component specifications or notes from previous development sessions.

**Recovery path:** Read `/home/claude/portfolio/session.md`

---

### MC-12 · Motion Token Values (partial)

**Context:** `public/ds-tokens.css` defines the following tokens whose values were noted as defined but whose exact CSS values were not captured during inspection:

```css
--ease-reveal:  /* not captured */
--ease-enter:   /* not captured */
--ease-leave:   /* not captured */
--ease-lift:    /* not captured */
--ease-snap:    /* not captured */
--ease-path:    /* not captured */
```

**Risk:** Low — these are CSS custom properties. Their values can be read from `ds-tokens.css` at any time.  
**Recovery path:** `Read /home/claude/portfolio/public/ds-tokens.css` and capture lines defining these tokens.

---

## Category D — Deprecated or Abandoned Components

### MC-13 · Proximity Border-Radius on Bento Cells

**Status:** Explicitly abandoned  
**Source:** `CLAUDE.md §22`

> **"Never attempt proximity border-radius again"** — it was buggy and abandoned

The proximity-based border-radius effect (dynamically changing border-radius on bento cells based on cursor proximity) was developed, found to be buggy, and replaced by the 3D tilt system. It must not be reimplemented.

---

## Summary Table

| ID | Component | Category | Priority | Recovery Action |
|----|-----------|----------|----------|----------------|
| MC-01 | Tooltip Animation System | A — Referenced, not found | High | Read DS §14 artifact; search CodePen / git history |
| MC-02 | Continuous Scroll Gallery | A — Referenced, not found | Medium | Verify with user; search git history |
| MC-03 | Image Comparison Block | A — Ambiguous | Low | Clarify with user |
| MC-04 | Table Block | B — Schema-defined | Low | Implement when needed |
| MC-05 | Prose Variants A–D | B — Schema-defined | Low | Implement when needed |
| MC-06 | Key Dates Tabbed | B — Schema-defined | Low | Implement when needed |
| MC-07 | BENTO-2,4,5,6,7,8,9 | B — CSS-defined | Low | CSS ready; content needed |
| MC-08 | Historical DS Artifacts | C — Inaccessible | High | Read artifact at provided URL |
| MC-09 | Git History | C — Inaccessible | High | `git log` in repository |
| MC-10 | Prototype Source Files | C — Inaccessible | Low | Read prototypes/ directory |
| MC-11 | session.md | C — Inaccessible | Medium | Read file |
| MC-12 | Motion Token Values | C — Partial | Low | Re-read ds-tokens.css |
| MC-13 | Proximity Border-Radius | D — Abandoned | None | Do not implement |

**Total components requiring historical recovery:** 6 (MC-01, MC-02, MC-08, MC-09, MC-10, MC-11)

---

*Generated 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
