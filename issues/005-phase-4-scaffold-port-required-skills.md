---
type: afk
brief: antigravity-codex-skill-parity
parent_prd: prd/antigravity-codex-skill-parity-prd.md
branch: feat/codex-skill-parity
parent_branch: main
---

# Issue 005: Phase 4 — Scaffold and Port Required Non-GSD Skills

## Parent PRD
`prd/antigravity-codex-skill-parity-prd.md` (§4 Decision Inventory, §6 Phase 4)

## What to build
Port the 8 required portable Antigravity skills into `$CODEX_HOME/skills/`:
1. `write-a-prd`: Adapt to create self-contained PRD markdown at user-selected or repository default path.
2. `write-a-brief`: Adapt to create concise briefs without proprietary frontmatter enforcement.
3. `tdd`: Adapt to red-green-refactor loop with repo-specific test runner.
4. `code-review`: Consolidate `code-review`, `pr-review`, and `critique` into diff-scoped review with local tools.
5. `security-review`: Adapted threat-model and security checklist, requiring explicit authorization before active testing.
6. `working-context`: Maintain concise `WORKING.md` sprint state.
7. `architecture-review`: Evidence-based architecture findings and refactoring proposals.
8. `frontend-quality`: Consolidated accessible primitives, responsive quality, visual hierarchy, anti-generic design guidance.

All skills must be self-contained: no `~/.gemini` paths, no Antigravity CLI commands, clean frontmatter, and standard triggers/non-triggers.

## Acceptance criteria
- [ ] Create 8 directories under `$CODEX_HOME/skills/`.
- [ ] Author adapted, self-contained `SKILL.md` in each directory.
- [ ] Verify zero references to `~/.gemini`, `agy`, or Antigravity-internal hooks.
- [ ] Include clear trigger formulas and non-triggers.

## Blocked by
- Blocked by `issues/001-phase-0-preflight-and-backup.md`

## User stories addressed
- PRD §4 Required portable skills
- PRD §6 Phase 4 (Scaffold and port required non-GSD skills)
