---
type: afk
brief: antigravity-codex-skill-parity
parent_prd: prd/antigravity-codex-skill-parity-prd.md
branch: feat/codex-skill-parity
parent_branch: main
---

# Issue 004: Phase 3 — Configure GitHub Operations Integration

## Parent PRD
`prd/antigravity-codex-skill-parity-prd.md` (§6 Phase 3)

## What to build
Configure GitHub operations through the GitHub CLI (`gh`) as the primary integration, with the GitHub MCP connector as an approved fallback. Record authentication health and required scopes, and establish PR lifecycle guidelines (zero orphan issues, auto-linking, verification).

## Acceptance criteria
- [x] Verify `gh` CLI status and token scopes (`repo`, `workflow`, etc.).
- [x] Define the integration selector rule: `gh` first, GitHub MCP as fallback.
- [x] Document PR lifecycle checks: discover open issues, include `Closes #<n>` / `Fixes #<n>`, confirm before creating PR, verify closure on merge.
- [x] Record status in `logs/codex-parity-install.log`.

## Blocked by
- Blocked by `issues/001-phase-0-preflight-and-backup.md`

## User stories addressed
- PRD §6 Phase 3 (Configure GitHub operations)
