import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_projects_layout" AS ENUM('wide', 'narrow');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_awards_row" AS ENUM('1', '2');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_home_page_awards_type" AS ENUM('preview', 'cta');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    CREATE TABLE IF NOT EXISTS "home_page" (
      "id" serial PRIMARY KEY NOT NULL,
      "skip_intro_in_preview" boolean DEFAULT false,
      "webgl_line_one" varchar DEFAULT 'I decode',
      "webgl_line_two" varchar DEFAULT 'Problems',
      "webgl_line_three" varchar DEFAULT 'I unlock',
      "webgl_line_four" varchar DEFAULT 'Value',
      "star_greeting" varchar DEFAULT 'Hi, I''m Surya. Sun, actually.',
      "hero_line_one" varchar DEFAULT 'Temporary',
      "hero_line_two" varchar DEFAULT 'hero statement,',
      "hero_line_three" varchar DEFAULT 'three lines.',
      "hero_meta_left" varchar DEFAULT 'Product Designer  -  Bengaluru, India',
      "hero_meta_right" varchar DEFAULT 'Scroll',
      "hero_media_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "hero_media_caption" varchar DEFAULT 'Hero media placeholder  -  16:9',
      "work_heading" varchar DEFAULT 'Selected Work',
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS "home_page_projects" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "home_page"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "case_study_slug" varchar,
      "category" varchar DEFAULT 'UX Design',
      "role" varchar DEFAULT 'Lead Designer',
      "year" varchar DEFAULT '2026',
      "layout" "enum_home_page_projects_layout" DEFAULT 'wide',
      "image_id" integer REFERENCES "media"("id") ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS "home_page_awards" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "home_page"("id") ON DELETE CASCADE,
      "id" varchar PRIMARY KEY NOT NULL,
      "row_number" "enum_home_page_awards_row" DEFAULT '1',
      "item_type" "enum_home_page_awards_type" DEFAULT 'preview',
      "label" varchar NOT NULL,
      "cta_text" varchar,
      "href" varchar DEFAULT '/awards',
      "preview_label_one" varchar DEFAULT 'Award 01',
      "preview_label_two" varchar DEFAULT 'Award 02',
      "preview_label_three" varchar DEFAULT 'Award 03',
      "preview_image_one_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "preview_image_two_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
      "preview_image_three_id" integer REFERENCES "media"("id") ON DELETE SET NULL
    );

    INSERT INTO "home_page" ("id", "skip_intro_in_preview", "webgl_line_one", "webgl_line_two", "webgl_line_three", "webgl_line_four", "star_greeting", "hero_line_one", "hero_line_two", "hero_line_three", "hero_meta_left", "hero_meta_right", "work_heading")
    SELECT 1, false, 'I decode', 'Problems', 'I unlock', 'Value', 'Hi, I''m Surya. Sun, actually.', 'Temporary', 'hero statement,', 'three lines.', 'Product Designer  -  Bengaluru, India', 'Scroll', 'Selected Work'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page" WHERE "id" = 1);

    INSERT INTO "home_page_projects" ("_order", "_parent_id", "id", "title", "case_study_slug", "category", "role", "year", "layout")
    SELECT 1, 1, 'hp_proj_01', 'Centronic MMA', 'centronic', 'Autonomous HMI', 'Sr. UX Designer', '2020', 'wide'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_projects" WHERE "id" = 'hp_proj_01');

    INSERT INTO "home_page_projects" ("_order", "_parent_id", "id", "title", "case_study_slug", "category", "role", "year", "layout")
    SELECT 2, 1, 'hp_proj_02', 'Haptix Thumbwheel', 'haptix', 'Tactile Automotive', 'Senior UX Designer', '2020', 'narrow'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_projects" WHERE "id" = 'hp_proj_02');

    INSERT INTO "home_page_projects" ("_order", "_parent_id", "id", "title", "case_study_slug", "category", "role", "year", "layout")
    SELECT 3, 1, 'hp_proj_03', 'Project title three', '', 'Category placeholder', 'Role', '2025', 'narrow'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_projects" WHERE "id" = 'hp_proj_03');

    INSERT INTO "home_page_projects" ("_order", "_parent_id", "id", "title", "case_study_slug", "category", "role", "year", "layout")
    SELECT 4, 1, 'hp_proj_04', 'Project title four', '', 'Category placeholder', 'Role', '2024', 'wide'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_projects" WHERE "id" = 'hp_proj_04');

    INSERT INTO "home_page_projects" ("_order", "_parent_id", "id", "title", "case_study_slug", "category", "role", "year", "layout")
    SELECT 5, 1, 'hp_proj_05', 'Project title five', '', 'Category placeholder', 'Role', '2024', 'wide'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_projects" WHERE "id" = 'hp_proj_05');

    INSERT INTO "home_page_projects" ("_order", "_parent_id", "id", "title", "case_study_slug", "category", "role", "year", "layout")
    SELECT 6, 1, 'hp_proj_06', 'Project title six', '', 'Category placeholder', 'Role', '2023', 'narrow'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_projects" WHERE "id" = 'hp_proj_06');

    INSERT INTO "home_page_awards" ("_order", "_parent_id", "id", "row_number", "item_type", "label", "href", "preview_label_one", "preview_label_two", "preview_label_three")
    SELECT 1, 1, 'hp_aw_01', '1', 'preview', '3 INTERNATIONAL AWARDS', '/awards#international', 'International 01', 'International 02', 'International 03'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_awards" WHERE "id" = 'hp_aw_01');

    INSERT INTO "home_page_awards" ("_order", "_parent_id", "id", "row_number", "item_type", "label", "href", "preview_label_one", "preview_label_two", "preview_label_three")
    SELECT 2, 1, 'hp_aw_02', '1', 'preview', '3 NATIONAL AWARDS', '/awards#national', 'National 01', 'National 02', 'National 03'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_awards" WHERE "id" = 'hp_aw_02');

    INSERT INTO "home_page_awards" ("_order", "_parent_id", "id", "row_number", "item_type", "label", "href", "preview_label_one", "preview_label_two", "preview_label_three")
    SELECT 3, 1, 'hp_aw_03', '2', 'preview', '4 PATENTS', '/awards#patents', 'Patent 01', 'Patent 02', 'Patent 03'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_awards" WHERE "id" = 'hp_aw_03');

    INSERT INTO "home_page_awards" ("_order", "_parent_id", "id", "row_number", "item_type", "label", "cta_text", "href")
    SELECT 4, 1, 'hp_aw_04', '2', 'cta', 'RECOGNITION ACROSS DESIGN & INNOVATION', 'VIEW AWARDS & PATENTS ->', '/awards'
    WHERE NOT EXISTS (SELECT 1 FROM "home_page_awards" WHERE "id" = 'hp_aw_04');
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "home_page_awards" CASCADE;
    DROP TABLE IF EXISTS "home_page_projects" CASCADE;
    DROP TABLE IF EXISTS "home_page" CASCADE;
  `)
}
