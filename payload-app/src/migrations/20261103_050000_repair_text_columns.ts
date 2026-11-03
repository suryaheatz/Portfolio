/**
 * REPAIR MIGRATION: ensure narrative_body and narrative_sub exist
 * in CaseStudyBrief tables with plain-text content.
 *
 * Root cause chain:
 *   000000  Converted body/supporting_text to Lexical JSON (correct sql.raw) [worked]
 *   030000  Tried to extract plain text via WRONG Drizzle API
 *           (db.drizzle.execute({ sql: string }) -- not the sql.raw() tagged template)
 *           Result: all 6 column operations silently failed; columns still hold Lexical JSON
 *   040000  Renamed body->narrative_body, supporting_text->narrative_sub [worked]
 *
 * Current DB state:
 *   narrative_body / narrative_sub columns exist but contain Lexical JSON strings,
 *   not plain text.  When Payload reads a type:'text' field whose DB value is a
 *   Lexical JSON string it may deserialise it to a JS object, which causes the React
 *   text-input to receive an object instead of a string, triggering a silent error
 *   boundary and hiding the field entirely in the admin UI.
 *
 * This migration (idempotent):
 *   A. Ensures narrative_body / narrative_sub columns exist in both live and
 *      _pages_v_ tables via PL/pgSQL conditional DDL.
 *   B. Extracts plain text from any Lexical JSON value using the CORRECT sql.raw() API.
 */

import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

const TABLES = [
  'pages_blocks_case_study_brief',
  '_pages_v_blocks_case_study_brief',
] as const

/** PL/pgSQL: add newCol if missing; rename oldCol->newCol if oldCol exists, else ADD COLUMN */
function ensureColumnSQL(table: string, newCol: string, oldCol: string): string {
  return `
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name   = '${table}'
          AND column_name  = '${newCol}'
      ) THEN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name   = '${table}'
            AND column_name  = '${oldCol}'
        ) THEN
          ALTER TABLE "${table}" RENAME COLUMN "${oldCol}" TO "${newCol}";
        ELSE
          ALTER TABLE "${table}" ADD COLUMN "${newCol}" varchar;
        END IF;
      END IF;
    END $$;
  `
}

/**
 * UPDATE rows where the column contains Lexical JSON (starts with '{'),
 * extracting concatenated paragraph text.  Rows with plain text are untouched.
 */
function extractPlainTextSQL(table: string, col: string): string {
  return `
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
      AND LEFT(TRIM("${col}"), 1) = '{';
  `
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    // Step A: guarantee columns exist (idempotent via PL/pgSQL)
    await db.execute(sql.raw(ensureColumnSQL(table, 'narrative_body', 'body')))
    await db.execute(sql.raw(ensureColumnSQL(table, 'narrative_sub', 'supporting_text')))

    // Step B: extract plain text from any Lexical JSON (correct sql.raw API)
    for (const col of ['narrative_body', 'narrative_sub'] as const) {
      try {
        await db.execute(sql.raw(extractPlainTextSQL(table, col)))
      } catch (err) {
        // Log but do not abort -- rows with already-plain text will pass the
        // LEFT(...) = '{' guard and be skipped; only malformed JSON would error here
        console.warn(
          `[repair-text-columns] ${table}.${col} extraction warning: ${String(err)}`,
        )
      }
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentionally empty.
  // Column DDL and data rewrites cannot be safely reversed without the original
  // DB snapshot.  Restore from backup if a rollback is required.
}
