import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Keep the Cloudflare R2 object key tracked in Payload's database schema.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";`)
}
