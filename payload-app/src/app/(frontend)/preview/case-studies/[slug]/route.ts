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

/* ── Lexical rich text → HTML ── */
type LexNode = Record<string, unknown>
function walkLexNode(node: LexNode): string {
  const t = String(node.type ?? '')
  const kids = (node.children ?? []) as LexNode[]
  if (t === 'text') {
    const fmt = Number(node.format ?? 0)
    let s = esc(node.text)
    if (fmt & 16) s = `<code>${s}</code>`
    if (fmt & 1)  s = `<strong>${s}</strong>`
    if (fmt & 2)  s = `<em>${s}</em>`
    if (fmt & 8)  s = `<u>${s}</u>`
    if (fmt & 4)  s = `<s>${s}</s>`
    return s
  }
  if (t === 'linebreak') return '<br>'
  if (t === 'paragraph') { const inner = kids.map(walkLexNode).join(''); return inner ? `<p>${inner}</p>` : '' }
  if (t === 'heading') { const tag = esc(String(node.tag ?? 'h3')); return `<${tag}>${kids.map(walkLexNode).join('')}</${tag}>` }
  if (t === 'list') { const tag = node.listType === 'number' ? 'ol' : 'ul'; return `<${tag}>${kids.map(walkLexNode).join('')}</${tag}>` }
  if (t === 'listitem') { return `<li>${kids.map(walkLexNode).join('')}</li>` }
  if (t === 'link') {
    const fields = (node.fields ?? {}) as LexNode
    const href = esc(String(fields.url ?? node.url ?? '#'))
    return `<a href="${href}" target="_blank" rel="noopener">${kids.map(walkLexNode).join('')}</a>`
  }
  if (kids.length) return kids.map(walkLexNode).join('')
  return ''
}
/** Render a Payload richText (Lexical JSON) field to HTML.
 *  Falls back to text() for legacy plain-string values during migration. */
function lexToHtml(v: unknown): string {
  if (typeof v === 'string') return v ? `<p>${text(v)}</p>` : ''
  if (!v || typeof v !== 'object') return ''
  const root = ((v as LexNode).root ?? {}) as LexNode
  const children = (root.children ?? []) as LexNode[]
  return children.map(walkLexNode).join('')
}
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
      description: "ZF's engineering team had been building a physical control knob, the Centronic, later called MMA." },
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
      ? `<div class="hero-image-section"><img id="hero-img" src="${esc(heroUrl)}" alt="${esc(b.heroAlt)}"></div>`
      : ''
    return `
      <section class="hero-section container">
        <div class="hero-scroll-meta">
          <span class="hero-tag">${text(b.eyebrow)}</span>
          <span class="hero-dot"></span>
          <span class="hero-tag">${text(b.role)}</span>
          ${chipTags}
        </div>
        <h1 class="hero-scroll-text">${text(b.title)}</h1>
        <div class="hero-subtitle">${lexToHtml(b.description)}</div>
      </section>
      ${heroSection}`
  }

  /* ── Brief ── */
  if (type === 'caseStudyBrief') {
    const supp = b.supportingText ? lexToHtml(b.supportingText) : ''
    return `
      <section class="st-card st-brief">
        <div class="brief-centre">
          ${lexToHtml(b.body)}
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
            ${b.body ? `<div class="cs-body">${lexToHtml(b.body)}</div>` : ''}
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

  /* -- Bento grid -- */
  if (type === 'caseBento') {
    const cells = Array.isArray(b.cells) ? (b.cells as Content[]) : []
    const layout = String(b.layout || 'bento-2')
    const layoutClassMap: Record<string, string> = {
      'bento-2':  'cs-bento--2',
      'bento-3a': 'cs-bento--3a',
      'bento-3b': 'cs-bento--3b',
      'bento-4':  'cs-bento--4',
    }
    const layoutClass = layoutClassMap[layout] ?? 'cs-bento--2'
    const cellsHtml = cells.map((cell, i) => {
      const imgUrl = asset(cell.image)
      if (!imgUrl) return ''
      const cap = cell.caption ? `<div class="cs-bento-caption">${esc(cell.caption)}</div>` : ''
      return `<div class="cs-bento-cell" data-bento-index="${i}">
        <img src="${esc(imgUrl)}" alt="${esc(cell.altText)}" loading="lazy">
        <div class="cs-bento-overlay"></div>
        ${cap}
        <button class="cs-bento-expand" aria-label="Expand image">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11L11 1M7 1h4v4M5 11H1V7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>`
    }).join('\n')
    const hdr = (b.eyebrow || b.title || b.subtitle) ? `
      <div class="cs-bento-header">
        ${b.eyebrow  ? `<p class="cs-label">${esc(b.eyebrow)}</p>` : ''}
        ${b.title    ? `<h3 class="cs-bento-title">${esc(b.title)}</h3>` : ''}
        ${b.subtitle ? `<p class="cs-bento-subtitle">${esc(b.subtitle)}</p>` : ''}
      </div>` : ''
    return `
      <div class="section container" style="margin-top:40px">
        ${hdr}
        <div class="cs-bento ${layoutClass}" data-bento>
          ${cellsHtml}
        </div>
      </div>`
  }

  /* -- Before / after slider -- */
  if (type === 'beforeAfterSlider') {
    const beforeUrl = asset(b.beforeImage)
    const afterUrl  = asset(b.afterImage)
    if (!beforeUrl || !afterUrl) return ''
    const beforeLabel = esc(String(b.beforeLabel || 'Before'))
    const afterLabel  = esc(String(b.afterLabel  || 'After'))
    const cap = b.caption ? `<p class="ba-caption">${esc(String(b.caption))}</p>` : ''
    return `
      <div class="section container" style="margin-top:40px">
        <div class="ba-slider" data-ba>
          <img class="ba-after"  src="${esc(afterUrl)}"  alt="${afterLabel}"  draggable="false">
          <img class="ba-before" src="${esc(beforeUrl)}" alt="${beforeLabel}" draggable="false">
          <div class="ba-handle" aria-hidden="true">
            <div class="ba-line"></div>
            <div class="ba-circle">
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 6h18M1 6l4-4M1 6l4 4M19 6l-4-4M19 6l-4 4" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <span class="ba-label ba-label--before">${beforeLabel}</span>
          <span class="ba-label ba-label--after">${afterLabel}</span>
        </div>
        ${cap}
      </div>`
  }

  /* -- Annotated media -- */
  if (type === 'annotatedMedia') {
    const imgUrl    = asset(b.image)
    if (!imgUrl) return ''
    const hotspots  = Array.isArray(b.hotspots) ? (b.hotspots as Content[]) : []
    const cap       = b.caption ? `<figcaption class="am-caption">${esc(String(b.caption))}</figcaption>` : ''

    const dots = hotspots.map((hs, i) => {
      const n = hs.number != null ? Number(hs.number) : i + 1
      const x = Math.max(0, Math.min(100, Number(hs.x ?? 50)))
      const y = Math.max(0, Math.min(100, Number(hs.y ?? 50)))
      return `<button class="am-dot" style="left:${x}%;top:${y}%" aria-label="Hotspot ${n}">${n}</button>`
    }).join('\n          ')

    const panels = hotspots.map((hs) => {
      const heading = hs.heading ? `<p class="am-panel-heading">${esc(String(hs.heading))}</p>` : ''
      const body    = hs.body    ? `<p class="am-panel-body">${esc(String(hs.body))}</p>`       : ''
      return `<div class="am-panel" role="tooltip">${heading}${body}</div>`
    }).join('\n          ')

    return `
      <div class="section container" style="margin-top:40px">
        <figure class="am-figure">
          <div class="am-stage" data-am>
            <img class="am-image" src="${esc(imgUrl)}" alt="${esc(String(b.altText || ''))}" loading="lazy">
            ${dots}
            ${panels}
          </div>
          ${cap}
        </figure>
      </div>`
  }

  /* -- Pullquote -- */
  if (type === 'pullquote') {
    const quoteHtml = lexToHtml(b.quote)
    if (!quoteHtml) return ''
    const variant  = String(b.variant || 'light')
    const varClass = variant === 'dark' ? 'pq-card--dark' : 'pq-card--light'
    const attr     = b.attribution ? `<p class="pq-attr">${esc(String(b.attribution))}</p>` : ''
    return `
      <div class="section container">
        <div class="pq-card ${varClass}">
          <div class="pq-quote">${quoteHtml}</div>
          ${attr}
        </div>
      </div>`
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
  const result  = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, depth: 1, limit: 1, draft: true, overrideAccess: true })
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
  <style>
    /* ── SK Design System tokens (inlined — no public/ in payload-app) ── */
    :root {
      --bg:             #f5f4f0;
      --ink:            #111110;
      --ink-2:          #545450;
      --ink-3:          #636360;
      --rule:           #dddad0;
      --surface:        #eeece7;
      --surface-chrome: #fafaf8;
      --sun:            #E8490F;
      --sun-light:      rgba(232,73,15,0.12);
      --sun-muted:      rgba(232,73,15,0.06);
      --ink-dark:       #1a1917;
      --ink-dark-2:     #1e1c1a;
      --ink-void:       #0e0e0d;
      --rule-dark:      #3a3a36;
      --proto-bg:       #030B1B;
      --page-w:         1080px;
      --col-pad:        48px;
      --col-pad-m:      24px;
      --section-gap:    80px;
      --section-gap-m:  48px;
      --r-sm:  6px;  --r-md: 12px;  --r-lg: 20px;
      --r-1:4px; --r-2:8px; --r-3:12px; --r-4:16px; --r-5:20px;
      --r-6:24px; --r-7:32px; --r-8:40px; --r-9:48px;
      --sp-1:4px;  --sp-2:8px;   --sp-3:12px; --sp-4:16px;
      --sp-5:20px; --sp-6:24px;  --sp-8:32px; --sp-10:40px;
      --sp-12:48px;--sp-16:64px; --sp-20:80px;--sp-24:96px;
      --font-display: 'Bricolage Grotesque', system-ui, sans-serif;
      --font-sans:    'Manrope', system-ui, sans-serif;
      --font-quote:   Georgia, serif;
      --bento-gap: 16px;
      --r-bento: 24px;
      --bento-row: 200px;
      --ease-out: cubic-bezier(0.16,1,0.3,1);
    }
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
    .preview-nav{display:flex;align-items:center;gap:20px;font-size:12px;font-family:var(--font-sans)}
    .preview-nav a{color:var(--ink-3);transition:color .2s ease}
    .preview-nav a:hover{color:var(--sun);text-decoration:none}
    .preview-refresh{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;border:1px solid var(--rule);background:var(--bg);color:var(--ink-2);font-size:12px;font-family:var(--font-sans);cursor:pointer;transition:all .18s ease}
    .preview-refresh:hover{border-color:var(--sun);color:var(--sun);background:var(--sun-muted)}
    .preview-refresh svg{transition:transform .4s var(--ease-out)}
    .preview-refresh.spinning svg{transform:rotate(360deg)}
    .preview-notice{max-width:var(--page-w);margin:20px auto;padding:12px 20px;background:#fff4df;border-left:3px solid var(--sun);font-size:12px;font-family:var(--font-sans);color:var(--ink-2)}

    /* ── Hero meta ── */
    .hero-tag{display:inline-block;font-size:12px;font-weight:400;color:var(--ink-2);background:rgba(17,17,16,0.06);border-radius:20px;padding:3px 10px}
    .hero-dot{width:3px;height:3px;border-radius:50%;background:var(--rule);flex-shrink:0}
    .hero-section{padding:var(--sp-20) 0 var(--sp-16);text-align:center;max-width:100%}
    .hero-scroll-meta{display:flex;align-items:center;justify-content:center;gap:var(--sp-5);margin-bottom:var(--sp-6);flex-wrap:wrap}
    .hero-scroll-text{font-family:var(--font-display);font-size:clamp(36px,5.5vw,76px);font-weight:400;line-height:1.1;letter-spacing:-.02em;max-width:min(1100px,92vw);margin:0 auto;color:var(--ink)}
    .hero-subtitle{font-family:var(--font-sans);font-size:16px;font-weight:400;line-height:1.6;color:var(--ink-2);max-width:min(640px,90vw);margin:20px auto 0;text-align:center}
    .hero-subtitle p{margin:0;font:inherit;color:inherit}
    .hero-subtitle p+p{margin-top:.75em}

    /* ── Hero image ── */
    /* Full-bleed override for iframe: stretch to viewport edges without overflow trick */
    .hero-image-section{background:var(--ink-dark-2);width:100%;overflow:hidden;margin-left:0;margin-right:0}
    #hero-img{width:100%;display:block}

    /* ── Brief card ── */
    .st-card{position:relative;width:100%;margin-left:0}
    .st-brief{background:var(--bg);border-radius:var(--r-lg) var(--r-lg) 0 0}
    .brief-centre{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px var(--col-pad);text-align:center}
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
    .cs-body p{margin:0;font:inherit;color:inherit;line-height:inherit}
    .cs-body p+p{margin-top:1em}
    .cs-body strong{font-weight:600;color:var(--ink)}
    .cs-body em{font-style:italic}
    .cs-body ul,.cs-body ol{padding-left:1.4em;margin-top:.5em}
    .cs-body li+li{margin-top:.25em}

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

    /* -- Bento grid -- */
    .cs-bento { display: grid; gap: var(--bento-gap); width: 100%; }
    .cs-bento-cell { position: relative; border-radius: var(--r-bento); overflow: hidden; background: var(--surface); cursor: pointer; }
    .cs-bento-cell img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center center; }

    /* Layouts: 240px rows (design-correct for UI screenshots - production uses 200px token) */
    .cs-bento--2  { grid-template-columns: 1fr 1fr; grid-template-rows: 240px; }
    .cs-bento--3a { grid-template-columns: 1fr 1fr; grid-template-rows: 240px 240px; }
    .cs-bento--3a .cs-bento-cell:nth-child(3) { grid-column: 1 / -1; }
    .cs-bento--3b { grid-template-columns: 3fr 2fr; grid-template-rows: 240px 240px; }
    .cs-bento--3b .cs-bento-cell:nth-child(1) { grid-row: 1 / 3; }
    .cs-bento--4  { grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 240px 240px; }
    .cs-bento--4  .cs-bento-cell:nth-child(1) { grid-column: 1 / -1; }

    /* Overlay */
    .cs-bento-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(17,17,16,.55) 0%, transparent 48%); opacity: 0; transition: opacity .22s ease; pointer-events: none; }
    .cs-bento-cell:hover .cs-bento-overlay { opacity: 1; }

    /* Caption */
    .cs-bento-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px; font-family: var(--font-sans); font-size: 12px; line-height: 1.5; color: #fff; opacity: 0; transition: opacity .22s ease; pointer-events: none; }
    .cs-bento-cell:hover .cs-bento-caption { opacity: 1; }

    /* Expand button */
    .cs-bento-expand { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(245,244,240,.12); backdrop-filter: blur(8px); border: 1px solid rgba(245,244,240,.2); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .22s ease; cursor: pointer; padding: 0; }
    .cs-bento-cell:hover .cs-bento-expand { opacity: 1; }

    /* Block header (eyebrow / title / subtitle above grid) */
    .cs-bento-header { margin-bottom: var(--sp-10); }
    .cs-bento-header .cs-label { display: block; margin-bottom: var(--sp-3); }
    .cs-bento-title { font-family: var(--font-display); font-size: clamp(24px,2.8vw,34px); font-weight: 400; line-height: 1.2; color: var(--ink); margin: 0 0 var(--sp-3); }
    .cs-bento-subtitle { font-family: var(--font-sans); font-size: 15px; line-height: 1.65; color: var(--ink-2); margin: 0; }

    /* Expand stage overlay */
    #bento-stage { position: fixed; inset: 0; background: rgba(17,17,16,.85); backdrop-filter: blur(12px); z-index: 1000; display: none; align-items: center; justify-content: center; }
    #bento-stage.active { display: flex; }
    #bento-stage .cs-bento-cell { width: auto; height: auto; max-width: 90vw; max-height: 90vh; border-radius: var(--r-bento); overflow: hidden; cursor: pointer; }
    #bento-stage .cs-bento-cell img { width: auto; height: auto; max-width: 88vw; max-height: 86vh; object-fit: contain; }

    /* -- Before / after slider -- */
    .ba-slider { position: relative; overflow: hidden; border-radius: var(--r-lg); background: var(--surface); width: 100%; height: 480px; user-select: none; touch-action: none; cursor: ew-resize; }
    .ba-after, .ba-before { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; pointer-events: none; }
    .ba-before { clip-path: inset(0 50% 0 0); }
    .ba-handle { position: absolute; top: 0; bottom: 0; left: 50%; z-index: 10; cursor: ew-resize; }
    .ba-line { position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; transform: translateX(-50%); background: rgba(255,255,255,.9); box-shadow: 0 0 8px rgba(0,0,0,.3); }
    .ba-circle { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 44px; height: 44px; border-radius: 50%; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,.25); display: flex; align-items: center; justify-content: center; }
    .ba-label { position: absolute; top: 16px; font-family: var(--font-sans); font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: rgba(17,17,16,.45); backdrop-filter: blur(4px); border-radius: 20px; padding: 4px 10px; pointer-events: none; z-index: 5; }
    .ba-label--before { left: 16px; }
    .ba-label--after { right: 16px; }
    .ba-caption { font-family: var(--font-sans); font-size: 12px; line-height: 1.5; color: var(--ink-3); margin-top: var(--sp-3); }

    /* -- Annotated media -- */
    @keyframes am-pulse { 0%{box-shadow:0 0 0 0 rgba(232,73,15,.5)} 60%{box-shadow:0 0 0 8px rgba(232,73,15,0)} 100%{box-shadow:0 0 0 0 rgba(232,73,15,0)} }
    .am-figure { margin: 0; }
    .am-stage { position: relative; overflow: hidden; border-radius: var(--r-lg); background: var(--surface); }
    .am-image { display: block; width: 100%; object-fit: contain; object-position: center; }
    .am-dot { position: absolute; transform: translate(-50%,-50%); width: 28px; height: 28px; border-radius: 50%; background: var(--sun); color: #fff; font-family: var(--font-sans); font-size: 12px; font-weight: 600; border: 2px solid rgba(255,255,255,.65); cursor: pointer; z-index: 5; display: flex; align-items: center; justify-content: center; animation: am-pulse 2.5s infinite; transition: transform var(--dur-fast) var(--ease-out); }
    .am-dot.active { animation: none; transform: translate(-50%,-50%) scale(1.2); }
    .am-panel { position: absolute; display: none; z-index: 20; background: var(--surface-chrome); border: 1px solid var(--rule); border-radius: var(--r-md); padding: var(--sp-4); min-width: 200px; max-width: 260px; box-shadow: 0 4px 24px rgba(0,0,0,.12); }
    .am-panel.active { display: block; }
    .am-panel-heading { font-family: var(--font-display); font-size: 15px; font-weight: 500; color: var(--ink); margin: 0 0 var(--sp-2); }
    .am-panel-body { font-family: var(--font-sans); font-size: 13px; line-height: 1.55; color: var(--ink-2); margin: 0; }
    .am-caption { display: block; font-family: var(--font-sans); font-size: 12px; line-height: 1.5; color: var(--ink-3); margin-top: var(--sp-3); }

    /* -- Pullquote -- */
    .pq-card { padding: var(--sp-12) var(--sp-16); border-radius: var(--r-lg); border-left: 3px solid var(--sun); }
    .pq-card--light { background: var(--surface); }
    .pq-card--dark  { background: var(--ink-dark); }
    .pq-quote { font-family: var(--font-quote); font-size: clamp(22px,2.8vw,32px); font-style: italic; font-weight: 300; line-height: 1.45; letter-spacing: -.01em; }
    .pq-card--light .pq-quote { color: var(--ink); }
    .pq-card--dark  .pq-quote { color: var(--bg); }
    .pq-quote p { margin: 0; font: inherit; color: inherit; line-height: inherit; }
    .pq-quote p+p { margin-top: .6em; }
    .pq-attr { font-family: var(--font-sans); font-size: 13px; font-weight: 500; margin: var(--sp-6) 0 0; }
    .pq-card--light .pq-attr { color: var(--ink-2); }
    .pq-card--dark  .pq-attr { color: rgba(245,244,240,.55); }

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
      .cs-bento--2,.cs-bento--3a,.cs-bento--3b,.cs-bento--4{grid-template-columns:1fr;grid-template-rows:auto}
      .cs-bento--3a .cs-bento-cell:nth-child(3),.cs-bento--4 .cs-bento-cell:nth-child(1){grid-column:auto}
      .cs-bento--3b .cs-bento-cell:nth-child(1){grid-row:auto}
      .cs-bento-cell{height:200px}
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Flip.min.js"></script>
</head>
<body>
<div id="bento-stage"></div>

<header class="preview-bar">
  <strong>SK · CMS Preview</strong>
  <nav class="preview-nav">
    <a href="/preview/case-studies/centronic">Centronic</a>
    <a href="/preview/case-studies/haptix">Haptix</a>
    <a href="/admin/collections/pages">← Edit in Payload</a>
    <button class="preview-refresh" id="refreshBtn" onclick="doRefresh()" title="Reload preview with latest saved draft">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 6.5A5 5 0 1 1 6.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <polyline points="6.5,1.5 9,1.5 9,4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Refresh
    </button>
  </nav>
</header>

<aside class="preview-notice container">
  ${isSample
    ? 'Sample content — create a Pages document with slug <code>centronic</code> or <code>haptix</code> to see live CMS data here.'
    : 'Live CMS data. Save Draft or Publish in Payload to see changes here. Animations are not shown in preview.'}
</aside>

<div id="page-content">
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

function doRefresh(){
  var btn = document.getElementById('refreshBtn')
  if(btn){ btn.classList.add('spinning') }
  setTimeout(function(){ window.location.reload() }, 320)
}

// -- Bento: 3D tilt + Flip expand/close --
(function bentoInit(){
  if(typeof gsap === 'undefined') return
  var cells = document.querySelectorAll('[data-bento] .cs-bento-cell')
  var stage = document.getElementById('bento-stage')
  var expandedCell = null
  var origParent = null
  var origNextSib = null

  cells.forEach(function(cell){
    cell.addEventListener('mousemove', function(e){
      if(cell.classList.contains('flip-expanded')) return
      var r = cell.getBoundingClientRect()
      var x = (e.clientX - r.left) / r.width - 0.5
      var y = (e.clientY - r.top)  / r.height - 0.5
      gsap.to(cell, {
        rotationY: x * 16, rotationX: -y * 16,
        transformPerspective: 800, duration: 0.3, ease: 'power2.out'
      })
    })
    cell.addEventListener('mouseleave', function(){
      gsap.to(cell, { rotationY: 0, rotationX: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    })
  })

  if(typeof Flip === 'undefined' || !stage) return
  document.querySelectorAll('.cs-bento-expand').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.stopPropagation()
      var cell = btn.closest('.cs-bento-cell')
      if(!cell) return
      origParent = cell.parentNode
      origNextSib = cell.nextSibling
      var state = Flip.getState(cell)
      cell.classList.add('flip-expanded')
      stage.appendChild(cell)
      stage.classList.add('active')
      expandedCell = cell
      Flip.from(state, { duration: 0.55, ease: 'power3.inOut', nested: true })
    })
  })

  stage.addEventListener('click', function(){
    if(!expandedCell || !origParent) return
    var state = Flip.getState(expandedCell)
    if(origNextSib) { origParent.insertBefore(expandedCell, origNextSib) }
    else { origParent.appendChild(expandedCell) }
    expandedCell.classList.remove('flip-expanded')
    stage.classList.remove('active')
    Flip.from(state, { duration: 0.55, ease: 'power3.inOut', nested: true })
    expandedCell = null; origParent = null; origNextSib = null
  })
})()

// -- Before/after slider drag --
;(function baInit(){
  document.querySelectorAll('[data-ba]').forEach(function(slider){
    var before  = slider.querySelector('.ba-before')
    var handle  = slider.querySelector('.ba-handle')
    if(!before || !handle) return
    var isDragging = false

    function setPos(x) {
      var r   = slider.getBoundingClientRect()
      var pct = Math.max(2, Math.min(98, ((x - r.left) / r.width) * 100))
      before.style.clipPath   = 'inset(0 ' + (100 - pct) + '% 0 0)'
      handle.style.left = pct + '%'
    }

    slider.addEventListener('mousedown', function(e){ isDragging = true; setPos(e.clientX); e.preventDefault() })
    window.addEventListener('mousemove', function(e){ if(isDragging) setPos(e.clientX) })
    window.addEventListener('mouseup',   function(){  isDragging = false })

    slider.addEventListener('touchstart', function(e){ isDragging = true; setPos(e.touches[0].clientX); e.preventDefault() }, { passive: false })
    window.addEventListener('touchmove',  function(e){ if(isDragging) setPos(e.touches[0].clientX) })
    window.addEventListener('touchend',   function(){  isDragging = false })
  })
})()

// -- Annotated media hotspots --
;(function amInit(){
  function positionPanel(stage, dot, panel) {
    var sw  = stage.offsetWidth
    var sh  = stage.offsetHeight
    var dx  = parseFloat(dot.style.left)  / 100 * sw
    var dy  = parseFloat(dot.style.top)   / 100 * sh
    var pw  = 260
    var ph  = panel.offsetHeight || 80

    var left = dx + 20
    var top  = dy - 20
    if (left + pw > sw - 8) left = dx - pw - 20
    if (top + ph > sh - 8)  top  = sh - ph - 8
    if (top < 8)            top  = 8
    if (left < 8)           left = 8

    panel.style.left = left + 'px'
    panel.style.top  = top  + 'px'
  }

  document.querySelectorAll('[data-am]').forEach(function(stage){
    var dots   = Array.from(stage.querySelectorAll('.am-dot'))
    var panels = Array.from(stage.querySelectorAll('.am-panel'))

    dots.forEach(function(dot, i){
      dot.addEventListener('click', function(e){
        e.stopPropagation()
        var isOpen = dot.classList.contains('active')
        dots.forEach(function(d){ d.classList.remove('active') })
        panels.forEach(function(p){ p.classList.remove('active') })
        if (!isOpen && panels[i]) {
          dot.classList.add('active')
          panels[i].classList.add('active')
          positionPanel(stage, dot, panels[i])
        }
      })
    })

    stage.addEventListener('click', function(){
      dots.forEach(function(d){ d.classList.remove('active') })
      panels.forEach(function(p){ p.classList.remove('active') })
    })
  })
})()
</script>

</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
