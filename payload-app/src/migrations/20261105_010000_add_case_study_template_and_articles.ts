import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_template" AS ENUM('narrative', 'narrative-slides', 'visual-showcase'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_version_template" AS ENUM('narrative', 'narrative-slides', 'visual-showcase'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_full_width_figure_background" AS ENUM('solid', 'blur'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_case_bento_layout" AS ENUM('bento-2', 'bento-3a', 'bento-3b', 'bento-4'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_pullquote_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_slide_layout_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_cs_media_group_layout_style" AS ENUM('evidence', 'grid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_cs_media_group_presentation" AS ENUM('tooltip', 'adaptive', 'slides', 'annotated', 'evolution', 'figures'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_cs_media_group_grid_variant" AS ENUM('two', 'three', 'traditional', 'asymmetric'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_cs_media_group_appearance" AS ENUM('inherit', 'light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_cs_media_group_slide_alignment" AS ENUM('textLeft', 'imageLeft'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_blocks_work_showcase_projects_display_variant" AS ENUM('large', 'small'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_blocks_full_width_figure_background" AS ENUM('solid', 'blur'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_blocks_case_bento_layout" AS ENUM('bento-2', 'bento-3a', 'bento-3b', 'bento-4'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_blocks_pullquote_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_blocks_slide_layout_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_blocks_cs_media_group_v_layout_style" AS ENUM('evidence', 'grid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_blocks_cs_media_group_v_presentation" AS ENUM('tooltip', 'adaptive', 'slides', 'annotated', 'evolution', 'figures'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_blocks_cs_media_group_v_grid_variant" AS ENUM('two', 'three', 'traditional', 'asymmetric'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_blocks_cs_media_group_v_appearance" AS ENUM('inherit', 'light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_blocks_cs_media_group_v_slide_alignment" AS ENUM('textLeft', 'imageLeft'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_blocks_work_showcase_projects_display_variant" AS ENUM('large', 'small'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "template" "enum_case_studies_template" DEFAULT 'narrative';`)
  await db.execute(sql`ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_template" "enum__case_studies_v_version_template" DEFAULT 'narrative';`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_study_hero_chips" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "label" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_study_hero" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "client" varchar,
  "period" varchar,
  "role" varchar,
  "title" varchar,
  "description" jsonb,
  "hero_image_id" integer,
  "hero_alt" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_study_brief" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "narrative_body" varchar,
  "narrative_sub" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_study_scope_facts" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "label" varchar,
  "value" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_study_scope" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "sketch_id" integer,
  "sketch_alt" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_study_editorial" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "editorial_body" varchar,
  "image_id" integer,
  "image_alt" varchar,
  "caption" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_full_width_figure" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "alt" varchar,
  "caption_label" varchar,
  "caption" varchar,
  "background" "enum_articles_blocks_full_width_figure_background" DEFAULT 'solid',
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_two_up_cells" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_two_up" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_three_a_cells" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_three_a" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_three_b_cells" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_three_b" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_four_up_cells" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_bento_four_up" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_bento_cells" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_case_bento" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "layout" "enum_articles_blocks_case_bento_layout",
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_before_after_slider" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "before_image_id" integer,
  "before_label" varchar DEFAULT 'Before',
  "after_image_id" integer,
  "after_label" varchar DEFAULT 'After',
  "caption" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_annotated_media_hotspots" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "x" numeric,
  "y" numeric,
  "number" numeric,
  "heading" varchar,
  "body" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_annotated_media" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "image_id" integer,
  "alt_text" varchar,
  "caption" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_pullquote" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "quote" jsonb,
  "attribution" varchar,
  "variant" "enum_articles_blocks_pullquote_variant" DEFAULT 'light',
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_slide_layout" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "body" jsonb,
  "image_id" integer,
  "alt_text" varchar,
  "variant" "enum_articles_blocks_slide_layout_variant" DEFAULT 'light',
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_cs_media_group_images_annotations" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "number" numeric,
  "x" numeric,
  "y" numeric,
  "heading" varchar,
  "body" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_cs_media_group_images" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "source_path" varchar,
  "source_url" varchar,
  "alt" varchar,
  "image_name" varchar,
  "eyebrow" varchar,
  "title" varchar,
  "caption" varchar,
  "description" varchar,
  "credit" varchar,
  "show_eyebrow" boolean DEFAULT false,
  "show_title" boolean DEFAULT false,
  "show_caption" boolean DEFAULT true,
  "show_description" boolean DEFAULT false,
  "show_credit" boolean DEFAULT false,
  "media_id" integer
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_cs_media_group" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "section_heading" varchar,
  "section_key" varchar,
  "layout_style" "enum_articles_blocks_cs_media_group_layout_style" DEFAULT 'evidence',
  "presentation" "enum_articles_blocks_cs_media_group_presentation" DEFAULT 'tooltip',
  "grid_variant" "enum_articles_blocks_cs_media_group_grid_variant" DEFAULT 'two',
  "appearance" "enum_articles_blocks_cs_media_group_appearance" DEFAULT 'inherit',
  "slide_alignment" "enum_articles_blocks_cs_media_group_slide_alignment" DEFAULT 'textLeft',
  "show_section_heading" boolean DEFAULT true,
  "show_numbers" boolean DEFAULT false,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_hero_card_headline_lines" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "text" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_hero_card" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "eyebrow" varchar,
  "supporting_text" varchar,
  "media_id" integer,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_work_showcase_projects" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "title" varchar,
  "subtitle" varchar,
  "href" varchar,
  "thumbnail_id" integer,
  "display_variant" "enum_articles_blocks_work_showcase_projects_display_variant"
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_work_showcase" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "heading" varchar DEFAULT 'Selected Work',
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_awards_marquee_rows_items" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "text" varchar,
  "link" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_awards_marquee_rows" (
  "_order" integer NOT NULL,
  "_parent_id" varchar NOT NULL,
  "id" varchar PRIMARY KEY
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles_blocks_awards_marquee" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" varchar PRIMARY KEY,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "articles" (
  "id" serial PRIMARY KEY,
  "title" varchar,
  "slug" varchar,
  "category" varchar,
  "reading_time" varchar,
  "subtitle" varchar,
  "cover_image_id" integer,
  "updated_at" timestamp(3) with time zone NOT NULL,
  "created_at" timestamp(3) with time zone NOT NULL,
  "_status" "enum_articles_status" DEFAULT 'draft'
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_study_hero_chips" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "label" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_study_hero" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "client" varchar,
  "period" varchar,
  "role" varchar,
  "title" varchar,
  "description" jsonb,
  "hero_image_id" integer,
  "hero_alt" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_study_brief" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "narrative_body" varchar,
  "narrative_sub" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_study_scope_facts" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "label" varchar,
  "value" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_study_scope" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "sketch_id" integer,
  "sketch_alt" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_study_editorial" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "editorial_body" varchar,
  "image_id" integer,
  "image_alt" varchar,
  "caption" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_full_width_figure" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "image_id" integer,
  "alt" varchar,
  "caption_label" varchar,
  "caption" varchar,
  "background" "enum__articles_v_blocks_full_width_figure_background" DEFAULT 'solid',
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_two_up_cells" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_two_up" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_three_a_cells" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_three_a" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_three_b_cells" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_three_b" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_four_up_cells" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_bento_four_up" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_bento_cells" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "image_id" integer,
  "caption" varchar,
  "alt_text" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_case_bento" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "title" varchar,
  "subtitle" varchar,
  "layout" "enum__articles_v_blocks_case_bento_layout",
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_before_after_slider" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "before_image_id" integer,
  "before_label" varchar DEFAULT 'Before',
  "after_image_id" integer,
  "after_label" varchar DEFAULT 'After',
  "caption" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_annotated_media_hotspots" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "x" numeric,
  "y" numeric,
  "number" numeric,
  "heading" varchar,
  "body" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_annotated_media" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "image_id" integer,
  "alt_text" varchar,
  "caption" varchar,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_pullquote" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "quote" jsonb,
  "attribution" varchar,
  "variant" "enum__articles_v_blocks_pullquote_variant" DEFAULT 'light',
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_slide_layout" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "heading" varchar,
  "body" jsonb,
  "image_id" integer,
  "alt_text" varchar,
  "variant" "enum__articles_v_blocks_slide_layout_variant" DEFAULT 'light',
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_blocks_cs_media_group_v_images_annotations" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "number" numeric,
  "x" numeric,
  "y" numeric,
  "heading" varchar,
  "body" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_blocks_cs_media_group_v_images" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "source_path" varchar,
  "source_url" varchar,
  "alt" varchar,
  "image_name" varchar,
  "eyebrow" varchar,
  "title" varchar,
  "caption" varchar,
  "description" varchar,
  "credit" varchar,
  "show_eyebrow" boolean DEFAULT false,
  "show_title" boolean DEFAULT false,
  "show_caption" boolean DEFAULT true,
  "show_description" boolean DEFAULT false,
  "show_credit" boolean DEFAULT false,
  "media_id" integer,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_blocks_cs_media_group_v" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "section_heading" varchar,
  "section_key" varchar,
  "layout_style" "enum__articles_blocks_cs_media_group_v_layout_style" DEFAULT 'evidence',
  "presentation" "enum__articles_blocks_cs_media_group_v_presentation" DEFAULT 'tooltip',
  "grid_variant" "enum__articles_blocks_cs_media_group_v_grid_variant" DEFAULT 'two',
  "appearance" "enum__articles_blocks_cs_media_group_v_appearance" DEFAULT 'inherit',
  "slide_alignment" "enum__articles_blocks_cs_media_group_v_slide_alignment" DEFAULT 'textLeft',
  "show_section_heading" boolean DEFAULT true,
  "show_numbers" boolean DEFAULT false,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_hero_card_headline_lines" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "text" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_hero_card" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "eyebrow" varchar,
  "supporting_text" varchar,
  "media_id" integer,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_work_showcase_projects" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "title" varchar,
  "subtitle" varchar,
  "href" varchar,
  "thumbnail_id" integer,
  "display_variant" "enum__articles_v_blocks_work_showcase_projects_display_variant",
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_work_showcase" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "heading" varchar DEFAULT 'Selected Work',
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_awards_marquee_rows_items" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "text" varchar,
  "link" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_awards_marquee_rows" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v_blocks_awards_marquee" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "_path" varchar NOT NULL,
  "id" serial PRIMARY KEY,
  "_uuid" varchar,
  "block_name" varchar
);`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_articles_v" (
  "id" serial PRIMARY KEY,
  "parent_id" integer,
  "version_title" varchar,
  "version_slug" varchar,
  "version_category" varchar,
  "version_reading_time" varchar,
  "version_subtitle" varchar,
  "version_cover_image_id" integer,
  "version_updated_at" timestamp(3) with time zone,
  "version_created_at" timestamp(3) with time zone,
  "version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  "created_at" timestamp(3) with time zone NOT NULL,
  "updated_at" timestamp(3) with time zone NOT NULL,
  "latest" boolean
);`)
  await db.execute(sql`ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "articles_id" integer;`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: non-destructive schema addition for CaseStudies.template and Articles collection
}
