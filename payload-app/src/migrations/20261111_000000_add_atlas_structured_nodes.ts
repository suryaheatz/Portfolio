import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  PRACTICE_DEFAULTS,
  TEACH_DEFAULTS,
  PLAY_DEFAULTS,
  EXPLORE_DEFAULTS,
  RECOGNITION_DEFAULTS,
  FREELANCE_DEFAULTS,
} from '../globals/atlas'

const TABLES = [
  'atlas_content_practice_nodes',
  'atlas_content_teach_nodes',
  'atlas_content_play_nodes',
  'atlas_content_explore_nodes',
  'atlas_content_recognition_nodes',
  'atlas_content_freelance_nodes',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_atlas_node_ar" AS ENUM('16 / 9', '4 / 3', '1 / 1', '3 / 4', '9 / 16');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_atlas_node_art" AS ENUM('shards', 'towers', 'form', 'facade');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  for (const tbl of TABLES) {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS "${tbl}" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL REFERENCES "atlas_content"("id") ON DELETE CASCADE,
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "node_id" varchar NOT NULL,
        "aspect_ratio" "enum_atlas_node_ar" DEFAULT '16 / 9',
        "placeholder_art" "enum_atlas_node_art" DEFAULT 'shards',
        "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
        "media_caption" varchar,
        "summary" varchar,
        "story_text" varchar,
        "metadata_text" varchar,
        "grid_column" numeric DEFAULT 2,
        "grid_span" numeric DEFAULT 1,
        "grid_row" numeric DEFAULT 7
      );
      CREATE INDEX IF NOT EXISTS "${tbl}_order_idx" ON "${tbl}" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "${tbl}_parent_id_idx" ON "${tbl}" USING btree ("_parent_id");
    `))
  }

  const seedMap = [
    { table: 'atlas_content_practice_nodes',    prefix: 'prac', rows: PRACTICE_DEFAULTS },
    { table: 'atlas_content_teach_nodes',       prefix: 'teac', rows: TEACH_DEFAULTS },
    { table: 'atlas_content_play_nodes',        prefix: 'play', rows: PLAY_DEFAULTS },
    { table: 'atlas_content_explore_nodes',     prefix: 'expl', rows: EXPLORE_DEFAULTS },
    { table: 'atlas_content_recognition_nodes', prefix: 'reco', rows: RECOGNITION_DEFAULTS },
    { table: 'atlas_content_freelance_nodes',   prefix: 'free', rows: FREELANCE_DEFAULTS },
  ]

  const escSql = (v: string | undefined) => (v ?? '').replace(/'/g, "''")

  for (const group of seedMap) {
    for (let i = 0; i < group.rows.length; i++) {
      const n = group.rows[i]
      const rowId = `at_${group.prefix}_${String(i + 1).padStart(2, '0')}`
      await db.execute(sql.raw(`
        INSERT INTO "${group.table}" (
          "_order", "_parent_id", "id", "name", "node_id", "aspect_ratio", "placeholder_art",
          "summary", "story_text", "metadata_text", "grid_column", "grid_span", "grid_row"
        )
        SELECT
          ${i + 1}, 1, '${rowId}', '${escSql(n.name)}', '${escSql(n.nodeId)}',
          '${n.aspectRatio}', '${n.placeholderArt}',
          '${escSql(n.summary)}', '${escSql(n.storyText)}', '${escSql(n.metadataText)}',
          ${n.gridColumn}, ${n.gridSpan}, ${n.gridRow}
        WHERE EXISTS (SELECT 1 FROM "atlas_content" WHERE "id" = 1)
          AND NOT EXISTS (SELECT 1 FROM "${group.table}" WHERE "id" = '${rowId}');
      `))
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const tbl of TABLES) {
    await db.execute(sql.raw(`DROP TABLE IF EXISTS "${tbl}" CASCADE;`))
  }
}
