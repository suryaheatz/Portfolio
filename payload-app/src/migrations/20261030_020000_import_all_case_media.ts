import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Import each currently referenced GitHub asset exactly once through Payload's R2 adapter.
 *  Existing media relationships remain intact. Failed imports remain on their GitHub fallbacks.
 *  This is intentionally non-destructive and may be retried after fixing failed assets.
 */
type AssetRow = { source_path: string; placements: string | number }
const mimeType = (path: string) => {
  const extension = path.split('.').pop()?.toLowerCase()
  if (extension === 'png') return 'image/png'
  if (extension === 'gif') return 'image/gif'
  if (extension === 'webp') return 'image/webp'
  if (extension === 'svg') return 'image/svg+xml'
  if (extension === 'jpeg' || extension === 'jpg') return 'image/jpeg'
  throw new Error('Unrecognized image type: ' + path)
}
const keyFor = (path: string) =>
  'sk-' + path.replace(/^case-studies\//, '').replace(/^public\//, '').replace(/^images\//, 'centronic-')
    .replace(/^haptix\/assets\//, 'haptix-').replace(/\//g, '-').replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const result = await db.execute(sql`
    SELECT DISTINCT source_path FROM pages_blocks_case_study_media_group_images
    WHERE media_id IS NULL AND source_path IS NOT NULL AND source_path <> ''
    ORDER BY source_path
  `)
  const sources = ((result as unknown as { rows: AssetRow[] }).rows || []).map(r => r.source_path)
  const failed: { source: string; error: string }[] = []
  let created = 0
  let reused = 0
  const worker = async (source: string) => {
    try {
      if (!/^(case-studies\/haptix\/assets\/|public\/images\/|images\/)[a-zA-Z0-9._/-]+$/.test(source) || source.includes('..'))
        throw new Error('Unsafe source path')
      const filename = keyFor(source)
      const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0 })
      let id: number | string | undefined = existing.docs[0]?.id
      if (id) reused++
      if (!id) {
        const response = await fetch('https://raw.githubusercontent.com/suryaheatz/Portfolio/main/' + source, {
          signal: AbortSignal.timeout(45000),
        })
        if (!response.ok) throw new Error('GitHub HTTP ' + response.status)
        const declared = Number(response.headers.get('content-length') || 0)
        if (declared > 20_000_000) throw new Error('File exceeds 20MB limit')
        const data = Buffer.from(await response.arrayBuffer())
        if (data.length < 100 || data.length > 20_000_000) throw new Error('Invalid file size: ' + data.length)
        const createdMedia = await payload.create({
          collection: 'media',
          data: { alt: source.split('/').pop()?.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '') || 'Case study image' },
          file: { data, mimetype: mimeType(source), name: filename, size: data.length },
          overrideAccess: true,
        })
        id = createdMedia.id
        created++
      }
      await db.execute(sql`UPDATE pages_blocks_case_study_media_group_images SET media_id = ${id} WHERE source_path = ${source} AND media_id IS NULL`)
      await db.execute(sql`UPDATE _pages_v_blocks_case_study_media_group_images SET media_id = ${id} WHERE source_path = ${source} AND media_id IS NULL`)
      payload.logger.info('Imported case image: ' + source)
    } catch (error) {
      failed.push({ source, error: String(error).slice(0,240) })
      payload.logger.error('Case image import failed: ' + source + ' ' + String(error).slice(0,240))
    }
  }
  // Bounded concurrency avoids overloading GitHub, Neon and Cloudflare's write endpoints.
  let next = 0
  await Promise.all(Array.from({ length: Math.min(4, sources.length) }, async () => {
    while (next < sources.length) {
      const source = sources[next++]
      await worker(source)
    }
  }))
  payload.logger.info('Media import batch: ' + created + ' created, ' + reused + ' reused, ' + failed.length + ' failed out of ' + sources.length)
  // Do not abort successful imports because of one unavailable source: its GitHub URL remains as fallback.
  // All failures are in Vercel migration logs for remediation.
}
export async function down(_args: MigrateDownArgs): Promise<void> {
  // Do not destroy uploaded media or relationships: files may be referenced elsewhere.
}
