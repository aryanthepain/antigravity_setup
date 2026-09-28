# Changelog: Antigravity-to-Codex Skill Parity

**Release Date:** 2026-09-28  
**Codex Target Path:** `C:\Users\Aryan Gupta\.codex` (`$CODEX_HOME`)  
**Codex CLI Version:** `0.154.0-alpha.6.2`  
**GSD Core Upstream:** `@opengsd/gsd-core@1.15.0` (Full Profile)

---

## 1. Summary of Delivered Parity

This deployment introduces complete Antigravity delivery disciplines and skill parity into the user-level Codex environment without breaking existing plugins or violating Codex sandbox policies.

### Total Installed Inventory: 80 Skills (72 GSD + 8 Curated Portable Skills)
- **72 GSD Core Skills**: Full meta-prompting and SDD lifecycle (planning, execution, review, verification, workstreams, milestones, shipping).
- **8 Curated Non-GSD Skills**:
  1. `write-a-prd`: Self-contained markdown PRD generator with user-configurable path (`prd/<slug>.md`).
  2. `write-a-brief`: Plain-spoken scoping memo authoring (~150-400 words) without proprietary frontmatter locks.
  3. `tdd`: Red-green-refactor guidance with vertical tracer bullets and public interface assertions.
  4. `code-review`: Diff-scoped, evidence-based code reviews ordered by severity (Blocker/Major/Minor).
  5. `security-review`: Static threat modeling and vulnerability checklist (OWASP, injection, auth, least privilege) with explicit authorization gate.
  6. `working-context`: Lightweight active sprint state scratchpad in `WORKING.md` preserving user history.
  7. `architecture-review`: Evidence-based modular boundary and deep-module refactoring audit.
  8. `frontend-quality`: Accessible primitives (Radix/shadcn), motion physics, visual hierarchy, and anti-generic aesthetic enforcement.

---

## 2. Global Delivery Policy Installed

Installed to:
- `C:\Users\Aryan Gupta\.codex\AGENTS.md`
- `C:\Users\Aryan Gupta\.codex\instructions.md`

### Invariants Enforced:
1. **Precedence**: System/user instructions and repository protections strictly take precedence.
2. **Mandatory Questioning Protocol**: Socratic grilling before code implementation on non-trivial tasks.
3. **Forced Feature Branching Protocol**: Inspect branch; if on `main`/`master`, create a dedicated feature branch.
4. **Automatic PR Lifecycle & Zero Orphan Issues**: Inspect open issues (`gh issue list`), auto-link `Closes #<n>`, confirm before remote creation.
5. **Automatic Audio Alerts**: Invokes `.\scripts\agent-alarm.ps1 -Type Success|Failure|Warning` on milestone/checkpoints (with silent mode suppression).
6. **Mandatory Multi-Agent Delegation**: Isolated delegation to Codex-native subagents for exploration, coding, and adversarial diff review.
7. **Ponytail Laziness Ladder**: 6-level anti-bloat gate (YAGNI → stdlib → platform → dependency → one-liner → minimal code).
8. **Karpathy Grounding Disciplines**: Assumptions, simplest solutions, surgical edits, and deterministic verification.
9. **Superpowers Quality Invariants**: Inspect first, compose relevant skills, preserve verification evidence.

---

## 3. GitHub Operations Integration Decision

- **Primary Integration**: GitHub CLI (`gh` v2.100.0) — verified active authentication (`aryanthepain`), https protocol, valid token scopes (`repo`, `workflow`, `user`).
- **Approved Fallback**: GitHub MCP Server connector (lazily loaded when `gh` CLI is absent or requires browser-scoped authorization).
- **Selector Policy**: `gh` CLI first; GitHub MCP fallback; never perform duplicate mutations across both.

---

## 4. Verification & Validation Evidence

All 11 scenarios from PRD §6 executed deterministically via `scripts/test-codex-scenarios.ps1`:
- Scenario 1: `write-a-prd` trigger & structure -> **PASS**
- Scenario 2: `tdd` red-green-refactor trigger -> **PASS**
- Scenario 3: `code-review` diff-scope read-only -> **PASS**
- Scenario 4: `security-review` static audit & approval gate -> **PASS**
- Scenario 5: `frontend-quality` primitives & anti-generic -> **PASS**
- Scenario 6: `working-context` preservation -> **PASS**
- Scenario 7: Policy: mandatory questioning & branch enforcement -> **PASS**
- Scenario 8: Policy: issue-linked PR draft & zero orphan issues -> **PASS**
- Scenario 9: Policy: multi-agent delegation -> **PASS**
- Scenario 10: Policy: audio alarm & silent mode suppression -> **PASS**
- Scenario 11: `gsd-help` discovery & workflow resolution -> **PASS**

All 86 installed `SKILL.md` files verified for frontmatter validity, name uniqueness, and zero collisions with Codex system plugins (`documents`, `spreadsheets`, `presentations`, etc.).

---

## 5. Rollback Procedure

Preflight backup is preserved at:
`D:\projects\antigravity_setup\backups\codex-preflight-20260928_205438\`

To revert Codex configuration to pre-installation state:
```powershell
# 1. Restore config.toml
Copy-Item "D:\projects\antigravity_setup\backups\codex-preflight-20260928_205438\config.toml" "C:\Users\Aryan Gupta\.codex\config.toml" -Force

# 2. Restore skills directory
Remove-Item "C:\Users\Aryan Gupta\.codex\skills" -Recurse -Force
Copy-Item "D:\projects\antigravity_setup\backups\codex-preflight-20260928_205438\skills" "C:\Users\Aryan Gupta\.codex\skills" -Recurse -Force

# 3. Remove global policy files
Remove-Item "C:\Users\Aryan Gupta\.codex\AGENTS.md" -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Users\Aryan Gupta\.codex\instructions.md" -Force -ErrorAction SilentlyContinue

# 4. Remove GSD core assets
Remove-Item "C:\Users\Aryan Gupta\.codex\gsd-core" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Users\Aryan Gupta\.codex\gsd-file-manifest.json" -Force -ErrorAction SilentlyContinue
```
No repository code or project configurations are modified during rollback.
