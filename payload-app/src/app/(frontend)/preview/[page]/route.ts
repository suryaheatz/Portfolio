import { renderSitePage } from './renderSitePage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_req: Request, context: { params: Promise<{ page: string }> }) {
  const { page } = await context.params
  if (page !== 'home' && page !== 'about') return new Response('Not found', { status: 404 })
  return renderSitePage(page, true)
}
