import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Rename pages_blocks_case_study_media_group -> pages_blocks_cs_media_group
 *
 * Root cause
 * ----------
 * Commit f3a1b36 added dbName:'cs_media_group' to the CaseStudyMediaGroup
 * block to shorten the identifier below PostgreSQL's 63-char hard limit for
 * the new case_studies collection. However, dbName on a Block applies to ALL
 * collections that use that block -- including 'pages'. Payload's ORM now
 * generates SQL using the new names (pages_blocks_cs_media_group, etc.), but
 * the actual Neon DB objects were created by earlier migrations using the
 * original block slug, so they still have the old names
 * (pages_blocks_case_study_media_group, etc.). The resulting LEFT JOIN on a
 * non-existent table fails silently, causing blank admin content panels for
 * Pages, Dashboard, and Case Studies.
 *
 * Fix
 * ---
 * This migration aligns the Neon DB with what the TypeScript schema now
 * expects, in three phases:
 *   1. Rename all 10 enum types (block slug changed, plus field-level
 *      slide_alignment -> slide_align dbName rename)
 *   2. Rename all 6 tables (main + images + images_annotations, pages + _pages_v_)
 *   3. Rename the slide_alignment column to slide_align in the two renamed tables
 *
 * Every statement is wrapped in a try/catch so the migration is fully
 * idempotent -- it skips gracefully if already applied, if the source
 * object does not exist, or if the target already exists.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ------------------------------------------------------------------ //
  // Phase 1 -- rename enum types                                        //
  // ------------------------------------------------------------------ //
  // 'case_study_media_group' -> 'cs_media_group' in the type name, and
  // 'slide_alignment' -> 'slide_align' for the slide-alignment enum.
  const enumRenames: Array<[string, string]> = [
    [
      'enum_pages_blocks_case_study_media_group_layout_style',
      'enum_pages_blocks_cs_media_group_layout_style',
    ],
    [
      'enum__pages_v_blocks_case_study_media_group_layout_style',
      'enum__pages_v_blocks_cs_media_group_layout_style',
    ],
    [
      'enum_pages_blocks_case_study_media_group_presentation',
      'enum_pages_blocks_cs_media_group_presentation',
    ],
    [
      'enum__pages_v_blocks_case_study_media_group_presentation',
      'enum__pages_v_blocks_cs_media_group_presentation',
    ],
    [
      'enum_pages_blocks_case_study_media_group_grid_variant',
      'enum_pages_blocks_cs_media_group_grid_variant',
    ],
    [
      'enum__pages_v_blocks_case_study_media_group_grid_variant',
      'enum__pages_v_blocks_cs_media_group_grid_variant',
    ],
    [
      'enum_pages_blocks_case_study_media_group_appearance',
      'enum_pages_blocks_cs_media_group_appearance',
    ],
    [
      'enum__pages_v_blocks_case_study_media_group_appearance',
      'enum__pages_v_blocks_cs_media_group_appearance',
    ],
    // slide_alignment field also has dbName:'slide_align' (commit 8b26817),
    // so both the block segment AND the field segment change.
    [
      'enum_pages_blocks_case_study_media_group_slide_alignment',
      'enum_pages_blocks_cs_media_group_slide_align',
    ],
    [
      'enum__pages_v_blocks_case_study_media_group_slide_alignment',
      'enum__pages_v_blocks_cs_media_group_slide_align',
    ],
  ]

  for (const [from, to] of enumRenames) {
    try {
      await db.execute(sql.raw(`ALTER TYPE "public"."${from}" RENAME TO "${to}"`))
    } catch (err: unknown) {
      const msg = String(err)
      // 42704 = undefined_object (source type not found)
      // 42710 = duplicate_object (target already exists)
      if (
        msg.includes('does not exist') ||
        msg.includes('already exists') ||
        msg.includes('42704') ||
        msg.includes('42710')
      ) {
        // already renamed or never created -- skip
      } else {
        throw err
      }
    }
  }

  // ------------------------------------------------------------------ //
  // Phase 2 -- rename tables                                            //
  // ------------------------------------------------------------------ //
  const tableRenames: Array<[string, string]> = [
    [
      'pages_blocks_case_study_media_group',
      'pages_blocks_cs_media_group',
    ],
    [
      'pages_blocks_case_study_media_group_images',
      'pages_blocks_cs_media_group_images',
    ],
    [
      'pages_blocks_case_study_media_group_images_annotations',
      'pages_blocks_cs_media_group_images_annotations',
    ],
    [
      '_pages_v_blocks_case_study_media_group',
      '_pages_v_blocks_cs_media_group',
    ],
    [
      '_pages_v_blocks_case_study_media_group_images',
      '_pages_v_blocks_cs_media_group_images',
    ],
    [
      '_pages_v_blocks_case_study_media_group_images_annotations',
      '_pages_v_blocks_cs_media_group_images_annotations',
    ],
  ]

  for (const [from, to] of tableRenames) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "${from}" RENAME TO "${to}"`))
    } catch (err: unknown) {
      const msg = String(err)
      // 42P01 = undefined_table  42P07 = duplicate_table
      if (
        msg.includes('does not exist') ||
        msg.includes('already exists') ||
        msg.includes('42P01') ||
        msg.includes('42P07')
      ) {
        // already renamed or never created -- skip
      } else {
        throw err
      }
    }
  }

  // ------------------------------------------------------------------ //
  // Phase 3 -- rename slide_alignment column to slide_align             //
  // ------------------------------------------------------------------ //
  // The dbName:'slide_align' on the slideAlignment field changes the
  // expected column name. Tables are now using the cs_media_group names
  // from Phase 2 above.
  const columnRenames: Array<[string, string, string]> = [
    ['pages_blocks_cs_media_group',    'slide_alignment', 'slide_align'],
    ['_pages_v_blocks_cs_media_group', 'slide_alignment', 'slide_align'],
  ]

  for (const [table, from, to] of columnRenames) {
    try {
      await db.execute(
        sql.raw(`ALTER TABLE "${table}" RENAME COLUMN "${from}" TO "${to}"`),
      )
    } catch (err: unknown) {
      const msg = String(err)
      // 42703 = undefined_column  42701 = duplicate_column
      if (
        msg.includes('does not exist') ||
        msg.includes('already exists') ||
        msg.includes('42703') ||
        msg.includes('42701')
      ) {
        // already renamed or column never added -- skip
      } else {
        throw err
      }
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentionally a no-op. Rolling back these renames would leave the ORM
  // unable to find the tables and blank the admin again. Manual rollback
  // only: revert the dbName overrides in case-study.ts and write a
  // compensating migration to restore the old names.
}
