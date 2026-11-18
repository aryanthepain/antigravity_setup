# Ephemeral Task Scratchpad

## Current Objective
- **Task**: Purge Legacy Task, Issue, and PRD Artifacts and Skills in Favor of Native GSD Workflows (Issue #14)
- **Status**: **100% COMPLETE & DETERMINISTICALLY VERIFIED**
- **Target Branch**: `refactor/issue-14-purge-legacy-task-prd`

## Summary of Changes
1. **GitHub Issue Linkage**:
   - Created GitHub Issue #14: `refactor(core): purge legacy task, issue, and PRD artifacts in favor of native GSD workflows`.
2. **Context Window Optimization & Skill Archival**:
   - Archived 7 legacy skills from `~/.gemini/config/skills/` to `~/.gemini/config/skills-vault/legacy-task-prd/`:
     - `write-a-prd`
     - `write-a-brief`
     - `prd-to-issues`
     - `critique`
     - `create-task`
     - `planner-tasks`
     - `_shared`
   - Archived legacy codex skills (`write-a-prd`, `write-a-brief`) from `~/.codex/skills/`.
   - Streamlined `grill-me` (removed legacy "Brief mode" that assumed `briefs/` and `_shared/workflow.md`), `commit-and-push` (aligned with feature/phase branches), and `working-context`.
3. **Repository Artifact Deletion**:
   - Removed legacy `issues/` directory (7 pre-GSD issue notes).
   - Removed legacy `prd/` directory (2 pre-GSD PRDs).
   - Removed legacy `tasks/` directory.
   - Removed `scripts/Reconcile-IssueNumbers.ps1` and `scripts/reconcile-issue-numbers.sh`.
4. **Scaffolding & Templates Refactoring**:
   - Modernized `templates/claude_orchestrator_prompt.md` and `templates/master_workflow_prompt.md` to reference native GSD slash commands (`/gsd-spec-phase`, `/gsd-plan-phase`, `/gsd-execute-phase`, `/gsd-code-review`, `/gsd-ship`).
   - Synced modernized templates into `~/.gemini/config/skills/init-project/templates/`.
   - Updated `templates/WORKING.md` branch patterns to `feat/...` and `gsd/...`.
   - Updated `workflows/end_to_end_workflow.md` to remove legacy brief/issue reconciler references.
5. **Documentation & Scenario Verification**:
   - Updated `docs/src/data/skillsData.ts`, `docs/src/data/situationsData.ts`, and `scripts/build_app_js.js`.
   - Rebuilt `docs/app.js` and production Vite bundle.
   - Updated `scripts/verify-codex-skills.ps1` and `scripts/test-codex-scenarios.ps1`.

## Deterministic Verification Results
- `pwsh -File .\scripts\test-secrets-exposure.ps1` -> **PASSED (0 leaks across 75 tracked files)**
- `pwsh -File .\tests\test-workspace-skills.ps1` -> **6/6 PASSED**
- `pwsh -File .\tests\test-canva-mcp.ps1` -> **6/6 PASSED**
- `pwsh -File .\scripts\verify.ps1` -> **ALL DETERMINISTIC GATES GREEN (Exit code 0)**
