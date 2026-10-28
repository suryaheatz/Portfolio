import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './src/collections/users'
import { Media, Pages } from './src/collections'
import { SiteHeader, SiteFooter } from './src/globals/site'
import { AtlasContent } from './src/globals/atlas'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' } }),
  editor: lexicalEditor(),
  sharp,
  admin: { user: 'users' },
  collections: [Users, Media, Pages],
  globals: [SiteHeader, SiteFooter, AtlasContent],
})
