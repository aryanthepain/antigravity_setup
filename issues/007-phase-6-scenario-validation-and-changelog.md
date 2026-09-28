---
type: afk
brief: antigravity-codex-skill-parity
parent_prd: prd/antigravity-codex-skill-parity-prd.md
branch: feat/codex-skill-parity
parent_branch: main
---

# Issue 007: Phase 6 — Scenario Validation and Changelog

## Parent PRD
`prd/antigravity-codex-skill-parity-prd.md` (§6 Phase 6, §7 Acceptance Criteria, §9 Rollout and Rollback)

## What to build
Validate the 11 scenarios specified in PRD §6:
1. "Write a PRD..." triggers `write-a-prd`.
2. "Add detector using TDD..." triggers `tdd`.
3. "Review my diff before I commit..." triggers `code-review`.
4. "Audit this login endpoint for security..." triggers `security-review`.
5. "Make this dashboard accessible and less generic..." triggers `frontend-quality`.
6. "Record current blocker in WORKING.md..." triggers `working-context`.
7. "Implement the radar data adapter..." triggers clarification and feature branching.
8. Feature completion triggers issue-linked PR draft without unauthorized push.
9. Multi-file change triggers independent review delegation.
10. Verification triggers audio alarm or respects silent mode.
11. `$gsd-help` or GSD command resolves.

Generate a comprehensive CHANGELOG / implementation summary documenting source skill, Codex adaptation, version, validation date, and rollback procedure. Sound the completion audio alarm (`scripts/agent-alarm.ps1`).

## Acceptance criteria
- [ ] Run dry-run / scenario prompt validation against skill triggers.
- [ ] Write `CHANGELOG-codex-parity.md` documenting all installed skills and rollback steps.
- [ ] Sound spoken completion alert using `pwsh -File .\scripts\agent-alarm.ps1 -Type Success -Message "..."`.
- [ ] Commit all issue files and implementation artifacts to `feat/codex-skill-parity`.

## Blocked by
- Blocked by `issues/003-phase-2-global-delivery-policy.md`
- Blocked by `issues/004-phase-3-github-operations-integration.md`
- Blocked by `issues/006-phase-5-conflict-and-discovery-review.md`

## User stories addressed
- PRD §6 Phase 6 (Scenario validation)
- PRD §7 Acceptance Criteria
- PRD §9 Rollout and Rollback
