# SK Portfolio — Case Study Access Management requirements

Status: APPROVED FOR PLANNING AND COMPONENT INVENTORY ONLY. No implementation, deployment or CMS migration authorized by this note.
Date: 2026-10-27

## Portfolio owner requirements
- Per-case-study visibility: fully public; public teaser with a configurable cutoff/block boundary; or entirely restricted.
- Visitors see configured public content, then request access by entering an email address (optional reason for requesting access).
- Owner reviews access requests, grants/denies/revokes access, and sees per-case-study permissions.
- Temporary authorization: email-verified one-time code/link that grants an access session lasting at most 24 hours. One-time redemption does not mean the same code remains valid for 24 hours. Enforce server-side expiry.
- Persistent authorization: allowlisted verified identities retain access until owner revokes. Reauthentication on new device is required, not a permanent reusable password.
- Owner can specify which case studies and content blocks a grant unlocks. Default-deny on restricted blocks.

## Security constraints
- Never send restricted block content in unauthenticated HTML, hydration payloads, site search indexes, static JSON, or client bundles. A CSS blur/overlay is not protection.
- Never expose confidential original media via public asset URLs. Use private object storage and authorized, time-limited delivery for restricted media, or redact it.
- Server-side identity authorization on each protected request. Hash and expire single-use tokens; prevent replay; log revocation; rate-limit and bot-protect request and verification forms. Secure cookies.
- Sanity Free currently provides public datasets only; content stored there should be safe to expose. For restricted information, keep it in a genuinely controlled backend or private store, not Sanity public datasets without protection.
- Verify case-study permission and employment/client confidentiality before publication.
- Provide an admin access-request queue with audit trail.

## Proposed system responsibilities (pending technical audit)
- Sanity: content schemas, block ordering, visibility settings, draft previews.
- Application server: session identity, access checks, restricted content gating and preview authorization.
- Database/auth: requests, time-bound grants, perpetual grants, revocations, session lifecycle.
- Email: one-time codes / invitation delivery.
- Private file storage: confidential media with signed authorized delivery.

## Financial and operational constraint
- Design to fit free-tier usage where possible, but **do not promise perpetual zero cost**: quotas, inactivity pauses, domain/email charges, Vercel Hobby non-commercial restrictions, and private asset storage requirements may necessitate paid service.
- Conduct cost + licensing check before selecting vendors or implementation. No automatic upgrades.
- User expects a permanent, low-maintenance solution without many Git branches.

## Acceptance cases
1. Public visitor sees only the configured teaser.
2. Direct link/HTML/API requests cannot retrieve restricted blocks without authorization.
3. Visitor submits email and owner receives request.
4. Owner issues one-time code/link; redemption creates an authorized session expiring after 24h; replay fails.
5. Owner can grant persistent access per case study; revoked user loses access.
6. Restricted images never resolve for unauthorized visitors.
7. Owner previews both public and authorized states before publishing.
8. Existing design-system blocks, scroll transitions, and GSAP animations remain unchanged.

Include this feature in the full SK component inventory and Sanity architecture planning. It is not one of the editorial content block types.
