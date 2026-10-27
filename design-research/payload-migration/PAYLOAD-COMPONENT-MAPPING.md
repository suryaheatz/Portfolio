# SK Portfolio — Payload Component Mapping
## Payload CMS Migration Preparation

**Scope:** Recommended Payload CMS block schemas and frontend renderer mappings for all discovered content blocks.

**Generated:** 2026-10-27

**Hard restriction:** Do not install Payload yet. Do not create actual schema files. This document is architectural planning only.

---

## Architecture Overview

```
Payload CMS
├── Collections
│   ├── case-studies         ← one doc per project
│   └── pages                ← homepage + any future static pages
├── Globals
│   ├── sk-navigation        ← site header nav
│   └── sk-projects-registry ← replaces sk-projects.js
└── Block types (reusable across collections)
    ├── ProseBlock
    ├── BentoBlock
    ├── QuoteTwoUpBlock
    ├── SlideBlock
    ├── GalleryBlock
    ├── AccordionBlock
    ├── ChipsBlock
    ├── KeyDatesBlock
    ├── TableBlock
    ├── ImpactListBlock
    ├── HeroBlock
    ├── PrototypeEmbedBlock
    └── TabsBlock
```

---

## Collection: `case-studies`

```typescript
// Conceptual schema — not yet implemented

{
  slug: 'case-studies',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'subtitle', type: 'text' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'template', type: 'select', options: ['narrative', 'image-only'], defaultValue: 'narrative' },

    // Hero / Brief / Scope stack (L4-01) — fixed section
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroTitle', type: 'text' },
    { name: 'briefHeading', type: 'text' },
    { name: 'briefBody', type: 'richText' },
    { name: 'scopeItems', type: 'array', fields: [
      { name: 'label', type: 'text' }
    ]},

    // Optional Slides Panel (L4-02) — Haptix-style
    { name: 'hasSlides', type: 'checkbox', defaultValue: false },
    { name: 'slides', type: 'array', fields: [
      { name: 'variant', type: 'select', options: ['standard', 'dark'], defaultValue: 'standard' },
      { name: 'eyebrow', type: 'text' },
      { name: 'heading', type: 'text' },
      { name: 'body', type: 'richText' },
      { name: 'image', type: 'upload', relationTo: 'media' }
    ]},

    // Variable content zone (Payload Blocks field)
    { name: 'blocks', type: 'blocks', blocks: [
      ProseBlock,
      BentoBlock,
      QuoteTwoUpBlock,
      SlideBlock,
      GalleryBlock,
      AccordionBlock,
      ChipsBlock,
      KeyDatesBlock,
      TableBlock,
      ImpactListBlock,
      PrototypeEmbedBlock,
      TabsBlock
    ]},

    // Access management (future — not part of this task)
    // { name: 'accessControl', type: 'group', ... }
  ]
}
```

---

## Block Schema: ProseBlock

```typescript
{
  slug: 'prose',
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Prose (text only)', value: 'prose' },
        { label: 'Prose + List', value: 'prose-list' },
        { label: 'Prose + Aside', value: 'prose-with-aside' },
        { label: 'Prose + Gallery', value: 'prose-gallery' },
        { label: 'Prose + Chips', value: 'prose-chips' },
        { label: 'Prose + Accordion', value: 'prose-accordion' }
      ],
      defaultValue: 'prose'
    },
    { name: 'heading', type: 'text' },
    { name: 'headingLevel', type: 'select', options: ['h2', 'h3'], defaultValue: 'h2' },
    { name: 'body', type: 'richText' },

    // Conditional: prose-with-aside
    { name: 'asideHeading', type: 'text', admin: { condition: (_, siblingData) => siblingData.variant === 'prose-with-aside' } },
    { name: 'asideBody', type: 'richText', admin: { condition: (_, siblingData) => siblingData.variant === 'prose-with-aside' } },

    // Conditional: prose-list
    { name: 'listItems', type: 'array', fields: [
      { name: 'text', type: 'text' }
    ], admin: { condition: (_, siblingData) => siblingData.variant === 'prose-list' } },

    // Conditional: prose-chips
    { name: 'chips', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'accent', type: 'checkbox', defaultValue: false }
    ], admin: { condition: (_, siblingData) => siblingData.variant === 'prose-chips' } },

    // Conditional: prose-accordion
    { name: 'accordionItems', type: 'array', fields: [
      { name: 'question', type: 'text' },
      { name: 'answer', type: 'richText' }
    ], admin: { condition: (_, siblingData) => siblingData.variant === 'prose-accordion' } },

    // Conditional: prose-gallery (embeds a gallery)
    { name: 'galleryImages', type: 'array', fields: [
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'caption', type: 'text' },
      { name: 'alt', type: 'text' }
    ], admin: { condition: (_, siblingData) => siblingData.variant === 'prose-gallery' } }
  ]
}
```

**Frontend renderer:** `<ProseBlock data={block} />` → renders variant-specific layout.  
**Animation:** `data-reveal` attribute on outer wrapper; Anime.js picks up automatically.

---

## Block Schema: BentoBlock

```typescript
{
  slug: 'bento',
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Bento-2 (2 cells)', value: '2' },
        { label: 'Bento-3 (3 cells, C full-width)', value: '3' },
        { label: 'Bento-4 (4 cells, A full-width)', value: '4' },
        { label: 'Bento-5 (5 cells, C full-width)', value: '5' },
        { label: 'Bento-6 (6 cells, C+F full-width)', value: '6' },
        { label: 'Bento-7 (7 cells, A tall-left)', value: '7' },
        { label: 'Bento-8 (8 cells, A+E full-width)', value: '8' },
        { label: 'Bento-9 (9 cells, A tall-left)', value: '9' }
      ]
    },
    {
      name: 'cells',
      type: 'array',
      minRows: 2,
      maxRows: 9,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', required: true },
        { name: 'caption', type: 'text' }
      ],
      // Validation: cell count must equal variant number
      validate: (cells, { siblingData }) => {
        // cells.length must === parseInt(siblingData.variant)
      }
    }
  ]
}
```

**Frontend renderer:**
```tsx
// Pseudocode
function BentoBlock({ variant, cells }) {
  return (
    <div className={`cs-bento cs-bento--${variant}`}>
      {cells.map(cell => <BentoCell key={cell.id} {...cell} />)}
    </div>
  )
}
```

**Admin requirement:** Cell count validation against variant. Consider showing a preview thumbnail of the grid layout in the Payload admin when variant is selected.

---

## Block Schema: QuoteTwoUpBlock

```typescript
{
  slug: 'quote-two-up',
  fields: [
    {
      name: 'quotes',
      type: 'array',
      minRows: 2,
      maxRows: 2,
      fields: [
        { name: 'text', type: 'textarea', required: true },
        { name: 'attribution', type: 'text', required: true }
      ]
    }
  ]
}
```

**Frontend renderer:** `<QuoteTwoUpBlock data={block} />`  
**Note:** Always exactly 2 quotes. Payload `minRows: 2, maxRows: 2` enforces this.

---

## Block Schema: SlideBlock (standalone)

```typescript
{
  slug: 'slide',
  fields: [
    { name: 'variant', type: 'select', options: ['standard', 'dark'], defaultValue: 'standard' },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'imageAlt', type: 'text' }
  ]
}
```

**Note:** For the carousel (Slides Panel), slides are stored in the case study document's `slides` field, not as individual `SlideBlock` instances.

---

## Block Schema: GalleryBlock

```typescript
{
  slug: 'gallery',
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: '3-column (landscape)', value: 'g3' },
        { label: '4-column (landscape)', value: 'g4' },
        { label: '4-column portrait (screens)', value: 'g4-tall' }
      ],
      defaultValue: 'g4'
    },
    { name: 'sectionHeading', type: 'text' },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
        { name: 'alt', type: 'text', required: true }
      ]
    }
  ]
}
```

---

## Block Schema: AccordionBlock

```typescript
{
  slug: 'accordion',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true }
      ]
    }
  ]
}
```

---

## Block Schema: ChipsBlock

```typescript
{
  slug: 'chips',
  fields: [
    { name: 'label', type: 'text' },  // optional section label above chips
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'text', type: 'text', required: true },
        { name: 'accent', type: 'checkbox', defaultValue: false, label: 'Highlight (orange)' }
      ]
    }
  ]
}
```

---

## Block Schema: KeyDatesBlock

```typescript
{
  slug: 'key-dates',
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Key dates' },
    {
      name: 'variant',
      type: 'select',
      options: ['list', 'tabbed'],
      defaultValue: 'list'
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'date', type: 'text', required: true },
        { name: 'event', type: 'text', required: true },
        { name: 'tabLabel', type: 'text' }  // used in tabbed variant
      ]
    }
  ]
}
```

---

## Block Schema: ImpactListBlock

```typescript
{
  slug: 'impact-list',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'number', type: 'number', required: true },
        { name: 'unit', type: 'text' },     // e.g. "%" or "x" or ""
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text' }
      ]
    }
  ]
}
```

**Frontend note:** The `number` field maps to `data-count-to` attribute on the rendered element, driving GSAP count-up animation.

---

## Block Schema: PrototypeEmbedBlock

```typescript
{
  slug: 'prototype-embed',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'posterImage', type: 'upload', relationTo: 'media' },
    { name: 'prototypeUrlV1', type: 'text', required: true },
    { name: 'prototypeUrlV2', type: 'text' },         // optional second version
    { name: 'labelV1', type: 'text', defaultValue: 'V1 Original' },
    { name: 'labelV2', type: 'text', defaultValue: 'V2 Recreation' },
    {
      name: 'deviceModes',
      type: 'select',
      options: ['desktop-only', 'desktop-phone', 'phone-only'],
      defaultValue: 'desktop-phone'
    }
  ]
}
```

---

## Block Schema: TabsBlock

```typescript
{
  slug: 'tabs',
  fields: [
    {
      name: 'tabs',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [ProseBlock, GalleryBlock, ChipsBlock, AccordionBlock]
          // Note: Bento and Prototype excluded due to animation conflicts
        }
      ]
    }
  ]
}
```

---

## Global: SK Projects Registry

Replaces the current `public/sk-projects.js` file with a Payload Global:

```typescript
{
  slug: 'sk-projects-registry',
  fields: [
    {
      name: 'projects',
      type: 'array',
      fields: [
        { name: 'slug', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'url', type: 'text', required: true },
        { name: 'coverImage', type: 'upload', relationTo: 'media' },
        { name: 'template', type: 'number', defaultValue: 1 }
      ]
    }
  ]
}
```

This global is fetched at build time (or SSR) to generate `cs-nav` prev/next links on each case study page.

---

## Media Collection

```typescript
{
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*']
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' }
  ]
}
```

---

## Frontend Renderer Architecture

```
pages/
  case-studies/
    [slug]/
      index.tsx       ← Fetches case study doc from Payload
  index.tsx           ← Homepage (separate from Centronic)

components/
  blocks/
    ProseBlock.tsx
    BentoBlock.tsx
    QuoteTwoUpBlock.tsx
    SlideBlock.tsx
    GalleryBlock.tsx
    AccordionBlock.tsx
    ChipsBlock.tsx
    KeyDatesBlock.tsx
    TableBlock.tsx
    ImpactListBlock.tsx
    PrototypeEmbedBlock.tsx
    TabsBlock.tsx
  shared/
    BentoCell.tsx
    GalleryItem.tsx
    LightboxModal.tsx
    ChipTag.tsx
    AccordionItem.tsx
  layout/
    HeroBriefScopeStack.tsx   ← L4-01 (fixed section — not a selectable block)
    ChapterNav.tsx             ← L4-03 (infrastructure)
    CaseStudyNav.tsx           ← L2-08 (global)
    SiteNav.tsx
  BlocksRenderer.tsx           ← Iterates blocks[] array, dispatches to correct component
```

### BlocksRenderer pattern (pseudocode)

```tsx
const BLOCK_MAP = {
  prose: ProseBlock,
  bento: BentoBlock,
  'quote-two-up': QuoteTwoUpBlock,
  slide: SlideBlock,
  gallery: GalleryBlock,
  accordion: AccordionBlock,
  chips: ChipsBlock,
  'key-dates': KeyDatesBlock,
  table: TableBlock,
  'impact-list': ImpactListBlock,
  'prototype-embed': PrototypeEmbedBlock,
  tabs: TabsBlock
}

function BlocksRenderer({ blocks }) {
  return blocks.map((block) => {
    const Component = BLOCK_MAP[block.blockType]
    if (!Component) return null
    return <Component key={block.id} data={block} />
  })
}
```

---

## Draft / Preview Model

- Payload's built-in draft system (`versions.drafts: true`) on the `case-studies` collection
- Preview URL pattern: `/case-studies/[slug]?draft=true&token=[previewSecret]`
- Frontend: detects `?draft=true` query param → fetches draft content from Payload REST API
- Preview requires authentication token exchange (Payload built-in preview feature)

---

## Access Management Note

Access management (case study password protection, token-gated access) is **a platform capability** documented separately. It is not modeled as a content block. It should be implemented at the collection level via Payload's access control functions, not in the blocks schema.

---

*Generated 2026-10-27 · SK Portfolio Payload CMS Migration · Read-only inventory*
