import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Force-execute the table/enum/column renames from 20261104_000000.
 *
 * WHY THIS EXISTS
 * ---------------
 * 20261104_000000_rename_pages_media_group_tables was created via
 * `payload migrate:create`, which writes the file AND immediately inserts a
 * row in payload_migrations marking it as already applied. So `payload migrate`
 * has always skipped it -- the rename SQL never ran against the database.
 *
 * This file has a later timestamp, so it is NOT yet in payload_migrations
 * and WILL be executed by `payload migrate`.
 *
 * The logic is identical to 20261104_000000 and is fully idempotent --
 * every statement is wrapped in try/catch; if the rename was already done
 * (or the source never existed) it skips silently.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ------------------------------------------------------------------ //
  // Phase 1 -- rename enum types                                        //
  // ------------------------------------------------------------------ //
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
    } catch (_e) {
      // already renamed or never existed -- both are success states; skip
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
    } catch (_e) {
      // already renamed or never existed -- both are success states; skip
    }
  }

  // ------------------------------------------------------------------ //
  // Phase 3 -- rename slide_alignment column to slide_align             //
  // ------------------------------------------------------------------ //
  const columnRenames: Array<[string, string, string]> = [
    ['pages_blocks_cs_media_group',    'slide_alignment', 'slide_align'],
    ['_pages_v_blocks_cs_media_group', 'slide_alignment', 'slide_align'],
  ]

  for (const [table, from, to] of columnRenames) {
    try {
      await db.execute(
        sql.raw(`ALTER TABLE "${table}" RENAME COLUMN "${from}" TO "${to}"`),
      )
    } catch (_e) {
      // already renamed or column never added -- both are success states; skip
    }
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentional no-op - same reasoning as 20261104_000000.
}
