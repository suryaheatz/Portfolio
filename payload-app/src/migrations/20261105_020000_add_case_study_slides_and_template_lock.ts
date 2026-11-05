import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum_case_studies_slides_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`DO $$ BEGIN CREATE TYPE "public"."enum__case_studies_v_version_slides_variant" AS ENUM('light', 'dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "case_studies_slides" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY,
  "variant" "enum_case_studies_slides_variant" DEFAULT 'light',
  "eyebrow" varchar,
  "heading" varchar,
  "body" varchar,
  "image_id" integer,
  "image_alt" varchar
);`)
  await db.execute(sql`ALTER TABLE "case_studies" ADD COLUMN IF NOT EXISTS "unlock_template" boolean DEFAULT false;`)
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "_case_studies_v_version_slides" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "variant" "enum__case_studies_v_version_slides_variant" DEFAULT 'light',
  "eyebrow" varchar,
  "heading" varchar,
  "body" varchar,
  "image_id" integer,
  "image_alt" varchar,
  "_uuid" varchar
);`)
  await db.execute(sql`ALTER TABLE "_case_studies_v" ADD COLUMN IF NOT EXISTS "version_unlock_template" boolean DEFAULT false;`)
  await db.execute(sql`UPDATE "case_studies" SET "template" = 'narrative' WHERE "slug" = 'centronic';`)
  await db.execute(sql`UPDATE "_case_studies_v" SET "version_template" = 'narrative' WHERE "version_slug" = 'centronic';`)
  await db.execute(sql`UPDATE "case_studies" SET "template" = 'narrative-slides' WHERE "slug" = 'haptix';`)
  await db.execute(sql`UPDATE "_case_studies_v" SET "version_template" = 'narrative-slides' WHERE "version_slug" = 'haptix';`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: non-destructive schema addition for CaseStudies.template and Articles collection
}
