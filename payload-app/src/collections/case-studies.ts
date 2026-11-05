import type { CollectionConfig } from 'payload'
import { caseStudyBlocks } from '../blocks/case-study'

/**
 * CaseStudies collection -- dedicated home for all case study documents.
 * Step 1: Choose one of the 3 SK Design System templates (locked once saved unless explicitly unlocked).
 * Step 2: Form fields and right-hand Live Preview adapt to the chosen template.
 */
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', 'updatedAt'],
    description: 'Portfolio case study documents. Choose one of the 3 SK Design System case study formats.',
    livePreview: {
      url: ({ data }: { data?: { slug?: string; template?: string } }) => {
        const slug = data?.slug || '_new'
        const tpl = data?.template || 'narrative'
        return `/preview/case-studies/${encodeURIComponent(slug)}?template=${encodeURIComponent(tpl)}`
      },
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 900 },
      ],
    },
  },
  versions: { drafts: true },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (operation === 'update' && originalDoc?.template && data?.template && data.template !== originalDoc.template) {
          if (!data.unlockTemplate) {
            // Preserve original template if not explicitly unlocked
            data.template = originalDoc.template
          }
        }
        // Always reset the one-time unlock toggle after save so it stays locked afterward
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
          return Boolean(data?.unlockTemplate)
        },
      },
      options: [
        { label: '1. Standard Narrative (Hero -> Brief -> Scope + Case Study Blocks)', value: 'narrative' },
        { label: '2. Narrative + Presentation Deck (Sticky "Case Study / Slides" Switcher)', value: 'narrative-slides' },
        { label: '3. Visual / Image-Only Showcase (Hero + Bento, Galleries & Sliders -- No Brief/Scope Cards)', value: 'visual-showcase' },
      ],
      admin: {
        description: 'Step 1: Select the SK Design System format. Once a Case Study is saved, this template is locked to protect content mapping (use the sidebar toggle to unlock if needed).',
      },
    },
    {
      name: 'unlockTemplate',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.id),
        description: 'Safety lock: Check this box only if you intentionally want to unlock and switch the Case Study template above.',
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
      name: 'slides',
      type: 'array',
      label: 'Presentation Slides Deck (Top "Slides" Tab)',
      admin: {
        condition: (data) => data?.template === 'narrative-slides',
        description: 'Powers the interactive presentation deck in the top "Case study | Slides" switcher (Haptix format). Each slide uses a 40% text / 60% image split (16:10 or 4:3 image, object-fit: cover).',
      },
      fields: [
        {
          type: 'row',
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
          required: true,
          admin: { description: 'Slide headline (Bricolage Grotesque display).' },
        },
        {
          name: 'body',
          type: 'textarea',
          admin: { description: 'Concise slide narrative (left 40% column).' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Slide visual (right 60% column, min-height 500px, object-fit: cover -- best for 16:10 or 4:3 renders).' },
        },
        {
          name: 'imageAlt',
          type: 'text',
          admin: { description: 'Accessibility alt text for the slide image.' },
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: caseStudyBlocks,
      admin: {
        description: 'Page content blocks. Empty image slots automatically display SK Design System Blueprint placeholders with image ratio specs in the right-hand Live Preview.',
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
