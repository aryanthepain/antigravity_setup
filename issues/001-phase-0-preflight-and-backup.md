---
type: afk
brief: antigravity-codex-skill-parity
parent_prd: prd/antigravity-codex-skill-parity-prd.md
branch: feat/codex-skill-parity
parent_branch: main
---

# Issue 001: Phase 0 — Preflight and Backup

## Parent PRD
`prd/antigravity-codex-skill-parity-prd.md` (§6 Phase 0)

## What to build
Perform preflight verification of the Codex environment, tools (`node`, `npm`, `gh`, `codex-cli`), and create a full backup of the user-level Codex configuration (`$CODEX_HOME`/`~/.codex/config.toml` and existing skills) to a safe, timestamped backup directory. Initialize the installation log.

## Acceptance criteria
- [x] Inspect and record Node.js version (>= 18), npm version, `gh` version, and `codex-cli` version.
- [x] Verify `$CODEX_HOME` location (`C:\Users\Aryan Gupta\.codex`).
- [x] Create a backup of `config.toml` and current skills inventory to `backups/codex-preflight-<timestamp>/`.
- [x] Create timestamped log file `logs/codex-parity-install.log`.
- [x] Ensure no existing user skills or plugins are broken or overwritten.

## Blocked by
None — can start immediately.

## User stories addressed
- PRD §6 Phase 0 (Preflight and backup)
- PRD §7 Acceptance Criteria
