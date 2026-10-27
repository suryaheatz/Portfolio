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

### MC-09 · Git History — G6.1 RECOVERED

**Context (G6.1 correction):** Git history was accessible. `git log --oneline --all` executed successfully in G6.1.

**Findings:**
- Repository IS a git repo with full history
- Key commits confirmed: `40e2d95` (restore GSAP pin — sectionTransition01), `4ad3a45` (DS-03 type system), `2f26ea0` (G6 inventory), `b14f834` (access-management requirements)
- No commits mentioning "tooltip", "scroll gallery", or "continuous gallery" found
- No removed or refactored tooltip components found in history
- No evidence of continuous scroll gallery (MC-02) in any commit

**Status update:** MC-02 (continuous scroll gallery) is not in git history — it was either never committed or was discussed but never implemented.

---

### MC-10 · Prototype Source Files — G6.1 PARTIALLY RECOVERED

**Context (G6.1 update):** The `prototypes/` directory was confirmed to exist at `/home/claude/portfolio/case-studies/haptix/prototypes/`. Two subdirectories confirmed: `v1/` and `v2/`, each containing `index.html`.

**Status:** Directory structure confirmed. Full file contents were not read in G6.1 (out of scope — prototype source code, not documentation). The prototype files exist and are accessible for future inspection.

**Remaining question:** Whether these prototypes contain UI patterns not yet in the case study HTML. This can be read at any time with `Read /home/claude/portfolio/case-studies/haptix/prototypes/v1/index.html`.

---

### MC-11 · session.md — G6.1 RECOVERED

**Context (G6.1 update):** `session.md` was read in full during G6.1.

**Findings:**
- Pre-DS-03 handoff log — documents the state of the system BEFORE the DS-03 typography update
- References historical DM Serif Display + DM Sans fonts (both superseded by Bricolage Grotesque + Manrope in DS-03 active implementation)
- References `--teal: #0c7a66` as the brand accent (superseded by `--sun: #E8490F`)
- Documents historical animation architecture (partially superseded by current sectionTransition01 GSAP pin system)
- Does NOT contain specifications for tooltip animation or continuous gallery
- **Is not authoritative for the current system** — DS-03 tokens in `public/ds-tokens.css` are the source of truth

---

### MC-12 · Motion Token Values — G6.1 RECOVERED

**Context (G6.1 update):** All motion tokens recovered from `public/ds-tokens.css`.

**Duration tokens:**
```css
--dur-instant: 120ms
--dur-fast:    220ms
--dur-mid:     380ms
--dur-slow:    580ms
```

**Easing tokens:**
```css
--ease-reveal:     cubic-bezier(0.39, 0.575, 0.565, 1)
--ease-enter:      cubic-bezier(0.19, 1, 0.22, 1)
--ease-leave:      cubic-bezier(0.95, 0.05, 0.795, 0.035)
--ease-lift:       cubic-bezier(0.34, 1.1, 0.64, 1)
--ease-snap:       cubic-bezier(0.37, 0, 0.63, 1)
--ease-path:       cubic-bezier(0.16, 1, 0.3, 1)
--ease-out-quart:  cubic-bezier(0.165, 0.84, 0.44, 1)
--ease-out:        cubic-bezier(0.16, 1, 0.3, 1)
```

**Note:** `ds-tokens.css` also defines `--ink-3: #636360` — slight discrepancy from CLAUDE.md which states `--ink-3: #9a9a94`. `ds-tokens.css` is authoritative.

**Status:** ✅ Fully recovered

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
| MC-09 | Git History | ✅ Recovered (G6.1) | High → Done | No tooltip/gallery commits found |
| MC-10 | Prototype Source Files | 🟡 Partially recovered (G6.1) | Low | v1/ v2/ dirs confirmed; content not read |
| MC-11 | session.md | ✅ Recovered (G6.1) | Medium → Done | Pre-DS-03 log; not authoritative |
| MC-12 | Motion Token Values | ✅ Recovered (G6.1) | Low → Done | All cubic-bezier values captured |
| MC-13 | Proximity Border-Radius | D — Abandoned | None | Do not implement |

**Total components requiring historical recovery (G6 original):** 6 (MC-01, MC-02, MC-08, MC-09, MC-10, MC-11)  
**After G6.1 recovery:** 3 still unresolved (MC-01 Tooltip Animation, MC-02 Continuous Gallery, MC-08 Historical DS Artifact — all inaccessible from repository)

---

*Generated 2026-10-27 · Updated G6.1 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
