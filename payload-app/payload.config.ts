import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './src/collections/users'
import { Media, Pages } from './src/collections'
import { SiteHeader, SiteFooter } from './src/globals/site'
import { AtlasContent } from './src/globals/atlas'
import { migrations } from './src/migrations'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    // Schema is managed by migrations (generated with `payload migrate:create`).
    // `payload migrate` runs before `next build` in the build script and applies
    // any pending migration files. Never use `push: true` in production.
    push: false,
    pool: { connectionString: process.env.DATABASE_URL || '' },
    migrationDir: './src/migrations',
    migrations,
  }),
  editor: lexicalEditor(),
  sharp,
  admin: { user: 'users' },
  collections: [Users, Media, Pages],
  globals: [SiteHeader, SiteFooter, AtlasContent],
})
