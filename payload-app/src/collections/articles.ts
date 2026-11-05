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
    defaultColumns: ['title', 'slug', 'category', '_status', 'updatedAt'],
    description: 'Free-form articles, essays, and explorations. Insert any SK Design System block in any order -- the right-hand Live Preview updates in real time.',
    livePreview: {
      url: ({ data }: { data?: { id?: string | number; slug?: string } }) => {
        const slug = data?.slug || '_new'
        const idParam = data?.id ? `&id=${encodeURIComponent(String(data.id))}` : ''
        return `/preview/case-studies/${encodeURIComponent(slug)}?collection=articles${idParam}`
      },
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 900 },
      ],
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 600,
      },
      validate: false,
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data) {
          if (!data.title) data.title = 'Untitled Article'
          if (!data.slug) data.slug = `article-${Date.now().toString(36)}`
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Untitled Article',
      admin: { description: 'Article title -- also used as the page <title>.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: () => `article-${Date.now().toString(36)}`,
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
