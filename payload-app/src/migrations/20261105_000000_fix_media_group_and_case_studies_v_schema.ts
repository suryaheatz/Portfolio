import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Align Neon database schema with Payload 3.92.1 ORM expectations for:
 * 1. CaseStudyMediaGroup block version tables and enum types when using a
 *    function dbName: ({ tableName }) => `${tableName...}_blocks_cs_media_group`
 * 2. CaseStudyMediaGroup.slideAlignment column name (Payload always uses
 *    snake_case field.name = 'slide_alignment' for select columns)
 * 3. _case_studies_v missing version_updated_at and version_created_at columns
 *
 * Every DDL statement is wrapped in a PostgreSQL DO block with EXCEPTION
 * handlers so the migration is 100% idempotent and never aborts the
 * surrounding transaction.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Phase 1: Rename enum types
  const enumRenames: Array<[string, string]> = [
    [
      'enum_pages_blocks_cs_media_group_slide_align',
      'enum_pages_blocks_cs_media_group_slide_alignment',
    ],
    [
      'enum_case_studies_blocks_cs_media_group_slide_align',
      'enum_case_studies_blocks_cs_media_group_slide_alignment',
    ],
    [
      'enum__pages_v_blocks_cs_media_group_layout_style',
      'enum__pages_blocks_cs_media_group_v_layout_style',
    ],
    [
      'enum__pages_v_blocks_cs_media_group_presentation',
      'enum__pages_blocks_cs_media_group_v_presentation',
    ],
    [
      'enum__pages_v_blocks_cs_media_group_grid_variant',
      'enum__pages_blocks_cs_media_group_v_grid_variant',
    ],
    [
      'enum__pages_v_blocks_cs_media_group_appearance',
      'enum__pages_blocks_cs_media_group_v_appearance',
    ],
    [
      'enum__pages_v_blocks_cs_media_group_slide_align',
      'enum__pages_blocks_cs_media_group_v_slide_alignment',
    ],
    [
      'enum__case_studies_v_blocks_cs_media_group_layout_style',
      'enum__case_studies_blocks_cs_media_group_v_layout_style',
    ],
    [
      'enum__case_studies_v_blocks_cs_media_group_presentation',
      'enum__case_studies_blocks_cs_media_group_v_presentation',
    ],
    [
      'enum__case_studies_v_blocks_cs_media_group_grid_variant',
      'enum__case_studies_blocks_cs_media_group_v_grid_variant',
    ],
    [
      'enum__case_studies_v_blocks_cs_media_group_appearance',
      'enum__case_studies_blocks_cs_media_group_v_appearance',
    ],
    [
      'enum__case_studies_v_blocks_cs_media_group_slide_align',
      'enum__case_studies_blocks_cs_media_group_v_slide_alignment',
    ],
  ]

  for (const [from, to] of enumRenames) {
    await db.execute(sql.raw(`
      DO $$
      BEGIN
        ALTER TYPE "public"."${from}" RENAME TO "${to}";
      EXCEPTION
        WHEN undefined_object THEN NULL;
        WHEN duplicate_object THEN NULL;
      END;
      $$`))
  }

  // Phase 2: Rename version tables to match Payload versionsCustomName (_..._v)
  const tableRenames: Array<[string, string]> = [
    [
      '_pages_v_blocks_cs_media_group',
      '_pages_blocks_cs_media_group_v',
    ],
    [
      '_pages_v_blocks_cs_media_group_images',
      '_pages_blocks_cs_media_group_v_images',
    ],
    [
      '_pages_v_blocks_cs_media_group_images_annotations',
      '_pages_blocks_cs_media_group_v_images_annotations',
    ],
    [
      '_case_studies_v_blocks_cs_media_group',
      '_case_studies_blocks_cs_media_group_v',
    ],
    [
      '_case_studies_v_blocks_cs_media_group_images',
      '_case_studies_blocks_cs_media_group_v_images',
    ],
    [
      '_case_studies_v_blocks_cs_media_group_images_annotations',
      '_case_studies_blocks_cs_media_group_v_images_annotations',
    ],
  ]

  for (const [from, to] of tableRenames) {
    await db.execute(sql.raw(`
      DO $$
      BEGIN
        ALTER TABLE "${from}" RENAME TO "${to}";
      EXCEPTION
        WHEN undefined_table THEN NULL;
        WHEN duplicate_table THEN NULL;
      END;
      $$`))
  }

  // Phase 3: Rename slide_align column back to slide_alignment
  const columnRenames: Array<[string, string, string]> = [
    ['pages_blocks_cs_media_group', 'slide_align', 'slide_alignment'],
    ['_pages_blocks_cs_media_group_v', 'slide_align', 'slide_alignment'],
    ['case_studies_blocks_cs_media_group', 'slide_align', 'slide_alignment'],
    ['_case_studies_blocks_cs_media_group_v', 'slide_align', 'slide_alignment'],
  ]

  for (const [table, from, to] of columnRenames) {
    await db.execute(sql.raw(`
      DO $$
      BEGIN
        ALTER TABLE "${table}" RENAME COLUMN "${from}" TO "${to}";
      EXCEPTION
        WHEN undefined_column THEN NULL;
        WHEN duplicate_column THEN NULL;
      END;
      $$`))
  }

  // Phase 4: Add missing version_updated_at and version_created_at to _case_studies_v
  await db.execute(sql.raw(`
    DO $$
    BEGIN
      ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_updated_at" timestamp(3) with time zone DEFAULT now();
      ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_created_at" timestamp(3) with time zone DEFAULT now();
    EXCEPTION
      WHEN undefined_table THEN NULL;
    END;
    $$`))
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentional no-op to prevent breaking the ORM schema alignment.
}
