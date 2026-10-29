import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
export async function up({db}:MigrateUpArgs):Promise<void>{
 await db.execute(sql`
 DO $$ BEGIN CREATE TYPE "public"."enum_pages_blocks_case_study_media_group_layout_style" AS ENUM('evidence','grid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 DO $$ BEGIN CREATE TYPE "public"."enum__pages_v_blocks_case_study_media_group_layout_style" AS ENUM('evidence','grid'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
 CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_media_group"("_order" integer NOT NULL,"_parent_id" integer NOT NULL,"_path" text NOT NULL,"id" varchar PRIMARY KEY NOT NULL,"section_heading" varchar,"section_key" varchar,"layout_style" "enum_pages_blocks_case_study_media_group_layout_style" DEFAULT 'evidence',"block_name" varchar);
 CREATE TABLE IF NOT EXISTS "pages_blocks_case_study_media_group_images"("_order" integer NOT NULL,"_parent_id" varchar NOT NULL,"id" varchar PRIMARY KEY NOT NULL,"source_path" varchar,"source_url" varchar,"alt" varchar,"caption" varchar,"media_id" integer);
 CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_media_group"("_order" integer NOT NULL,"_parent_id" integer NOT NULL,"_path" text NOT NULL,"id" serial PRIMARY KEY NOT NULL,"section_heading" varchar,"section_key" varchar,"layout_style" "enum__pages_v_blocks_case_study_media_group_layout_style" DEFAULT 'evidence',"_uuid" varchar,"block_name" varchar);
 CREATE TABLE IF NOT EXISTS "_pages_v_blocks_case_study_media_group_images"("_order" integer NOT NULL,"_parent_id" integer NOT NULL,"id" serial PRIMARY KEY NOT NULL,"source_path" varchar,"source_url" varchar,"alt" varchar,"caption" varchar,"media_id" integer,"_uuid" varchar);
 `)
}
export async function down({db}:MigrateDownArgs):Promise<void>{
 await db.execute(sql`DROP TABLE IF EXISTS "_pages_v_blocks_case_study_media_group_images";DROP TABLE IF EXISTS "_pages_v_blocks_case_study_media_group";DROP TABLE IF EXISTS "pages_blocks_case_study_media_group_images";DROP TABLE IF EXISTS "pages_blocks_case_study_media_group";DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_case_study_media_group_layout_style";DROP TYPE IF EXISTS "public"."enum_pages_blocks_case_study_media_group_layout_style";`)
}
