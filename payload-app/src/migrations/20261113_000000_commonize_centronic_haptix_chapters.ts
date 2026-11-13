import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Ensure Centronic (id=1) and Haptix (id=2) have their hero images and scope sketches linked
  await db.execute(sql`
    UPDATE case_studies_blocks_case_study_hero SET hero_image_id = 43 WHERE _parent_id = 1 AND hero_image_id IS NULL;
    UPDATE case_studies_blocks_case_study_scope SET sketch_id = 42 WHERE _parent_id = 1 AND sketch_id IS NULL;
    UPDATE case_studies_blocks_case_study_hero SET hero_image_id = 3 WHERE _parent_id = 2 AND hero_image_id IS NULL;
    UPDATE case_studies_blocks_case_study_scope SET sketch_id = 38 WHERE _parent_id = 2 AND sketch_id IS NULL;
  `)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: preserves cleaned chapter blocks and media associations
}
