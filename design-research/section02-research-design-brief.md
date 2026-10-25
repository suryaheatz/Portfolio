# Centronic — Section 02 / The Research: design playground brief

Status: **PRE-IMPLEMENTATION. NO LAYOUT APPROVED.** Owner of design exploration: Claude Design. Reviewer: user. Technical inspector: Claude Code.
Date: 2026-10-25. Source: current recovery-branch `index.html` lines 1070–1095 and prior GitHub QA artifact run 40210163255.

## Existing content and temporary assets for layout evaluation
- Section heading: **The Research**.
- Evidence image 1: `/public/images/centronic-research-matrix.jpg`; alt: “Start-Stop-Continue retrospective: sticky notes on an importance vs frequency matrix”.
- Caption 1: “Start–Stop–Continue matrix — mapping what cabin controls passengers actually use, and how often”.
- Evidence image 2: `/public/images/centronic-ia.jpg`; alt: “Competitive IA comparison across BMW, Mercedes, Audi, GM, Tesla dashboard architectures”.
- Caption 2: “Competitive IA audit — how five OEMs structure dashboard information: BMW · Mercedes · Audi · GM · Tesla”.
- Paragraph (preserve verbatim): “Two lenses shaped the design: a frequency-vs-importance matrix of existing cabin interactions (what people reach for, how often, and what they skip), and a competitive audit of how five OEMs structure their dashboard information architecture. The pattern was consistent — music, climate, and navigation were the three functions passengers wanted most, but the existing interfaces all required visual attention to operate.”
- Existing expand-icon affordances are nonfunctional; do not claim they work.
- Section boundary follows approved Context; next chapter is Scenario, excluded from changes.

## Image ownership and approval (user clarification, 2026-10-25)
- The currently implemented research images are **temporary layout stand-ins**, not verified or approved final assets. They may have been chosen without the user's consent.
- Use these existing files for playground geometry and layout comparison **only**, clearly labeled **TEMPORARY / IMAGE NOT APPROVED**. Do not imply that image selection or visual narrative is approved.
- User independently selects, prepares, uploads, crops, orders and approves the final images. Do not auto-fetch, generate, substitute, or commit final images without explicit approval.
- Layout approval is separate from **media approval**. The section cannot receive final production sign-off until actual assets, alt text, captions, scale and crop policies are reviewed.
- The playground must allow independent examination of composition with variable aspect ratios and show how a future user-supplied image would fit. Asset replacement must preserve layout and interactions without Claude recreating the whole section.
- Keep original current images only as reference placeholders, preserve file provenance, and expose clear image slots (Research figure 1, Research figure 2), with customizable fit/contain/full-view behavior.
- CMS later should make image replacement and preview self-service, avoiding coding or prompt iterations.

## Critical constraint
The existing side-by-side clipped Bento is a **historical implementation, never user-approved**. Do not use it as an approval default. The task is to provide genuine choices. Never replace the current placeholder files with stock, AI-generated or newly retrieved images; they are NOT approved as final.

## Required interactive playground (Claude Design)
Produce one interactive artifact with a switcher and 3 genuinely different candidate arrangements, using identical current text, temporary images and captions (all media clearly tagged as not approved), not independent copywriting:
- **A. Evidence-first vertical**: complete/uncropped figure 1 followed by figure 2, each with a caption, concise framing paragraph.
- **B. Editorial guided narrative**: text + figure sequencing that foregrounds the two research lenses with figure sizes determined by legibility, not forced Bento cropping.
- **C. Inspectable evidence**: accessible previews with explicit full-size modal/zoom/pan or separate expanded evidence panel; maintain visible captions and support keyboard and mobile interactions.
A/B/C are **exploration hypotheses, not approvals**. Include 1440px desktop and 390/375px mobile, hover, focus, touch, animation on/off or reduced-motion demo, functional figure expansion, and clear state transitions. Show how the two figures are read without zooming into inaccessible text. If a tooltip is relevant, inventory the historic implementation first; don't invent an approved tooltip behavior or silently remove it.

## Design system and acceptance
Use the existing SK Design System and site context as constraints (historical section rhythm, type choices still open, no bulk replacement). Present the source typography and component provenance with each option. Every visible item must retain semantic component type: heading, evidence figure, caption, body paragraph, trigger, modal, tooltip and motion. Do not flatten elements to generic CMS text fields.
For each option show: content mapping, image fit policy, motion choreography, mobile overflow check, interaction and accessibility fallback, benefits/tradeoffs. Produce an approval record that names the chosen option and any user revisions. No implementation before explicit sign-off.

## Scope rules
- No website source changes, deployment, main branch merge, new CMS, or Section 03 work.
- Design options should be visually and interactively inspectable. Screenshots alone are insufficient for tooltip/motion approval.
- After user approval, produce a locked spec; only then authorize Claude Code implementation and browser QA.
- CMS architecture and Decap-vs-WordPress evaluation remain postponed until full-page recovery.
