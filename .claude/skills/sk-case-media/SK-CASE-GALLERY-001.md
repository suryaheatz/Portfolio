# SK-CASE-GALLERY-001 — Progressive Evidence Gallery

**Version:** 1.0  
**Status:** Approved  
**Reference:** SK Design System §26.6  
**Parent system:** SK-CASE-MEDIA-001.md  
**Skill:** `.claude/skills/sk-case-media/SKILL.md`

---

## Overview

The Progressive Evidence Gallery is approved for large secondary collections
of visual evidence — sketches, workshop scans, wireframes, research artefacts,
and similar material. It hides the collection from default case-study flow,
offers a stationary hover preview, then expands into a full gallery via
GSAP Flip, and finally allows individual fullscreen view.

---

## Desktop Interaction States

```
EDITORIAL
  ↓ hover trigger link
HOVER PREVIEW (stationary)
  ↓ click "View all [N] →"
EXPANDED GALLERY (GSAP Flip)
  ↓ click thumbnail
FULLSCREEN
  ↑ Escape / backdrop / Close → returns to previous state
```

---

## State 1 — Editorial

- Normal case-study prose
- An inline text link, e.g. "View evidence gallery →" or "See all 8 artefacts →"
- No gallery visible; no pre-loaded overlay
- No placeholder space reserved in layout

---

## State 2 — Stationary Hover Preview

**Trigger:** `mouseenter` / `focus` on the editorial link

**Behavior:**
- A stationary preview panel appears beside the editorial content
- Panel does NOT follow the cursor
- Images cycle within a fixed preview frame (one at a time, timed or on hover of nav dots)
- Framing-line animation on panel appearance (CSS clip-path or border draw)
- `mouseleave` / `blur` dismisses the preview
- After dismissal: no ghost; panel is fully hidden until hover/focus again

**Panel properties:**
- Fixed position relative to editorial trigger element
- Background: `var(--surface)`
- Border-radius: `var(--r-lg)` (20px)
- Padding: `var(--sp-6)` (24px)
- Image: `object-fit: contain`; natural proportions; intelligent blurred background
- Counter: `--text-caption` / `--ink-3`

**Preview cycling:**
- Auto-advance at ~2.5s interval while hovered
- Pause on internal hover of preview image
- Restart cycle on re-entry

---

## State 3 — Expanded Gallery (GSAP Flip)

**Trigger:** Click "View all →" button within hover preview, or direct click on editorial link

**Animation:**
- `Flip.getState()` captured on current preview image position
- Gallery overlay appears (`position: fixed; inset: 0; z-index: 500`)
- Preview image transitions via `Flip.from()` to gallery hero position
- Duration: `0.55s`, easing: `power3.inOut`, `nested: true`

**Gallery layout:**
- Hero image: left side (≥60% width), natural proportions, intelligent bg extension
- Thumbnail rail: right side or bottom strip, scrollable
- Thumbnail: `object-fit: cover`; active state: `border: 2px solid var(--sun)`
- Image counter: `--text-caption` / `--ink-3`
- Caption: below hero image, `--font-sans`, `--text-body-sm`
- Close control: top-right, no "Exit the demo" text, no status bar

**Framing lines:**
- Follow outer gallery frame
- CSS `clip-path` or `border` draw animation; `--t-mid` duration

**Thumbnail navigation:**
- Click thumbnail → hero updates with Flip or crossfade
- Keyboard: left/right arrows navigate images
- Active thumbnail always visible in scroll view

---

## State 4 — Fullscreen

**Trigger:** Click hero image in expanded gallery

**Animation:**
- Continuous transition from gallery hero → fullscreen
- GSAP Flip or CSS transform; same easing

**Controls:**
- Contextual left/right arrows (reveal near viewport edges, or on keyboard focus)
- Click image → next image
- Left/Right arrow keys → previous/next
- Escape / backdrop click / Close → returns to Expanded Gallery (State 3)
- Image counter visible
- Caption visible

---

## Gallery Reset Requirements

When returning from any expanded state to editorial:

**Must execute:**
1. Stop preview image cycling (clear `setInterval`)
2. Cancel all pending `setTimeout` callbacks
3. Hide tooltip/preview panel (`opacity: 0`, `pointer-events: none`)
4. Restore any DOM elements moved for Flip animations
5. Reset GSAP transforms and opacity on moved elements
6. Remove framing-line animation classes
7. Remove `.flip-expanded` class from any element
8. Clear fullscreen overlay state
9. Remove temporary `position: fixed` overrides

**The preview must remain hidden until the editorial trigger is
actually hovered or focused again — no ghost, no partial state.**

---

## Image Wiring Pattern

Gallery images are wired at runtime from the page's existing image object.
No base64 duplication. No separate image store.

```js
// Wire gallery images from shared I[] object at DOMContentLoaded
(function wireGalleryImages() {
  var GALLERY_KEYS = [
    { k: 'key1', t: 'Caption for image 1', n: 'Alt text 1' },
    { k: 'key2', t: 'Caption for image 2', n: 'Alt text 2' },
    // … one entry per gallery image
  ];
  var tipImgs = document.querySelectorAll('.tooltip__img');
  var navImgs = document.querySelectorAll('.nav__img');
  GALLERY_KEYS.forEach(function(item, idx) {
    if (I[item.k]) {
      if (tipImgs[idx]) { tipImgs[idx].src = I[item.k]; tipImgs[idx].alt = item.n; }
      if (navImgs[idx]) { navImgs[idx].src = I[item.k]; navImgs[idx].alt = item.n; }
    }
  });
})();
```

---

## GSAP Requirements

**Both GSAP core and Flip plugin must be loaded before gallery JS.**

Inline script order (critical — do not nest inside another `<script>`):
```html
<script>/* gsap 3.12.x inlined */</script>
<script>/* Flip 3.12.x inlined */</script>
<script>/* gallery JS — uses gsap and Flip globals */</script>
```

`gsap.registerPlugin(Flip)` must be called once before any Flip usage.

**Never attempt GSAP pin on the hero image section.** CSS sticky is the correct
tool for scroll-based reveal. (§ Scroll transition system in CLAUDE.md)

---

## Mobile Behavior

**No hover state on touch devices.**

Mobile progression:
```
EDITORIAL
  ↓ tap link
EXPANDED GALLERY
  ↓ tap hero image
FULLSCREEN
  ↑ swipe down / close → returns to previous state
```

**Requirements:**
- Swipe left/right in fullscreen navigates images
- Tap image in fullscreen → next image
- Horizontally scrollable thumbnail strip
- Active thumbnail visible in scroll view
- No hover-triggered preview
- No simulated hover

---

## CSS Class Reference

| Class | Role |
|-------|------|
| `.gallery-trigger` | Editorial inline link |
| `.tooltip` | Stationary hover preview panel |
| `.tooltip__img` | Preview cycling image (src="" in HTML, wired at runtime) |
| `.tooltip__counter` | Preview image counter |
| `.gallery-panel` | Expanded gallery overlay |
| `.gallery-hero` | Hero image in expanded gallery |
| `.gallery-hero__bg` | Blurred background layer (aria-hidden) |
| `.gallery-hero__fg` | Foreground contained image |
| `.nav__strip` | Thumbnail rail |
| `.nav__item` | Individual thumbnail container |
| `.nav__img` | Thumbnail image (src="" in HTML, wired at runtime) |
| `.nav__item.is-active` | Active thumbnail |
| `#fs-overlay` | Fullscreen overlay |

---

## Accessibility Checklist

- [ ] Editorial trigger: `role="button"` or `<button>` with descriptive label
- [ ] Preview panel: `aria-live="polite"` for cycling image changes
- [ ] Gallery: `role="dialog"` with `aria-label="Evidence Gallery"`
- [ ] Navigation buttons: `aria-label="Previous image"` / `"Next image"`
- [ ] Image counter: `aria-label="Image N of M"`
- [ ] All images: meaningful `alt` text
- [ ] Keyboard: Tab to trigger → Enter/Space opens gallery → Arrow keys navigate → Escape closes
- [ ] Focus trap active while gallery or fullscreen is open
- [ ] Focus returns to editorial trigger on close

---

*SK Design System §26.6 — Progressive Evidence Gallery*  
*Approved: Gate 2A-4D*
