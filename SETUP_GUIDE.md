# 🌌 Antigravity 2026: Zero-Budget Autonomous AI Engineering System
## Complete Replication & Setup Guide

> **Philosophy**: A production-grade, zero-dollar ($0/month) autonomous AI software engineering system powered by **Spec-Driven Development (SDD)**, **Context Engineering (CCR)**, **Git Worktree Swarms**, **Free Model Routing**, and **Strict Deterministic Verification**.

---

## 📑 Table of Contents
1. [Prerequisites & Global Directory Structure](#1-prerequisites--global-directory-structure)
2. [API Keys & Free Tier Acquisition](#2-api-keys--free-tier-acquisition)
3. [Global Behavioral Invariants & Rules](#3-global-behavioral-invariants--rules)
4. [OmniRoute Local Proxy Gateway Configuration](#4-omniroute-local-proxy-gateway-configuration)
5. [Model Routing Configuration](#5-model-routing-configuration)
6. [Global MCP Servers & Tool Synchronization](#6-global-mcp-servers--tool-synchronization)
7. [Deterministic Verification & Safety Scripts](#7-deterministic-verification--safety-scripts)
8. [Interactive Docs & Control Center App](#8-interactive-docs--control-center-app)
9. [Troubleshooting & Verification Checklist](#9-troubleshooting--verification-checklist)

---

## 1. Prerequisites & Global Directory Structure

### Required Software
- **Node.js**: v18.0.0 or higher (`node -v`)
- **Git**: 2.40+ (`git --version`)
- **PowerShell 7+** / **pwsh** (Windows) or **Bash / Zsh** (Linux/macOS)
- **Python**: 3.10+ (for optional MCP utilities and local scripts)
- **Google Antigravity IDE / Antigravity CLI** (`agy`)

### Global Folder Paths
Antigravity loads global configurations, skills, and rules from the user profile directory:
- **Global Config Root**: `~/.gemini/config/` (`C:\Users\<USER>\.gemini\config\`)
- **Global MCP Servers**: `~/.gemini/antigravity-ide/mcp/` and `~/.gemini/antigravity-cli/mcp/`
- **Global Invariants**: `~/.gemini/config/rules/global_rules.md`

```
~/.gemini/
├── config/
│   ├── mcp_config.json          # 14 Global MCP Server definitions
│   ├── rules/
│   │   └── global_rules.md      # Behavioral invariants & Karpathy disciplines
│   ├── skills/                  # 53+ modular workflow skills
│   └── plugins/                 # Packaged plugins (Chrome DevTools, Science, Flutter)
└── antigravity-ide/
    └── mcp/                     # Pre-cached MCP schemas & instructions.md
```

---

## 2. API Keys & Free Tier Acquisition

Every provider below offers generous, permanent free tiers for zero-budget engineering:

| Provider | Purpose | Rate Limit / Quota | Free Key URL |
|:---|:---|:---|:---|
| **Google AI Studio** | 1M Context, Architect & Research | 1,500 requests/day | [aistudio.google.com](https://aistudio.google.com/) |
| **Groq Cloud** | Sub-second TDD & Fast Code Loops | 1,000 requests/day | [console.groq.com](https://console.groq.com/) |
| **Mistral AI** | Codestral Precision Code Generation | Free La Plateforme Tier | [console.mistral.ai](https://console.mistral.ai/) |
| **OpenRouter** | DeepSeek R1 & GPT-4o-mini Free Pool | Free community tier | [openrouter.ai](https://openrouter.ai/) |
| **GitHub Personal Token** | Git Operations, Worktrees & PRs | Standard GitHub Rate Limits | [github.com/settings/tokens](https://github.com/settings/tokens) |
| **Notion API** | Task Board & Card Synchronization | Free integration tier | [notion.so/my-integrations](https://www.notion.so/my-integrations) |

### Setting Global Environment Variables
Add your keys to your user environment:

#### Windows (PowerShell)
```powershell
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your_gemini_key', 'User')
[System.Environment]::SetEnvironmentVariable('GROQ_API_KEY', 'your_groq_key', 'User')
[System.Environment]::SetEnvironmentVariable('MISTRAL_API_KEY', 'your_mistral_key', 'User')
[System.Environment]::SetEnvironmentVariable('OPENROUTER_API_KEY', 'your_openrouter_key', 'User')
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'your_github_token', 'User')
[System.Environment]::SetEnvironmentVariable('NOTION_API_KEY', 'your_notion_key', 'User')
```

#### Linux / macOS (`~/.bashrc` or `~/.zshrc`)
```bash
export GEMINI_API_KEY="your_gemini_key"
export GROQ_API_KEY="your_groq_key"
export MISTRAL_API_KEY="your_mistral_key"
export OPENROUTER_API_KEY="your_openrouter_key"
export GITHUB_TOKEN="your_github_token"
export NOTION_API_KEY="your_notion_key"
```

---

## 3. Global Behavioral Invariants & Rules

Save this file to `~/.gemini/config/rules/global_rules.md`:

```markdown
# Global Antigravity Behavioral Invariants (2026)

## 1. Affirm Single-Task Delivery Contract
- 1 Task -> 1 Agent Session -> 1 PR. Keep every unit of work strictly bounded.
- Maintain explicit human checkpoints around planning approval (Gate 1) and PR review (Gate 2).

## 2. Ultra-Lean Orchestrator & Asymmetric Token Delegation
- Chief Orchestrator stays ultra-lean (<600 active tokens).
- Delegate research, massive codebase surveys, and TDD loops to specialized subagents.

## 3. Cline Plan / Act Split & Task Sizing
- Small (<20 lines): Direct Fast-Path edit.
- Medium (20-150 lines): Plan Mode -> Approval -> Execution -> Verify.
- Large (>150 lines): Spec Mode (/grill-me -> PRD -> Worktree Swarm -> Independent Review).

## 4. Karpathy Grounding Disciplines
- Think Before Coding: State assumptions, trade-offs, and invariants.
- Simplicity First: Write minimum surgical code. Zero speculative abstractions.
- Surgical Changes: Touch ONLY lines necessary for the active task.

## 5. The Ponytail Laziness Ladder (Anti-Bloat Gate)
1. Level 1 (YAGNI): Does this need to exist?
2. Level 2 (Stdlib): Does the standard library do it?
3. Level 3 (Platform/Browser): Is there a native browser or OS API?
4. Level 4 (Existing Dependency): Does an installed package do it?
5. Level 5 (One-Liner): Can it be written as a clean single expression?
6. Level 6 (Minimal Code): Only then write surgical implementation.

## 6. Deterministic Verification
- Never ask LLMs "does this look correct?".
- Run local deterministic test gates (`pwsh -File .\scripts\verify.ps1`, `pytest`, `vitest`, `mypy`, `tsc`).
```

---

## 4. OmniRoute Local Proxy Gateway Configuration

OmniRoute acts as a local proxy router on `http://localhost:20128`, pooling free API keys, automatically compressing token context with RTK/Headroom, and falling back seamlessly if any provider rate limits.

Create `~/.omniroute/config.yaml`:

```yaml
version: "2026.1"
server:
  host: "127.0.0.1"
  port: 20128
  cors: true

compression:
  strategy: "rtk-context"
  enabled: true
  max_context_tokens: 32000
  compression_ratio_target: 0.65

providers:
  gemini:
    type: "gemini"
    api_key: "${GEMINI_API_KEY}"
    models:
      - "gemini-2.5-flash"
      - "gemini-2.5-pro"
      - "gemini-2.5-flash-thinking"
    priority: 1
    daily_quota: 1500

  groq:
    type: "groq"
    api_key: "${GROQ_API_KEY}"
    models:
      - "llama-3.3-70b-versatile"
      - "llama-3.1-8b-instant"
    priority: 2
    daily_quota: 1000

  mistral:
    type: "mistral"
    api_key: "${MISTRAL_API_KEY}"
    models:
      - "codestral-latest"
      - "mistral-large-latest"
    priority: 3

  openrouter:
    type: "openrouter"
    api_key: "${OPENROUTER_API_KEY}"
    models:
      - "deepseek/deepseek-r1:free"
      - "openai/gpt-4o-mini"
    priority: 4

fallback_chain:
  - "gemini"
  - "groq"
  - "mistral"
  - "openrouter"
```

---

## 5. Model Routing Configuration

Configure the local model router in `config/model_router.yaml`:

```yaml
version: "2026.1"
router_name: "antigravity-zero-budget-mesh"

defaults:
  temperature: 0.2
  max_output_tokens: 8192
  context_window_limit: 32768

routing_rules:
  - task_type: "orchestration"
    model: "gemini-2.5-flash"
    max_active_tokens: 600
    description: "Ultra-lean planning, task decomposition, and human gates"

  - task_type: "fast_tdd"
    model: "groq/llama-3.3-70b-versatile"
    temperature: 0.1
    description: "Sub-second unit test generation and red-green loop fixes"

  - task_type: "precision_coding"
    model: "mistral/codestral-latest"
    temperature: 0.2
    description: "Multi-file refactoring, type checking, and AST modifications"

  - task_type: "deep_reasoning"
    model: "openrouter/deepseek/deepseek-r1:free"
    temperature: 0.6
    description: "Algorithmic design, complex mathematical proofs, edge case audits"

  - task_type: "adversarial_review"
    model: "gemini-2.5-pro"
    temperature: 0.1
    description: "Independent pre-merge architectural and security audit"
```

---

## 6. Global MCP Servers & Tool Synchronization

Configure `~/.gemini/config/mcp_config.json` with all 14 global MCP servers:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "d:\\projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "d:\\projects\\antigravity_setup\\data\\app.db"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

---

## 7. Deterministic Verification & Safety Scripts

### 1. Unified Verification Script (`scripts/verify.ps1`)
Runs all local deterministic gates (TypeScript types, lints, issue number collisions, and schema integrity) without consuming LLM tokens:

```powershell
pwsh -File .\scripts\verify.ps1
```

### 2. Issue Number Collision Reconciler (`scripts/Reconcile-IssueNumbers.ps1`)
Prevents ID collisions across parallel Git worktree branches:

```powershell
pwsh -File .\scripts\Reconcile-IssueNumbers.ps1 -Check
```

### 3. Audio & Voice Completion Chimes (`scripts/agent-alarm.ps1`)
Triggers native Windows system sound alerts upon task completion or human approval checkpoints:

```powershell
pwsh -File .\scripts\agent-alarm.ps1 -Type Success -SoundOnly
```

### 4. Asymmetric Subagent Runner (`scripts/subagent.js` & `Invoke-Subagent.ps1`)
Delegates token-heavy research, code generation, adversarial reviews, and log compression to submodels:

```powershell
# Research / multi-file inspection off-context:
node .\scripts\subagent.js --task research --query "Explain auth logic" --files "src/auth.ts,src/server.ts"

# Surgical code generation:
node .\scripts\subagent.js --task code --prompt "Write a debounce utility" --file "src/utils.ts"

# Pre-PR adversarial code review:
node .\scripts\subagent.js --task review --diff

# Long log compression:
node .\scripts\subagent.js --task compress --file "test.log"
```

---

## 8. Interactive Docs & Control Center App

The repository includes a modern **React + Vite + TailwindCSS** web application inside `docs/` ready for instant local execution or **GitHub Pages** static deployment.

### Running Locally
```bash
cd docs
npm install
npm run dev
```

### Building for GitHub Pages
```bash
cd docs
npm run build
```
The output is generated into standard static assets with relative pathing (`./`), ready to serve directly on GitHub Pages.

---

## 9. Troubleshooting & Verification Checklist

- [ ] Run `pwsh -File .\scripts\verify.ps1` -> Verify Exit Code 0.
- [ ] Check `~/.gemini/config/mcp_config.json` formatting.
- [ ] Confirm all environment variables (`GEMINI_API_KEY`, `GROQ_API_KEY`, etc.) are populated.
- [ ] Test OmniRoute proxy gateway at `http://127.0.0.1:20128/health`.
- [ ] Verify `docs/` Vite build completes cleanly with `npm run build`.
