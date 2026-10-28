import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './src/collections/users'
import { Media, Pages } from './src/collections'
import { SiteHeader, SiteFooter } from './src/globals/site'
import { AtlasContent } from './src/globals/atlas'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    // Schema is managed by migrations (generated with `payload migrate:create`).
    // `payload migrate` runs before `next build` in the build script and applies
    // any pending migration files from migrationDir. Never use `push: true`.
    push: false,
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: './src/migrations',
  }),
  editor: lexicalEditor(),
  sharp,
  admin: { user: 'users' },
  collections: [Users, Media, Pages],
  globals: [SiteHeader, SiteFooter, AtlasContent],
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
  ],
})
