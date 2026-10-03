---
type: afk
brief: antigravity-codex-skill-parity
parent_prd: prd/antigravity-codex-skill-parity-prd.md
branch: feat/codex-skill-parity
parent_branch: main
---

# Issue 002: Phase 1 — Install GSD for Codex

## Parent PRD
`prd/antigravity-codex-skill-parity-prd.md` (§6 Phase 1)

## What to build
Install the official/maintained Codex-compatible GSD distribution into `$CODEX_HOME/skills` (`C:\Users\Aryan Gupta\.codex\skills`), choosing the full profile (planning, execution, verification, review, branch, milestone, workstream, ship). Verify that all referenced workflow files exist under the installed Codex location without corrupting existing plugins or skills.

## Acceptance criteria
- [x] Inspect package/upstream options (`@opengsd/get-shit-done-redux` or verified repo).
- [x] Install the full GSD distribution into `C:\Users\Aryan Gupta\.codex\skills`.
- [x] Validate presence of GSD skills (`gsd-*/SKILL.md`) in Codex skills directory.
- [x] Confirm no mixing of obsolete paths; verify that frontmatter and commands are Codex-compatible.
- [x] Record exact version and installer invocation in `logs/codex-parity-install.log`.

## Blocked by
- Blocked by `issues/001-phase-0-preflight-and-backup.md`

## User stories addressed
- PRD §4 Install the complete GSD suite
- PRD §6 Phase 1 (Install GSD for Codex)
