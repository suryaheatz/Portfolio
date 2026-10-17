# Haptix thumbwheel case study: deployment notes

Static site. No build step. Upload the whole folder.

- `index.html` page. `css/style.css`, `js/main.js`, `js/vendor/` (GSAP 3.12.5, ScrollTrigger, Anime.js 4.0.2).
- `prototype/` the 2026 interactive recreation, standalone. Open `prototype/index.html` directly, or it loads in the page iframe. React and Babel are vendored, no CDN needed. Serve over http(s); file:// will not run it.
- `assets/` screens (20), research images, styling renders, `wheel.png`.

## Before publishing
- Search for `[add` and `[placeholder` in the page: each is a slot waiting for your material (workshops, flow charts and mind maps, showroom notes, styling and CMF sketches, Figma prototype, handoff details, team size, impact lines).
- Hide all dashed placeholder boxes in one go: add `class="hide-ph"` to `<body>`.
- Logos: the two dashed slots in the hero (Mercedes-Benz/Daimler, ZF). Replace each with an `<img>` once you have the files.
- Images: replace a placeholder `<div class="gi ph-img" data-ph>` with `<button class="gi" data-lightbox data-flip-id="x" data-src="assets/..." data-cap="..."><img src="assets/..." alt="..."></button>`.
- Fonts load from Google Fonts (DM Sans, DM Serif Display).

## Notes
- Pin-over-pin (GSAP) runs only at 768px wide and 640px tall or more, and only for cards that fit the viewport.
- The lightbox is the 720px modal. Each image carries `data-flip-id`, so a GSAP Flip full-bleed version can replace `showImg()` in `js/main.js`.
- The prototype loads only after "Start the demo" (about 3 MB).
