import { renderCaseStudyResponse, POST as handlePost } from './renderCaseStudy'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const POST = handlePost

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  return renderCaseStudyResponse(req, slug, true)
}
