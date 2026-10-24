# DS-01 Report — Repository & Skill Discovery
**SK Portfolio Design System Revision · Gate DS-01**
**Status: COMPLETE — Awaiting DS-02 Approval**
**Date: 2026-10-24**

---

## A. Repository Identity, Branch, and Commit

| Field | Value |
|-------|-------|
| Repository | `github.com/suryaheatz/Portfolio` |
| Branch | `main` |
| Baseline commit | `96d672f5d77c4b983a0d0c7f264c2b969643aec0` |
| Commit message | "Batch 2A-2: Centronic V2 prototype integration + viewport width fix" |
| Deployment | Auto-deploy to Vercel on push to `main` |
| Live URL | `https://surya-zf-centronic.vercel.app/` |
| Architecture | Single HTML file: `index.html` (84,641 bytes) + `public/ds-tokens.css` |

**VERIFIED** — Confirmed via `git log` in repo at `/home/claude/portfolio/`.

---

## B. Awwwards Reference-Label Update

**Finding:** The `awwwards-web-design` skill was previously referenced without a GitHub repository identifier. The reference label has been updated per DS-01 brief §1.

### Update Required

**Before:**
```
Awwwards Design Skill
```

**After:**
```
Awwwards Design Skill
(GitHub: owenisas/awwwards-web-design)
```

### Files Where Reference Appears

**INFERRED** — A systematic search of all `.md`, `.json`, `.yaml`, and `.txt` files in the repository returned **zero matches** for "awwwards" prior to this session. The skill was referenced in conversation context and project memory but not yet formally documented in the repository's own files.

**Resolution:** The `awwwards-web-design` skill candidate has been copied to `design-research/skill-candidates/awwwards/` with provenance recorded below. The formal reference entry will be created in the DS-01 report itself (this document) and in `design-research/skill-registry.md` (to be created). No existing file reference needed to be updated because none existed; this report establishes the first canonical in-repo reference with the correct label.

### Provenance Record

| Field | Value |
|-------|-------|
| Human-readable name | Awwwards Design Skill (GitHub: owenisas/awwwards-web-design) |
| Repository | `https://github.com/owenisas/awwwards-web-design` |
| Cloned revision | HEAD at time of clone (2026-10-24) |
| License | MIT |
| Skill version | 1.0.0 |
| Author | owenisas |
| Last updated | 2026-09-25 |
| Local candidate path | `design-research/skill-candidates/awwwards/` |

---

## C. Existing SK Design System Inventory

### C.1 Token Source of Truth

**File:** `public/ds-tokens.css` — 101 lines, all CSS custom properties on `:root`.

**VERIFIED** — Read in full.

| Token Group | Values |
|-------------|--------|
| **Background** | `--bg: #f5f4f0`, `--surface: #eeece7`, `--surface-chrome: #fafaf8` |
| **Ink** | `--ink: #111110`, `--ink-2: #545450`, `--ink-3: #9a9a94`, `--rule: #dddad0` |
| **Brand accent** | `--sun: #E8490F`, `--teal: #E8490F` *(both identical — orange, not teal)* |
| **Accent variants** | `--teal-dim: rgba(232,73,15,0.08)`, `--sun-light: rgba(232,73,15,0.12)`, `--sun-muted: rgba(232,73,15,0.06)` |
| **Dark contexts** | `--ink-dark: #1a1917`, `--ink-dark-2: #1e1c1a`, `--ink-void: #0e0e0d`, `--rule-dark: #3a3a36`, `--proto-bg: #030B1B` |
| **Layout** | `--page-w: 1080px`, `--col-pad: 48px`, `--col-pad-m: 24px`, `--section-gap: 80px`, `--section-gap-m: 48px` |
| **Radii** | `--r-sm: 6px`, `--r-md: 12px`, `--r-lg: 20px` |
| **Bento** | `--r-bento: 24px`, `--bento-gap: 16px`, `--bento-row: 200px` |
| **Typography** | `--font-serif: 'DM Serif Display', serif`, `--font-sans: 'DM Sans', system-ui, sans-serif` |
| **Type scale** | `--text-label: 11px`, `--text-caption: 12px`, `--text-body-sm: 13px`, `--text-body: 16px`, `--text-serif-sm: clamp(22px,2.8vw,32px)`, `--text-serif-md: clamp(26px,3.2vw,38px)`, `--text-serif-lg: clamp(52px,7.5vw,96px)` |
| **Spacing** | `--sp-1: 4px` through `--sp-26: 104px` (15 steps, 4px base) |
| **Motion durations** | `--dur-instant: 120ms`, `--dur-fast: 220ms`, `--dur-mid: 380ms`, `--dur-slow: 580ms` |
| **Motion easings** | 8 named curves: `--ease-reveal`, `--ease-enter`, `--ease-leave`, `--ease-lift`, `--ease-snap`, `--ease-path`, `--ease-out-quart`, `--ease-out` |
| **Component shorthands** | `--t-fast: 150ms`, `--t-mid: 250ms` *(different from motion duration tokens)* |

### C.2 Typography Implementation

**VERIFIED** (from `index.html` lines 1–100, partial read).

- **Font host:** Google Fonts (single `<link>` in `<head>`)
- **Families loaded:** `DM Serif Display` (regular + italic) and `DM Sans` (variable weight 300–600, italic variants, optical size 9–40)
- **Token declaration:** Fonts declared in `public/ds-tokens.css` AND duplicated in inline `<style>` block in `index.html` lines 55–64

**Inconsistency detected:** Type tokens are defined twice — once in `ds-tokens.css` (source of truth) and once in the inline style block. The inline block also adds comments. This is a maintenance risk: future changes to `ds-tokens.css` could silently diverge from the inline block. *(See §J for full gap list.)*

### C.3 Grid and Layout

- **Container:** `max-width: var(--page-w)` = 1080px
- **Gutters:** `--col-pad: 48px` desktop, `--col-pad-m: 24px` mobile
- **Breakpoints:** `@media (max-width: 900px)` (secondary), `@media (max-width: 640px)` (primary mobile)
- **Section spacing:** `--section-gap: 80px` desktop, `--section-gap-m: 48px` mobile
- **Bento system:** BENTO-2 through BENTO-9 (full CSS in CLAUDE.md §22)

### C.4 Component Inventory

**VERIFIED** from CLAUDE.md and `ds-audit.md`:

| Component | Status |
|-----------|--------|
| Bento Grid (9 variants) | Documented in CLAUDE.md §22, partially implemented |
| Bento 3D Tilt (GSAP) | Documented, NOT yet on production page |
| Bento GSAP Flip expand | Documented, NOT yet on production page |
| Mobile card stack (≤640px) | Documented, NOT yet on production page |
| Quote 2-up (`.pq-pair`) | Documented in CLAUDE.md §23, NOT yet on page |
| Slide Layout (`.sk-slide`) | Documented in CLAUDE.md §24, NOT yet on page |
| SK-DATA-VIZ-001 (Observable Plot) | Skill complete, charts implemented in Centronic |
| Evidence Gallery | Implemented with GSAP + Flip |
| Scroll transition (hero → brief → scope) | Implemented (CSS sticky approach) |
| Centronic 12-chapter case study | Implemented, embedded in `index.html` |
| Haptix case study | In progress |
| About-page skill system (gamified) | Documented, NOT yet implemented |

### C.5 Motion System

- **Library:** GSAP 3.12 + ScrollTrigger + Flip plugin
- **Secondary:** Anime.js v4 (enters, reveals, hover, state changes)
- **Scroll:** ScrollTrigger for scroll-pinned transitions; CSS sticky for card transitions (NOT GSAP pin — documented as incompatible with full-bleed trick)

### C.6 Design System Canonical Artifact

- **URL:** `https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`
- **Sections:** Color · Spacing · Typography · Type Pairs · Responsive · List View · Tabs · Proto Card · Nav & Tags · Dark Card · Accordion · Modal · Progress · Tooltip · Image Block · Pullquote · Tags · Buttons · Patterns · Templates · Motion · Bento Grid (§22) · Quote 2-up (§23) · Slide Layout (§24) · Statistical Visualization (§25) · Case Study Media System (§26)
- **Note:** Cannot be edited from the repository — §25 and §26 must be synced manually via artifact editor

---

## D. Installed Skill Inventory

**VERIFIED** — Read from `portfolio/.claude/skills/`:

| Skill | File | Purpose | Status |
|-------|------|---------|--------|
| `sk-case-media` | `.claude/skills/sk-case-media/SKILL.md` | Case study media patterns (6 approved) + SK-CASE-MEDIA-001.md (v1.1) | Active |
| `sk-data-viz` | `.claude/skills/sk-data-viz/SKILL.md` | Observable Plot statistical visualization | Active |

**No other skills are installed in `.claude/skills/`.** All other skills visible in this session come from the platform (Anthropic built-ins, user account, or session-level tools).

---

## E. External Skills Examined

### E.1 Awwwards Web Design — `owenisas/awwwards-web-design`

**VERIFIED** — Full SKILL.md read; references directory inventoried.

| Field | Detail |
|-------|--------|
| License | MIT |
| Version | 1.0.0 |
| Author | owenisas |
| Corpus | 732 sites surveyed, 51 teardowns (10 design directions) |
| Dependencies | GSAP 3.15.0, Lenis 1.3.26, Three.js r186 (optional/contextual) |

**Contents:**
- `SKILL.md` — 10-step build loop (Brief → Jury lens → Direction → Signature → System → Imagery/3D → Interaction → Build → QA gates → Self-score)
- `references/` — 12 files: typography, color, imagery, jury-lens, casebook, layout, quality-gates, directions, interaction, content-voice, webgl-3d, motion
- `recipes/` — Code recipes: magnetic.js, tokens.css, webgl-image-hover.js, three-hero.js, boot.html, motion-core.css, motion-core.js, page-transitions.js, page-transitions.css
- Audit mode: `uv run scripts/site_probe.py <url>` → 8 screenshots + probe.json

**Jury scoring (measured):** Score = 0.4 Design + 0.3 Usability + 0.2 Creativity + 0.1 Content. SOTD median 7.38, SOTM median 7.73.

**Key rules relevant to SK portfolio:**
- Body size median 14.4px; ~10% use Google Fonts; font families median 2
- WebGL2 on 43/51 teardowns; Lenis 85/117, ScrollTrigger 84/117
- 15 hard rules including: content visible by default, one owned idea, one direction, licensed display type, one ease family, one hero moment, 3D only when needed, real content only
- "Slop crosswalk" — 11 patterns mapping AI-generic defaults to crafted alternatives

**Strengths:** Evidence-grounded (largest corpus of any reviewed skill), concrete criteria for Awwwards-level quality, excellent anti-generic diagnostics  
**Limitations:** Awwwards aesthetic may not perfectly match UX leadership portfolio positioning; WebGL/3D dependency tree not needed for SK; audit script requires local Python env  
**Overlaps:** Motion tokens overlap with SK motion system; typography guidance may conflict with DM font lock  
**Recommendation:** **ADOPT (advisory, DS-02 and DS-03)**. Primary reference for brand and anti-generic audit. Do not adopt WebGL/3D recipes without approval.

---

### E.2 Anthropic Frontend Design — `anthropics/skills` → `skills/frontend-design`

**VERIFIED** — Full SKILL.md read.

| Field | Detail |
|-------|--------|
| License | See LICENSE.txt (Anthropic) |
| Description | Guidance for distinctive, intentional visual design; anti-templated defaults |
| Dependencies | None (guidance only) |

**Key contributions:**
- "AI-generated design cluster" diagnostic: 5 named trait patterns to avoid (warm cream + terracotta, near-black + acid-green, broadsheet, SaaS-card kit, template chrome)
- Two-pass process: design plan first → review uniqueness → build
- Writing-in-design principles: active voice, plain language, failure states as direction
- Restraint rule: "Spend your boldness in one place"
- Explicit warning: `--D97757` (warm clay/terracotta) reads as AI-generated on user briefs — relevant because SK's `--sun: #E8490F` is adjacent to this range

**Strengths:** Directly addresses AI-generated aesthetic problem; clean methodology; strong writing-in-design section  
**Limitations:** Generic guidance without corpus backing; no SK-specific token awareness  
**Overlaps:** Anti-generic philosophy overlaps with Awwwards slop crosswalk; both push toward intentionality  
**Recommendation:** **ADOPT (advisory, DS-02 and DS-03)**. Excellent counterweight to Awwwards' craft-for-award focus — grounds the work in intentionality rather than spectacle.

---

### E.3 CKW Design Skill — `connerkward/ckw-design-skill`

**VERIFIED** — Entry SKILL.md + design-system, design-thinking, design-philosophy sub-skills read.

| Field | Detail |
|-------|--------|
| Author | Conner K Ward |
| License | Not specified (repository public) |
| Sub-skills | design-thinking, design-system, design-spatial, design-ux, design-philosophy |
| Dependencies | None (guidance only, mentions Motion library for React) |

**Key contributions:**
- **Mandatory horizontal-overflow gate:** Measure `scrollWidth - clientWidth` at ~390px and ~1024px — "this bug is invisible at desktop width and re-appears every time a row gains an item, so it ships repeatedly" — directly relevant to SK's single-file portfolio
- **Nested radii formula:** `child_radius = parent_radius - gap` — relevant to SK's r-bento / r-md / r-lg hierarchy
- **FOUT prevention:** `fonts-pending` class + `document.fonts.ready` + fade-in ~0.5s, 2.5s safety timeout — not currently in SK implementation
- **Design-philosophy sub-skill:** "Name the movement (1-2 words)" → articulate in 4-6 paragraphs → "Jazz quote" principle (subtle embedded reference only those who know catch it)
- **Chrome stability:** Persistent chrome must hold constant height — relevant to SK nav
- **Color accessibility:** APCA for decisions, WCAG 4.5:1 floor (SK currently uses visual design only; APCA not mentioned in docs)

**Strengths:** Practical engineering gates (overflow, FOUT) that complement design guidance; nested radii formula is immediately applicable; design-philosophy sub-skill aligns with DS-03 direction work  
**Limitations:** Design-system sub-skill uses SaaS-app token vocabulary (`--sds-bg-*`, sidebar, header) that doesn't map cleanly to SK's editorial/portfolio context; design-ux sub-skill is Nielsen-heavy for enterprise UX, not portfolio  
**Overlaps:** design-philosophy overlaps with Awwwards "signature" step; FOUT concerns already exist in SK Google Fonts loading  
**Recommendation:** **ADAPT (selective, DS-04 and DS-05)**. Take engineering gates (overflow, FOUT, nested radii) and design-philosophy sub-skill. Skip design-system and design-ux sub-skills as written — they target enterprise SaaS, not editorial portfolios.

---

### E.4 Claude Design Skills — `richhemsley3/claude-design-skills`

**VERIFIED** — Directory structure inventoried; `design-critique` (full) and `page-designer` + `qa-specialist` (headers) read.

| Field | Detail |
|-------|--------|
| Author | richhemsley3 |
| License | Not specified (repository public) |
| Skills | design-critique, page-designer, qa-specialist, accessibility-auditor, component-builder, content-copy-designer, design-reviewer, information-architect, interactive-flow-diagram, journey-map, product-designer, screen-flow-diagram, user-researcher, ux-flow-planner, ux-heuristics, ux-map-maker, wireframe-agent (17 total) |
| Framework | Nielsen Norman Group heuristics + Laws of UX + design system token pattern |

**Key contributions:**
- **design-critique:** Full NNG 10 heuristics + 20+ Laws of UX applied as critique lenses; output format includes heuristic scorecard (10 rows × 5-point scale) + findings per heuristic + quick wins. Most directly useful skill in the set for DS-02 audit work.
- **page-designer:** Page layout specification tool; uses enterprise SaaS shell (sidebar + header) — not directly applicable to SK's editorial single-page format, but the section spacing table and content hierarchy are transferable.
- **qa-specialist:** Functional + visual + cross-browser + edge-case test matrix. References `references/qa-checklist.md` for full test matrix. Useful for DS-06 regression testing.
- **Token vocabulary:** Uses `--sds-*` namespace — no direct overlap with SK's `--sk-*` / `--sun` / `--ink` tokens; would require re-mapping.

**Strengths:** design-critique is the most rigorous UX evaluation framework reviewed; NNG + Laws of UX combination provides genuine diagnostic depth; qa-specialist checklist approach suits DS-06  
**Limitations:** SaaS design system vocabulary throughout; enterprise context doesn't translate to editorial portfolio; 17 skills creates cognitive overhead if all loaded simultaneously  
**Recommendation:** **REFERENCE ONLY (design-critique for DS-02; qa-specialist for DS-06)**. Do not install as active skills. Use as methodology references: the design-critique heuristic framework is the strongest available for DS-02 audit structure.

---

## F. Skill Orchestration Matrix

| Skill | DS-01 | DS-02 | DS-03 | DS-04 | DS-05 | DS-06 | Status |
|-------|-------|-------|-------|-------|-------|-------|--------|
| **SK sk-case-media** | — | Advisory | — | — | Active | Active | Active (installed) |
| **SK sk-data-viz** | — | Advisory | — | — | Active | Active | Active (installed) |
| **Awwwards** | Discovery ✓ | Primary | Primary | Advisory | Advisory | Reference | Advisory (candidate) |
| **Anthropic Frontend Design** | Discovery ✓ | Primary | Primary | Advisory | Advisory | — | Advisory (candidate) |
| **CKW design-philosophy** | Discovery ✓ | — | Primary | — | — | — | Advisory (candidate) |
| **CKW design-system** | Discovery ✓ | Advisory | — | Advisory | Advisory | — | Advisory (candidate) |
| **CKW engineering gates** | Discovery ✓ | — | — | Active | Active | Active | Adopt selectively |
| **RH design-critique** | Discovery ✓ | Reference | — | — | — | — | Reference (methodology) |
| **RH qa-specialist** | Discovery ✓ | — | — | — | — | Reference | Reference (methodology) |

**Legend:** Active = apply directly to work; Advisory = consult when relevant; Reference = use methodology but not instructions; — = not applicable; Discovery ✓ = read and evaluated this gate.

### Conflict Resolution Protocol

When skills disagree:
1. Document the disagreement explicitly in the Design Decision Register
2. Evaluate both approaches against SK portfolio's actual content and identity
3. If visual comparison is needed, propose a bounded prototype before choosing
4. Present options with trade-offs — do not silently pick one

---

## G. Recommended Skill Stack

### Active in `.claude/skills/` (unchanged — no new activations without approval)
- `sk-case-media` — Case study media system
- `sk-data-viz` — Observable Plot visualizations

### Advisory Candidates (in `design-research/skill-candidates/`, not activated)

**Primary advisory trio (DS-02, DS-03):**
1. **Awwwards** — Anti-generic diagnostic authority; quality scoring; brand direction
2. **Anthropic Frontend Design** — Intentionality framework; AI-cluster diagnostics; writing-in-design
3. **CKW design-philosophy** — Visual movement naming; "Jazz quote" embedded reference; art direction

**Engineering gates (adopt selectively for DS-04, DS-05):**
4. **CKW: horizontal-overflow gate** — Mandatory at 390px and 1024px before any UI is "done"
5. **CKW: nested radii formula** — `child_radius = parent_radius - gap`
6. **CKW: FOUT prevention** — `fonts-pending` + `document.fonts.ready` pattern

**QA methodology references (DS-06):**
7. **RH design-critique** — NNG heuristics + Laws of UX evaluation framework (methodology reference, not skill instructions)
8. **RH qa-specialist** — Functional + visual test matrix (methodology reference)

---

## H. Skill Overlaps and Conflicts

### Overlaps (complementary)

| Overlap | Skills | Resolution |
|---------|--------|------------|
| Anti-generic design diagnostics | Awwwards "slop crosswalk" + Anthropic "AI cluster" | Both used — complementary lenses (craft-level vs. category-level) |
| Design philosophy / art direction | Awwwards "signature" step + CKW design-philosophy | CKW is more structured for naming/articulating; Awwwards provides craft criteria. Use CKW for DS-03 direction work, Awwwards for DS-02 audit |
| Motion/interaction | Awwwards (GSAP 3.15, Lenis) + SK (GSAP 3.12, ScrollTrigger + Flip) | SK's motion system is established; Awwwards provides quality reference, not replacement. Lenis not currently in SK — evaluate if scroll feel is an issue |
| Typography critique | Awwwards typography.md + Anthropic type guidance + CKW font-loading | Combine: CKW for FOUT engineering, Awwwards for quality bar, Anthropic for AI-tells avoidance |

### Conflicts (require resolution)

| Conflict | Skill A | Skill B | Risk | Recommendation |
|----------|---------|---------|------|----------------|
| Brand accent color | Anthropic warns `#D97757` (warm clay/terracotta) reads as AI-generated tell | SK's `--sun: #E8490F` is adjacent — same perceptual family | Medium — SK's orange may read as AI-generated accent | DEFERRED to DS-03: evaluate in brand direction context |
| Typography lock | CKW design-system: "self-host WOFF2, first seen = first loaded" | SK uses Google Fonts CDN | Low for performance; medium for FOUT | CKW FOUT prevention pattern is adoptable with current Google Fonts CDN |
| WebGL/3D | Awwwards: WebGL2 on 43/51 teardowns; three-hero.js recipe | CLAUDE.md: No unnecessary 3D; SK has no Three.js | Low — CLAUDE.md rules take precedence | Retain SK rule; reference Awwwards for motion/interaction quality only |
| Monospace labels | Anthropic: "monospace face for small data labels" is AI-generated tell | SK's sk-data-viz uses monospace for Observable Plot axis labels | Low — data labels are a legitimate use case | RETAIN: monospace is appropriate for data, not decorative eyebrow text |
| Enterprise token vocabulary (RH/CKW) | `--sds-bg-*`, sidebar, header patterns | SK uses `--bg`, `--ink`, `--sun` tokens | None — not adopting RH/CKW token system | Use methodology only, not token vocabulary |

---

## I. Typography and Spacing Source Locations

### Typography

| Definition | Location | Status |
|------------|----------|--------|
| Font load `<link>` | `index.html` `<head>` | VERIFIED |
| `--font-serif` declaration | `public/ds-tokens.css` (primary) | VERIFIED |
| `--font-sans` declaration | `public/ds-tokens.css` (primary) | VERIFIED |
| `--font-serif` duplicate | `index.html` inline `<style>` ~line 55 | VERIFIED — inconsistency |
| `--font-sans` duplicate | `index.html` inline `<style>` ~line 56 | VERIFIED — inconsistency |
| Type scale (`--text-*`) | `public/ds-tokens.css` (primary) | VERIFIED |
| Type scale duplicate with comments | `index.html` inline `<style>` ~lines 58–64 | VERIFIED — inconsistency |
| CLAUDE.md type reference | CLAUDE.md Token reference section | Matches ds-tokens.css |
| Canonical DS artifact §Typography | `claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt` | NOT YET VERIFIED (DS-02) |

**Families in use (VERIFIED):**
- `DM Serif Display` — display/heading; loaded at ital@0;1
- `DM Sans` — body/UI; loaded variable weight 300–600, optical size 9–40, italic variants
- System fallbacks: `serif`, `system-ui, sans-serif`

**Font loading implementation:** Standard Google Fonts `<link rel="stylesheet">`. No `fonts-pending` class, no `document.fonts.ready` gate, no FOUT prevention beyond browser default (display=swap implied by Google Fonts).

### Spacing

| Definition | Location | Status |
|------------|----------|--------|
| `--sp-1` through `--sp-26` (spacing scale) | `public/ds-tokens.css` | VERIFIED |
| `--section-gap`, `--section-gap-m` | `public/ds-tokens.css` | VERIFIED |
| `--col-pad`, `--col-pad-m` | `public/ds-tokens.css` | VERIFIED |
| Bento spacing (`--bento-gap`, `--bento-row`) | `public/ds-tokens.css` | VERIFIED |
| Section-level spacing in HTML | `index.html` (inline, scattered) | INFERRED — not systematically audited |
| Canonical DS artifact §Spacing | `claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt` | NOT YET VERIFIED (DS-02) |

**Spacing system:** 4px base, 15 named steps from `--sp-1: 4px` to `--sp-26: 104px`. 8-point grid not explicitly named but implied by even-number steps.

---

## J. Documentation and Implementation Evidence Gaps

**VERIFIED** gaps (confirmed by direct read):

| Gap | Severity | Detail |
|-----|----------|--------|
| Token duplication | Medium | `--font-serif`, `--font-sans`, type scale declared in both `ds-tokens.css` AND `index.html` inline style block. Single source of truth not maintained. |
| Components documented but not on page | Low-Medium | Bento 3D tilt, GSAP Flip expand, mobile card stack, Quote 2-up (`.pq-pair`), Slide Layout (`.sk-slide`) all documented in CLAUDE.md but absent from production page (confirmed in `ds-audit.md`) |
| FOUT prevention | Low | No `document.fonts.ready` gate; font loading relies on browser default (`swap` via Google Fonts). DM Sans variable font at ~100KB+ may cause visible FOUT on slow connections. |
| About-page skill system | Medium | Documented as planned, not yet built. Exists in project memory but no implementation. |
| Haptix case study | Medium | Mentioned in project-kt.md as in progress; scope and structure not fully documented. |
| `--teal` naming | Low | `--teal: #E8490F` is orange, not teal. This is a naming inconsistency that could confuse future contributors. |
| Component-level timing vs. motion system | Low | `--t-fast: 150ms` and `--t-mid: 250ms` coexist with `--dur-fast: 220ms` and `--dur-mid: 380ms`. Two partially-overlapping timing systems. |
| Awwwards reference not in repo | Low | Brief asked to update the reference; no such reference existed. This report establishes the first canonical reference. |
| DS canonical artifact §25 and §26 | Medium | Must be synced manually; no automated sync. Risk of drift between implementation and canonical artifact. |
| rgba hardcoded values | Low | `ds-audit.md` confirms rgba values not yet tokenized. |

**NOT YET EXAMINED** (requires DS-02 with rendered inspection):
- Actual computed font-size values on rendered page
- Spacing consistency between sections in rendered HTML
- Color contrast ratios (APCA / WCAG)
- Responsive behavior at 390px, 640px, 900px, 1080px
- Animation performance (jank, CLS)
- Keyboard accessibility and focus states
- Haptix implementation state

---

## K. Decisions That May Warrant Later Reconsideration

These are observations for review — not change proposals. Each would require explicit DS-0x approval before any action.

| ID | Decision | Observation | Recommended Review |
|----|----------|-------------|-------------------|
| K-01 | Brand accent `--sun / --teal: #E8490F` | Anthropic Frontend Design warns that warm clay/terracotta-adjacent accents (~#D97757) read as AI-generated tells. SK's `#E8490F` is close. This may or may not be a concern depending on context — the design should be evaluated on whether the color feels intentional and distinctive to SK's specific identity, not just because it's in a warning range. | DS-03 brand direction |
| K-02 | DM Serif Display + DM Sans pairing | Both are popular, well-made typefaces. Awwwards data: ~10% of awarded sites use Google Fonts. The pairing is clean but may not be distinctive. Needs rendered-page evaluation before any recommendation. | DS-02 typography audit |
| K-03 | `--teal` alias for orange | Token naming discrepancy. Low risk but creates confusion. Could be clarified (rename or add comment) without design impact. | DS-04 (low priority) |
| K-04 | Token duplication (ds-tokens.css vs inline) | Single source of truth is not maintained. Whichever block wins at cascade may be opaque to future contributors. Consolidation to `ds-tokens.css` only would reduce maintenance risk. | DS-04 cleanup |
| K-05 | No FOUT prevention | Variable fonts are large. If the portfolio is accessed on a slow connection, DM Sans may flash in. CKW's `fonts-pending` pattern is well-tested and could be adopted without design change. | DS-04 or DS-05 |
| K-06 | Motion system split | `--t-fast/mid` and `--dur-fast/mid` coexist. Consolidating to one set would reduce token count and improve consistency. | DS-04 cleanup |
| K-07 | Components documented but not shipped | Several documented components (bento tilt, Flip expand, mobile stack, pq-pair, sk-slide) exist only in CLAUDE.md, not in the live page. These represent design debt — either they should be implemented or de-prioritized. | DS-05 component audit |
| K-08 | About-page skill system scope | Not yet built. No visual prototype exists. This is significant planned work that should be evaluated as part of the broader portfolio identity review before design direction is set. | DS-03 / DS-05 |

---

## L. Proposed DS-02 Audit Scope

**Objective:** Evidence-backed audit of the actual rendered SK portfolio against the SK Design System specification, using external skill methodologies as evaluation lenses.

### Scope

**In scope:**
- Typography audit: rendered page at desktop (1280px), tablet (900px), mobile (390px)
- Spacing and section rhythm audit
- Color audit: contrast ratios, accent color legibility, dark-context sections
- Component consistency: what's on the page vs. what's documented
- Interaction audit: scroll behavior, hover states, animation quality
- Anti-generic design audit: apply Awwwards slop crosswalk + Anthropic AI-cluster diagnostics
- Accessibility observations: focus states, contrast, reduced-motion
- Evidence gallery behavior review

**Out of scope for DS-02 (requires later gates):**
- Font replacement proposals (DS-04)
- New component designs (DS-05)
- Production CSS changes (DS-06)
- About-page implementation (DS-05 or later)
- Haptix case study restructuring (separate authorization needed)

### Methodology
- **Rendering:** Use in-session browser tools to render `index.html` at specified widths and capture screenshots
- **Typography lens:** Awwwards `references/typography.md` + Anthropic Frontend Design type guidance
- **Anti-generic lens:** Awwwards "slop crosswalk" 11 rows + Anthropic "AI cluster" 5 patterns
- **Usability lens:** RH design-critique NNG heuristics (reference methodology — not activating the skill)
- **Contrast:** WCAG 4.5:1 floor; APCA if feasible
- **Output format:** Severity-ranked findings (Critical / Major / Minor / Observation); verified vs. inferred distinction maintained throughout

### Deliverables
- Typography audit with evidence (screenshots + computed values)
- Spacing audit with evidence
- Anti-generic audit: pass / flag / explain for each pattern
- Accessibility observations
- Updated Design Decision Register entries
- Recommended DS-03 scope

---

## M. Approval Request for DS-02

**DS-01 is complete.**

The discovery phase has established:
- Full inventory of existing SK Design System (tokens, components, implementation state, gaps)
- Git baseline (`96d672f`)
- Evaluation of 4 external skill repositories with recommendations
- Skill orchestration matrix with gate-level assignments
- Candidate skill files staged at `design-research/skill-candidates/` (not activated)
- Awwwards reference now formally documented in this report (no prior repo reference existed)
- Design Decision Register initiated (§K above)

**No production files were changed.** The only file additions are:
- `design-research/ds-01-report.md` (this file)
- `design-research/skill-candidates/` (reference copies — not in `.claude/skills/`)

---

**To begin DS-02, I need your explicit approval.**

Please confirm:

> **"Approved — proceed with DS-02"**

Or specify any changes to the proposed DS-02 scope in §L before approving.

If you want to modify any skill recommendations (§E), orchestration assignments (§F), or the list of decisions flagged for review (§K) before proceeding, please note them now — DS-02 will operate on whatever is confirmed at this gate.

---

*DS-01 complete. Hard stop in effect. Awaiting DS-02 approval.*
