import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs): Promise<void> {
 await db.execute(sql`
 DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_case_study_media_group_presentation" AS ENUM('tooltip','adaptive','slides','annotated','evolution','figures'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_case_study_media_group_presentation" AS ENUM('tooltip','adaptive','slides','annotated','evolution','figures'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_case_study_media_group_grid_variant" AS ENUM('two','three','traditional','asymmetric'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_case_study_media_group_grid_variant" AS ENUM('two','three','traditional','asymmetric'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_case_study_media_group_appearance" AS ENUM('inherit','light','dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_case_study_media_group_appearance" AS ENUM('inherit','light','dark'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_case_study_media_group_slide_alignment" AS ENUM('textLeft','imageLeft'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_case_study_media_group_slide_alignment" AS ENUM('textLeft','imageLeft'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 ALTER TABLE "pages_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "presentation" "enum_pages_blocks_case_study_media_group_presentation";
 ALTER TABLE "_pages_v_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "presentation" "enum__pages_v_blocks_case_study_media_group_presentation";
 ALTER TABLE "pages_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "grid_variant" "enum_pages_blocks_case_study_media_group_grid_variant" DEFAULT 'two';
 ALTER TABLE "_pages_v_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "grid_variant" "enum__pages_v_blocks_case_study_media_group_grid_variant" DEFAULT 'two';
 ALTER TABLE "pages_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "appearance" "enum_pages_blocks_case_study_media_group_appearance" DEFAULT 'inherit';
 ALTER TABLE "_pages_v_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "appearance" "enum__pages_v_blocks_case_study_media_group_appearance" DEFAULT 'inherit';
 ALTER TABLE "pages_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "slide_alignment" "enum_pages_blocks_case_study_media_group_slide_alignment" DEFAULT 'textLeft';
 ALTER TABLE "_pages_v_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "slide_alignment" "enum__pages_v_blocks_case_study_media_group_slide_alignment" DEFAULT 'textLeft';
 ALTER TABLE "pages_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "show_section_heading" boolean DEFAULT true;
 ALTER TABLE "_pages_v_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "show_section_heading" boolean DEFAULT true;
 ALTER TABLE "pages_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "show_numbers" boolean DEFAULT false;
 ALTER TABLE "_pages_v_blocks_case_study_media_group" ADD COLUMN IF NOT EXISTS "show_numbers" boolean DEFAULT false;
 `)
 for (const table of ['pages_blocks_case_study_media_group_images','_pages_v_blocks_case_study_media_group_images']) {
  await db.execute(sql.raw(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "image_name" varchar, ADD COLUMN IF NOT EXISTS "eyebrow" varchar, ADD COLUMN IF NOT EXISTS "title" varchar, ADD COLUMN IF NOT EXISTS "description" varchar, ADD COLUMN IF NOT EXISTS "credit" varchar, ADD COLUMN IF NOT EXISTS "show_eyebrow" boolean DEFAULT false, ADD COLUMN IF NOT EXISTS "show_title" boolean DEFAULT false, ADD COLUMN IF NOT EXISTS "show_caption" boolean DEFAULT true, ADD COLUMN IF NOT EXISTS "show_description" boolean DEFAULT false, ADD COLUMN IF NOT EXISTS "show_credit" boolean DEFAULT false`))
 }
 await db.execute(sql`
 CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_media_group_images_annotations"("_order" integer NOT NULL,"_parent_id" varchar NOT NULL,"id" varchar PRIMARY KEY NOT NULL,"number" numeric,"x" numeric,"y" numeric,"heading" varchar,"body" varchar);
 CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_media_group_images_annotations"("_order" integer NOT NULL,"_parent_id" integer NOT NULL,"id" serial PRIMARY KEY NOT NULL,"number" numeric,"x" numeric,"y" numeric,"heading" varchar,"body" varchar,"_uuid" varchar);
 `)
}
export async function down(_args: MigrateDownArgs):Promise<void>{
 // Preserve content and user edits; rollback requires an explicitly reviewed data plan.
}
