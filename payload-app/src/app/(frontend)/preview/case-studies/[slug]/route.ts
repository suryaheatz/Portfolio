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

/* -- Lexical rich text -> HTML -- */
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
type CasePage = { title: string; template?: string; slides?: Content[]; layout?: Content[] }
const bpSlot = (label: string, spec: string, height = '240px', dark = false) => `
  <div class="bp-slot${dark ? ' bp-slot--dark' : ''}" style="min-height:${height}">
    <span class="bp-badge">${esc(spec)}</span>
    <strong class="bp-title">${esc(label)}</strong>
    <span class="bp-sub">SK Design System Blueprint  -  Upload image in left panel to populate</span>
  </div>`
const asset = (v: unknown) =>
  v && typeof v === 'object' && 'url' in v && typeof (v as Record<string,unknown>).url === 'string'
    ? (v as Record<string,unknown>).url as string
    : ''

/* -- Sample fallback data -- */
const sample: Record<string, CasePage> = {
  centronic: { title: 'Centronic', layout: [
    { blockType: 'caseStudyHero', eyebrow: 'ZF Friedrichshafen AG  - 2019', role: 'Sr. UX Designer',
      title: 'Reimagining the HMI for SAE Level 4 autonomous cars',
      chips: [{ label: 'HMI' }, { label: 'Autonomous Vehicles' }],
      description: "ZF's engineering team had been building a physical control knob, the Centronic, later called MMA." },
    { blockType: 'caseStudyBrief', heading: 'The brief',
      narrativeBody: 'At Level 4, the old automotive HMI constraints disappear. You can look at the screen, lean back, use both hands. The UI has to show the hardware capabilities.' },
    { blockType: 'caseStudyScope', heading: 'Project scope', facts: [
      { label: 'Where', value: 'ZF India Technology Centre, Hyderabad' },
      { label: 'When',  value: '2019-2020  - 10 months' },
      { label: 'My role', value: 'UX architecture, interaction model, hardware industrial design, research, feedback animations' },
    ]},
    { blockType: 'caseStudyEditorial', eyebrow: 'Research', heading: 'What people reach for, and what they ignore.' },
  ]},
  haptix: { title: 'Haptix', layout: [
    { blockType: 'caseStudyHero', eyebrow: 'UX Design  - Jan-Jul 2020', role: 'Senior UX Designer',
      title: 'Haptix thumbwheel demonstrator',
      chips: [{ label: 'HMI' }, { label: 'Interaction Design' }],
      description: 'I was the UI and UX designer on a demonstrator that ZF built to pitch a new thumbwheel technology for operating a car interface.' },
    { blockType: 'caseStudyBrief', heading: 'The brief',
      narrativeBody: 'ZF pitched this demonstrator to promote a new thumbwheel technology for operating a vehicle interface. The customer was Mercedes-Benz (Daimler).' },
    { blockType: 'caseStudyScope', heading: 'Where, when and what', facts: [
      { label: 'Where',       value: 'ZF India Technology Centre, Hyderabad' },
      { label: 'When',        value: 'January to July 2020  - about 7 months' },
      { label: 'My role',     value: 'Senior UX Designer, R&D UI and UX' },
      { label: 'Deliverables', value: 'Screens in Adobe XD, prototype in Figma, developer handoffs' },
    ]},
    { blockType: 'caseStudyEditorial', eyebrow: 'The hardware', heading: 'What the thumbwheel can do',
      editorialBody: 'The thumbwheel has three actions. You can turn it, push it, and touch it.' },
  ]},
}

/* -- Block renderers -- production class names -- */
function render(b: Content): string {
  const type = String(b.blockType ?? '')

  /* -- Hero -- */
  if (type === 'caseStudyHero') {
    const chipTags = Array.isArray(b.chips)
      ? b.chips.map(c =>
          `<span class="hero-dot"></span><span class="hero-tag">${text((c as Content).label || 'Tag')}</span>`
        ).join('')
      : ''
    const heroUrl = asset(b.heroImage)
    const heroSection = heroUrl
      ? `<div class="hero-image-section"><img id="hero-img" src="${esc(heroUrl)}" alt="${esc(b.heroAlt)}"></div>`
      : `<div class="container" style="margin-bottom:48px">${bpSlot('Hero Visual (Full-Bleed 16:9)', '16:9 Aspect Ratio  |  1920x1080px recommended  |  object-fit: cover', '320px')}</div>`
    const eyebrowHtml = b.eyebrow ? text(b.eyebrow) : '<span style="opacity:.55">Domain / Client  -  Year</span>'
    const roleHtml = b.role ? text(b.role) : '<span style="opacity:.55">Your Role (e.g. Senior UX Designer)</span>'
    const titleHtml = b.title ? text(b.title) : '<span style="opacity:.45">Case Study Headline (Bricolage Grotesque)</span>'
    const descHtml = lexToHtml(b.description) || '<p style="opacity:.55">Write a 1-2 sentence overview of the system, user context, and design outcome.</p>'
    return `
      <section class="hero-section container">
        <div class="hero-scroll-meta">
          <span class="hero-tag">${eyebrowHtml}</span>
          <span class="hero-dot"></span>
          <span class="hero-tag">${roleHtml}</span>
          ${chipTags}
        </div>
        <h1 class="hero-scroll-text">${titleHtml}</h1>
        <div class="hero-subtitle">${descHtml}</div>
      </section>
      ${heroSection}`
  }

  /* -- Brief -- */
  if (type === 'caseStudyBrief') {
    const supp = b.narrativeSub ? lexToHtml(b.narrativeSub) : ''
    const headingText = b.heading ? esc(String(b.heading)) : 'The brief'
    const meta = `
      <div class="brief-meta">
        ${b.eyebrow ? `<p class="cs-label">${esc(String(b.eyebrow))}</p>` : ''}
        <h2 class="brief-heading">${headingText}</h2>
      </div>`
    const bodyHtml = lexToHtml(b.narrativeBody) || '<p style="opacity:.48">Frame the core design challenge here -- what constraint changed, who the user or customer was, and what your design needed to prove.</p>'
    return `
      <section class="st-card st-brief">
        <div class="brief-centre">
          ${meta}
          ${bodyHtml}
          ${supp}
        </div>
      </section>`
  }

  /* -- Scope -- */
  if (type === 'caseStudyScope') {
    const rawFacts = Array.isArray(b.facts) && b.facts.length > 0
      ? (b.facts as Content[])
      : [{ label: 'Where', value: '' }, { label: 'When', value: '' }, { label: 'My role', value: '' }]
    const facts = rawFacts.map(f => {
      const lbl = text(f.label || 'Label')
      const val = f.value ? text(f.value) : `<span style="opacity:.45">[Enter ${esc(String(f.label || 'value'))}]</span>`
      return `<div class="scope-item"><div class="scope-key">${lbl}</div><div class="scope-val">${val}</div></div>`
    }).join('')
    const sketchUrl = asset(b.sketch)
    const sketch = sketchUrl
      ? `<figure class="scope-sketch"><img src="${esc(sketchUrl)}" alt="${esc(b.sketchAlt)}"></figure>`
      : `<div style="padding:32px 0 48px">${bpSlot('Optional Scope Sketch / System Architecture Diagram', '16:9 or 21:9 Diagram  |  12px Radius  |  object-fit: contain', '180px', true)}</div>`
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

  /* -- Editorial -- */
  if (type === 'caseStudyEditorial') {
    const imgUrl = asset(b.image)
    const fig = imgUrl
      ? `<figure class="cs-context-figure"><img src="${esc(imgUrl)}" alt="${esc(b.imageAlt)}"><figcaption class="cs-context-caption">${text(b.caption)}</figcaption></figure>`
      : ''
    const eyebrowHtml = b.eyebrow ? text(b.eyebrow) : '<span style="opacity:.5">01 / Section</span>'
    const headingHtml = b.heading ? text(b.heading) : '<span style="opacity:.48">Editorial Section Heading</span>'
    const bodyHtml = lexToHtml(b.editorialBody) || '<p style="opacity:.5">Write your narrative paragraph here (Manrope 16px, 65ch comfortable reading measure).</p>'
    return `
      <div class="section container" style="margin-top:40px">
        <div class="cs-context-layout">
          <div class="cs-context-margin">
            <p class="cs-label">${eyebrowHtml}</p>
          </div>
          <div class="cs-context-main">
            <h3 class="cs-h3">${headingHtml}</h3>
            <div class="cs-body">${bodyHtml}</div>
          </div>
        </div>
        ${fig}
      </div>`
  }

  /* -- Full-width figure -- */
  if (type === 'fullWidthFigure') {
    const src = asset(b.image)
    if (!src) return `<div class="section container" style="margin-top:40px">${bpSlot(String(b.captionLabel || 'Full-Width Figure'), '1080px Full Width  |  max-height: 480px  |  object-fit: contain (no cropping)', '320px')}</div>`
    const blur = b.background === 'blur'
    return `
      <figure class="cs-context-figure" style="position:relative;margin:40px 0">
        ${blur ? `<img aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:blur(12px);opacity:.4;pointer-events:none" src="${esc(src)}" alt="">` : ''}
        <img src="${esc(src)}" alt="${esc(b.alt)}" style="position:relative">
        <figcaption class="cs-context-caption"><strong>${esc(b.captionLabel)}</strong> ${esc(b.caption)}</figcaption>
      </figure>`
  }

  /* -- Typed bento grids (enforced cell count) -- */
  const TYPED_BENTO_CLASS: Record<string, string> = {
    bentoTwoUp:   'cs-bento--2',
    bentoThreeA:  'cs-bento--3a',
    bentoThreeB:  'cs-bento--3b',
    bentoFourUp:  'cs-bento--4',
  }
  if (type in TYPED_BENTO_CLASS) {
    const cells = Array.isArray(b.cells) ? (b.cells as Content[]) : []
    const layoutClass = TYPED_BENTO_CLASS[type]
    const cellsHtml = cells.map((cell, i) => {
      const imgUrl = asset(cell.image)
      if (!imgUrl) return `<div class="cs-bento-cell">${bpSlot(`Bento Cell ${i + 1}`, '240px Row Height  |  24px Radius  |  object-fit: cover', '100%')}</div>`
      const cap = cell.caption ? `<div class="cs-bento-caption">${esc(String(cell.caption))}</div>` : ''
      return `<div class="cs-bento-cell" data-bento-index="${i}">
        <img src="${esc(imgUrl)}" alt="${esc(String(cell.altText || ''))}" loading="lazy">
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
        ${b.eyebrow  ? `<p class="cs-label">${esc(String(b.eyebrow))}</p>` : ''}
        ${b.title    ? `<h3 class="cs-bento-title">${esc(String(b.title))}</h3>` : ''}
        ${b.subtitle ? `<p class="cs-bento-subtitle">${esc(String(b.subtitle))}</p>` : ''}
      </div>` : ''
    return `
      <div class="section container" style="margin-top:40px">
        ${hdr}
        <div class="cs-bento ${layoutClass}" data-bento>
          ${cellsHtml}
        </div>
      </div>`
  }

  /* -- Bento grid (legacy caseBento) -- */
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
      if (!imgUrl) return `<div class="cs-bento-cell">${bpSlot(`Bento Cell ${i + 1}`, '240px Row Height  |  24px Radius  |  object-fit: cover', '100%')}</div>`
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
    if (!beforeUrl || !afterUrl) return `<div class="section container" style="margin-top:40px">${bpSlot('Before / After Comparison Slider', 'Upload both Before Image & After Image  |  480px Height  |  16:10 or 16:9  |  object-fit: cover', '340px')}</div>`
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
    const hotspots  = Array.isArray(b.hotspots) ? (b.hotspots as Content[]) : []
    const cap       = b.caption ? `<figcaption class="am-caption">${esc(String(b.caption))}</figcaption>` : ''

    const dots = hotspots.map((hs, i) => {
      const n = hs.number != null ? Number(hs.number) : i + 1
      const x = Math.max(0, Math.min(100, Number(hs.x ?? 50)))
      const y = Math.max(0, Math.min(100, Number(hs.y ?? 50)))
      return `<button type="button" class="am-dot" style="left:${x}%;top:${y}%" aria-label="Hotspot ${n}">${n}</button>`
    }).join('\n          ')

    const panels = hotspots.map((hs, i) => {
      const n = hs.number != null ? Number(hs.number) : i + 1
      const heading = `<p class="am-panel-heading">${esc(String(hs.heading || `Callout 0${n}`))}</p>`
      const body    = `<p class="am-panel-body">${esc(String(hs.body || 'Click hotspot dot to inspect annotation details.'))}</p>`
      return `<div class="am-panel" role="tooltip">${heading}${body}</div>`
    }).join('\n          ')

    const stageMedia = imgUrl
      ? `<img class="am-image" src="${esc(imgUrl)}" alt="${esc(String(b.altText || ''))}" loading="lazy">`
      : bpSlot('Annotated Media Stage (Live Hotspots Active)', 'Full-Width Uncropped Image (object-fit: contain) + Numbered X%/Y% Hotspot Callouts', '340px')

    return `
      <div class="section container" style="margin-top:40px">
        <figure class="am-figure">
          <div class="am-stage" data-am style="position:relative">
            ${stageMedia}
            ${dots}
            ${panels}
          </div>
          ${cap}
        </figure>
      </div>`
  }

  /* -- Pullquote -- */
  if (type === 'pullquote') {
    const quoteHtml = lexToHtml(b.quote) || '<p style="opacity:.55">"Highlight a key user insight, stakeholder quote, or design principle here."</p>'
    const variant  = String(b.variant || 'light')
    const varClass = variant === 'dark' ? 'pq-card--dark' : 'pq-card--light'
    const attr     = b.attribution ? `<p class="pq-attr">${esc(String(b.attribution))}</p>` : '<p class="pq-attr" style="opacity:.5">Attribution  -  Role / Context</p>'
    return `
      <div class="section container">
        <div class="pq-card ${varClass}">
          <div class="pq-quote">${quoteHtml}</div>
          ${attr}
        </div>
      </div>`
  }

  /* -- Slide layout -- */
  if (type === 'slideLayout') {
    const imgUrl   = asset(b.image)
    const variant  = String(b.variant || 'light')
    const varClass = variant === 'dark' ? 'sk-slide--dark' : 'sk-slide--light'
    const isDark   = variant === 'dark'
    const eyebrow  = `<p class="cs-label">${esc(String(b.eyebrow || '01 / Slide'))}</p>`
    const heading  = esc(String(b.heading || 'Slide Headline (40% Left Column)'))
    const body     = b.body ? `<div class="cs-body">${lexToHtml(b.body)}</div>` : '<div class="cs-body"><p style="opacity:.55">Concise slide narrative paired with a 60% visual column on the right.</p></div>'
    const mediaHtml = imgUrl
      ? `<img src="${esc(imgUrl)}" alt="${esc(String(b.altText || ''))}" loading="lazy">`
      : bpSlot('Slide Image (60% Right Column)', '16:10 or 4:3  |  min-height: 500px  |  object-fit: cover', '100%', isDark)
    return `
      <div class="section container">
        <div class="sk-slide ${varClass}">
          <div class="sk-slide-text">
            ${eyebrow}
            <h3 class="sk-slide-heading">${heading}</h3>
            ${body}
          </div>
          <div class="sk-slide-image" style="${imgUrl ? '' : 'padding:24px'}">
            ${mediaHtml}
          </div>
        </div>
      </div>`
  }

  /* -- Media group -- */
  if (type === 'caseStudyMediaGroup') {
    const items = Array.isArray(b.images) ? (b.images as Content[]) : []
    const mode = String(b.presentation || (b.layoutStyle === 'grid' ? 'adaptive' : 'tooltip'))
    const variant = String(b.gridVariant || 'two')
    const show = (v: unknown, fallback = false) => typeof v === 'boolean' ? v : fallback
    const resolvedItems = (items.length > 0 ? items : [
      { title: 'Artefact 01', caption: 'Upload image in left panel to populate this slot', annotations: [{ number: 1, x: 50, y: 50, heading: 'Sample Hotspot', body: 'Adjust X% and Y% in the left panel to move this callout.' }] },
      { title: 'Artefact 02', caption: 'Second media slot in group' },
    ]).map((im) => {
      const url = asset(im.media) || String(im.sourceUrl || '')
      const hasUrl = url.startsWith('https://') || url.startsWith('/')
      return { ...im, resolvedUrl: hasUrl ? url : '' }
    }) as (Content & { resolvedUrl: string })[]
    const validItems = resolvedItems.filter(im => Boolean(im.resolvedUrl))

    if (mode === 'tooltip') {
      if (validItems.length > 0) {
        const firstUrl = validItems[0].resolvedUrl
        const firstCap = String(validItems[0].caption || validItems[0].title || validItems[0].alt || '')
        const totalStr = String(validItems.length).padStart(2, '0')
        const tipImages = validItems.map((im, i) => {
          const cap = String(im.caption || im.title || im.alt || '')
          return `<img class="peg-tooltip__img${i === 0 ? ' peg-tooltip__img--current' : ''}" src="${esc(im.resolvedUrl)}" alt="${esc(im.alt || cap)}" data-cap="${esc(cap)}" data-idx="${i}" loading="lazy">`
        }).join('')
        const navThumbs = validItems.map((im, i) => {
          const cap = String(im.caption || im.title || im.alt || '')
          return `<button type="button" class="peg-nav__item${i === 0 ? ' peg-nav__item--selected' : ''}" data-nav-idx="${i}" aria-label="Select image ${i + 1}: ${esc(cap)}"><img class="peg-nav__img" src="${esc(im.resolvedUrl)}" alt="${esc(im.alt || cap)}" loading="lazy"></button>`
        }).join('')
        const itemPills = validItems.slice(0, 6).map((im, i) => {
          const label = String(im.title || im.caption || im.imageName || `Artefact ${i + 1}`)
          return `<span class="peg-pill">${esc(label.length > 42 ? label.slice(0, 40) + '...' : label)}</span>`
        }).join('')
        return `
          <div class="section container" style="margin-top:40px">
            <div class="peg-content" data-peg>
              <div class="peg-pretitle">
                <p class="cs-label">${esc(b.sectionKey || '01 / Evidence')}</p>
              </div>
              <div class="peg-text">
                <h3 class="cs-h3">${esc(b.sectionHeading || 'Evidence & Tooltip Gallery')}</h3>
                <div class="peg-pills">${itemPills}</div>
                <button type="button" class="peg-trigger" data-peg-trigger>
                  <span class="peg-trigger__dot"></span>
                  <span>Hover to preview  -  Click to explore all ${validItems.length} artefacts -></span>
                </button>
              </div>
              <div class="peg-tooltip" data-peg-tooltip aria-live="polite">
                <div class="peg-tooltip__img-wrap" data-peg-tooltip-wrap>
                  ${tipImages}
                </div>
                <div class="peg-tooltip__meta">
                  <span class="peg-tooltip__counter" data-peg-counter>01 / ${totalStr}</span>
                  <span class="peg-tooltip__cap" data-peg-tip-cap>${esc(firstCap)}</span>
                  <span class="peg-tooltip__cta">View all ${validItems.length} -></span>
                </div>
              </div>
              <div class="peg-gallery" data-peg-gallery role="dialog" aria-label="Evidence Gallery">
                <div class="peg-gallery__bg" aria-hidden="true"><img src="${esc(firstUrl)}" alt=""></div>
                <div class="peg-gallery__stage" data-peg-stage title="Click image to toggle fullscreen"></div>
                <div class="peg-gallery__scrim"></div>
                <div class="peg-gallery__title">
                  <span class="peg-gallery__counter" data-peg-gal-counter>01 / ${totalStr}</span>
                  <p class="peg-gallery__caption" data-peg-gal-cap>${esc(firstCap)}</p>
                </div>
                <div class="peg-gallery__controls">
                  <button type="button" class="peg-ctrl-btn" data-peg-prev aria-label="Previous image">&larr;</button>
                  <button type="button" class="peg-ctrl-btn" data-peg-next aria-label="Next image">&rarr;</button>
                  <button type="button" class="peg-ctrl-btn peg-ctrl-close" data-peg-close aria-label="Close gallery">&times;</button>
                </div>
              </div>
              <div class="peg-nav" data-peg-nav>
                ${navThumbs}
              </div>
            </div>
          </div>`
      }
      // Wireframe for Tooltip mode when no images uploaded yet
      const wfPills = resolvedItems.slice(0, 6).map((im, i) => {
        const label = String(im.title || im.caption || im.imageName || `Artefact 0${i + 1}`)
        return `<span class="peg-pill">${esc(label.length > 42 ? label.slice(0, 40) + '...' : label)}</span>`
      }).join('')
      return `
        <div class="section container" style="margin-top:40px">
          <div class="peg-content peg-hover">
            <div class="peg-pretitle">
              <p class="cs-label">${esc(b.sectionKey || '01 / Evidence')}</p>
            </div>
            <div class="peg-text">
              <h3 class="cs-h3">${esc(b.sectionHeading || 'Tooltip / Evidence Gallery (Wireframe)')}</h3>
              <div class="peg-pills">${wfPills}</div>
              <button type="button" class="peg-trigger">
                <span class="peg-trigger__dot"></span>
                <span>Hover to cycle preview  -  Click to expand GSAP Flip gallery -></span>
              </button>
            </div>
            <div class="peg-tooltip" style="opacity:1;transform:none;pointer-events:auto">
              <div style="padding:12px">
                ${bpSlot('Stationary Hover Tooltip (320x220px)', '16:10 or 4:3  |  Cycles on hover -> Click flips to full gallery (contain)', '180px')}
              </div>
              <div class="peg-tooltip__meta">
                <span class="peg-tooltip__counter">01 / 0${resolvedItems.length}</span>
                <span class="peg-tooltip__cap">${esc(String(resolvedItems[0]?.caption || 'Upload images in left panel'))}</span>
                <span class="peg-tooltip__cta">View all -></span>
              </div>
            </div>
          </div>
        </div>`
    }

    const hdrHtml = show(b.showSectionHeading, true)
      ? `<div class="cs-context-layout" style="margin-bottom:24px"><div class="cs-context-margin"><p class="cs-label">${esc(b.sectionKey || mode)}</p></div><div class="cs-context-main"><h3 class="cs-h3">${esc(b.sectionHeading || `${mode.charAt(0).toUpperCase() + mode.slice(1)} Media Section`)}</h3></div></div>`
      : ''

    if (mode === 'slides') {
      const slidesHtml = resolvedItems.map((im, i) => {
        const isDark = String(b.appearance || 'inherit') === 'dark'
        const alignImgLeft = String(b.slideAlignment || 'textLeft') === 'imageLeft'
        const slideStyle = alignImgLeft ? 'grid-template-columns:3fr 2fr' : ''
        const textCol = `<div class="sk-slide-text"><p class="cs-label">${esc(im.eyebrow || `0${i + 1}`)}</p><h3 class="sk-slide-heading">${esc(im.title || im.caption || b.sectionHeading || `Slide 0${i + 1}`)}</h3><div class="cs-body"><p>${text(im.description || im.caption || '40% text column paired with 60% visual column.')}</p></div></div>`
        const imgCol = im.resolvedUrl
          ? `<div class="sk-slide-image"><img src="${esc(im.resolvedUrl)}" alt="${esc(im.alt || im.caption || '')}" loading="lazy"></div>`
          : `<div class="sk-slide-image" style="padding:24px">${bpSlot(`Slide 0${i + 1} Visual (60% Column)`, '16:10 or 4:3  |  min-height: 500px  |  object-fit: cover', '100%', isDark)}</div>`
        return `<div class="sk-slide ${isDark ? 'sk-slide--dark' : 'sk-slide--light'}" style="margin-bottom:24px;${slideStyle}">${alignImgLeft ? imgCol + textCol : textCol + imgCol}</div>`
      }).join('')
      return `<div class="section container" style="margin-top:40px">${hdrHtml}${slidesHtml}</div>`
    }

    if (mode === 'evolution') {
      const evoItems = items.length >= 2 ? resolvedItems : [
        ...resolvedItems,
        { title: 'Step 03 / Final Form', caption: 'Add images to compare progression steps', resolvedUrl: '' },
      ]
      const stepsHtml = evoItems.map((im, i) => `
        <div class="evo-step">
          <div class="evo-step__header">
            <span class="evo-step__num">0${i + 1}</span>
            <span class="evo-step__line"></span>
          </div>
          <figure class="research-figure">
            <div class="research-figure-window" style="height:260px">
              ${im.resolvedUrl
                ? `<img loading="lazy" src="${esc(im.resolvedUrl)}" alt="${esc(im.alt || im.caption || '')}">`
                : bpSlot(`Evolution Step 0${i + 1}`, '260px Height  |  object-fit: contain (no cropping)', '100%')}
            </div>
            <figcaption class="research-figure-caption">
              <span class="research-figure-caption-text">
                <h3>${esc(im.title || `Step 0${i + 1}`)}</h3>
                <p class="asset-caption">${esc(im.caption || 'Step progression description')}</p>
              </span>
            </figcaption>
          </figure>
        </div>`).join('')
      return `<div class="section container" style="margin-top:40px">${hdrHtml}<div class="evo-grid">${stepsHtml}</div></div>`
    }

    const entries = resolvedItems.map((im, i) => {
      const visible = (field: string, fallback = false) => show(im['show' + field], fallback)
      const eyebrow = visible('Eyebrow') && im.eyebrow ? `<div class="asset-eyebrow">${esc(im.eyebrow)}</div>` : ''
      const title   = visible('Title')   && im.title   ? `<h3>${esc(im.title)}</h3>` : ''
      const caption = visible('Caption', true) ? `<p class="asset-caption">${esc(im.caption || (im.resolvedUrl ? '' : 'Caption / description updates here live'))}</p>` : ''
      const desc    = visible('Description') && im.description ? `<p class="cs-body" style="font-size:14px">${text(im.description)}</p>` : ''
      const credit  = visible('Credit') && im.credit ? `<small style="opacity:.6">${esc(im.credit)}</small>` : ''
      const number  = show(b.showNumbers) ? `<span class="research-figure-index">${i + 1}.</span>` : ''
      const annotations = Array.isArray(im.annotations) ? (im.annotations as Content[]) : []
      const dots = mode === 'annotated' ? annotations.map((a, aIdx) => {
        const num = a.number != null && a.number !== '' ? a.number : aIdx + 1
        const x = Math.max(0, Math.min(100, Number(a.x ?? 50)))
        const y = Math.max(0, Math.min(100, Number(a.y ?? 50)))
        return `<span class="annotation-dot" style="left:${x}%;top:${y}%" title="${esc(a.heading || a.body || `Hotspot ${num}`)}">${esc(num)}</span>`
      }).join('') : ''
      const legend = (mode === 'annotated' && annotations.length > 0)
        ? `<ol style="font-size:13px;padding-left:16px;margin-top:8px">${annotations.map((a, aIdx) => {
            const num = a.number != null && a.number !== '' ? a.number : aIdx + 1
            return `<li><strong>${esc(num)}. ${esc(a.heading || `Annotation 0${aIdx + 1}`)}</strong> ${esc(a.body || '(Type heading & body in left panel)')}</li>`
          }).join('')}</ol>`
        : ''
      const windowContent = im.resolvedUrl
        ? `<a href="${esc(im.resolvedUrl)}" target="_blank" rel="noopener noreferrer"><img loading="lazy" src="${esc(im.resolvedUrl)}" alt="${esc(im.alt || '')}"></a>`
        : bpSlot(
            mode === 'annotated'
              ? `Annotated Image 0${i + 1} (Live Hotspot Dots Active)`
              : mode === 'figures'
                ? `Full-Width Figure 0${i + 1} (1080px)`
                : `Adaptive Grid Cell 0${i + 1} (${variant})`,
            mode === 'annotated'
              ? 'Uncropped Diagram (object-fit: contain) + Live X%/Y% Hotspot Dots'
              : '400px Figure Window  |  16:10 or 4:3  |  object-fit: contain',
            '100%'
          )
      return `
        <figure class="research-figure">
          <div class="research-figure-window research-figure-window--mid" style="position:relative">
            ${windowContent}
            ${dots}
          </div>
          <figcaption class="research-figure-caption">
            ${number}
            <span class="research-figure-caption-text">${eyebrow}${title}${caption}${desc}${credit}${legend}</span>
          </figcaption>
        </figure>`
    }).join('')

    const gridCols = variant === 'three' ? 'repeat(3,minmax(0,1fr))' : variant === 'traditional' ? 'repeat(4,minmax(0,1fr))' : variant === 'asymmetric' ? '3fr 2fr' : 'repeat(2,minmax(0,1fr))'
    const gridStyle = mode === 'adaptive'
      ? `display:grid;grid-template-columns:${gridCols};gap:16px`
      : 'display:block'
    return `
      <div class="section container" style="margin-top:40px">
        ${hdrHtml}
        <div class="research-figures" style="${gridStyle}">${entries}</div>
      </div>`
  }

  return ''
}

function buildVisualShowcaseHtml(
  doc: Record<string, unknown> | undefined,
  pageTitle: string,
  slides: Content[],
  layout: Content[],
  extraBlocksHtml: string
): string {
  type StripFrame = {
    url: string
    eyebrow?: string
    title?: string
    caption?: string
    alt?: string
    painterIdx?: number
    ratioClass?: string
  }
  const uploaded: StripFrame[] = []
  const seenUrls = new Set<string>()
  const pushFrame = (f: StripFrame) => {
    if (!f.url || seenUrls.has(f.url)) return
    seenUrls.add(f.url)
    uploaded.push(f)
  }

  for (const s of slides) {
    const u = asset(s.image)
    if (u) {
      pushFrame({
        url: u,
        eyebrow: s.eyebrow ? String(s.eyebrow) : undefined,
        title: s.heading ? String(s.heading) : undefined,
        caption: s.body ? String(s.body) : undefined,
        alt: String(s.imageAlt || s.heading || ''),
      })
    }
  }

  let heroBlock: Content | undefined
  for (const b of layout) {
    const t = String(b.blockType ?? '')
    if (t === 'caseStudyHero') {
      heroBlock = b
      const u = asset(b.heroImage)
      if (u) {
        pushFrame({
          url: u,
          eyebrow: b.eyebrow ? String(b.eyebrow) : undefined,
          title: b.title ? String(b.title) : undefined,
          alt: String(b.heroAlt || b.title || ''),
        })
      }
    } else if (t === 'fullWidthFigure') {
      const u = asset(b.image)
      if (u) {
        pushFrame({
          url: u,
          eyebrow: b.captionLabel ? String(b.captionLabel) : undefined,
          title: b.caption ? String(b.caption) : undefined,
          alt: String(b.alt || b.caption || ''),
        })
      }
    } else if (t === 'mediaSection' && Array.isArray(b.images)) {
      for (const im of b.images as Content[]) {
        const u = asset(im.media)
        if (u) {
          pushFrame({
            url: u,
            eyebrow: im.eyebrow ? String(im.eyebrow) : undefined,
            title: im.title ? String(im.title) : undefined,
            caption: im.caption ? String(im.caption) : undefined,
            alt: String(im.alt || im.title || ''),
          })
        }
      }
    }
  }

  const rawDocTitle = doc?.title ? String(doc.title).trim() : ''
  const sidebarTitle = rawDocTitle || pageTitle || 'Visual Showcase'

  const blueprintMeta = [
    { painterIdx: 0, ratioClass: 'vs-frame-16-9', label: '01 / Hero Deliverable (16:9)' },
    { painterIdx: 1, ratioClass: 'vs-frame-16-9', label: '02 / Brand Identity System (16:9)' },
    { painterIdx: 2, ratioClass: 'vs-frame-4-3',  label: '03 / Desktop Interface Mockup (4:3)' },
    { painterIdx: 3, ratioClass: 'vs-frame-16-9', label: '04 / Environmental Poster (16:9)' },
    { painterIdx: 4, ratioClass: 'vs-frame-3-2',  label: '05 / Editorial Print Frame (3:2)' },
    { painterIdx: 5, ratioClass: 'vs-frame-16-9', label: '06 / Social Grid System (16:9)' },
    { painterIdx: 6, ratioClass: 'vs-frame-16-9', label: '07 / Digital Screen Display (16:9)' },
  ]

  const frames: StripFrame[] = [...uploaded]
  if (frames.length === 0) {
    for (const bp of blueprintMeta) {
      frames.push({ url: '', painterIdx: bp.painterIdx, ratioClass: bp.ratioClass, title: bp.label })
    }
  } else if (frames.length < 4) {
    for (let i = frames.length; i < 5; i++) {
      const bp = blueprintMeta[i] || blueprintMeta[1]
      frames.push({ url: '', painterIdx: bp.painterIdx, ratioClass: bp.ratioClass, title: bp.label })
    }
  }

  const totalStr = String(frames.length).padStart(2, '0')
  const mainCardsHtml = frames.map((f, i) => {
    const mediaEl = f.url
      ? `<img class="vs-frame-img" src="${esc(f.url)}" alt="${esc(f.alt || f.title || `Frame ${i + 1}`)}" loading="${i < 2 ? 'eager' : 'lazy'}">`
      : `<canvas class="vs-frame ${f.ratioClass || 'vs-frame-16-9'}" data-vs-canvas="${f.painterIdx ?? (i % 7)}" id="vs-c-${i}"></canvas>
         <span class="vs-bp-pill">${esc(f.title || `Blueprint Frame 0${i + 1}`)}  -  Add image in left panel</span>`
    return `
      <section class="vs-card" data-vs-sec="${i}" id="vs-s${i}">
        ${mediaEl}
      </section>`
  }).join('')

  const thumbsHtml = frames.map((f, i) => {
    const thumbMedia = f.url
      ? `<img src="${esc(f.url)}" alt="${esc(f.alt || `Thumb ${i + 1}`)}" loading="lazy">`
      : `<canvas data-vs-thumb-canvas="${f.painterIdx ?? (i % 7)}" id="vs-t-${i}"></canvas>`
    return `<div class="vs-thumb${i === 0 ? ' active' : ''}" data-vs-for="${i}" title="Frame ${String(i + 1).padStart(2, '0')}">${thumbMedia}</div>`
  }).join('')

  return `
    <div class="vs-shell" id="vs-shell" data-vs-shell>
      <main class="vs-main" id="vs-main">
        <div class="vs-strip" id="vs-strip">
          ${mainCardsHtml}
        </div>
        ${extraBlocksHtml ? `<div class="vs-extra-blocks">${extraBlocksHtml}</div>` : ''}
      </main>
      <aside class="vs-sidebar" aria-label="Continuous Image Strip Navigator">
        <div class="vs-sidebar-label">${esc(sidebarTitle.toUpperCase())}</div>
        <div class="vs-sidebar-sub">
          <span id="vs-active-count">01 / ${totalStr}</span>
          <span>Scroll / Scrub</span>
        </div>
        <div class="vs-thumbs-wrap" id="vs-thumbs-wrap">
          <div class="vs-thumbs" id="vs-thumbs">
            ${thumbsHtml}
          </div>
          <div class="vs-slider-box" id="vs-slider-box" aria-hidden="true"></div>
        </div>
      </aside>
    </div>`
}

function buildPageBody(doc: Record<string, unknown> | undefined, slug: string, tplParam?: string | null) {
  const docSlides = Array.isArray(doc?.slides) ? (doc?.slides as Content[]) : []
  const rawTpl = String(tplParam || doc?.template || (slug === 'haptix' ? 'narrative-slides' : 'narrative'))
  const activeTemplate = (rawTpl === 'narrative' && docSlides.length > 0) ? 'narrative-slides' : rawTpl
  const rawLayout = (Array.isArray(doc?.layout) ? (doc?.layout as Content[]) : undefined) ?? (activeTemplate === 'visual-showcase' ? [] : (sample[slug]?.layout ?? sample.centronic.layout)) ?? []
  const filteredLayout = activeTemplate === 'visual-showcase'
    ? rawLayout.filter(b => b.blockType !== 'caseStudyBrief' && b.blockType !== 'caseStudyScope')
    : rawLayout
  const page: CasePage = {
    title: doc?.title ? String(doc.title) : (slug === '_new' ? 'New Case Study' : slug),
    template: activeTemplate,
    slides: docSlides,
    layout: filteredLayout,
  }
  const isSample = !doc

  if (activeTemplate === 'visual-showcase') {
    const nonHeroBlocks = filteredLayout.filter(b => b.blockType !== 'caseStudyHero')
    const extraBlocksHtml = nonHeroBlocks.map(b => render(b)).join('')
    const body = buildVisualShowcaseHtml(doc, page.title, docSlides, filteredLayout, extraBlocksHtml)
    return { page, isSample, activeTemplate, body }
  }

  const hasUserSlides = docSlides.length > 0
  const defaultTab = hasUserSlides ? 'slides' : 'case'
  const slidesList = hasUserSlides ? docSlides : [
    { variant: 'light', eyebrow: 'Slide 01 / Blueprint', heading: 'Presentation Slide (Light Variant)', body: '40% editorial text on the left, 60% full-bleed visual on the right (16:10 or 4:3, object-fit: cover).' },
    { variant: 'dark',  eyebrow: 'Slide 02 / Blueprint', heading: 'Presentation Slide (Dark Variant)',  body: 'Add slides in the "Presentation Slides Deck" array on the left to populate this interactive deck.' },
  ]
  const slidesDeckHtml = activeTemplate === 'narrative-slides' ? `
    <div class="sk-switch-bar" id="switch" data-default-tab="${defaultTab}">
      <div class="container sk-switch-inner">
        <span class="sk-switch-label">Format: Narrative + Presentation Deck</span>
        <div class="sk-switch-tabs" role="tablist">
          <button type="button" class="sk-switch-tab${defaultTab === 'case' ? ' active' : ''}" data-switch-target="case" role="tab" aria-selected="${defaultTab === 'case' ? 'true' : 'false'}">Case study</button>
          <button type="button" class="sk-switch-tab${defaultTab === 'slides' ? ' active' : ''}" data-switch-target="slides" role="tab" aria-selected="${defaultTab === 'slides' ? 'true' : 'false'}">Slides (${slidesList.length})</button>
        </div>
      </div>
    </div>
    <section id="p-slides" class="container" style="display:${defaultTab === 'slides' ? 'block' : 'none'};padding:48px var(--col-pad)">
      <div class="sk-deck" data-deck>
        ${slidesList.map((s, idx) => {
          const sUrl = asset(s.image)
          const isDark = String(s.variant || 'light') === 'dark'
          return `<div class="sk-deck-slide${idx === 0 ? ' active' : ''}" data-deck-slide="${idx}">
            <div class="sk-slide ${isDark ? 'sk-slide--dark' : 'sk-slide--light'}">
              <div class="sk-slide-text">
                ${s.eyebrow ? `<p class="cs-label">${esc(String(s.eyebrow))}</p>` : `<p class="cs-label">Slide 0${idx + 1}</p>`}
                <h3 class="sk-slide-heading">${esc(String(s.heading || `Slide ${idx + 1}`))}</h3>
                ${s.body ? `<div class="cs-body"><p>${text(s.body)}</p></div>` : '<div class="cs-body"><p style="opacity:.55">Type slide body copy in the left panel (40% text column).</p></div>'}
              </div>
              <div class="sk-slide-image" style="${sUrl ? '' : 'padding:24px'}">
                ${sUrl ? `<img src="${esc(sUrl)}" alt="${esc(String(s.imageAlt || s.heading || ''))}" loading="lazy">` : bpSlot(`Slide 0${idx + 1} Visual (60% Column)`, '16:10 or 4:3  |  min-height: 500px  |  object-fit: cover', '100%', isDark)}
              </div>
            </div>
          </div>`
        }).join('')}
        <div class="sk-deck-bar">
          <button type="button" class="preview-refresh sk-deck-btn" data-deck-prev>&larr; Previous slide</button>
          <span class="sk-deck-count" data-deck-count>01 / ${String(slidesList.length).padStart(2, '0')}</span>
          <button type="button" class="preview-refresh sk-deck-btn" data-deck-next>Next slide &rarr;</button>
        </div>
      </div>
    </section>` : ''
  const caseDisplay = (activeTemplate === 'narrative-slides' && defaultTab === 'slides') ? 'style="display:none"' : ''
  const body = slidesDeckHtml + `<div id="p-case" ${caseDisplay}>` + (page.layout ?? []).map(b => render(b)).join('') + `</div>`
  return { page, isSample, activeTemplate, body }
}

const MEDIA_KEYS = new Set(['media', 'image', 'heroImage', 'sketch', 'beforeImage', 'afterImage', 'coverImage'])
function collectMediaIds(node: unknown, out: Set<number>) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) collectMediaIds(item, out)
    return
  }
  const obj = node as Record<string, unknown>
  for (const [k, v] of Object.entries(obj)) {
    if (MEDIA_KEYS.has(k) && (typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v)))) {
      out.add(Number(v))
    } else if (v && typeof v === 'object') {
      collectMediaIds(v, out)
    }
  }
}
function hydrateMediaIds(node: unknown, map: Map<number, Content>) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const item of node) hydrateMediaIds(item, map)
    return
  }
  const obj = node as Record<string, unknown>
  for (const [k, v] of Object.entries(obj)) {
    if (MEDIA_KEYS.has(k) && (typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v)))) {
      const m = map.get(Number(v))
      if (m) obj[k] = m
    } else if (v && typeof v === 'object') {
      hydrateMediaIds(v, map)
    }
  }
}

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params
    const reqUrl = new URL(req.url)
    const tplParam = reqUrl.searchParams.get('template')
    const json = (await req.json()) as { data?: Record<string, unknown> }
    const data = json?.data ?? {}
    const mediaIds = new Set<number>()
    collectMediaIds(data, mediaIds)
    if (mediaIds.size > 0) {
      const payload = await getPayload({ config })
      const mediaRes = await payload.find({
        collection: 'media',
        where: { id: { in: Array.from(mediaIds) } },
        limit: 200,
        depth: 0,
        overrideAccess: true,
      })
      const mediaMap = new Map<number, Content>()
      for (const m of mediaRes.docs) {
        mediaMap.set(Number(m.id), m as unknown as Content)
      }
      hydrateMediaIds(data, mediaMap)
    }
    const { page, activeTemplate, body } = buildPageBody(data, slug, String(data.template || tplParam || ''))
    return Response.json({ title: page.title, activeTemplate, bodyHtml: body })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 400 })
  }
}

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const reqUrl   = new URL(req.url)
  const tplParam = reqUrl.searchParams.get('template')
  const idParam  = reqUrl.searchParams.get('id')
  const colParam = reqUrl.searchParams.get('collection')

  const payload = await getPayload({ config })
  let doc: Record<string, unknown> | undefined
  if (idParam && /^\d+$/.test(idParam)) {
    const targetCol = colParam === 'articles' ? 'articles' : 'case-studies'
    try {
      const found = await payload.findByID({ collection: targetCol, id: Number(idParam), depth: 1, draft: true, overrideAccess: true })
      if (found) doc = found as unknown as Record<string, unknown>
    } catch {
      // Fall back to slug lookup below
    }
  }
  if (!doc) {
    const csRes   = await payload.find({ collection: 'case-studies', where: { slug: { equals: slug } }, depth: 1, limit: 1, draft: true, overrideAccess: true })
    const artRes  = csRes.docs.length ? csRes : await payload.find({ collection: 'articles', where: { slug: { equals: slug } }, depth: 1, limit: 1, draft: true, overrideAccess: true })
    const result  = artRes.docs.length ? artRes : await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, depth: 1, limit: 1, draft: true, overrideAccess: true })
    doc = result.docs[0] as (Record<string, unknown> | undefined)
  }
  const { page, isSample, body } = buildPageBody(doc, slug, String(doc?.template || tplParam || ''))

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}  - CMS Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600&display=swap">
  <style>
    /* -- SK Design System tokens (inlined -- no public/ in payload-app) -- */
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
    /* -- Reset + base -- */
    *{box-sizing:border-box;margin:0;padding:0}
    html{overflow-x:hidden}
    body{background:var(--bg);color:var(--ink);font-family:var(--font-sans);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
    a{color:var(--sun);text-decoration:none}
    a:hover{text-decoration:underline}

    /* -- Container -- */
    .container{max-width:var(--page-w);margin:0 auto;padding:0 var(--col-pad)}

    /* -- Preview bar -- */
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

    /* -- Hero meta -- */
    .hero-tag{display:inline-block;font-size:12px;font-weight:400;color:var(--ink-2);background:rgba(17,17,16,0.06);border-radius:20px;padding:3px 10px}
    .hero-dot{width:3px;height:3px;border-radius:50%;background:var(--rule);flex-shrink:0}
    .hero-section{padding:var(--sp-20) 0 var(--sp-16);text-align:center;max-width:100%}
    .hero-scroll-meta{display:flex;align-items:center;justify-content:center;gap:var(--sp-5);margin-bottom:var(--sp-6);flex-wrap:wrap}
    .hero-scroll-text{font-family:var(--font-display);font-size:clamp(36px,5.5vw,76px);font-weight:400;line-height:1.1;letter-spacing:-.02em;max-width:min(1100px,92vw);margin:0 auto;color:var(--ink)}
    .hero-subtitle{font-family:var(--font-sans);font-size:16px;font-weight:400;line-height:1.6;color:var(--ink-2);max-width:min(640px,90vw);margin:20px auto 0;text-align:center}
    .hero-subtitle p{margin:0;font:inherit;color:inherit}
    .hero-subtitle p+p{margin-top:.75em}

    /* -- Hero image -- */
    /* Full-bleed override for iframe: stretch to viewport edges without overflow trick */
    .hero-image-section{background:var(--ink-dark-2);width:100%;overflow:hidden;margin-left:0;margin-right:0}
    #hero-img{width:100%;display:block}

    /* -- Brief card -- */
    .st-card{position:relative;width:100%;margin-left:0}
    .st-brief{background:var(--bg);border-radius:var(--r-lg) var(--r-lg) 0 0}
    .brief-centre{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px var(--col-pad);text-align:center}
    .brief-centre p{font-family:var(--font-display);font-size:clamp(26px,3vw,42px);font-weight:300;line-height:1.35;letter-spacing:-.02em;color:var(--ink);max-width:960px}
    .brief-centre p+p{margin-top:1.2em;color:var(--ink-2)}
    .brief-meta{display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:48px}
    .brief-meta .cs-label{margin:0}
    .brief-heading{font-family:var(--font-display);font-size:clamp(22px,2.5vw,30px);font-weight:400;color:var(--ink);margin:0;letter-spacing:-.015em;line-height:1.2}

    /* -- Scope card -- */
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

    /* -- Section -- */
    .section{padding:var(--section-gap) 0}

    /* -- Editorial (context layout) -- */
    .cs-context-layout{display:grid;grid-template-columns:140px 1fr;gap:var(--col-pad);align-items:start}
    .cs-context-margin{padding-top:4px;display:flex;flex-direction:column;gap:var(--sp-4)}
    .cs-context-main{display:flex;flex-direction:column;gap:var(--sp-6)}
    .cs-context-figure{margin-top:var(--sp-10);width:100%;border-radius:var(--r-lg);overflow:hidden;background:var(--surface)}
    .cs-context-figure img{display:block;width:100%;max-height:480px;object-fit:contain;object-position:center center}
    .cs-context-caption{padding:var(--sp-3) var(--sp-4) var(--sp-4);font-family:var(--font-sans);font-size:12px;line-height:1.5;color:var(--ink-3)}

    /* -- SK Design System Blueprint Placeholders + Switcher + Evolution Grid -- */
    .bp-slot{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--sp-3);padding:var(--sp-8);border-radius:var(--r-lg);border:1.5px dashed var(--rule);background:var(--surface);text-align:center;width:100%}
    .bp-slot--dark{background:rgba(245,244,240,.06);border-color:var(--rule-dark)}
    .bp-badge{display:inline-block;font-family:var(--font-sans);font-size:11px;font-weight:600;color:var(--sun);background:var(--sun-muted);border-radius:999px;padding:4px 12px}
    .bp-title{font-family:var(--font-display);font-size:18px;font-weight:500;color:var(--ink)}
    .bp-slot--dark .bp-title{color:var(--bg)}
    .bp-sub{font-family:var(--font-sans);font-size:12px;color:var(--ink-3)}
    .evo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--sp-6)}
    .evo-step{display:flex;flex-direction:column;gap:var(--sp-3)}
    .evo-step__header{display:flex;align-items:center;gap:var(--sp-3)}
    .evo-step__num{font-family:var(--font-display);font-size:14px;font-weight:600;color:var(--sun);background:var(--sun-muted);border-radius:999px;padding:2px 10px}
    .evo-step__line{flex:1;height:1px;background:var(--rule)}
    .sk-switch-bar{position:sticky;top:0;z-index:100;background:rgba(245,244,240,.92);backdrop-filter:blur(10px);border-bottom:1px solid var(--rule);padding:12px 0}
    .sk-switch-inner{display:flex;align-items:center;justify-content:space-between;gap:var(--sp-4)}
    .sk-switch-label{font-family:var(--font-sans);font-size:12px;font-weight:500;color:var(--ink-2)}
    .sk-switch-tabs{display:inline-flex;background:var(--surface);border:1px solid var(--rule);border-radius:999px;padding:3px;gap:4px}
    .sk-switch-tab{border:none;background:transparent;padding:6px 16px;border-radius:999px;font-family:var(--font-sans);font-size:12px;font-weight:500;color:var(--ink-2);cursor:pointer;transition:all .18s var(--ease-out)}
    .sk-switch-tab.active{background:var(--sun);color:#fff}
    .sk-deck-slide{display:none}
    .sk-deck-slide.active{display:block}
    .sk-deck-bar{display:flex;align-items:center;justify-content:space-between;margin-top:var(--sp-6);padding-top:var(--sp-4);border-top:1px solid var(--rule)}
    .sk-deck-count{font-family:var(--font-sans);font-size:12px;font-weight:600;color:var(--ink-2)}

    /* -- CS typography -- */
    .cs-label{display:inline-block;font-family:var(--font-sans);font-size:12px;font-weight:400;color:var(--ink-2);background:rgba(17,17,16,0.06);border-radius:20px;padding:3px 10px}
    .cs-h3{font-family:var(--font-display);font-size:clamp(24px,2.8vw,34px);line-height:1.2;font-weight:400;color:var(--ink);margin:0}
    .cs-body{font-family:var(--font-sans);font-size:15px;line-height:1.65;color:var(--ink-2)}
    .cs-body p{margin:0;font:inherit;color:inherit;line-height:inherit}
    .cs-body p+p{margin-top:1em}
    .cs-body strong{font-weight:600;color:var(--ink)}
    .cs-body em{font-style:italic}
    .cs-body ul,.cs-body ol{padding-left:1.4em;margin-top:.5em}
    .cs-body li+li{margin-top:.25em}

    /* -- Research figures (media group) -- */
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

    /* -- SK-CASE-GALLERY-001 Progressive Evidence Gallery (Tooltip -> Cycling Preview -> Flip Gallery -> Fullscreen) -- */
    .peg-content{display:grid;grid-template-columns:1fr 320px;grid-template-areas:"pretitle pretitle" "text tooltip" "gallery gallery" "nav nav";column-gap:var(--sp-12);row-gap:var(--sp-6);position:relative;align-items:start}
    .peg-pretitle{grid-area:pretitle}
    .peg-text{grid-area:text;display:flex;flex-direction:column;gap:var(--sp-4)}
    .peg-pills{display:flex;flex-wrap:wrap;gap:var(--sp-2);margin-top:var(--sp-2)}
    .peg-pill{font-family:var(--font-sans);font-size:12px;color:var(--ink-2);background:var(--surface);border:1px solid var(--rule);border-radius:999px;padding:4px 12px}
    .peg-trigger{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;margin-top:var(--sp-2);padding:10px 18px;border-radius:999px;border:1px solid var(--rule);background:var(--surface-chrome);color:var(--ink);font-family:var(--font-sans);font-size:13px;font-weight:500;cursor:pointer;transition:all .22s var(--ease-out)}
    .peg-trigger:hover,.peg-trigger:focus-visible{border-color:var(--sun);color:var(--sun);background:var(--sun-muted)}
    .peg-trigger__dot{width:7px;height:7px;border-radius:50%;background:var(--sun);flex-shrink:0}
    .peg-tooltip{grid-area:tooltip;position:relative;align-self:start;background:var(--surface);border-radius:var(--r-lg);padding:var(--sp-4);border:1px solid var(--rule);opacity:0;transform:translateY(6px);pointer-events:none;transition:opacity .26s var(--ease-out),transform .26s var(--ease-out);cursor:pointer}
    .peg-content.peg-hover .peg-tooltip{opacity:1;transform:translateY(0);pointer-events:auto}
    .peg-tooltip__img-wrap{width:100%;height:220px;border-radius:var(--r-md);overflow:hidden;background:var(--bg);position:relative;display:grid;grid-template-areas:"img"}
    .peg-tooltip__img{grid-area:img;width:100%;height:100%;object-fit:contain;object-position:center;opacity:0;transition:opacity .32s ease}
    .peg-tooltip__img--current{opacity:1}
    .peg-tooltip__meta{display:flex;align-items:center;justify-content:space-between;gap:var(--sp-3);margin-top:var(--sp-3);font-family:var(--font-sans);font-size:12px;color:var(--ink-3)}
    .peg-tooltip__counter{font-weight:600;color:var(--ink-2);flex-shrink:0}
    .peg-tooltip__cap{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .peg-tooltip__cta{color:var(--sun);font-weight:500;flex-shrink:0}
    .peg-gallery{grid-area:gallery;display:none;position:relative;border-radius:var(--r-lg);overflow:hidden;background:var(--surface);height:520px;border:1px solid var(--rule)}
    .peg-gallery__bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
    .peg-gallery__bg img{width:100%;height:100%;object-fit:cover;object-position:center;transform:scale(1.08);filter:blur(32px) saturate(0.7);opacity:.55}
    .peg-gallery__stage{position:relative;z-index:1;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:var(--sp-8);cursor:zoom-in}
    .peg-gallery__stage .peg-tooltip__img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;opacity:1}
    .peg-gallery__scrim{position:absolute;bottom:0;left:0;right:0;height:96px;background:linear-gradient(to top,rgba(17,17,16,.76) 0%,transparent 100%);z-index:2;pointer-events:none}
    .peg-gallery__title{position:absolute;bottom:var(--sp-6);left:var(--sp-6);right:var(--sp-6);z-index:3;pointer-events:none;color:var(--bg);display:flex;align-items:baseline;gap:var(--sp-3)}
    .peg-gallery__counter{font-family:var(--font-sans);font-size:12px;font-weight:600;color:rgba(245,244,240,.75);flex-shrink:0}
    .peg-gallery__caption{font-family:var(--font-sans);font-size:13px;line-height:1.45;color:var(--bg);margin:0}
    .peg-gallery__controls{position:absolute;top:var(--sp-4);right:var(--sp-4);z-index:4;display:flex;gap:var(--sp-2)}
    .peg-ctrl-btn{width:36px;height:36px;border-radius:50%;border:1px solid rgba(245,244,240,.28);background:rgba(17,17,16,.55);backdrop-filter:blur(8px);color:var(--bg);font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .18s ease}
    .peg-ctrl-btn:hover{background:var(--sun);border-color:var(--sun)}
    .peg-nav{grid-area:nav;display:none;gap:var(--sp-3);align-items:center;height:76px;overflow-x:auto;padding:4px 2px}
    .peg-nav__item{height:64px;aspect-ratio:16/10;border-radius:var(--r-sm);overflow:hidden;border:none;padding:0;background:var(--surface);cursor:pointer;flex-shrink:0;opacity:.7;transition:opacity .18s ease}
    .peg-nav__item:hover{opacity:1}
    .peg-nav__item--selected{opacity:1;outline:2px solid var(--sun);outline-offset:2px}
    .peg-nav__img{width:100%;height:100%;object-fit:cover;display:block}
    .peg-content.peg-open .peg-text,.peg-content.peg-open .peg-tooltip{opacity:0;pointer-events:none;overflow:hidden;height:0;min-height:0;margin:0;padding:0;border:none}
    .peg-content.peg-open .peg-gallery{display:block}
    .peg-content.peg-open .peg-nav{display:flex}
    .peg-gallery.peg-gallery--fullscreen{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;z-index:950!important;border-radius:0!important;background:var(--ink)!important;border:none!important}
    .peg-gallery.peg-gallery--fullscreen .peg-gallery__stage{cursor:zoom-out}
    @media(max-width:640px){.peg-content{grid-template-columns:1fr;grid-template-areas:"pretitle" "text" "gallery" "nav"}.peg-tooltip{display:none}.peg-gallery{height:340px}}

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

    /* -- Slide layout (SK-SLIDE, sec 24) -- */
    .sk-slide { display: grid; grid-template-columns: 2fr 3fr; min-height: 500px; border-radius: var(--r-lg); overflow: hidden; }
    .sk-slide--light { background: var(--surface); }
    .sk-slide--dark  { background: var(--ink-dark); }
    .sk-slide-text { padding: var(--sp-16) var(--col-pad); display: flex; flex-direction: column; justify-content: center; gap: var(--sp-4); }
    .sk-slide-heading { font-family: var(--font-display); font-size: clamp(24px,2.8vw,36px); font-weight: 400; line-height: 1.2; color: var(--ink); margin: 0; }
    .sk-slide--dark .sk-slide-heading { color: var(--bg); }
    .sk-slide--dark .cs-body { color: rgba(245,244,240,.65); }
    .sk-slide--dark .cs-body strong { color: var(--bg); }
    .sk-slide--dark .cs-label { background: rgba(245,244,240,.12); color: rgba(245,244,240,.6); }
    .sk-slide-image { position: relative; overflow: hidden; }
    .sk-slide-image img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }

    /* -- Template 03: Visual / Image-Only Showcase (Continuous Zero-Gap Strip + Right-Side Interactive Slider) -- */
    .vs-shell {
      --vs-bg: #141412;
      --vs-surface: #1c1b18;
      --vs-ink: #f0efe9;
      --vs-ink-2: #a8a8a0;
      --vs-ink-3: #686862;
      --vs-rule: #2a2926;
      --vs-accent: #E8490F;
      display: flex;
      align-items: stretch;
      height: calc(100vh - 96px);
      min-height: 620px;
      overflow: hidden;
      background: var(--vs-bg);
      color: var(--vs-ink);
      font-family: 'DM Sans', var(--font-sans);
    }
    .vs-main {
      flex: 1 1 auto;
      min-width: 0;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      padding: 28px 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .vs-main::-webkit-scrollbar { width: 0; }
    .vs-strip {
      display: flex;
      flex-direction: column;
      gap: 0;
      width: 100%;
      border-radius: 10px;
      overflow: hidden;
      background: var(--vs-surface);
      flex-shrink: 0;
    }
    .vs-card {
      position: relative;
      width: 100%;
      border-radius: 0;
      overflow: hidden;
      background: var(--vs-surface);
      flex-shrink: 0;
      margin: 0;
      line-height: 0;
    }
    .vs-hero { aspect-ratio: 16 / 9; }
    .vs-frame, .vs-frame-img {
      width: 100%;
      display: block;
      margin: 0;
    }
    .vs-hero .vs-frame-img {
      height: 100%;
      object-fit: cover;
    }
    .vs-frame-16-9 { aspect-ratio: 16 / 9; }
    .vs-frame-4-3  { aspect-ratio: 4 / 3; }
    .vs-frame-3-2  { aspect-ratio: 3 / 2; }
    .vs-hero-scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(14,13,12,0.88) 0%, rgba(14,13,12,0.30) 45%, transparent 70%);
      pointer-events: none;
    }
    .vs-hero-meta {
      position: absolute;
      bottom: 28px;
      left: 28px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      line-height: 1.2;
      z-index: 2;
    }
    .vs-eyebrow {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--vs-ink-2);
    }
    .vs-hero-title {
      font-family: 'DM Serif Display', Georgia, serif;
      font-style: italic;
      font-size: clamp(24px, 3.2vw, 42px);
      line-height: 1.05;
      color: var(--vs-ink);
      font-weight: 400;
    }
    .vs-bp-pill {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(20,20,18,0.78);
      border: 1px solid rgba(232,73,15,0.45);
      color: #f0efe9;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.06em;
      line-height: 1.3;
      pointer-events: none;
      backdrop-filter: blur(4px);
    }
    .vs-sidebar {
      flex: 0 0 200px;
      width: 200px;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--vs-surface);
      border-left: 1px solid var(--vs-rule);
      padding: 20px 12px;
      gap: 8px;
      overflow-y: auto;
      overflow-x: hidden;
      user-select: none;
    }
    .vs-sidebar::-webkit-scrollbar { width: 2px; }
    .vs-sidebar::-webkit-scrollbar-thumb { background: var(--vs-rule); border-radius: 99px; }
    .vs-sidebar-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--vs-ink-3);
      padding-bottom: 8px;
      border-bottom: 1px solid var(--vs-rule);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .vs-sidebar-sub {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: var(--vs-ink-3);
      margin-bottom: 4px;
      font-variant-numeric: tabular-nums;
    }
    .vs-thumbs-wrap {
      position: relative;
      width: 100%;
    }
    .vs-thumbs {
      display: flex;
      flex-direction: column;
      gap: 0;
      border-radius: 5px;
      overflow: hidden;
    }
    .vs-thumb {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 0;
      overflow: hidden;
      cursor: ns-resize;
      opacity: 0.38;
      transition: opacity 200ms ease;
      flex-shrink: 0;
      line-height: 0;
    }
    .vs-thumb:first-child { border-radius: 5px 5px 0 0; }
    .vs-thumb:last-child  { border-radius: 0 0 5px 5px; }
    .vs-thumb:hover { opacity: 0.65; }
    .vs-thumb.active { opacity: 1; }
    .vs-thumb::after {
      content: '';
      position: absolute;
      left: 0; top: 18%; bottom: 18%;
      width: 3px;
      background: var(--vs-accent);
      border-radius: 0 2px 2px 0;
      opacity: 0;
      z-index: 2;
      transform: scaleY(0.5);
      transition: opacity 180ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
    }
    .vs-thumb.active::after {
      opacity: 1;
      transform: scaleY(1);
    }
    .vs-thumb canvas, .vs-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      pointer-events: none;
    }
    .vs-slider-box {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 48px;
      border: 1.5px solid var(--vs-accent);
      border-radius: 5px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.5), inset 0 0 12px rgba(232,73,15,0.16);
      pointer-events: none;
      z-index: 3;
      transition: top 90ms linear, height 160ms ease;
    }
    .vs-extra-blocks {
      background: var(--bg);
      color: var(--ink);
      border-radius: 12px;
      padding: 24px 0 48px;
    }

    /* -- Responsive -- */
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
      .sk-slide{grid-template-columns:1fr}
      .sk-slide-image{height:280px;position:relative}
      .sk-slide-text{padding:var(--sp-12) var(--col-pad-m)}
      .vs-shell{flex-direction:column;height:auto}
      .vs-main{padding:12px;height:auto}
      .vs-sidebar{flex:0 0 72px;width:100%;height:72px;flex-direction:row;align-items:center;border-left:none;border-top:1px solid var(--vs-rule)}
      .vs-sidebar-label,.vs-sidebar-sub,.vs-slider-box{display:none}
      .vs-thumbs{flex-direction:row;gap:6px}
      .vs-thumb{width:76px;flex-shrink:0}
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/Flip.min.js"></script>
</head>
<body>
<div id="bento-stage"></div>

<header class="preview-bar">
  <strong>SK  - CMS Preview</strong>
  <nav class="preview-nav">
    <a href="/preview/case-studies/centronic">Centronic</a>
    <a href="/preview/case-studies/haptix">Haptix</a>
    <a href="/admin/collections/case-studies"><- Edit in Payload</a>
    <button class="preview-refresh" id="refreshBtn" onclick="doRefresh()" title="Reload preview with latest saved draft">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5 6.5A5 5 0 1 1 6.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <polyline points="6.5,1.5 9,1.5 9,4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Refresh
    </button>
  </nav>
</header>

<aside class="preview-notice container" id="previewNotice">
  ${isSample
    ? 'Live SK Design System Wireframe Preview -- changes in the left panel update here in real time.'
    : 'Live Real-Time Preview -- edits to templates, slides, blocks, and annotations update here automatically.'}
</aside>

<div id="page-content">
${body}
</div>

<footer style="margin:80px auto 40px;border-top:1px solid var(--rule);padding-top:20px;font-size:12px;color:var(--ink-3);max-width:var(--page-w);padding-left:var(--col-pad)">
  Integration branch  - Review only  - Production case studies unchanged
</footer>

<script>
function doRefresh(){
  var btn = document.getElementById('refreshBtn')
  if(btn){ btn.classList.add('spinning') }
  setTimeout(function(){ window.location.reload() }, 320)
}

window.__skActiveTab = 'case'
window.__skActiveSlide = 0

window.__skInitAll = function(){
  // -- Bento: 3D tilt + Flip expand/close --
  ;(function bentoInit(){
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

    stage.onclick = function(){
      if(!expandedCell || !origParent) return
      var state = Flip.getState(expandedCell)
      if(origNextSib) { origParent.insertBefore(expandedCell, origNextSib) }
      else { origParent.appendChild(expandedCell) }
      expandedCell.classList.remove('flip-expanded')
      stage.classList.remove('active')
      Flip.from(state, { duration: 0.55, ease: 'power3.inOut', nested: true })
      expandedCell = null; origParent = null; origNextSib = null
    }
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

  // -- SK-CASE-GALLERY-001 Progressive Evidence Gallery --
  ;(function pegInit(){
    if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
      gsap.registerPlugin(Flip)
    }
    document.querySelectorAll('[data-peg]').forEach(function(root){
      var trigger     = root.querySelector('[data-peg-trigger]')
      var textCol     = root.querySelector('.peg-text')
      var tooltip     = root.querySelector('[data-peg-tooltip]')
      var tooltipWrap = root.querySelector('[data-peg-tooltip-wrap]')
      var tipCounter  = root.querySelector('[data-peg-counter]')
      var tipCap      = root.querySelector('[data-peg-tip-cap]')
      var gallery     = root.querySelector('[data-peg-gallery]')
      var stage       = root.querySelector('[data-peg-stage]')
      var bgImg       = gallery ? gallery.querySelector('.peg-gallery__bg img') : null
      var galCounter  = root.querySelector('[data-peg-gal-counter]')
      var galCap      = root.querySelector('[data-peg-gal-cap]')
      var btnPrev     = root.querySelector('[data-peg-prev]')
      var btnNext     = root.querySelector('[data-peg-next]')
      var btnClose    = root.querySelector('[data-peg-close]')
      var imgs        = Array.from(root.querySelectorAll('.peg-tooltip__img'))
      var navItems    = Array.from(root.querySelectorAll('.peg-nav__item'))
      if (!imgs.length || !tooltipWrap || !gallery || !stage) return

      var current = 0
      var timer = null
      var isOpen = false
      var isFullscreen = false
      var isAnimating = false
      var totalStr = String(imgs.length).padStart(2, '0')

      function updateMeta(idx) {
        var numStr = String(idx + 1).padStart(2, '0') + ' / ' + totalStr
        var capStr = imgs[idx].getAttribute('data-cap') || ''
        if (tipCounter) tipCounter.textContent = numStr
        if (tipCap)     tipCap.textContent     = capStr
        if (galCounter) galCounter.textContent = numStr
        if (galCap)     galCap.textContent     = capStr
        if (bgImg)      bgImg.src              = imgs[idx].src
        navItems.forEach(function(n, i){ n.classList.toggle('peg-nav__item--selected', i === idx) })
      }

      function showTooltipFrame(idx) {
        imgs.forEach(function(im, i){ im.classList.toggle('peg-tooltip__img--current', i === idx) })
        current = idx
        updateMeta(idx)
      }

      function startCycle() {
        stopCycle()
        if (imgs.length <= 1) return
        timer = setInterval(function(){
          if (isOpen) return
          var next = (current + 1) % imgs.length
          showTooltipFrame(next)
        }, 1800)
      }

      function stopCycle() {
        if (timer) { clearInterval(timer); timer = null }
      }

      function onHoverEnter() {
        if (isOpen) return
        root.classList.add('peg-hover')
        startCycle()
      }

      function onHoverLeave() {
        if (isOpen) return
        stopCycle()
        root.classList.remove('peg-hover')
      }

      if (textCol) {
        textCol.addEventListener('mouseenter', onHoverEnter)
        textCol.addEventListener('mouseleave', onHoverLeave)
      }
      if (tooltip) {
        tooltip.addEventListener('mouseenter', function(){ if (!isOpen) { root.classList.add('peg-hover'); stopCycle() } })
        tooltip.addEventListener('mouseleave', onHoverLeave)
      }

      function openGallery() {
        if (isOpen || isAnimating) return
        stopCycle()
        isOpen = true
        var activeImg = imgs[current]
        var state = (typeof Flip !== 'undefined') ? Flip.getState(activeImg, { simple: true }) : null
        root.classList.remove('peg-hover')
        root.classList.add('peg-open')
        stage.appendChild(activeImg)
        activeImg.classList.add('peg-tooltip__img--current')
        updateMeta(current)
        if (state && typeof Flip !== 'undefined') {
          isAnimating = true
          Flip.from(state, { duration: 0.55, ease: 'power3.inOut', scale: true, onComplete: function(){ isAnimating = false } })
        }
      }

      function selectImage(idx) {
        if (!isOpen || idx === current || isAnimating) return
        var nextIdx = (idx + imgs.length) % imgs.length
        var prevImg = imgs[current]
        var nextImg = imgs[nextIdx]
        var state = (typeof Flip !== 'undefined') ? Flip.getState(nextImg, { simple: true }) : null
        tooltipWrap.appendChild(prevImg)
        prevImg.classList.remove('peg-tooltip__img--current')
        if (typeof gsap !== 'undefined') gsap.set(prevImg, { clearProps: 'all' })
        current = nextIdx
        stage.appendChild(nextImg)
        nextImg.classList.add('peg-tooltip__img--current')
        updateMeta(current)
        if (state && typeof Flip !== 'undefined') {
          isAnimating = true
          Flip.from(state, { duration: 0.45, ease: 'power3.inOut', scale: true, onComplete: function(){ isAnimating = false } })
        }
      }

      function toggleFullscreen() {
        if (!isOpen || isAnimating) return
        var activeImg = imgs[current]
        var state = (typeof Flip !== 'undefined') ? Flip.getState(activeImg, { simple: true }) : null
        isFullscreen = !isFullscreen
        gallery.classList.toggle('peg-gallery--fullscreen', isFullscreen)
        if (state && typeof Flip !== 'undefined') {
          isAnimating = true
          Flip.from(state, { duration: 0.55, ease: 'power3.inOut', scale: true, onComplete: function(){ isAnimating = false } })
        }
      }

      function closeGallery() {
        if (!isOpen) return
        if (isFullscreen) {
          toggleFullscreen()
          return
        }
        stopCycle()
        var activeImg = imgs[current]
        tooltipWrap.appendChild(activeImg)
        imgs.forEach(function(im, i){
          if (typeof gsap !== 'undefined') gsap.set(im, { clearProps: 'all' })
          im.classList.toggle('peg-tooltip__img--current', i === current)
        })
        gallery.classList.remove('peg-gallery--fullscreen')
        root.classList.remove('peg-open', 'peg-hover')
        isOpen = false
        isFullscreen = false
        isAnimating = false
      }

      if (trigger) trigger.addEventListener('click', openGallery)
      if (tooltip) tooltip.addEventListener('click', openGallery)
      if (stage)   stage.addEventListener('click', toggleFullscreen)
      if (btnPrev) btnPrev.addEventListener('click', function(e){ e.stopPropagation(); selectImage(current - 1) })
      if (btnNext) btnNext.addEventListener('click', function(e){ e.stopPropagation(); selectImage(current + 1) })
      if (btnClose) btnClose.addEventListener('click', function(e){ e.stopPropagation(); closeGallery() })
      navItems.forEach(function(btn, idx){
        btn.addEventListener('click', function(){ selectImage(idx) })
      })
    })
  })()

  // -- Case Study / Slides Switcher + Presentation Deck --
  ;(function deckInit(){
    var switchBar  = document.getElementById('switch')
    var switchTabs = Array.from(document.querySelectorAll('[data-switch-target]'))
    var pCase      = document.getElementById('p-case')
    var pSlides    = document.getElementById('p-slides')
    var storageKey = 'sk_preview_tab_' + window.location.pathname
    function applyTab(target, persist) {
      window.__skActiveTab = target
      if (persist) {
        try { sessionStorage.setItem(storageKey, target) } catch(e) {}
      }
      switchTabs.forEach(function(t){
        var active = t.getAttribute('data-switch-target') === target
        t.classList.toggle('active', active)
        t.setAttribute('aria-selected', active ? 'true' : 'false')
      })
      if (pCase && pSlides) {
        pCase.style.display   = target === 'slides' ? 'none'  : 'block'
        pSlides.style.display = target === 'slides' ? 'block' : 'none'
      }
    }
    if (switchTabs.length) {
      var savedTab = null
      try { savedTab = sessionStorage.getItem(storageKey) } catch(e) {}
      var defaultTab = switchBar ? switchBar.getAttribute('data-default-tab') : null
      var initialTab = window.__skUserForcedTab || savedTab || defaultTab || window.__skActiveTab || 'case'
      if (defaultTab === 'slides' && !window.__skUserClickedTab) {
        initialTab = 'slides'
      }
      applyTab(initialTab, false)
    }
    switchTabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var chosen = tab.getAttribute('data-switch-target') || 'case'
        window.__skUserClickedTab = true
        window.__skUserForcedTab = chosen
        applyTab(chosen, true)
      })
    })
    document.querySelectorAll('[data-deck]').forEach(function(deck){
      var slides = Array.from(deck.querySelectorAll('[data-deck-slide]'))
      var prev   = deck.querySelector('[data-deck-prev]')
      var next   = deck.querySelector('[data-deck-next]')
      var count  = deck.querySelector('[data-deck-count]')
      if (!slides.length) return
      var cur = Math.min(window.__skActiveSlide || 0, slides.length - 1)
      function go(i) {
        cur = (i + slides.length) % slides.length
        window.__skActiveSlide = cur
        slides.forEach(function(s, idx){ s.classList.toggle('active', idx === cur) })
        if (count) count.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0')
      }
      go(cur)
      if (prev) prev.addEventListener('click', function(){ go(cur - 1) })
      if (next) next.addEventListener('click', function(){ go(cur + 1) })
    })
  })()

  // -- Template 03: Visual Showcase (Continuous Zero-Gap Strip + Right-Side Interactive Slider) --
  ;(function vsInit(){
    var shell = document.getElementById('vs-shell')
    var mainEl = document.getElementById('vs-main')
    if (!shell || !mainEl) return

    function px(canvas) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2)
      var rect = canvas.getBoundingClientRect()
      var w = rect.width  || canvas.offsetWidth  || 800
      var h = rect.height || canvas.offsetHeight || 450
      canvas.width  = w * dpr
      canvas.height = h * dpr
      var ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      return { ctx: ctx, w: w, h: h }
    }

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
    }

    function drawHero(canvas) {
      var c = px(canvas), ctx = c.ctx, w = c.w, h = c.h
      var sky = ctx.createLinearGradient(0, 0, 0, h * 0.6)
      sky.addColorStop(0, '#4a8fc2'); sky.addColorStop(1, '#7db8d8')
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#2d5a1b'; ctx.fillRect(0, h * 0.6, w, h * 0.4)
      ctx.fillStyle = '#f4f0e8'; ctx.fillRect(w * 0.22, h * 0.28, w * 0.56, h * 0.42)
      ctx.beginPath()
      ctx.moveTo(w * 0.18, h * 0.28); ctx.lineTo(w * 0.5, h * 0.06); ctx.lineTo(w * 0.82, h * 0.28)
      ctx.closePath()
      ctx.fillStyle = '#2c3e50'; ctx.fill()
      ;[[0.30,0.36],[0.44,0.36],[0.30,0.50],[0.44,0.50],[0.60,0.36]].forEach(function(pt){
        ctx.fillStyle = '#9ab8d4'; ctx.fillRect(w * pt[0], h * pt[1], w * 0.08, h * 0.10)
        ctx.strokeStyle = '#c8baa8'; ctx.lineWidth = 1; ctx.strokeRect(w * pt[0], h * pt[1], w * 0.08, h * 0.10)
      })
      ctx.fillStyle = '#1a2832'; ctx.fillRect(w * 0.45, h * 0.52, w * 0.10, h * 0.18)
      ;[[0.10,0.45],[0.84,0.42]].forEach(function(pt){
        ctx.beginPath(); ctx.arc(w * pt[0], h * pt[1], w * 0.055, 0, Math.PI * 2)
        ctx.fillStyle = '#2d6e1a'; ctx.fill()
        ctx.fillStyle = '#1a3d10'; ctx.fillRect(w * pt[0] - w * 0.012, h * pt[1] + w * 0.04, w * 0.024, h * 0.18)
      })
      ctx.fillStyle = 'rgba(14,16,22,0.22)'; ctx.fillRect(0, 0, w, h)
    }

    function drawLogo(canvas) {
      var c = px(canvas), ctx = c.ctx, w = c.w, h = c.h
      var bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#d8e8f5'); bg.addColorStop(1, '#edf4fb')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
      var S = Math.min(w, h) * 0.18, ix = (w - S) / 2, iy = h * 0.22
      ctx.fillStyle = '#1a3a5c'; roundRect(ctx, ix, iy, S, S, S * 0.18); ctx.fill()
      ctx.fillStyle = '#f0efe9'
      ctx.beginPath()
      ctx.moveTo(ix + S * 0.2, iy + S * 0.62); ctx.lineTo(ix + S * 0.2, iy + S * 0.38)
      ctx.lineTo(ix + S * 0.5, iy + S * 0.18); ctx.lineTo(ix + S * 0.8, iy + S * 0.38)
      ctx.lineTo(ix + S * 0.8, iy + S * 0.62); ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#1a3a5c'; ctx.fillRect(ix + S * 0.38, iy + S * 0.42, S * 0.24, S * 0.20)
      ctx.textAlign = 'center'
      ctx.font = '700 ' + (h * 0.072) + "px 'DM Sans',sans-serif"
      ctx.fillStyle = '#1a3a5c'; ctx.fillText('ACHETER du NEUF', w / 2, iy + S + h * 0.10)
      ctx.font = '300 ' + (h * 0.032) + "px 'DM Sans',sans-serif"
      ctx.fillStyle = '#4a6a82'; ctx.fillText('Comparateur en immobilier neuf', w / 2, iy + S + h * 0.16)
    }

    function drawWebMockup(canvas) {
      var c = px(canvas), ctx = c.ctx, w = c.w, h = c.h
      ctx.fillStyle = '#f2f0ee'; ctx.fillRect(0, 0, w, h)
      var mw = w * 0.70, mh = h * 0.72, mx = (w - mw) / 2, my = h * 0.07
      ctx.fillStyle = '#1d1c1a'; roundRect(ctx, mx, my, mw, mh, mw * 0.025); ctx.fill()
      var sw = mw * 0.95, sh = mh * 0.90, sx = mx + (mw - sw) / 2, sy = my + (mh - sh) / 2
      ctx.fillStyle = '#e8f2fb'; ctx.fillRect(sx, sy, sw, sh)
      ctx.fillStyle = '#1a3a5c'; ctx.fillRect(sx, sy, sw, sh * 0.10)
      ctx.fillStyle = '#E8490F'; roundRect(ctx, sx + sw * 0.36, sy + sh * 0.42, sw * 0.28, sh * 0.08, sh * 0.02); ctx.fill()
      ctx.fillStyle = '#2a2927'
      ctx.fillRect(mx + mw * 0.44, my + mh, mw * 0.12, h * 0.06)
      ctx.fillRect(mx + mw * 0.28, my + mh + h * 0.06, mw * 0.44, h * 0.02)
    }

    function drawBillboard(canvas) {
      var c = px(canvas), ctx = c.ctx, w = c.w, h = c.h
      var bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#5a9fd4'); bg.addColorStop(1, '#7db8dc')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)
      var bw = w * 0.28, bh = h * 0.78, bx = (w - bw) / 2, by = h * 0.08
      ctx.fillStyle = 'rgba(255,255,255,0.16)'; ctx.fillRect(bx, by, bw, bh)
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh)
      ctx.fillStyle = '#E8490F'; roundRect(ctx, bx + bw * 0.15, by + bh * 0.62, bw * 0.7, bh * 0.08, 4); ctx.fill()
    }

    function drawPoster(canvas) {
      var c = px(canvas), ctx = c.ctx, w = c.w, h = c.h
      var wall = ctx.createLinearGradient(0, 0, w, h)
      wall.addColorStop(0, '#2a2520'); wall.addColorStop(1, '#1e1a16')
      ctx.fillStyle = wall; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#0f0e0c'; roundRect(ctx, w * 0.18, h * 0.08, w * 0.64, h * 0.84, 4); ctx.fill()
      var px2 = w * 0.21, py2 = h * 0.11, pw = w * 0.58, ph2 = h * 0.78
      var pg2 = ctx.createLinearGradient(px2, py2, px2 + pw, py2 + ph2)
      pg2.addColorStop(0, '#1c3a58'); pg2.addColorStop(1, '#0c2038')
      ctx.fillStyle = pg2; ctx.fillRect(px2, py2, pw, ph2)
      ctx.fillStyle = '#E8490F'; ctx.fillRect(px2 + pw * 0.06, py2 + ph2 * 0.72, pw * 0.35, ph2 * 0.05)
    }

    function drawSocial(canvas) {
      var c = px(canvas), ctx = c.ctx, w = c.w, h = c.h
      ctx.fillStyle = '#f0ece6'; ctx.fillRect(0, 0, w, h)
      var gw = w * 0.88, gh = h * 0.88, gx = (w - gw) / 2, gy = (h - gh) / 2
      var cols = 3, gap = 10, cw = (gw - (cols - 1) * gap) / cols, ch = cw
      var colors = [['#c8dce8','#8ab0d0'], ['#d4c8e0','#a090c0'], ['#c8d8c0','#90b088']]
      for (var i = 0; i < cols; i++) {
        var cx = gx + i * (cw + gap), cy = gy + (gh - ch) / 2
        ctx.fillStyle = 'white'; roundRect(ctx, cx, cy, cw, ch, 6); ctx.fill()
        var pg3 = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch * 0.65)
        pg3.addColorStop(0, colors[i][0]); pg3.addColorStop(1, colors[i][1])
        ctx.fillStyle = pg3; ctx.fillRect(cx, cy, cw, ch * 0.65)
      }
      ctx.fillStyle = '#1a3a5c'; ctx.fillRect(0, 0, w, h * 0.07)
    }

    function drawScreen(canvas) {
      var c = px(canvas), ctx = c.ctx, w = c.w, h = c.h
      var bg2 = ctx.createLinearGradient(0, 0, w, h)
      bg2.addColorStop(0, '#1c2836'); bg2.addColorStop(1, '#0e1824')
      ctx.fillStyle = bg2; ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#12202e'; roundRect(ctx, w * 0.06, h * 0.06, w * 0.88, h * 0.82, w * 0.018); ctx.fill()
      var sc_x = w * 0.07, sc_y = h * 0.07, sc_w = w * 0.86, sc_h = h * 0.80
      ctx.fillStyle = '#d8e8f5'; ctx.fillRect(sc_x, sc_y, sc_w, sc_h)
      ctx.fillStyle = '#E8490F'; roundRect(ctx, sc_x + sc_w * 0.35, sc_y + sc_h * 0.42, sc_w * 0.30, sc_h * 0.12, sc_h * 0.04); ctx.fill()
    }

    var painters = [drawHero, drawLogo, drawWebMockup, drawBillboard, drawPoster, drawSocial, drawScreen]
    function drawAllCanvases() {
      shell.querySelectorAll('[data-vs-canvas]').forEach(function(cv){
        var idx = Number(cv.getAttribute('data-vs-canvas') || 0) % painters.length
        painters[idx](cv)
      })
      shell.querySelectorAll('[data-vs-thumb-canvas]').forEach(function(cv){
        var idx = Number(cv.getAttribute('data-vs-thumb-canvas') || 0) % painters.length
        painters[idx](cv)
      })
    }
    requestAnimationFrame(drawAllCanvases)
    window.addEventListener('resize', drawAllCanvases)

    var sections = Array.from(shell.querySelectorAll('[data-vs-sec]'))
    var thumbEls = Array.from(shell.querySelectorAll('.vs-thumb'))
    var thumbsWrap = document.getElementById('vs-thumbs-wrap')
    var sliderBox = document.getElementById('vs-slider-box')
    var countEl = document.getElementById('vs-active-count')
    var activeIdx = -1

    function setActive(i) {
      if (i < 0 || i >= thumbEls.length) return
      activeIdx = i
      thumbEls.forEach(function(t, j){ t.classList.toggle('active', j === i) })
      if (countEl) {
        countEl.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(thumbEls.length).padStart(2, '0')
      }
      var activeThumb = thumbEls[i]
      if (activeThumb && sliderBox) {
        sliderBox.style.top = activeThumb.offsetTop + 'px'
        sliderBox.style.height = activeThumb.offsetHeight + 'px'
      }
    }

    function updateSpy() {
      if (!sections.length) return
      var scrollTop = mainEl.scrollTop
      var mid = scrollTop + mainEl.clientHeight / 2
      var bestIdx = 0, bestDist = Infinity
      sections.forEach(function(s, i){
        var top = s.offsetTop
        var bot = top + s.offsetHeight
        var dist = mid < top ? top - mid : mid > bot ? mid - bot : 0
        if (dist < bestDist) { bestDist = dist; bestIdx = i }
      })
      setActive(bestIdx)
    }

    mainEl.addEventListener('scroll', updateSpy, { passive: true })
    requestAnimationFrame(updateSpy)
    setTimeout(updateSpy, 180)

    // Interactive click + continuous drag scrubbing on the right-hand thumbnail strip
    var isScrubbing = false
    function scrubToClientY(clientY, smooth) {
      if (!thumbsWrap || !sections.length) return
      var rect = thumbsWrap.getBoundingClientRect()
      if (!rect.height) return
      var ratio = Math.max(0, Math.min(0.999, (clientY - rect.top) / rect.height))
      var idx = Math.min(sections.length - 1, Math.floor(ratio * sections.length))
      var target = sections[idx]
      if (target) {
        setActive(idx)
        mainEl.scrollTo({ top: target.offsetTop, behavior: smooth ? 'smooth' : 'auto' })
      }
    }

    if (thumbsWrap) {
      thumbsWrap.addEventListener('mousedown', function(e){
        isScrubbing = true
        scrubToClientY(e.clientY, true)
        e.preventDefault()
      })
      window.addEventListener('mousemove', function(e){
        if (isScrubbing) scrubToClientY(e.clientY, false)
      })
      window.addEventListener('mouseup', function(){
        isScrubbing = false
      })
    }
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
}

window.__skInitAll()

// Signal to Payload 3.92.1 LivePreviewProvider that the preview frame is ready,
// and render live form changes in real time without waiting for manual Save Draft.
;(function(){
  function sendReady(){
    if(window.parent !== window){
      window.parent.postMessage({ type: 'payload-live-preview', ready: true }, '*')
      window.parent.postMessage({ type: 'payload-live-preview-ready' }, '*')
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', sendReady)
  } else {
    sendReady()
  }
  setTimeout(sendReady, 250)
  setTimeout(sendReady, 900)

  var debounceTimer = null
  var prevSlidesSigs = null
  window.addEventListener('message', function(e){
    if(!e.data || typeof e.data !== 'object') return
    if(e.data.type === 'payload-live-preview' && e.data.data && typeof e.data.data === 'object'){
      var liveData = e.data.data
      if (Array.isArray(liveData.slides)) {
        var curSigs = liveData.slides.map(function(s){
          if (!s || typeof s !== 'object') return ''
          var imgVal = s.image && typeof s.image === 'object' ? (s.image.id || s.image.url || '') : (s.image || '')
          return [s.variant || '', s.eyebrow || '', s.heading || '', s.body || '', imgVal, s.imageAlt || ''].join('|')
        })
        if (prevSlidesSigs !== null) {
          var changedIdx = -1
          if (curSigs.length !== prevSlidesSigs.length) {
            changedIdx = Math.max(0, curSigs.length - 1)
          } else {
            for (var si = 0; si < curSigs.length; si++) {
              if (curSigs[si] !== prevSlidesSigs[si]) { changedIdx = si; break }
            }
          }
          if (changedIdx >= 0 && curSigs.length > 0) {
            window.__skActiveTab = 'slides'
            window.__skUserForcedTab = 'slides'
            window.__skActiveSlide = changedIdx
            try { sessionStorage.setItem('sk_preview_tab_' + window.location.pathname, 'slides') } catch(err) {}
          }
        } else if (curSigs.length > 0 && !window.__skUserClickedTab) {
          window.__skActiveTab = 'slides'
        }
        prevSlidesSigs = curSigs
      }
      if(debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(function(){
        fetch(window.location.pathname + window.location.search, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: liveData })
        })
        .then(function(r){ return r.ok ? r.json() : null })
        .then(function(res){
          if(res && typeof res.bodyHtml === 'string'){
            var container = document.getElementById('page-content')
            if(container){
              container.innerHTML = res.bodyHtml
              window.__skInitAll()
            }
          }
        })
        .catch(function(){})
      }, 90)
    }
  })
})()
</script>

</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
