import type { CollectionConfig } from 'payload'
import { caseStudyBlocks } from '../blocks/case-study'

/**
 * CaseStudies collection -- dedicated home for all case study documents.
 * Includes a 3-option format/template selector and the Centronic 3-block starter template.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', 'updatedAt'],
    description: 'Portfolio case study documents. Choose one of the 3 SK Design System case study formats.',
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
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'narrative',
      options: [
        { label: '1. Standard Narrative (Hero -> Brief -> Scope + Blocks)', value: 'narrative' },
        { label: '2. Narrative + Presentation Deck (Case Study / Slides Switcher)', value: 'narrative-slides' },
        { label: '3. Visual / Image-Only Showcase (Gallery & Bento Focus)', value: 'visual-showcase' },
      ],
      admin: {
        description: 'Select the case study format from the SK Design System.',
      },
    },
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
