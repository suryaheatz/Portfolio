import type { CollectionConfig } from 'payload'
import { caseStudyBlocks } from '../blocks/case-study'

/**
 * CaseStudies collection -- dedicated home for all case study documents.
 * Replaces the pattern of storing case studies as Pages.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Portfolio case study documents. Each entry maps to one published case study page.',
  },
  versions: { drafts: true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal title -- also used as the page <title>.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug -- lowercase, hyphenated. e.g. "zf-centronic-hmi".',
        position: 'sidebar',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: { description: 'Category label shown above the title. e.g. "Automotive HMI".' },
    },
    {
      name: 'role',
      type: 'text',
      admin: { description: 'Your role on this project.' },
    },
    {
      name: 'period',
      type: 'text',
      admin: { description: 'Engagement period. e.g. "2022 - 2024".' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero / cover image for the case study.',
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: caseStudyBlocks,
      admin: { description: 'Page content blocks.' },
    },
  ],
}
