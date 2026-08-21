# Complete Specification & Implementation Blueprint: Zero-Budget Autonomous Agent Stack

This document contains the complete, battle-tested blueprint for setting up a $0-cost, high-velocity autonomous coding environment. It reconciles **every tool, skill, and MCP** from your research checklist with **ultra-efficient token consumption patterns** (OmniRoute, Headroom, Karpathy Guidelines, and Git worktree isolation).

---

## 1. System Checklist & Technology Audit

| Category              | Component / Tool                  | Role in $0 Stack          | Status & Integration Details                                                                             |
| --------------------- | --------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Model Gateway**     | **OmniRoute**                     | OpenAI-compatible gateway | Aggregates 90+ free endpoints (Gemini, Groq, Cerebras, OpenRouter) + token compression.                  |
| **Model Gateway**     | **Headroom / RTK**                | Context Compression Layer | Strips prompt bloat, comments, and whitespace by 15–95% before hitting rate-limited APIs.                |
| **Compute Fallback**  | **Kaggle / Colab GPU**            | Local/Tunnel LLM Host     | Runs `Qwen 2.5 Coder 32B` / `DeepSeek R1 Distill` over Cloudflare/Pinggy for uncapped runs.              |
| **Agent Core**        | **Google Antigravity & OpenCode** | Primary Agent Harnesses   | Antigravity for orchestrator/subagents; OpenCode for fast headless TDD execution.                        |
| **Agent CLI**         | **Claude Code Setup**             | Alternative Agent CLI     | Drop-in terminal runner pointed to OmniRoute's free local endpoint (`http://localhost:8080/v1`).         |
| **MCP**               | **Sequential Thinking MCP**       | In-Context Reasoning      | stdio server forcing models to break multi-hop designs into structured reasoning steps.                  |
| **MCP**               | **GitHub MCP**                    | Repo & PR Operations      | Semantic code search, automated PR creation, and issue triage without paid add-ons.                      |
| **MCP**               | **Notion MCP**                    | Project/Task Sync         | Syncs PRDs, design docs, and ticket backlogs directly with your Notion workspace.                        |
| **MCP**               | **Antimetal MCP**                 | Root Cause Analysis       | Remote endpoint (`mcp.antimetal.com`) for debugging telemetry, logs, and trace analysis.                 |
| **Skills**            | **Karpathy Skills**               | Behavioral Constraints    | Enforces: _Think Before Coding_, _Simplicity First_, _Surgical Changes_, and _Goal-Driven Verification_. |
| **Skills**            | **Ponytail (YAGNI)**              | Minimal-Diff Skill        | Prevents open-source models from writing speculative code or hallucinated helper abstractions.           |
| **Skills**            | **Task Observer**                 | Friction Logger           | Monitors execution runs in the background to log failures and summarize bottlenecks.                     |
| **Skills**            | **Agent Reach**                   | Zero-Cost Web Access      | Open-source CLI scaffolding (Jina Reader, yt-dlp, GitHub CLI, Reddit/X readers) without API fees.        |
| **Skills**            | **Code-Review**                   | Pre-Commit Static Gate    | Automated AST linting, syntax checking, and diff boundary verification.                                  |
| **Specialized Agent** | **Strix AI**                      | Autonomous SecOps         | Dockerized open-source penetration testing agent that produces verified security PoCs.                   |
| **UI & Prototyping**  | **Google Stitch & Lovable**       | UI Generation             | Stitch (via Google AI Studio) and Lovable for zero-budget frontend boilerplate generation.               |
| **Cloud Agent**       | **Google Jules**                  | Async Cloud Worker        | Offloads asynchronous GitHub issue resolving directly on Google's cloud runners.                         |
| **State & Memory**    | **working.md**                    | Ephemeral State           | Active scratchpad tracking current objectives, test errors, and hypotheses.                              |
| **State & Memory**    | **Claude Mem & Obsidian Brain**   | Persistent Knowledge      | Cross-session memory and local Markdown vault indexing architecture decisions.                           |
| **Notification**      | **ezsnippet Alarm**               | Audio Completion Alert    | Native shell hook emitting audible speech alerts upon agent success or failure.                          |

---

## 2. Multi-Tiered Routing Architecture

```
                          ┌────────────────────────────────────────────────────────┐
                          │                OmniRoute Local Gateway                 │
                          │                 (http://localhost:8080)                │
                          └───────────────────────────┬────────────────────────────┘
                                                      │
         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
         ▼                                            ▼                                            ▼
┌───────────────────────────────┐        ┌───────────────────────────────┐        ┌───────────────────────────────┐
│      Tier 1: Architect        │        │      Tier 2: Fast Coder       │        │     Tier 3: Free Cloud GPU    │
│  Google AI Studio API Key     │        │    Groq / Cerebras / Mistral  │        │   Kaggle / Colab Notebooks    │
│  • Gemini 2.5 Pro / Flash     │        │  • Llama 3.3 70B              │        │  • Qwen 2.5 Coder 32B         │
│  • 1M Context Window          │        │  • Ultra-low latency          │        │  • Ollama + Cloudflare Tunnel │
│  • Role: Spec & Subagents     │        │  • Role: TDD Fast-Loop        │        │  • Role: Uncapped Fallback    │
└───────────────────────────────┘        └───────────────────────────────┘        └───────────────────────────────┘

```

---

## 3. Core File Configurations

### A. MCP Configuration (`~/.config/antigravity/mcp_config.json` or `.agent/mcp_config.json`)

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "antimetal": {
      "type": "http",
      "url": "https://mcp.antimetal.com",
      "headers": {
        "Authorization": "Bearer ${ANTIMETAL_API_KEY}"
      }
    }
  }
}
```

---

### B. Global Behavioral Constraints (`AGENTS.md`)

Place this at the root of your repository:

```markdown
# AGENTS.md - Behavioral Invariants & Karpathy Guidelines

## 1. Think Before Coding

- Never assume missing requirements. If multiple architectural interpretations exist, list them in `working.md` and stop.
- Enforce YAGNI (Ponytail Rule): Zero speculative functions, zero unused abstractions, zero pre-emptive helper classes.

## 2. Surgical Modifications

- Touch only lines directly relevant to the active acceptance test.
- Do not refactor adjacent code, change unrelated comments, or reformat files.
- Match existing repository patterns strictly.

## 3. Verification & Deterministic Execution

- Always write or identify the failing test before editing source code.
- Maintain `working.md` after every atomic step.
- An issue is only complete when all local tests (`pytest`, `vitest`, `mypy`) pass with zero warnings.
```

---

### C. Active Ephemeral State Template (`working.md`)

```markdown
# Ephemeral Task Scratchpad

## Current Objective

- **Task**: [Brief description / Slug]
- **Target Invariant**: [Files/Interfaces that must not be broken]

## Execution Plan

- [ ] 1. Write failing test: `test_<feature>.py`
- [ ] 2. Implement minimal surgical patch
- [ ] 3. Run typecheck & static analysis (`mypy` / `tsc`)
- [ ] 4. Trigger audio alert & handoff

## Active Hypotheses & Test Failures
```

[Paste failing test trace or blocker notes here]

```

```

---

## 4. Automation Scripts

### A. Free-Tier Headless TDD Loop (`scripts/run-tdd-loop.sh`)

```bash
#!/usr/bin/env bash
# run-tdd-loop.sh: Autonomous test-fix loop using free-tier models + ezsnippet alert
set -e

TASK_NAME=$1
MAX_RETRIES=5
COUNT=0

if [ -z "$TASK_NAME" ]; then
    echo "Usage: ./scripts/run-tdd-loop.sh <task-name>"
    exit 1
fi

echo "==> [START] Running autonomous TDD loop for: $TASK_NAME"

while [ $COUNT -lt $MAX_RETRIES ]; do
    echo "--- Iteration $((COUNT+1)) / $MAX_RETRIES ---"

    # 1. Run local test suite
    if pytest -q 2>&1 | tee .test.log; then
        echo "==> Tests passed! Running typecheck..."
        mypy .

        # ezsnippet audio completion alert
        echo -e "\a"
        python3 -c "import os; os.system('spd-say \"Task completed successfully\" 2>/dev/null || paplay /usr/share/sounds/freedesktop/stereo/complete.oga 2>/dev/null || true')"
        echo "==> [SUCCESS] Task completed and verified."
        exit 0
    fi

    # 2. Extract failure summary
    tail -n 25 .test.log > .active_error.log

    # 3. Call Agent Runner via OmniRoute
    opencode run \
        --model "openai/groq/llama-3.3-70b-versatile" \
        --prompt "Fix the failures in .active_error.log adhering to AGENTS.md rules. Make minimal diffs."

    COUNT=$((COUNT+1))
done

# Error alert
echo -e "\a"
python3 -c "import os; os.system('spd-say \"Agent failed to resolve task\" 2>/dev/null || true')"
echo "==> [FAILED] Max retries reached. Requires manual inspection."
exit 1

```

---

### B. Free Kaggle/Colab Ollama GPU Tunnel (`scripts/kaggle_tunnel.py`)

Run this in a free Kaggle Notebook (with T4 or P100 GPU enabled) to expose a free `Qwen 2.5 Coder 32B` endpoint:

```python
import subprocess
import time
import os

# 1. Install Ollama and Pinggy tunnel
print("Installing Ollama & dependencies...")
os.system("curl -fsSL https://ollama.com/install.sh | sh")

# 2. Start Ollama server in the background
subprocess.Popen(["ollama", "serve"])
time.sleep(4)

# 3. Pull coding model
print("Pulling Qwen 2.5 Coder 32B...")
os.system("ollama pull qwen2.5-coder:32b-instruct-q4_K_M")

# 4. Start Pinggy public tunnel on port 11434
print("Starting Cloudflare/Pinggy tunnel...")
tunnel = subprocess.Popen(
    ["ssh", "-p", "443", "-R0:localhost:11434", "a.pinggy.io"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)

for line in tunnel.stdout:
    if "http://" in line or "https://" in line:
        print("YOUR FREE LLM ENDPOINT IS READY:")
        print(line.strip())

```

---

## 5. End-to-End Execution Workflow

```
[1. Spec Contract] ──► [2. Worktree Spawn] ──► [3. Micro-TDD Loop] ──► [4. Sec & Review Gate]
  • Gemini 2.5 Flash     • git worktree add      • Groq / Codestral       • Strix AI PoC Scan
  • Notion / GitHub MCP  • working.md init       • Ponytail / Karpathy    • Local py/vitest check
  • Single-Pass Spec     • Isolated Branch       • run-tdd-loop.sh        • ezsnippet Audio Alert

```

1. **Contract Specification**: Run a single-pass Gemini 2.5 Flash prompt (Tier 1) via OmniRoute to generate the target invariants, behavioral diff, and acceptance test signatures into `specs/<slug>.md`. Sync the issue using GitHub/Notion MCPs.
2. **Worktree Isolation**: Create an isolated branch and worktree (`git worktree add ../wt-<slug> brief/<slug>`) and populate the initial `working.md`.
3. **Micro-TDD Loop**: Execute `scripts/run-tdd-loop.sh` using Groq / Codestral (Tier 2). The agent applies the Karpathy/Ponytail principles, writing only the code necessary to turn tests green.
4. **Security & Handoff**: Run local static analysis (`mypy`, `eslint`) and trigger **Strix AI** for vulnerability checks. On passing, the **ezsnippet** audio alert rings, `working.md` updates to `ready-for-review`, and a PR is opened via GitHub MCP.
