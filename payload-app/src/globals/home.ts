import type { GlobalConfig } from 'payload'

/**
 * HomePage Global -- powers the WebGL 3D Hand Intro, Hero Section,
 * Selected Work Bento Grid (64/36 alternating), and Counter-Moving Awards Marquee
 * in `approved-source/index.html` and `/preview/home`.
 */
export const HomePage: GlobalConfig = {
  slug: 'homePage',
  label: 'Home Page (WebGL + Work)',
  admin: {
    description: 'Configure the Home Page WebGL 3D Hand intro phrases, Hero statement, Selected Work Bento Grid (linked to your Case Studies), and Awards Marquee.',
    livePreview: {
      url: () => '/preview/home',
      breakpoints: [
        { label: 'Mobile',  name: 'mobile',  width: 375,  height: 812 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  fields: [
    {
      name: 'skipIntroInPreview',
      type: 'checkbox',
      defaultValue: false,
      label: 'Jump Past WebGL Intro in Preview (Instant Page Edit Mode)',
      admin: {
        description: 'When checked, the right-hand Live Preview automatically scrolls past the 730vh WebGL 3D Hand intro so you can edit the Hero, Selected Work, and Awards sections immediately. Uncheck anytime to watch the full WebGL 3D Hand sequence from the top.',
      },
    },
    {
      type: 'collapsible',
      label: '1. WebGL 3D Hand & Starfield Intro',
      admin: {
        initCollapsed: false,
        description: 'Controls the 4 perspective phrases that fly past the floating needle after the 3D hand sequence, and the Surya star hover greeting.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'webglLineOne',   type: 'text', label: 'WebGL Phrase 01 (Left)',  defaultValue: 'I decode', admin: { width: '25%' } },
            { name: 'webglLineTwo',   type: 'text', label: 'WebGL Phrase 02 (Right)', defaultValue: 'Problems', admin: { width: '25%' } },
            { name: 'webglLineThree', type: 'text', label: 'WebGL Phrase 03 (Left)',  defaultValue: 'I unlock', admin: { width: '25%' } },
            { name: 'webglLineFour',  type: 'text', label: 'WebGL Phrase 04 (Right)', defaultValue: 'Value',    admin: { width: '25%' } },
          ],
        },
        {
          name: 'starGreeting',
          type: 'text',
          label: 'Surya Star Hover Tooltip Greeting',
          defaultValue: "Hi, I'm Surya. Sun, actually.",
          admin: { description: 'Displayed when hovering or tapping the bright Surya star in the WebGL sky.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: '2. Hero Statement & Featured Media (Full-Bleed -> Contained)',
      admin: {
        initCollapsed: false,
        description: 'The light SK Design System Hero revealed as the WebGL aperture opens.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'heroLineOne',   type: 'text', label: 'Hero Display Line 1', defaultValue: 'Temporary',       admin: { width: '33%' } },
            { name: 'heroLineTwo',   type: 'text', label: 'Hero Display Line 2', defaultValue: 'hero statement,', admin: { width: '33%' } },
            { name: 'heroLineThree', type: 'text', label: 'Hero Display Line 3', defaultValue: 'three lines.',    admin: { width: '34%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'heroMetaLeft',  type: 'text', label: 'Hero Bottom-Left Meta',  defaultValue: 'Product Designer  -  Bengaluru, India', admin: { width: '65%' } },
            { name: 'heroMetaRight', type: 'text', label: 'Hero Bottom-Right Cue',  defaultValue: 'Scroll',                                admin: { width: '35%' } },
          ],
        },
        {
          name: 'heroMedia',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero Featured Media (16:9 Image / Video)',
          admin: { description: 'Full-bleed to contained 16:9 featured visual directly below the Hero statement. Leave empty to show the SK Design System placeholder.' },
        },
        {
          name: 'heroMediaCaption',
          type: 'text',
          label: 'Hero Media Placeholder Label',
          defaultValue: 'Hero media placeholder  -  16:9',
        },
      ],
    },
    {
      type: 'collapsible',
      label: '3. Selected Work Bento Grid (64/36 Alternating Project Tiles)',
      admin: {
        initCollapsed: false,
        description: 'Each pair of tiles forms a 2-column Bento row (Wide 16:9 + Narrow 1:1). Link any tile to a Case Study slug (e.g. "centronic" or "haptix") to make it clickable.',
      },
      fields: [
        {
          name: 'workHeading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Selected Work',
        },
        {
          name: 'projects',
          type: 'array',
          label: 'Selected Work Project Tiles',
          defaultValue: [
            { title: 'Centronic MMA',     category: 'Autonomous HMI',      role: 'Sr. UX Designer',    year: '2020', layout: 'wide',   caseStudySlug: 'centronic' },
            { title: 'Haptix Thumbwheel', category: 'Tactile Automotive',  role: 'Senior UX Designer', year: '2020', layout: 'narrow', caseStudySlug: 'haptix' },
            { title: 'Project title three', category: 'Category placeholder', role: 'Role',             year: '2025', layout: 'narrow', caseStudySlug: '' },
            { title: 'Project title four',  category: 'Category placeholder', role: 'Role',             year: '2024', layout: 'wide',   caseStudySlug: '' },
            { title: 'Project title five',  category: 'Category placeholder', role: 'Role',             year: '2024', layout: 'wide',   caseStudySlug: '' },
            { title: 'Project title six',   category: 'Category placeholder', role: 'Role',             year: '2023', layout: 'narrow', caseStudySlug: '' },
          ],
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'title',         type: 'text', label: 'Project Title',   required: true, admin: { width: '50%' } },
                { name: 'caseStudySlug', type: 'text', label: 'Case Study Slug (e.g. centronic, haptix)', admin: { width: '50%', description: 'Links this tile to /preview/case-studies/<slug>' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'category', type: 'text', label: 'Category Label', defaultValue: 'UX Design', admin: { width: '35%' } },
                { name: 'role',     type: 'text', label: 'Role',           defaultValue: 'Lead Designer', admin: { width: '35%' } },
                { name: 'year',     type: 'text', label: 'Year',           defaultValue: '2026', admin: { width: '15%' } },
                {
                  name: 'layout',
                  type: 'select',
                  label: 'Tile Width',
                  defaultValue: 'wide',
                  enumName: 'enum_home_page_projects_layout',
                  options: [
                    { label: 'Wide (16:9 - 64%)',  value: 'wide' },
                    { label: 'Narrow (1:1 - 36%)', value: 'narrow' },
                  ],
                  admin: { width: '15%' },
                },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Project Cover Media',
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '4. Awards & Patents Counter-Moving Marquee',
      admin: {
        initCollapsed: true,
        description: 'Two counter-moving ticker rows (Row 1 moves Right->Left, Row 2 moves Left->Right) with floating GSAP hover preview cards.',
      },
      fields: [
        {
          name: 'awards',
          type: 'array',
          label: 'Marquee Phrases & Hover Cards',
          defaultValue: [
            { rowNumber: '1', label: '3 INTERNATIONAL AWARDS', itemType: 'preview', href: '/awards#international', previewLabelOne: 'International 01', previewLabelTwo: 'International 02', previewLabelThree: 'International 03' },
            { rowNumber: '1', label: '3 NATIONAL AWARDS',      itemType: 'preview', href: '/awards#national',      previewLabelOne: 'National 01',      previewLabelTwo: 'National 02',      previewLabelThree: 'National 03' },
            { rowNumber: '2', label: '4 PATENTS',              itemType: 'preview', href: '/awards#patents',       previewLabelOne: 'Patent 01',        previewLabelTwo: 'Patent 02',        previewLabelThree: 'Patent 03' },
            { rowNumber: '2', label: 'RECOGNITION ACROSS DESIGN & INNOVATION', itemType: 'cta', ctaText: 'VIEW AWARDS & PATENTS ->', href: '/awards' },
          ],
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'rowNumber',
                  type: 'select',
                  label: 'Ticker Row',
                  defaultValue: '1',
                  enumName: 'enum_home_page_awards_row',
                  options: [
                    { label: 'Row 1 (Right -> Left)', value: '1' },
                    { label: 'Row 2 (Left -> Right)', value: '2' },
                  ],
                  admin: { width: '25%' },
                },
                {
                  name: 'itemType',
                  type: 'select',
                  label: 'Interaction Type',
                  defaultValue: 'preview',
                  enumName: 'enum_home_page_awards_type',
                  options: [
                    { label: 'Hover Preview Cards', value: 'preview' },
                    { label: 'CTA Pill Link',       value: 'cta' },
                  ],
                  admin: { width: '25%' },
                },
                { name: 'label', type: 'text', label: 'Marquee Display Phrase', required: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'ctaText', type: 'text', label: 'CTA Text (if CTA type)', admin: { width: '50%' } },
                { name: 'href',    type: 'text', label: 'Link Href', defaultValue: '/awards', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              admin: { condition: (_, siblingData) => siblingData?.itemType !== 'cta' },
              fields: [
                { name: 'previewLabelOne',   type: 'text',   label: 'Card 01 Label', defaultValue: 'Award 01', admin: { width: '33%' } },
                { name: 'previewLabelTwo',   type: 'text',   label: 'Card 02 Label', defaultValue: 'Award 02', admin: { width: '33%' } },
                { name: 'previewLabelThree', type: 'text',   label: 'Card 03 Label', defaultValue: 'Award 03', admin: { width: '34%' } },
              ],
            },
            {
              type: 'row',
              admin: { condition: (_, siblingData) => siblingData?.itemType !== 'cta' },
              fields: [
                { name: 'previewImageOne',   type: 'upload', relationTo: 'media', label: 'Card 01 Image', admin: { width: '33%' } },
                { name: 'previewImageTwo',   type: 'upload', relationTo: 'media', label: 'Card 02 Image', admin: { width: '33%' } },
                { name: 'previewImageThree', type: 'upload', relationTo: 'media', label: 'Card 03 Image', admin: { width: '34%' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
