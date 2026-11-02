import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: new_block_tables
 * Date: 2026-11-02
 *
 * Creates the database tables for five new block types added to case-study.ts
 * without corresponding migrations (commits 9268ad6-cf5072f on integration/payload-cms):
 *   - caseBento          (+ cells nested array)
 *   - beforeAfterSlider  (flat fields only)
 *   - annotatedMedia     (+ hotspots nested array)
 *   - pullquote          (flat fields only)
 *   - slideLayout        (flat fields only)
 *
 * Root cause of the missing-pages symptom:
 *   Payload's postgres adapter JOINs every registered block table when querying
 *   the Pages collection. A JOIN against a non-existent table throws
 *   "relation does not exist" at query time, which surfaces as ?notFound=1
 *   in the Payload admin for all pages.
 *
 * All CREATE statements are idempotent (IF NOT EXISTS / EXCEPTION WHEN
 * duplicate_object). FK ON DELETE CASCADE is added from the start on nested-
 * array _parent_id columns, consistent with 20261030_090000_fix_nested_block_cascade.
 *
 * Safety constraints honoured:
 *   - Does NOT modify pages, _pages_v, media, or any existing block tables.
 *   - Does NOT touch Centronic (id=1) or Haptix (id=2) content rows.
 *   - All statements are additive; down() drops only what up() creates.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // -- ENUMs ------------------------------------------------------------------
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_case_bento_layout"
        AS ENUM('bento-2','bento-3a','bento-3b','bento-4');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_case_bento_layout"
        AS ENUM('bento-2','bento-3a','bento-3b','bento-4');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_pullquote_variant"
        AS ENUM('light','dark');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_pullquote_variant"
        AS ENUM('light','dark');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_slide_layout_variant"
        AS ENUM('light','dark');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_slide_layout_variant"
        AS ENUM('light','dark');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // -- caseBento --------------------------------------------------------------
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_case_bento" (
      "_order"     integer  NOT NULL,
      "_parent_id" integer  NOT NULL,
      "_path"      text     NOT NULL,
      "id"         varchar  PRIMARY KEY NOT NULL,
      "eyebrow"    varchar,
      "title"      varchar,
      "subtitle"   varchar,
      "layout"     "enum_pages_blocks_case_bento_layout",
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_case_bento_cells" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "image_id"   integer,
      "caption"    varchar,
      "alt_text"   varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_bento" (
      "_order"     integer  NOT NULL,
      "_parent_id" integer  NOT NULL,
      "_path"      text     NOT NULL,
      "id"         serial   PRIMARY KEY NOT NULL,
      "eyebrow"    varchar,
      "title"      varchar,
      "subtitle"   varchar,
      "layout"     "enum__pages_v_blocks_case_bento_layout",
      "_uuid"      varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_bento_cells" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial  PRIMARY KEY NOT NULL,
      "image_id"   integer,
      "caption"    varchar,
      "alt_text"   varchar,
      "_uuid"      varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_case_bento_cells"
        ADD CONSTRAINT "fk_case_bento_cells_parent"
        FOREIGN KEY ("_parent_id")
        REFERENCES "pages_blocks_case_bento"("id")
        ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // -- beforeAfterSlider ------------------------------------------------------
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_before_after_slider" (
      "_order"          integer NOT NULL,
      "_parent_id"      integer NOT NULL,
      "_path"           text    NOT NULL,
      "id"              varchar PRIMARY KEY NOT NULL,
      "before_image_id" integer,
      "before_label"    varchar,
      "after_image_id"  integer,
      "after_label"     varchar,
      "caption"         varchar,
      "block_name"      varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_before_after_slider" (
      "_order"          integer NOT NULL,
      "_parent_id"      integer NOT NULL,
      "_path"           text    NOT NULL,
      "id"              serial  PRIMARY KEY NOT NULL,
      "before_image_id" integer,
      "before_label"    varchar,
      "after_image_id"  integer,
      "after_label"     varchar,
      "caption"         varchar,
      "_uuid"           varchar,
      "block_name"      varchar
    );
  `)

  // -- annotatedMedia ---------------------------------------------------------
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_annotated_media" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "image_id"   integer,
      "alt_text"   varchar,
      "caption"    varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "pages_blocks_annotated_media_hotspots" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "x"          numeric,
      "y"          numeric,
      "number"     numeric,
      "heading"    varchar,
      "body"       varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_annotated_media" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         serial  PRIMARY KEY NOT NULL,
      "image_id"   integer,
      "alt_text"   varchar,
      "caption"    varchar,
      "_uuid"      varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_annotated_media_hotspots" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial  PRIMARY KEY NOT NULL,
      "x"          numeric,
      "y"          numeric,
      "number"     numeric,
      "heading"    varchar,
      "body"       varchar,
      "_uuid"      varchar
    );
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_annotated_media_hotspots"
        ADD CONSTRAINT "fk_annotated_media_hotspots_parent"
        FOREIGN KEY ("_parent_id")
        REFERENCES "pages_blocks_annotated_media"("id")
        ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // -- pullquote --------------------------------------------------------------
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_pullquote" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "_path"       text    NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "quote"       varchar,
      "attribution" varchar,
      "variant"     "enum_pages_blocks_pullquote_variant" DEFAULT 'light',
      "block_name"  varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_pullquote" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "_path"       text    NOT NULL,
      "id"          serial  PRIMARY KEY NOT NULL,
      "quote"       varchar,
      "attribution" varchar,
      "variant"     "enum__pages_v_blocks_pullquote_variant" DEFAULT 'light',
      "_uuid"       varchar,
      "block_name"  varchar
    );
  `)

  // -- slideLayout ------------------------------------------------------------
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pages_blocks_slide_layout" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "eyebrow"    varchar,
      "heading"    varchar,
      "body"       varchar,
      "image_id"   integer,
      "alt_text"   varchar,
      "variant"    "enum_pages_blocks_slide_layout_variant" DEFAULT 'light',
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_slide_layout" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"      text    NOT NULL,
      "id"         serial  PRIMARY KEY NOT NULL,
      "eyebrow"    varchar,
      "heading"    varchar,
      "body"       varchar,
      "image_id"   integer,
      "alt_text"   varchar,
      "variant"    "enum__pages_v_blocks_slide_layout_variant" DEFAULT 'light',
      "_uuid"      varchar,
      "block_name" varchar
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_case_bento_cells"
      DROP CONSTRAINT IF EXISTS "fk_case_bento_cells_parent";
    ALTER TABLE "pages_blocks_annotated_media_hotspots"
      DROP CONSTRAINT IF EXISTS "fk_annotated_media_hotspots_parent";

    DROP TABLE IF EXISTS "_pages_v_blocks_slide_layout";
    DROP TABLE IF EXISTS "pages_blocks_slide_layout";
    DROP TABLE IF EXISTS "_pages_v_blocks_pullquote";
    DROP TABLE IF EXISTS "pages_blocks_pullquote";
    DROP TABLE IF EXISTS "_pages_v_blocks_annotated_media_hotspots";
    DROP TABLE IF EXISTS "_pages_v_blocks_annotated_media";
    DROP TABLE IF EXISTS "pages_blocks_annotated_media_hotspots";
    DROP TABLE IF EXISTS "pages_blocks_annotated_media";
    DROP TABLE IF EXISTS "_pages_v_blocks_before_after_slider";
    DROP TABLE IF EXISTS "pages_blocks_before_after_slider";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_bento_cells";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_bento";
    DROP TABLE IF EXISTS "pages_blocks_case_bento_cells";
    DROP TABLE IF EXISTS "pages_blocks_case_bento";

    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_slide_layout_variant";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_slide_layout_variant";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_pullquote_variant";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_pullquote_variant";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_case_bento_layout";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_case_bento_layout";
  `)
}
