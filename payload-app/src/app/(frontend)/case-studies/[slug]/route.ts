import { renderCaseStudyResponse } from '../../preview/case-studies/[slug]/renderCaseStudy'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  return renderCaseStudyResponse(req, slug, false)
}
