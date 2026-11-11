import { renderSitePage } from '../preview/[page]/renderSitePage'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return renderSitePage('about', false)
}
