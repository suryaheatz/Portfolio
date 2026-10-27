# SK Portfolio: Gate Status and Shared Handoff

Updated: 2026-10-25
Repository: `suryaheatz/Portfolio`
Working branch: `recovery/r0-centronic`

## Operating agreement

- Claude Code performs implementation and reports evidence. ChatGPT evaluates screenshots, code, and audit findings; the user approves each gate.
- Only work on the recovery branch. Never deploy or merge to `main` without the user's explicit approval.
- Before beginning work, Claude Code must read this file from the checked-out branch and check Git status. A file update does not automatically send Claude a message or trigger execution.
- After each gate Claude Code must write an evidence report into `design-research/`, commit screenshots or stable references, list files changed and known limitations, then stop for approval.
- Do not infer approval from commits or from technical success. Previous decisions can be challenged, but require explanation and user approval before changing.
- Preserve case-study content, assets, 12-chapter architecture, Evidence Gallery, and verified repairs unless explicitly approved otherwise.

## Current status: Section 02: The Research — layout implementation approved, QA pending

- Layout Option C, marginal label stack: **approved for implementation**.
- Claude reported implementation in commit `ec1294a` on recovery branch.
- User has submitted desktop screenshots showing the layout and neighboring sections.
- **Provisionally accepted for recovery sequencing** after user reviewed actual QA screenshots. Final production sign-off pending.

### Deferred Section 01 stabilization checks (not blockers to Section 02 design)

- Investigate the visible vertical chapter-navigation dots at the left of one screenshot. Do not label them a rendering artifact without evidence.
- Verify and present actual Section 01 mobile screenshots, including responsive alignment, diagram legibility and caption treatment.
- Check animation behavior in a browser with required dependencies loaded; explicitly distinguish unverified cases.
- Research and Scenario diagram scaling / right-edge clipping belong to their own later section gates. Do not change now.

## Foundation and design decisions

| Decision | Status |
|---|---|
| Historical surface-card wrappers | Approved as baseline; section exceptions require approval |
| Dark scope card `#1a1917` with four metadata fields | Approved |
| Historical `--sp-20` section rhythm | Approved as baseline |
| GSAP core, ScrollTrigger, SplitText alignment at 3.15.0 | Claude reports implementation in `dad4bc6`; real-browser regression evidence incomplete |
| Typography choice | Open; no bulk replacements |
| Meta labels/chips | Open; no blanket decision |
| Section 01 layout Option C | Provisionally visually accepted for recovery sequencing; final release QA pending; does not block Section 02 |
| Section 02 layout | Direction 1 stacked editorial layout approved for scoped implementation on recovery branch; image and copy approvals remain separate |
| Production deployment / merge to main | Not approved |

## Next Claude task (limited)

**Claude Code:** implement the specifically approved Section 02 Direction 1 editorial stacked-evidence design from `design-research/section02-review/playground.html` on `recovery/r0-centronic`. Follow the scoped implementation specification in `design-research/section02-review/IMPLEMENTATION-GATE.md`. Preserve Section 01 and Section 03, do not deploy or merge. Capture actual browser QA evidence and stop for review.

## Handoff protocol

1. Claude fetches Git and reads this file at session start.
2. Claude works only within the approved gate, then commits an evidence report and stops.
3. ChatGPT reviews the GitHub report directly when user asks for review.
4. User approves, requests revisions, or rejects the gate.
5. Approval must be recorded in this file before Claude begins the next gate. If ChatGPT cannot write to GitHub, Claude must record the user-confirmed approval after receiving it.

---

## Agent handoff queue (ChatGPT authored, 2026-10-25)

**Queue item:** `CENTRONIC-R2D-QA-001`  
**Status:** HISTORICAL / COMPLETED (Section 01 QA ran; evidence archived in GitHub Actions run 40207934681)  
**Gate:** R2-D Section 01 visual QA only  
**Approval:** User approved establishing automation infrastructure, **not** broad redesign, production deployment, or bypassing section gates.

### Archived instructions for the completed Section 01 QA run (not current directions)

1. Fetch the recovery branch and read this file first.
2. Inspect the Section 01 implementation for Option C without redesigning it.
3. Diagnose the left-side chapter-navigation dots from screenshot evidence and the actual DOM/CSS/JS. Distinguish intended behavior from defects.
4. Capture **real** mobile screenshots at 375px and 390px, and desktop evidence. Include viewport sizes, URLs, and page positions. Test diagram containment, caption legibility, horizontal overflow, and gutters.
5. Test Section 01 related scroll reveals and transitions with dependencies successfully loaded; report failures and untested conditions separately.
6. Commit an evidence report and screenshots under `design-research/` on the recovery branch, listing checks, conclusions, changes (if any), and outstanding issues.
7. **STOP.** Do not modify neighboring sections, start Section 02, merge to main, or deploy production. Ask the user to lock Section 01 after ChatGPT reviews the evidence.

### Runner prerequisites

- Set up the official Anthropic Claude Code GitHub Action after reviewing its security and usage terms.
- Provide authentication via a GitHub Actions secret (e.g. `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`). Never place secret values in files or chat.
- GitHub manual dispatch requires the workflow to exist on the default branch. Since changes to `main` are separately gated, seek explicit approval for a **workflow-only** main-branch addition before installing it.
- Prefer manual dispatch for the first run and an explicit gate identifier in the workflow. Do not auto-run on every status-file change until cost, security, and approval boundaries are verified.
- Running an Action is separate from messaging the user's existing local Claude Code conversation.


## User review decision — 2026-10-25 (Section 01)

- User reviewed the genuine GitHub Actions Section 01 QA screenshots and considers the recovered appearance substantially better than the regressed version.
- **Provisional visual acceptance for recovery sequencing**: preserve the current Section 01 visual composition and move forward with recovering the remaining sections. This is **not a claim of defect-free QA or final production sign-off**.
- Defer minor visual refinements until after the full page recovery. Avoid repeated polish passes on Section 01 during recovery.
- Record separately for the later stabilization pass: mobile drawer closed-state overlay (functional blocker), left chapter navigation styling, mobile gutter discrepancy, and Anime.js CDN 404. Functional issues should not be represented as merely aesthetic or silently ignored before final release.
- Do not change Section 01 layout without a new approval. Next section can enter inspection/design proposal stage only; no unapproved implementation or deployment.


## Current handoff — Section 02 / The Research (2026-10-25)

**User authorization:** proceed to **inspection and design review** for Section 02 after provisional acceptance of Section 01. **Not** authorization to implement, deploy, or merge.

**Division of responsibility:** Claude Code is an evidence-only technical inspector. Claude Design is the design authority for any visual change; user approves before implementation. ChatGPT reviews technical evidence and design alignment.

**Inspection goals:** use real browser screenshots at desktop 1440px and mobile 390px/375px; confirm Section 02 heading, research copy, actual research figures, scaling and clipping, caption treatment, responsive gutters, overflow, and motion. Explain all broken assets/dependencies and distinguish findings originating from adjacent Section 03. Preserve project copy/images/12-chapter structure. Report under an uploaded GitHub Action artifact, and stop. Do not modify website source or present reference imagery as actual screenshot evidence.

**Deferred stabilization list:** Section 01 drawer overlay, chapter rail button styling, mobile gutter discrepancy, anime.js CDN 404; track rather than silently redesign.


## Recovery process correction — user direction, 2026-10-25

**Authority:** the user's explicit approvals control. Existing Section 02 side-by-side research Bento is **NOT APPROVED**. It is existing implementation evidence, not a sanctioned design or baseline. Do not treat it as implicitly approved.

### Mandatory gates for EACH section
1. **Inventory + technical inspection**: Claude Code records actual content, asset list, interaction/motion (including previously built tooltips), current implementation, prior versions, and deviations. No visual redesign.
2. **Interactive design playground**: design authority is Claude Design. Present real, identical section content and assets in 2–3 genuinely different compositions with responsive states and interactive motion/tooltip preview when relevant. Include a side-by-side comparison; references and mockups are labeled. No placeholder substitutions for actual section images.
3. **User feedback and explicit approval**: user selects or revises layout, media behavior, motion and content mapping. Do not infer approval from existing code, a successful workflow or passage of time.
4. **Implementation gate**: Claude Code implements ONLY approved artifact/spec, preserving named semantic component mappings and the existing design system. Any discrepancy is reported for approval, not improvised. No changes outside approved scope.
5. **Browser QA / user visual gate**: actual desktop/mobile screenshots, interactions, known defects and comparisons to approved artifact; user locks or requests revision, then move to next section.
6. **CMS integration AFTER full-page design recovery**: do not divert recovery effort into CMS migration now. Later evaluate Decap CMS vs WordPress and other options based on an exhaustive content field/component inventory, real editor preview and round-trip, and image editing without agent coding. Supabase not automatically required.

### Content + design system contract
- Enumerate every content element and its type: heading/section heading, paragraph, caption, tooltip trigger/body, image, alt text, figure, evidence diagram, component variant, external link, interaction, media layout, motion configuration.
- The taxonomy must map to semantic UI components; no giant undifferentiated HTML/markdown entry replacing structured content, and no silently flattened tooltip into paragraph.
- Retrieve existing tooltip implementation/motion reference and present it in the playground before any replacement/integration decision.
- Prevent token-heavy edit cycles by deferring CMS decisions until content architecture and all section visual structures are approved; the later CMS must support field edits, media replacement and preview.

**Historical note (superseded):** Section 02 was previously in inventory/design planning. The later user approval authorizes scoped implementation per `design-research/section02-review/IMPLEMENTATION-GATE.md`. Section 01 provisional acceptance is unchanged; protect all other approved work and no deployment.


## Clarification to Claude Design — explicit authorization

The earlier phrase `Visual lock: pending. Section 02 is NOT authorized yet` was **superseded** after the user viewed Section 01 QA screenshots and provisionally accepted Section 01 for recovery sequencing (recorded 2026-10-25). User subsequently explicitly instructed us to proceed with Section 02 design. **Do not demand another Section 01 visual lock before creating the Section 02 playground.** Final Section 01 stabilization and production sign-off remain pending, but they do not block the Section 02 *design* gate. At the time of this earlier design-stage note, implementation was not yet authorized. **SUPERSEDED by the later explicit user approval recorded under “User approval — Section 02 layout implementation (2026-10-26)” below.**


## User approval — Section 02 layout implementation (2026-10-26)

User said **“go ahead”** in response to the specific choice to approve Section 02 layout implementation with final images and copy remaining provisional. This explicitly authorizes only the **approved stacked editorial layout direction** described in the v3 playground and its independent QA report. It does NOT approve final media assets, the proposed new heading “What people reach for, and what they ignore.”, “Two lenses” label, Section 03, deployment, or CMS migration. Implementation must preserve existing content as the source of truth unless each new copy element is marked provisional. Fix lightbox accessibility and responsiveness during the scoped implementation, and submit actual screenshots/interaction evidence for user review. No automatic advance to Section 03.
