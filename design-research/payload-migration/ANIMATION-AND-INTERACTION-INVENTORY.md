# SK Portfolio — Animation & Interaction Inventory
## Payload CMS Migration Preparation

**Scope:** Complete inventory of all existing motion systems, interaction behaviors, JavaScript dependencies and migration risks.

**Generated:** 2026-10-27

---

## JavaScript Library Dependencies

| Library | Version | Source | Used in | Load method |
|---------|---------|--------|---------|-------------|
| GSAP | 3.12 / 3.15 | CDN | `index.html` | `<script>` tag |
| GSAP ScrollTrigger | 3.12 / 3.15 | CDN | `index.html` | Plugin registration |
| GSAP SplitText | 3.12 / 3.15 | CDN | `index.html` | Plugin (hero text entrance) |
| GSAP Flip | 3.12 | CDN | `index.html` (bento expand) | Plugin |
| Anime.js | v4 | CDN | `index.html`, `case-studies/haptix/js/main.js` | `<script>` tag |

**Note:** Haptix wraps Anime.js calls in a local `anim()` function that guards with `window.anime` availability and `prefers-reduced-motion`.

---

## Animation System 1 — GSAP ScrollTrigger (Centronic / index.html)

### AN-01 · Hero Title Entrance (SplitText)

**Source:** `index.html` (GSAP script block, lines ~1095–1160)

**Behavior:**
- `SplitText.create('.hero-title', { type: 'words' })`
- Each word animates from random rotation (±5–15°) + y:40 → 0
- Stagger driven by GSAP timeline
- Respects `prefers-reduced-motion` (animation skipped)

**Migration risk:** Medium  
**React adaptation:** SplitText must be applied in `useEffect` after component mounts. Ref needed on heading element.  
**Conflict risk:** SplitText changes DOM structure — must not interfere with hydration.

---

### AN-02 · Hero Parallax

**Source:** `index.html` + `case-studies/haptix/js/main.js`

```javascript
gsap.to('#hero-img', {
  yPercent: -18,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-image-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.8
  }
})
```

**Present in:** Both case studies (identical code)  
**Migration risk:** Low — straightforward ScrollTrigger `scrub`  
**React adaptation:** `useEffect` on HeroBlock component mount, targeting a `ref` instead of `'#hero-img'`

---

### AN-03 · Pin-over-Pin Section Transition (`sectionTransition01`)

**Source:** `index.html`, `case-studies/haptix/js/main.js`

```javascript
function sectionTransition01() {
  const pinEls = document.querySelectorAll('[data-st-01="pin"]')
  pinEls.forEach((section) => {
    const nextSection = section.nextElementSibling
    if (!nextSection) return
    ScrollTrigger.create({
      trigger: nextSection,
      start: 'top bottom',
      end: 'top top',
      pin: section,
      pinSpacing: false
    })
  })
}
```

**CRITICAL NOTE (from CLAUDE.md):** `CSS sticky` is the correct tool for `.hero-image-section`. DO NOT attempt GSAP `pin` on it. GSAP pin breaks the full-bleed `left: 50%; margin-left: -50vw` trick used on `.st-card`.

**Present in:** Both case studies (identical code)  
**Migration risk:** High  
**React adaptation:** ScrollTrigger must be initialized once per page, after all sections are mounted. In React, this requires a page-level `useEffect` with `ScrollTrigger.refresh()`. The `[data-st-01="pin"]` data-attribute pattern translates cleanly.

---

### AN-04 · Chapter List Per-Item Reveals

**Source:** `index.html` (lines ~1200–1280)

**Behavior:**
- Each `.chapter-item` gets a ScrollTrigger: `start:'top 85%'`, opacity 0→1, y 20→0
- Also: `start:'top 60%'`, adds `.is-visible` class

**Migration risk:** Low  
**React adaptation:** Standard `useEffect` + `ScrollTrigger.create` per item, or data-attribute-driven init

---

### AN-05 · Pull Quote Reveal

**Source:** `index.html`

**Behavior:** ScrollTrigger on `.pullquote` wrapper, opacity + y entrance  
**Migration risk:** Low

---

### AN-06 · Impact Count-Up (Scrubbed)

**Source:** `index.html` (impact section GSAP block)

**Behavior:**
```javascript
// For each [data-count-to] element:
gsap.to(el, {
  textContent: parseInt(el.dataset.countTo),
  snap: { textContent: 1 },
  scrollTrigger: {
    trigger: el,
    start: 'top 80%',
    end: 'top 30%',
    scrub: 1
  }
})
```

**Migration risk:** Medium  
**React adaptation:** `data-count-to` attribute on rendered DOM element. GSAP scrub targets the DOM node directly — compatible with React as long as refs are used.

---

### AN-07 · Nav Fade

**Source:** `index.html`

**Behavior:** Site nav fades in on scroll past hero  
**Migration risk:** Low

---

### AN-08 · Two-Column Stagger

**Source:** `index.html`

**Behavior:** Scope/brief card columns stagger in on scroll  
**Migration risk:** Low

---

### AN-09 · Catch-All Anim-Block

**Source:** `index.html`

**Behavior:** GSAP ScrollTrigger on `[data-anim="block"]` elements — opacity+y reveal  
**Migration risk:** Low — data attribute pattern is renderer-agnostic

---

## Animation System 2 — Anime.js (Centronic + Haptix)

### AN-10 · Hero Dots Stagger

**Source:** `index.html` (Anime.js block, line ~1624)

**Behavior:** `.hero-dot` elements scale-in with stagger on page load  
**Migration risk:** Low

---

### AN-11 · Chapter Hover Color

**Source:** `index.html` (Anime.js block)

**Behavior:** `.chapter-link` hover → number color animates to `--sun`; mouse-leave → back  
**Migration risk:** Low — CSS transition would achieve same result; Anime.js used here for color interpolation

---

### AN-12 · Haptix Scroll Reveals (`data-reveal`, `data-stagger`)

**Source:** `case-studies/haptix/js/main.js`

```javascript
var io = new IntersectionObserver(function(es) {
  es.forEach(function(e) {
    if (!e.isIntersecting) return
    io.unobserve(e.target)
    var el = e.target
    if (el.hasAttribute('data-stagger')) {
      var kids = $$(':scope > *', el)
      A.animate(kids, { opacity:[0,1], translateY:[16,0], duration:600, ease:'outExpo', delay:A.stagger(40) })
    } else if (el.hasAttribute('data-reveal')) {
      A.animate(el, { opacity:[0,1], translateY:[20,0], duration:700, ease:'outExpo' })
    }
  })
}, { rootMargin: '0px 0px -8% 0px' })
```

**Migration risk:** Low — data-attribute driven, renderer-agnostic  
**`prefers-reduced-motion` handling:** `var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches` — checked at init; animations skipped if true

---

### AN-13 · Burst SVG Divider Animation

**Source:** `case-studies/haptix/css/style.css`, `main.js`

**Behavior:** `.burst` elements → `stroke-dashoffset` transition when `.in` class added (IntersectionObserver)  
**Migration risk:** Low — `.in` class toggle is renderer-agnostic

---

## Animation System 3 — GSAP Bento Interactions

### AN-14 · Bento 3D Tilt

**Source:** `index.html` (bento JS block), `CLAUDE.md §22`

```javascript
// On each .cs-bento-cell:
el.addEventListener('mousemove', (e) => {
  const rect = el.getBoundingClientRect()
  const cx = (e.clientX - rect.left) / rect.width - 0.5
  const cy = (e.clientY - rect.top) / rect.height - 0.5
  gsap.to(el, {
    rotateY: cx * 16,           // ±8°
    rotateX: -cy * 16,          // inverted
    transformPerspective: 800,
    duration: 0.7,
    ease: 'elastic.out(1, 0.45)',
    overwrite: 'auto'
  })
})
el.addEventListener('mouseleave', () => {
  gsap.to(el, {
    rotateX: 0, rotateY: 0,
    duration: 0.7,
    ease: 'elastic.out(1, 0.45)',
    overwrite: 'auto'
  })
})
```

**Disabled when:** Cell has `.flip-expanded` class; reset via `flip-done` custom event  
**Migration risk:** Medium  
**React adaptation:** `useEffect` on BentoBlock mount, `ref` on grid container, querySelectorAll for cells. Must detach listeners on unmount.

---

### AN-15 · Bento GSAP Flip Expand / Close

**Source:** `index.html` (bento JS)

```javascript
// Expand:
const state = Flip.getState(cell)
cell.classList.add('flip-expanded')
bentoStage.appendChild(cell)
Flip.from(state, { duration: 0.55, ease: 'power3.inOut', nested: true })

// Close:
// Reverse Flip → dispatch custom event 'flip-done' → tilt re-enables
```

**Migration risk:** High  
**React adaptation:** Flip requires the element to be in the DOM both before and after state change. In React, this means Flip must control DOM mutations directly — do not use React state for the expand animation. Use a ref + `Flip.getState()` before any React state change, then `Flip.from()` after.

**Conflict risk:** React's diffing may conflict with GSAP Flip's DOM manipulation. Solution: isolate the bento expand in a Portal or use `flushSync` to ensure DOM update happens synchronously before `Flip.from()`.

---

### AN-16 · Bento Mobile Card Stack (Swipe)

**Source:** `index.html` (bento JS)

**Behavior:**
- Fires on `DOMContentLoaded`, bails if `window.innerWidth > 640`
- Clones cell innerHTML into `.bento-stack-card` divs
- Hides original grid: `grid.style.display = 'none'`
- Swipe threshold: 80px; vertical scroll guard: abort if `|dy| > |dx| + 10`
- Snap-back: Anime.js `elastic.out(1, 0.5)` or GSAP equivalent

**Migration risk:** High  
**React adaptation:** In React, the mobile stack should be a separate component branch rendered when `useMediaQuery('(max-width: 640px)')` is true. The grid and stack can be two distinct JSX trees; no DOM cloning needed.

---

## Animation System 4 — Prototype Embed (GSAP Flip Morph)

### AN-17 · Prototype Card → Fullscreen Morph

**Source:** `index.html` (prototype JS block)

```javascript
// Expand (card rect → viewport):
const rect = thumb.getBoundingClientRect()
shell.style.cssText = `
  position:fixed; left:${rect.left}px; top:${rect.top}px;
  width:${rect.width}px; height:${rect.height}px;
  border-radius:${getComputedStyle(thumb).borderRadius};
`
shell.classList.add('open')
gsap.to(shell, {
  left:0, top:0, width:'100vw', height:'100vh',
  borderRadius:0, duration:0.52, ease:'power3.inOut'
})
gsap.to(overlay, { opacity:1, duration:0.18 })

// Collapse:
gsap.to(shell, { /* reverse */ duration:0.48, ease:'power3.inOut' })
```

**Migration risk:** High  
**React adaptation:** Use a Portal for `#proto-morph-shell` so it renders at `document.body` level. Capture `getBoundingClientRect()` from a ref on the card. All GSAP tweens remain vanilla.

---

## Animation System 5 — Haptix-Specific Interactions

### AN-18 · Slides Carousel (`go(i)`)

**Source:** `case-studies/haptix/js/main.js`

```javascript
function go(i) {
  // Anime.js slide enter
  if (!reduce && A.animate) {
    A.animate(slides[i], { opacity:[0,1], translateX:[16,0], duration:420, ease:'outExpo' })
  }
}
```

**Touch swipe:** `touchstart` → `touchend`, threshold 50px  
**Keyboard:** ArrowLeft/Right when slides panel visible  
**Migration risk:** Medium — straightforward React state (`currentSlide`), Anime.js for enter animation

---

### AN-19 · Main Tab Switch (Case Study / Slides)

**Source:** `case-studies/haptix/js/main.js`

```javascript
function show(which, noScroll) {
  // toggle aria-selected, hidden attributes
  // scrollTo #switch if !noScroll
  // setTimeout(ScrollTrigger.refresh, 50)  ← critical
}
```

**Migration risk:** Medium  
**React adaptation:** React state for active tab. `ScrollTrigger.refresh()` must be called after panel switch — use `useEffect` with tab dependency.

---

### AN-20 · Accordion `maxHeight` Expand/Collapse

**Source:** `case-studies/haptix/js/main.js`

```javascript
btn.onclick = function() {
  const panel = document.getElementById(btn.getAttribute('aria-controls'))
  const open = btn.getAttribute('aria-expanded') === 'true'
  btn.setAttribute('aria-expanded', !open)
  panel.style.maxHeight = open ? '0px' : panel.scrollHeight + 'px'
}
// Resize handler:
window.addEventListener('resize', function() {
  $$('.acc-b[aria-expanded="true"]').forEach(function(b) {
    const panel = document.getElementById(b.getAttribute('aria-controls'))
    panel.style.maxHeight = panel.scrollHeight + 'px'
  })
})
```

**Migration risk:** Low — standard pattern, easy in React with `useRef` + `scrollHeight`

---

### AN-21 · Lightbox Modal

**Source:** `case-studies/haptix/js/main.js`

**Behavior:**
- `openModal(html, wide)`: sets `mbody.innerHTML`, adds `.open` to `#modal`, traps focus on `#mclose`, disables body scroll
- `closeModal()`: removes `.open`, restores focus to `lastFocus`
- Gallery prev/next: `data-lb` attribute on buttons
- Keyboard: ArrowLeft/Right (gallery), Esc (close)
- Click backdrop: close

**Migration risk:** Medium  
**React adaptation:** React Portal at body level. Focus trap with `useRef`. Keyboard listeners in `useEffect`.

---

### AN-22 · Chapter Rail IntersectionObserver

**Source:** `index.html` + `case-studies/haptix/js/main.js`

```javascript
var io2 = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return
    var idx = sectionEls.indexOf(e.target)
    if (idx > -1) setActive(idx)
  })
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 })
```

**Scroll-to-bottom fix:** When within 80px of page bottom → activate last chapter  
**Migration risk:** Medium — standard IntersectionObserver pattern

---

## `prefers-reduced-motion` Coverage

| Animation | Current handling | Status |
|-----------|-----------------|--------|
| GSAP (all) | Haptix: `reduce` flag at init; Centronic: no explicit guard (GSAP honors OS setting for scrub) | ⚠️ Partial |
| Anime.js (all) | `anim()` wrapper checks `reduce` and bails | ✅ Covered |
| Burst SVG | CSS `@media (prefers-reduced-motion)` should disable transition | ⚠️ Not confirmed in CSS |
| Mobile bento swipe | Snap-back uses Anime.js — covered by `reduce` flag | ✅ Covered |
| Lightbox animation | No explicit reduced-motion handling in modal | ⚠️ Not covered |

**Migration recommendation:** Implement a global `useReducedMotion()` hook in React; pass it as a prop or context value to all animation-bearing components.

---

## Migration Risk Summary

| Animation | Component | Risk | Key Challenge |
|-----------|-----------|------|---------------|
| AN-01 SplitText entrance | HeroBlock | Medium | Hydration conflict with DOM restructuring |
| AN-02 Hero parallax | HeroBlock | Low | Standard pattern |
| AN-03 Pin-over-pin | HeroBriefScopeStack | High | Page-level ScrollTrigger, sticky CSS interaction |
| AN-14 Bento 3D tilt | BentoBlock | Medium | Ref-based event listeners, cleanup on unmount |
| AN-15 Bento Flip expand | BentoBlock | High | GSAP Flip + React reconciliation conflict |
| AN-16 Mobile card stack | BentoBlock | High | Media query branch rendering |
| AN-17 Prototype morph | PrototypeEmbedBlock | High | Portal + manual rect capture |
| AN-06 Impact count-up | ImpactListBlock | Medium | GSAP scrub targeting DOM node via ref |
| AN-18 Slides carousel | SlideBlock/SlidesPanel | Medium | React state + Anime.js enter |
| AN-19 Tab switch refresh | CaseStudyPage | Medium | ScrollTrigger.refresh() after tab change |
| AN-20 Accordion maxHeight | AccordionBlock | Low | Standard React pattern |
| AN-21 Lightbox | GalleryBlock/BentoBlock | Medium | Portal + focus trap |
| AN-22 Chapter rail | ChapterNav | Medium | IntersectionObserver cleanup |

---

## Vanilla JS → React/TypeScript Compatibility Assessment

The existing vanilla JS behavior **can be adapted to React/TypeScript** without changing visual results, subject to these constraints:

1. **GSAP/ScrollTrigger/Flip:** Use with refs, not ID selectors. Initialize in `useEffect`, return cleanup functions.
2. **Anime.js:** Wrap in `useEffect`. The `anim()` guard pattern can be a React hook (`useAnime()`).
3. **IntersectionObserver:** Use in `useEffect` with proper cleanup (`observer.disconnect()`).
4. **Event listeners:** All custom event listeners (mousemove, touchstart, etc.) must be added/removed in `useEffect` cleanup.
5. **`window.matchMedia`:** Use `useReducedMotion()` hook from `@mantine/hooks` or equivalent.
6. **DOM mutation by GSAP (Flip, morph):** Use Portals + `flushSync` where needed.
7. **`ScrollTrigger.refresh()`:** Must be called when layout changes (tab switch, accordion expand).

**Do not start converting code during this inventory phase.**

---

*Generated 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
