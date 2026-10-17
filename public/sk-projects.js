/* SK Portfolio — Project Registry  (SK-CASE-NAV-001)
 * ─────────────────────────────────────────────────────
 * Single source of truth for project order, titles, URLs and cover images.
 * The shared cs-nav component derives prev/next from this array.
 *
 * RULES:
 *   - Never hardcode prev/next URLs inside individual case-study pages.
 *   - Order is determined by array index (0 = first, last index = last).
 *   - Entries use absolute paths from the site root so URLs work on any
 *     deployed case-study URL regardless of directory depth.
 *
 * TO ADD A PROJECT:
 *   Push a new object to SK_PROJECTS in the correct position.
 *   The nav will update automatically on every page that links these scripts.
 */
window.SK_PROJECTS = [
  {
    slug:     'zf-centronic',
    title:    'ZF Centronic',
    subtitle: 'Automotive HMI · R&D · 2018–2019',
    url:      '/',
    cover:    '/public/images/centronic-sketch.png',
    template: 1
  },
  {
    slug:     'haptix',
    title:    'Haptix Thumbwheel',
    subtitle: 'Interaction Design · HMI · 2020',
    url:      '/case-studies/haptix/',
    cover:    '/case-studies/haptix/assets/styling/demonstrator-render.jpg',
    template: 1
  }
];
