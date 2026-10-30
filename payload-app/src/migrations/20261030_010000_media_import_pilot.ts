import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Idempotent pilot for real Payload -> R2 uploads.
 * Source images remain available at GitHub until R2 URLs and records are verified.
 */
const sources = [
  { source: 'case-studies/haptix/assets/screens/screen-01.jpg', name: 'sk-haptix-screen-01.jpg', alt: 'Fav · Climate, idle', type: 'image/jpeg' },
  { source: 'case-studies/haptix/assets/styling/demonstrator-render.jpg', name: 'sk-haptix-demonstrator-render.jpg', alt: 'Haptix demonstrator render', type: 'image/jpeg' },
  { source: 'public/images/centronic-ambient.gif', name: 'sk-centronic-ambient.gif', alt: 'Ambient lighting in Centronic demonstrator', type: 'image/gif' },
]

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  for (const item of sources) {
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: item.name } }, limit: 1, depth: 0 })
    let id = existing.docs[0]?.id
    if (!id) {
      const url = 'https://raw.githubusercontent.com/suryaheatz/Portfolio/main/' + item.source
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
      if (!response.ok) throw new Error('GitHub source image unavailable (' + response.status + '): ' + item.source)
      const data = Buffer.from(await response.arrayBuffer())
      if (!data.length || data.length > 15_000_000) throw new Error('Invalid source file size: ' + item.source)
      const media = await payload.create({
        collection: 'media',
        data: { alt: item.alt },
        file: { data, mimetype: item.type, name: item.name, size: data.length },
        overrideAccess: true,
      })
      id = media.id
    }
    await db.execute(sql`UPDATE "pages_blocks_case_study_media_group_images" SET "media_id" = ${id} WHERE "source_path" = ${item.source};`)
    await db.execute(sql`UPDATE "_pages_v_blocks_case_study_media_group_images" SET "media_id" = ${id} WHERE "source_path" = ${item.source};`)
  }
}
export async function down(_args: MigrateDownArgs): Promise<void> {
  // Deliberately do not delete shared Media files or existing page relations during rollback.
}
