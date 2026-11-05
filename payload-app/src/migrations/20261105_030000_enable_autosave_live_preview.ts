import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "case_studies"
      ALTER COLUMN "title" DROP NOT NULL,
      ALTER COLUMN "slug" DROP NOT NULL,
      ALTER COLUMN "title" SET DEFAULT 'Untitled Case Study';

    ALTER TABLE "_case_studies_v"
      ALTER COLUMN "version_title" SET DEFAULT 'Untitled Case Study';

    ALTER TABLE "articles"
      ALTER COLUMN "title" SET DEFAULT 'Untitled Article',
      ALTER COLUMN "created_at" SET DEFAULT now(),
      ALTER COLUMN "updated_at" SET DEFAULT now();

    ALTER TABLE "_articles_v"
      ADD COLUMN IF NOT EXISTS "snapshot" boolean,
      ADD COLUMN IF NOT EXISTS "autosave" boolean,
      ALTER COLUMN "version_title" SET DEFAULT 'Untitled Article',
      ALTER COLUMN "created_at" SET DEFAULT now(),
      ALTER COLUMN "updated_at" SET DEFAULT now(),
      ALTER COLUMN "version_created_at" SET DEFAULT now(),
      ALTER COLUMN "version_updated_at" SET DEFAULT now();

    ALTER TABLE "_pages_v"
      ADD COLUMN IF NOT EXISTS "snapshot" boolean,
      ADD COLUMN IF NOT EXISTS "autosave" boolean;

    UPDATE "payload_preferences"
      SET "value" = '{"editViewType":"live-preview"}'::jsonb
      WHERE "key" IN ('collection-case-studies', 'collection-articles');
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_articles_v"
      DROP COLUMN IF EXISTS "snapshot",
      DROP COLUMN IF EXISTS "autosave";
  `)
}
