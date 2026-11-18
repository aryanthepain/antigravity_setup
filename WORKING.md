# Ephemeral Task Scratchpad

## Current Objective

- **Task**: Modernize `/pr-review` Skill with Concurrent Dual-Track Architecture (Background GitHub Terminal Task + Local Subagent Review) (Issue #17)
- **Status**: **100% DETERMINISTICALLY VERIFIED**
- **Target Branch**: `feat/pr-review-parallel-watcher`

## Context & User Decisions

1. **Concurrency Architecture**:
   - Instead of blocking on CI / CodeRabbit before reviewing, launch a background terminal task (Track A) to watch GitHub checks and CodeRabbit reviews.
   - Concurrently spin up a local subagent (Track B) to run adversarial diff review on the PR changes.
   - Both tracks converge in Phase 3 for a unified triage and surgical fix loop.
2. **Implementation Strategy**:
   - Support both pure inline `pwsh` command snippet in `SKILL.md` and a dedicated reusable script `scripts/watch-pr-checks.ps1`.
   - Hybrid subagent pattern: primary via zero-cost `subagent.js --task review --diff` (Groq/OpenRouter), with native `invoke_subagent` / `gsd-code-reviewer` documented as fallback.
   - Full convergence: allow both remote watcher and local subagent to complete before triaging all defects and comments together.

## Execution Checklist

- [x] Branch from `main` to `feat/pr-review-parallel-watcher`
- [x] Author `scripts/watch-pr-checks.ps1` (with timeout, CodeRabbit review detection, and status check polling)
- [x] Install `watch-pr-checks.ps1` to:
  - `d:\projects\antigravity_setup\scripts\watch-pr-checks.ps1`
  - `d:\projects\antigravity_setup\templates\watch-pr-checks.ps1`
  - `~/.gemini/config/scripts\watch-pr-checks.ps1`
  - `~/.gemini/config/skills/init-project/templates/watch-pr-checks.ps1`
- [x] Update `init-project.ps1` (repo & global) to include `watch-pr-checks.ps1` in template provisioning
- [x] Rewrite `~/.gemini/config/skills/pr-review/SKILL.md` to specify the concurrent dual-track review workflow
- [x] Scan for secrets exposure (`pwsh -File .\scripts\test-secrets-exposure.ps1`) -> 0 leaks
- [x] Deterministically verify all test gates (`verify.ps1`)
