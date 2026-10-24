---
name: sk-case-media
description: >
  SK Case Study Media System. Use when working with any case study images,
  screenshots, wireframes, bento layouts, design evolution sequences,
  workshop scans, research artefacts, image galleries, before/after comparisons,
  annotated media, or fullscreen media viewers in the SK portfolio.
  Instructs Claude to inspect content before choosing a layout and select
  the approved SK media pattern — never guess or default to bento.
triggers:
  - case study images
  - multiple screenshots
  - wireframes in case study
  - design evolution
  - workshop scans
  - research artefacts
  - image gallery
  - bento layout
  - before after comparison
  - annotated images
  - fullscreen media
  - large collection of visual evidence
  - evidence gallery
  - add images to case study
  - case study media
  - media pattern
  - fullscreen viewer
  - lightbox
  - image carousel
  - case study visuals
  - layout for images
  - how should I present these images
---

# SK Case Study Media Skill

## Purpose

Ensures all case study media is presented using approved SK patterns with
correct proportions, interactions, and accessibility. Prevents generic layouts,
uncropped wireframes in bento grids, and inconsistent fullscreen behavior.

---

## Mandatory Workflow

### Step 1 — Read the spec

Read `.claude/skills/sk-case-media/SK-CASE-MEDIA-001.md` for:
- All six approved patterns (Full-Width Figure, Adaptive Bento, Two-Up
  Comparison, Evolution/Sequence, Annotated Media, Evidence Gallery)
- The four-stage media-selection workflow
- Natural image proportion rules
- Intelligent background extension implementation
- Shared fullscreen viewer controls

If working with an Evidence Gallery, also read:
`.claude/skills/sk-case-media/SK-CASE-GALLERY-001.md`

### Step 2 — Inspect before choosing

Before writing any HTML, evaluate:
- Image count and aspect ratios
- Content type (photo / wireframe / diagram / scan / screenshot)
- Legibility at target display size
- Whether a sequence or temporal order exists
- Whether any image would lose meaning if cropped
- Relative importance of each asset
- Whether assets form one logical collection

### Step 3 — Select pattern

Apply the priority heuristic from SK-CASE-MEDIA-001:

1. Single critical image → **Full-Width Figure**
2. Temporal / process sequence → **Evolution / Sequence**
3. Direct A/B comparison → **Two-Up Comparison**
4. Technical detail requiring callouts → **Annotated Media**
5. Multiple comparable images where cropping is safe → **Adaptive Bento**
6. Large secondary collection of supporting artefacts → **Evidence Gallery**

**Do NOT default to Bento for every image group.**  
**Do NOT hide primary findings in an Evidence Gallery.**

### Step 4 — Apply SK tokens

- Typography: `--font-serif`, `--font-sans`, `--text-*` scale
- Spacing: `--sp-*`, `--col-pad` (48px desktop), `--col-pad-m` (24px mobile)
- Colour: `--ink`, `--ink-2`, `--ink-3`, `--surface`, `--bg`, `--sun` (accent)
- Radii: `--r-sm` (6px), `--r-md` (12px), `--r-lg` (20px)
- Motion: `--ease-out`, `--ease-out-quart`, `--t-fast` (150ms), `--t-mid` (250ms)
- Natural image proportions: `object-fit: contain` for evidentiary content
- Intelligent blurred background extension when appropriate

### Step 5 — Validate

Test all breakpoints: 1080px+, 768px, ≤640px.  
Verify: legibility, cropping, keyboard navigation, captions, accessibility.

---

## Key Rules

- **Never crop wireframes, IA diagrams, research maps, workshop scans,
  or annotated screenshots** — use `object-fit: contain`
- **Bento uses `object-fit: cover`** — only appropriate when cropping is safe
- **GSAP + Flip**: inline both libraries in separate `<script>` blocks before
  gallery JS — never nest a `<script>` tag inside another script block
- **Evidence Gallery**: wire images from the shared `I[]` object at runtime —
  never duplicate base64 data
- **No dark mode** — background is always `var(--bg)` = `#f5f4f0`
- **No close icon / "Exit the demo" text / status bar**
- **New patterns require approval** — implement approved patterns only; flag
  any gap for design review

---

## Do Not Modify

- Centronic production case study
- Haptix production case study
- Chapter structure
- Decap CMS integration
- The approved Media Playground (Gate 2A-4C deliverable)

---

## Reference

| Document | Location |
|----------|----------|
| Pattern definitions | `.claude/skills/sk-case-media/SK-CASE-MEDIA-001.md` |
| Evidence Gallery spec | `.claude/skills/sk-case-media/SK-CASE-GALLERY-001.md` |
| Bento Grid System | CLAUDE.md → Bento Grid System (SK Design System §22) |
| Canonical Design System | https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt §26 |
