import type { Block } from 'payload'

/** Visual implementations must reproduce the approved migration-preview HTML exactly. */
export const HeroCard: Block = {
  slug: 'heroCard',
  labels: { singular: 'Hero card', plural: 'Hero cards' },
  fields: [
    { name: 'headlineLines', type: 'array', required: true, fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'eyebrow', type: 'text' },
    { name: 'supportingText', type: 'textarea' },
    { name: 'media', type: 'upload', relationTo: 'media' },
  ],
}

export const WorkShowcase: Block = {
  slug: 'workShowcase',
  labels: { singular: 'Selected work', plural: 'Selected work' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Selected Work', required: true },
    { name: 'projects', type: 'array', fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'subtitle', type: 'text' },
      { name: 'href', type: 'text' },
      { name: 'thumbnail', type: 'upload', relationTo: 'media' },
      { name: 'displayVariant', type: 'select', options: [
        { label: 'Large', value: 'large' }, { label: 'Small', value: 'small' },
      ], required: true },
    ] },
  ],
}

export const AwardsMarquee: Block = {
  slug: 'awardsMarquee',
  labels: { singular: 'Scrolling awards text', plural: 'Scrolling awards text' },
  fields: [
    { name: 'rows', type: 'array', minRows: 1, fields: [
      { name: 'items', type: 'array', minRows: 1, fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'link', type: 'text' },
      ] },
    ] },
  ],
}

export const homeBlocks: Block[] = [HeroCard, WorkShowcase, AwardsMarquee]
