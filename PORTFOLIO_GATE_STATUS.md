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

## Current status: R2-D / Section 01: The Context

- Layout Option C, marginal label stack: **approved for implementation**.
- Claude reported implementation in commit `ec1294a` on recovery branch.
- User has submitted desktop screenshots showing the layout and neighboring sections.
- **Visual lock: pending**. Section 02 is NOT authorized yet.

### Outstanding checks

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
| Section 01 layout Option C | Approved for implementation; visual QA pending |
| Section 02 layout | Not approved |
| Production deployment / merge to main | Not approved |

## Next Claude task (limited)

Perform **only Section 01 visual QA**: review actual desktop/mobile output, diagnose navigation dots, and report whether Option C matches approved composition. Do not redesign or advance to Section 02 until user explicitly locks Section 01.

## Handoff protocol

1. Claude fetches Git and reads this file at session start.
2. Claude works only within the approved gate, then commits an evidence report and stops.
3. ChatGPT reviews the GitHub report directly when user asks for review.
4. User approves, requests revisions, or rejects the gate.
5. Approval must be recorded in this file before Claude begins the next gate. If ChatGPT cannot write to GitHub, Claude must record the user-confirmed approval after receiving it.

---

## Agent handoff queue (ChatGPT authored, 2026-10-25)

**Queue item:** `CENTRONIC-R2D-QA-001`  
**Status:** READY FOR RUNNER SETUP; NOT EXECUTING  
**Gate:** R2-D Section 01 visual QA only  
**Approval:** User approved establishing automation infrastructure, **not** broad redesign, production deployment, or bypassing section gates.

### Task for Claude Code when the runner is configured

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
