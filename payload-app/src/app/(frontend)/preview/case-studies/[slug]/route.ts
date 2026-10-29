import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
const escape = (value: unknown): string => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const text = (v: unknown) => escape(v).replace(/\n/g, '<br>')
type Content = Record<string, unknown>
type CasePage = { title: string, layout?: Content[] }
const asset = (v: unknown) => v && typeof v === 'object' && 'url' in v && typeof v.url === 'string' ? v.url : ''
const figure = (m: unknown, alt: unknown, caption: unknown, label?: unknown, blur = false) => {
  const src = asset(m)
  if (!src) return ''
  return `<figure class="figure"><div class="figure-frame">${blur ? `<img aria-hidden="true" class="backdrop" src="${escape(src)}" alt="">` : ''}<img class="evidence" src="${escape(src)}" alt="${escape(alt)}"></div><figcaption><strong>${escape(label)}</strong> ${escape(caption)}</figcaption></figure>`
}
const sample: Record<string, CasePage> = {
  centronic: { title: 'Centronic', layout: [
    { blockType:'caseStudyHero', eyebrow:'ZF Friedrichshafen AG · 2019', role:'Sr. UX Designer', title:'Reimagining the HMI for SAE Level 4 autonomous cars', chips:[{label:'HMI'},{label:'Autonomous Vehicles'}], description:'ZF’s engineering team had been building a physical control knob, the Centronic, later called MMA.' },
    { blockType:'caseStudyBrief', heading:'The brief', body:'At Level 4, the old automotive HMI constraints disappear. You can look at the screen, lean back, use both hands. The UI has to show the hardware capabilities.' },
    { blockType:'caseStudyScope', heading:'Project scope', facts:[{label:'Where',value:'ZF India Technology Centre, Hyderabad'},{label:'When',value:'2019–2020 · 10 months'},{label:'My role',value:'UX architecture, interaction model, hardware industrial design, research, feedback animations'}] },
    { blockType:'caseStudyEditorial', eyebrow:'Research', heading:'What people reach for, and what they ignore.' },
  ] },
  haptix: { title:'Haptix', layout: [
    { blockType:'caseStudyHero', eyebrow:'UX Design · Jan–Jul 2020', role:'Senior UX Designer', title:'Haptix thumbwheel demonstrator', chips:[{label:'HMI'},{label:'Interaction Design'}], description:'I was the UI and UX designer on a demonstrator that ZF built to pitch a new thumbwheel technology for operating a car interface.' },
    { blockType:'caseStudyBrief', heading:'The brief', body:'ZF pitched this demonstrator to promote a new thumbwheel technology for operating a vehicle interface. The customer was Mercedes-Benz (Daimler).' },
    { blockType:'caseStudyScope', heading:'Where, when and what', facts:[{label:'Where',value:'ZF India Technology Centre, Hyderabad'},{label:'When',value:'January to July 2020 · about 7 months'},{label:'My role',value:'Senior UX Designer, R&D UI and UX'},{label:'Deliverables',value:'Screens in Adobe XD, prototype in Figma, developer handoffs'}] },
    { blockType:'caseStudyEditorial', eyebrow:'The hardware', heading:'What the thumbwheel can do', body:'The thumbwheel has three actions. You can turn it, push it, and touch it.' },
  ] },
}
function render(b: Content, idx: number) {
  const type = String(b.blockType ?? '')
  if (type === 'caseStudyHero') return `<section class="hero"><div class="kicker">${text(b.eyebrow)}</div><h1>${text(b.title)}</h1><p class="lede">${text(b.description)}</p><div class="tags">${Array.isArray(b.chips) ? b.chips.map(c=>`<span>${text((c as Content).label)}</span>`).join('') : ''}</div><p class="role">${text(b.role)}</p>${figure(b.heroImage,b.heroAlt,'')}</section>`
  if (type === 'caseStudyBrief') return `<section class="brief"><div class="small">${text(b.eyebrow || 'The brief')}</div><h2>${text(b.heading || 'The brief')}</h2><p>${text(b.body)}</p>${b.supportingText ? `<p>${text(b.supportingText)}</p>` : ''}</section>`
  if (type === 'caseStudyScope') return `<section class="scope"><div class="small">${text(b.eyebrow || 'Scope')}</div><h2>${text(b.heading)}</h2><div class="facts">${Array.isArray(b.facts) ? b.facts.map(f=>`<div><small>${text((f as Content).label)}</small><p>${text((f as Content).value)}</p></div>`).join('') : ''}</div>${figure(b.sketch,b.sketchAlt,'')}</section>`
  if (type === 'caseStudyEditorial') return `<section class="editorial"><div class="small">${text(b.eyebrow)}</div><h2>${text(b.heading)}</h2><p>${text(b.body)}</p>${figure(b.image,b.imageAlt,b.caption)}</section>`
  if (type === 'fullWidthFigure') return figure(b.image,b.alt,b.caption,b.captionLabel,b.background === 'blur')
  return ''
}
export async function GET(_req: Request, context: {params: Promise<{slug:string}>}) {
  const {slug} = await context.params
  if (!['centronic','haptix'].includes(slug)) return new Response('Not found',{status:404})
  const payload = await getPayload({config})
  const result = await payload.find({collection:'pages',where:{slug:{equals:slug}},depth:1,limit:1})
  const doc = result.docs[0]
  const page: CasePage = doc ? {title:doc.title,layout:doc.layout as Content[]} : sample[slug]
  const isSample = !doc
  const body = (page.layout ?? []).map((b,i)=>render(b,i)).join('')
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(page.title)} · SK CMS Review</title><style>
:root{--bg:#f5f4f0;--surface:#eeece7;--ink:#111110;--ink2:#545450;--rule:#dddad0;--sun:#e8490f}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 system-ui,-apple-system,sans-serif}a{color:inherit}
header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--rule);padding:22px max(24px,calc((100vw - 1100px)/2));gap:20px}
header strong{font-size:14px}nav{display:flex;gap:20px;font-size:12px}.wrap{max-width:1100px;padding:0 32px;margin:auto}
.notice{max-width:1100px;margin:24px auto 0;padding:14px 20px;background:#fff4df;border-left:3px solid var(--sun);font-size:13px}
.hero{padding:110px 0 100px;min-height:550px}.kicker,.small{font-size:11px;text-transform:uppercase;letter-spacing:.11em;color:var(--sun);font-weight:650}
h1,h2{font-family:Georgia,serif;font-weight:400;letter-spacing:-.035em;line-height:1.09}h1{font-size:clamp(48px,7vw,99px);max-width:1000px;margin:22px 0 34px}h2{font-size:clamp(32px,4vw,58px);margin:18px 0 28px}
.lede{font-size:20px;max-width:700px;color:var(--ink2)}.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}.tags span{font-size:12px;border:1px solid var(--rule);padding:6px 13px;border-radius:100px}.role{font-size:12px;color:var(--ink2);margin-top:35px}
.brief,.scope,.editorial{padding:65px 50px;margin:35px 0 70px;border-radius:20px}.brief{background:var(--surface)}.brief p{max-width:760px;font-size:20px}
.scope{background:#1a1917;color:#f5f4f0}.scope h2{color:#f5f4f0}.facts{display:grid;grid-template-columns:repeat(2,1fr);gap:30px;margin-top:40px}.facts>div{border-top:1px solid #555;padding-top:18px}.facts small{font-size:11px;text-transform:uppercase;color:#aba9a4}.facts p{font-size:17px;max-width:470px}
.editorial{padding-left:0;padding-right:0}.editorial p{max-width:720px;color:var(--ink2);font-size:18px}
.figure{margin:40px 0 70px}.figure-frame{position:relative;background:var(--surface);overflow:hidden;border-radius:20px}.figure img.evidence{display:block;width:100%;height:auto;position:relative;object-fit:contain}.figure .backdrop{position:absolute;width:100%;height:100%;inset:0;object-fit:cover;filter:blur(12px);opacity:.4;pointer-events:none}.figure figcaption{font-size:12px;color:var(--ink2);padding:14px 0}
footer{margin:90px auto 40px;border-top:1px solid var(--rule);padding-top:20px;font-size:12px;color:var(--ink2)}
@media(max-width:640px){header{padding:18px 22px}.wrap{padding:0 20px}.hero{padding:65px 0;min-height:0}.brief,.scope,.editorial{padding:32px 24px;margin:20px 0 35px}.editorial{padding-left:0;padding-right:0}.facts{grid-template-columns:1fr}h1{font-size:48px}.notice{margin:16px 20px 0}}
</style></head><body><header><strong>SK / Portfolio CMS review</strong><nav><a href="/preview/case-studies/centronic">Centronic</a><a href="/preview/case-studies/haptix">Haptix</a><a href="/admin/collections/pages">Edit in Payload</a></nav></header>${isSample ? '<aside class="notice">Source-based preview content. To make this page editable, create a Pages document with the matching slug and add the shared case-study blocks. This is not a production replacement.</aside>' : '<aside class="notice">CMS content is active. Changes saved in Payload are rendered on refresh. This review renderer does not replace the approved production page.</aside>'}<main class="wrap">${body}</main><footer class="wrap">Isolated integration branch · Review only · Production case studies unchanged</footer></body></html>`
  return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
}
