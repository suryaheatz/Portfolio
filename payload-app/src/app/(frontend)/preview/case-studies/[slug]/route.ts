import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const esc = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const text = (v: unknown) => esc(v).replace(/\n/g, '<br>')
type Content = Record<string, unknown>
type CasePage = { title: string; layout?: Content[] }
const asset = (v: unknown) =>
  v && typeof v === 'object' && 'url' in v && typeof (v as Record<string,unknown>).url === 'string'
    ? (v as Record<string,unknown>).url as string
    : ''

/* ── Sample fallback data ── */
const sample: Record<string, CasePage> = {
  centronic: { title: 'Centronic', layout: [
    { blockType: 'caseStudyHero', eyebrow: 'ZF Friedrichshafen AG · 2019', role: 'Sr. UX Designer',
      title: 'Reimagining the HMI for SAE Level 4 autonomous cars',
      chips: [{ label: 'HMI' }, { label: 'Autonomous Vehicles' }],
      description: 'ZF's engineering team had been building a physical control knob, the Centronic, later called MMA.' },
    { blockType: 'caseStudyBrief', heading: 'The brief',
      body: 'At Level 4, the old automotive HMI constraints disappear. You can look at the screen, lean back, use both hands. The UI has to show the hardware capabilities.' },
    { blockType: 'caseStudyScope', heading: 'Project scope', facts: [
      { label: 'Where', value: 'ZF India Technology Centre, Hyderabad' },
      { label: 'When',  value: '2019–2020 · 10 months' },
      { label: 'My role', value: 'UX architecture, interaction model, hardware industrial design, research, feedback animations' },
    ]},
    { blockType: 'caseStudyEditorial', eyebrow: 'Research', heading: 'What people reach for, and what they ignore.' },
  ]},
  haptix: { title: 'Haptix', layout: [
    { blockType: 'caseStudyHero', eyebrow: 'UX Design · Jan–Jul 2020', role: 'Senior UX Designer',
      title: 'Haptix thumbwheel demonstrator',
      chips: [{ label: 'HMI' }, { label: 'Interaction Design' }],
      description: 'I was the UI and UX designer on a demonstrator that ZF built to pitch a new thumbwheel technology for operating a car interface.' },
    { blockType: 'caseStudyBrief', heading: 'The brief',
      body: 'ZF pitched this demonstrator to promote a new thumbwheel technology for operating a vehicle interface. The customer was Mercedes-Benz (Daimler).' },
    { blockType: 'caseStudyScope', heading: 'Where, when and what', facts: [
      { label: 'Where',       value: 'ZF India Technology Centre, Hyderabad' },
      { label: 'When',        value: 'January to July 2020 · about 7 months' },
      { label: 'My role',     value: 'Senior UX Designer, R&D UI and UX' },
      { label: 'Deliverables', value: 'Screens in Adobe XD, prototype in Figma, developer handoffs' },
    ]},
    { blockType: 'caseStudyEditorial', eyebrow: 'The hardware', heading: 'What the thumbwheel can do',
      body: 'The thumbwheel has three actions. You can turn it, push it, and touch it.' },
  ]},
}

/* ── Block renderers — production class names ── */
function render(b: Content): string {
  const type = String(b.blockType ?? '')

  /* ── Hero ── */
  if (type === 'caseStudyHero') {
    const chipTags = Array.isArray(b.chips)
      ? b.chips.map(c =>
          `<span class="hero-dot"></span><span class="hero-tag">${text((c as Content).label)}</span>`
        ).join('')
      : ''
    const heroUrl = asset(b.heroImage)
    const heroSection = heroUrl
      ? `<div class="hero-image-section" style="margin-top:32px"><img id="hero-img" src="${esc(heroUrl)}" alt="${esc(b.heroAlt)}"></div>`
      : ''
    return `
      <section class="hero-section">
        <div class="hero-scroll-meta">
          <span class="hero-tag">${text(b.eyebrow)}</span>
          <span class="hero-dot"></span>
          <span class="hero-tag">${text(b.role)}</span>
          ${chipTags}
        </div>
        <h1 class="hero-scroll-text">${text(b.title)}</h1>
        <p class="hero-subtitle">${text(b.description)}</p>
      </section>
      ${heroSection}`
  }

  /* ── Brief ── */
  if (type === 'caseStudyBrief') {
    const supp = b.supportingText ? `<p>${text(b.supportingText)}</p>` : ''
    return `
      <section class="st-card st-brief">
        <div class="brief-centre">
          <p>${text(b.body)}</p>
          ${supp}
        </div>
      </section>`
  }

  /* ── Scope ── */
  if (type === 'caseStudyScope') {
    const facts = Array.isArray(b.facts)
      ? b.facts.map(f =>
          `<div class="scope-item"><div class="scope-key">${text((f as Content).label)}</div><div class="scope-val">${text((f as Content).value)}</div></div>`
        ).join('')
      : ''
    const sketchUrl = asset(b.sketch)
    const sketch = sketchUrl
      ? `<figure class="scope-sketch"><img src="${esc(sketchUrl)}" alt="${esc(b.sketchAlt)}"></figure>`
      : ''
    return `
      <section class="st-card st-scope">
        <div class="container">
          <div class="section" style="padding-bottom:0">
            <div class="scope-strip">${facts}</div>
          </div>
          ${sketch}
        </div>
      </section>`
  }

  /* ── Editorial ── */
  if (type === 'caseStudyEditorial') {
    const imgUrl = asset(b.image)
    const fig = imgUrl
      ? `<figure class="cs-context-figure"><img src="${esc(imgUrl)}" alt="${esc(b.imageAlt)}"><figcaption class="cs-context-caption">${text(b.caption)}</figcaption></figure>`
      : ''
    return `
      <div class="section container" style="margin-top:40px">
        <div class="cs-context-layout">
          <div class="cs-context-margin">
            <p class="cs-label">${text(b.eyebrow)}</p>
          </div>
          <div class="cs-context-main">
            <h3 class="cs-h3">${text(b.heading)}</h3>
            ${b.body ? `<p class="cs-body">${text(b.body)}</p>` : ''}
          </div>
        </div>
        ${fig}
      </div>`
  }

  /* ── Full-width figure ── */
  if (type === 'fullWidthFigure') {
    const src = asset(b.image)
    if (!src) return ''
    const blur = b.background === 'blur'
    return `
      <figure class="cs-context-figure" style="position:relative;margin:40px 0">
        ${blur ? `<img aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(12px);opacity:.4;pointer-events:none" src="${esc(src)}" alt="">` : ''}
        <img src="${esc(src)}" alt="${esc(b.alt)}" style="position:relative">
        <figcaption class="cs-context-caption"><strong>${esc(b.captionLabel)}</strong> ${esc(b.caption)}</figcaption>
      </figure>`
  }

  /* ── Media group ── */
  if (type === 'caseStudyMediaGroup') {
    const items = Array.isArray(b.images) ? (b.images as Content[]) : []
    const mode = String(b.presentation || (b.layoutStyle === 'grid' ? 'adaptive' : 'tooltip'))
    const variant = String(b.gridVariant || 'two')
    const show = (v: unknown, fallback = false) => typeof v === 'boolean' ? v : fallback
    const entries = items.map((im, i) => {
      const url = asset(im.media) || String(im.sourceUrl || '')
      if (!url.startsWith('https://') && !url.startsWith('/')) return ''
      const visible = (field: string, fallback = false) => show(im['show' + field], fallback)
      const eyebrow = visible('Eyebrow') && im.eyebrow ? `<div class="asset-eyebrow">${esc(im.eyebrow)}</div>` : ''
      const title   = visible('Title')   && im.title   ? `<h3>${esc(im.title)}</h3>` : ''
      const caption = visible('Caption', true) && im.caption ? `<p class="asset-caption">${esc(im.caption)}</p>` : ''
      const desc    = visible('Description') && im.description ? `<p class="cs-body" style="font-size:14px">${text(im.description)}</p>` : ''
      const credit  = visible('Credit') && im.credit ? `<small style="opacity:.6">${esc(im.credit)}</small>` : ''
      const number  = show(b.showNumbers) ? `<span class="research-figure-index">${i + 1}.</span>` : ''
      const annotations = Array.isArray(im.annotations) ? (im.annotations as Content[]) : []
      const dots = mode === 'annotated' ? annotations.map(a => {
        const x = Math.max(0, Math.min(100, Number(a.x) || 0))
        const y = Math.max(0, Math.min(100, Number(a.y) || 0))
        return `<span class="annotation-dot" style="left:${x}%;top:${y}%" title="${esc(a.heading || a.body)}">${esc(a.number)}</span>`
      }).join('') : ''
      const legend = mode === 'annotated' ? `<ol style="font-size:13px;padding-left:16px">${annotations.map(a => `<li><strong>${esc(a.number)}. ${esc(a.heading)}</strong> ${esc(a.body)}</li>`).join('')}</ol>` : ''
      return `
        <figure class="research-figure">
          <div class="research-figure-window research-figure-window--mid" style="position:relative">
            <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">
              <img loading="lazy" src="${esc(url)}" alt="${esc(im.alt)}">
            </a>
            ${dots}
          </div>
          <figcaption class="research-figure-caption">
            ${number}
            <span class="research-figure-caption-text">${eyebrow}${title}${caption}${desc}${credit}${legend}</span>
          </figcaption>
        </figure>`
    }).join('')
    const heading = show(b.showSectionHeading, true) && b.sectionHeading
      ? `<div class="cs-context-layout" style="margin-bottom:24px"><div class="cs-context-margin"><p class="cs-label">${esc(b.sectionKey)}</p></div><div class="cs-context-main"><h3 class="cs-h3">${esc(b.sectionHeading)}</h3></div></div>`
      : ''
    const gridCols = variant === 'three' ? 'repeat(3,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))'
    const gridStyle = ['tooltip','adaptive'].includes(mode)
      ? `display:grid;grid-template-columns:${gridCols};gap:16px`
      : 'display:block'
    return `
      <div class="section container" style="margin-top:40px">
        ${heading}
        <div class="research-figures" style="${gridStyle}">${entries}</div>
      </div>`
  }

  return ''
}

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  if (!['centronic', 'haptix'].includes(slug)) return new Response('Not found', { status: 404 })

  const payload = await getPayload({ config })
  const result  = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, depth: 1, limit: 1 })
  const doc     = result.docs[0]
  const page: CasePage = doc ? { title: doc.title, layout: doc.layout as Content[] } : sample[slug]
  const isSample = !doc
  const body = (page.layout ?? []).map(b => render(b)).join('')

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)} · CMS Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;400;500;600&family=Manrope:wght@300;400;500;600&display=swap">
  <link rel="stylesheet" href="/ds-tokens.css">
  <style>
    /* ── Reset + base ── */
    *{box-sizing:border-box;margin:0;padding:0}
    html{overflow-x:hidden}
    body{background:var(--bg);color:var(--ink);font-family:var(--font-sans);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    a{color:var(--sun);text-decoration:none}
    a:hover{text-decoration:underline}

    /* ── Container ── */
    .container{max-width:var(--page-w);margin:0 auto;padding:0 var(--col-pad)}

    /* ── Preview bar ── */
    .preview-bar{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--rule);padding:18px max(24px,calc((100vw - 1100px)/2));gap:20px;background:var(--surface-chrome)}
    .preview-bar strong{font-size:13px;font-family:var(--font-sans)}
    .preview-nav{display:flex;gap:20px;font-size:12px;font-family:var(--font-sans)}
    .preview-nav a{color:var(--ink-3);transition:color .2s ease}
    .preview-nav a:hover{color:var(--sun);text-decoration:none}
    .preview-notice{max-width:var(--page-w);margin:20px auto;padding:12px 20px;background:#fff4df;border-left:3px solid var(--sun);font-size:12px;font-family:var(--font-sans);color:var(--ink-2)}

    /* ── Hero meta ── */
    .hero-tag{display:inline-block;font-size:12px;font-weight:400;color:var(--ink-2);background:rgba(17,17,16,0.06);border-radius:20px;padding:3px 10px}
    .hero-dot{width:3px;height:3px;border-radius:50%;background:var(--rule);flex-shrink:0}
    .hero-section{padding:var(--sp-20) 0 var(--sp-16);text-align:center}
    .hero-scroll-meta{display:flex;align-items:center;justify-content:center;gap:var(--sp-5);margin-bottom:var(--sp-6);flex-wrap:wrap}
    .hero-scroll-text{font-family:var(--font-display);font-size:clamp(36px,5.5vw,76px);font-weight:300;line-height:1.1;letter-spacing:-.02em;max-width:min(1100px,92vw);margin:0 auto;color:var(--ink)}
    .hero-subtitle{font-family:var(--font-sans);font-size:16px;font-weight:400;line-height:1.6;color:var(--ink-2);max-width:min(640px,90vw);margin:20px auto 0;text-align:center}

    /* ── Hero image ── */
    .hero-image-section{background:var(--ink-dark-2);width:100vw;position:relative;left:50%;margin-left:-50vw;margin-right:-50vw;overflow:hidden}
    #hero-img{width:100%;display:block}

    /* ── Brief card ── */
    .st-card{position:relative;width:100vw;left:50%;margin-left:-50vw}
    .st-brief{background:var(--bg);border-radius:var(--r-lg) var(--r-lg) 0 0}
    .brief-centre{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;padding:80px var(--col-pad);text-align:center}
    .brief-centre p{font-family:var(--font-display);font-size:clamp(26px,3vw,42px);font-weight:300;line-height:1.35;letter-spacing:-.02em;color:var(--ink);max-width:960px}
    .brief-centre p+p{margin-top:1.2em;color:var(--ink-2)}

    /* ── Scope card ── */
    .st-scope{background:var(--ink-dark);border-radius:var(--r-lg) var(--r-lg) 0 0}
    .st-scope .scope-strip{border-top-color:var(--rule-dark);border-bottom-color:var(--rule-dark)}
    .st-scope .scope-item+.scope-item{border-left-color:var(--rule-dark)}
    .st-scope .scope-key{color:rgba(245,244,240,.55)}
    .st-scope .scope-val{color:var(--bg)}
    .scope-strip{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:var(--sp-10) 0}
    .scope-item{padding-right:24px}
    .scope-item+.scope-item{padding-left:24px;border-left:1px solid var(--rule)}
    .scope-key{font-size:12px;color:var(--ink-2);margin-bottom:8px}
    .scope-val{font-size:15px;color:var(--ink);line-height:1.5}
    .scope-sketch{margin:0;padding:48px 0 0}
    .scope-sketch img{width:100%;display:block;border-radius:var(--r-md)}

    /* ── Section ── */
    .section{padding:var(--section-gap) 0}

    /* ── Editorial (context layout) ── */
    .cs-context-layout{display:grid;grid-template-columns:140px 1fr;gap:var(--col-pad);align-items:start}
    .cs-context-margin{padding-top:4px;display:flex;flex-direction:column;gap:var(--sp-4)}
    .cs-context-main{display:flex;flex-direction:column;gap:var(--sp-6)}
    .cs-context-figure{margin-top:var(--sp-10);width:100%;border-radius:var(--r-lg);overflow:hidden;background:var(--surface)}
    .cs-context-figure img{display:block;width:100%;max-height:480px;object-fit:contain;object-position:center center}
    .cs-context-caption{padding:var(--sp-3) var(--sp-4) var(--sp-4);font-family:var(--font-sans);font-size:12px;line-height:1.5;color:var(--ink-3)}

    /* ── CS typography ── */
    .cs-label{display:inline-block;font-family:var(--font-sans);font-size:12px;font-weight:400;color:var(--ink-2);background:rgba(17,17,16,0.06);border-radius:20px;padding:3px 10px}
    .cs-h3{font-family:var(--font-display);font-size:clamp(24px,2.8vw,34px);line-height:1.2;font-weight:400;color:var(--ink);margin:0}
    .cs-body{font-family:var(--font-sans);font-size:15px;line-height:1.65;color:var(--ink-2)}

    /* ── Research figures (media group) ── */
    .research-figures{display:flex;flex-direction:column;gap:var(--sp-10)}
    .research-figure{background:var(--bg);border-radius:var(--r-lg);overflow:hidden;position:relative;box-shadow:0 0 0 1px var(--rule)}
    .research-figure-window{position:relative;width:100%;overflow:hidden;background:var(--bg);padding:24px 24px 0}
    .research-figure-window--mid{height:400px}
    .research-figure-window--tall{height:460px}
    .research-figure-window img{display:block;width:100%;height:100%;object-fit:contain;object-position:center top}
    .research-figure-caption{background:var(--surface);padding:14px 20px 16px;display:flex;align-items:baseline;gap:12px;border-top:1px solid var(--rule)}
    .research-figure-index{flex-shrink:0;font-family:var(--font-sans);font-size:11px;font-weight:500;letter-spacing:.04em;color:var(--ink-3);min-width:24px}
    .research-figure-caption-text{font-family:var(--font-sans);font-size:12px;line-height:1.5;color:var(--ink-3)}
    .asset-eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:11px;opacity:.7}
    .research-figure-caption-text h3{font-family:var(--font-display);font-size:18px;font-weight:400;margin:6px 0 4px;color:var(--ink)}
    .annotation-dot{position:absolute;transform:translate(-50%,-50%);background:var(--sun);color:#fff;border-radius:50%;width:28px;height:28px;text-align:center;line-height:28px;pointer-events:none;font-size:12px;font-weight:600}

    /* ── Responsive ── */
    @media(max-width:640px){
      .container{padding:0 var(--col-pad-m)}
      .hero-section{padding:var(--sp-12) 0 var(--sp-8)}
      .brief-centre{min-height:0;padding:48px var(--col-pad-m)}
      .cs-context-layout{grid-template-columns:1fr;gap:var(--sp-4)}
      .cs-context-margin{flex-direction:row;align-items:center;padding-top:0}
      .scope-strip{grid-template-columns:1fr 1fr}
      .scope-item{padding-right:12px}
      .scope-item+.scope-item{padding-left:12px}
      .research-figure-window--mid,.research-figure-window--tall{height:220px}
    }
  </style>
</head>
<body>

<header class="preview-bar">
  <strong>SK · CMS Preview</strong>
  <nav class="preview-nav">
    <a href="/preview/case-studies/centronic">Centronic</a>
    <a href="/preview/case-studies/haptix">Haptix</a>
    <a href="/admin/collections/pages">← Edit in Payload</a>
  </nav>
</header>

<aside class="preview-notice container">
  ${isSample
    ? 'Sample content — create a Pages document with slug <code>centronic</code> or <code>haptix</code> to see live CMS data here.'
    : 'Live CMS data. Save Draft or Publish in Payload to see changes here. Animations are not shown in preview.'}
</aside>

<div class="container">
${body}
</div>

<footer style="margin:80px auto 40px;border-top:1px solid var(--rule);padding-top:20px;font-size:12px;color:var(--ink-3);max-width:var(--page-w);padding-left:var(--col-pad)">
  Integration branch · Review only · Production case studies unchanged
</footer>

<script>
// Signal to Payload admin that the preview frame is ready.
(function(){
  function ready(){ if(window.parent!==window){ window.parent.postMessage({type:'payload-live-preview-ready'},'*') } }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',ready) } else { ready() }
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='payload-live-preview'){ window.location.reload() }
  })
})()
</script>

</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
