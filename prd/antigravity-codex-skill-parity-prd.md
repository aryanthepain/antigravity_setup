# PRD: Curated Antigravity Skill Parity for Codex

**Status:** Proposed  
**Owner:** Antigravity configuration maintainer  
**Target:** User-level Codex skills directory (`$CODEX_HOME/skills`)  
**Scope:** Install Codex-compatible GSD, port selected Antigravity skills, and configure the approved global delivery policies.

## 1. Summary

Antigravity currently exposes 113 skills. The required target is a Codex environment with the same delivery discipline: GSD project workflows, mandatory clarification, branch/PR lifecycle, audio completion notifications, multi-agent delegation, and the Ponytail, Karpathy, and Superpowers practices. This PRD specifies how to introduce those behaviours safely and in a Codex-compatible form.

Install official Codex-compatible GSD from its maintained repository, add a concise global-policy layer, and port only the remaining portable skills that GSD does not provide. The result must use Codex-native tools and preserve Codex safety and approval behaviour.

## 2. Goals

- Provide portable, discoverable skills for PRDs, briefs, TDD, code review, security review, architecture review, frontend quality, screenshot-to-code, and project scratchpad management.
- Preserve the useful Antigravity practices: focused changes, deterministic verification, accessibility, and an explicit completion record.
- Make the requested policies mandatory at the Codex global level, while keeping a narrowly defined fast path for trivial non-code tasks.
- Install the full GSD Codex distribution, then validate its skills, workflow references, agent roles, and state directories.
- Configure GitHub operations through the GitHub CLI as the primary integration, with the GitHub MCP connector as an approved fallback.

## 3. Non-goals

- Reproducing Antigravity's UI or IDE-specific hooks.
- Copying provider-specific/cloud skills unless the user later puts that provider in scope.
- Bypassing Codex sandbox approvals, GitHub authentication, branch protections, repository contribution policies, or user-requested silent mode.

## 4. Decision Inventory

### Add now: required portable skills

| Codex skill | Antigravity source | Capability and adaptation |
| --- | --- | --- |
| `write-a-prd` | `write-a-prd` | Create a self-contained Markdown PRD. Remove the mandatory `briefs/` pipeline and branch operations; support a user-selected output path. |
| `write-a-brief` | `write-a-brief` | Write concise project/phase briefs without enforcing the Antigravity frontmatter lifecycle. |
| `tdd` | `tdd` | Red-green-refactor guidance with public-interface tests and repository-specific test commands. |
| `code-review` | `code-review`, `pr-review`, `critique` | Diff-scope review, deterministic checks, regressions, and actionable findings. Use local tooling; do not require AST tooling that is not installed. |
| `security-review` | `security-sandbox-review` | Threat-model and code review checklist. Require explicit user authorization before active testing; never assume a Strix agent, container, or production access. |
| `working-context` | `working-context` | Maintain concise `WORKING.md` sprint state. Respect existing project conventions and do not overwrite user history. |
| `architecture-review` | `improve-codebase-architecture`, `tdd/deep-modules.md` | Produce evidence-based architecture findings and incremental refactor proposals, without automatically opening issues. |
| `frontend-quality` | `frontend-design`, `taste-skill`, `web-design-guidelines` | One consolidated skill for accessible primitives, responsive quality, visual hierarchy, anti-generic design guidance, and UI review. |

### Add only when the capability is requested

| Codex skill | Antigravity source | Installation guard |
| --- | --- | --- |
| `image-to-code` | `image-2-code` | Add when the user regularly builds UIs from screenshots. It must use Codex image inspection and native frontend tools. |
| `browser-ui-verification` | `playwright-cli` | Add only after the project has Playwright available. It must verify a local/staging target explicitly supplied by the user and never install browsers automatically. |
| `kaggle-gpu-runbook` | `kaggle-gpu-fallback` | Add only for projects that intentionally use Kaggle/Colab. Remove tunnel-hosting defaults, require credential/terms acknowledgement, and enforce the project telemetry standard. |

### Add as global mandatory policy (Codex-adapted)

Add a dedicated, user-level policy document or the equivalent supported Codex global-instructions setting. It must be concise, ordered below platform/developer/user instructions, and contain the following rules.

| Policy | Required Codex behaviour | Explicit exception/guard |
| --- | --- | --- |
| Mandatory questioning | Before an implementation, ask targeted questions until scope, acceptance criteria, constraints, and test expectations are clear. | Do not block a safe, unambiguous micro-edit, inspection-only task, or urgent user instruction that supplies sufficient requirements. |
| Forced branches | Before changing tracked project files for a feature/fix/phase, inspect the branch; if on `main`/`master`, create a descriptive feature branch. | Never create a branch for read-only work, a user-directed change on the default branch, or when repository policy prohibits it. |
| Automatic PR lifecycle | After implementation and verification, inspect related issues, generate an issue-linked PR draft/body, and offer/create the PR when GitHub auth and repository permissions are valid. | Never push/create a PR without user authorization or an explicit project rule that grants it; report a blocked auth state instead. |
| Automatic audio alerts | At completion, verification failure, and an approval checkpoint, run the repository `scripts/agent-alarm.ps1` when it exists; otherwise use the configured portable alarm skill. | Respect a user `silent` instruction, missing script, unsupported OS, or sandbox restriction. Audio failure must not fail delivery. |
| Mandatory multi-agent delegation | Delegate bounded, independent research, implementation, or adversarial review work to Codex-native agents; merge only concise outputs. | Do not delegate trivial work, tasks that cannot be decomposed safely, or work involving secrets/unapproved external actions. Use at most the platform's available concurrency. |
| Ponytail | Apply the YAGNI → standard library → platform → existing dependency → one-liner → minimal-code ladder before adding code/dependencies. | Explain a justified exception in the implementation note. |
| Karpathy skills | State assumptions, choose the simplest solution, make surgical changes, and run deterministic checks tied to the request. | Do not manufacture tests for prose-only tasks. |
| Superpowers | Inspect before acting, compose only relevant skills, preserve observable verification evidence, and perform an independent review for material changes. | Avoid workflow overhead for one-file/under-ten-line micro-edits. |

The policy must explicitly state that Codex system/developer/user instructions, sandbox approvals, repository policy, and branch protections win on conflict.

### Install the complete GSD suite

Install the maintained Codex-compatible GSD distribution, rather than copying the 74 Antigravity `gsd-*` skill folders. The selected upstream must support Codex skills under `~/.codex/skills/<skill>/SKILL.md`; `gsd-open/get-shit-done-redux` documents this layout and a Codex installer. Pin the package/repository release after verifying the release tag, repository ownership, and package provenance.

Full GSD is required, including planning, execution, verification, review, branch, milestone, workstream, and ship skills. Do not mix files from the old `~/.gemini/antigravity/gsd-core` tree with the Codex distribution.

### Keep excluded unless later requested

Do not port `google-stitch`, `google-jules`, `google-cloud-*`, `bigtable-basics`, `notion-sync`, `permissioned-github`, `create-shortlink`, `openhands-harness`, `opencode-runner`, `aider-pair`, `omniroute-config`, or `kaggle-gpu-fallback`. They need separate provider, credential, or risk decisions.

## 5. Functional Requirements

1. Each required skill is a directory under `$CODEX_HOME/skills/<skill-name>/` containing `SKILL.md` with valid frontmatter.
2. Descriptions use the Codex discovery format: what it does, positive trigger phrases, and explicit non-triggers.
3. Ported non-GSD skills must be self-contained: no `~/.gemini`, Antigravity command, IDE hook, unavailable MCP server, or provider-specific path reference. GSD may use only paths installed by its Codex package.
4. Skills must defer to repository `AGENTS.md`, existing developer instructions, and user authorization.
5. Global policy must implement the requested questioning, branching, PR, alarm, multi-agent, Ponytail, Karpathy, and Superpowers rules with the exceptions in the policy table.
6. Write-oriented skills must ask for an output path only when one cannot be safely inferred; otherwise use the repository's existing documentation convention.
7. Review skills return findings ordered by severity, with file/line evidence when available, then a concise verification summary.
8. Verification guidance must select the narrowest relevant deterministic command and report pass/fail honestly.
9. GitHub integration must use `gh` when it is installed and authenticated. If it is unavailable, invalid, or lacks required scopes, suggest the GitHub MCP connector; do not fall back to unauthenticated API calls.
10. The implementation record must include the GSD source repository, immutable release/version, installer command, installed skill count, GitHub integration decision, and rollback command.

## 6. Implementation Plan

### Phase 0 — Preflight and backup

1. Inspect the Codex version, Node/npm version, `gh --version`, and `gh auth status` without printing tokens.
2. Export/copy the existing user-level Codex configuration and list the current `$CODEX_HOME/skills` directories. Do not overwrite existing non-GSD skills.
3. Confirm Codex meets GSD's documented minimum version and that Node/npm can run the selected package.
4. Create a timestamped installation log outside the repository or in an ignored workspace-local log directory.
5. If GSD has already been installed, compare its version/layout with the selected release and use its documented upgrade path instead of layering a second copy.

### Phase 1 — Install GSD for Codex

1. Obtain the current release notes and installer help from the selected official GSD package.
2. Verify that the package name, repository URL, and release tag resolve to the same maintained upstream. Record the exact immutable version in the installation log.
3. Run GSD's Codex global installer using its documented non-interactive equivalent of `npx @opengsd/get-shit-done-redux@<verified-version> --codex --global`. If the release does not expose `--codex`, use the installer prompt and select **Codex** and **global**; do not guess unsupported flags.
4. Choose the **full** profile, not the core/minimal profile, so GSD planning, workstream, review, verification, and shipping skills are installed.
5. Restart Codex and inventory `$CODEX_HOME/skills/gsd-*/SKILL.md`. Validate all referenced workflow files exist under the installed Codex/GSD location.
6. Run GSD's documented help command and one read-only workflow (for example codebase mapping) in a disposable repository. Do not run project initialization or modification workflows as the installation test.

### Phase 2 — Configure global delivery policy

1. Locate Codex's supported user-level instruction mechanism. Do not invent a configuration key; use the documented Codex setting or a supported globally discovered `AGENTS.md`/instruction file.
2. Install the global-policy text from the decision table verbatim in meaning, including its exception and precedence clauses.
3. Configure the alert command as an optional callable integration: prefer `<repo>/scripts/agent-alarm.ps1`; if absent, emit a text completion summary and record the absence. Never install a system-wide TTS dependency without permission.
4. Map multi-agent rules to Codex-native delegation only. Do not install Antigravity's `subagent.js`, use its context quota, or reproduce its IDE hooks.
5. Restart Codex and validate policy discovery with a dry-run planning prompt.

### Phase 3 — Configure GitHub operations

1. Use the GitHub CLI as the primary path. Verify authentication with `gh auth status` and required token scopes with a non-mutating repository/issue query.
2. If authentication is invalid, expired, or scopes are insufficient, run `gh auth login` only after the user approves the interactive authentication flow. Required permissions must be the minimum needed for repository, issue, pull-request, and workflow operations.
3. If the CLI is unsuitable or authentication is intentionally browser/account-scoped, request installation/connection of the official GitHub MCP connector. Inspect its permissions before enabling it; grant only repository and pull-request scopes required for the target repositories.
4. Define a single integration selector: use `gh` first; use GitHub MCP only when `gh` is unavailable/unhealthy or the MCP exposes a capability not available via `gh`; never perform the same mutation through both.
5. Implement PR lifecycle checks: inspect open issues before PR generation, include `Closes #<n>`/`Fixes #<n>` only for verified related issues, create a PR only after explicit authorization, and verify closure after merge.

### Phase 4 — Scaffold and port required non-GSD skills

Create the eight required directories and author adapted `SKILL.md` files. Extract only the portable principles from the source skills; do not copy operational commands verbatim. Use `skill-creator` conventions to validate frontmatter and trigger quality.

### Phase 5 — Conflict and discovery review

For each new skill, test representative prompts against the installed Codex skill list. Confirm it activates for its intended request and does not capture document, presentation, spreadsheet, image-generation, plugin-management, or native collaboration requests.

### Phase 6 — Scenario validation

Validate the following:

1. “Write a PRD for a radar data adapter” invokes `write-a-prd` and produces a structured local Markdown proposal.
2. “Add the detector using TDD” invokes `tdd` and selects the repository's unit-test command.
3. “Review my diff before I commit” invokes `code-review` and does not edit files.
4. “Audit this login endpoint for security” invokes `security-review`, distinguishes review from active testing, and requests approval before any invasive action.
5. “Make this dashboard accessible and less generic” invokes `frontend-quality`.
6. “Record the current blocker in WORKING.md” invokes `working-context` and preserves existing content.
7. “Implement the radar data adapter” triggers clarification and a non-default feature branch before code changes.
8. A completed verified feature produces an issue-linked PR draft through the selected GitHub integration, but does not create/push it without authorization.
9. A multi-file change uses an independent Codex review delegation and returns a concise result.
10. A verification pass invokes the repository alarm when present, and a silent-mode request suppresses it.
11. `$gsd-help` (or the GSD release's documented Codex help trigger) resolves after restart.

### Phase 7 — Opt-in skills

Do not install optional skills until their dependency gate has been met. Re-run the same discovery review when each is enabled.

## 7. Acceptance Criteria

- GSD full profile is installed from a recorded, verified upstream release and is discoverable after a Codex restart.
- The eight non-GSD required skills are installed, discoverable, and self-contained.
- No ported skill contains a `~/.gemini` reference, hard-coded provider credential, or inaccessible runtime dependency.
- The mandatory global delivery policy is active and passes scenarios 7–10 without bypassing Codex safety or user authority.
- GitHub CLI health and scopes are recorded, or the approved GitHub MCP fallback is connected with reviewed minimum permissions.
- All eleven scenario validations pass without incorrect skill capture.
- Existing Codex system skills continue to handle documents, spreadsheets, slides, plugins, images, and native collaboration.
- A short changelog records source skill, Codex adaptation, version, and validation date for every installed skill.

## 8. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Duplicate skills trigger for one request | Consolidate related frontend and review capabilities; include precise non-triggers. |
| GSD installer or repository is spoofed/outdated | Pin a verified release, compare package/repository provenance, and run installer help before installation. |
| Global automation exceeds user authority | Automatic planning, branch preparation, PR drafting, and alarms follow the policy; pushes, PR creation, authentication, and permission changes still require explicit authorization. |
| `gh` authentication or scopes fail | Use the interactive `gh auth login` process only with approval; otherwise request the GitHub MCP connector with minimum reviewed permissions. |
| Multi-agent policy increases noise/cost | Require bounded independent subtasks and retain the trivial-task exception; cap concurrency to the platform allocation. |
| GSD conflicts with native Codex skills | Run discovery tests, keep one integration selector, and remove only the conflicting GSD directories if a conflict cannot be resolved. |

## 9. Rollout and Rollback

Perform the preflight backup, install GSD and the required skills into the user-level Codex skills directory, add global policy only through a documented Codex mechanism, then validate in a new Codex session. If GSD causes misrouting or conflicts, use its documented uninstall procedure or remove only the recorded GSD-installed directories, restore the backed-up Codex configuration, restart Codex, and record the incident. Do not alter repository code or project configuration as part of rollback.
