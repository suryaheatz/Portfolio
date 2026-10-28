# Isolated CMS setup checkpoint

Branch: `integration/payload-cms` (separate from the Centronic mobile-fix branch).

This is committed source only. No live Payload CMS or Vercel editor URL exists yet.

The root Vercel project still uses `outputDirectory: "."` and static routing.
Do **not** point the existing production deployment at this folder.

To make the CMS operational:
1. Provision an isolated Postgres database for preview use and secure PAYLOAD_SECRET.
2. Set Vercel **Root Directory** to `payload-app` in a separate preview-target Vercel project (or explicitly approve changing the deployment architecture).
3. Add DATABASE_URL and PAYLOAD_SECRET through Vercel environment variables. Never paste secrets into chat or GitHub.
4. Install dependencies and generate the Payload admin import map; build and test auth/admin routes.
5. Import seed JSON from `seed/atlas-source.json` with `seed/seed-atlas.ts`, after confirming schema/connection.
6. Preserve approved pages; connect real frontend components before parity testing.
7. Confirm the admin and public preview URLs in a browser and obtain approval.

The `src/app/(frontend)` placeholder is not the website. It explicitly communicates the incomplete state rather than pretending the approved homepage has been converted.

The original HTML and approved Vercel visual references remain unchanged.
