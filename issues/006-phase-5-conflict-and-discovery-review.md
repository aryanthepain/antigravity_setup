---
type: afk
brief: antigravity-codex-skill-parity
parent_prd: prd/antigravity-codex-skill-parity-prd.md
branch: feat/codex-skill-parity
parent_branch: main
---

# Issue 006: Phase 5 — Conflict and Discovery Review

## Parent PRD
`prd/antigravity-codex-skill-parity-prd.md` (§6 Phase 5)

## What to build
Inspect all installed skills in `$CODEX_HOME/skills/` (both GSD and the 8 non-GSD ported skills). Validate YAML frontmatter, ensure valid trigger descriptions, verify no namespace collisions, and verify non-triggers ensure system skills (`documents`, `spreadsheets`, `presentations`, etc.) are never captured.

## Acceptance criteria
- [ ] Scan all `SKILL.md` files under `$CODEX_HOME/skills/` for frontmatter validity.
- [ ] Verify each skill has distinct trigger phrases and explicit negative triggers.
- [ ] Ensure system skills continue functioning without interception.
- [ ] Document audit output in `logs/codex-parity-install.log`.

## Blocked by
- Blocked by `issues/002-phase-1-install-gsd-codex.md`
- Blocked by `issues/005-phase-4-scaffold-port-required-skills.md`

## User stories addressed
- PRD §6 Phase 5 (Conflict and discovery review)
- PRD §7 Acceptance Criteria
