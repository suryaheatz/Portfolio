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
export const CaseStudyMediaGroup: Block = { slug: 'caseStudyMediaGroup', labels: {singular:'Case study image group',plural:'Case study image groups'}, fields: [
 {name:'sectionHeading',type:'text',required:true},
 {name:'sectionKey',type:'text',admin:{description:'Source section or chapter identity'}},
 {name:'layoutStyle',type:'select',defaultValue:'evidence',admin:{description:'Legacy layout fallback. New presentation choice below overrides this.'},options:[{label:'Evidence gallery',value:'evidence'},{label:'Grid',value:'grid'}]},
 {name:'presentation',type:'select',admin:{description:'Change visual layout without deleting captions or other image content.'},options:[
 {label:'Evidence / tooltip gallery',value:'tooltip'},{label:'Adaptive grid',value:'adaptive'},{label:'Sequential slides',value:'slides'},{label:'Annotated image',value:'annotated'},{label:'Evolution sequence',value:'evolution'},{label:'Full-width figures',value:'figures'}]},
 {name:'gridVariant',type:'select',defaultValue:'two',admin:{condition:(_data,siblingData)=>siblingData?.presentation==='adaptive'},options:[
 {label:'Two-column',value:'two'},{label:'Three equal columns',value:'three'},{label:'Traditional grid',value:'traditional'},{label:'Three-column asymmetric',value:'asymmetric'}]},
 {name:'appearance',type:'select',defaultValue:'inherit',options:[{label:'Inherit section',value:'inherit'},{label:'Light',value:'light'},{label:'Dark',value:'dark'}]},
 {name:'slideAlignment',type:'select',defaultValue:'textLeft',admin:{condition:(_data,siblingData)=>siblingData?.presentation==='slides'},options:[{label:'Text left / image right',value:'textLeft'},{label:'Image left / text right',value:'imageLeft'}]},
 {name:'showSectionHeading',type:'checkbox',defaultValue:true},
 {name:'showNumbers',type:'checkbox',defaultValue:false},
 {name:'images',type:'array',minRows:1,fields:[
 {name:'sourcePath',type:'text',required:true,admin:{description:'Original GitHub repository image path'}},
 {name:'sourceUrl',type:'text',required:true,admin:{description:'Temporary GitHub-backed image URL; replace with Media upload after validation'}},
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
export const caseStudyBlocks: Block[] = [CaseStudyHero, CaseStudyBrief, CaseStudyScope, CaseStudyEditorial, FullWidthFigure, CaseStudyMediaGroup]
