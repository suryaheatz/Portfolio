# Render Diagnostic Report — Section 02
**Date:** 2026-10-27  
**Branch:** `recovery/r0-centronic`  
**Commit tested:** `6d7f546` (implementation), diagnostic file from `6211b18`  
**Server:** `python3 -m http.server 8765 --bind 127.0.0.1` from `/home/claude/portfolio`  
**Method:** Playwright Chromium, HTTP server, zero page modifications

---

## Why the previous screenshots were broken

The prior QA run (`6d7f546`) navigated to `file:///home/claude/portfolio/index.html`. The page stylesheet references are root-absolute paths (`/public/ds-tokens.css`, `/public/cs-nav.css`, `/public/images/...`). Root-absolute paths resolve against the server root when served over HTTP, but resolve against the filesystem root (`/`) when loaded via `file://` — meaning they all 404'd silently, producing unstyled HTML with broken images.

This diagnostic reruns from `http://127.0.0.1:8765/index.html` (correct) and resolves the discrepancy.

---

## Asset HTTP checks (browser-side fetch from page context)

| Asset | Status | Content-Type |
|---|---|---|
| `/public/ds-tokens.css` | **200** | `text/css` |
| `/public/cs-nav.css` | **200** | `text/css` |
| `/public/images/centronic-research-matrix.jpg` | **200** | `image/jpeg` |
| `/public/images/centronic-ia.jpg` | **200** | `image/jpeg` |

All four critical assets load correctly when served from the repository root over HTTP.

---

## Computed style diagnostics (desktop 1440px)

| Property | Value |
|---|---|
| `body fontFamily` | `Manrope, system-ui, sans-serif` |
| `body backgroundColor` | `rgb(245, 244, 240)` = `#f5f4f0` = `var(--bg)` ✓ |
| `#cs-research display` | `block` ✓ |
| Figure 01 `img.complete` | `true` |
| Figure 01 `img.naturalWidth` | **2211px** (image fully decoded) |
| Figure 02 `img.complete` | `true` |
| Figure 02 `img.naturalWidth` | **960px** (image fully decoded) |

CSS design system tokens are applied. Background is correct `#f5f4f0`. Both research images load and decode fully.

---

## Mobile diagnostics (390px)

| Property | Value |
|---|---|
| `body backgroundColor` | `rgb(245, 244, 240)` = `#f5f4f0` ✓ |
| `body fontFamily` | `Manrope, system-ui, sans-serif` ✓ |
| Figure 01 naturalWidth | 2211px ✓ |
| Figure 02 naturalWidth | 960px ✓ |
| Horizontal overflow | **false** ✓ |

---

## Failed external resources (expected — sandbox proxy blocks CDN)

The following external CDN requests failed with `net::ERR_TUNNEL_CONNECTION_FAILED`. This is an environment constraint (outbound allowlist), not a code defect:

- `fonts.googleapis.com` — Google Fonts (Bricolage Grotesque, Manrope, Zodiak)
- `cdn.jsdelivr.net` — GSAP 3.15.0 (gsap, ScrollTrigger, SplitText)
- `cdn.jsdelivr.net` — Anime.js 4.3.6
- `unpkg.com` — React 18.3.1 / ReactDOM 18.3.1

Effect on screenshots: fonts fall back to `system-ui, sans-serif`; GSAP scroll animations do not run; Anime.js entrance animations do not run. Layout, colour, images, and lightbox are unaffected. Production appearance will show Bricolage Grotesque and Manrope.

The SVG template-literal errors in console (`{{ b.icon }}`, `{{ pp }}`, etc.) are pre-existing issues in the HMI prototype section — not Section 02 defects.

---

## Lightbox test (desktop, no nav suppression)

- Figure 01 click → lightbox opened: **pass**
- Esc key → lightbox closed: **pass**
- No drawer suppression required at desktop width

---

## Screenshots captured

| File | Viewport | Notes |
|---|---|---|
| `desktop-1440-genuine.png` | 1440×900 @2× | Section 02, scrolled to view, no modifications |
| `desktop-1440-fullpage.png` | 1440px @2× | Full-page scroll, no modifications |
| `desktop-lightbox-genuine.png` | 1440×900 @2× | Lightbox open — Figure 01, no nav suppression |
| `mobile-390-genuine.png` | 390×844 @2× | Section 02 at 390px, no modifications |
| `mobile-375-genuine.png` | 375×812 @2× | Section 02 at 375px, no modifications |

---

## Diagnostic verdict

The prior screenshot failure was caused by `file://` URL resolution, not by missing assets or broken CSS. When served correctly over HTTP from the repository root:

- ✓ All local assets (CSS tokens, stylesheets, both images) load with HTTP 200
- ✓ Design system tokens applied (`body` background = `#f5f4f0`)
- ✓ Both research images fully decoded (`naturalWidth` > 0)
- ✓ No horizontal overflow at any viewport
- ✓ Lightbox opens and closes correctly without nav suppression (desktop)
- ⚠ External fonts and animation libraries blocked by sandbox proxy (environment only — code is correct)
- ⚠ Production visual verification (with real fonts, GSAP, Anime.js) requires a real browser outside this sandbox

---

**STOP — awaiting independent visual review of genuine screenshots.**  
No deployment, CMS, Section 03, or merge to main.
