# Zero-Budget AI Coding System — Research Synthesis & Implementation Plan

> **Purpose:** Design the best practical AI-assisted coding workflow possible under a hard `$0` model/API budget, while preserving engineering quality, keeping human time low, and making the system portable across Antigravity, Gemini CLI, OpenCode and other coding agents.
>
> **Research weighting:** This document intentionally gives more weight to the **original research/question set and long-running workflow goals** than to the later DayPilot/`agent-skills` details. The later repository architecture is treated as useful reference material, not as the architecture that must be preserved.
>
> **Important constraint:** Free-model availability and quotas change. Treat provider/model choices as replaceable infrastructure, not permanent dependencies.

---

## 1. Executive conclusion

The best system is **not** “the biggest possible multi-agent swarm.”

It is a **portable engineering workflow** with:

1. a primary coding environment,
2. several interchangeable free model sources,
3. a small number of high-value tools,
4. a compact skills library,
5. explicit task states,
6. verification gates,
7. bounded autonomous loops,
8. selective subagent use,
9. cheap persistent project state,
10. a learning loop that makes the human better rather than merely faster.

### Recommended architecture

```text
                         YOU
                          |
                          v
                 PRIMARY WORKSPACE
                    Antigravity
                          |
              +-----------+-----------+
              |                       |
              v                       v
        TASK / WORKFLOW           DIRECT CODING
          LAYER                     SESSION
              |                       |
              +-----------+-----------+
                          |
                          v
                  MODEL SELECTION
                          |
        +-----------------+------------------+
        |                 |                  |
        v                 v                  v
    Gemini CLI         OpenCode            Local
    / Gemini           / free providers    Ollama
        |                 |                  |
        +-----------------+------------------+
                          |
                          v
                      TOOLS
                          |
       +---------+--------+--------+---------+
       |         |        |        |         |
       v         v        v        v         v
      Git     GitHub    Web      Files     Tests
                          |
                          v
                   VERIFY / REVIEW
                          |
                +---------+---------+
                |                   |
               PASS                FAIL
                |                   |
                v                   v
              READY             bounded fix loop
                |
                v
               YOU
                |
                v
               DONE
```

### The central principle

> **Models are replaceable. Workflow quality is not.**

Your workflow should survive a free model disappearing tomorrow.

---

# 2. What the research says

Several independent approaches converge on the same basic engineering pattern:

**Understand -> Plan -> Implement -> Verify -> Review -> Deliver.**

That pattern appears in modern agent workflows from Antigravity, Cline, Superpowers, Aider, OpenHands and large-company agentic engineering experiments.

### Antigravity

Antigravity now supports specialized subagents, background/asynchronous work, workspace isolation, skills, scheduled tasks and agent management. Google explicitly positions it as an agent-first platform for orchestrating multiple agents.  
Source: Google Antigravity team, May 2026.  
https://antigravity.google/blog/google-io-2026-feature-deep-dive

### Cline

Cline formalizes a very useful split:

- **Plan mode:** inspect, reason, search and design without modifying the repository.
- **Act mode:** implement the approved plan.
- Small tasks can skip planning.
- Medium tasks use Plan -> Act.
- Large tasks use deeper planning.

It also allows different models for planning and implementation, which directly supports cost optimization.

Source: Cline documentation.  
https://docs.cline.bot/core-workflows/plan-and-act

### Superpowers

Superpowers' workflow is especially relevant:

1. brainstorm
2. approve design
3. create isolated git worktree
4. write a detailed implementation plan
5. execute tasks with fresh subagents
6. review each task
7. TDD
8. finish/review the branch

Source: obra/Superpowers.  
https://github.com/obra/Superpowers

### Aider

Aider's repository map demonstrates another key principle:

> Give the model a compact structural representation of the repository rather than dumping the entire repository into context.

Aider also supports automatic linting/testing after edits.

Sources:
- https://aider.chat/docs/repomap.html
- https://aider.chat/docs/usage/lint-test.html

### OpenHands

OpenHands is useful as a model/agent architecture reference because it separates the reasoning-action loop from the model provider and supports local LLM backends.

Source: OpenHands documentation.  
https://github.com/OpenHands/docs/blob/main/openhands/usage/llms/local-llms.mdx

### Karpathy-inspired skills

The Karpathy skill ecosystem packages behavioral guidance around four important failure modes:

- understand before editing,
- avoid unnecessary complexity,
- make surgical changes,
- verify outcomes.

Source:
https://github.com/swarmclawai/andrej-karpathy-skills

### Company-scale agentic engineering

A useful 2026 example is Affirm's description of its agentic software-development workflow:

> one task -> one agent session -> one PR

with explicit human checkpoints around planning and review, plus automated verification.

Source:
https://medium.com/@affirmtechnology/how-affirm-retooled-its-engineering-organization-for-agentic-software-development-in-one-week-1fd35268fde6

This strongly supports **bounded task units** instead of indefinite autonomous sessions.

---

# 3. The key correction to the previous architecture

The old thinking was close to:

```text
Orchestrator
    |
    +-- Planner
    +-- Architect
    +-- Coder
    +-- Tester
    +-- Reviewer
    +-- Security Agent
    +-- Fixer
    +-- Documentation Agent
```

That sounds powerful, but under a zero-budget constraint it is often economically wrong.

Every additional model invocation costs:

- quota,
- context,
- time,
- coordination overhead,
- probability of contradictory advice.

### Better rule

Use **one agent by default**.

Introduce another agent only when there is a real reason for **independent judgment, parallelism, or specialization**.

Examples:

```text
Normal bug:
  1 agent + tests

Architecture:
  planner -> coder

High-risk change:
  coder -> independent reviewer

Security-sensitive:
  coder -> security reviewer -> fixer

Large independent task:
  orchestrator -> parallel workers
```

Do not use multi-agent workflows simply because they are possible.

---

# 4. The final architecture

## Layer A — Human

The human provides:

- intent,
- priorities,
- ambiguity resolution,
- risk tolerance,
- final approval for important changes.

The system should reduce repetitive work, not remove engineering judgment.

---

## Layer B — Primary interface

### Recommended: Antigravity

Use Antigravity as the main control surface because it now natively supports:

- agents,
- subagents,
- asynchronous/background work,
- skills,
- agent management,
- scheduled tasks,
- workspace isolation.

This means there is less reason to build an orchestration framework from scratch.

Source:
https://antigravity.google/blog/google-io-2026-feature-deep-dive

---

## Layer C — Free model pool

### Tier 1: primary free cloud inference

#### Gemini CLI

Gemini CLI currently documents:

- **1,000 model requests/day** for a Google-account Gemini Code Assist Individual login.
- **250 requests/day** for the unpaid Gemini API-key tier.

The Google-login route is therefore the first thing to test for a $0 setup.

Source:
https://github.com/google-gemini/gemini-cli/blob/main/docs/resources/quota-and-pricing.md

### Tier 2: model/provider escape hatch

#### OpenCode

OpenCode is useful because it separates the coding-agent runtime from the provider/model layer and supports reusable `SKILL.md` skills.

Its current documentation lists several free models in its Zen model catalog, including models such as:

- MiMo-V2.5 Free
- North Mini Code Free
- Nemotron 3 Ultra Free
- DeepSeek V4 Flash Free

Free model availability can change, so do not hard-code one model as the foundation.

Sources:
- https://opencode.ai/docs/skills
- https://opencode.ai/docs/zen

### Tier 3: local fallback

#### Ollama / local model server

Use local inference as:

- offline fallback,
- cheap repetitive worker,
- formatter/test/documentation worker,
- emergency path when cloud quotas are exhausted.

Do NOT assume a local model should replace your strongest cloud model.

The local machine's available VRAM determines what is practical.

---

# 5. Alternatives worth testing, not necessarily installing

## Roo Code

Roo Code has a particularly useful concept:

- Code
- Ask
- Architect
- Debug
- Orchestrator

and separate model assignments by mode.

That is directly relevant to model budgeting.

Source:
https://github.com/RooCodeInc/Roo-Code-Docs/blob/main/docs/basic-usage/using-modes.md

### Verdict

**Study the mode architecture.**

Do not automatically add Roo Code if Antigravity already provides the control model you want.

---

## Cline

Cline's Plan/Act split is excellent workflow inspiration, especially for cost control.

### Verdict

**Borrow the workflow idea.**

Use Cline itself only if it beats Antigravity for a specific task.

---

## Goose

Goose is valuable as an open-source, general-purpose agent runtime with provider and MCP/extension support.

### Verdict

**Keep as a serious fallback/experiment.**

Do not add it until the core stack is stable.

---

## OpenHands

OpenHands is useful for:

- local LLM experiments,
- agent architecture research,
- longer-running software tasks,
- understanding model/agent separation.

### Verdict

**Research candidate, not initial foundation.**

---

## Aider

Aider is extremely useful conceptually because of:

- repository maps,
- automatic test/lint execution,
- git-centric workflow.

### Verdict

**Borrow the context and verification ideas.**

---

# 6. Model-routing philosophy

Never write:

```text
Task -> Gemini 3.x
```

Write:

```text
Task -> MODEL CLASS -> available provider/model
```

For example:

| Task | Desired capability | Model tier |
|---|---|---|
| architecture | high reasoning | strongest available free |
| unfamiliar repo | high reasoning + context | strongest |
| normal implementation | coding + tools | standard |
| small fix | low reasoning | cheap |
| tests | low/medium reasoning | cheap |
| documentation | low reasoning | cheap/local |
| repetitive migration | cheap | cheap/local |
| review | independent reasoning | different strong model |
| security | specialized reasoning | strong |
| formatting | deterministic | local/tool |

The model name should be configurable.

---

# 7. Task sizing is more important than model selection

Define three classes.

## S — Small

Examples:

- rename
- tiny bug
- add import
- simple test
- documentation

Workflow:

```text
Act
-> modify
-> test
-> done
```

No planner.

---

## M — Medium

Examples:

- normal feature
- multi-file bug
- API integration
- non-trivial refactor

Workflow:

```text
Plan
-> approve/confirm
-> implement
-> test
-> review
```

---

## L — Large

Examples:

- architecture change
- major feature
- migration
- cross-system integration

Workflow:

```text
Research
-> specification
-> architecture
-> implementation plan
-> task decomposition
-> isolated execution
-> verification
-> review
-> human decision
```

This is where subagents become useful.

---

# 8. The universal execution loop

Every implementation task should eventually reduce to:

```text
1. Read requirement
2. Identify acceptance criteria
3. Inspect relevant repository context
4. Identify existing patterns
5. Decide whether planning is necessary
6. Make the smallest correct change
7. Run targeted tests
8. Run broader checks
9. Inspect the diff
10. Review against acceptance criteria
11. Stop or fix
```

### Never use:

```text
agent said "done"
```

as the completion criterion.

---

# 9. The bounded fix loop

Use a Ralph-like loop, but much smaller.

```text
IMPLEMENT
    |
    v
TEST
    |
   PASS ------> REVIEW ------> DONE
    |
   FAIL
    |
    v
DIAGNOSE
    |
    v
FIX
    |
    v
TEST
```

### Maximum retry rule

Start with:

```text
max_fix_rounds = 3
```

If the third attempt fails:

```text
STOP
REPORT
ESCALATE
```

Do not endlessly spend free quota.

For complex tasks, a separate reviewer can be brought in before another fix round.

---

# 10. Important lesson from Superpowers

Superpowers' latest work is especially instructive because it explicitly separates:

- implementation,
- task review,
- scoped re-review,
- final review,
- fix-round limits.

It also has an explicit five-round breaker in parts of its newer subagent-driven workflow.

Source:
https://github.com/obra/superpowers/blob/main/docs/superpowers/plans/2026-07-15-sdd-fix-loop-redesign.md

### But copy selectively

Do NOT copy a five-round review loop onto every tiny task.

There is already a documented issue where excessive reviews on easy mechanical work can burn time and tokens.

Source:
https://github.com/obra/superpowers/issues/1120

### Rule for your system

```text
Mechanical task
  -> no separate reviewer

Normal feature
  -> one review

High-risk feature
  -> independent review

Critical/security work
  -> specialized review
```

This is much more appropriate for your zero-budget goal.

---

# 11. Skills architecture

The skill layer should be **portable across agents**.

The existence of portable Karpathy skills and OpenCode's support for `.agents/skills`, `.claude/skills`, and `.opencode/skills` is strong evidence that a common skill repository is the correct abstraction.

Source:
https://opencode.ai/docs/skills

### Canonical layout

```text
agent-skills/
    core/
        engineering-principles/
        task-triage/
        requirements/
        planning/
        tdd/
        debugging/
        verification/
        code-review/
        git/
        security-review/
        research/
    integrations/
        github/
        browser/
        notion/
        planner/
        kaggle/
    meta/
        writing-skills/
        skill-selection/
```

### Initial skill set

Do NOT start with 100 skills.

Start with roughly 15:

```text
engineering-principles
task-triage
requirements-analysis
planning
repository-research
tdd
implementation
systematic-debugging
verification-before-completion
code-review
security-review
git-worktree
commit-and-pr
research
learning-review
```

Then add specialist skills only when a repeated problem appears.

---

# 12. Skills should be triggered by conditions, not dump everything into context

One subtle but important lesson from Superpowers is that skill descriptions should communicate **when the skill applies**, not summarize the whole workflow.

Why?

Because an agent may follow the short description and never read the full skill body.

Source:
https://github.com/obra/Superpowers/blob/main/skills/writing-skills/SKILL.md

Therefore:

### Good

```yaml
name: systematic-debugging
description: Use when diagnosing a bug whose root cause is not yet established.
```

### Bad

```yaml
description: Use when debugging by reproducing, forming hypotheses,
tracing root causes, fixing, testing, and reviewing.
```

Keep triggers short.

---

# 13. WORKING.md

This idea from the earlier system should stay.

For every substantial task/project:

```text
WORKING.md
```

Suggested structure:

```markdown
# Working State

## Goal

## Current Task

## Acceptance Criteria

## Relevant Files

## Architecture Notes

## What Has Been Tried

## Current Failures

## Decisions

## Blockers

## Next Action

## Learning
```

This is cheap persistent memory.

It is more robust and portable than depending on a vendor-specific memory feature.

---

# 14. Repository context strategy

Do not dump the entire repository into the context.

Use a layered approach.

```text
LEVEL 0:
  task + acceptance criteria

LEVEL 1:
  repository map / file tree

LEVEL 2:
  relevant modules

LEVEL 3:
  symbols/functions/classes

LEVEL 4:
  surrounding implementation

LEVEL 5:
  tests + related historical changes
```

This follows the same fundamental idea behind Aider's repository map.

Source:
https://aider.chat/docs/repomap.html

### Add a repo-map command

Create a cheap deterministic script that can output:

- file tree
- important files
- exported classes/functions
- dependency information
- test locations
- README/architecture docs

The AI gets only the relevant slices.

---

# 15. Context compression

Headroom belongs in the research track because context cost is a first-class constraint.

Use context compression only after you can measure the baseline.

### Benchmark:

```text
same task
without compression
vs.
same task
with compression
```

Measure:

- requests
- input tokens
- completion tokens
- latency
- success rate
- regression rate

Do not add Headroom because “token reduction sounds good.”

Add it only if the empirical tradeoff is positive.

---

# 16. MCP policy

MCP is useful, but the mistake is installing every interesting server.

Start with:

### Core

```text
filesystem
git
GitHub
browser/web
```

### Project-specific

```text
Microsoft Graph / Planner
Kaggle
Notion
```

### Specialized

```text
security
remote infrastructure
research
database
```

### Rule

Only add an MCP server if it removes a recurring manual action.

---

# 17. Evaluate the original MCP/tool ideas

## GitHub MCP

**Priority: HIGH**

Useful for:

- issues
- PRs
- review
- CI
- repository metadata

Your existing `gh` CLI may already cover many actions, so benchmark MCP vs CLI before adding duplicate tooling.

---

## Notion MCP

**Priority: LOW/MEDIUM**

Good for project management and knowledge capture.

Not needed for every coding task.

---

## Sequential Thinking MCP

**Priority: LOW**

The problem is usually not lack of chain-of-thought infrastructure.

Better context + planning + verification usually provide more value.

---

## Antimetal MCP

**Priority: EXPERIMENT**

Do not place in the foundation until you clearly define the repeated job it solves.

Benchmark it against direct APIs/CLI.

---

## Strix AI

**Priority: SPECIALIZED**

Use only for security-sensitive work.

Do not run on everything.

---

## Agent Reach

**Priority: OPTIONAL**

Potentially useful for web/community research, but not core coding infrastructure.

---

# 18. UI tools

## Lovable

Use for:

```text
UI idea -> prototype -> transfer to real repo
```

Not part of the coding backbone.

---

## Google Stitch

Same category:

```text
visual exploration / UI ideation
```

Useful but optional.

---

# 19. Jules

Jules is interesting as an asynchronous coding worker.

Potential pattern:

```text
you
 -> well-defined issue
 -> Jules
 -> PR
 -> review
```

Use it as a worker, not as your central architecture.

---

# 20. Kaggle

Keep for ML-specific compute.

```text
local development
      |
      v
Kaggle experiment
      |
      v
artifact/results
      |
      v
local repository
```

Do not force normal software engineering through Kaggle.

---

# 21. Memory tools

## Claude-mem

**Do not make foundational.**

Vendor-specific memory can be valuable, but:

- you are trying to avoid paid dependency,
- memory systems can become opaque,
- `WORKING.md` + repository docs are portable.

---

## Obsidian brain

Good for **human knowledge management**.

Do not force agents to update it after every action.

Use it for:

- concepts
- architecture lessons
- personal learning
- reusable mental models

---

# 22. Task observer / completion alarms

Keep this idea, but make it deterministic.

Instead of asking an LLM to monitor whether another LLM finished:

```text
agent process
    |
    v
task state file / marker
    |
    v
PowerShell watcher
    |
    v
notification
```

This costs:

```text
$0 model calls
```

and is reliable.

---

# 23. Ponytail

Treat Ponytail as a candidate for experimentation around task/agent workflow composition.

Do not put it into the first version.

First prove your core loop without it.

Then benchmark:

```text
native Antigravity
vs.
Ponytail
```

for the same 5–10 representative tasks.

---

# 24. OmniRoute

The underlying idea is valuable:

> model/provider routing.

But do not build:

```text
Antigravity
  -> OmniRoute
     -> OpenCode
        -> another router
```

Instead expose one model-selection abstraction:

```text
MODEL_PROVIDER
```

and keep the rest of the system unaware of implementation details.

Only add OmniRoute after measuring whether it simplifies your actual provider switching.

---

# 25. “Claude Code setup”

Even though Claude Code is not your free foundation, its ecosystem is worth studying for:

- skills
- commands
- agent patterns
- hooks
- subagent composition.

However:

> **Do not make a Claude-specific feature a required part of a zero-budget architecture.**

---

# 26. The final workflow by task size

## Tiny

```text
task
 -> coding agent
 -> implement
 -> test
 -> diff
 -> done
```

Typical model:

```text
cheap/free
```

---

## Normal

```text
task
 -> plan
 -> implement
 -> targeted tests
 -> typecheck/lint
 -> review diff
 -> done
```

Typical model:

```text
standard free coding model
```

---

## Complex

```text
task
 -> research
 -> requirements
 -> architecture
 -> implementation plan
 -> human approve
 -> isolated worktree
 -> implement task 1
 -> verify
 -> review
 -> task 2
 -> verify
 -> final review
 -> PR
```

Typical models:

```text
strong free model for planning
standard model for execution
different strong model for review
```

---

# 27. The subagent rule

Spawn a subagent only if at least one is true:

- task can be worked on independently,
- parallel execution materially reduces time,
- a second opinion is valuable,
- specialized tooling is required,
- isolation protects the main task.

Do NOT spawn:

```text
planner-of-planner
architect-of-architect
reviewer-of-reviewer
```

unless there is evidence you need them.

---

# 28. The ideal role system

You probably need only four roles:

## 1. Planner

Read-only.

Outputs:

```text
requirements
risks
affected files
implementation plan
acceptance criteria
```

## 2. Coder

Writes code and tests.

## 3. Reviewer

Read-only.

Checks:

```text
requirements
correctness
regressions
quality
security
```

## 4. Researcher

Read-only.

Used for:

```text
web
documentation
API research
library investigation
```

Everything else should be a skill, not another permanent agent.

---

# 29. DayPilot-style task states: simplify, do not discard

A useful state machine is:

```text
BACKLOG
   |
READY
   |
EXECUTING
   |
VALIDATING
   |
REVIEW
   |
DONE
```

With:

```text
BLOCKED
```

as an exception state.

Do not make the state machine enormous.

The task state should describe **where the work is**, not every internal agent action.

---

# 30. Completion gates

Define the real definition of done.

```text
DONE =
  acceptance criteria satisfied
  AND tests pass
  AND static checks pass
  AND diff inspected
  AND no unresolved blockers
```

For Python:

```text
pytest
mypy
lint/format checks
```

For TypeScript:

```text
Vitest
typecheck
lint
build
```

Use the repository's actual scripts rather than inventing new ones.

---

# 31. Human checkpoints

Human involvement should happen at **high-information boundaries**.

Good checkpoints:

```text
after specification
after architecture for large work
before risky/destructive action
after implementation
before merge
```

Bad checkpoints:

```text
approve every file
approve every shell command
approve every tiny edit
```

The goal is **high leverage**, not maximum interruption.

---

# 32. Security model

Agents should default to:

```text
read freely
write within project
run safe tests
```

Require human approval for:

- destructive shell operations,
- credential changes,
- production deployment,
- database destruction/migrations,
- secret exposure,
- broad filesystem changes,
- network actions with meaningful consequences.

---

# 33. The “best coder” learning loop

This is important because your goal isn't only automation.

After important tasks, run:

```text
POST-TASK REVIEW

1. What did the agent misunderstand?
2. What did I misunderstand?
3. What architectural decision mattered?
4. What would a senior engineer question?
5. What recurring pattern should become a skill?
6. What mistake should be prevented next time?
```

Store useful answers in:

```text
learning/
  mistakes.md
  patterns.md
  decisions.md
```

The system therefore improves both:

- your automation,
- your engineering judgment.

---

# 34. Proposed skill library

## Core behavior

```text
karpathy-guidelines
```

## Task handling

```text
task-triage
requirements-analysis
planning
task-sizing
```

## Coding

```text
implementation
tdd
refactoring
```

## Debugging

```text
systematic-debugging
root-cause-analysis
```

## Verification

```text
verification-before-completion
testing
linting
typechecking
code-review
security-review
```

## Git

```text
git-worktree
commit
pull-request
merge-conflict
```

## Research

```text
repository-research
web-research
documentation-research
```

## Learning

```text
learning-review
```

---

# 35. Commands / workflows

Start with only these:

```text
/start-task
/plan
/implement
/tdd
/debug
/review
/verify
/finish
/learn
```

Optional:

```text
/research
/security-review
```

Do not make every skill a slash command.

Skills should be automatically discoverable where appropriate.

---

# 36. Suggested repository structure

```text
ai-coding-system/
|
+-- skills/
|   +-- core/
|   +-- coding/
|   +-- debugging/
|   +-- verification/
|   +-- git/
|   +-- research/
|   +-- integrations/
|
+-- workflows/
|   +-- start-task.md
|   +-- plan.md
|   +-- implement.md
|   +-- verify.md
|   +-- review.md
|   +-- finish.md
|
+-- agents/
|   +-- planner.md
|   +-- coder.md
|   +-- reviewer.md
|   +-- researcher.md
|
+-- scripts/
|   +-- repo-map.ps1
|   +-- verify.ps1
|   +-- task-watch.ps1
|   +-- notify.ps1
|   +-- task-state.ps1
|
+-- templates/
|   +-- WORKING.md
|   +-- task.md
|   +-- review.md
|
+-- docs/
|   +-- architecture.md
|   +-- decisions/
|   +-- experiments/
|
+-- learning/
    +-- mistakes.md
    +-- patterns.md
```

---

# 37. Implementation plan

## Phase 0 — Baseline

Goal:

> know what already works before adding infrastructure.

### Tasks

- [ ] Record current Antigravity version/features.
- [ ] Install/test Gemini CLI.
- [ ] Install/test OpenCode.
- [ ] Test current free model access.
- [ ] Confirm Git, GitHub CLI and repository access.
- [ ] Choose one representative Python task.
- [ ] Choose one representative React/TypeScript task.
- [ ] Record baseline completion time, model usage and failures.

Deliverable:

```text
docs/experiments/baseline.md
```

---

## Phase 1 — Create the portable skill core

- [ ] Extract high-value existing skills.
- [ ] Remove vendor-specific assumptions.
- [ ] Add Karpathy-inspired engineering principles.
- [ ] Add requirements-analysis.
- [ ] Add task-sizing.
- [ ] Add TDD.
- [ ] Add systematic debugging.
- [ ] Add verification-before-completion.
- [ ] Add code-review.
- [ ] Add Git/worktree workflow.
- [ ] Add learning-review.
- [ ] Add skill-selection rules.

Deliverable:

```text
skills/
```

---

## Phase 2 — Add universal project instructions

Create:

```text
AGENTS.md
```

It should specify:

- coding principles
- repository conventions
- test commands
- forbidden operations
- how to find the skill library
- completion requirements

Create:

```text
WORKING.md
```

for persistent project state.

---

## Phase 3 — Build a cheap repository-context layer

Implement:

```text
scripts/repo-map.ps1
```

Output:

- top-level structure
- important directories
- source files
- test files
- key symbols if practical
- package/project manifests
- README/architecture docs

Do NOT build an LLM-powered repo mapper.

Keep the first version deterministic.

---

## Phase 4 — Build deterministic verification

Implement:

```text
scripts/verify.ps1
```

It should detect project type and run the correct checks.

Example:

```text
Python
  pytest
  mypy
  lint

React/TypeScript
  npm test
  typecheck
  lint
  build
```

The exact commands should come from each repository's configuration.

---

## Phase 5 — Build task-state handling

Implement a very small state machine:

```text
BACKLOG
READY
EXECUTING
VALIDATING
REVIEW
DONE
BLOCKED
```

Do not initially rebuild DayPilot.

Instead create a lightweight adapter or wrapper around the parts you actually need.

---

## Phase 6 — Implement the basic workflow

### Small task

```text
/start-task
 -> implement
 -> verify
 -> finish
```

### Medium task

```text
/start-task
 -> plan
 -> implement
 -> verify
 -> review
 -> finish
```

### Large task

```text
/start-task
 -> research
 -> specification
 -> architecture
 -> plan
 -> human checkpoint
 -> isolated implementation
 -> verification
 -> review
 -> finish
```

---

## Phase 7 — Add one bounded autonomous loop

Implement:

```text
/run-loop
```

Pseudo-process:

```text
attempt = 1

while attempt <= 3:

    implement_or_fix()

    if verify_passes:
        review()
        if review_passes:
            stop_successfully

    record_failure()
    attempt += 1

stop_and_report()
```

Important:

- no infinite loops,
- no automatic expansion of task scope,
- no guessing answers to blocked questions.

---

# 38. Preserve your strongest previous principles

These are worth keeping regardless of the final toolchain:

### Never assume unresolved requirements.

If the agent cannot know the answer, stop.

### Ask queued clarification questions together.

Avoid repeatedly interrupting the human for one question at a time.

### Keep autonomous work bounded.

### Never equate “agent finished” with “task finished.”

### Isolate risky changes.

### Keep human approval at meaningful boundaries.

---

# 39. Phase 8 — Multi-agent capability

Only after the single-agent loop is reliable:

- [ ] create Planner agent.
- [ ] create Reviewer agent.
- [ ] create Researcher agent.
- [ ] test isolated subagents.
- [ ] test parallel tasks.
- [ ] benchmark token use.
- [ ] benchmark completion quality.
- [ ] benchmark time saved.

### Success criterion

Multiple agents must produce **measurable benefit**.

If not, remove them.

---

# 40. Phase 9 — Model routing

Build a simple configuration such as:

```yaml
models:
  planning: strongest_free
  coding: standard_free
  review: independent_free
  mechanical: cheapest_free_or_local
  documentation: local_or_cheap
  security: strongest_free
```

The actual providers/models are discovered separately.

This makes the architecture resilient.

---

# 41. Phase 10 — Headroom/context optimization

Only now test Headroom or similar context optimization.

Benchmark:

```text
baseline
vs
compressed
```

Measurements:

```text
token usage
requests
latency
success rate
failure rate
```

Keep only if it improves the ratio:

```text
engineering output / token
```

---

# 42. Phase 11 — Specialized integrations

Add one at a time.

Priority order:

```text
1. GitHub
2. browser/web
3. Microsoft Planner/Graph
4. Kaggle
5. Notion
6. security tools
7. additional specialized MCPs
```

After every integration ask:

> What recurring manual action did this remove?

If the answer is unclear, don't add it.

---

# 43. Phase 12 — Optional ecosystem experiments

Evaluate separately:

```text
Roo Code
Cline
Goose
OpenHands
Aider
Jules
Strix
Agent Reach
Ponytail
Stitch
Lovable
Claude memory
Obsidian
OmniRoute
```

Run the **same benchmark tasks** across them.

Do not decide from demos alone.

---

# 44. Benchmark suite

Create 10–20 representative coding tasks.

Suggested categories:

```text
1 tiny bug
1 medium bug
1 feature
1 refactor
1 React UI task
1 API task
1 test-writing task
1 debugging task
1 unfamiliar-repo task
1 architecture task
1 security task
1 documentation task
```

For each tool/model record:

```text
success
time
number of requests
manual interventions
tests passed
review findings
regressions
tokens if available
```

Then calculate:

```text
quality / cost
quality / human minute
```

That is much more meaningful than “this agent feels smart.”

---

# 45. Decision matrix

Use the following scoring categories:

| Category | Weight |
|---|---:|
| Free availability | 20% |
| Coding quality | 20% |
| Repository understanding | 15% |
| Tool/MCP integration | 10% |
| Reliability | 10% |
| Context efficiency | 10% |
| Workflow customization | 5% |
| Local fallback | 5% |
| Learning value / transparency | 5% |

The exact weights can change.

The important part is that the choice is measured.

---

# 46. Things NOT to build initially

Avoid:

```text
huge Python orchestrator
automatic prompt router
10+ permanent agents
large memory database
30+ MCP servers
infinite Ralph loop
fully autonomous production deployment
LLM-powered task observer
LLM-powered notification system
multiple nested model routers
```

Start with deterministic infrastructure.

---

# 47. Zero-budget operating rules

## Rule 1

Never pay accidentally.

Use:

- free tiers,
- local inference,
- open-source tools.

Monitor account/provider settings.

---

## Rule 2

Preserve your strongest models for high-information work.

---

## Rule 3

Use deterministic tools whenever possible.

A PowerShell script is cheaper than an LLM.

A Git command is cheaper than an MCP call.

A test runner is cheaper than another reviewer.

---

## Rule 4

Don't ask agents to reproduce information that a file can store.

Use:

```text
WORKING.md
plan.md
review.md
decision records
```

---

## Rule 5

Use multiple models for **diversity of judgment**, not decoration.

---

# 48. Final recommended stack

## Foundation

```text
Antigravity
Gemini CLI
OpenCode
Git
GitHub CLI
portable skills
AGENTS.md
WORKING.md
deterministic verification
```

## Strong additions

```text
browser/web research
GitHub MCP
Headroom (after benchmarking)
Ollama/local fallback
```

## Optional

```text
Goose
Cline
Roo Code
OpenHands
Aider
Jules
Kaggle
Notion
Strix
Agent Reach
```

## Do not make foundational

```text
Claude-specific memory
Obsidian brain
sequential thinking MCP
large orchestrator framework
large MCP collection
Ponytail
Lovable
Stitch
```

These can still be useful; they simply shouldn't determine the system architecture.

---

# 49. Proposed “golden path”

The everyday workflow should feel like this:

```text
YOU:
  "Implement X."

SYSTEM:
  classify task

SMALL:
  implement -> verify -> done

MEDIUM:
  plan -> implement -> verify -> review -> done

LARGE:
  research -> spec -> architecture -> plan
  -> human checkpoint
  -> task execution
  -> verify -> review -> PR

FAILURE:
  bounded fix loop (max 3)
  -> escalate if unresolved
```

And the model can change underneath without changing the workflow.

---

# 50. The final architecture principle

The system should have four independent layers:

```text
LAYER 1 — WORKFLOW
What steps happen?

LAYER 2 — SKILLS
How should the agent behave?

LAYER 3 — TOOLS
What can the agent access?

LAYER 4 — MODELS
How is reasoning performed?
```

Never allow one model/vendor to own all four.

That is the main protection against future quota changes, model changes, tool changes and vendor lock-in.

---

# 51. What I would build first this week

### Day 1

- [ ] Install/verify Antigravity.
- [ ] Install Gemini CLI.
- [ ] Install OpenCode.
- [ ] Test free quotas.
- [ ] Create `AGENTS.md`.
- [ ] Create `WORKING.md` template.

### Day 2

- [ ] Build portable skills directory.
- [ ] Add Karpathy principles.
- [ ] Add task-triage.
- [ ] Add planning.
- [ ] Add TDD.
- [ ] Add debugging.
- [ ] Add verification.

### Day 3

- [ ] Build deterministic `repo-map.ps1`.
- [ ] Build `verify.ps1`.
- [ ] Build task-state script.

### Day 4

- [ ] Implement small-task workflow.
- [ ] Implement medium-task workflow.
- [ ] Implement bounded fix loop.

### Day 5

- [ ] Add reviewer.
- [ ] Add worktree isolation for large tasks.
- [ ] Add GitHub integration.
- [ ] Run benchmark suite.

### After that

Only add new tools when benchmark results justify them.

---

# 52. Research verdict

The strongest concepts found across the ecosystem are not individual products.

They are:

1. **Plan before acting when uncertainty is meaningful.**
2. **Skip planning on trivial work.**
3. **Use small, well-defined tasks.**
4. **Give agents structured repository context rather than dumping everything.**
5. **Use tests and tools as external reality checks.**
6. **Use separate review judgment when risk justifies it.**
7. **Bound autonomous loops.**
8. **Keep agent memory in portable artifacts.**
9. **Make skills portable.**
10. **Make model providers replaceable.**
11. **Use subagents only where parallelism or independent judgment is valuable.**
12. **Optimize human time and engineering quality, not number of autonomous actions.**

Those principles are more durable than any specific free model.

---

# 53. Immediate next actions

```text
[ ] Install Gemini CLI
[ ] Install OpenCode
[ ] Verify Antigravity
[ ] Create the portable skills repository
[ ] Create AGENTS.md template
[ ] Create WORKING.md template
[ ] Create repo-map.ps1
[ ] Create verify.ps1
[ ] Create task-state.ps1
[ ] Implement small/medium/large workflow
[ ] Implement bounded 3-round fix loop
[ ] Add one reviewer
[ ] Create 10-task benchmark
[ ] Benchmark Gemini CLI vs OpenCode vs local
[ ] Only then decide on extra MCPs/agents
```

---

# 54. Sources used in this research

- Google Antigravity — Subagents, Hooks, Scheduled Tasks, Agent Management  
  https://antigravity.google/blog/google-io-2026-feature-deep-dive

- Google I/O 2026 — Antigravity ecosystem  
  https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/

- Gemini CLI quotas and pricing  
  https://github.com/google-gemini/gemini-cli/blob/main/docs/resources/quota-and-pricing.md

- Cline Plan & Act workflow  
  https://docs.cline.bot/core-workflows/plan-and-act

- Roo Code modes  
  https://github.com/RooCodeInc/Roo-Code-Docs/blob/main/docs/basic-usage/using-modes.md

- Superpowers  
  https://github.com/obra/Superpowers

- Superpowers subagent-driven development  
  https://github.com/obra/Superpowers/blob/main/skills/subagent-driven-development/SKILL.md

- Superpowers fix-loop redesign  
  https://github.com/obra/Superpowers/blob/main/docs/superpowers/plans/2026-07-15-sdd-fix-loop-redesign.md

- Superpowers writing skills guidance  
  https://github.com/obra/Superpowers/blob/main/skills/writing-skills/SKILL.md

- Aider repository map  
  https://aider.chat/docs/repomap.html

- Aider linting/testing  
  https://aider.chat/docs/usage/lint-test.html

- OpenCode skills  
  https://opencode.ai/docs/skills

- OpenCode Zen  
  https://opencode.ai/docs/zen

- OpenHands local LLM documentation  
  https://github.com/OpenHands/docs/blob/main/openhands/usage/llms/local-llms.mdx

- Karpathy-inspired agent skills  
  https://github.com/swarmclawai/andrej-karpathy-skills

- Affirm agentic software development workflow  
  https://medium.com/@affirmtechnology/how-affirm-retooled-its-engineering-organization-for-agentic-software-development-in-one-week-1fd35268fde6
