# SK-DATA-VIZ-001 — Statistical Visualization System

**SK Design System · §25**
**Status:** Mandatory for all new statistical visualizations (Gate 2A-3C, finalized)
**Rule name:** Statistical Visualization System
**Applies to:** Bar charts · Line charts · Scatterplots · Distribution charts · Survey results · Numerical comparisons · Research data · Statistical visuals reconstructed from presentations · Future chart types

---

## 1. Architecture

Observable Plot is the default statistical rendering engine for all new SK
portfolio charts.

**Observable Plot controls:**
- Statistical scales
- Quantitative marks (bars, lines, dots, areas)
- Axes and grid lines
- Data-driven positioning
- Relevant data transformations

**SK Design System controls:**
- Typography (`--font-sans`, `--font-serif`, `--text-*`)
- Colours (`--ink`, `--ink-2`, `--ink-3`, `--rule`, `--surface`, `--sun`)
- Spacing (`--sp-*`)
- Chart-container widths and alignment
- Responsive behaviour
- Label management and expand/collapse interactions
- Captions and source attribution
- Accessibility

An SK presentation wrapper manages HTML-based labels, expand/collapse
interactions, and responsive layouts where Observable Plot does not.

**Do not build new custom statistical renderers without explicit approval.**

### Approved exception

`sk-bar-chart.js` (vanilla JS/CSS, Gate 2A-3C) is an approved visual reference.
It may remain untouched. Do not migrate, rebuild, or alter it.
Future horizontal bar chart implementations should use Observable Plot
with the SK wrapper pattern defined in §2.

---

## 2. Horizontal ranked bar chart rules

These rules apply to all ranked-list / survey-result charts regardless of renderer.

### Layout

```
grid-template-columns: [label-w] [1fr] [value-w]
```

| Column | Content | Width |
|--------|---------|-------|
| A | Label (rank badge + text) | `--chart-label-w: 220px` |
| B | Bar track / Observable Plot SVG | `1fr` (remaining space) |
| C | Value + YoY delta | `--chart-value-w: 52px` |

For HTML renderers: row cells use `display: contents` — they dissolve into
the parent grid to enforce shared left/bar/right edges across all rows.

For Observable Plot renderers: the SVG fills column B exactly
(`width: 100%; height: var(--bar-h)`); Plot's own margin defaults
(`marginLeft`, `marginRight`, `marginTop`, `marginBottom`) are set to `0`.

### Label rules (non-negotiable)

- **Always left-aligned.** `text-align: left` is hardcoded. Never right-align.
- **Two-line clamp.** `-webkit-line-clamp: 2`. Row height is set by content.
- **Truncation = real overflow.** `scrollHeight > clientHeight + 1` measured
  after paint. Character count is never used.
- **Expandable.** Only genuinely truncated labels get `is-expandable`.
  Click or keyboard (Enter/Space) toggles expand. `aria-expanded` maintained.
- **Row grows on expand.** Other rows keep their height. No JS height manipulation.

---

## 3. Responsive breakpoints

All charts must work at three viewport sizes:

| Viewport | Behaviour |
|----------|-----------|
| > 720px | Full layout — `--chart-label-w: 220px` |
| 481–720px | Label column: `clamp(140px, 35vw, 200px)` |
| ≤ 480px | Stacked: label + value on top line / bar full-width below |

---

## 4. Four-stage workflow

Every chart task must follow this sequence.

**Stage 1 — Extract and validate:** Inspect source material. Recover values,
labels, units, categories. Preserve attribution. Identify and disclose missing
or ambiguous values. Never fabricate data. Store data in `sk-data-viz/data/<id>.json`.

**Stage 2 — Select the visualization:** Choose chart type by analytical purpose.
Use Observable Plot for quantitative rendering. Reuse an existing approved SK
component. If no approved component exists, propose an extension and await approval.

**Stage 3 — Apply SK visual rules:** Consistent container widths, shared alignment,
`--sp-*` spacing, SK typography and colour tokens, legible labels, accurate axes,
controlled `--sun` accent, responsive behaviour, accessible interactions.

**Stage 4 — Validate and integrate:** Verify values against source. Check scale
accuracy. Test actual browser rendering (do not claim testing if not performed).
Test desktop and mobile. Verify accessibility. Obtain approval for new patterns.
Integrate approved patterns into `sk-data-viz/docs/`.

---

## 5. Observable Plot integration

Observable Plot is loaded from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6.16/dist/plot.umd.min.js"></script>
```

> Note: the package name is `@observablehq/plot`, not `observe-plot`.
> Earlier references to `observe-plot` in this document were incorrect.

**Requirements for any chart using Observable Plot:**

1. Accurate, real data — no invented or rounded figures.
2. Source attribution in caption (name, page/URL, n=).
3. Accessible rendering — `role="img"` with `aria-label` on SVG container.
4. Manually editable data — JSON stored separately from rendering code.
5. SK token alignment — colors, type, spacing from SK tokens.
6. Plot margin defaults suppressed where SK layout takes over.
7. `prefers-reduced-motion` respected for any entrance animation.

---

## 6. Approved SKBarChart component API (visual reference)

The approved vanilla JS component remains available as a visual reference.
Its public API:

```js
SKBarChart.render({
  container: document.getElementById('my-chart'),
  data:      chartData,     // parsed JSON (see §7)
  options: {
    animate:       true,    // entrance animation
    highlightTop:  true,    // --sun accent on rank 1
    showAxis:      true,    // axis tick row
    axisTicks:     [0,10,20,30,40,50,60],
    showYoy:       true,    // YoY delta column
    showRankBadge: true     // numbered badge
  }
});
// Returns: { destroy(), update(newData) }
```

Do not modify this component. Do not use it as the template for new charts.

---

## 7. Decap CMS data contract

Charts are driven by JSON files in `sk-data-viz/data/*.json`.
CMS integration is not yet implemented.

```json
{
  "_meta": {
    "id":          "string — filename stem",
    "title":       "string — chart heading",
    "subtitle":    "string — eyebrow label inside card",
    "source":      "string — full citation name",
    "source_page": "number — optional",
    "note":        "string — optional (n=, scope)",
    "unit":        "string — %, index, etc.",
    "unit_label":  "string — axis label",
    "max_value":   "number — scale maximum",
    "yoy_label":   "string — column tooltip"
  },
  "rows": [
    {
      "rank":  "number — 1 = top",
      "label": "string — category name",
      "value": "number",
      "yoy":   "number — positive = up, negative = down, 0 = unchanged"
    }
  ]
}
```

**Fields editable without AI:**
`_meta.subtitle`, `_meta.source`, `_meta.note`, `_meta.unit_label`,
all `rows[*].label`, `rows[*].value`, `rows[*].yoy`

**Fields that affect layout (require dev review if changed):**
`_meta.max_value` (changes bar scale), `_meta.unit` (appended to every value)

Do not implement CMS integration until explicitly instructed.
Do not place raw data editors or JSON panels inside public-facing pages.

---

## 8. Files

| File | Role |
|------|------|
| `sk-data-viz/sk-bar-chart.css` | Approved bar-chart styles — visual reference |
| `sk-data-viz/sk-bar-chart.js` | Approved bar-chart renderer — visual reference |
| `sk-data-viz/data/*.json` | Source datasets — one file per chart |
| `sk-data-viz/docs/sk-data-viz-001.md` | This document — canonical DS rule |
| `.claude/skills/sk-data-viz/SKILL.md` | Agent skill — workflow enforcement |

**Not in production:**
- `sk-bar-chart-editor.js` — raw JSON editor, dev/internal only, never on public pages

---

## 9. Known limitations and deferred work

| Item | Status |
|------|--------|
| `--ok` / `--warn` tokens absent from `ds-tokens.css` | YoY colors hardcoded (`#2d7a3a`, `#b53a1a`) — add tokens in cleanup pass |
| `--text-*` type tokens absent from `ds-tokens.css` | Raw px values used — add in cleanup pass |
| Top-trend distinguished by color only | A11y gap — add ★ or pattern fallback in next pass |
| CDN package name in prior §4 was wrong (`observe-plot`) | Corrected to `@observablehq/plot` in this revision |
| Observable Plot wrapper not yet built | Required for next statistical chart — build when first chart of that type is requested |
| Decap CMS UI not implemented | Deferred — data contract defined, JSON editable manually |
| Canonical design-system artifact (`https://claude.ai/artifact/Gydy1zgdhExe8x1hxaJpLt`) | Not updated from repository — requires manual sync via artifact editor; §25 entry to be added there |

---

## 10. Approved datasets

| ID | Source | Rows | Status |
|----|--------|------|--------|
| `kpmg-2018-key-trends` | KPMG Global Automotive Executive Survey 2018, p. 14 | 11 | ✓ Approved |
| `sample-ux-methods-2024` | Non-production sample | 8 | ✓ Verified |
