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

export async function GET(_req: Request, context: { params: Promise<{ page: string }> }) {
  const { page } = await context.params
  if (page !== 'home' && page !== 'about') return new Response('Not found', { status: 404 })
  // The original approved HTML, styling and motion remain the renderer.
  const filename = page === 'home' ? 'index.html' : 'about.html'
  let html = await readFile(join(process.cwd(), 'approved-source', filename), 'utf8')
  const payload = await getPayload({ config })
  const [header, footer, atlas] = await Promise.all([
    payload.findGlobal({ slug: 'siteHeader', depth: 1 }),
    payload.findGlobal({ slug: 'siteFooter', depth: 0 }),
    page === 'about' ? payload.findGlobal({ slug: 'atlasContent', depth: 0 }) : Promise.resolve(null),
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
    const links = header.navigation.map((item) => {
      const href = toPreviewURL(item.url || '#')
      const currentAttr = href === current ? ' aria-current="page"' : ''
      return `<a href="${escapeHTML(href)}"${currentAttr}>${escapeHTML(item.label)}</a>`
    }).join('')
    html = html.replace(/<header class="site-header([^"]*)">[\s\S]*?<\/header>/, (match, cls) =>
      `<header class="site-header${cls}"><div class="wrap"><a class="brand" href="/preview/home" aria-label="Home">${brand}</a><nav class="nav" aria-label="Primary">${links}</nav></div></header>`)
  }
  // Make the original prototype's internal links stay inside the visual preview.
  html = html.replace(/href="about\.html"/g, 'href="/preview/about"')
    .replace(/href="\.\/"/g, 'href="/preview/home"')
    .replace(/href="\.\/#work"/g, 'href="/preview/home#work"')
  html = html.replace(/<script type="application\/json" id="footer-data">([\s\S]*?)<\/script>/, (match, raw) => {
    try {
      const data = JSON.parse(raw)
      if (footer?.contactHeading) data.heading = footer.contactHeading
      if (footer?.contactEmail) data.email.value = footer.contactEmail
      if (footer?.footerText) data.legal = footer.footerText
      if (footer?.socialLinks?.length) {
        data.footerLinks = footer.socialLinks.map((item) => ({
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
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
