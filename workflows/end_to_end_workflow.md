# 🌌 Antigravity End-to-End Autonomous Engineering Workflow (2026)

> **Core Law:** One Task → One Agent Session → One PR. Keep work bounded, surgical, deterministic, and verifiable under a $0 model budget.

---

## 1. Complete Workflow Lifecycle

```mermaid
flowchart TD
    %% Stage 1
    subgraph S1["1. Task Ingestion & Sizing"]
        A[Notion Task / Brief / Issue] --> B{Classify Task Size}
        B -->|Small S| S_ACT[Direct Act Mode]
        B -->|Medium M| M_PLAN[Plan Mode]
        B -->|Large L| L_SPEC[Spec & Research Mode]
    end

    %% Stage 2
    subgraph S2["2. Planning & Human Gate (Cline Plan/Act)"]
        M_PLAN --> PLAN_DOC[Draft Implementation Plan]
        L_SPEC --> GRILL["/grill-me Socratic Clarification"]
        GRILL --> ARCH_DOC[Architectural Spec & Invariants]
        PLAN_DOC & ARCH_DOC --> HG1{"Human Checkpoint: Approve Plan?"}
        HG1 -->|Approved| WORKTREE["Provision Isolated Git Worktree<br/>git worktree add ../wt-slug brief/slug"]
        HG1 -->|Changes Requested| M_PLAN
    end

    %% Stage 3
    subgraph S3["3. Execution Engine (Ponytail & Karpathy)"]
        S_ACT & WORKTREE --> INIT_WORK[Initialize WORKING.md]
        INIT_WORK --> RED["TDD Red: Write / Verify Failing Test"]
        RED --> PATCH["TDD Green: Surgical Minimal Patch<br/>(Ponytail Laziness Ladder)"]
    end

    %% Stage 4
    subgraph S4["4. Fleet Verification Loop (Deterministic)"]
        PATCH --> V_STATIC["Stage 1: Syntax & Types (tsc/mypy)"]
        V_STATIC -->|Pass| V_UNIT["Stage 2: Targeted Unit Tests"]
        V_STATIC -->|Fail| RETRY{Attempt < 3?}
        V_UNIT -->|Pass| V_REG["Stage 3: Full Regression Suite"]
        V_UNIT -->|Fail| RETRY
        V_REG -->|Pass| V_UI["Stage 4: Playwright & Chrome DevTools"]
        V_REG -->|Fail| RETRY
        V_UI -->|Pass| V_DIFF["Stage 5: AST & Git Diff Inspection"]
        V_UI -->|Fail| RETRY
        RETRY -->|Yes: Surgical Fix| PATCH
        RETRY -->|No: Hard Stop| BLOCKED["Escalate to Human (Blocker Trace)"]
    end

    %% Stage 5
    subgraph S5["5. Security & Multi-Agent Review"]
        V_DIFF --> SEC_CHECK{Security Sensitive?}
        SEC_CHECK -->|Yes| STRIX["Strix AI Sandbox Pen-Test<br/>(Generate PoC & Verify Fix)"]
        SEC_CHECK -->|No| CODE_REV["Independent Code Review Pass<br/>(DeepSeek R1 / Claude Sonnet)"]
        STRIX --> CODE_REV
    end

    %% Stage 6
    subgraph S6["6. Delivery, Audio Alert & Notion Sync"]
        CODE_REV --> PR["Open GitHub PR (gh pr create)"]
        PR --> NOTION_REV["Notion Status -> In Review"]
        NOTION_REV --> ALARM["Play Agent Alarm Chime / Speech"]
        ALARM --> HG2{"Human Checkpoint: PR Review & Merge"}
        HG2 -->|Merged| DONE["Notion Status -> Done<br/>Clean Up Worktree"]
        DONE --> LEARN["Record Insights in learning/instincts.md"]
    end
```

---

## 2. Stage-by-Stage Operational Standard

### Stage 1: Ingestion & Sizing

Every incoming requirement from Notion, chat, or GitHub is triaged into one of three sizing categories:

| Size           | Scope & Characteristics                                                                      | Execution Path                                                                                                                                                          | Target Model Tier                                |
| :------------- | :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------- |
| **Small (S)**  | Typo, single-line bug, adding a test, minor doc fix, simple rename (<20 lines touched).      | **Direct Act Mode**: No formal planning document required. Immediate surgical patch + test verification.                                                                | `cheap_fast` (Groq Llama 3.3 / Mistral Codestral) |
| **Medium (M)** | Standard feature, API endpoint, multi-file bug, UI component (20–150 lines touched).         | **Plan Mode → Act Mode**: Generate `implementation_plan.md`, await human confirmation, then execute via Fleet Loop.                                                     | `standard_coding` (Gemini 3.7 Flash / Codestral) |
| **Large (L)**  | Architectural change, new subsystem, database migration, cross-module refactor (>150 lines). | **Research → Spec → Worktree → Act**: Run `/grill-me`, generate `CONSTITUTION.md` / `spec.md`, spin up isolated git worktree, execute with subagents if parallelizable. | `high_reasoning` (Gemini 3.7 Flash Thinking / Claude 3.7 Sonnet) |

---

### Stage 2: Planning & Socratic Grilling (`/grill-me`)

- For **M** and **L** tasks, the agent enters **Plan Mode** (read-only inspection).
- **Rule**: Never edit project source code during Plan Mode.
- If requirements contain hidden assumptions or missing edge cases, run `/grill-me` to surface trade-offs.
- Produce an `implementation_plan.md` artifact detailing:
  - User review items & open questions.
  - Proposed file changes ([NEW], [MODIFY], [DELETE]).
  - Deterministic verification plan (exact test commands).
- **Human Gate 1**: The user approves the plan before execution proceeds.

---

### Stage 3: Physical Worktree Isolation

For medium and large tasks, never code directly on the main working branch:

```bash
# Create isolated worktree and branch
git worktree add ../wt-<slug> -b brief/<slug>
cd ../wt-<slug>

# Initialize active scratchpad
cp templates/WORKING.md WORKING.md
```

---

### Stage 4: Surgical Coding with Ponytail & Karpathy Guardrails

Execution follows the **Red → Green → Refactor** cycle:

1. **Red**: Write a failing unit or integration test reproducing the desired behavior.
2. **Green**: Implement the fix strictly obeying the **Ponytail Laziness Ladder**:
   - Level 1: YAGNI (drop unasked scope).
   - Level 2: Standard library first (`pathlib`, `itertools`, `crypto`, `fetch`, `json`).
   - Level 3: Native platform/browser capabilities.
   - Level 4: Existing dependencies in `package.json` / `pyproject.toml`.
   - Level 5: Clean one-liner expressions.
   - Level 6: Minimal surgical implementation.
3. **Karpathy Discipline**: Touch only lines required for the test to pass. Never reformat adjacent code.

---

### Stage 5: Deterministic Fleet Verification Loop

Run local test scripts (zero LLM token waste):

1. **Stage 1 (Static)**: `tsc --noEmit` / `mypy .` / `ruff check`
2. **Stage 2 (Targeted)**: `pytest -k <feature>` / `vitest run <feature>`
3. **Stage 3 (Regression)**: Full project test suite.
4. **Stage 4 (Web & UI)**: Playwright E2E tests and Chrome DevTools audits for accessibility/LCP.
5. **Stage 5 (Diff Check)**: Inspect `git diff` for accidental modifications.

- **Circuit Breaker**: If tests fail, the agent has a **maximum of 3 fix attempts**. If still failing on attempt 3, it stops immediately, updates `WORKING.md` with the blocker trace, and asks for human guidance.

---

### Stage 6: Security Sandbox Review & Independent Code Review

- **Security-Sensitive Features** (auth, tokens, cryptography, APIs, uploads):
  - Run **Strix AI** in the isolated sandbox:
    ```bash
    strix --target http://localhost:8000 --scope "/api/*"
    ```
  - Verify zero exploitable PoCs exist.
- **Independent Reviewer Pass**:
  - Spawn an independent Reviewer subagent (or switch model tier to `review` with DeepSeek R1 / Claude 3.7 Sonnet) to verify code against `CONSTITUTION.md` and `AGENTS.md`.

---

### Stage 7: Delivery, Audio Alert & Notion Synchronization

1. Reconcile issue numbers to avoid merge collisions:
   ```bash
   bash scripts/reconcile-issue-numbers.sh --parent main
   ```
2. Commit changes with a descriptive conventional commit message:
   ```bash
   git commit -m "feat(auth): implement token verification with stdlib crypto"
   ```
3. Open GitHub Pull Request:
   ```bash
   gh pr create --base main --head brief/<slug> --title "feat: <title>" --body-file WORKING.md
   ```
4. Update Notion Task:
   - Move status from `In Progress` → `In Review`.
   - Attach PR link.
5. Trigger Audio Completion Alert (`agent-alarm`):
   ```powershell
   [System.Media.SystemSounds]::Asterisk.Play()
   ```
6. **Human Gate 2**: Human reviews and merges PR.
7. Post-Merge: Move Notion card to `Done`, remove worktree (`git worktree remove ../wt-<slug>`).
8. Record any architectural insights in `learning/instincts.md` (`task-observer`).
