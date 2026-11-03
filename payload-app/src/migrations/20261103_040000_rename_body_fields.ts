import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Rename body/supportingText columns in CaseStudyBrief and CaseStudyEditorial
 * to avoid Payload admin field-name collision with AnnotatedMedia.hotspots.body
 * (textarea) and HeroCard.supportingText (textarea) registered in the same collection.
 *
 * CaseStudyBrief:
 *   body           -> narrative_body
 *   supporting_text -> narrative_sub
 *
 * CaseStudyEditorial:
 *   body           -> editorial_body
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const renames: Array<{ table: string; from: string; to: string }> = [
    // Brief -- live
    { table: 'pages_blocks_case_study_brief', from: 'body',            to: 'narrative_body' },
    { table: 'pages_blocks_case_study_brief', from: 'supporting_text', to: 'narrative_sub'  },
    // Brief -- versions
    { table: '_pages_v_blocks_case_study_brief', from: 'body',            to: 'narrative_body' },
    { table: '_pages_v_blocks_case_study_brief', from: 'supporting_text', to: 'narrative_sub'  },
    // Editorial -- live
    { table: 'pages_blocks_case_study_editorial', from: 'body', to: 'editorial_body' },
    // Editorial -- versions
    { table: '_pages_v_blocks_case_study_editorial', from: 'body', to: 'editorial_body' },
  ]

  for (const { table, from, to } of renames) {
    try {
      await db.execute(sql.raw(`
        ALTER TABLE "${table}" RENAME COLUMN "${from}" TO "${to}"
      `))
      console.log(`Renamed ${table}.${from} -> ${to}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      // Column already renamed or table does not exist - safe to skip
      if (msg.includes('does not exist') || msg.includes('already exists')) {
        console.warn(`Skip ${table}.${from}: ${msg}`)
      } else {
        throw err
      }
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverse: rename back to original column names
  const renames: Array<{ table: string; from: string; to: string }> = [
    { table: 'pages_blocks_case_study_brief', from: 'narrative_body', to: 'body' },
    { table: 'pages_blocks_case_study_brief', from: 'narrative_sub',  to: 'supporting_text' },
    { table: '_pages_v_blocks_case_study_brief', from: 'narrative_body', to: 'body' },
    { table: '_pages_v_blocks_case_study_brief', from: 'narrative_sub',  to: 'supporting_text' },
    { table: 'pages_blocks_case_study_editorial', from: 'editorial_body', to: 'body' },
    { table: '_pages_v_blocks_case_study_editorial', from: 'editorial_body', to: 'body' },
  ]

  for (const { table, from, to } of renames) {
    try {
      await db.execute(sql.raw(`
        ALTER TABLE "${table}" RENAME COLUMN "${from}" TO "${to}"
      `))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('does not exist') || msg.includes('already exists')) {
        console.warn(`Skip down ${table}.${from}: ${msg}`)
      } else {
        throw err
      }
    }
  }
}
