import type { CollectionConfig } from 'payload'
import { caseStudyBlocks } from '../blocks/case-study'
import { homeBlocks } from '../blocks/home'

/**
 * Articles collection -- free-form editorial articles, essays, and visual explorations.
 * Unlike CaseStudies, Articles does not enforce a fixed starter template and allows any SK Design System block.
 */
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'updatedAt'],
    description: 'Free-form articles, essays, and explorations. Insert any SK Design System block in any order.',
    livePreview: {
      url: ({ data }: { data?: { slug?: string } }) => {
        const slug = data?.slug
        return `/preview/case-studies/${encodeURIComponent(slug || '_new')}?collection=articles`
      },
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 900 },
      ],
    },
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Article title -- also used as the page <title>.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug -- lowercase, hyphenated. e.g. "designing-haptic-controls".' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'text',
          admin: { width: '50%', description: 'e.g. "Automotive UX", "Design Systems", "Exploration"' },
        },
        {
          name: 'readingTime',
          type: 'text',
          admin: { width: '50%', description: 'e.g. "5 min read"' },
        },
      ],
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: { description: 'Optional lead summary / subtitle shown below the article title.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional cover image for article cards and headers.' },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [...caseStudyBlocks, ...homeBlocks],
      admin: {
        description: 'Free-form block canvas -- add any combination of editorial, media, bento, tooltip gallery, or chart blocks.',
      },
    },
  ],
}
