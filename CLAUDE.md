# SK Portfolio — Agent Instructions

This is Surya Konijeti's UX/product design portfolio.
Single HTML file: `index.html`. Deploys to Vercel on push to `main`.

---

## Hard rules — never break these

- **No AI slop / no generic layouts.** Every component must follow the SK Design System tokens.
- **No dark mode.** `body` background is always `var(--bg)` = `#f5f4f0`.
- **Never remove animations unilaterally.** Discuss first.
- **ZF is not a client.** Copy must say "I was a Senior UX Designer at ZF."
- **No close icon / "Exit the demo" text / status bar.**
- **Never overwrite design with a generic framework look.**
- **Ask before making non-trivial changes.** Understand what needs fixing first, get permission unless explicitly told to proceed.

---

## Token reference (all in `:root`, `index.html`)

```css
/* Colour */
--bg:        #f5f4f0
--ink:       #111110
--ink-2:     #545450
--ink-3:     #9a9a94
--rule:      #dddad0
--surface:   #eeece7
--sun:       #E8490F      /* brand accent — used for highlights */
--teal:      #E8490F      /* alias */

/* Layout */
--page-w:      1080px
--col-pad:     48px        /* desktop gutter */
--col-pad-m:   24px        /* mobile gutter */

/* Radii */
--r-sm:  6px
--r-md: 12px
--r-lg: 20px

/* Typography */
--font-serif: 'DM Serif Display', serif
--font-sans:  'DM Sans', system-ui, sans-serif

/* Spacing (4px base) */
--sp-1:4px  --sp-2:8px  --sp-3:12px  --sp-4:16px
--sp-5:20px --sp-6:24px --sp-8:32px  --sp-10:40px
--sp-12:48px --sp-16:64px --sp-20:80px --sp-24:96px

/* Motion */
--ease-out:        cubic-bezier(0.16,1,0.3,1)
--ease-out-quart:  cubic-bezier(0.165,0.84,0.44,1)
--t-fast: 150ms
--t-mid:  250ms
```

---

## Bento Grid System — BENTO-2 through BENTO-9

Reference: **SK Design System §22** → `https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`

### Bento tokens

```css
--r-bento:   24px;    /* cell border-radius */
--bento-gap: 16px;    /* grid gap — single value = row + column (tray effect) */
--bento-row: 200px;   /* base row height unit — all rows are 200px or multiples */
```

Gap = ⅔ × border-radius. Never change this ratio.

### Core cell rules

```css
/* ALWAYS the direct grid child — never add a wrapper div */
.cs-bento-cell {
  border-radius: var(--r-bento);
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
  background: var(--surface);
  min-height: 140px;
}

/* Image is a fixed window — NEVER resize the bento box to fit the image */
.cs-bento-cell img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center center;    /* always center-anchored */
}

/* Grid container */
.cs-bento { display: grid; gap: var(--bento-gap); width: 100%; }
```

### Image behavior — critical rules

1. **Cell = fixed window.** The bento box size NEVER changes to fit the image.
2. `object-fit: cover` always. Image crops to fill the cell.
3. Always center-aligned: `object-position: center center`.
4. If image aspect ratio matches cell → fills completely, no cropping.
5. If aspect ratio doesn't match → image crops, but **full image is always in the DOM**.
6. Expand button → opens full uncropped image in a lightbox.

### Hover overlay

```css
.cs-bento-overlay {
  position: absolute; inset: 0;
  background: rgba(17,17,16,0.80);    /* = var(--ink) at 80% */
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
  pointer-events: none; z-index: 1;
  border-radius: var(--r-bento);
}
.cs-bento-cell:hover .cs-bento-overlay { opacity: 1; }

.cs-bento-caption {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 16px;
  font-size: var(--text-caption);
  color: var(--bg);                   /* ALWAYS var(--bg), never var(--ink) */
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
  z-index: 2;
}
.cs-bento-cell:hover .cs-bento-caption { opacity: 1; }

.cs-bento-expand {
  position: absolute; bottom: 12px; right: 12px;
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(245,244,240,0.92);
  opacity: 0;
  transition: opacity var(--t-mid) var(--ease-out);
  z-index: 3; pointer-events: none;
}
.cs-bento-cell:hover .cs-bento-expand { opacity: 1; }
```

### All 9 grid layouts

```css
/* BENTO-2 — 2 cells, 1 row, 2 equal cols */
.cs-bento--2 { grid-template-columns:1fr 1fr; grid-template-rows:200px; }

/* BENTO-3 — 3 cells, 2 rows, 2 cols; C spans full width */
.cs-bento--3 { grid-template-columns:1fr 1fr; grid-template-rows:200px 200px; }
.cs-bento--3 .cs-bento-cell:nth-child(3) { grid-column:1/-1; }

/* BENTO-4 — 4 cells, 2 rows, 3 cols; A spans full width */
.cs-bento--4 { grid-template-columns:1fr 1fr 1fr; grid-template-rows:200px 200px; }
.cs-bento--4 .cs-bento-cell:nth-child(1) { grid-column:1/-1; }

/* BENTO-5 — 5 cells, 3 rows, 2 cols; C spans full width */
.cs-bento--5 { grid-template-columns:1fr 1fr; grid-template-rows:200px 200px 200px; }
.cs-bento--5 .cs-bento-cell:nth-child(3) { grid-column:1/-1; }

/* BENTO-6 — 6 cells, 4 rows, 2 cols; C and F span full width */
.cs-bento--6 { grid-template-columns:1fr 1fr; grid-template-rows:200px 200px 200px 200px; }
.cs-bento--6 .cs-bento-cell:nth-child(3),
.cs-bento--6 .cs-bento-cell:nth-child(6) { grid-column:1/-1; }

/* BENTO-7 — 7 cells, 3 rows, 3 cols; A tall-left (2-row), G wide-right */
.cs-bento--7 { grid-template-columns:1fr 1fr 1fr; grid-template-rows:200px 200px 200px; }
.cs-bento--7 .cs-bento-cell:nth-child(1) { grid-column:1; grid-row:1/3; }
.cs-bento--7 .cs-bento-cell:nth-child(2) { grid-column:2; grid-row:1; }
.cs-bento--7 .cs-bento-cell:nth-child(3) { grid-column:3; grid-row:1; }
.cs-bento--7 .cs-bento-cell:nth-child(4) { grid-column:2; grid-row:2; }
.cs-bento--7 .cs-bento-cell:nth-child(5) { grid-column:3; grid-row:2; }
.cs-bento--7 .cs-bento-cell:nth-child(6) { grid-column:1; grid-row:3; }
.cs-bento--7 .cs-bento-cell:nth-child(7) { grid-column:2/4; grid-row:3; }

/* BENTO-8 — 8 cells, 4 rows, 3 cols; A and E span full width */
.cs-bento--8 { grid-template-columns:1fr 1fr 1fr; grid-template-rows:200px 200px 200px 200px; }
.cs-bento--8 .cs-bento-cell:nth-child(1) { grid-column:1/-1; grid-row:1; }
.cs-bento--8 .cs-bento-cell:nth-child(2) { grid-column:1; grid-row:2; }
.cs-bento--8 .cs-bento-cell:nth-child(3) { grid-column:2; grid-row:2; }
.cs-bento--8 .cs-bento-cell:nth-child(4) { grid-column:3; grid-row:2; }
.cs-bento--8 .cs-bento-cell:nth-child(5) { grid-column:1/-1; grid-row:3; }
.cs-bento--8 .cs-bento-cell:nth-child(6) { grid-column:1; grid-row:4; }
.cs-bento--8 .cs-bento-cell:nth-child(7) { grid-column:2; grid-row:4; }
.cs-bento--8 .cs-bento-cell:nth-child(8) { grid-column:3; grid-row:4; }

/* BENTO-9 — 9 cells, 4 rows, 3 cols; A tall-left, G wide, H wide-left */
.cs-bento--9 { grid-template-columns:1fr 1fr 1fr; grid-template-rows:200px 200px 200px 200px; }
.cs-bento--9 .cs-bento-cell:nth-child(1) { grid-column:1; grid-row:1/3; }
.cs-bento--9 .cs-bento-cell:nth-child(2) { grid-column:2; grid-row:1; }
.cs-bento--9 .cs-bento-cell:nth-child(3) { grid-column:3; grid-row:1; }
.cs-bento--9 .cs-bento-cell:nth-child(4) { grid-column:2; grid-row:2; }
.cs-bento--9 .cs-bento-cell:nth-child(5) { grid-column:3; grid-row:2; }
.cs-bento--9 .cs-bento-cell:nth-child(6) { grid-column:1; grid-row:3; }
.cs-bento--9 .cs-bento-cell:nth-child(7) { grid-column:2/4; grid-row:3; }
.cs-bento--9 .cs-bento-cell:nth-child(8) { grid-column:1/3; grid-row:4; }
.cs-bento--9 .cs-bento-cell:nth-child(9) { grid-column:3; grid-row:4; }

/* Mobile — all layouts collapse to single column */
@media (max-width: 640px) {
  [class*="cs-bento--"] {
    grid-template-columns: 1fr; grid-template-rows: auto;
  }
  [class*="cs-bento--"] .cs-bento-cell {
    grid-column: auto !important; grid-row: auto !important;
    min-height: 200px;
  }
}
```

### Naming a bento layout in prompts

When you attach a screenshot or paste a bento and say "implement 1:1", the AI should:
1. Count the cells → pick the matching `BENTO-N` variant
2. Use exact CSS above — do not invent new grid definitions
3. Use `object-fit: cover` for every image — never resize the cell
4. Add `.cs-bento-overlay`, `.cs-bento-caption`, `.cs-bento-expand` to every cell
5. Use `var(--r-bento)`, `var(--bento-gap)`, `var(--bento-row)` — never hard-coded values

---

## Quote 2-up Component

Reference: **SK Design System §23**

```css
.pq-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-6);
  align-items: stretch;    /* equal height */
}
.pq-card {
  background: var(--surface);
  border-radius: var(--r-lg);
  padding: var(--sp-8);
  display: flex; flex-direction: column;
}
.pq-quote-text {
  font-family: var(--font-serif);
  font-style: italic;
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;   /* 3-line threshold */
  overflow: hidden;
  text-overflow: ellipsis;
}
.pq-quote-text.pq-expanded { display: block; overflow: visible; }
/* Attribution ALWAYS outside .pq-quote-text — never clamped */
.pq-attr { margin-top: var(--sp-4); font-size: var(--text-body-sm); color: var(--ink-3); }
```

---

## Slide Layout Component

Reference: **SK Design System §24**

```css
.sk-slide {
  display: grid;
  grid-template-columns: 2fr 3fr;  /* 40% text / 60% image */
  min-height: 420px;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--surface);
}
.sk-slide-text {
  padding: var(--col-pad);          /* 48px desktop */
  display: flex; flex-direction: column;
  justify-content: center; gap: var(--sp-6);
}
.sk-slide-image {
  position: relative; overflow: hidden; min-height: 300px;
}
.sk-slide-image img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center center;
}
@media (max-width: 640px) {
  .sk-slide { grid-template-columns: 1fr; }
  .sk-slide-text { padding: var(--col-pad-m); }  /* 20px */
}
```

---

## Motion system

- **GSAP 3.12 + ScrollTrigger** — scroll-pinned transitions, parallax, stagger reveals
- **Anime.js v4** — enters, reveals, hover, state changes
- All scroll animations use `ScrollTrigger.create()`; CSS sticky is used for card transitions (not GSAP pin — it breaks the full-bleed `left: 50%; margin-left: -50vw` trick)

---

## Scroll transition system (current production)

Three-section sequence: hero image → brief card → scope card

- `.hero-image-section` — full-bleed dark photo, natural z-index
- `.st-brief` — `position: sticky; top:0; z-index:2; border-radius:20px 20px 0 0`
- `.st-scope` — `position: relative; z-index:3; background:#1a1917; border-radius:20px 20px 0 0`

**Do NOT attempt GSAP pin on `.hero-image-section`.** It fails — CSS sticky is the correct tool here.

---

## Deployment

- Repo: `https://github.com/suryaheatz/Portfolio` (main branch)
- Auto-deploys to Vercel on every push to `main`
- Live URL: `https://surya-zf-centronic.vercel.app/`
- Single file: `index.html` — all HTML + CSS + JS in one file

---

## SK Design System

Single source of truth: `https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`

Sections: Colour · Spacing · Typography · Type Pairs · Responsive · List View · Tabs · Proto Card · Nav & Tags · Dark Card · Accordion · Modal · Progress · Tooltip · Image Block · Pullquote · Tags · Buttons · Patterns · Templates · Motion · **Bento Grid** · **Quote 2-up** · **Slide Layout**

**Before building any new component:** check the design system first. If the pattern isn't there, add it to the design system before implementing on the page.
