import type { Block, FieldHook } from 'payload'
import { coerceLexical } from '../lib/coerce-lexical'

/** Shared editorial structures. Motion, pinning, and composition belong to the template renderer. */
const PV = (name: string) => `/block-previews/${name}.svg`

/** Hook bag applied to every richText body/description field to coerce legacy plain-text values. */
const RT = { hooks: { afterRead: [coerceLexical] as FieldHook[] } }

export const CaseStudyHero: Block = {
  slug: 'caseStudyHero',
  imageURL: PV('case-study-hero'),
  labels: { singular: 'Case study hero', plural: 'Case study heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'client', type: 'text' },
    { name: 'period', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'richText', ...RT },
    { name: 'chips', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroAlt', type: 'text' },
  ],
}
export const CaseStudyBrief: Block = {
  slug: 'caseStudyBrief',
  imageURL: PV('case-study-brief'),
  labels: { singular: 'Brief / narrative', plural: 'Briefs / narratives' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'narrativeBody', type: 'textarea', required: true },
    { name: 'narrativeSub', type: 'textarea' },
  ],
}
export const CaseStudyScope: Block = {
  slug: 'caseStudyScope',
  imageURL: PV('case-study-scope'),
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
  imageURL: PV('case-study-editorial'),
  labels: { singular: 'Editorial text', plural: 'Editorial sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'editorialBody', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' },
    { name: 'caption', type: 'text' },
  ],
}
export const FullWidthFigure: Block = {
  slug: 'fullWidthFigure',
  imageURL: PV('full-width-figure'),
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
export const CaseBento: Block = {
  slug: 'caseBento',
  imageURL: PV('case-bento'),
  labels: { singular: 'Bento grid (legacy)', plural: 'Bento grids (legacy)' },
  fields: [
    { name: 'eyebrow',  type: 'text' },
    { name: 'title',    type: 'text' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'layout',
      type: 'select',
      required: true,
      options: [
        { label: '2-Up: Two equal cells',       value: 'bento-2'  },
        { label: '3A: Two top, wide bottom',     value: 'bento-3a' },
        { label: '3B: Asymmetric tall-left',     value: 'bento-3b' },
        { label: '4: Wide top, three bottom',    value: 'bento-4'  },
      ],
    },
    {
      name: 'cells',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      admin: {
        description: '2-Up = 2 cells / 3A or 3B = 3 cells / 4-Up = 4 cells. Cell count must match the selected layout.',
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        const counts: Record<string, number> = { 'bento-2': 2, 'bento-3a': 3, 'bento-3b': 3, 'bento-4': 4 }
        const layout = siblingData?.layout as string
        const required = counts[layout]
        if (!required) return true
        const count = Array.isArray(value) ? (value as unknown[]).length : 0
        if (count !== required) {
          return `"${layout}" requires exactly ${required} cell${required === 1 ? '' : 's'} - you have ${count}. Add or remove cells to match.`
        }
        return true
      },
      fields: [
        { name: 'image',   type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
        { name: 'altText', type: 'text', required: true },
      ],
    },
  ],
}

export const BeforeAfterSlider: Block = {
  slug: 'beforeAfterSlider',
  imageURL: PV('before-after-slider'),
  labels: { singular: 'Before / after slider', plural: 'Before / after sliders' },
  fields: [
    { name: 'beforeImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'beforeLabel', type: 'text', defaultValue: 'Before' },
    { name: 'afterImage',  type: 'upload', relationTo: 'media', required: true },
    { name: 'afterLabel',  type: 'text', defaultValue: 'After' },
    { name: 'caption',     type: 'text' },
  ],
}

export const AnnotatedMedia: Block = {
  slug: 'annotatedMedia',
  imageURL: PV('annotated-media'),
  labels: { singular: 'Annotated media', plural: 'Annotated media' },
  fields: [
    { name: 'image',   type: 'upload', relationTo: 'media', required: true },
    { name: 'altText', type: 'text',   required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'hotspots',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: 'x',       type: 'number', required: true, min: 0, max: 100, admin: { description: 'Horizontal position 0-100%' } },
        { name: 'y',       type: 'number', required: true, min: 0, max: 100, admin: { description: 'Vertical position 0-100%' } },
        { name: 'number',  type: 'number', admin: { description: 'Display number (auto-sequenced if blank)' } },
        { name: 'heading', type: 'text', required: true },
        { name: 'body',    type: 'textarea' },
      ],
    },
  ],
}

export const Pullquote: Block = {
  slug: 'pullquote',
  imageURL: PV('pullquote'),
  labels: { singular: 'Pullquote', plural: 'Pullquotes' },
  fields: [
    { name: 'quote',       type: 'richText', required: true },
    { name: 'attribution', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark',  value: 'dark'  },
      ],
    },
  ],
}

export const SlideLayout: Block = {
  slug: 'slideLayout',
  imageURL: PV('slide-layout'),
  labels: { singular: 'Slide layout', plural: 'Slide layouts' },
  fields: [
    { name: 'eyebrow',  type: 'text' },
    { name: 'heading',  type: 'text', required: true },
    { name: 'body',     type: 'richText', ...RT },
    { name: 'image',    type: 'upload', relationTo: 'media', required: true },
    { name: 'altText',  type: 'text',   required: true },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark',  value: 'dark'  },
      ],
    },
  ],
}

// -- Typed bento grid blocks (cell count enforced by minRows === maxRows) ------

const BENTO_CELLS_FIELDS = [
  { name: 'image',   type: 'upload' as const, relationTo: 'media' as const, required: true },
  { name: 'caption', type: 'text' as const },
  { name: 'altText', type: 'text' as const, required: true },
]

export const BentoTwoUp: Block = {
  slug: 'bentoTwoUp',
  imageURL: PV('bento-two-up'),
  labels: { singular: 'Bento 2-Up (equal)', plural: 'Bento 2-Up grids' },
  fields: [
    { name: 'eyebrow',  type: 'text' },
    { name: 'title',    type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'cells', type: 'array', minRows: 2, maxRows: 2,
      admin: { description: 'Exactly 2 cells - matches layout.' },
      fields: BENTO_CELLS_FIELDS },
  ],
}

export const BentoThreeA: Block = {
  slug: 'bentoThreeA',
  imageURL: PV('bento-three-a'),
  labels: { singular: 'Bento 3A (two top, wide bottom)', plural: 'Bento 3A grids' },
  fields: [
    { name: 'eyebrow',  type: 'text' },
    { name: 'title',    type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'cells', type: 'array', minRows: 3, maxRows: 3,
      admin: { description: 'Exactly 3 cells - cell 1 and 2 top row, cell 3 spans full width below.' },
      fields: BENTO_CELLS_FIELDS },
  ],
}

export const BentoThreeB: Block = {
  slug: 'bentoThreeB',
  imageURL: PV('bento-three-b'),
  labels: { singular: 'Bento 3B (tall left, two right)', plural: 'Bento 3B grids' },
  fields: [
    { name: 'eyebrow',  type: 'text' },
    { name: 'title',    type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'cells', type: 'array', minRows: 3, maxRows: 3,
      admin: { description: 'Exactly 3 cells - cell 1 spans full height left, cells 2 and 3 stack right.' },
      fields: BENTO_CELLS_FIELDS },
  ],
}

export const BentoFourUp: Block = {
  slug: 'bentoFourUp',
  imageURL: PV('bento-four-up'),
  labels: { singular: 'Bento 4-Up (wide top, three bottom)', plural: 'Bento 4-Up grids' },
  fields: [
    { name: 'eyebrow',  type: 'text' },
    { name: 'title',    type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'cells', type: 'array', minRows: 4, maxRows: 4,
      admin: { description: 'Exactly 4 cells - cell 1 spans full width top, cells 2-4 equal columns below.' },
      fields: BENTO_CELLS_FIELDS },
  ],
}

export const CaseStudyMediaGroup: Block = { slug: 'caseStudyMediaGroup', dbName: ({ tableName }) => `${(tableName ?? '').replace(/^_/, '').replace(/_v$/, '')}_blocks_cs_media_group`, imageURL: PV('case-study-media-group'), labels: {singular:'Tooltip / Evidence & Media Gallery',plural:'Tooltip / Evidence & Media Galleries'}, fields: [
 {name:'sectionHeading',type:'text',required:true},
 {name:'sectionKey',type:'text',admin:{description:'Source section or chapter identity'}},
 {name:'layoutStyle',type:'select',defaultValue:'evidence',admin:{description:'Legacy layout fallback. New presentation choice below overrides this.'},options:[{label:'Evidence gallery',value:'evidence'},{label:'Grid',value:'grid'}]},
 {name:'presentation',type:'select',defaultValue:'tooltip',admin:{description:'Change visual layout without deleting captions or other image content.'},options:[
 {label:'Evidence / tooltip gallery',value:'tooltip'},{label:'Adaptive grid',value:'adaptive'},{label:'Sequential slides',value:'slides'},{label:'Annotated image',value:'annotated'},{label:'Evolution sequence',value:'evolution'},{label:'Full-width figures',value:'figures'}]},
 {name:'gridVariant',type:'select',defaultValue:'two',admin:{condition:(_data,siblingData)=>siblingData?.presentation==='adaptive'},options:[
 {label:'Two-column',value:'two'},{label:'Three equal columns',value:'three'},{label:'Traditional grid',value:'traditional'},{label:'Three-column asymmetric',value:'asymmetric'}]},
 {name:'appearance',type:'select',defaultValue:'inherit',options:[{label:'Inherit section',value:'inherit'},{label:'Light',value:'light'},{label:'Dark',value:'dark'}]},
 {name:'slideAlignment',type:'select',defaultValue:'textLeft',admin:{condition:(_data,siblingData)=>siblingData?.presentation==='slides'},options:[{label:'Text left / image right',value:'textLeft'},{label:'Image left / text right',value:'imageLeft'}]},
 {name:'showSectionHeading',type:'checkbox',defaultValue:true},
 {name:'showNumbers',type:'checkbox',defaultValue:false},
 {name:'images',type:'array',minRows:1,fields:[
 {name:'sourcePath',type:'text',admin:{description:'Original GitHub repository image path (optional when Media upload is used)'}},
 {name:'sourceUrl',type:'text',admin:{description:'Temporary GitHub-backed image URL (optional when Media upload is used)'}},
 {name:'alt',type:'textarea',admin:{description:'Accessibility text, maintained independently of display toggles'}},
 {name:'imageName',type:'text',admin:{description:'Internal asset label, never displayed by default'}},
 {name:'eyebrow',type:'text'},
 {name:'title',type:'text'},
 {name:'caption',type:'text'},
 {name:'description',type:'textarea'},
 {name:'credit',type:'text'},
 {name:'showEyebrow',type:'checkbox',defaultValue:false},
 {name:'showTitle',type:'checkbox',defaultValue:false},
 {name:'showCaption',type:'checkbox',defaultValue:true},
 {name:'showDescription',type:'checkbox',defaultValue:false},
 {name:'showCredit',type:'checkbox',defaultValue:false},
 {name:'annotations',type:'array',admin:{description:'Hotspot legend retained when switching layouts'},fields:[
 {name:'number',type:'number',required:true},{name:'x',type:'number',min:0,max:100,required:true},{name:'y',type:'number',min:0,max:100,required:true},{name:'heading',type:'text'},{name:'body',type:'textarea'}]},
 {name:'media',type:'upload',relationTo:'media'},
 ]}
] }
export const caseStudyBlocks: Block[] = [
  CaseStudyHero, CaseStudyBrief, CaseStudyScope, CaseStudyEditorial,
  FullWidthFigure,
  BentoTwoUp, BentoThreeA, BentoThreeB, BentoFourUp,
  CaseBento,
  BeforeAfterSlider, AnnotatedMedia, Pullquote, SlideLayout, CaseStudyMediaGroup,
]
