import type { CollectionConfig } from 'payload'
import { homeBlocks } from '../blocks/home'
import { caseStudyBlocks } from '../blocks/case-study'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  fields: [{ name: 'alt', type: 'text', required: true }],
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  versions: { drafts: true },
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'layout', type: 'blocks', blocks: [...homeBlocks, ...caseStudyBlocks] },
  ],
}
