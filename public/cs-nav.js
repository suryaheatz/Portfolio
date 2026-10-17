/* SK-CASE-NAV-001 · Universal Case Study Navigation  (cs-nav.js)
 * ─────────────────────────────────────────────────────────────────
 * Reads the SK_PROJECTS registry (sk-projects.js must load first) and
 * renders previous/next navigation into any element with:
 *   id="cs-nav-root"   data-project="<slug>"
 *
 * First project : Next only  (no Previous, no All Projects)
 * Last project  : Previous only  (no Next, no invented All Projects URL)
 * Middle        : Both
 *
 * No animation dependencies. Hover treated entirely in CSS.
 * Keyboard accessible. Respects prefers-reduced-motion via CSS.
 * ─────────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* Arrow SVG used in the Next card */
  var ARROW_SVG =
    '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">' +
      '<path d="M2 7h10M7.5 2.5L12 7l-4.5 4.5"/>' +
    '</svg>';

  function escAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function buildPrev(project) {
    return (
      '<a class="cs-nav__prev" href="' + escAttr(project.url) + '" ' +
          'aria-label="Previous case study — ' + escAttr(project.title) + '">' +
        '<span class="cs-nav__prev-label">Previous Project</span>' +
        '<span class="cs-nav__prev-title">' + escAttr(project.title) + '</span>' +
      '</a>'
    );
  }

  function buildNext(project) {
    return (
      '<a class="cs-nav__next" href="' + escAttr(project.url) + '" ' +
          'aria-label="Next case study — ' + escAttr(project.title) + '">' +
        '<div class="cs-nav__next-card">' +
          '<img class="cs-nav__next-img" src="' + escAttr(project.cover) + '" ' +
               'alt="" role="presentation" loading="lazy">' +
          '<div class="cs-nav__next-overlay" aria-hidden="true"></div>' +
          '<div class="cs-nav__next-text">' +
            '<span class="cs-nav__next-eyebrow">Next Case Study</span>' +
            '<span class="cs-nav__next-title">' + escAttr(project.title) + '</span>' +
          '</div>' +
          '<div class="cs-nav__next-arrow" aria-hidden="true">' + ARROW_SVG + '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function init() {
    var root = document.getElementById('cs-nav-root');
    if (!root) return;

    var registry = window.SK_PROJECTS;
    if (!Array.isArray(registry) || registry.length === 0) return;

    var slug = root.getAttribute('data-project');
    var idx  = -1;
    for (var i = 0; i < registry.length; i++) {
      if (registry[i].slug === slug) { idx = i; break; }
    }
    if (idx === -1) return;

    var prev = idx > 0                    ? registry[idx - 1] : null;
    var next = idx < registry.length - 1  ? registry[idx + 1] : null;

    /* Nothing to render if this is the only project */
    if (!prev && !next) return;

    var html = '';

    if (prev) {
      html += buildPrev(prev);
    } else {
      /* Invisible spacer so Next stays right-aligned on first project */
      html += '<span class="cs-nav__prev-spacer" aria-hidden="true"></span>';
    }

    if (next) {
      html += buildNext(next);
    }
    /* No else-branch for last project: spec says no invented All Projects URL */

    root.className = 'cs-nav';
    root.innerHTML = html;
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
