import type { GlobalConfig } from 'payload'

/**
 * SK Atlas is a single coordinated interface, not 27 independent layout blocks.
 * The seed preserves every original property including node text, coordinates,
 * category metadata, gateways, links, preview regions and animation settings.
 * Only content changes made in CMS should affect the renderer.
 */
export const AtlasContent: GlobalConfig = {
  slug: 'atlasContent',
  label: 'About Me / SK Atlas',
  versions: { drafts: true },
  fields: [
    {
      name: 'sourceData',
      label: 'Atlas content and layout data',
      type: 'json',
      required: true,
      admin: { description: 'Exact imported Atlas JSON. Preserve node IDs and positioning for animation parity.' },
    },
  ],
}
