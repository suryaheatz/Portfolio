import type { CollectionConfig } from 'payload'
import { caseStudyBlocks } from '../blocks/case-study'

/**
 * CaseStudies collection -- dedicated home for all case study documents.
 * Uses the Centronic 3-block starter template (Hero -> Brief -> Scope) by default.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Portfolio case study documents. Each entry starts with the Hero -> Brief -> Scope template.',
    livePreview: {
      url: ({ data }: { data?: { slug?: string } }) => {
        const slug = data?.slug
        return `/preview/case-studies/${encodeURIComponent(slug || '_new')}`
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
      admin: { description: 'Case study title -- also used as the page <title>.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug -- lowercase, hyphenated. e.g. "centronic" or "haptix".',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: caseStudyBlocks,
      admin: {
        description: 'Starts with Hero -> Brief -> Project Scope (Where, When, My role + optional sketch), followed by case study blocks.',
      },
      defaultValue: () => [
        {
          blockType: 'caseStudyHero',
          eyebrow: '',
          role: '',
          title: '',
          chips: [],
        },
        {
          blockType: 'caseStudyBrief',
          heading: 'The brief',
          narrativeBody: '',
        },
        {
          blockType: 'caseStudyScope',
          heading: 'Project scope',
          facts: [
            { label: 'Where', value: '' },
            { label: 'When', value: '' },
            { label: 'My role', value: '' },
          ],
        },
      ],
    },
  ],
}
