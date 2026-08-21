# Product Requirements Document (PRD)
# 🌌 Antigravity Zero-Budget Autonomous Engineering System (2026)

## Assumptions

- The primary runtime environment is Windows with PowerShell 7 (`pwsh`), Git, Node.js (`npx`), and Python 3.10+ available locally.
- Google Antigravity IDE is the primary visual and orchestrating control surface, with access to Antigravity internal subagent spawning and MCP servers.
- Free-tier model quotas (Google Gemini via AI Studio, Groq, Mistral, OpenRouter, and optional local Ollama) will be accessed through an abstract model routing layer without hardcoding vendor dependencies into task prompts.
- Notion is the primary task and project management repository, replacing legacy Microsoft Planner.
- All core agent skills, rules, and MCP configurations must be installed globally in `~/.gemini/config/` (`C:\Users\Aryan Gupta\.gemini\config\`) so they are discoverable across all repositories and workspaces.
- Git worktree physical directory isolation (`brief/<slug>`) is supported and used for non-trivial tasks to avoid dirty-tree conflicts and race conditions.

---

## Problem Statement

As a software engineer building complex systems on a strict zero-budget constraint, relying on unconstrained LLMs or naive multi-agent swarms causes rapid token exhaustion, rate-limit stalls, excessive code bloat, hallucinated wrapper abstractions, and out-of-sync task tracking. Traditional agent workflows either dump full codebases into expensive monolithic prompts or generate dozens of speculative files that fail basic compilation. Furthermore, switching between different model providers or integrating task boards, security scans, and test verification requires fragmented manual effort.

---

## Solution

A cohesive, zero-budget autonomous engineering system built around Google Antigravity that unifies:
1. **Affirm Single-Task Delivery Contract**: Bounded unit of work (`1 task -> 1 agent session -> 1 PR`) with human checkpoints for plan approval and diff merge.
2. **Karpathy & Ponytail Guardrails**: Strict behavioral invariants that force models to think before coding, climb the 6-level YAGNI laziness ladder, and make surgical diffs.
3. **Cline Plan/Act Split & Task Sizing**: Sizing into Small ($S$), Medium ($M$), and Large ($L$) tasks, enforcing zero code edits during Plan Mode.
4. **Abstract Model-Routing Layer**: Decoupled `Task -> MODEL CLASS -> Provider/Model` tiering mapping architecture, coding, testing, review, and security to the optimal free/local model (with optional Ollama fallback).
5. **Fleet Verification Loop**: A bounded 4-stage deterministic test-fix ladder (Static/Types → Targeted Tests → Full Suite → AST Diff) with a hard 3-retry circuit breaker.
6. **Isolated Sandbox Security Review**: Dedicated Strix AI attack agent integration for automated vulnerability proof-of-concept verification.
7. **Notion Kanban Integration**: DayPilot workflow ported to Notion databases via Notion MCP and batch sync scripts.
8. **Universal Project Initializer (`init-project`)**: One-command scaffolding for bootstrapping any new repository with rules, templates, and git hooks.
9. **Searchable Visual Documentation Hub**: Interactive, responsive documentation web app hosted on GitHub Pages.

---

## User Stories

1. As an engineer, I want the agent to default to a single-agent session for standard coding tasks, so that I don't waste API tokens and coordination overhead on unnecessary subagents.
2. As an engineer, I want large architectural tasks to be sized as 'L' and require an explicit implementation plan and human approval before any code is modified, so that I maintain full control over system architecture.
3. As an engineer, I want small fixes (<20 lines) to execute directly in Act Mode without blocking on lengthy planning documents, so that minor tasks complete with maximum velocity.
4. As an engineer, I want all agent coding actions to be constrained by the Ponytail Laziness Ladder, so that the agent prioritizes native standard library features and existing packages over adding new dependencies.
5. As an engineer, I want the agent to adhere to Karpathy surgical editing rules, so that it never reformats adjacent code or deletes unrelated comments.
6. As an engineer, I want model selection to be routed by abstract capability class (e.g. `architecture`, `tests`, `review`) rather than hardcoded model names, so that my workflow survives provider outages and quota adjustments.
7. As an engineer, I want an optional local Ollama fallback configuration for code generation and refactoring, so that I can continue working even when internet access or cloud quotas are unavailable.
8. As an engineer, I want test verification to be executed by local deterministic tools (`verify.ps1`, `pytest`, `tsc`, `mypy`) rather than asking the LLM "does this look right?", so that verification consumes zero model tokens.
9. As an engineer, I want the Fleet Loop to stop and escalate after 3 failed test-fix attempts, so that the agent never burns my free quota in an infinite retry loop.
10. As an engineer, I want security-sensitive code changes (auth, tokens, API routes, database operations) to undergo an isolated sandbox audit with Strix AI, so that potential vulnerabilities are validated with reproducible Proof-of-Concepts before merging.
11. As an engineer, I want my active tasks, statuses, and PR links to sync bidirectionally with my Notion Task Board Kanban via Notion MCP and sync scripts, so that my project board is always up to date.
12. As an engineer, I want a single command (`init-project`) to scaffold new repositories with standard `AGENTS.md`, `CONSTITUTION.md`, `WORKING.md`, git hooks, and verification scripts, so that new projects start with complete guardrails immediately.
13. As an engineer, I want all core skills, rules, and MCP configurations installed globally in `~/.gemini/config/`, so that they automatically apply across all current and future projects.
14. As an engineer, I want a complete, interactive, searchable documentation web application hosted on GitHub Pages, so that I can easily navigate, visualize, and share the system architecture and operating guides.

---

## Implementation Decisions

### 1. Global Skills & Rules Architecture
All reusable skills and behavioral rules will be installed globally in `C:\Users\Aryan Gupta\.gemini\config\`:
- `rules/global_rules.md`: Always-on invariants covering Affirm single-task contract, single-agent default, Ponytail ladder, Karpathy surgical edits, and Fleet loop bounds.
- `skills/ponytail/SKILL.md`: The 6-level YAGNI laziness ladder skill.
- `skills/fleet-loop/SKILL.md`: 4-stage verification ladder with 3-round retry circuit breaker.
- `skills/security-sandbox-review/SKILL.md`: Strix AI attack simulation in isolated git worktrees.
- `skills/notion-sync/SKILL.md`: Notion MCP and API bidirectional task sync.
- `skills/init-project/SKILL.md`: Scaffolder for new repositories.
- `skills/grill-me/SKILL.md` & `skills/write-a-prd/SKILL.md`: Socratic specification workflow.

### 2. Abstract Model Routing Engine
- Global configuration file: `C:\Users\Aryan Gupta\.gemini\config\model_router.yaml`
- Maps abstract capability tiers:
  - `architecture`: `high_reasoning` → Gemini 2.5 Pro / DeepSeek R1 / OpenRouter free
  - `unfamiliar_repo`: `high_reasoning_and_context` → Gemini 2.5 Flash (1M+ context)
  - `normal_implementation`: `coding_and_tools` → Gemini Flash / Mistral Codestral / Groq Llama 3.3 70B
  - `small_fix`: `low_reasoning_cheap` → Groq Llama 3.3 / local Ollama Qwen 2.5 Coder
  - `tests`: `fast_code_generation` → Groq Llama 3.3
  - `documentation`: `low_reasoning_cheap` → Groq / Ollama
  - `review`: `independent_reasoning` → Different strong model (DeepSeek / Mistral)
  - `security`: `specialized_security` → Gemini Pro / DeepSeek
  - `formatting`: `deterministic_tool` → Prettier / Black / Ruff
- Includes explicit local Ollama host configuration (`http://localhost:11434/v1`).

### 3. Notion Integration & Kanban Mapping
- MCP Server: `@modelcontextprotocol/server-notion` registered in `C:\Users\Aryan Gupta\.gemini\config\mcp_config.json`.
- Standard Notion Database Schema:
  - `Task Name` (Title)
  - `Status` (Select: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`, `Blocked`)
  - `Mode` (Select: `AFK`, `HITL`, `Clarification`)
  - `Size` (Select: `S`, `M`, `L`)
  - `Priority` (Select: `P0`, `P1`, `P2`, `P3`)
  - `Branch` (Text)
  - `PR Link` (URL)
- Terminal State Invariant: The agent transitions tasks to `In Review`. Only the human engineer transitions tasks to `Done` upon merging the PR.

### 4. Security Sandbox & Strix AI
- Automated trigger on diffs modifying authentication, encryption, token handling, database models, or external input routes.
- Runs inside an isolated Git worktree (`sec-review/<slug>`).
- Executes SAST scans (Semgrep/Bandit) and dynamic testing via Strix AI (`strix --target <target>`).
- Emits reproducible vulnerability PoCs and validates surgical remediation patches.

### 5. Project Scaffolder (`init-project.ps1`)
- Located at `d:\projects\antigravity_setup\scripts\init-project.ps1` and mirrored to global skills.
- Generates `.agents/rules/`, `.agents/skills/`, `scripts/verify.ps1`, `.githooks/pre-commit`, `AGENTS.md`, `CONSTITUTION.md`, and `WORKING.md`.

### 6. Interactive Searchable Documentation Web Application
- Built in `d:\projects\antigravity_setup\docs/`.
- Lightweight, zero-dependency modern HTML5/CSS3/JavaScript SPA with instant client-side full-text search.
- Interactive Mermaid architecture diagrams, dark/light mode toggle, collapsible guides, copy-paste config templates.
- Includes `.github/workflows/deploy-docs.yml` for automated GitHub Actions deployment to GitHub Pages.

---

## Testing Decisions

- **Deterministic Verification Standard**: Code correctness is established by running local test runners (`pytest`, `vitest`, `npm test`) and typecheckers (`mypy`, `tsc`), not by prompting an LLM.
- **Verification Tests**:
  - Test `verify.ps1` against Python and TypeScript directory fixtures.
  - Test `init-project.ps1` by scaffolding a temporary repository and asserting that all templates, git hooks, and directories are created properly.
  - Validate all global `SKILL.md` files against Antigravity skill schema (valid YAML frontmatter, name, and description).
  - Test documentation web application search index, responsive layouts, and Mermaid diagram rendering.

---

## Out of Scope

- Microsoft Planner integration (fully deprecated and replaced by Notion).
- Infinite unconstrained Ralph loops (replaced by bounded 3-round Fleet Loops).
- Monolithic multi-agent swarms running simultaneously on a single working directory without worktree isolation.
- Automatic merging of PRs or autonomous movement of Notion tasks to `Done` (strictly reserved for the human engineer).

---

## Further Notes

- The system is designed to be resilient against model deprecations and quota shifts. If a free provider alters its rate limits, updating `~/.gemini/config/model_router.yaml` restores full routing without altering any repository rules or code.
- All documentation and scaffolding will be maintained in the `antigravity_setup` GitHub repository and deployed to GitHub Pages.
