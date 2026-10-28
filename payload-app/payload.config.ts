import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
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
    s3Storage({
      collections: { media: true },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
      // Cloudflare R2 requires path-style URLs and a public delivery URL.
      forcePathStyle: true,
      generateFileURL: ({ filename }) => `${(process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')}/${encodeURIComponent(filename)}`,
    }),
  ],
})
