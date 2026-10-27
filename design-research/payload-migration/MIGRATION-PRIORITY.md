# SK Portfolio — Migration Priority
## Payload CMS Migration Preparation

**Scope:** Recommended order for converting SK Portfolio components into Payload CMS blocks, based on animation risk, editorial complexity, reuse frequency and current content needs.

**Generated:** 2026-10-27

---

## Guiding Principles

1. **Start with what already has content.** Every block chosen early has at least one real instance in Centronic or Haptix that provides a test case.
2. **Low animation risk first.** Blocks whose HTML/CSS ports cleanly to React components without touching GSAP timelines are faster and safer to migrate.
3. **Infrastructure before body content.** The Hero/Brief/Scope fixed section must work before any body block can be authored.
4. **Recover missing components before migrating them.** Do not build a Payload schema for a component that cannot be confirmed in source.

---

## Tier 1 — Foundation (Migrate First)

These must exist before any case study can be authored in Payload. No body block can render until the page shell and hero section are wired.

### P-01 · Design Token Integration

**What this is:** Porting the SK Design System CSS token file (`public/ds-tokens.css`) into the React/Next.js codebase.

**Why first:** Every component depends on tokens. Nothing renders correctly until they are available globally.

**Action:** Import `ds-tokens.css` as a global stylesheet. No schema changes needed. Zero editorial fields.

**Effort:** Very low  
**Risk:** Very low  
**Unlocks:** Everything else

---

### P-02 · Case Study Page Shell (Template 01)

**What this is:** The fixed page wrapper: site navigation, `#cs-rail` chapter rail, `#cs-pill` chapter pill, `#cs-drawer` mobile drawer, `#cs-nav-root` prev/next navigation, footer.

**Why early:** The shell must exist before body blocks can be placed inside it. The chapter rail requires section IDs to be present.

**Action:**
1. Port site nav, footer, chapter rail as fixed React components (not Payload blocks)
2. Create the Payload `case-studies` collection with: `title`, `slug`, `heroImage`, `brief` (brief card fields), `scope` (scope card fields), `chapters[]` (for rail data), `blocks[]` (the body)
3. Wire `SK_PROJECTS` registry as a Payload Global (`sk-projects-registry`)

**Effort:** Medium  
**Risk:** Medium (chapter rail IntersectionObserver must work in React)  
**Unlocks:** All body blocks

---

### P-03 · Hero Block (BK-11)

**What this is:** The full-bleed dark hero section — background image, project title, subtitle.

**Why early:** It is the first visible element of every case study. GSAP SplitText entrance and parallax are the animations to wire.

**Priority fields:**
- `heroImage` (upload)
- `title` (drives SplitText)
- `subtitle`
- `chips[]` (role/context tags)

**Risk note:** GSAP SplitText word entrance (AN-01) and parallax (AN-02) must be initialized client-side with `useEffect`. Use `dynamic()` import with `ssr: false` for the GSAP initialization wrapper.

**Effort:** Medium  
**Risk:** Medium  
**Prerequisite:** P-02

---

## Tier 2 — Core Editorial Blocks (High Reuse, Low Risk)

These blocks appear most often in both case studies. They carry little or no animation beyond scroll reveals (which can be wired via a shared `useIntersection` hook).

### P-04 · Prose Block (BK-01) ⭐ Recommended first body block

**Variants:** plain prose, prose-list, prose-with-aside, prose-gallery, prose-chips, prose-accordion

**Why first editorial block:**
- Highest reuse — every section of every case study uses prose
- No GSAP dependency; animation is Anime.js scroll reveal only
- 6 variants share one Payload schema (discriminated by `variant` field)
- Variant A (plain prose) can ship first; other variants add incrementally

**Schema sketch:**
```typescript
type ProseBlock = {
  blockType: 'prose'
  variant: 'prose' | 'prose-list' | 'prose-with-aside' | 'prose-gallery' | 'prose-chips' | 'prose-accordion'
  heading: string
  headingLevel: 'h2' | 'h3'
  body: RichText
  // variant-specific fields:
  asideHeading?: string
  asideBody?: RichText
  listItems?: string[]
  chips?: ChipItem[]
  accordionItems?: AccordionItem[]
}
```

**Effort:** Low–Medium  
**Risk:** Low  
**Prerequisite:** P-02

---

### P-05 · Chips Block (BK-07)

**Why early:** Used standalone and embedded within ProseBlock and HeroBlock. Must exist before BK-01-E (prose-chips) can render.

**Variants:** default, accent

**Effort:** Very low  
**Risk:** Very low  
**Prerequisite:** P-04 (it nests inside Prose)

---

### P-06 · Accordion Block (BK-06)

**Why early:** Used standalone and embedded within ProseBlock (prose-accordion variant). Simple `maxHeight` expand/collapse animation, easy to port.

**Effort:** Low  
**Risk:** Low  
**Prerequisite:** P-04

---

### P-07 · Key Dates Block (BK-08)

**Variants:** key-dates list (confirmed), key-dates-tabs (schema-defined)

**Why this tier:** Real content in Haptix. No GSAP dependency. Ship list variant first; tabbed variant follows.

**Effort:** Low  
**Risk:** Low

---

### P-08 · Impact List Block (BK-10)

**Variants:** single variant (impact grid)

**Why this tier:** Real content in both case studies. The count-up animation (GSAP ScrollTrigger scrub, `data-count-to`) is moderately complex but well-understood.

**Risk note:** Confirm GSAP selector uniqueness when multiple impact blocks appear per page. Recommend scoping by block instance ref.

**Effort:** Medium  
**Risk:** Low–Medium

---

### P-09 · Quote Two-Up Block (BK-03)

**Variants:** single variant (two cards)

**Why this tier:** Real content in both case studies. No GSAP beyond a basic scroll reveal. 3-line clamp expand is pure CSS/JS.

**Effort:** Low  
**Risk:** Very low

---

## Tier 3 — Media Blocks (Moderate Effort, Known Patterns)

These blocks involve image handling and lightbox behavior. They share a lightbox modal, which must be implemented once as a shared component.

### P-10 · Gallery Block (BK-05)

**Variants:** g3 (3-col), g4 (4-col), g4-tall (4-col portrait)

**Why this tier:** Real content in Haptix. Requires shared lightbox implementation (P-10 ships with the lightbox; later blocks reuse it).

**Effort:** Medium  
**Risk:** Low–Medium

---

### P-11 · Slide Block (BK-04)

**Variants:** standard, dark

**Why this tier:** Real content in both case studies. Standalone slide (single block) is low risk. The slides carousel (Haptix) adds a `#switch` tab bar that is page-level — decouple this into a separate SlidesPanelBlock or handle as a Haptix-specific template extension.

**Effort:** Medium  
**Risk:** Medium (carousel variant requires page-level state)

---

### P-12 · Table Block (BK-09)

**Variants:** standard, table-gallery

**Note:** No live HTML evidence. Schema-defined only. Implement when needed for a real case study.

**Effort:** Low  
**Risk:** Very low  
**Prerequisite:** P-10 (if table-gallery variant is needed)

---

## Tier 4 — Animation-Heavy Blocks (Highest Risk, Ship Last)

These blocks have the most complex animation systems. Port them after the simpler blocks are stable and the GSAP initialization pattern is proven.

### P-13 · Bento Grid Block (BK-02)

**Variants:** BENTO-2 through BENTO-9

**Why late:** Three independent animation systems (3D tilt, GSAP Flip expand, mobile card stack swipe) must all work correctly in React. The GSAP Flip expand requires a DOM overlay element (`#bento-stage`) that must be registered at page level, not inside the React component tree.

**Risk note (from AN-15, AN-16):**
- GSAP Flip expand: requires `Flip.getState()` on the real DOM before a React re-render discards it. Must use a ref and call GSAP outside the render cycle.
- Mobile card stack: clones DOM nodes and hides the original grid. Incompatible with React's virtual DOM unless the clone-and-hide logic is wrapped in a `useEffect` that runs after mount.

**Recommended approach:** Build as an "island" component using `dynamic({ ssr: false })`. Initialize all three animation systems inside `useEffect` using refs to DOM nodes.

**Effort:** High  
**Risk:** High  
**Prerequisite:** Lightbox (P-10)

---

### P-14 · Prototype Embed Block (BK-12)

**Variants:** single version, two-version (V1/V2)

**Why late:** GSAP morph expand (AN-17) is the highest-risk animation in the inventory. It requires fixed viewport coordinates and a full-page overlay (`#proto-morph-shell`) that must exist outside the React component tree.

**Recommended approach:** Implement as a portal (`ReactDOM.createPortal`) for the overlay, with GSAP morph initialized via ref.

**Effort:** High  
**Risk:** High

---

### P-15 · Inline Tabs Block (BK-13)

**Variants:** single variant

**Why late:** Not because of animation risk (low), but because Payload support for nested `blocks[]` within a block field (`TabsBlock → tabs → panels → blocks[]`) requires testing. Confirm Payload version supports nested blocks before schema authoring.

**Effort:** Medium  
**Risk:** Medium (Payload nested blocks support)

---

## Tier 5 — Recover Before Migrating

These components cannot be migrated until missing source evidence is recovered (see `MISSING-COMPONENTS-AND-ARTIFACTS.md`).

### P-16 · Tooltip Animation Block (MC-01)

**Status:** Not in codebase. Must recover from SK Design System §14 and CodePen history before migration.

**Effort:** Unknown  
**Risk:** Unknown  
**Prerequisite:** Recovery of MC-01 + MC-08

---

### P-17 · Continuous Scroll Gallery (MC-02)

**Status:** Not in codebase. Verify with user whether this is needed for Payload migration.

**Effort:** Unknown  
**Risk:** Unknown  
**Prerequisite:** User clarification

---

## Migration Sequence Summary

| Phase | Priority | Block | Risk | Notes |
|-------|----------|-------|------|-------|
| Foundation | P-01 | Design Tokens | Very Low | Must be first |
| Foundation | P-02 | Page Shell / Template 01 | Medium | Must be second |
| Foundation | P-03 | Hero Block | Medium | Must be third |
| Tier 2 | **P-04** | **Prose Block** ⭐ | Low | **Recommended first body block** |
| Tier 2 | P-05 | Chips Block | Very Low | Required for P-04-E |
| Tier 2 | P-06 | Accordion Block | Low | Required for P-04-F |
| Tier 2 | P-07 | Key Dates Block | Low | |
| Tier 2 | P-08 | Impact List Block | Low–Medium | |
| Tier 2 | P-09 | Quote Two-Up Block | Very Low | |
| Tier 3 | P-10 | Gallery Block | Low–Medium | Ships with lightbox |
| Tier 3 | P-11 | Slide Block | Medium | Decouple carousel |
| Tier 3 | P-12 | Table Block | Very Low | When needed |
| Tier 4 | P-13 | Bento Grid Block | High | Island component pattern |
| Tier 4 | P-14 | Prototype Embed Block | High | Portal pattern |
| Tier 4 | P-15 | Inline Tabs Block | Medium | Nested blocks |
| Tier 5 | P-16 | Tooltip Block | Unknown | Recover MC-01 first |
| Tier 5 | P-17 | Scroll Gallery | Unknown | Clarify with user |

---

## First Sprint Recommendation — G6.1 REVISED

**Sprint 1 scope (G6.1 revised — foundation first, not full case study rebuild):**

1. **Payload foundation** — Install, configure Next.js integration, admin panel running locally  
2. **Token integration** — `ds-tokens.css` loaded in Payload frontend; SK tokens verified in admin UI  
3. **Admin access** — User (Surya) can log in, navigate collections  
4. **`P-04` Prose Block (plain variant only)** — one real editable block, proves the blocks renderer  
5. **Live preview** — Desktop + mobile preview working for Prose content  
6. **Draft/publish verification** — Save draft → publish → render on frontend  
7. **Comparison checkpoint** — Side-by-side against existing HTML

**Do not** start Sprint 1 by rebuilding the entire Centronic case study.  
**Do not** include Hero Block, Chips Block, or Quote Two-Up Block in Sprint 1 — these come in Sprint 2 after the foundation is proven.  
**Do** preserve existing HTML, CSS, GSAP behaviors, imagery and content as the source of truth at all times.  
**Do** account for access-management requirements already committed in `b14f834`.

---

## Hard Constraints Preserved Through Migration

From `CLAUDE.md`:

| Constraint | Migration impact |
|-----------|----------------|
| No dark mode — `body` always `var(--bg)` | Never add a dark mode toggle. Tokens stay fixed. |
| Never remove animations unilaterally | GSAP and Anime.js behaviors must survive migration. Discuss before dropping any. |
| GSAP pin-over-pin — sectionTransition01 (G6.1 CORRECTION) | `.hero-image-section`, `.st-brief`, `.st-scope`, `#proto-trigger` all use `ScrollTrigger.create({ pin:section, pinSpacing:false })`. This is GSAP pin, NOT CSS sticky. The CLAUDE.md instruction "Do NOT attempt GSAP pin on .hero-image-section" is outdated. Live code confirmed via commit `40e2d95`. Do not revert to CSS sticky. |
| Never attempt proximity border-radius | Not to be reimplemented in React. |
| No close icon / exit text / status bar | PrototypeEmbedBlock overlay has no close button. |
| ZF is not a client — copy uses "I was a Senior UX Designer at ZF" | Prose content must be preserved verbatim. |

---

*Generated 2026-10-27 · Updated G6.1 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
