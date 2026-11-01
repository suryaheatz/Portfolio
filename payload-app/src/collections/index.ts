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
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }: { data?: { slug?: string } }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
        const slug = data?.slug
        if (!slug) return ''
        return `${base}/preview/case-studies/${slug}`
      },
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 900 },
      ],
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'layout', type: 'blocks', blocks: [...homeBlocks, ...caseStudyBlocks] },
  ],
}
