/**
 * Migration: fix_nested_block_cascade
 * Date: 2026-10-30
 *
 * Root cause fixed:
 *   `upsertRow` (dist/upsertRow/index.js ~line 537) correctly DELETEs top-level
 *   block rows (pages_blocks_case_study_hero, _scope, _media_group, etc.) WHERE
 *   _parent_id = $page_id on every publish, but the nested array tables below
 *   them carry NO FK ON DELETE CASCADE constraints. When insertArrays()
 *   re-inserts those nested rows with preserved UUIDs it gets a 23505 PRIMARY
 *   KEY violation — caught by the outer handler and reported (misleadingly) as
 *   { path: 'id', tableName: 'pages' }.
 *
 * Corrective change:
 *   Part A — clean all orphaned rows in the 4 nested tables (rows whose
 *             _parent_id no longer exists in the parent block table).
 *   Part B — add FK REFERENCES … ON DELETE CASCADE on each nested table's
 *             _parent_id column so future top-level block DELETEs automatically
 *             cascade to children.
 *
 * Safety constraints honoured:
 *   - Does NOT modify pages, media, _pages_v, or R2 assets.
 *   - Does NOT touch Centronic (id=1) or Haptix (id=2) canonical prose.
 *   - Orphan rows deleted are invisible to Payload (their parent blocks are
 *     already absent) and are the direct cause of the 23505 error.
 *   - Rollback tables are created BEFORE any deletion so down() can restore.
 */
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Rollback snapshots (created before any deletion) ───────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "_rollback_hero_chips"
      AS SELECT * FROM "pages_blocks_case_study_hero_chips";

    CREATE TABLE IF NOT EXISTS "_rollback_scope_facts"
      AS SELECT * FROM "pages_blocks_case_study_scope_facts";

    CREATE TABLE IF NOT EXISTS "_rollback_media_images"
      AS SELECT * FROM "pages_blocks_case_study_media_group_images";

    CREATE TABLE IF NOT EXISTS "_rollback_annotations"
      AS SELECT * FROM "pages_blocks_case_study_media_group_images_annotations";
  `)

  // ── Part A: orphan cleanup ──────────────────────────────────────────────────
  // Delete deepest first to avoid FK order issues after Part B is applied on
  // any subsequent run. For this initial run there are no FKs yet, so order
  // only matters logically; we still go deepest-first for correctness.

  // annotations whose parent image no longer exists
  await db.execute(sql`
    DELETE FROM "pages_blocks_case_study_media_group_images_annotations"
    WHERE "_parent_id" NOT IN (
      SELECT "id" FROM "pages_blocks_case_study_media_group_images"
    );
  `)

  // images whose parent media_group block no longer exists
  await db.execute(sql`
    DELETE FROM "pages_blocks_case_study_media_group_images"
    WHERE "_parent_id" NOT IN (
      SELECT "id" FROM "pages_blocks_case_study_media_group"
    );
  `)

  // facts whose parent scope block no longer exists
  await db.execute(sql`
    DELETE FROM "pages_blocks_case_study_scope_facts"
    WHERE "_parent_id" NOT IN (
      SELECT "id" FROM "pages_blocks_case_study_scope"
    );
  `)

  // chips whose parent hero block no longer exists
  await db.execute(sql`
    DELETE FROM "pages_blocks_case_study_hero_chips"
    WHERE "_parent_id" NOT IN (
      SELECT "id" FROM "pages_blocks_case_study_hero"
    );
  `)

  // ── Part B: add FK ON DELETE CASCADE ───────────────────────────────────────
  // Idempotent: each ADD CONSTRAINT is guarded by a DO block that skips on
  // duplicate_object so the migration can be re-run safely.

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_case_study_hero_chips"
        ADD CONSTRAINT "fk_hero_chips_parent"
        FOREIGN KEY ("_parent_id")
        REFERENCES "pages_blocks_case_study_hero"("id")
        ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_case_study_scope_facts"
        ADD CONSTRAINT "fk_scope_facts_parent"
        FOREIGN KEY ("_parent_id")
        REFERENCES "pages_blocks_case_study_scope"("id")
        ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_case_study_media_group_images"
        ADD CONSTRAINT "fk_media_images_parent"
        FOREIGN KEY ("_parent_id")
        REFERENCES "pages_blocks_case_study_media_group"("id")
        ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "pages_blocks_case_study_media_group_images_annotations"
        ADD CONSTRAINT "fk_annotations_parent"
        FOREIGN KEY ("_parent_id")
        REFERENCES "pages_blocks_case_study_media_group_images"("id")
        ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop constraints first (must be absent before restoring orphan rows)
  await db.execute(sql`
    ALTER TABLE "pages_blocks_case_study_hero_chips"
      DROP CONSTRAINT IF EXISTS "fk_hero_chips_parent";
    ALTER TABLE "pages_blocks_case_study_scope_facts"
      DROP CONSTRAINT IF EXISTS "fk_scope_facts_parent";
    ALTER TABLE "pages_blocks_case_study_media_group_images"
      DROP CONSTRAINT IF EXISTS "fk_media_images_parent";
    ALTER TABLE "pages_blocks_case_study_media_group_images_annotations"
      DROP CONSTRAINT IF EXISTS "fk_annotations_parent";
  `)

  // Restore orphaned rows from snapshots (ON CONFLICT DO NOTHING is safe;
  // rows already present — e.g. from a subsequent successful publish — are kept)
  await db.execute(sql`
    INSERT INTO "pages_blocks_case_study_hero_chips"
      SELECT * FROM "_rollback_hero_chips"
      ON CONFLICT (id) DO NOTHING;

    INSERT INTO "pages_blocks_case_study_scope_facts"
      SELECT * FROM "_rollback_scope_facts"
      ON CONFLICT (id) DO NOTHING;

    INSERT INTO "pages_blocks_case_study_media_group_images"
      SELECT * FROM "_rollback_media_images"
      ON CONFLICT (id) DO NOTHING;

    INSERT INTO "pages_blocks_case_study_media_group_images_annotations"
      SELECT * FROM "_rollback_annotations"
      ON CONFLICT (id) DO NOTHING;

    DROP TABLE IF EXISTS "_rollback_hero_chips";
    DROP TABLE IF EXISTS "_rollback_scope_facts";
    DROP TABLE IF EXISTS "_rollback_media_images";
    DROP TABLE IF EXISTS "_rollback_annotations";
  `)
}
