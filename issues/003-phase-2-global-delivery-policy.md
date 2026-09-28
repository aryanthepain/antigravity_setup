---
type: afk
brief: antigravity-codex-skill-parity
parent_prd: prd/antigravity-codex-skill-parity-prd.md
branch: feat/codex-skill-parity
parent_branch: main
---

# Issue 003: Phase 2 — Configure Global Delivery Policy

## Parent PRD
`prd/antigravity-codex-skill-parity-prd.md` (§6 Phase 2, §4 Decision Inventory)

## What to build
Configure Codex global instructions with the mandatory delivery policies:
1. Mandatory questioning (Socratic grilling before code).
2. Forced branch protocol (inspect branch, create feature branch off main/master).
3. Automatic PR lifecycle (link issues, draft PR, confirm before push).
4. Automatic audio alerts (call repo `scripts/agent-alarm.ps1` with fallback).
5. Mandatory multi-agent delegation (Codex-native subagents for exploration/code/review).
6. Ponytail laziness ladder (YAGNI -> stdlib -> platform -> dependency -> one-liner -> minimal).
7. Karpathy disciplines (assumptions, simplest solution, surgical changes, deterministic checks).
8. Superpowers (inspect before acting, compose relevant skills, verification evidence).

## Acceptance criteria
- [ ] Determine Codex global instruction mechanism (e.g. `~/.codex/instructions.md`, global `AGENTS.md`, or `config.toml` user instructions).
- [ ] Install global policy verbatim in meaning with explicit exception guards.
- [ ] Integrate optional audio alert referencing `scripts/agent-alarm.ps1`.
- [ ] Map delegation to Codex-native multi-agent paradigms.

## Blocked by
- Blocked by `issues/001-phase-0-preflight-and-backup.md`

## User stories addressed
- PRD §4 Add as global mandatory policy
- PRD §6 Phase 2 (Configure global delivery policy)
