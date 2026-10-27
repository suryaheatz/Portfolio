import type { GlobalConfig } from 'payload'

/** Content configuration, not a license to change visual markup or motion. */
export const SiteHeader: GlobalConfig = {
  slug: 'siteHeader',
  fields: [
    { name: 'brandName', type: 'text', defaultValue: 'Surya Konijeti', required: true },
    { name: 'brandMode', type: 'select', required: true, defaultValue: 'name', options: [
      { label: 'Name', value: 'name' }, { label: 'Logo', value: 'logo' }, { label: 'Logo and name', value: 'both' },
    ] },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'navigation', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'url', type: 'text', required: true },
    ] },
  ],
}

export const SiteFooter: GlobalConfig = {
  slug: 'siteFooter',
  fields: [
    { name: 'contactHeading', type: 'text' },
    { name: 'contactEmail', type: 'email' },
    { name: 'socialLinks', type: 'array', fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'url', type: 'text', required: true },
    ] },
    { name: 'footerText', type: 'textarea' },
  ],
}
