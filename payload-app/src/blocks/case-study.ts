import type { Block } from 'payload'

/** Shared editorial structures. Motion, pinning, and composition belong to the template renderer. */
export const CaseStudyHero: Block = {
  slug: 'caseStudyHero',
  labels: { singular: 'Case study hero', plural: 'Case study heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'client', type: 'text' },
    { name: 'period', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'chips', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroAlt', type: 'text' },
  ],
}
export const CaseStudyBrief: Block = {
  slug: 'caseStudyBrief',
  labels: { singular: 'Brief / narrative', plural: 'Briefs / narratives' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
    { name: 'supportingText', type: 'textarea' },
  ],
}
export const CaseStudyScope: Block = {
  slug: 'caseStudyScope',
  labels: { singular: 'Project scope', plural: 'Project scopes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'facts', type: 'array', minRows: 1, fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'textarea', required: true },
    ] },
    { name: 'sketch', type: 'upload', relationTo: 'media' },
    { name: 'sketchAlt', type: 'text' },
  ],
}
export const CaseStudyEditorial: Block = {
  slug: 'caseStudyEditorial',
  labels: { singular: 'Editorial text', plural: 'Editorial sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    { name: 'caption', type: 'text' },
  ],
}
export const FullWidthFigure: Block = {
  slug: 'fullWidthFigure',
  labels: { singular: 'Full-width figure', plural: 'Full-width figures' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'alt', type: 'text', required: true },
    { name: 'captionLabel', type: 'text' },
    { name: 'caption', type: 'textarea' },
    { name: 'background', type: 'select', defaultValue: 'solid', options: [
      { label: 'Solid surface', value: 'solid' }, { label: 'Blurred extension', value: 'blur' },
    ] },
  ],
}
export const caseStudyBlocks: Block[] = [CaseStudyHero, CaseStudyBrief, CaseStudyScope, CaseStudyEditorial, FullWidthFigure]
