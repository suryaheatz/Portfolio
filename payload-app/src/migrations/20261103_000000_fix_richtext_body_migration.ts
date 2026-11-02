import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Converts legacy plain-text (textarea) values stored in richText (Lexical) varchar columns
 * to minimal valid Lexical JSON so the Payload admin editor renders correctly.
 *
 * Affected columns:
 *   pages_blocks_case_study_brief        .body, .supporting_text
 *   pages_blocks_case_study_editorial    .body
 *   pages_blocks_case_study_hero         .description
 *   _pages_v_ version counterparts of each
 *
 * Rows where the value already looks like JSON (starts with '{') are skipped.
 * NULL / empty rows are also skipped -- a NULL Lexical field initialises cleanly.
 *
 * The conversion splits on blank-line boundaries (\\n\\n) so multi-paragraph
 * textarea content becomes multiple Lexical paragraph nodes instead of one huge block.
 */

/** Build a Lexical-JSON text node SQL fragment */
const TEXT_NODE = (colRef: string) => `
  json_build_object(
    'detail',  0,
    'format',  0,
    'mode',    'normal',
    'style',   '',
    'text',    ${colRef},
    'type',    'text',
    'version', 1
  )
`

/**
 * Build a Lexical-JSON paragraph node containing a single text node.
 * Works on a single paragraph extracted from a unnest(regexp_split_to_array) call.
 */
const PARA_NODE = (paraRef: string) => `
  json_build_object(
    'children', json_build_array(
      json_build_object(
        'detail',  0,
        'format',  0,
        'mode',    'normal',
        'style',   '',
        'text',    trim(${paraRef}),
        'type',    'text',
        'version', 1
      )
    ),
    'direction', 'ltr',
    'format',    '',
    'indent',    0,
    'type',      'paragraph',
    'version',   1
  )
`

/**
 * Generate a SQL expression that converts a single-column plain text value
 * to a Lexical JSON root object.  The expression uses a subquery so
 * multi-paragraph text (separated by blank lines) becomes multiple paragraph nodes.
 * Used in UPDATE ... SET col = (...) WHERE ...
 */
function plainToLexJson(tableAlias: string, col: string): string {
  return `(
    SELECT json_build_object(
      'root', json_build_object(
        'children', (
          SELECT json_agg(
            json_build_object(
              'children', json_build_array(
                json_build_object(
                  'detail',  0,
                  'format',  0,
                  'mode',    'normal',
                  'style',   '',
                  'text',    trim(para),
                  'type',    'text',
                  'version', 1
                )
              ),
              'direction', 'ltr',
              'format',    '',
              'indent',    0,
              'type',      'paragraph',
              'version',   1
            )
          )
          FROM unnest(
            string_to_array(
              regexp_replace(trim(${tableAlias}.${col}), E'\\n{2,}', E'\\n\\n', 'g'),
              E'\\n\\n'
            )
          ) AS para
          WHERE trim(para) <> ''
        ),
        'direction', 'ltr',
        'format',    '',
        'indent',    0,
        'type',      'root',
        'version',   1
      )
    )::text
  )`
}

/** WHERE clause: value is non-null, non-empty, and does NOT look like JSON */
function whereNotJson(tableAlias: string, col: string): string {
  return `${tableAlias}.${col} IS NOT NULL
    AND ${tableAlias}.${col} <> ''
    AND LEFT(trim(${tableAlias}.${col}), 1) <> '{'`
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // -- published versions ----------------------------------------------
  await db.execute(sql.raw(`
    UPDATE pages_blocks_case_study_brief b
    SET    body = ${plainToLexJson('b', 'body')}
    WHERE  ${whereNotJson('b', 'body')};
  `))

  await db.execute(sql.raw(`
    UPDATE pages_blocks_case_study_brief b
    SET    supporting_text = ${plainToLexJson('b', 'supporting_text')}
    WHERE  ${whereNotJson('b', 'supporting_text')};
  `))

  await db.execute(sql.raw(`
    UPDATE pages_blocks_case_study_editorial e
    SET    body = ${plainToLexJson('e', 'body')}
    WHERE  ${whereNotJson('e', 'body')};
  `))

  await db.execute(sql.raw(`
    UPDATE pages_blocks_case_study_hero h
    SET    description = ${plainToLexJson('h', 'description')}
    WHERE  ${whereNotJson('h', 'description')};
  `))

  // -- draft/version tables --------------------------------------------
  await db.execute(sql.raw(`
    UPDATE _pages_v_blocks_case_study_brief b
    SET    body = ${plainToLexJson('b', 'body')}
    WHERE  ${whereNotJson('b', 'body')};
  `))

  await db.execute(sql.raw(`
    UPDATE _pages_v_blocks_case_study_brief b
    SET    supporting_text = ${plainToLexJson('b', 'supporting_text')}
    WHERE  ${whereNotJson('b', 'supporting_text')};
  `))

  await db.execute(sql.raw(`
    UPDATE _pages_v_blocks_case_study_editorial e
    SET    body = ${plainToLexJson('e', 'body')}
    WHERE  ${whereNotJson('e', 'body')};
  `))

  await db.execute(sql.raw(`
    UPDATE _pages_v_blocks_case_study_hero h
    SET    description = ${plainToLexJson('h', 'description')}
    WHERE  ${whereNotJson('h', 'description')};
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Data migration only -- no schema changes.
  // Reverting Lexical JSON to plain text is lossy and intentionally not provided.
  // To restore: re-enter content manually in the Payload admin.
}
