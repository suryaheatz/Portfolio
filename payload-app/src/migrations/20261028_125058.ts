import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create ENUMs — wrapped in DO blocks so they are no-ops when they already exist
  // (push: true may have already created them on the preview branch).
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_blocks_work_showcase_projects_display_variant" AS ENUM('large', 'small');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_blocks_work_showcase_projects_display_variant" AS ENUM('large', 'small');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_header_brand_mode" AS ENUM('name', 'logo', 'both');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum_atlas_content_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      CREATE TYPE "public"."enum__atlas_content_v_version_status" AS ENUM('draft', 'published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // Create tables — IF NOT EXISTS makes these idempotent
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "users" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "email" varchar NOT NULL,
      "reset_password_token" varchar,
      "reset_password_expiration" timestamp(3) with time zone,
      "salt" varchar,
      "hash" varchar,
      "reset_password_requested_at" timestamp(3) with time zone,
      "login_attempts" numeric DEFAULT 0,
      "lock_until" timestamp(3) with time zone
    );
    CREATE TABLE IF NOT EXISTS "media" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_hero_card_headline_lines" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_hero_card" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "supporting_text" varchar,
      "media_id" integer,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_work_showcase_projects" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "subtitle" varchar,
      "href" varchar,
      "thumbnail_id" integer,
      "display_variant" "enum_pages_blocks_work_showcase_projects_display_variant"
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_work_showcase" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'Selected Work',
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_awards_marquee_rows_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar,
      "link" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_awards_marquee_rows" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "pages_blocks_awards_marquee" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_pages_status" DEFAULT 'draft'
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_card_headline_lines" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_hero_card" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "eyebrow" varchar,
      "supporting_text" varchar,
      "media_id" integer,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_work_showcase_projects" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar,
      "subtitle" varchar,
      "href" varchar,
      "thumbnail_id" integer,
      "display_variant" "enum__pages_v_blocks_work_showcase_projects_display_variant",
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_work_showcase" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "heading" varchar DEFAULT 'Selected Work',
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_awards_marquee_rows_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "text" varchar,
      "link" varchar,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_awards_marquee_rows" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v_blocks_awards_marquee" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path" text NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_uuid" varchar,
      "block_name" varchar
    );
    CREATE TABLE IF NOT EXISTS "_pages_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_title" varchar,
      "version_slug" varchar,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__pages_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean
    );
    CREATE TABLE IF NOT EXISTS "payload_kv" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "global_slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer,
      "media_id" integer,
      "pages_id" integer
    );
    CREATE TABLE IF NOT EXISTS "payload_preferences" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar,
      "value" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer
    );
    CREATE TABLE IF NOT EXISTS "payload_migrations" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "batch" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "site_header_navigation" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "site_header" (
      "id" serial PRIMARY KEY NOT NULL,
      "brand_name" varchar DEFAULT 'Surya Konijeti' NOT NULL,
      "brand_mode" "enum_site_header_brand_mode" DEFAULT 'name' NOT NULL,
      "logo_id" integer,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    CREATE TABLE IF NOT EXISTS "site_footer_social_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "url" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "site_footer" (
      "id" serial PRIMARY KEY NOT NULL,
      "contact_heading" varchar,
      "contact_email" varchar,
      "footer_text" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    CREATE TABLE IF NOT EXISTS "atlas_content" (
      "id" serial PRIMARY KEY NOT NULL,
      "source_data" jsonb,
      "_status" "enum_atlas_content_status" DEFAULT 'draft',
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );
    CREATE TABLE IF NOT EXISTS "_atlas_content_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "version_source_data" jsonb,
      "version__status" "enum__atlas_content_v_version_status" DEFAULT 'draft',
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean
    );
  `)

  // Add foreign key constraints — wrapped to skip gracefully if already present
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_hero_card_headline_lines" ADD CONSTRAINT "pages_blocks_hero_card_headline_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_card"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_hero_card" ADD CONSTRAINT "pages_blocks_hero_card_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_hero_card" ADD CONSTRAINT "pages_blocks_hero_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_work_showcase_projects" ADD CONSTRAINT "pages_blocks_work_showcase_projects_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_work_showcase_projects" ADD CONSTRAINT "pages_blocks_work_showcase_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_work_showcase"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_work_showcase" ADD CONSTRAINT "pages_blocks_work_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_awards_marquee_rows_items" ADD CONSTRAINT "pages_blocks_awards_marquee_rows_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_awards_marquee_rows"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_awards_marquee_rows" ADD CONSTRAINT "pages_blocks_awards_marquee_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_awards_marquee"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_blocks_awards_marquee" ADD CONSTRAINT "pages_blocks_awards_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_hero_card_headline_lines" ADD CONSTRAINT "_pages_v_blocks_hero_card_headline_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_card"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_hero_card" ADD CONSTRAINT "_pages_v_blocks_hero_card_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_hero_card" ADD CONSTRAINT "_pages_v_blocks_hero_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_work_showcase_projects" ADD CONSTRAINT "_pages_v_blocks_work_showcase_projects_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_work_showcase_projects" ADD CONSTRAINT "_pages_v_blocks_work_showcase_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_work_showcase"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_work_showcase" ADD CONSTRAINT "_pages_v_blocks_work_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_awards_marquee_rows_items" ADD CONSTRAINT "_pages_v_blocks_awards_marquee_rows_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_awards_marquee_rows"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_awards_marquee_rows" ADD CONSTRAINT "_pages_v_blocks_awards_marquee_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_awards_marquee"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v_blocks_awards_marquee" ADD CONSTRAINT "_pages_v_blocks_awards_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "site_header_navigation" ADD CONSTRAINT "site_header_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_header"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "site_header" ADD CONSTRAINT "site_header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "site_footer_social_links" ADD CONSTRAINT "site_footer_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_footer"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `)

  // Create indexes — IF NOT EXISTS prevents errors when they already exist
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
    CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
    CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_card_headline_lines_order_idx" ON "pages_blocks_hero_card_headline_lines" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_card_headline_lines_parent_id_idx" ON "pages_blocks_hero_card_headline_lines" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_card_order_idx" ON "pages_blocks_hero_card" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_card_parent_id_idx" ON "pages_blocks_hero_card" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_card_path_idx" ON "pages_blocks_hero_card" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_hero_card_media_idx" ON "pages_blocks_hero_card" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_work_showcase_projects_order_idx" ON "pages_blocks_work_showcase_projects" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_work_showcase_projects_parent_id_idx" ON "pages_blocks_work_showcase_projects" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_work_showcase_projects_thumbnail_idx" ON "pages_blocks_work_showcase_projects" USING btree ("thumbnail_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_work_showcase_order_idx" ON "pages_blocks_work_showcase" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_work_showcase_parent_id_idx" ON "pages_blocks_work_showcase" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_work_showcase_path_idx" ON "pages_blocks_work_showcase" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "pages_blocks_awards_marquee_rows_items_order_idx" ON "pages_blocks_awards_marquee_rows_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_awards_marquee_rows_items_parent_id_idx" ON "pages_blocks_awards_marquee_rows_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_awards_marquee_rows_order_idx" ON "pages_blocks_awards_marquee_rows" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_awards_marquee_rows_parent_id_idx" ON "pages_blocks_awards_marquee_rows" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_awards_marquee_order_idx" ON "pages_blocks_awards_marquee" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_blocks_awards_marquee_parent_id_idx" ON "pages_blocks_awards_marquee" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "pages_blocks_awards_marquee_path_idx" ON "pages_blocks_awards_marquee" USING btree ("_path");
    CREATE UNIQUE INDEX IF NOT EXISTS "pages_slug_idx" ON "pages" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "pages__status_idx" ON "pages" USING btree ("_status");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_card_headline_lines_order_idx" ON "_pages_v_blocks_hero_card_headline_lines" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_card_headline_lines_parent_id_idx" ON "_pages_v_blocks_hero_card_headline_lines" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_card_order_idx" ON "_pages_v_blocks_hero_card" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_card_parent_id_idx" ON "_pages_v_blocks_hero_card" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_card_path_idx" ON "_pages_v_blocks_hero_card" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_hero_card_media_idx" ON "_pages_v_blocks_hero_card" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_work_showcase_projects_order_idx" ON "_pages_v_blocks_work_showcase_projects" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_work_showcase_projects_parent_id_idx" ON "_pages_v_blocks_work_showcase_projects" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_work_showcase_projects_thumbnail_idx" ON "_pages_v_blocks_work_showcase_projects" USING btree ("thumbnail_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_work_showcase_order_idx" ON "_pages_v_blocks_work_showcase" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_work_showcase_parent_id_idx" ON "_pages_v_blocks_work_showcase" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_work_showcase_path_idx" ON "_pages_v_blocks_work_showcase" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_awards_marquee_rows_items_order_idx" ON "_pages_v_blocks_awards_marquee_rows_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_awards_marquee_rows_items_parent_id_idx" ON "_pages_v_blocks_awards_marquee_rows_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_awards_marquee_rows_order_idx" ON "_pages_v_blocks_awards_marquee_rows" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_awards_marquee_rows_parent_id_idx" ON "_pages_v_blocks_awards_marquee_rows" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_awards_marquee_order_idx" ON "_pages_v_blocks_awards_marquee" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_awards_marquee_parent_id_idx" ON "_pages_v_blocks_awards_marquee" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_blocks_awards_marquee_path_idx" ON "_pages_v_blocks_awards_marquee" USING btree ("_path");
    CREATE INDEX IF NOT EXISTS "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
    CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
    CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
    CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "site_header_navigation_order_idx" ON "site_header_navigation" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_header_navigation_parent_id_idx" ON "site_header_navigation" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_header_logo_idx" ON "site_header" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "site_footer_social_links_order_idx" ON "site_footer_social_links" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_footer_social_links_parent_id_idx" ON "site_footer_social_links" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "atlas_content__status_idx" ON "atlas_content" USING btree ("_status");
    CREATE INDEX IF NOT EXISTS "_atlas_content_v_version_version__status_idx" ON "_atlas_content_v" USING btree ("version__status");
    CREATE INDEX IF NOT EXISTS "_atlas_content_v_created_at_idx" ON "_atlas_content_v" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "_atlas_content_v_updated_at_idx" ON "_atlas_content_v" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "_atlas_content_v_latest_idx" ON "_atlas_content_v" USING btree ("latest");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "users_sessions" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP TABLE IF EXISTS "media" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hero_card_headline_lines" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_hero_card" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_work_showcase_projects" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_work_showcase" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_awards_marquee_rows_items" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_awards_marquee_rows" CASCADE;
    DROP TABLE IF EXISTS "pages_blocks_awards_marquee" CASCADE;
    DROP TABLE IF EXISTS "pages" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_hero_card_headline_lines" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_hero_card" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_work_showcase_projects" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_work_showcase" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_awards_marquee_rows_items" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_awards_marquee_rows" CASCADE;
    DROP TABLE IF EXISTS "_pages_v_blocks_awards_marquee" CASCADE;
    DROP TABLE IF EXISTS "_pages_v" CASCADE;
    DROP TABLE IF EXISTS "payload_kv" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents" CASCADE;
    DROP TABLE IF EXISTS "payload_locked_documents_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences" CASCADE;
    DROP TABLE IF EXISTS "payload_preferences_rels" CASCADE;
    DROP TABLE IF EXISTS "payload_migrations" CASCADE;
    DROP TABLE IF EXISTS "site_header_navigation" CASCADE;
    DROP TABLE IF EXISTS "site_header" CASCADE;
    DROP TABLE IF EXISTS "site_footer_social_links" CASCADE;
    DROP TABLE IF EXISTS "site_footer" CASCADE;
    DROP TABLE IF EXISTS "atlas_content" CASCADE;
    DROP TABLE IF EXISTS "_atlas_content_v" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_pages_blocks_work_showcase_projects_display_variant";
    DROP TYPE IF EXISTS "public"."enum_pages_status";
    DROP TYPE IF EXISTS "public"."enum__pages_v_blocks_work_showcase_projects_display_variant";
    DROP TYPE IF EXISTS "public"."enum__pages_v_version_status";
    DROP TYPE IF EXISTS "public"."enum_site_header_brand_mode";
    DROP TYPE IF EXISTS "public"."enum_atlas_content_status";
    DROP TYPE IF EXISTS "public"."enum__atlas_content_v_version_status";
  `)
}
