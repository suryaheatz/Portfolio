# SK Portfolio — Agent Instructions

Surya Konijeti's UX/product design portfolio.
**Repo:** `suryaheatz/Portfolio` · **Branch:** `main` · **Deploys to:** Vercel on push to `main`
**Live URL:** `https://surya-zf-centronic.vercel.app/`

---

## Hard rules — never break these

- **No AI slop / no generic layouts.** Every component must follow the SK Design System tokens.
- **No dark mode.** `body` background is always `var(--bg)` = `#f5f4f0`.
- **Never remove animations unilaterally.** Discuss first. Get explicit approval.
- **ZF is not a client.** Copy must say "I was a Senior UX Designer at ZF."
- **No close icon / "Exit the demo" text / status bar** in any prototype embed.
- **Never overwrite design with a generic framework look.**
- **Approval required before any production change.** See Approval Workflow below.

---

## Approval-first workflow

Read files, investigate issues, inspect source code, compare implementations, and propose
solutions freely — no approval needed for investigation.

**Approval required before:**
- Modifying production code (HTML, CSS, JS in any case study or homepage)
- Changing design-system components or tokens
- Changing content or media
- Refactoring working interactions or animations
- Introducing new dependencies
- Modifying deployment configuration
- Removing existing functionality
- Committing changes

Small editorial corrections may be made without a separate approval request only when
explicitly included in an already-authorized task.

Do not ask repeatedly for permission already granted within the current task.

---

## Repository & Deployment

| Item | Value |
|------|-------|
| Repo | `suryaheatz/Portfolio` |
| Branch | `main` |
| Auto-deploy | Vercel on every push to `main` |
| Live URL | `https://surya-zf-centronic.vercel.app/` |
| Primary case study | `index.html` (ZF Centronic HMI) |
| Second case study | `case-studies/haptix/index.html` (Haptix MRF Thumbwheel) |
| Shared tokens | `public/ds-tokens.css` — single source of truth for all design tokens |
| Shared nav styles | `public/cs-nav.css` |

**Note:** Pushing to `main` triggers an automatic Vercel deployment. Committing
documentation and committing code both deploy.

---

## Design System

**Token file:** `public/ds-tokens.css` — always authoritative. If any value below
conflicts with `ds-tokens.css`, the CSS file wins.

**Design reference:** `https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`

Before building any new component, check the design reference first. If the pattern is
not documented there, add it to the design system before implementing on the page.
Where the artifact is unavailable, use verified repository specifications (skill files
in `.claude/skills/`, `public/ds-tokens.css`, existing production HTML) and flag any
missing documentation before implementing a new pattern.

### Colour tokens

```css
--bg:             #f5f4f0;   /* page background — always */
--ink:            #111110;
--ink-2:          #545450;
--ink-3:          #636360;   /* authoritative value — ds-tokens.css */
--rule:           #dddad0;
--surface:        #eeece7;
--surface-chrome: #fafaf8;
--sun:            #E8490F;   /* brand accent */
--sun-light:      rgba(232,73,15,0.12);
--sun-muted:      rgba(232,73,15,0.06);
--teal:           var(--sun); /* deprecated alias — use --sun in new work */

/* Dark-context tokens (prototype embeds, dark hero sections) */
--ink-dark:   #1a1917;   /* dark card / scope background */
--ink-dark-2: #1e1c1a;   /* darker variant — hero image bg */
--ink-void:   #0e0e0d;   /* deepest near-black — proto embed bg */
--rule-dark:  #3a3a36;   /* rule colour on dark surfaces */
--proto-bg:   #030B1B;   /* Haptix / HMI prototype embed bg */
```

### Layout

```css
--page-w:        1080px;
--col-pad:         48px;   /* desktop gutter */
--col-pad-m:       24px;   /* mobile gutter */
--section-gap:     80px;
--section-gap-m:   48px;
```

### Radii

```css
/* Legacy aliases (backward compatibility) */
--r-sm:  6px;
--r-md: 12px;
--r-lg: 20px;

/* Numeric scale (4px base; 28px intentionally excluded) */
--r-1:  4px;
--r-2:  8px;
--r-3: 12px;
--r-4: 16px;
--r-5: 20px;
--r-6: 24px;
--r-7: 32px;
--r-8: 40px;
--r-9: 48px;
```

### Spacing (4px base)

```
--sp-1:4px   --sp-2:8px    --sp-3:12px  --sp-4:16px
--sp-5:20px  --sp-6:24px   --sp-8:32px  --sp-10:40px
--sp-12:48px --sp-16:64px  --sp-20:80px --sp-24:96px
--sp-26:104px
```

### Typography — DS-03 (active)

```css
/* ── Typography — DS-03 approved system ── */
--font-display: 'Bricolage Grotesque', 'Bricolage Grotesque Fallback', system-ui, sans-serif;
--font-sans:    'Manrope', system-ui, sans-serif;
--font-quote:   'Zodiak', Georgia, serif;
--font-serif:   'Bricolage Grotesque', 'Bricolage Grotesque Fallback', system-ui, sans-serif;
/* --font-serif is a legacy alias — kept for residual usages; new work must use --font-display */
```

**DM Serif Display and DM Sans are superseded historical fonts.** Do not use them.
DS-03 activated in commit `4ad3a45`.

Font loading (all three faces in one Google Fonts `<link>`):
```
Bricolage Grotesque: opsz,wght@12..96,300;400;500;600
Manrope: wght@300;400;500;600
Zodiak: ital,wght@1,300;1,400
```
Include the metric-matched `Bricolage Grotesque Fallback` `@font-face` declaration to
prevent layout shift on load.

### Motion tokens

**Canonical duration names are `--dur-*`.** The `--t-fast` / `--t-mid` entries from
earlier CLAUDE.md versions are legacy — do not use in new work; do not remove from
existing production code.

```css
/* Duration */
--dur-instant: 120ms;
--dur-fast:    220ms;
--dur-mid:     380ms;
--dur-slow:    580ms;

/* Easing */
--ease-out:       cubic-bezier(0.16,1,0.3,1);
--ease-out-quart: cubic-bezier(0.165,0.84,0.44,1);
--ease-reveal:    cubic-bezier(0.39,0.575,0.565,1);
--ease-enter:     cubic-bezier(0.19,1,0.22,1);
--ease-leave:     cubic-bezier(0.95,0.05,0.795,0.035);
--ease-lift:      cubic-bezier(0.34,1.1,0.64,1);
--ease-snap:      cubic-bezier(0.37,0,0.63,1);
--ease-path:      cubic-bezier(0.16,1,0.3,1);
```

---

## Motion libraries

```
GSAP 3.15 + ScrollTrigger + SplitText + Flip
CDN: https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/

Anime.js 4.3.6
CDN: https://cdn.jsdelivr.net/npm/animejs@4.3.6/lib/anime.iife.min.js
```

- **GSAP** — scroll-pinned transitions, parallax, stagger reveals, Flip expand,
  bento 3D tilt, count-up animations
- **Anime.js** — `data-reveal` scroll enter animations, state changes, hover effects
- **ScrollTrigger** — all scroll-driven animations via `ScrollTrigger.create()`

---

## Scroll transition system — GSAP pin-over-pin (confirmed live)

`sectionTransition01()` IIFE pins each `[data-st-01="pin"]` element while its next
sibling scrolls over it:

```js
ScrollTrigger.create({
  trigger: nextSection,
  start: 'top bottom',
  end: 'top top',
  pin: section,
  pinSpacing: false,
});
```

**Four pinned elements:** `.hero-image-section` · `.st-brief` · `.st-scope` · `#proto-trigger`

⚠️ **This is GSAP pin, not CSS sticky.** The previous instruction "Do NOT attempt GSAP
pin on `.hero-image-section`" was incorrect and is deleted. Confirmed working: commit
`40e2d95`. Do not revert to CSS sticky.

**Never attempt proximity border-radius on bento cells.** That approach was developed,
found to be buggy, and abandoned. The active replacement is 3D tilt on hover.

---

## Design System Components

Full CSS specifications live in the design reference:
`https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`

The sections below provide implementation constraints and critical rules only.
Load the relevant skill file before building any component.

### §22 — Bento Grid (BENTO-2 through BENTO-9)

Skill: load `sk-case-media` when working with bento in a case study context.

**Key bento tokens:**
```css
--r-bento:   24px;   /* cell border-radius */
--bento-gap: 16px;   /* gap = ⅔ × border-radius — never change this ratio */
--bento-row: 200px;  /* base row height — all rows are multiples of 200px */
```

**Critical rules:**
- Cell = fixed window. Image crops to fill. Never resize the cell to fit the image.
- `object-fit: cover` and `object-position: center center` on every image.
- Every cell must have `.cs-bento-overlay`, `.cs-bento-caption`, `.cs-bento-expand`.
- 3D tilt on hover: GSAP `mousemove`/`mouseleave`, max ±8° on X and Y,
  `transformPerspective: 800`, elastic spring-back (`elastic.out(1, 0.45)`, 0.7s).
  Disabled while `.flip-expanded` is active.
- GSAP Flip expand/close: `Flip.getState()` → `.flip-expanded` → move to
  `#bento-stage` → `Flip.from()`. Duration 0.55s, `power3.inOut`, `nested: true`.
- Mobile (≤640px): JS card stack, swipe threshold 80px, dots nav. Grid hidden via
  `grid.style.display = 'none'` after JS cloning — not CSS.
- **Never attempt proximity border-radius** — it was buggy and abandoned.

Full CSS and grid layout specs: design reference §22.

### §23 — Quote 2-up Component

`.pq-pair` · `.pq-card` · `.pq-quote-text` (3-line clamp, `.pq-expanded` toggle) · `.pq-attr`

Attribution (`.pq-attr`) is always outside `.pq-quote-text` — never clamped.

Full spec: design reference §23.

### §24 — Slide Layout Component

`.sk-slide`: `grid-template-columns: 2fr 3fr` (40% text / 60% image).
`.sk-slide-image img`: `position: absolute; inset: 0; object-fit: cover`.
Mobile: stacks to single column; text padding reduces to `var(--col-pad-m)`.

Full spec: design reference §24.

### §25 — Statistical Visualization (SK-DATA-VIZ-001)

Skill: `.claude/skills/sk-data-viz/SKILL.md` — load before building any chart.

**Observable Plot is the mandatory rendering engine** for all new charts.
SK Design System controls typography, colour, spacing, responsive behaviour,
label management, and accessibility.

**Critical constraints:**
- Never build a custom statistical renderer without explicit approval.
- `sk-bar-chart.js` is an approved visual reference — do not modify or migrate it.
- Never right-align category labels.
- Never place raw data editors on public-facing pages.

Full spec: design reference §25 + `.claude/skills/sk-data-viz/docs/sk-data-viz-001.md`.

### §26 — Case Study Media System (SK-CASE-MEDIA-001)

Skill: `.claude/skills/sk-case-media/SKILL.md` — load when working with any case
study images, wireframes, screenshots, bento layouts, galleries, comparisons,
or fullscreen media.

**Six approved patterns:**
- A. Full-Width Figure — single image, must not be cropped
- B. Adaptive Bento — multiple comparable images where cropping is safe (§22)
- C. Two-Up Comparison — before/after, V1/V2, related states
- D. Evolution / Sequence — temporal or process order
- E. Annotated Media — technical callouts, hardware specs, gesture maps
- F. Evidence Gallery — large secondary collections (SK-CASE-GALLERY-001)

**Critical constraints:**
- `object-fit: contain` is the default for evidentiary content (wireframes, IA diagrams,
  research maps, workshop scans, annotated screenshots).
- Bento (`object-fit: cover`) only when cropping is safe.
- Bento is NOT the default for every image group — evaluate content type first.
- Evidence Gallery: wire images from the shared `I[]` object — never duplicate base64.
- GSAP + Flip: inline both in separate `<script>` blocks before gallery JS.
- New patterns require explicit approval before being added to the design system.

Full spec: `.claude/skills/sk-case-media/SK-CASE-MEDIA-001.md` + design reference §26.

---

## Case Studies and Homepage

**Centronic** (`index.html`) and **Haptix** (`case-studies/haptix/index.html`) are
both active projects. The **homepage** is also under active development.

**Explicit authorization required before any change affecting:**
- Layout or visual structure
- Typography or type settings
- Content or copy
- Images or media
- Animations or interactions
- Responsiveness or breakpoint behavior
- Rendered visual appearance (including token corrections that change appearance)

Reading, investigating, and proposing changes does not require authorization.
Only implementation does.

**ZF / Centronic copy rule:** ZF is not a client. All copy must say
"I was a Senior UX Designer at ZF." This is non-negotiable.

---

## Payload CMS — Selected Architecture

Payload CMS is the sole selected CMS target. No other CMS is under consideration.

**Status:**
- G6.1 component inventory: **approved for foundation planning**
- Payload installation and implementation: **not yet authorized**
- No Payload code exists in the repository
- Do not install Payload, write Payload schemas, or begin Sprint 1 without a
  separate explicit per-sprint authorization

**Component inventory (G6.1):**
- 28 block families · 61 variants · 15 selectable block types (BK-01 through BK-15)
- Master reconciliation: `design-research/payload-migration/G6-FINAL-RECONCILIATION.md`
- Migration priority and sprint plan: `design-research/payload-migration/MIGRATION-PRIORITY.md`
- Block-variant matrix: `design-research/payload-migration/BLOCK-VARIANT-MATRIX.md`
- Component hierarchy (five-level taxonomy): `design-research/payload-migration/COMPONENT-HIERARCHY.md`
- Full inventory directory: `design-research/payload-migration/`

**Sprint 1 scope (when authorized):**
1. Payload install + Next.js integration
2. `ds-tokens.css` imported and verified in Payload frontend
3. Admin access confirmed
4. ProseBlock — plain variant only (BK-01), proves blocks renderer
5. Live preview desktop + mobile
6. Draft/publish verification
7. Side-by-side comparison vs existing HTML

**Unimplemented future blocks (recover spec before building):**
- Tooltip Animation Block (MC-01): confirmed future block; retrieve spec from
  design reference §14 before implementation
- Continuous Scroll Gallery (MC-02): confirmed future block; spec TBD —
  clarify before Sprint 2+

### Access Management

Per-case-study access gating is a planned platform capability — not a content block type.
Requirements document: `design-research/sanity-migration/ACCESS-MANAGEMENT-REQUIREMENTS.md`

> **Note:** This file will be relocated to `design-research/payload-migration/` during a
> separately authorized maintenance task. Do not relocate it during G6.2.
> The requirements themselves are CMS-agnostic and apply to the Payload implementation.

Key security constraints:
- Never send restricted content in unauthenticated HTML, hydration payloads, search
  indexes, static JSON, or client bundles. CSS blur/overlay is not access control.
- Server-side authorization on every protected request.
- Time-limited single-use tokens; signed delivery for private media.
- Admin access-request queue with audit trail required.

---

## Decap CMS — Authorized for Removal

`admin/config.yml` implements Decap CMS. This implementation is incorrect for the
project's direction. **Removal is authorized** — including the admin interface,
configuration files, and authentication endpoints.

**Before any removal:** audit all files for shared dependencies (authentication,
routing, API endpoints, shared functionality). Do not delete files that serve
other purposes without identifying their full role.

**This is a future cleanup task.** Do not delete files or modify application code
under this authorization without a separate explicit instruction per session.
The existing Decap files must not be treated as a production CMS that needs
feature parity before removal.

---

## SK Design System

**Design reference:** `https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`

Sections: Colour · Spacing · Typography · Type Pairs · Responsive · List View · Tabs ·
Proto Card · Nav & Tags · Dark Card · Accordion · Modal · Progress · **Tooltip (§14)** ·
Image Block · Pullquote · Tags · Buttons · Patterns · Templates · Motion ·
**Bento Grid (§22)** · **Quote 2-up (§23)** · **Slide Layout (§24)** ·
**Statistical Visualization (§25)** · **Case Study Media (§26)**

**Token authority:** `public/ds-tokens.css` is always authoritative over this file
and over the design reference for token values.

The design reference artifact cannot be edited from the repository. Sections §25 and §26
must be synced to the artifact manually via the artifact editor when updated.
