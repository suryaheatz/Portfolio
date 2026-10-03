# ZF Centronic Portfolio — Session Log

**Project:** Surya Konijeti · Senior UX Designer at ZF Friedrichshafen AG (2019)  
**Product:** Centronic/MMA — Haptic Rotary HMI for SAE Level 4 Autonomous Vehicles  
**Live URL:** https://surya-zf-centronic.vercel.app  
**GitHub Repo:** https://github.com/suryaheatz/Portfolio  
**Deployed via:** Vercel (auto-deploys on push to `main`)

---

## Hard Constraints (never violate these)

- No AI slop / no generic framework layouts
- No dark mode — background is always `#f5f4f0` (warm off-white)
- Interface feels like a case study, not a tech marketing brochure
- Always ask: "Would an Apple designer approve this?" before publishing
- ZF is not a client — copy must say "I was a Senior UX Designer at ZF", never "ZF gave us a brief"
- Never remove animations unilaterally — always discuss with Surya first
- Always discuss animation intent and viewer experience before touching animation code

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#f5f4f0` | Page background |
| `--ink` | `#111110` | Primary text |
| `--ink-2` | `#545450` | Secondary text |
| `--ink-3` | `#9a9a94` | Tertiary / labels |
| `--rule` | `#dddad0` | Dividers |
| `--teal` | `#0c7a66` | Accent |
| `--near-black` | `#0e0e0d` | Prototype frame bg |

**Fonts:** DM Serif Display (italic) + DM Sans (300/400/500) — Google Fonts

---

## Animation Architecture (user-specified, locked)

### Sequence after hero → brief → process:

1. **Sphere drop** — CSS 3D sphere bounces onto page with GSAP `bounce.out`, squish + `elastic.out` secondary, then idle float loop
2. **Sphere → CTA morph** — sphere fades/scales out, text CTA fades in: *"Feel the interface before reading about it"* / *"Explore the UI →"*
3. **CTA/click → Frame expand** — full-bleed (not full-screen) rectangular frame expands. Near-black bg, blank viewport (Figma embed placeholder), footer: V1/V2 outlined button switcher (V1 active), close ✕ top-right
4. **Scroll → Thumbnail** — scrolling outside frame shrinks it to 480×320px inline (matching Media module V1 image size)
5. **Chapters reveal** — 12 chapters stagger-in; hovering shows cursor-tracking image preview (lerp 0.12)
6. **Horizontal marquee** — two rows, opposite scroll directions: *"I was fighting touch interfaces in 2019 —"* / *"Euro NCAP made them a safety requirement in 2024."*
7. **Pinned panels with overscroll** — for workshop day images and module deep-dives
8. **ScrollTo navigation** — clicking chapters scrolls to their sections

---

## Key Commits

| Commit | Fix |
|--------|-----|
| `ad8faa7` | Hero H1 invisible fix — moved `heroTl` inside `window.addEventListener('load')` |
| `4041eea` | Images not loading — simplified `vercel.json` to `{"version": 2}` |

---

## Known Fixes Applied

### Hero H1 invisible on live site
- **Root cause:** `heroTl` fired before Google Fonts loaded. `y:'100%'` calculated against wrong height. H1 stuck outside `overflow:hidden` wrapper.
- **Fix:** Wrap heroTl in `window.addEventListener('load', ...)`. Critical pattern: any `y:'100%'` animation on text must fire after fonts load.

### Images not loading on Vercel
- **Root cause:** `vercel.json` had `builds: [{ "src": "index.html", "use": "@vercel/static" }]` — only served `index.html`, excluded `/images/`
- **Fix:** `vercel.json` simplified to `{ "version": 2 }` — serves entire directory

---

## Pending Tasks

- [ ] Get prototype URLs (V1 and V2) from Surya — to embed inside the frame
- [ ] Integrate approved sphere sequence into main `index.html`
- [ ] Horizontal marquee text section (GSAP horizontal-text demo style)
- [ ] Pinned panels with overscroll (for workshop day images)
- [ ] ScrollTo navigation for chapters
- [ ] Verify images load on Vercel after `4041eea`

---

## Reference Repos & Links

| Name | URL | Used For |
|------|-----|----------|
| GSAP Demos Hub | https://gsap.com/demos/ | All GSAP animation references |
| GSAP Cursor Tracking Image Preview | https://demos.gsap.com/demo/cursor-tracking-image-preview/ | Chapter hover image preview |
| GSAP Horizontal Text (Marquee) | https://demos.gsap.com/demo/horizontal-text/ | "I was fighting touch interfaces in 2019" marquee section |
| GSAP Pinned Panels with Overscroll | https://demos.gsap.com/demo/pinned-panels-with-overscroll/ | Workshop day images, module deep-dives |
| GSAP ScrollTrigger Docs | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Scroll-based triggers throughout |
| GSAP ScrollTo Docs | https://gsap.com/docs/v3/Plugins/ScrollToPlugin/ | Chapter navigation scroll |
| CSS Animation Rocks — 3D Sphere | https://cssanimation.rocks/spheres/ | CSS 3D sphere technique reference (dual radial-gradient) |
| CSS Gradient Sphere technique | Radial gradient: `circle at 38% 115%` body + `::before` specular at `circle at 50% 0%` + `filter: blur(3px)` | Sphere implementation |
| cdnjs GSAP 3.12.5 | https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js | GSAP CDN (no npm needed) |
| DM Serif Display + DM Sans | https://fonts.google.com/specimen/DM+Serif+Display | Portfolio typeface |
| Vercel Static Deployment | https://vercel.com/docs/frameworks/more-frameworks | Vercel `version: 2` serves full directory |

---

## File Structure

```
/home/claude/portfolio/
├── index.html          ← main deployed file
├── vercel.json         ← { "version": 2 }
├── session.md          ← this file (handoff / history log)
└── images/
    ├── c443c4c22d3888ef777c32efb66c17cb.png   (Climate module)
    ├── 6e27e0fc9d01e3ef2cbec18eab2b8b02.png   (Media module — semicircle disc stack)
    ├── e6c6f4f7d31f7ae1dce7f9c49d5f9f71.png   (Prototype hardware)
    ├── b8f283366d056c2bbe3b15b5a169202f.png   (Workshop days)
    └── [2 more .png files]
```

---

## Scratchpad Files (not deployed)

| File | Purpose |
|------|---------|
| `/tmp/.../scratchpad/sphere-demo.html` | Standalone demo of sphere → frame → chapters sequence. Approved by Surya → integrate into index.html |

---

## Session Notes

- **2026-10-03:** Built standalone sphere animation demo. User requested `session.md` to track all repo links and serve as handoff doc.
- Sphere uses real CSS 3D technique (dual radial-gradient — body gradient `circle at 38% 115%`, specular `::before` `circle at 50% 0%` with `filter: blur(3px)`, rim light `::after`)
- GSAP bounce sequence: `bounce.out` drop → squish (scaleY 0.88 / scaleX 1.06) → `elastic.out(1, 0.5)` recovery → idle `sine.inOut` float repeat
- Chapter cursor-tracking: `gsap.ticker.add()` with lerp factor 0.12 for smooth follow
