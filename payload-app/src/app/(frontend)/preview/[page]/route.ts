import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const escapeHTML = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const jsonForScript = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

type Rec = Record<string, unknown>
const assetUrl = (v: unknown): string =>
  v && typeof v === 'object' && 'url' in v && typeof (v as Rec).url === 'string'
    ? String((v as Rec).url)
    : ''

export async function GET(_req: Request, context: { params: Promise<{ page: string }> }) {
  const { page } = await context.params
  if (page !== 'home' && page !== 'about') return new Response('Not found', { status: 404 })

  const filename = page === 'home' ? 'index.html' : 'about.html'
  let html = await readFile(join(process.cwd(), 'approved-source', filename), 'utf8')
  const payload = await getPayload({ config })

  const [header, footer, home, atlas] = await Promise.all([
    payload.findGlobal({ slug: 'siteHeader', depth: 1 }).catch(() => null),
    payload.findGlobal({ slug: 'siteFooter', depth: 0 }).catch(() => null),
    page === 'home' ? payload.findGlobal({ slug: 'homePage', depth: 1 }).catch(() => null) : Promise.resolve(null),
    page === 'about' ? payload.findGlobal({ slug: 'atlasContent', depth: 0 }).catch(() => null) : Promise.resolve(null),
  ])

  const current = page === 'home' ? '/preview/home' : '/preview/about'
  const toPreviewURL = (url: string) => {
    if (url === '/about' || url === 'about.html') return '/preview/about'
    if (url === '/' || url === './' || url === './index.html') return '/preview/home'
    if (url === '/#work' || url === './#work') return '/preview/home#work'
    if (url === '/#contact' || url === './#contact') return '/preview/home#contact'
    return url
  }

  if (header?.navigation?.length) {
    const brandName = escapeHTML(header.brandName || 'Surya Konijeti')
    const media = header.logo && typeof header.logo === 'object' ? header.logo : null
    const logoURL = media && 'url' in media && typeof media.url === 'string' ? media.url : ''
    const mode = header.brandMode || 'name'
    const brand = (mode === 'logo' || mode === 'both') && logoURL
      ? `<img src="${escapeHTML(logoURL)}" alt="${brandName}" style="display:block;max-height:40px;width:auto" />${mode === 'both' ? '<span>' + brandName + '</span>' : ''}`
      : brandName
    const links = header.navigation.map((item: { label: string; url: string }) => {
      const href = toPreviewURL(item.url || '#')
      const currentAttr = href === current ? ' aria-current="page"' : ''
      return `<a href="${escapeHTML(href)}"${currentAttr}>${escapeHTML(item.label)}</a>`
    }).join('')
    html = html.replace(/<header class="site-header([^"]*)">[\s\S]*?<\/header>/, (_match, cls) =>
      `<header class="site-header${cls}"><div class="wrap"><a class="brand" href="/preview/home" aria-label="Home">${brand}</a><nav class="nav" aria-label="Primary">${links}</nav></div></header>`)
  }

  html = html.replace(/href="about\.html"/g, 'href="/preview/about"')
    .replace(/href="\.\/"/g, 'href="/preview/home"')
    .replace(/href="\.\/#work"/g, 'href="/preview/home#work"')

  if (page === 'home' && home) {
    const h = home as unknown as Rec

    // 1. WebGL 3D Hand Intro Phrases + Star Greeting
    const wLines = [
      String(h.webglLineOne   || 'I decode'),
      String(h.webglLineTwo   || 'Problems'),
      String(h.webglLineThree || 'I unlock'),
      String(h.webglLineFour  || 'Value'),
    ]
    html = html.replace(
      "lines: ['I decode', 'Problems', 'I unlock', 'Value']",
      `lines: ${jsonForScript(wLines)}`
    )
    if (h.starGreeting) {
      html = html.replace(
        /idEl\.textContent = 'Hi, I[^']*';/,
        `idEl.textContent = ${jsonForScript(String(h.starGreeting))};`
      )
    }

    // 2. Hero Statement & Meta + Featured Hero Media
    const hLine1 = escapeHTML(h.heroLineOne   || 'Temporary')
    const hLine2 = escapeHTML(h.heroLineTwo   || 'hero statement,')
    const hLine3 = escapeHTML(h.heroLineThree || 'three lines.')
    const hMetaL = escapeHTML(h.heroMetaLeft  || 'Product Designer  -  Bengaluru, India')
    const hMetaR = escapeHTML(h.heroMetaRight || 'Scroll')
    html = html.replace(
      /<h1 class="hero__title" data-split="lines">[\s\S]*?<\/h1>/,
      `<h1 class="hero__title" data-split="lines">
        <span class="line"><span class="line__inner" id="cms-hero-l1">${hLine1}</span></span>
        <span class="line"><span class="line__inner" id="cms-hero-l2">${hLine2}</span></span>
        <span class="line"><span class="line__inner" id="cms-hero-l3">${hLine3}</span></span>
      </h1>`
    )
    html = html.replace(
      /<div class="hero__meta">[\s\S]*?<\/div>/,
      `<div class="hero__meta">
        <span class="text-label" id="cms-hero-ml">${hMetaL}</span>
        <span class="text-label" id="cms-hero-mr">${hMetaR}</span>
      </div>`
    )

    const heroMediaUrl = assetUrl(h.heroMedia)
    const heroMediaCap = escapeHTML(h.heroMediaCaption || 'Hero media placeholder  -  16:9')
    const heroMediaInner = heroMediaUrl
      ? `<div class="hero-media__inner" id="cms-hero-media-inner"><img src="${escapeHTML(heroMediaUrl)}" alt="${heroMediaCap}"></div>`
      : `<div class="hero-media__inner" id="cms-hero-media-inner"><span class="hero-media__ph">${heroMediaCap}</span></div>`
    html = html.replace(
      /<div class="hero-media__inner">[\s\S]*?<\/div>/,
      heroMediaInner
    )

    // 3. Selected Work Bento Grid
    const workHeading = escapeHTML(h.workHeading || 'Selected Work')
    const rawProjects = Array.isArray(h.projects) && h.projects.length > 0
      ? (h.projects as Rec[])
      : [
          { title: 'Centronic MMA',     category: 'Autonomous HMI',     role: 'Sr. UX Designer',    year: '2020', layout: 'wide',   caseStudySlug: 'centronic' },
          { title: 'Haptix Thumbwheel', category: 'Tactile Automotive', role: 'Senior UX Designer', year: '2020', layout: 'narrow', caseStudySlug: 'haptix' },
          { title: 'Project title three', category: 'Category placeholder', role: 'Role',           year: '2025', layout: 'narrow', caseStudySlug: '' },
          { title: 'Project title four',  category: 'Category placeholder', role: 'Role',           year: '2024', layout: 'wide',   caseStudySlug: '' },
          { title: 'Project title five',  category: 'Category placeholder', role: 'Role',           year: '2024', layout: 'wide',   caseStudySlug: '' },
          { title: 'Project title six',   category: 'Category placeholder', role: 'Role',           year: '2023', layout: 'narrow', caseStudySlug: '' },
        ]
    const countLabel = `(${String(rawProjects.length).padStart(2, '0')})`
    const tones = ['var(--surface)', 'var(--rule)', 'var(--sun-muted)', 'var(--surface)', 'var(--rule)', 'var(--surface)']

    const rowsHtml: string[] = []
    const workDataJson: Rec[] = []
    for (let i = 0; i < rawProjects.length; i += 2) {
      const pair = rawProjects.slice(i, i + 2)
      const firstLayout = String(pair[0]?.layout || (i % 4 === 0 ? 'wide' : 'narrow'))
      const tilesHtml = pair.map((p, pIdx) => {
        const idx = i + pIdx
        const num = String(idx + 1).padStart(2, '0')
        const lay = String(p.layout || (pIdx === 0 ? firstLayout : (firstLayout === 'wide' ? 'narrow' : 'wide')))
        const ar = lay === 'wide' ? '16 / 9' : '1 / 1'
        const arTab = lay === 'wide' ? '16 / 9' : '6 / 5'
        const tone = tones[idx % tones.length]
        const slugVal = String(p.caseStudySlug || '').trim()
        const href = slugVal ? `/preview/case-studies/${encodeURIComponent(slugVal)}` : `#project-${num}`
        const imgUrl = assetUrl(p.image)
        const mediaInner = imgUrl
          ? `<img src="${escapeHTML(imgUrl)}" alt="${escapeHTML(p.title || '')}" style="width:100%;height:100%;object-fit:cover">`
          : `<span class="work-tile__ph">Media placeholder  -  ${lay === 'wide' ? '16/9' : '1/1'}</span>`
        const titleStr = String(p.title || `Project ${num}`)
        const catStr = String(p.category || 'UX Design')
        const roleStr = String(p.role || 'Designer')
        const yearStr = String(p.year || '2026')

        workDataJson.push({
          id: num,
          title: titleStr,
          category: catStr,
          role: roleStr,
          year: yearStr,
          layout: lay,
          ar,
          ar_tablet: arTab,
          tone,
          href,
        })

        return `
          <article class="work-tile work-tile--${lay}" data-project="${num}" data-layout="${lay}" style="--ar:${ar}; --ar-tablet:${arTab}; --tone:${tone}">
            <a class="work-tile__link" href="${escapeHTML(href)}">
              <div class="work-tile__media" data-flip-id="project-${num}-media">
                <div class="work-tile__pan"><div class="work-tile__media-inner">${mediaInner}</div></div>
              </div>
              <div class="work-tile__meta">
                <span class="work-tile__num">${num}</span>
                <h3 class="work-tile__title"><span class="work-tile__title-in">${escapeHTML(titleStr)}</span></h3>
                <div class="work-tile__sub"><span class="text-label">${escapeHTML(catStr)}</span><span class="text-caption">${escapeHTML(roleStr)}${yearStr ? '  -  ' + escapeHTML(yearStr) : ''}</span></div>
              </div>
            </a>
          </article>`
      }).join('')
      rowsHtml.push(`<div class="work-row" data-first="${escapeHTML(firstLayout)}">${tilesHtml}</div>`)
    }

    html = html.replace(
      /<section class="section" id="work" data-section="work">[\s\S]*?<\/section>/,
      `<section class="section" id="work" data-section="work">
        <div class="work-wrap">
          <div class="section-head">
            <h2 id="cms-work-heading">${workHeading}</h2>
            <span class="text-label" id="cms-work-count">${escapeHTML(countLabel)}</span>
          </div>
          <div class="work-bento" id="work-bento">
            ${rowsHtml.join('\n')}
          </div>
          <script type="application/json" id="work-data">${jsonForScript(workDataJson)}</script>
        </div>
      </section>`
    )

    // 4. Awards & Patents Marquee
    if (Array.isArray(h.awards) && h.awards.length > 0) {
      const awardsJson = (h.awards as Rec[]).map((a, idx) => {
        const id = `award-${idx + 1}`
        const row = Number(a.rowNumber || 1)
        const label = String(a.label || `AWARD 0${idx + 1}`)
        const type = String(a.itemType || 'preview')
        const href = String(a.href || '/awards')
        if (type === 'cta') {
          return { id, row, label, type: 'cta', cta: String(a.ctaText || 'VIEW AWARDS & PATENTS ->'), href }
        }
        const assets = [
          { label: String(a.previewLabelOne   || '01'), src: assetUrl(a.previewImageOne)   || null },
          { label: String(a.previewLabelTwo   || '02'), src: assetUrl(a.previewImageTwo)   || null },
          { label: String(a.previewLabelThree || '03'), src: assetUrl(a.previewImageThree) || null },
        ]
        return { id, row, label, type: 'preview', href, assets }
      })
      html = html.replace(
        /<script type="application\/json" id="awards-data">[\s\S]*?<\/script>/,
        `<script type="application/json" id="awards-data">${jsonForScript(awardsJson)}</script>`
      )
    }
  }

  html = html.replace(/<script type="application\/json" id="footer-data">([\s\S]*?)<\/script>/, (match, raw) => {
    try {
      const data = JSON.parse(raw)
      if (footer?.contactHeading) data.heading = footer.contactHeading
      if (footer?.contactEmail) data.email.value = footer.contactEmail
      if (footer?.footerText) data.legal = footer.footerText
      if (footer?.socialLinks?.length) {
        data.footerLinks = footer.socialLinks.map((item: { label: string; url: string }) => ({
          label: item.label,
          href: item.url,
          external: /^https?:\/\//.test(item.url || ''),
        }))
      }
      return `<script type="application/json" id="footer-data">${jsonForScript(data)}</script>`
    } catch { return match }
  })

  if (page === 'about' && atlas?.sourceData) {
    html = html.replace(/<script type="application\/json" id="atlas-data">[\s\S]*?<\/script>/,
      `<script type="application/json" id="atlas-data">${jsonForScript(atlas.sourceData)}</script>`)
  }

  // Inject floating CMS Preview Bar + Payload Live Preview postMessage listener
  const skipDefault = Boolean(home && (home as unknown as Rec).skipIntroInPreview)
  const cmsOverlay = `
<style>
  #sk-cms-bar {
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(17, 17, 16, 0.86);
    border: 1px solid rgba(240, 239, 233, 0.18);
    color: #f0efe9;
    font: 500 11px/1 'Manrope', system-ui, sans-serif;
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.28);
  }
  #sk-cms-bar button, #sk-cms-bar a {
    border: 1px solid rgba(240, 239, 233, 0.22);
    background: rgba(240, 239, 233, 0.08);
    color: #f0efe9;
    padding: 5px 10px;
    border-radius: 999px;
    font: 500 11px/1 'Manrope', system-ui, sans-serif;
    cursor: pointer;
    text-decoration: none;
    transition: all 160ms ease;
  }
  #sk-cms-bar button:hover, #sk-cms-bar a:hover {
    background: #E8490F;
    border-color: #E8490F;
    color: #fff;
  }
</style>
<div id="sk-cms-bar">
  <span>SK Live Preview (${escapeHTML(page.toUpperCase())})</span>
  ${page === 'home' ? `<button type="button" id="sk-jump-intro" onclick="window.__skToggleIntro()">Skip WebGL Intro -> Page</button>` : ''}
  <a href="/preview/case-studies/centronic">Centronic</a>
  <a href="/preview/case-studies/haptix">Haptix</a>
  <button type="button" onclick="window.location.reload()">Refresh</button>
</div>
<script>
;(function(){
  var skipOnLoad = ${skipDefault ? 'true' : 'false'};
  window.__skJumpToPage = function(instant) {
    if (window.G41 && typeof window.G41.scrollForTp === 'function') {
      var targetY = window.G41.scrollForTp(1);
      window.scrollTo({ top: targetY, behavior: instant ? 'auto' : 'smooth' });
      var btn = document.getElementById('sk-jump-intro');
      if (btn) btn.textContent = 'Replay WebGL Hand Intro';
    }
  };
  window.__skToggleIntro = function() {
    if (!window.G41 || typeof window.G41.scrollForTp !== 'function') return;
    var targetY = window.G41.scrollForTp(1);
    var btn = document.getElementById('sk-jump-intro');
    if (window.scrollY < targetY * 0.7) {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      if (btn) btn.textContent = 'Replay WebGL Hand Intro';
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (btn) btn.textContent = 'Skip WebGL Intro -> Page';
    }
  };
  if (skipOnLoad) {
    window.addEventListener('load', function(){
      setTimeout(function(){ window.__skJumpToPage(true); }, 180);
    });
  }

  function sendReady(){
    if(window.parent !== window){
      window.parent.postMessage({ type: 'payload-live-preview', ready: true }, '*');
      window.parent.postMessage({ type: 'payload-live-preview-ready' }, '*');
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', sendReady);
  } else {
    sendReady();
  }
  setTimeout(sendReady, 300);
  setTimeout(sendReady, 1000);

  var prevSkip = skipOnLoad;
  window.addEventListener('message', function(e){
    if(!e.data || typeof e.data !== 'object') return;
    if(e.data.type === 'payload-live-preview' && e.data.data && typeof e.data.data === 'object'){
      var d = e.data.data;
      if (typeof d.skipIntroInPreview === 'boolean' && d.skipIntroInPreview !== prevSkip) {
        prevSkip = d.skipIntroInPreview;
        if (d.skipIntroInPreview) window.__skJumpToPage(false);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      var tlEls = document.querySelectorAll('#tx .tl');
      if (tlEls.length >= 4) {
        if (d.webglLineOne)   tlEls[0].textContent = d.webglLineOne;
        if (d.webglLineTwo)   tlEls[1].textContent = d.webglLineTwo;
        if (d.webglLineThree) tlEls[2].textContent = d.webglLineThree;
        if (d.webglLineFour)  tlEls[3].textContent = d.webglLineFour;
      }
      var starEl = document.getElementById('surya-id');
      if (starEl && d.starGreeting) starEl.textContent = d.starGreeting;
      var l1 = document.getElementById('cms-hero-l1'); if (l1 && d.heroLineOne)   l1.textContent = d.heroLineOne;
      var l2 = document.getElementById('cms-hero-l2'); if (l2 && d.heroLineTwo)   l2.textContent = d.heroLineTwo;
      var l3 = document.getElementById('cms-hero-l3'); if (l3 && d.heroLineThree) l3.textContent = d.heroLineThree;
      var ml = document.getElementById('cms-hero-ml'); if (ml && d.heroMetaLeft)  ml.textContent = d.heroMetaLeft;
      var mr = document.getElementById('cms-hero-mr'); if (mr && d.heroMetaRight) mr.textContent = d.heroMetaRight;
      var wh = document.getElementById('cms-work-heading'); if (wh && d.workHeading) wh.textContent = d.workHeading;
      if (Array.isArray(d.projects)) {
        var wc = document.getElementById('cms-work-count');
        if (wc) wc.textContent = '(' + String(d.projects.length).padStart(2, '0') + ')';
        var tiles = document.querySelectorAll('#work-bento .work-tile');
        d.projects.forEach(function(p, idx){
          var t = tiles[idx];
          if (!t || !p) return;
          var ttl = t.querySelector('.work-tile__title-in');
          if (ttl && p.title) ttl.textContent = p.title;
          var cat = t.querySelector('.work-tile__sub .text-label');
          if (cat && p.category) cat.textContent = p.category;
          var cap = t.querySelector('.work-tile__sub .text-caption');
          if (cap) cap.textContent = (p.role || '') + (p.year ? '  -  ' + p.year : '');
          var link = t.querySelector('.work-tile__link');
          if (link && p.caseStudySlug) link.setAttribute('href', '/preview/case-studies/' + encodeURIComponent(p.caseStudySlug));
        });
      }
    }
  });
})();
</script>`

  html = html.replace(/<\/body>/i, `${cmsOverlay}\n</body>`)

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
