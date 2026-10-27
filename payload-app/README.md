# Payload migration workspace (integration branch only)

This is the **initial Payload schema layer**, not a complete or deployed CMS. It establishes editable data models for the existing homepage's hero, selected-work bento, awards marquee, shared header, and shared footer.

Approved rendered references:
- `/migration-preview/index.html`
- `/migration-preview/about.html`

Original sources (never change):
- `/design-research/incoming/home-about-atlas/src/index.html`
- `/design-research/incoming/home-about-atlas/src/about.html`

## Next implementation tasks

1. Provision an isolated Payload 3 / Next.js app with database and storage.
2. Register these blocks, collections, and globals in Payload config.
3. Import the original content programmatically. Keep placeholders as they exist, don't invent data.
4. Move the visual DOM/CSS/motion into frontend components in that app, preserving every behavior; use a common header and footer.
5. Wire the rendered components to the schema; validate full editing, ordering, links and publication.
6. Deploy to a Vercel branch preview in a correctly configured Next.js project and compare against approved static previews before declaring the gate passed.

The homepage WebGL intro, Atlas canvas, GSAP lifecycle, and case-study pages are **not** migrated by this commit. These schema files do not by themselves make the CMS operational.

## Preservation rule

No redesign, font changes beyond the previously approved DM Serif Display / DM Sans substitution, structural improvements to animations, or content changes. Existing source remains the visual and behavioral authority. Zodiak remains the DS quote font.
