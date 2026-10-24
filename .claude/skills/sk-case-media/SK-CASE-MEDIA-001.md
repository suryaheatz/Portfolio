# SK-CASE-MEDIA-001 — Case Study Media Presentation System

**Version:** 1.1  
**Status:** Approved  
**Reference:** SK Design System §26  
**Skill:** `.claude/skills/sk-case-media/SKILL.md`  
**Gallery spec:** `SK-CASE-GALLERY-001.md` (same directory)  
**Implementation source:** Gate 2A-4C Playground (`https://claude.ai/artifact/6YhqaU9UcThSNzXuzF4mft`)

---

## Overview

The SK Case Study Media System defines approved patterns for presenting visual
evidence in portfolio case studies. All patterns use SK Design System tokens,
preserve natural image proportions for evidentiary content, and share a
consistent fullscreen media viewer.

---

## Approved Media Patterns

### A. Full-Width Figure

**Use when:**
- One image is important enough to stand alone
- The visual contains detail that must remain readable
- Cropping would remove meaning

**Implementation:**
- Natural aspect ratio — `height: auto; width: 100%`
- `object-fit: contain` (never cover for standalone figures)
- Caption below, using `--text-caption` / `--ink-2`
- Expand affordance → shared fullscreen viewer

#### Approved Implementation Code

```css
.fig-full {
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--surface);
  position: relative;
  cursor: zoom-in;
}
.fig-full img {
  width: 100%;
  display: block;
}
.fig-full-caption {
  padding: var(--sp-4) var(--sp-6);
  font-size: var(--text-body-sm);
  color: var(--ink-2);
  border-top: 1px solid var(--rule);
  background: var(--bg);
}
.fig-full-caption strong {
  color: var(--ink);
  font-weight: 500;
}
```

```html
<figure class="fig-full">
  <img src="…" alt="Descriptive alt text">
  <figcaption class="fig-full-caption">
    <strong>Label.</strong> Caption text describing what the image shows.
  </figcaption>
</figure>
```

---

### B. Adaptive Bento

**Use when:**
- Multiple images have compatible proportions
- Images have comparable importance
- The arrangement improves comprehension

**Bento is NOT the default for every image group.**

**Do NOT use Bento when:**
- Cropping destroys information (wireframes, diagrams, IA maps)
- Images become too small to read at bento scale
- Aspect ratios conflict significantly
- A sequence or comparison would communicate better

**Implementation:** SK Design System §22 (BENTO-2 through BENTO-9).

#### Approved Implementation Code

```css
/* Grid container */
.cs-bento { display: grid; gap: var(--bento-gap); width: 100%; }

/* Cell — always the direct grid child */
.cs-bento-cell {
  border-radius: var(--r-bento);
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
  background: var(--surface);
  min-height: 140px;
}

/* Variant: 2-up equal columns */
.cs-bento--2 { grid-template-columns: 1fr 1fr; grid-template-rows: 280px; }

/* Variant: 3 cells, C spans full width */
.cs-bento--3 { grid-template-columns: 1fr 1fr; grid-template-rows: 240px 240px; }
.cs-bento--3 .cs-bento-cell:nth-child(3) { grid-column: 1/-1; }

/* Variant: asymmetric — A tall-left spanning 2 rows */
.cs-bento--asym { grid-template-columns: 3fr 2fr; grid-template-rows: 240px 240px; }
.cs-bento--asym .cs-bento-cell:nth-child(1) { grid-row: 1/3; }

/* Image: always cover for bento */
.cs-bento-cell img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center center;
}

/* Contain mode — for wireframes/diagrams where cropping is unsafe */
.cs-bento--contain .cs-bento-cell img {
  object-fit: contain;
  background: var(--surface);
  padding: var(--sp-3);
}

/* Hover overlay */
.cs-bento-overlay {
  position: absolute; inset: 0;
  background: rgba(17,17,16,.75);
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
  pointer-events: none; z-index: 1;
  border-radius: var(--r-bento);
}
.cs-bento-cell:hover .cs-bento-overlay { opacity: 1; }

/* Hover caption */
.cs-bento-caption {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: var(--sp-4) var(--sp-5);
  font-size: var(--text-caption);
  color: var(--bg);
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
  z-index: 2;
  background: linear-gradient(transparent, rgba(0,0,0,.5));
  border-radius: 0 0 var(--r-bento) var(--r-bento);
}
.cs-bento-cell:hover .cs-bento-caption { opacity: 1; }

/* Expand icon */
.cs-bento-expand {
  position: absolute; top: 12px; right: 12px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(245,244,240,.9);
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
  z-index: 3; pointer-events: none; color: var(--ink);
}
.cs-bento-cell:hover .cs-bento-expand { opacity: 1; }

/* Mobile: stack to single column */
@media (max-width: 640px) {
  .cs-bento--2, .cs-bento--3, .cs-bento--asym {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .cs-bento--2 .cs-bento-cell,
  .cs-bento--3 .cs-bento-cell,
  .cs-bento--asym .cs-bento-cell {
    grid-column: auto !important;
    grid-row: auto !important;
    height: 240px;
  }
  .cs-bento--3 .cs-bento-cell:nth-child(3) { grid-column: auto; }
}
```

```html
<!-- 2-up bento -->
<div class="cs-bento cs-bento--2">
  <div class="cs-bento-cell">
    <img src="…" alt="…">
    <div class="cs-bento-overlay"></div>
    <div class="cs-bento-caption">Caption A</div>
    <div class="cs-bento-expand" aria-hidden="true"><!-- expand SVG --></div>
  </div>
  <div class="cs-bento-cell">
    <img src="…" alt="…">
    <div class="cs-bento-overlay"></div>
    <div class="cs-bento-caption">Caption B</div>
    <div class="cs-bento-expand" aria-hidden="true"><!-- expand SVG --></div>
  </div>
</div>
```

---

### C. Two-Up Comparison

**Use for:**
- Before / after
- V1 / V2
- Related states
- Direct visual comparison

**Implementation:**
- `display: grid; grid-template-columns: 1fr 1fr;`
- Equal cell height; independent scroll if images are tall
- Label each panel (V1 / V2, Before / After)
- Shared fullscreen — clicking either opens fullscreen at that index

#### Approved Implementation Code

Interactive before/after slider (drag to reveal):

```css
.before-after {
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  cursor: ew-resize;
  user-select: none;
  touch-action: none;
}
.ba-images {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
}
.ba-before, .ba-after {
  position: absolute; inset: 0; overflow: hidden;
}
.ba-before img, .ba-after img {
  width: 100%; height: 100%;
  object-fit: contain;
  object-position: center;
  background: var(--surface);
  display: block;
}
/* After panel clips to reveal amount */
.ba-after { clip-path: inset(0 50% 0 0); }

/* Divider line */
.ba-divider {
  position: absolute; top: 0; bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 2px; background: white;
  z-index: 10; pointer-events: none;
}
/* Drag handle */
.ba-handle {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,.25);
  display: flex; align-items: center; justify-content: center;
  z-index: 11; pointer-events: none;
}
/* Panel labels */
.ba-label {
  position: absolute; bottom: var(--sp-4);
  font-size: var(--text-label); font-weight: 600;
  letter-spacing: .06em; text-transform: uppercase;
  background: rgba(245,244,240,.92); color: var(--ink);
  padding: 3px 10px; border-radius: 4px;
  z-index: 5; pointer-events: none;
}
.ba-label-before { left: var(--sp-4); }
.ba-label-after  { right: var(--sp-4); }
```

```html
<div class="before-after" id="baSlider">
  <div class="ba-images">
    <div class="ba-before">
      <img src="before.jpg" alt="Before state">
    </div>
    <div class="ba-after" id="baAfter">
      <img src="after.jpg" alt="After state">
    </div>
  </div>
  <div class="ba-divider" id="baDivider"></div>
  <div class="ba-handle" id="baHandle">
    <!-- ← → arrows SVG -->
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7 4l-4 6 4 6M13 4l4 6-4 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  <span class="ba-label ba-label-before">Before</span>
  <span class="ba-label ba-label-after">After</span>
</div>
```

```js
// Before/After slider interaction
(function() {
  const slider = document.getElementById('baSlider');
  const after  = document.getElementById('baAfter');
  const div    = document.getElementById('baDivider');
  const hand   = document.getElementById('baHandle');
  let drag = false;

  function pos(x) {
    const r = slider.getBoundingClientRect();
    const p = Math.max(5, Math.min(95, (x - r.left) / r.width * 100));
    after.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    div.style.left = hand.style.left = p + '%';
  }

  slider.addEventListener('mousedown',  e => { drag = true; pos(e.clientX); });
  window.addEventListener('mousemove',  e => { if (drag) pos(e.clientX); });
  window.addEventListener('mouseup',    () => { drag = false; });
  slider.addEventListener('touchstart', e => { drag = true; pos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  e => { if (drag) { e.preventDefault(); pos(e.touches[0].clientX); } }, { passive: false });
  window.addEventListener('touchend',   () => { drag = false; });

  // Init at 50%
  after.style.clipPath = 'inset(0 50% 0 0)';
  div.style.left = hand.style.left = '50%';
})();
```

---

### D. Evolution / Sequence

**Use when:**
- Order matters
- Designs evolve over time
- Multiple stages form one narrative

**Implementation:**
- Horizontal scrolling timeline or numbered vertical stack
- Label each step with version number or stage name
- Shared fullscreen with sequential navigation

#### Approved Implementation Code

```css
/* 3-column evolution strip */
.evo-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--bento-gap);
}
.evo-card {
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--surface);
  cursor: zoom-in;
}
.evo-card-img {
  aspect-ratio: 4/3;
  overflow: hidden;
}
.evo-card-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform .4s var(--ease-out);
}
.evo-card:hover .evo-card-img img { transform: scale(1.03); }

/* Card meta */
.evo-card-info {
  padding: var(--sp-4) var(--sp-5);
  border-top: 1px solid var(--rule);
}
.evo-card-step {
  font-size: var(--text-label);
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--sun);
  margin-bottom: var(--sp-1);
}
.evo-card-name {
  font-size: var(--text-body-sm);
  color: var(--ink);
  font-weight: 500;
}
.evo-card-note {
  font-size: var(--text-caption);
  color: var(--ink-3);
  margin-top: var(--sp-1);
}

/* Mobile: single column */
@media (max-width: 640px) {
  .evo-strip { grid-template-columns: 1fr; }
}
```

```html
<div class="evo-strip">
  <div class="evo-card">
    <div class="evo-card-img">
      <img src="v1.jpg" alt="Version 1 — initial concept">
    </div>
    <div class="evo-card-info">
      <div class="evo-card-step">V1</div>
      <div class="evo-card-name">Initial Concept</div>
      <div class="evo-card-note">Exploratory sketches</div>
    </div>
  </div>
  <div class="evo-card">
    <div class="evo-card-img">
      <img src="v2.jpg" alt="Version 2 — refined layout">
    </div>
    <div class="evo-card-info">
      <div class="evo-card-step">V2</div>
      <div class="evo-card-name">Refined Layout</div>
      <div class="evo-card-note">User testing feedback applied</div>
    </div>
  </div>
  <div class="evo-card">
    <div class="evo-card-img">
      <img src="v3.jpg" alt="Version 3 — final design">
    </div>
    <div class="evo-card-info">
      <div class="evo-card-step">V3</div>
      <div class="evo-card-name">Final Design</div>
      <div class="evo-card-note">Production-ready</div>
    </div>
  </div>
</div>
```

---

### E. Annotated Media

**Use for:**
- Technical callouts
- Hardware specifications
- Gesture explanations
- Component-level details

**Rules:**
- Annotations must remain secondary to the image
- Annotation text: `--text-caption` size, `--ink` color on `--surface` pill
- Connector lines: `--ink-3`, 1px
- No annotation overlaps another annotation or key content area
- Expand → fullscreen shows uncropped image; annotations optionally hidden

#### Approved Implementation Code

```css
/* Annotated image container */
.annot-wrap { position: relative; display: inline-block; width: 100%; }
.annot-img-container {
  position: relative;
  border-radius: var(--r-lg);
  overflow: visible;
  background: var(--surface);
  cursor: zoom-in;
}
.annot-img-container img {
  width: 100%; display: block;
  border-radius: var(--r-lg);
}

/* Hotspot pin */
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.hotspot-ring {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--sun);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: white;
  cursor: pointer;
  box-shadow: 0 0 0 3px rgba(232,73,15,.25), 0 2px 8px rgba(232,73,15,.4);
  transition: transform .2s var(--ease-out), box-shadow .2s;
  user-select: none;
}
.hotspot-ring:hover,
.hotspot-ring.is-active {
  transform: scale(1.15);
  box-shadow: 0 0 0 5px rgba(232,73,15,.3), 0 4px 12px rgba(232,73,15,.5);
}

/* Pulse animation */
@keyframes ping {
  0%   { transform: scale(1); opacity: .7; }
  100% { transform: scale(2.2); opacity: 0; }
}
.hotspot-ping {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(232,73,15,.4);
  animation: ping 1.8s var(--ease-out) infinite;
  pointer-events: none;
}

/* Tooltip */
.hotspot-tip {
  position: absolute;
  bottom: calc(100% + 10px); left: 50%;
  transform: translateX(-50%) translateY(6px);
  background: var(--ink);
  color: var(--bg);
  font-size: var(--text-body-sm);
  border-radius: var(--r-md);
  padding: var(--sp-3) var(--sp-4);
  min-width: 200px; max-width: 280px;
  pointer-events: none; opacity: 0;
  transition: opacity .2s, transform .2s;
  z-index: 20;
  box-shadow: 0 4px 20px rgba(0,0,0,.35);
}
.hotspot-tip::after {
  content: '';
  position: absolute; top: 100%; left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--ink);
}
.hotspot:hover .hotspot-tip,
.hotspot.is-active .hotspot-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.hotspot-tip-title {
  font-weight: 600; margin-bottom: var(--sp-1);
  color: white; font-size: var(--text-body-sm);
}
.hotspot-tip-body {
  font-size: var(--text-caption);
  color: rgba(232,230,223,.7);
}

/* Zoom button */
.annot-zoom-btn {
  position: absolute; top: var(--sp-3); right: var(--sp-3);
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(245,244,240,.92);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  z-index: 8;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
  transition: background .2s, transform .2s;
}

/* Legend below image */
.annot-legend {
  margin-top: var(--sp-5);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--sp-3);
}
.annot-legend-item {
  display: flex; gap: var(--sp-3); align-items: flex-start;
}
.annot-legend-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--sun); color: white;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
```

```html
<div class="annot-wrap">
  <div class="annot-img-container">
    <img src="hardware.jpg" alt="Device hardware overview with callout points">

    <!-- Hotspot 1 — positioned as % of image dimensions -->
    <div class="hotspot" style="left: 35%; top: 28%">
      <div class="hotspot-ping"></div>
      <div class="hotspot-ring" role="button" aria-expanded="false" aria-label="Callout 1: Sensor array">1</div>
      <div class="hotspot-tip">
        <div class="hotspot-tip-title">Sensor Array</div>
        <div class="hotspot-tip-body">6-axis IMU + barometric pressure sensor for gesture detection</div>
      </div>
    </div>

    <!-- Hotspot 2 -->
    <div class="hotspot" style="left: 62%; top: 55%">
      <div class="hotspot-ping"></div>
      <div class="hotspot-ring" role="button" aria-expanded="false" aria-label="Callout 2: Haptic motor">2</div>
      <div class="hotspot-tip">
        <div class="hotspot-tip-title">Haptic Motor</div>
        <div class="hotspot-tip-body">Linear resonant actuator, 150Hz feedback for tactile confirmation</div>
      </div>
    </div>

    <button class="annot-zoom-btn" aria-label="View full image">
      <!-- zoom SVG icon -->
    </button>
  </div>

  <!-- Legend -->
  <div class="annot-legend" id="annotLegend">
    <div class="annot-legend-item">
      <div class="annot-legend-num">1</div>
      <div>
        <strong>Sensor Array</strong><br>
        6-axis IMU + barometric pressure sensor
      </div>
    </div>
    <div class="annot-legend-item">
      <div class="annot-legend-num">2</div>
      <div>
        <strong>Haptic Motor</strong><br>
        Linear resonant actuator, 150Hz feedback
      </div>
    </div>
  </div>
</div>

<script>
// Hotspot tap toggle (mobile)
document.querySelectorAll('.hotspot-ring').forEach(ring => {
  ring.addEventListener('click', function() {
    const hs = this.closest('.hotspot');
    const was = hs.classList.contains('is-active');
    document.querySelectorAll('.hotspot').forEach(h => h.classList.remove('is-active'));
    if (!was) {
      hs.classList.add('is-active');
      this.setAttribute('aria-expanded', 'true');
    } else {
      this.setAttribute('aria-expanded', 'false');
    }
  });
  ring.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ring.click(); }
  });
});
</script>
```

---

### F. Evidence Gallery

**Use when:**
- Many sketches, scans, wireframes, or supporting artefacts would make the
  case study excessively long
- The material is useful evidence but does not need permanent full-page
  visibility

**Do NOT hide:**
- Primary findings or key insights
- Essential narrative content
- Images central to the argument of the case study

**See SK-CASE-GALLERY-001 for full interaction specification.**

#### Approved Implementation Code

The Evidence Gallery uses a 4-stage progressive disclosure system. Full JS is in the gallery itself; the key structural CSS is documented here. **For full gallery implementation, see `SK-CASE-GALLERY-001.md`.**

**Required dependencies (inline before gallery JS):**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Flip.min.js"></script>
<script>gsap.registerPlugin(Flip);</script>
```

**Grid + sidebar layout:**
```css
:root {
  --tooltip-w: 240px;
  --nav-h: 72px;
}

/* Main layout grid */
.content {
  display: grid;
  grid-template-columns: 1fr var(--tooltip-w);
  grid-template-areas:
    "pretitle pretitle"
    "text     tooltip"
    "gallery  gallery"
    "nav      nav";
  column-gap: var(--sp-12);
  row-gap: var(--sp-8);
  position: relative;
}

/* Hover preview sidebar */
.tooltip {
  grid-area: tooltip;
  position: relative;
  align-self: start;
  opacity: 0;
  pointer-events: none;
}
.tooltip__img-wrap {
  width: 100%;
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--surface);
  position: relative;
  height: 260px;
  display: grid;
  grid-template-areas: "img";
}
.tooltip__img {
  grid-area: img;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.tooltip__img--current { opacity: 1; }
```

**Gallery panel (expanded state):**
```css
.gallery {
  grid-area: gallery;
  display: none;
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--surface);
  min-height: 200px;
}

/* Intelligent blurred background (Layer B) */
.gallery__bg {
  position: absolute; inset: 0;
  z-index: 0; pointer-events: none; overflow: hidden;
}
.gallery__bg img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  transform: scale(1.08);
  filter: blur(32px) saturate(0.7);
  opacity: 0.55;
  border-radius: 0;
}

/* Foreground image (Layer F) */
.gallery > .tooltip__img {
  display: block;
  position: relative; z-index: 1;
  width: 100%; height: 100%;
  object-fit: contain;
  object-position: center center;
  border-radius: 0;
  opacity: 1;
  cursor: zoom-in;
}

/* Gradient scrim */
.gallery__scrim {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 96px;
  background: linear-gradient(to top, rgba(17,17,16,0.72) 0%, transparent 100%);
  z-index: 2; pointer-events: none;
}

/* Title overlay */
.gallery__title {
  position: absolute; bottom: var(--sp-6); left: var(--sp-6);
  z-index: 3; overflow: hidden; pointer-events: none;
}
```

**Fullscreen state:**
```css
.gallery--fullscreen {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important; height: 100vh !important;
  z-index: 200 !important;
  border-radius: 0 !important;
  display: flex !important;
  align-items: center; justify-content: center;
  background: var(--ink);
}
```

**Nav thumbnail strip:**
```css
.nav {
  grid-area: nav;
  display: none;
  gap: var(--sp-3);
  align-items: center;
  height: var(--nav-h);
  position: relative;
  overflow: hidden;
}
.nav__img {
  height: 100%;
  aspect-ratio: 16/10;
  object-fit: cover;
  border-radius: var(--r-sm);
  cursor: pointer;
  opacity: 0;
  flex-shrink: 0;
}
.nav__img--selected {
  outline: 2px solid var(--sun);
  outline-offset: 2px;
}
```

**Open-state overrides:**
```css
/* When gallery is open, hide text column and show gallery + nav */
.content--open .content__text {
  opacity: 0; pointer-events: none;
  overflow: hidden; height: 0;
  min-height: 0; margin: 0; padding: 0;
}
.content--open .gallery { display: block; }
.content--open .nav     { display: flex; }
```

**Key JS pattern — GSAP Flip for image transitions:**
```js
// Image transition via Flip
function selectImage(i) {
  if (i === current || isAnimating) return;
  isAnimating = true;

  const prevImg = tooltipImgs[current];
  const nextImg = tooltipImgs[i];

  // Capture state before any DOM change
  const flipState = Flip.getState(nextImg, { simple: true });

  // Return previous image to tooltip
  tooltipWrap.appendChild(prevImg);
  prevImg.classList.remove('tooltip__img--current');
  gsap.set(prevImg, { clearProps: 'all' });

  // Bring next into gallery
  current = i;
  gallery.prepend(nextImg);
  nextImg.classList.add('tooltip__img--current');

  // Update blurred background
  setBgImage(nextImg.src);

  // Update nav selection
  navImages.forEach(n => n.classList.remove('nav__img--selected'));
  navImages[current].classList.add('nav__img--selected');

  // Animate with Flip
  Flip.from(flipState, {
    duration: 0.5, ease: 'power3.inOut', scale: true,
    onComplete: () => { isAnimating = false; }
  });
}

// Blurred background update
function setBgImage(src) {
  const bgImg = gallery.querySelector('.gallery__bg img');
  if (bgImg) bgImg.src = src;
}

// Fullscreen zoom in
function zoomIn() {
  const flipImg = Flip.getState(tooltipImgs[current], { simple: true });
  gallery.classList.add('gallery--fullscreen');
  isFullscreen = true;
  Flip.from(flipImg, { duration: 0.7, ease: 'power4', scale: true });
}

// Fullscreen zoom out
function zoomOut() {
  const flipImg = Flip.getState(tooltipImgs[current], { simple: true });
  gallery.classList.remove('gallery--fullscreen');
  isFullscreen = false;
  Flip.from(flipImg, { duration: 0.7, ease: 'power4', scale: true });
}
```

**Image wiring — shared I[] object:**
```js
// All images declared once in a shared I[] object
// Gallery wired at runtime via wireGalleryImages() IIFE
// NEVER duplicate base64 — always reference I[key].src

(function wireGalleryImages() {
  const keys = ['sketch-01', 'sketch-02', 'wireframe-01', /* … */];
  const navEl = document.querySelector('.nav');
  const tooltipWrap = document.querySelector('.tooltip__img-wrap');

  keys.forEach((key, i) => {
    // Tooltip image (source of truth)
    const img = document.createElement('img');
    img.src = I[key].src;
    img.alt = I[key].alt || '';
    img.className = 'tooltip__img' + (i === 0 ? ' tooltip__img--current' : '');
    tooltipWrap.appendChild(img);

    // Nav thumbnail
    const nav = document.createElement('img');
    nav.src = I[key].src;
    nav.alt = '';
    nav.className = 'nav__img' + (i === 0 ? ' nav__img--selected' : '');
    nav.setAttribute('aria-hidden', 'true');
    navEl.appendChild(nav);
  });
})();
```

---

## Media-Selection Workflow

Every time Claude encounters multiple media assets in a case study, follow this
four-stage sequence before writing any HTML.

### Stage 1 — Inspect

Evaluate:
- Image dimensions and aspect ratios
- Legibility at target display size
- Content density (wireframe vs. photo vs. diagram)
- Whether a sequence or temporal order exists
- Relative importance of each asset
- Whether cropping removes meaningful information
- Whether assets form one logical collection

### Stage 2 — Select

Choose the approved SK pattern that best supports the content.  
Do not select a layout only because it visually fills space.

Pattern priority heuristic:
1. Single critical image → Full-Width Figure
2. Temporal or process sequence → Evolution / Sequence
3. Direct A/B comparison → Two-Up Comparison
4. Technical detail → Annotated Media
5. Multiple comparable images → Adaptive Bento (only if cropping is safe)
6. Large secondary collection → Evidence Gallery

### Stage 3 — Apply

Use:
- SK typography tokens (`--font-serif`, `--font-sans`, `--text-*`)
- SK spacing tokens (`--sp-*`, `--col-pad`, `--col-pad-m`)
- SK colour tokens (`--ink`, `--ink-2`, `--ink-3`, `--surface`, `--bg`)
- Natural image proportions (see §Natural Image Proportions below)
- Intelligent blurred background extension where appropriate
- Responsive behavior (desktop + mobile)
- Accessibility rules (alt text, ARIA labels, keyboard nav)

### Stage 4 — Validate

Test:
- Desktop (1080px+ viewport)
- Tablet (768px)
- Mobile (≤640px)
- Image legibility at each breakpoint
- Cropping behavior
- Navigation (keyboard + pointer)
- Caption readability
- Accessibility (keyboard focus, ARIA)
- Interaction behavior (hover, expand, fullscreen, close)

**New presentation patterns require explicit approval before being added to the
Design System.**

---

## Natural Image Proportions

**Mandatory default for evidentiary media.**

Use intrinsic dimensions (`naturalWidth / naturalHeight`). Do not require
manual aspect-ratio configuration per image.

```css
/* Default for evidentiary content */
img.sk-evidence {
  object-fit: contain;
  width: 100%;
  height: auto;
}
```

**Never crop:**
- Wireframes
- Research diagrams
- Workshop scans
- Technical documentation
- IA diagrams
- Annotated screenshots
- Process maps

**`object-fit: cover` only when:**
- Cropping is explicitly appropriate (e.g. bento hero image, background photo)
- Cropping does not remove meaningful information

---

## Intelligent Background Extension

When a contained image does not fill its media container (e.g. a tall
wireframe in a wide panel), use intelligent blurred background extension.

**Layers:**
```
┌─ container (overflow: hidden) ──────────────────────┐
│  [background] same src, object-fit: cover,          │
│               blur(32px) scale(1.08), opacity 0.55  │
│  [foreground] same src, object-fit: contain,        │
│               position: relative, z-index: 1        │
└─────────────────────────────────────────────────────┘
```

**Implementation:**
```html
<div class="sk-media-frame">
  <img class="sk-media-bg" src="…" aria-hidden="true">
  <img class="sk-media-fg" src="…" alt="…">
</div>
```
```css
.sk-media-frame {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-md);
  background: var(--surface);
}
.sk-media-bg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: blur(32px) saturate(0.7);
  transform: scale(1.08);
  opacity: 0.55;
  pointer-events: none;
}
.sk-media-fg {
  position: relative; z-index: 1;
  width: 100%; height: auto;
  object-fit: contain;
  display: block;
}
```

**Requirements:**
- No source-image modification
- No runtime AI generation
- Background layer is `aria-hidden="true"` — decorative only
- Background must not intercept pointer events
- White diagrams: reduce blur opacity further (0.2–0.25) or use SK `--surface` fallback
- Dark images: blend naturally at 0.55 opacity
- Mixed collections: test each; fall back to solid `--surface` when noisy

**Neutral SK fallback (when blur is inappropriate):**
```css
.sk-media-frame { background: var(--surface); }
/* Remove .sk-media-bg entirely */
```

---

## Shared Fullscreen Media Viewer

All grouped media patterns share a consistent fullscreen overlay.

### Desktop Controls

| Input | Action |
|-------|--------|
| Image click | Advance to next image |
| Left arrow key | Previous image |
| Right arrow key | Next image |
| Contextual edge arrows | Previous / next (reveal near edges) |
| Escape | Return to previous presentation state |
| Close X | Return to previous presentation state |
| Backdrop click | Return to previous presentation state |

**Controls:**
- Contextual arrows hidden by default; reveal on cursor near edge or keyboard focus
- Image counter always visible (e.g. `3 / 8`)
- Caption always visible
- Selected image retained when closing and reopening

### Mobile Controls

| Input | Action |
|-------|--------|
| Swipe left | Next image |
| Swipe right | Previous image |
| Tap image | Next image |
| Horizontally scrollable thumbnails | Jump to image |

**Requirements:**
- Active thumbnail visible in scroll view
- Thumbnails above caption
- Close control always accessible
- Image counter visible
- Safe-area-aware padding (`env(safe-area-inset-*)`)

---

## Caption Accessibility

Image titles and captions must remain readable over all image types.

**When text overlays imagery:**
- Use restrained contrast gradient / scrim (not a heavy overlay)
- Appropriate text colour (`--bg` on dark scrim, `--ink` on light surface)
- WCAG 4.5:1 minimum contrast where applicable

**When overlay would obscure essential information:**
- Place caption outside the image (below, in a `figcaption`)

**All media requires:**
- Meaningful `alt` text (describe what the image shows, not "image of")
- Accessible counters (`aria-label="Image 3 of 8"`)
- Accessible navigation labels (`aria-label="Previous image"`)
- Keyboard focus states on all interactive controls
- `aria-live="polite"` announcements for image changes

---

## Responsive Rules

### Desktop (≥1080px)
Full pattern with all interactions.

### Tablet (768px–1079px)
- Bento: reduce to 2-col max, increase `--bento-row` to 220px
- Comparison: maintain 2-col; reduce padding
- Gallery: desktop hover progression

### Mobile (≤640px)
- Full-Width Figure: natural stack, `width: 100%`
- Bento: mobile card stack (§22 rules)
- Two-Up: stack vertically, 1-col
- Evolution: vertical timeline
- Annotated: image full width, annotations below as numbered list
- Evidence Gallery: no hover state; tap → expanded gallery → fullscreen

**Do not simulate hover on touch devices.**

---

## Do Not Modify

- Centronic production case study
- Haptix production case study
- Chapter structure
- Decap CMS integration

This system formalizes approved patterns only. It does not authorize redesign
of production case studies.

---

*SK Design System §26 — SK Case Study Media System*  
*Approved: Gate 2A-4D | Implementation code: Gate 2A-4C Playground*  
*Version 1.1 — implementation code sections added under all six patterns*
