import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Preview-only additive schema for five shared case-study blocks.
 * The original case-study production pages and main database are untouched.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_full_width_figure_background" AS ENUM('solid','blur'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_full_width_figure_background" AS ENUM('solid','blur'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_hero" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "eyebrow" varchar, "client" varchar, "period" varchar,
      "role" varchar, "title" varchar, "description" varchar, "hero_image_id" integer,
      "hero_alt" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_hero_chips" (
      "_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL, "label" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_brief" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "eyebrow" varchar, "heading" varchar, "body" varchar,
      "supporting_text" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_scope" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "eyebrow" varchar, "heading" varchar,
      "sketch_id" integer, "sketch_alt" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_scope_facts" (
      "_order" integer NOT NULL, "_parent_id" varchar NOT NULL, "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar, "value" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_editorial" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "eyebrow" varchar, "heading" varchar,
      "body" varchar, "image_id" integer, "image_alt" varchar, "caption" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_full_width_figure" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL, "image_id" integer, "alt" varchar, "caption_label" varchar,
      "caption" varchar, "background" "enum_pages_blocks_full_width_figure_background" DEFAULT 'solid', "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_hero" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "eyebrow" varchar, "client" varchar, "period" varchar,
      "role" varchar, "title" varchar, "description" varchar, "hero_image_id" integer,
      "hero_alt" varchar, "_uuid" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_hero_chips" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" serial PRIMARY KEY NOT NULL,
      "label" varchar, "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_brief" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "eyebrow" varchar, "heading" varchar, "body" varchar,
      "supporting_text" varchar, "_uuid" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_scope" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "eyebrow" varchar, "heading" varchar,
      "sketch_id" integer, "sketch_alt" varchar, "_uuid" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_scope_facts" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "id" serial PRIMARY KEY NOT NULL,
      "label" varchar, "value" varchar, "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_editorial" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "eyebrow" varchar, "heading" varchar,
      "body" varchar, "image_id" integer, "image_alt" varchar, "caption" varchar,
      "_uuid" varchar, "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_full_width_figure" (
      "_order" integer NOT NULL, "_parent_id" integer NOT NULL, "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "image_id" integer, "alt" varchar,
      "caption_label" varchar, "caption" varchar,
      "background" "enum__pages_v_blocks_full_width_figure_background" DEFAULT 'solid',
      "_uuid" varchar, "block_name" varchar
    );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_pages_v_blocks_full_width_figure";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_study_editorial";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_study_scope_facts";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_study_scope";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_study_brief";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_study_hero_chips";
    DROP TABLE IF EXISTS "_pages_v_blocks_case_study_hero";
    DROP TABLE IF EXISTS "pages_blocks_full_width_figure";
    DROP TABLE IF EXISTS "pages_blocks_case_study_editorial";
    DROP TABLE IF EXISTS "pages_blocks_case_study_scope_facts";
    DROP TABLE IF EXISTS "pages_blocks_case_study_scope";
    DROP TABLE IF EXISTS "pages_blocks_case_study_brief";
    DROP TABLE IF EXISTS "pages_blocks_case_study_hero_chips";
    DROP TABLE IF EXISTS "pages_blocks_case_study_hero";
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_full_width_figure_background";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_full_width_figure_background";
  `)
}
