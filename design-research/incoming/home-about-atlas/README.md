# Homepage + About Me / SK Atlas — prototype source (staging only)

Source archive of a prototype built in a separate Claude workspace. **Not production code.** It is kept here, isolated, so another agent/developer can review it before any integration. Nothing in this directory is wired into the production site, its routes, navigation, build or deployment.

> Heads-up: `vercel.json` uses `outputDirectory: "."`, so every file committed to this repo is publicly reachable on the live Vercel site, including these HTML files. They are inert (not linked from anywhere) but not private.

## 1. Original source / workspace
Built and published as one Claude Artifact titled "Surya Konijeti" (claude.ai/artifact/LSJb9i2NS9eoqowxfj4fqV, owner: surya.yahoo@gmail.com) with two files: `index.html` (homepage) and `about.html` (About Me with the embedded Atlas). The standalone Atlas was developed in separate artifacts; the latest is "SK Atlas — Grid Gateways & Orange Ripple" (claude.ai/artifact/BiCsxadHjHXFVohfq33HGr). These links are private to the owner.

## 2. Framework and language
No framework, no build step. Single-file static HTML pages with inline CSS and inline vanilla JavaScript (ES2018+). Libraries come from CDNs (see section 7).

## 3. Version identifiers
- Site artifact: version 3 (`1793093931-3ccb`), published 2026-10-27. `index.html` is unchanged since version 1 (sha256 prefix `094970b59ab4`); `about.html` changed in version 3 (Atlas embedded, sha256 prefix `9347c049d530`).
- Standalone Atlas: "stage 2B.7" file `src/atlas/sk-atlas-standalone.html` (sha256 prefix `9aef041f91ab`), i.e. the Atlas as it was before being embedded.
- Atlas content version: 27 nodes, final mapping dated 2026-10-27.

## 4. Source files
```
src/index.html                      Homepage (WebGL intro -> light homepage, work bento, awards ticker, footer)
src/about.html                      About Me page: site header + SK Atlas canvas + site footer
src/atlas/sk-atlas-standalone.html  The Atlas on its own (still contains the SK logo in the rail; about.html does not)
public/                             (empty) no external assets exist, see section 8
```
Keep `index.html` and `about.html` side by side: they link to each other relatively (`about.html`, `./`, `./#work`).

## 5. Entry points
- `src/index.html` — homepage. `src/about.html` — About Me route (`/about` in the route data).
- Atlas test/debug hook: `window.ATLAS` (`goTo`, `openPanel`, `closePanel`, `curSet`, `state`, ...), defined at the end of the Atlas script.

## 6. Run independently
Needs internet (CDN scripts and Google Fonts).
```
cd src && python3 -m http.server 8000     # then open http://localhost:8000/ and /about.html
```
No `npm install`, no package.json, no lockfile, no environment variables, no secrets.

## 7. Dependencies
- GSAP 3.12.2 (`gsap.min.js`, `ScrollTrigger`) from cdnjs, both pages. `Flip` and three.js r134 (`three.min.js`) from cdnjs, homepage only. The Atlas uses GSAP core only; its standalone file loads GSAP 3.12.5.
- Fonts (Google Fonts links, not bundled): homepage and the site header/footer use **DM Serif Display + DM Sans**; the Atlas uses **Bricolage Grotesque + Manrope**.
- No other libraries. The hand model/WebGL data on the homepage is embedded inline.

## 8. Assets
No image, video, icon or font files. All media is inline SVG placeholder art or placeholder boxes. No licensed font binaries.

## 9. External services
CDNs and Google Fonts only. The footer contains the public contact email and Behance/LinkedIn URLs. The Atlas hover/detail links (Michelin gallery, Behance Hopebox) are plain outbound links.

## 10. Known bugs / incomplete
- Homepage work tiles, hero media, award preview cards and the footer 3D SK object are placeholders. Hero text is "Temporary hero statement".
- Typography conflict: this prototype's homepage and About header/footer use DM Serif/DM Sans, which production's DS-03 supersedes with Bricolage Grotesque/Manrope. Not reconciled here by design.
- Atlas on mobile/tablet: only Practice renders nodes below 1024px; other categories show a "content not added yet" state. Desktop only was in scope.
- At 1280px two Atlas titles ("International Bicycle Design Competition", "Four Published International Patents") truncate to two lines by design.
- Atlas content for Teach nodes 2-4 (Topmate, Launchpad Academy, Design Thinking Workshops) is placeholder; the approved Teaching text sits on CARE College.
- Media for every Atlas node is placeholder art. Missing links are left unset (IBDC case study, Michelin project file/video, rap video, SoundCloud, Amar Chitra Katha prototype).
- The hover lines on the iF Design Award and Four Published International Patents nodes are condensed wording written for the prototype; review them.
- Homepage verified only by reading its source; its WebGL runtime was not re-run in the export environment. `about.html` and the Atlas were run in a headless browser.

## 11. Missing / inaccessible
No source files are missing. The Python scripts used to generate the Atlas data edits and the earlier experimental Atlas stages are not included (see section 15).

## 12. Homepage and About Me relationship
Both pages share the SK header (Surya Konijeti / Work / About / Contact) and footer. The header About link goes to `about.html`; `about.html` links back via `./` and `./#work`. Route data: `<script id="site-routes">` in `index.html`. The About page's main area is entirely the Atlas (`<section class="atlas" id="atlas">`); the former placeholder About sections were removed.

## 13. Atlas data locations (`about.html` / standalone)
- All categories and nodes: `<script type="application/json" id="atlas-data">` (about.html ~line 488; standalone ~line 258). Keys: `categories`, `practice.nodes` (4), `layouts.{teach,play,explore,recognition,freelance}.nodes` (4/2/6/6/5), `gateways`, `previewRegions`, `_grid`. Node content lives in each node's `content` object (`summary`, `story`, `rows`).
- Rail category navigation and gateways: built from `categories`/`gateways`.

## 14. Animation / interaction entry points (function names in the Atlas script)
`nodeComponent` (shared node), `buildNet` / `drawNet` / `drawBridge` (non-Practice node layers and connectors), `fitLabels` (title width rules), `pickZone` / `previewIn` / `previewOut` (hover preview), `fillPanel` / `openPanel` / `closePanel` / `swapPanel` (detail panel and click choreography), `goTo` (category transition), `ripple` (orange hover ripple). Homepage: `animate`, `homeUpdate`, `entranceSet`, `curtainAt` (intro-to-homepage curtain), `initAwards`, `initFooter`.

## 15. Excluded
Earlier experimental Atlas stages (2A baseline, 2B..2B.6 and node-standardization variants) and the build scripts are not included. Only the latest working version is transferred.
