/**
 * SK-DATA-VIZ-001 — Horizontal Bar Chart Renderer
 * Part of the SK Design System
 *
 * USAGE
 * ─────
 * 1. Include sk-bar-chart.css (and /public/ds-tokens.css before it)
 * 2. Prepare a container: <div class="sk-bar-chart-root" id="my-chart"></div>
 * 3. Call:
 *
 *    SKBarChart.render({
 *      container: document.getElementById('my-chart'),
 *      data:      chartData,        // parsed JSON from data/*.json
 *      options:   { animate: true } // optional overrides
 *    });
 *
 * DATA CONTRACT (matches Decap CMS schema — see docs/sk-data-viz-001.md)
 * ───────────────────────────────────────────────────────────────────────
 * {
 *   "_meta": {
 *     "title":       string,   // chart heading (not rendered by component — host decides)
 *     "subtitle":    string,   // eyebrow label rendered inside the card
 *     "source":      string,   // full source name for caption
 *     "source_page": number,   // optional — appended to caption if present
 *     "note":        string,   // optional — appended to caption (n=, countries, etc.)
 *     "unit":        string,   // "%" — appended to every value in the axis
 *     "unit_label":  string,   // axis eyebrow label (short)
 *     "max_value":   number,   // scale max — bars are (value / max_value) * 100%
 *     "yoy_label":   string    // tooltip for yoy column header
 *   },
 *   "rows": [
 *     { "rank": number, "label": string, "value": number, "yoy": number }
 *   ]
 * }
 *
 * OPTIONS
 * ───────
 * animate         boolean  (default: true)  — enable bar entrance animation
 * highlightTop    boolean  (default: true)  — apply --sun accent to rank 1
 * showAxis        boolean  (default: true)  — render axis tick row
 * axisTicks       number[] (default: [0,10,20,30,40,50,60]) — tick positions
 * showYoy         boolean  (default: true)  — show YoY delta column
 * showRankBadge   boolean  (default: true)  — show numbered badge before label
 *
 * PUBLIC API
 * ──────────
 * SKBarChart.render(config)   — renders into container, returns instance
 * instance.destroy()          — removes all DOM, cleans up listeners
 * instance.update(newData)    — re-renders with new dataset
 *
 * EDITING TOOLS
 * ─────────────
 * Not included in this file. Raw JSON editor, edit panel, and
 * JSON display are in sk-bar-chart-editor.js — loaded only in
 * internal/dev contexts, never in public-facing pages.
 */

const SKBarChart = (() => {

  /* ── Defaults ────────────────────────────────────────── */
  const DEFAULTS = {
    animate:        true,
    highlightTop:   true,
    showAxis:       true,
    axisTicks:      [0, 10, 20, 30, 40, 50, 60],
    showYoy:        true,
    showRankBadge:  true,
  };

  /* ── Overflow detection
     Runs after paint. Measures each .sk-bar-label-text.
     Only labels whose scrollHeight > clientHeight get the
     is-expandable class and keyboard affordance.
     Never uses character count — always uses real layout.
  ────────────────────────────────────────────────────────*/
  function markExpandable(root) {
    root.querySelectorAll('.sk-bar-label-text').forEach(el => {
      if (el.scrollHeight > el.clientHeight + 1) {
        el.classList.add('is-expandable');
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-expanded', 'false');

        function toggle(e) {
          if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
          if (e.type === 'keydown') e.preventDefault();
          const expanded = el.classList.toggle('is-expanded');
          el.setAttribute('aria-expanded', String(expanded));
        }

        el.addEventListener('click', toggle);
        el.addEventListener('keydown', toggle);

        // Store refs for cleanup
        el._skToggle = toggle;
      }
    });
  }

  /* ── Build axis tick labels ──────────────────────────── */
  function buildAxisTicks(ticks, unit) {
    return ticks.map(t => `<span>${t}${unit}</span>`).join('');
  }

  /* ── Build caption ───────────────────────────────────── */
  function buildCaption(meta) {
    let parts = [`<strong>Source:</strong> ${meta.source}`];
    if (meta.source_page) parts.push(`p. ${meta.source_page}`);
    if (meta.note) parts.push(meta.note);
    if (meta.yoy_label) parts.push(`YoY = ${meta.yoy_label}.`);
    return parts.join(' · ');
  }

  /* ── Main render ─────────────────────────────────────── */
  function render({ container, data, options = {} }) {
    if (!container || !data) throw new Error('SKBarChart.render: container and data are required');

    const opts = { ...DEFAULTS, ...options };
    const { _meta: meta, rows } = data;

    // Clear previous content
    container.innerHTML = '';

    // Eyebrow
    if (meta.subtitle) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'sk-bar-chart-eyebrow';
      eyebrow.textContent = meta.subtitle;
      container.appendChild(eyebrow);
    }

    // Chart grid
    const chart = document.createElement('div');
    chart.className = 'sk-bar-chart';
    chart.setAttribute('role', 'list');
    chart.setAttribute('aria-label', meta.title || 'Bar chart');

    rows.forEach(row => {
      const isTop    = opts.highlightTop && row.rank === 1;
      const fillPct  = (row.value / meta.max_value) * 100;
      const yoyStr   = row.yoy > 0 ? `↑${row.yoy}` : row.yoy < 0 ? `↓${Math.abs(row.yoy)}` : '—';
      const yoyCls   = row.yoy > 0 ? 'pos' : row.yoy < 0 ? 'neg' : '';

      const rowEl = document.createElement('div');
      rowEl.className = 'sk-bar-row';
      rowEl.setAttribute('role', 'listitem');
      rowEl.setAttribute('aria-label',
        `Rank ${row.rank}: ${row.label}, ${row.value}${meta.unit} extremely important`);

      /* Column A — label */
      const labelCell = document.createElement('div');
      labelCell.className = 'sk-bar-label';

      if (opts.showRankBadge) {
        const badge = document.createElement('span');
        badge.className = 'sk-rank-badge' + (isTop ? ' is-top' : '');
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = row.rank;
        labelCell.appendChild(badge);
      }

      const labelText = document.createElement('span');
      labelText.className = 'sk-bar-label-text';
      labelText.textContent = row.label;
      labelCell.appendChild(labelText);

      /* Column B — bar */
      const track = document.createElement('div');
      track.className = 'sk-bar-track';
      track.setAttribute('aria-hidden', 'true');

      const fill = document.createElement('div');
      fill.className = 'sk-bar-fill' + (isTop ? ' is-top' : '');
      fill.style.width = opts.animate ? '0%' : `${fillPct}%`;
      fill._target = fillPct;
      track.appendChild(fill);

      /* Column C — value + yoy */
      const valueCell = document.createElement('div');
      valueCell.className = 'sk-bar-value-cell';
      valueCell.setAttribute('aria-hidden', 'true');

      const valueEl = document.createElement('span');
      valueEl.className = 'sk-bar-value';
      valueEl.textContent = `${row.value}${meta.unit}`;
      valueCell.appendChild(valueEl);

      if (opts.showYoy) {
        const yoyEl = document.createElement('span');
        yoyEl.className = `sk-bar-yoy ${yoyCls}`;
        yoyEl.textContent = yoyStr;
        valueCell.appendChild(yoyEl);
      }

      rowEl.appendChild(labelCell);
      rowEl.appendChild(track);
      rowEl.appendChild(valueCell);
      chart.appendChild(rowEl);
    });

    container.appendChild(chart);

    // Axis
    if (opts.showAxis) {
      const axis = document.createElement('div');
      axis.className = 'sk-bar-axis';
      axis.setAttribute('aria-hidden', 'true');
      axis.innerHTML = `
        <div></div>
        <div class="sk-bar-axis-ticks">${buildAxisTicks(opts.axisTicks, meta.unit)}</div>
        <div></div>
      `;
      container.appendChild(axis);
    }

    // Caption
    if (meta.source) {
      const caption = document.createElement('p');
      caption.className = 'sk-bar-chart-caption';
      caption.innerHTML = buildCaption(meta);
      container.appendChild(caption);
    }

    // Animate fills + detect overflow after paint
    if (opts.animate) {
      requestAnimationFrame(() => {
        chart.querySelectorAll('.sk-bar-fill').forEach(el => {
          el.style.width = el._target + '%';
        });
        requestAnimationFrame(() => markExpandable(chart));
      });
    } else {
      requestAnimationFrame(() => markExpandable(chart));
    }

    // Return instance
    const instance = {
      container,
      destroy() {
        // Remove expandable listeners
        container.querySelectorAll('.sk-bar-label-text').forEach(el => {
          if (el._skToggle) {
            el.removeEventListener('click', el._skToggle);
            el.removeEventListener('keydown', el._skToggle);
          }
        });
        container.innerHTML = '';
      },
      update(newData) {
        instance.destroy();
        render({ container, data: newData, options });
      }
    };

    return instance;
  }

  return { render };
})();

// Support both module and script tag environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SKBarChart;
}
