import type { CollectionConfig } from 'payload'
import { caseStudyBlocks } from '../blocks/case-study'

/**
 * CaseStudies collection -- dedicated home for all case study documents.
 * - Autosave is enabled so clicking "Create New" immediately opens the 50/50 Live Preview split screen.
 * - Template selector is unlocked on all new/draft case studies and locked once published (unless unlocked via sidebar toggle).
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', '_status', 'updatedAt'],
    description: 'Portfolio case study documents. Choose one of the 3 SK Design System case study formats -- the right-hand Live Preview updates in real time.',
    livePreview: {
      url: ({ data }: { data?: { id?: string | number; slug?: string; template?: string } }) => {
        const slug = data?.slug || '_new'
        const idParam = data?.id ? `?id=${encodeURIComponent(String(data.id))}` : ''
        return `/preview/case-studies/${encodeURIComponent(slug)}${idParam}`
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
          if (!data.title) data.title = 'Untitled Case Study'
          if (!data.slug) data.slug = `case-study-${Date.now().toString(36)}`
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        const isLockedDoc =
          originalDoc?._status === 'published' ||
          originalDoc?.slug === 'centronic' ||
          originalDoc?.slug === 'haptix'
        if (operation === 'update' && isLockedDoc && originalDoc?.template && data?.template && data.template !== originalDoc.template) {
          if (!data.unlockTemplate) {
            data.template = originalDoc.template
          }
        }
        if (data && 'unlockTemplate' in data) {
          data.unlockTemplate = false
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'template',
      type: 'select',
      required: true,
      defaultValue: 'narrative',
      access: {
        update: ({ id, data }) => {
          if (!id) return true
          const isPublishedOrCore =
            data?._status === 'published' ||
            data?.slug === 'centronic' ||
            data?.slug === 'haptix'
          if (!isPublishedOrCore) return true
          return Boolean(data?.unlockTemplate)
        },
      },
      options: [
        { label: '1. Standard Narrative (Hero -> Brief -> Scope + Case Study Blocks)', value: 'narrative' },
        { label: '2. Narrative + Presentation Deck (Sticky "Case Study / Slides" Switcher)', value: 'narrative-slides' },
        { label: '3. Visual / Image-Only Showcase (Continuous Zero-Gap Image Strip + Right-Side Interactive Slider)', value: 'visual-showcase' },
      ],
      admin: {
        description: 'Step 1: Select the SK Design System format. Switching this dropdown immediately updates the right-hand Live Preview. Locked once published (use the sidebar toggle to unlock).',
      },
    },
    {
      name: 'unlockTemplate',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.id && (data?._status === 'published' || data?.slug === 'centronic' || data?.slug === 'haptix')),
        description: 'Safety lock: Check this box only if you intentionally want to unlock and switch the Case Study template on a published case study.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Untitled Case Study',
      admin: { description: 'Case study title -- also used as the page <title>.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: () => `case-study-${Date.now().toString(36)}`,
      admin: {
        description: 'URL slug -- lowercase, hyphenated. e.g. "centronic" or "haptix".',
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Presentation Slides Deck / Visual Showcase Image Strip',
      admin: {
        condition: (data) => data?.template === 'narrative-slides' || data?.template === 'visual-showcase',
        description: 'In Template 2 (Narrative + Presentation Deck): powers the interactive "Slides" deck in the top switcher. In Template 3 (Visual / Image-Only Showcase): each item attaches a seamless zero-gap image to the Continuous Visual Strip and Right-Side Interactive Thumbnail Slider.',
      },
      fields: [
        {
          type: 'row',
          admin: {
            condition: (data) => data?.template === 'narrative-slides',
          },
          fields: [
            {
              name: 'variant',
              type: 'select',
              defaultValue: 'light',
              options: [
                { label: 'Standard Light (--surface)', value: 'light' },
                { label: 'Dark Card (--ink-dark)', value: 'dark' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'eyebrow',
              type: 'text',
              admin: { width: '50%', description: 'e.g. "01 / The Hardware"' },
            },
          ],
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            condition: (data) => data?.template === 'narrative-slides',
            description: 'Slide headline (Bricolage Grotesque display).',
          },
        },
        {
          name: 'body',
          type: 'textarea',
          admin: {
            condition: (data) => data?.template === 'narrative-slides',
            description: 'Concise slide narrative (left 40% column).',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Upload slide visual (Template 2) or seamless continuous strip image (Template 3).' },
        },
        {
          name: 'imageAlt',
          type: 'text',
          admin: { description: 'Optional accessibility alt text for the image.' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: caseStudyBlocks,
      admin: {
        description: 'Case study blocks. You can reorder or remove any block (including Hero, Brief, or Scope via the "..." menu on each block) and see the right-hand Live Preview update immediately.',
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
