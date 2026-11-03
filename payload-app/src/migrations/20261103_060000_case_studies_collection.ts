import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Creates the `case_studies` collection with all its block tables.
 *
 * This is a clean-slate implementation: the new collection tables use the
 * correct column names from the TypeScript block definitions, with no
 * migration-history baggage from the `pages_blocks_*` tables.
 *
 * Notable differences from the equivalent `pages_blocks_*` tables:
 *   - case_study_brief:  uses `narrative_body` / `narrative_sub`  (not body/supporting_text)
 *   - case_study_editorial: uses `editorial_body`                  (not body)
 *   - All ENUMs are prefixed `case_studies_` instead of `pages_`
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // -- Step 1: ENUMs ----------------------------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_full_width_figure_background" AS ENUM('solid', 'blur'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_full_width_figure_background" AS ENUM('solid', 'blur'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_case_bento_layout" AS ENUM('bento-2', 'bento-3a', 'bento-3b', 'bento-4'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_case_bento_layout" AS ENUM('bento-2', 'bento-3a', 'bento-3b', 'bento-4'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_pullquote_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_pullquote_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_slide_layout_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_slide_layout_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_case_study_media_group_layout_style" AS ENUM('evidence', 'grid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_case_study_media_group_layout_style" AS ENUM('evidence', 'grid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_case_study_media_group_presentation" AS ENUM('tooltip', 'adaptive', 'slides', 'annotated', 'evolution', 'figures'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_case_study_media_group_presentation" AS ENUM('tooltip', 'adaptive', 'slides', 'annotated', 'evolution', 'figures'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_case_study_media_group_grid_variant" AS ENUM('two', 'three', 'traditional', 'asymmetric'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_case_study_media_group_grid_variant" AS ENUM('two', 'three', 'traditional', 'asymmetric'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_case_study_media_group_appearance" AS ENUM('inherit', 'light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_case_study_media_group_appearance" AS ENUM('inherit', 'light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_blocks_case_study_media_group_slide_alignment" AS ENUM('textLeft', 'imageLeft'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_blocks_case_study_media_group_slide_alignment" AS ENUM('textLeft', 'imageLeft'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `))

  // -- Step 2: Main collection tables ----------------------------------------
  await db.execute(sql.raw(`
    CREATE TABLE IF NOT EXISTS "case_studies" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "eyebrow" varchar,
      "role" varchar,
      "period" varchar,
      "hero_image_id" integer,
      "_status" "enum_case_studies_status" DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "_case_studies_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_slug" varchar,
      "version_eyebrow" varchar,
      "version_role" varchar,
      "version_period" varchar,
      "version_hero_image_id" integer,
      "version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "snapshot" boolean,
      "autosave" boolean,
      "latest" boolean
    );
  `))

  // -- Step 3: Live block tables ----------------------------------------------
  await db.execute(sql.raw(`
    -- CaseStudyHero
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "client" varchar,
      "period" varchar,
      "role" varchar,
      "title" varchar,
      "description" varchar,
      "hero_image_id" integer,
      "hero_alt" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_hero_chips" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar
    );

    -- CaseStudyBrief (clean column names: narrative_body / narrative_sub)
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_brief" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "narrative_body" varchar,
      "narrative_sub" varchar,
      "block_name" varchar
    );

    -- CaseStudyScope
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_scope" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "sketch_id" integer,
      "sketch_alt" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_scope_facts" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "value" varchar
    );

    -- CaseStudyEditorial (clean column name: editorial_body)
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_editorial" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "editorial_body" varchar,
      "image_id" integer,
      "image_alt" varchar,
      "caption" varchar,
      "block_name" varchar
    );

    -- FullWidthFigure
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_full_width_figure" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "alt" varchar,
      "caption_label" varchar,
      "caption" varchar,
      "background" "enum_case_studies_blocks_full_width_figure_background" DEFAULT 'solid',
      "block_name" varchar
    );

    -- BentoTwoUp
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_two_up" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_two_up_cells" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar
    );

    -- BentoThreeA
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_three_a" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_three_a_cells" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar
    );

    -- BentoThreeB
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_three_b" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_three_b_cells" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar
    );

    -- BentoFourUp
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_four_up" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_bento_four_up_cells" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar
    );

    -- CaseBento (legacy)
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_bento" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "layout" "enum_case_studies_blocks_case_bento_layout" NOT NULL,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_bento_cells" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar
    );

    -- BeforeAfterSlider
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_before_after_slider" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "before_image_id" integer,
      "before_label" varchar DEFAULT 'Before',
      "after_image_id" integer,
      "after_label" varchar DEFAULT 'After',
      "caption" varchar,
      "block_name" varchar
    );

    -- AnnotatedMedia
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_annotated_media" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "image_id" integer,
      "alt_text" varchar,
      "caption" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_annotated_media_hotspots" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "x" numeric,
      "y" numeric,
      "number" numeric,
      "heading" varchar,
      "body" varchar
    );

    -- Pullquote
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_pullquote" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "quote" jsonb,
      "attribution" varchar,
      "variant" "enum_case_studies_blocks_pullquote_variant" DEFAULT 'light',
      "block_name" varchar
    );

    -- SlideLayout
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_slide_layout" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "body" jsonb,
      "image_id" integer,
      "alt_text" varchar,
      "variant" "enum_case_studies_blocks_slide_layout_variant" DEFAULT 'light',
      "block_name" varchar
    );

    -- CaseStudyMediaGroup
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_media_group" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "section_heading" varchar,
      "section_key" varchar,
      "layout_style" "enum_case_studies_blocks_case_study_media_group_layout_style" DEFAULT 'evidence',
      "presentation" "enum_case_studies_blocks_case_study_media_group_presentation",
      "grid_variant" "enum_case_studies_blocks_case_study_media_group_grid_variant" DEFAULT 'two',
      "appearance" "enum_case_studies_blocks_case_study_media_group_appearance" DEFAULT 'inherit',
      "slide_alignment" "enum_case_studies_blocks_case_study_media_group_slide_alignment" DEFAULT 'textLeft',
      "show_section_heading" boolean DEFAULT true,
      "show_numbers" boolean DEFAULT false,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_media_group_images" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
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
    );
    CREATE TABLE IF NOT EXISTS "case_studies_blocks_case_study_media_group_images_annotations" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" numeric,
      "x" numeric,
      "y" numeric,
      "heading" varchar,
      "body" varchar
    );
  `))

  // -- Step 4: Version block tables -------------------------------------------
  await db.execute(sql.raw(`
    -- _case_studies_v_blocks_case_study_hero
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_hero" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "client" varchar,
      "period" varchar,
      "role" varchar,
      "title" varchar,
      "description" varchar,
      "hero_image_id" integer,
      "hero_alt" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_hero_chips" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_case_study_brief
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_brief" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "narrative_body" varchar,
      "narrative_sub" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- _case_studies_v_blocks_case_study_scope
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_scope" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "sketch_id" integer,
      "sketch_alt" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_scope_facts" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "label" varchar,
      "value" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_case_study_editorial
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_editorial" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "editorial_body" varchar,
      "image_id" integer,
      "image_alt" varchar,
      "caption" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- _case_studies_v_blocks_full_width_figure
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_full_width_figure" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "alt" varchar,
      "caption_label" varchar,
      "caption" varchar,
      "background" "enum__case_studies_v_blocks_full_width_figure_background" DEFAULT 'solid',
      "_uuid" varchar,
      "block_name" varchar
    );

    -- _case_studies_v_blocks_bento_two_up
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_two_up" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_two_up_cells" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_bento_three_a
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_three_a" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_three_a_cells" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_bento_three_b
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_three_b" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_three_b_cells" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_bento_four_up
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_four_up" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_bento_four_up_cells" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_case_bento
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_bento" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "title" varchar,
      "subtitle" varchar,
      "layout" "enum__case_studies_v_blocks_case_bento_layout" NOT NULL,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_bento_cells" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "caption" varchar,
      "alt_text" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_before_after_slider
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_before_after_slider" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "before_image_id" integer,
      "before_label" varchar DEFAULT 'Before',
      "after_image_id" integer,
      "after_label" varchar DEFAULT 'After',
      "caption" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );

    -- _case_studies_v_blocks_annotated_media
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_annotated_media" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "image_id" integer,
      "alt_text" varchar,
      "caption" varchar,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_annotated_media_hotspots" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "x" numeric,
      "y" numeric,
      "number" numeric,
      "heading" varchar,
      "body" varchar,
      "_uuid" varchar
    );

    -- _case_studies_v_blocks_pullquote
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_pullquote" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "quote" jsonb,
      "attribution" varchar,
      "variant" "enum__case_studies_v_blocks_pullquote_variant" DEFAULT 'light',
      "_uuid" varchar,
      "block_name" varchar
    );

    -- _case_studies_v_blocks_slide_layout
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_slide_layout" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "heading" varchar,
      "body" jsonb,
      "image_id" integer,
      "alt_text" varchar,
      "variant" "enum__case_studies_v_blocks_slide_layout_variant" DEFAULT 'light',
      "_uuid" varchar,
      "block_name" varchar
    );

    -- _case_studies_v_blocks_case_study_media_group
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_media_group" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "section_heading" varchar,
      "section_key" varchar,
      "layout_style" "enum__case_studies_v_blocks_case_study_media_group_layout_style" DEFAULT 'evidence',
      "presentation" "enum__case_studies_v_blocks_case_study_media_group_presentation",
      "grid_variant" "enum__case_studies_v_blocks_case_study_media_group_grid_variant" DEFAULT 'two',
      "appearance" "enum__case_studies_v_blocks_case_study_media_group_appearance" DEFAULT 'inherit',
      "slide_alignment" "enum__case_studies_v_blocks_case_study_media_group_slide_alignment" DEFAULT 'textLeft',
      "show_section_heading" boolean DEFAULT true,
      "show_numbers" boolean DEFAULT false,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_media_group_images" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
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
    );
    CREATE TABLE IF NOT EXISTS "_case_studies_v_blocks_case_study_media_group_images_annotations" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "number" numeric,
      "x" numeric,
      "y" numeric,
      "heading" varchar,
      "body" varchar,
      "_uuid" varchar
    );
  `))

  // -- Step 5: Constraints + indexes on main tables ---------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_slug_idx') THEN
        CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_case_studies_v_parent_id_idx" ON "_case_studies_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_case_studies_v_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
    CREATE INDEX IF NOT EXISTS "_case_studies_v_autosave_idx" ON "_case_studies_v" USING btree ("autosave");
  `))

  // -- Step 6: FK constraints on main tables ---------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_hero_image_id_media_id_fk') THEN
        ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_hero_image_id_media_id_fk"
          FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_parent_id_case_studies_id_fk') THEN
        ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk"
          FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_version_hero_image_id_media_id_fk') THEN
        ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_hero_image_id_media_id_fk"
          FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
  `))

  // -- Step 7: Block table FK constraints ------------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_hero_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_hero" ADD CONSTRAINT "case_studies_blocks_case_study_hero_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_hero_chips_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_hero_chips" ADD CONSTRAINT "case_studies_blocks_case_study_hero_chips_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_case_study_hero"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_brief_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_brief" ADD CONSTRAINT "case_studies_blocks_case_study_brief_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_scope_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_scope" ADD CONSTRAINT "case_studies_blocks_case_study_scope_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_scope_facts_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_scope_facts" ADD CONSTRAINT "case_studies_blocks_case_study_scope_facts_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_case_study_scope"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_editorial_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_editorial" ADD CONSTRAINT "case_studies_blocks_case_study_editorial_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_full_width_figure_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_full_width_figure" ADD CONSTRAINT "case_studies_blocks_full_width_figure_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_two_up_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_two_up" ADD CONSTRAINT "case_studies_blocks_bento_two_up_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_two_up_cells_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_two_up_cells" ADD CONSTRAINT "case_studies_blocks_bento_two_up_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_bento_two_up"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_three_a_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_three_a" ADD CONSTRAINT "case_studies_blocks_bento_three_a_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_three_a_cells_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_three_a_cells" ADD CONSTRAINT "case_studies_blocks_bento_three_a_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_bento_three_a"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_three_b_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_three_b" ADD CONSTRAINT "case_studies_blocks_bento_three_b_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_three_b_cells_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_three_b_cells" ADD CONSTRAINT "case_studies_blocks_bento_three_b_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_bento_three_b"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_four_up_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_four_up" ADD CONSTRAINT "case_studies_blocks_bento_four_up_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_bento_four_up_cells_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_bento_four_up_cells" ADD CONSTRAINT "case_studies_blocks_bento_four_up_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_bento_four_up"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_bento_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_bento" ADD CONSTRAINT "case_studies_blocks_case_bento_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_bento_cells_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_bento_cells" ADD CONSTRAINT "case_studies_blocks_case_bento_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_case_bento"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_before_after_slider_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_before_after_slider" ADD CONSTRAINT "case_studies_blocks_before_after_slider_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_annotated_media_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_annotated_media" ADD CONSTRAINT "case_studies_blocks_annotated_media_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_annotated_media_hotspots_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_annotated_media_hotspots" ADD CONSTRAINT "case_studies_blocks_annotated_media_hotspots_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_annotated_media"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_pullquote_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_pullquote" ADD CONSTRAINT "case_studies_blocks_pullquote_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_slide_layout_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_slide_layout" ADD CONSTRAINT "case_studies_blocks_slide_layout_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_media_group_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_media_group" ADD CONSTRAINT "case_studies_blocks_case_study_media_group_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_media_group_images_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_media_group_images" ADD CONSTRAINT "case_studies_blocks_case_study_media_group_images_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_case_study_media_group"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'case_studies_blocks_case_study_media_group_images_annotations_parent_id_fk') THEN
        ALTER TABLE "case_studies_blocks_case_study_media_group_images_annotations" ADD CONSTRAINT "case_studies_blocks_case_study_media_group_images_annotations_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies_blocks_case_study_media_group_images"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
  `))

  // -- Step 8: Version block FK constraints ----------------------------------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_hero_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_hero" ADD CONSTRAINT "_case_studies_v_blocks_case_study_hero_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_hero_chips_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_hero_chips" ADD CONSTRAINT "_case_studies_v_blocks_case_study_hero_chips_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_case_study_hero"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_brief_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_brief" ADD CONSTRAINT "_case_studies_v_blocks_case_study_brief_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_scope_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_scope" ADD CONSTRAINT "_case_studies_v_blocks_case_study_scope_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_scope_facts_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_scope_facts" ADD CONSTRAINT "_case_studies_v_blocks_case_study_scope_facts_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_case_study_scope"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_editorial_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_editorial" ADD CONSTRAINT "_case_studies_v_blocks_case_study_editorial_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_full_width_figure_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_full_width_figure" ADD CONSTRAINT "_case_studies_v_blocks_full_width_figure_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_two_up_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_two_up" ADD CONSTRAINT "_case_studies_v_blocks_bento_two_up_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_two_up_cells_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_two_up_cells" ADD CONSTRAINT "_case_studies_v_blocks_bento_two_up_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_bento_two_up"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_three_a_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_three_a" ADD CONSTRAINT "_case_studies_v_blocks_bento_three_a_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_three_a_cells_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_three_a_cells" ADD CONSTRAINT "_case_studies_v_blocks_bento_three_a_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_bento_three_a"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_three_b_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_three_b" ADD CONSTRAINT "_case_studies_v_blocks_bento_three_b_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_three_b_cells_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_three_b_cells" ADD CONSTRAINT "_case_studies_v_blocks_bento_three_b_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_bento_three_b"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_four_up_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_four_up" ADD CONSTRAINT "_case_studies_v_blocks_bento_four_up_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_bento_four_up_cells_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_bento_four_up_cells" ADD CONSTRAINT "_case_studies_v_blocks_bento_four_up_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_bento_four_up"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_bento_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_bento" ADD CONSTRAINT "_case_studies_v_blocks_case_bento_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_bento_cells_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_bento_cells" ADD CONSTRAINT "_case_studies_v_blocks_case_bento_cells_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_case_bento"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_before_after_slider_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_before_after_slider" ADD CONSTRAINT "_case_studies_v_blocks_before_after_slider_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_annotated_media_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_annotated_media" ADD CONSTRAINT "_case_studies_v_blocks_annotated_media_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_annotated_media_hotspots_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_annotated_media_hotspots" ADD CONSTRAINT "_case_studies_v_blocks_annotated_media_hotspots_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_annotated_media"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_pullquote_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_pullquote" ADD CONSTRAINT "_case_studies_v_blocks_pullquote_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_slide_layout_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_slide_layout" ADD CONSTRAINT "_case_studies_v_blocks_slide_layout_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_media_group_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_media_group" ADD CONSTRAINT "_case_studies_v_blocks_case_study_media_group_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_media_group_images_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_media_group_images" ADD CONSTRAINT "_case_studies_v_blocks_case_study_media_group_images_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_case_study_media_group"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_case_studies_v_blocks_case_study_media_group_images_annotations_parent_id_fk') THEN
        ALTER TABLE "_case_studies_v_blocks_case_study_media_group_images_annotations" ADD CONSTRAINT "_case_studies_v_blocks_case_study_media_group_images_annotations_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v_blocks_case_study_media_group_images"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;
  `))

  // -- Step 9: payload_locked_documents_rels -- add case_studies_id -----------
  await db.execute(sql.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'payload_locked_documents_rels' AND column_name = 'case_studies_id') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_case_studies_fk') THEN
        ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk"
          FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_case_studies_id_idx"
      ON "payload_locked_documents_rels" USING btree ("case_studies_id");
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop in reverse dependency order
  await db.execute(sql.raw(`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "case_studies_id";

    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_media_group_images_annotations" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_media_group_images" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_media_group" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_slide_layout" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_pullquote" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_annotated_media_hotspots" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_annotated_media" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_before_after_slider" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_bento_cells" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_bento" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_four_up_cells" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_four_up" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_three_b_cells" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_three_b" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_three_a_cells" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_three_a" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_two_up_cells" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_bento_two_up" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_full_width_figure" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_editorial" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_scope_facts" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_scope" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_brief" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_hero_chips" CASCADE;
    DROP TABLE IF EXISTS "_case_studies_v_blocks_case_study_hero" CASCADE;

    DROP TABLE IF EXISTS "case_studies_blocks_case_study_media_group_images_annotations" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_media_group_images" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_media_group" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_slide_layout" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_pullquote" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_annotated_media_hotspots" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_annotated_media" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_before_after_slider" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_bento_cells" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_bento" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_four_up_cells" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_four_up" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_three_b_cells" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_three_b" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_three_a_cells" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_three_a" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_two_up_cells" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_bento_two_up" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_full_width_figure" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_editorial" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_scope_facts" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_scope" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_brief" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_hero_chips" CASCADE;
    DROP TABLE IF EXISTS "case_studies_blocks_case_study_hero" CASCADE;

    DROP TABLE IF EXISTS "_case_studies_v" CASCADE;
    DROP TABLE IF EXISTS "case_studies" CASCADE;

    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_case_study_media_group_slide_alignment";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_case_study_media_group_slide_alignment";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_case_study_media_group_appearance";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_case_study_media_group_appearance";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_case_study_media_group_grid_variant";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_case_study_media_group_grid_variant";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_case_study_media_group_presentation";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_case_study_media_group_presentation";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_case_study_media_group_layout_style";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_case_study_media_group_layout_style";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_slide_layout_variant";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_slide_layout_variant";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_pullquote_variant";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_pullquote_variant";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_case_bento_layout";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_case_bento_layout";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_blocks_full_width_figure_background";
    DROP TYPE IF EXISTS "public"."enum_case_studies_blocks_full_width_figure_background";
    DROP TYPE IF EXISTS "public"."enum__case_studies_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_case_studies_status";
  `))
}
