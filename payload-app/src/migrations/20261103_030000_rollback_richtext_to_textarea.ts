/**
 * Migration: rollback richText -> textarea for Brief/Editorial body fields
 *
 * The Lexical editor silently drops body fields in the Payload admin when the
 * stored value is a plain-text varchar (which is what the postgres adapter uses
 * for richText fields). Two previous migrations attempted to coerce the data into
 * valid Lexical JSON objects but the admin editor never received them correctly.
 *
 * This migration converts the affected columns to simple textarea fields by
 * extracting the plain-text content from any stored Lexical JSON. The column type
 * (varchar) does not change -- only the Payload field type config changes and the
 * stored value is simplified to a plain string.
 *
 * Affected columns:
 *   pages_blocks_case_study_brief.body
 *   pages_blocks_case_study_brief.supporting_text
 *   pages_blocks_case_study_editorial.body
 *   _pages_v_blocks_case_study_brief.body
 *   _pages_v_blocks_case_study_brief.supporting_text
 *   _pages_v_blocks_case_study_editorial.body
 */
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

// Walk a Lexical JSON root and extract concatenated paragraph text.
// Joins paragraphs with a blank line. Handles plain-text strings as a no-op.
function extractText(raw: string | null | undefined): string | null {
  if (!raw) return raw ?? null
  const trimmed = raw.trim()
  if (!trimmed.startsWith('{')) return trimmed // already plain text

  try {
    const doc = JSON.parse(trimmed) as {
      root?: { children?: Array<{ type?: string; children?: Array<{ type?: string; text?: string }> }> }
    }
    const paragraphs =
      doc?.root?.children
        ?.map((node) => {
          if (!node.children) return ''
          return node.children
            .filter((c) => c.type === 'text' && c.text)
            .map((c) => c.text ?? '')
            .join('')
        })
        .filter(Boolean) ?? []
    return paragraphs.join('\n\n') || trimmed
  } catch {
    return trimmed
  }
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  // Use SQL to do the extraction entirely in Postgres so we don't need to
  // page through documents via payload.find.
  //
  // The subquery walks root->children (paragraph nodes) and for each one
  // concatenates its text-type children. Paragraphs are joined with \n\n.
  // Only rows whose column value starts with '{' are touched; plain text
  // and NULL rows are left untouched.

  const db = (payload.db as any).drizzle as {
    execute: (stmt: { sql: string; params?: unknown[] }) => Promise<void>
  }

  const targets: Array<[string, string]> = [
    ['pages_blocks_case_study_brief', 'body'],
    ['pages_blocks_case_study_brief', 'supporting_text'],
    ['pages_blocks_case_study_editorial', 'body'],
    ['_pages_v_blocks_case_study_brief', 'body'],
    ['_pages_v_blocks_case_study_brief', 'supporting_text'],
    ['_pages_v_blocks_case_study_editorial', 'body'],
  ]

  for (const [table, col] of targets) {
    try {
      // Build the UPDATE in a raw string so we can safely interpolate the
      // (trusted, hardcoded) table and column identifiers.
      const stmt = `
        UPDATE "${table}"
        SET "${col}" = (
          SELECT COALESCE(string_agg(para_text, E'\\n\\n' ORDER BY ord), '')
          FROM (
            SELECT
              ordinality AS ord,
              COALESCE(
                (
                  SELECT string_agg(cn->>'text', '')
                  FROM jsonb_array_elements(pn->'children') cn
                  WHERE cn->>'type' = 'text'
                ),
                ''
              ) AS para_text
            FROM jsonb_array_elements(("${col}"::jsonb)->'root'->'children')
              WITH ORDINALITY AS t(pn, ordinality)
          ) extracted
          WHERE TRIM(para_text) != ''
        )
        WHERE "${col}" IS NOT NULL
          AND TRIM("${col}") != ''
          AND LEFT(TRIM("${col}"), 1) = '{'
      `
      await db.execute({ sql: stmt })
      payload.logger.info(`[rollback-textarea] updated ${table}.${col}`)
    } catch (err) {
      // Table may not exist in all environments (e.g. no drafts saved yet).
      payload.logger.warn(`[rollback-textarea] skipped ${table}.${col}: ${String(err)}`)
    }
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Intentionally empty.
  // Converting plain text back to Lexical JSON is not safe to automate.
  // If a rollback of this migration is needed, restore from a database backup.
  payload.logger.warn('[rollback-textarea] down() is a no-op - restore from backup if needed.')
}
