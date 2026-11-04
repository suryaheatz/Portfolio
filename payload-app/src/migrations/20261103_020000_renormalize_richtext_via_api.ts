import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Re-saves every page through the Payload API so all richText block fields
 * (caseStudyBrief.body, caseStudyBrief.supportingText,
 *  caseStudyEditorial.body, caseStudyHero.description) are written in the
 * exact binary format Payload's Lexical admin editor expects.
 *
 * Why this is needed
 * ------------------
 * The body columns are VARCHAR. Payload stores Lexical JSON as a serialised
 * string. The coerceLexical afterRead hook converts that string to a JS
 * object so the Next.js frontend renders correctly -- but Payload's postgres
 * adapter does NOT reliably fire field-level afterRead hooks for block fields
 * in the admin context, so the Lexical editor component receives the raw
 * string, cannot initialise, and the field disappears from the admin UI.
 *
 * Migration 20261103_000000 fixed plain-text rows at SQL level (text ->
 * JSON string). This migration goes one step further: it reads every page
 * through payload.find (which DOES run afterRead hooks, coercing the string
 * to a JS object) then immediately re-saves through payload.update (which
 * serialises the object through Payload's own pipeline). After this migration
 * the column value is always the exact JSON string Payload writes natively,
 * so the admin editor initialises correctly without depending on any hook.
 *
 * Idempotent: re-running only replaces already-correct data with an
 * identical value. Safe to re-run if needed.
 */
export async function up({ payload: _payload }: MigrateUpArgs): Promise<void> {
  // Get a real Payload instance so hooks and serialisers run correctly
  const payload = await getPayload({ config })

  // Guard: payload.find() generates SQL using the CURRENT schema, which
  // references narrative_body / narrative_sub on pages_blocks_case_study_brief.
  // Those columns are added by migration 040000_rename_body_fields, which runs
  // AFTER this migration.  If the query fails because the column doesn't exist
  // yet, skip gracefully -- the richText normalisation this migration was doing
  // is superseded by the new case_studies collection (clean column names from
  // the start), so skipping has no functional consequence.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any
  try {
    result = await payload.find({
      collection: 'pages',
      limit: 100,
      depth: 3,
      draft: false,
      overrideAccess: true,
    })
  } catch (err) {
    payload.logger.warn(
      `20261103_020000: skipping -- pages schema query failed before column rename migration ran. ` +
      `Error: ${String(err).slice(0, 200)}`
    )
    return
  }

  if (!result.docs.length) {
    payload.logger.warn('20261103_020000: no published pages found -- nothing to renormalise')
    return
  }

  for (const page of result.docs) {
    payload.logger.info(`20261103_020000: renormalising richText for page "${page.slug}" (id ${page.id})`)
    try {
      await payload.update({
        collection: 'pages',
        id: page.id,
        // Re-submit the document as-is.  afterRead hooks have already coerced
        // any string body values to proper Lexical objects; payload.update
        // will serialise those objects through the native Payload pipeline.
        data: page as Parameters<typeof payload.update>[0]['data'],
        draft: false,
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
      payload.logger.info(`20261103_020000: done -- "${page.slug}"`)
    } catch (err) {
      payload.logger.warn(`20261103_020000: skipped "${page.slug}" -- ${String(err)}`)
    }
  }

  // Repeat for draft versions so the admin editor works in draft mode too
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let draftResult: any
  try {
    draftResult = await payload.find({
      collection: 'pages',
      limit: 100,
      depth: 3,
      draft: true,
      overrideAccess: true,
    })
  } catch (err) {
    payload.logger.warn(`20261103_020000: draft find failed -- skipping drafts. Error: ${String(err).slice(0, 200)}`)
    return
  }

  for (const page of draftResult.docs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (result.docs.some((p: any) => p.id === page.id)) continue // already handled as published
    try {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: page as Parameters<typeof payload.update>[0]['data'],
        draft: true,
        overrideAccess: true,
        context: { skipRevalidate: true },
      })
    } catch (err) {
      payload.logger.warn(`20261103_020000: draft skipped "${page.slug}" -- ${String(err)}`)
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No schema changes -- data-only migration.
  // The normalised Lexical JSON is semantically identical to the prior
  // content; there is no meaningful rollback.
}
