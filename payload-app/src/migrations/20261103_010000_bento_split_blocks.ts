import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Add four layout-specific bento grid block tables.
 * These replace the generic CaseBento block for new content;
 * CaseBento remains in the schema as a deprecated legacy block
 * so existing data is not broken.
 *
 * New blocks:
 *   bentoTwoUp   -- exactly 2 cells (minRows=maxRows=2)
 *   bentoThreeA  -- exactly 3 cells (minRows=maxRows=3)
 *   bentoThreeB  -- exactly 3 cells (minRows=maxRows=3)
 *   bentoFourUp  -- exactly 4 cells (minRows=maxRows=4)
 *
 * Each block has a parent table + a cells sub-table.
 * Version (_pages_v_) counterparts are also created.
 */

const BLOCK_DEFS = [
  { slug: 'bento_two_up',   pgSlug: 'bento_two_up'   },
  { slug: 'bento_three_a',  pgSlug: 'bento_three_a'  },
  { slug: 'bento_three_b',  pgSlug: 'bento_three_b'  },
  { slug: 'bento_four_up',  pgSlug: 'bento_four_up'  },
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // -- published versions ----------------------------------------------
  for (const { pgSlug } of BLOCK_DEFS) {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS "pages_blocks_${pgSlug}" (
        "_order"     integer  NOT NULL,
        "_parent_id" integer  NOT NULL,
        "_path"      text     NOT NULL,
        "id"         varchar  PRIMARY KEY NOT NULL,
        "eyebrow"    varchar,
        "title"      varchar,
        "subtitle"   varchar,
        "block_name" varchar
      );

      CREATE TABLE IF NOT EXISTS "pages_blocks_${pgSlug}_cells" (
        "_order"     integer  NOT NULL,
        "_parent_id" varchar  NOT NULL,
        "id"         varchar  PRIMARY KEY NOT NULL,
        "image_id"   integer,
        "caption"    varchar,
        "alt_text"   varchar
      );
    `))
  }

  // -- draft/version tables --------------------------------------------
  for (const { pgSlug } of BLOCK_DEFS) {
    await db.execute(sql.raw(`
      CREATE TABLE IF NOT EXISTS "_pages_v_blocks_${pgSlug}" (
        "_order"     integer  NOT NULL,
        "_parent_id" integer  NOT NULL,
        "_path"      text     NOT NULL,
        "id"         serial   PRIMARY KEY NOT NULL,
        "eyebrow"    varchar,
        "title"      varchar,
        "subtitle"   varchar,
        "_uuid"      varchar,
        "block_name" varchar
      );

      CREATE TABLE IF NOT EXISTS "_pages_v_blocks_${pgSlug}_cells" (
        "_order"     integer  NOT NULL,
        "_parent_id" integer  NOT NULL,
        "id"         serial   PRIMARY KEY NOT NULL,
        "image_id"   integer,
        "caption"    varchar,
        "alt_text"   varchar,
        "_uuid"      varchar
      );
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const { pgSlug } of BLOCK_DEFS) {
    await db.execute(sql.raw(`
      DROP TABLE IF EXISTS "pages_blocks_${pgSlug}_cells";
      DROP TABLE IF EXISTS "pages_blocks_${pgSlug}";
      DROP TABLE IF EXISTS "_pages_v_blocks_${pgSlug}_cells";
      DROP TABLE IF EXISTS "_pages_v_blocks_${pgSlug}";
    `))
  }
}
