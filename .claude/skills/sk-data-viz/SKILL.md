---
name: sk-data-viz
description: >
  SK Design System data visualization skill. Use when building any statistical
  chart, graph, survey result, quantitative comparison, or research visualization
  for the SK portfolio — including extracting charts from presentations, modifying
  existing chart styling, or adding charts to case studies.
triggers:
  - create a graph
  - statistical chart
  - survey results
  - bar chart
  - quantitative comparison
  - research visualization
  - chart reconstruction
  - extract chart from presentation
  - data viz
  - visualize numerical data
  - kpmg data
  - research data
  - ranked chart
  - percentage chart
  - modify graph styling
  - add a chart to a case study
  - update an existing sk chart
  - build a quantitative visualization
  - rebuild a statistical chart
---

# SK Data Visualization Skill

You are building or modifying a data visualization for the SK Design System.
Follow all rules below exactly. Do not deviate.

---

## Mandatory: read first

Before writing any chart code, read:

```
sk-data-viz/docs/sk-data-viz-001.md
```

This is the canonical SK-DATA-VIZ-001 rule. It defines the architecture,
visual rules, data contract, and responsive behaviour for all SK charts.

---

## Approved architecture

**Observable Plot is the default statistical rendering engine for all new charts.**

Observable Plot controls:
- Statistical scales
- Quantitative marks (bars, lines, dots, areas)
- Axes and grid lines
- Data-driven positioning
- Data transformations

SK Design System controls:
- Typography (`--font-sans`, `--font-serif`, `--text-*`)
- Colours (`--ink`, `--ink-2`, `--ink-3`, `--rule`, `--surface`, `--sun`)
- Spacing (`--sp-*`)
- Chart-container widths and alignment
- Responsive behaviour
- Label management and expand/collapse interactions
- Captions and source attribution
- Accessibility

An SK presentation wrapper manages HTML-based labels, expand/collapse
interactions, and responsive layouts where Observable Plot cannot.

**Do not build new custom statistical renderers without explicit approval.**

The existing `sk-bar-chart.js` is an approved visual reference only.
Do not migrate, rebuild, or alter it.

---

## Four-stage workflow

Every chart task must follow this sequence.

### Stage 1 — Extract and validate

- Inspect the original source material.
- Recover numerical values, labels, units, and categories exactly.
- Preserve source attribution (name, page, methodology note, n=).
- Identify missing or ambiguous values — disclose them.
- **Never fabricate data.**
- Store source data in `sk-data-viz/data/<id>.json` — one file per chart.

### Stage 2 — Select the visualization

- Choose chart type based on analytical purpose:
  - Ranked list / survey results → horizontal bar chart (SK-DATA-VIZ-001)
  - Time series / trend → line chart
  - Correlation → scatterplot
  - Distribution → histogram or box plot
- Use Observable Plot for quantitative rendering.
- Reuse an existing approved SK chart component if one exists.
- If no approved component exists for the required type, **propose an extension
  and await approval** — do not create an unrelated one-off design.

### Stage 3 — Apply SK visual rules

Required for every chart:

- Consistent chart-container widths.
- Shared alignment rules.
- Disciplined spacing from `--sp-*`.
- SK typography and colour tokens throughout.
- Legible data labels.
- Accurate axis scales.
- Controlled use of `--sun` accent.
- Responsive behaviour at all three breakpoints.
- Accessible interactions.

For horizontal ranked charts specifically, retain these approved rules:

- Left-aligned category labels — never right-aligned.
- Shared label-column width (`--chart-label-w: 220px` desktop).
- Shared bar starting position.
- Consistent value alignment (right column).
- Maximum two lines by default — `-webkit-line-clamp: 2`.
- Ellipsis only for actual overflow (`scrollHeight > clientHeight + 1`).
- Click-to-expand truncated labels; keyboard accessible (Enter/Space).
- `aria-expanded` maintained on expandable labels.
- Responsive mobile layout (stacked at ≤ 480px).

Do not apply horizontal-bar geometry to unrelated chart types.

### Stage 4 — Validate and integrate

- Verify values against source material.
- Check scale accuracy.
- Test actual browser rendering — do not claim testing occurred if not performed.
- Test desktop and mobile layouts.
- Verify interactions and accessibility.
- Confirm source attribution is present and correct.
- For genuinely new component patterns: **obtain approval before committing**.
- Integrate approved patterns into `sk-data-viz/docs/`.

---

## Data contract (Decap CMS — not yet implemented)

All charts are driven by JSON in `sk-data-viz/data/*.json`.
Follow the exact schema in `sk-data-viz/docs/sk-data-viz-001.md §6`.

Fields the user can edit without AI:
- `_meta.subtitle`, `_meta.source`, `_meta.note`, `_meta.unit_label`
- All `rows[*].label`, `rows[*].value`, `rows[*].yoy`

**Do not place raw data editors or implementation controls inside
public-facing case studies.**

CMS integration is deferred. Do not implement it until explicitly instructed.

---

## Files reference

```
sk-data-viz/sk-bar-chart.css        — approved bar-chart styles (reference only)
sk-data-viz/sk-bar-chart.js         — approved bar-chart renderer (reference only)
sk-data-viz/data/*.json             — source datasets (one file per chart)
sk-data-viz/docs/sk-data-viz-001.md — canonical DS documentation for §25
.claude/skills/sk-data-viz/SKILL.md — this file
```

---

## Responsive requirements

All charts must work at three viewport sizes:

| Breakpoint | Behaviour |
|------------|-----------|
| > 720px    | Full layout — `--chart-label-w: 220px` |
| 481–720px  | Label column `clamp(140px, 35vw, 200px)` |
| ≤ 480px    | Stacked: label + value top / bar full-width bottom |

---

## Accessibility requirements

- `role="list"` on chart container (HTML renderers) or `role="img"` + `aria-label` on SVG (Observable Plot)
- `role="listitem"` + `aria-label` on every row (HTML renderers)
- `aria-hidden="true"` on decorative elements (axis, rank badges)
- Truncated labels: `role="button"`, `tabindex="0"`, `aria-expanded`
- `prefers-reduced-motion`: disable bar animation

---

## Hard limits — never do these

- Never right-align category labels
- Never silently substitute a custom renderer when Observable Plot is required — disclose and seek approval
- Never resize bento cells to fit charts — chart fills its container
- Never put editing tools, raw JSON, or edit panels on public-facing pages
- Never generate charts with invented or estimated data without disclosure
- Never override SK tokens with hardcoded values in component CSS
- Never name suppliers or confidential clients in chart labels
- Do not commit, push, or deploy during Gate work

---

## Scope

This skill applies across Centronic, Haptix, and future SK portfolio projects.
