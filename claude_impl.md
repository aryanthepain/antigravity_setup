# A Free, Antigravity-Based Coding Workflow

Built from your checklist, your two linked repos (one accessible, one not), and current research as of August 2026. Everything recommended here is free or has a genuinely usable free tier — no paid add-ons required anywhere in this setup.

## What I could (and couldn't) see

`github.com/aryanthepain/handoff_repo` returns a 404 from here. GitHub gives that same response for private repos and for typos, so I can't tell which — but given you said "I use this repo at work," it's almost certainly private. I couldn't see your DayPilot-based task manager or your skills/agents folder as a result. Everything below is built generically; paste the relevant files (especially the skills folder and however you structure `working.md`) and I'll tailor this to match your actual setup instead of approximating it.

`multica-ai/andrej-karpathy-skills` _was_ accessible — that's covered in detail below, it's a genuinely good find.

---

## TL;DR verdict on your list

| Item                                            | Verdict                         | Why                                                                                                                                                                           |
| ----------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google Antigravity**                          | ✅ Core, keep it                | Most generous free agentic IDE available right now — multi-model, no card required, MCP support, native parallel subagents                                                    |
| **OpenCode**                                    | ✅ Add it                       | Free, open-source, terminal-native, 75+ model providers — your overflow tool for when Antigravity's quota runs thin                                                           |
| **OmniRoute**                                   | ✅ Add it                       | Free local gateway that auto-fails-over across dozens of free model tiers — the piece that makes "$0 budget" actually painless                                                |
| **Headroom**                                    | ✅ Add it                       | Free context-compression proxy, cuts tokens sent to the model by 60–95% — makes every free quota last far longer                                                              |
| **Karpathy skills repo**                        | ✅ Add it                       | One CLAUDE.md file encoding four disciplines that directly fix the sloppiest LLM coding habits                                                                                |
| **"ponytail"**                                  | ✅ Add it — this is a real tool | Not a typo. An anti-overengineering skill/plugin, works natively with Antigravity                                                                                             |
| **GitHub MCP**                                  | ✅ Add it                       | Official remote server, one click from Antigravity's built-in MCP Store                                                                                                       |
| **Sequential Thinking MCP**                     | ✅ Add it                       | Also built into Antigravity's MCP Store — structured step-by-step planning                                                                                                    |
| **Subagent/orchestrator pattern**               | ✅ Core practice                | Native to Antigravity (Agent Teams), Claude Code, and OpenCode — this is _how_ you parallelize work                                                                           |
| **Code review skill**                           | ✅ Build one                    | A narrow, scoped review subagent; optionally pair with CodeRabbit (free for public repos)                                                                                     |
| **claude-mem** _or_ **Obsidian "second brain"** | 🟡 Pick one                     | Both solve session-continuity — claude-mem is zero-effort auto-capture, Obsidian is the fuller notes-based system                                                             |
| **Jules**                                       | 🟡 Situational                  | Free async agent, 15 tasks/day — good for offloading small, well-defined chores off your interactive quota                                                                    |
| **Notion MCP**                                  | 🟡 Situational                  | Only worth it if you actually keep specs/tasks in Notion                                                                                                                      |
| **Google Stitch**                               | 🟡 Situational                  | Free UI-to-code tool — useful only if you do frontend/design work                                                                                                             |
| **Strix (attack agent)**                        | 🟡 Situational                  | Real, free, legitimate pentesting agent — run only against your own apps, once you have something deployed                                                                    |
| **Kaggle**                                      | ⚪ Optional                     | Free ~30 GPU-hrs/week, good for self-hosting/fine-tuning experiments — not part of the daily coding loop                                                                      |
| **Antimetal MCP**                               | ⚪ Optional, later              | Clever, but built for production observability (Datadog/Grafana/etc.) — overkill until you have deployed services to watch; confirm current pricing before assuming it's free |
| **Lovable**                                     | ⚪ Skip as a base               | Real tool, but ~5 credits/day free cap, and it writes the app _for_ you — fine for a throwaway prototype, wrong tool if the goal is becoming a better coder yourself          |
| **Claude Code**                                 | 🟡 Situational                  | Excellent for terminal work and subagents, but it isn't free itself — needs a subscription or API key, so it's a "later" addition, not part of the $0 core                    |
| **Task-completion "alarm"**                     | ⚪ Nice-to-have                 | Easy DIY via Claude Code hooks, or the newer built-in Routines/scheduling feature                                                                                             |
| **"agent reach"**                               | ❓ Unclear                      | Several unrelated products share this name (an agent-messaging API, a social-scraping MCP, an ad-bidding platform); nothing stood out as essential — skipping for now         |
| **`working.md`**                                | ❓ Can't resolve                | Reads like a personal working/scratch file from your own repo, not a public tool. Paste it and I'll fold it in                                                                |
| **Your repo's task manager & skills folder**    | ❓ Couldn't access              | See note above                                                                                                                                                                |

---

## Is Antigravity actually the right call?

Short answer: yes, keep building on it. Longer answer, because "free" AI IDEs change fast:

Antigravity launched in November 2025 alongside Gemini 3 and was substantially rebuilt at Google I/O 2026 into four surfaces sharing one agent harness: a standalone desktop app (**Antigravity 2.0**, with an Agent Teams panel for running subagent squads in parallel, each in its own sandbox), the original VS Code-based IDE, a Go-rewritten CLI (which replaced the older Gemini CLI on June 18, 2026), and an SDK for hosting your own agents. It stays free for individuals under a metered preview quota, with no credit card required — you get access to Gemini 3-series models plus a rotating set of Claude and open-weight models (exact versions shift regularly, so check in-app rather than trusting any specific version number, including any you see in this doc or elsewhere).

Two things matter most for your situation:

1. **MCP support is real and current.** Earlier coverage (roughly through May 2026) said Antigravity had no MCP support — that's now outdated. It has a built-in **MCP Store** for one-click installs (GitHub, Notion, Sequential Thinking, and Antimetal are all listed in it) plus a raw `mcp_config.json` for anything custom. One quirk worth knowing before you fight it for an hour: remote/HTTP MCP servers in Antigravity's config use a `serverUrl` field, not the `url` or `httpUrl` field most other MCP clients expect.
2. **The free tier is generous but genuinely rate-limited.** Multiple independent reviews report hitting limits within a few hours of continuous heavy multi-agent use. That's exactly why the "free-model engine room" section below matters — it's what keeps you working after Antigravity's own quota taps out for the day.

Where it doesn't win: for a single, deep, high-stakes refactor, Cursor and Claude Code both edge it out on raw single-agent coding benchmarks. Antigravity's edge is parallelism (multiple agents on different parts of a codebase at once) and price (free), not single-shot precision. That's a reasonable trade for someone building skill across many projects rather than shipping one production system.

**If you ever outgrow it or hit a wall**, the realistic free/cheap alternatives, roughly in order of fit for "learning to be a great coder":

- **OpenCode** — fully open source (MIT), terminal-native, model-agnostic (75+ providers including local Ollama). No IDE lock-in at all.
- **Cline** or **Continue.dev** — free VS Code/JetBrains extensions, bring-your-own-model, if you want to stay inside a familiar editor.
- **Trae** (ByteDance) or **Windsurf** — free-tier native AI IDEs, similar paradigm to Cursor, worth a look if you specifically want a polished IDE feel without Antigravity's multi-agent complexity.
- **Claude Code** — not free, but if you ever have even a small budget, it's worth the first $20 you spend; it currently leads most agentic coding benchmarks and its subagent system is the one most of the ecosystem (including OpenCode and ponytail) is designed to interoperate with.

Practical takeaway: **don't treat this as choosing one IDE.** The strongest free setups right now use Antigravity as the daily driver and OpenCode as a zero-cost terminal companion for the moments Antigravity is rate-limited or the wrong shape for the task (quick scripts, CI-style headless runs, working from a local model).

---

## The free-model engine room

This is the part that actually makes a $0 budget sustainable — routing around rate limits instead of running into them.

| Need                                          | Free option                                                                                                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary agentic coding                        | Antigravity's own free tier (Gemini 3-series + rotating Claude/open models)                                                                                      |
| Terminal / overflow agent                     | OpenCode, pointed at free-tier models                                                                                                                            |
| Strongest open-weight coding models right now | GLM-5.2, DeepSeek V4, Kimi K3 (or K2.6), Qwen3.6 — all have a free access route (OpenRouter's free-tier models, the vendor's own free chat app, or self-hosting) |
| One-off questions / quick chat                | A model's own free chat UI (e.g. chat.qwen.ai)                                                                                                                   |
| Heavier self-hosting or fine-tuning practice  | Kaggle's free weekly GPU quota + Ollama                                                                                                                          |
| Offloading small, well-defined chores         | Jules (see below) — keeps grunt work off your interactive quota entirely                                                                                         |

Two pieces of plumbing make this stack actually pleasant instead of a chore:

**OmniRoute** — a free, open-source (MIT) local AI gateway (`github.com/diegosouzapw/OmniRoute`). It runs on your machine at `localhost:20128/v1` as one OpenAI-compatible endpoint in front of 200+ model providers, dozens of them free. Point Antigravity, OpenCode, or any other tool's "custom model endpoint" setting at that local URL, and OmniRoute automatically falls back to the next provider in milliseconds when one hits its rate limit — instead of you noticing mid-task and manually swapping keys. Runs via `npm install -g omniroute`, Docker, or a desktop app.

**Headroom** — a free, open-source, local-first context-compression layer (search "Headroom AI context compression" — built by a Netflix engineer, actively maintained). It sits between your agent and the model provider and compresses tool outputs, logs, file contents, and long history by a reported 60–95% before they're sent, while keeping the originals retrievable if the agent needs the full text back. It supports Claude Code, Cursor, Codex, Aider, and OpenCode, either as a library, a local proxy (`headroom proxy`), or a one-command wrapper (`headroom wrap <agent>`). For your situation, the practical effect is simple: whatever free quota you're working with — Antigravity's, a free API key, OpenRouter's free tier — stretches noticeably further.

Together: OmniRoute keeps you from ever manually juggling keys, Headroom keeps each key's quota from evaporating on log dumps and repeated file reads. Neither is essential to start, but both pay for themselves (in time, not money) within the first week of heavy use.

---

## The workflow

Six-phase loop. Every tool above has a specific place in it — this is the actual answer to "define the best workflow possible," not just a tool list.

**1. Plan.** Before any code, write the spec: what's being built, what "done" looks like, what's explicitly out of scope. Use Antigravity's Manager view (or a Claude Code/OpenCode plan-only mode) to have the agent draft this back to you rather than writing it yourself blind. This is where the Karpathy skill (below) earns its keep — it forces the agent to state assumptions and surface tradeoffs instead of silently picking one and running.

**2. Break down & delegate.** Split the plan into scoped subtasks. Well-defined, low-risk ones (a version bump, a small bug fix, boilerplate tests) go to **Jules** asynchronously so they don't burn your interactive session. Anything that needs judgment stays with your main agent.

**3. Build.** Main agent executes, with the "laziness ladder" active (ponytail) and the surgical-changes discipline active (Karpathy skill) — meaning it should be reaching for the smallest correct diff, not the most impressive one. OmniRoute is silently choosing whichever free model has quota; Headroom is silently trimming what gets sent.

**4. Verify.** Goal-driven execution, not vibes: tests first, explicit success criteria, "make the test pass" instead of "fix the bug." Run your code-review subagent on the diff before you review it yourself. If the change touches anything you'll deploy, this is also the point to run Strix against your _own_ staging environment.

**5. Ship & record.** Commit, update whatever tracks your tasks (GitHub Issues via GitHub MCP is a solid free substitute if you don't want to rebuild your DayPilot manager elsewhere), and let claude-mem or your Obsidian vault capture what happened — this is the automated version of what your `handoff_repo` seems to do by hand.

**6. Reflect (weekly, not daily).** This is what the Task Observer skill is actually for — it's a meta-skill that watches your sessions for patterns (repeated corrections, workflows you keep redoing) and logs candidates for becoming a new reusable skill. Fifteen minutes once a week turns "I keep doing this the same annoying way" into an actual skill file instead of a recurring complaint.

---

## Skills to install

1. **`multica-ai/andrej-karpathy-skills`** (`github.com/multica-ai/andrej-karpathy-skills`) — a single CLAUDE.md distilling four disciplines from Andrej Karpathy's public notes on where LLM coding goes wrong: _think before coding_ (state assumptions, surface tradeoffs, ask instead of guessing), _simplicity first_ (minimum code, no speculative abstraction), _surgical changes_ (touch only what the task requires), and _goal-driven execution_ (turn "fix the bug" into "write a failing test, then make it pass"). Install as a Claude Code plugin (`/plugin marketplace add forrestchang/andrej-karpathy-skills`) or just drop the raw `CLAUDE.md` into a project. Also ships a Cursor rules file.
2. **ponytail** (`github.com/DietrichGebert/ponytail`) — real tool, MIT-licensed, genuinely popular. Injects a "laziest senior dev in the room" ruleset that makes the agent climb a ladder before writing any code at all: does this need to exist → can stdlib do it → can a native platform feature do it → can an existing dependency do it → one line → only then, the minimum implementation. Ships native support for Antigravity (`.agents/rules/ponytail.md`), Claude Code, OpenCode, Codex, Cursor, Windsurf, Cline, and Gemini-family tools. This and the Karpathy skill overlap in spirit — running both isn't redundant, they reinforce the same discipline from slightly different angles.
3. **Task Observer** — a meta-skill (search "Task Observer Claude Code skill," from the "one skill to rule them all" set) that watches multi-step sessions for patterns worth turning into new skills, and feeds a weekly review. This is the thing that makes your skill library grow from your actual work instead of from someone else's blog post.
4. **A code-review subagent** — build this yourself rather than installing it: a narrowly-scoped subagent whose only tools are read + comment, whose system prompt is literally "review this diff against the Karpathy/ponytail principles above, flag anything that violates them." Optionally run **CodeRabbit** alongside it (free for public repositories) as an automated second pass on pull requests.

---

## MCP servers worth wiring up

Start minimal — every extra tool you load into an agent's context measurably degrades its output on the others, so don't install everything in this doc on day one.

**Actually start with:**

- **GitHub MCP** — install from Antigravity's MCP Store, or manually if you hit Docker-related issues with the store version (a known snag): add GitHub's remote server directly at `https://api.githubcopilot.com/mcp/` with a personal access token (scopes: `repo`, `read:org`, `read:user`) in the config's `Authorization: Bearer` header.
- **Sequential Thinking MCP** — also in the Antigravity store. Gives the agent a structured tool for multi-step planning instead of reasoning invisibly in one shot.

**Add only when the need is real:**

- **Notion MCP** (in the store) — only if you actually keep tasks/specs in Notion.
- **Antimetal MCP** (`github.com/antimetal/skills`, connects to `mcp.antimetal.com`) — this one's a genuinely clever idea: it unifies 50+ observability integrations (Datadog, CloudWatch, Grafana, PagerDuty, etc.) into a handful of MCP tools so an agent can investigate a production incident without you context-switching between dashboards. It's overkill for a learning-stage solo project with nothing in production yet, and it requires signing up for an Antimetal account — confirm their current pricing for individuals before assuming it's free. Worth revisiting once you actually have something deployed and monitored.

**Skip for now:** "agent reach" — I found three or four unrelated products using variations of that name (an agent-to-human messaging API, an open-source social-media-scraping MCP, an ad-bidding platform for AI agents), and none of them looked like an obvious fit for a solo coding workflow. If you meant a specific one of these, tell me which and I'll dig deeper.

---

## Subagents & orchestration

This is a pattern, not a product — but it's the single highest-leverage thing on your checklist, so it's worth setting up deliberately rather than stumbling into it.

The idea: a main ("orchestrator") agent breaks a task into scoped pieces and hands each to a subagent that has its _own_ system prompt, its _own_ narrow tool access, and — importantly — a **fresh context**, not the parent's full history. Counterintuitively, giving a subagent the parent's full context tends to make it drift the same way the parent already drifted; a minimal, clean prompt is a feature, not a limitation.

Where to run this:

- **Antigravity 2.0's Agent Teams panel** — assign multiple agents to different parts of a codebase, each in its own sandbox, running in parallel. This is Antigravity's headline feature and the main reason it's worth using over a single-agent tool for anything nontrivial.
- **Claude Code / OpenCode subagents** — define narrow specialists with their own prompt and tool allowlist (a database-only agent, a docs-only agent, a test-only agent). The general-purpose subagent (full parent tools) is the default when the orchestrator decides to delegate; custom subagents are for anything where narrower is better, which is most things.

A reasonable starter set of subagents: **code-reviewer**, **test-writer**, **debugger** (root-cause only, doesn't fix), **docs-writer**, and — once you're doing this regularly — a **security-checker** backed by Strix.

---

## Security testing, responsibly

**Strix** (`github.com/usestrix/strix`) is real: a free, open-source (Apache 2.0), actively-maintained AI pentesting agent that dynamically runs your application and validates vulnerabilities with actual proof-of-concept exploits rather than just pattern-matching like a static scanner. It covers the OWASP Top 10 and beyond — injection, broken access control, SSRF, auth/session flaws, business-logic bugs. Install via `pipx install strix-agent`, bring your own LLM key (a free one works fine to start), and point it at a target with `strix --target <path-or-url>`.

The one rule that matters: **only ever point it at things you own or have explicit permission to test.** The tool itself enforces this norm in its own docs, and it's worth internalizing as a habit now — run it against your own local or staging deployments, never against anything you don't control.

---

## Memory & session continuity

Your `handoff_repo` pattern — capturing intent, preserving decisions, writing structured notes so the next session doesn't start from zero — is exactly the problem these two tools automate. Pick one rather than running both; they overlap.

- **claude-mem** (`github.com/thedotmack/claude-mem`, or the extended fork at `github.com/customable/claude-mem`) — a Claude Code plugin that auto-captures observations from every tool call, compresses them into session summaries, injects relevant context into new sessions via CLAUDE.md, and exposes semantic search over your project's history. Effectively zero manual effort once installed.
- **Obsidian as a "second brain"** — Obsidian itself is free, local-first, plain-markdown. Pair it with the community "Obsidian Claude Code MCP" plugin (by Ian Sinnott) to give an agent direct read/write access to a vault, so project context, decisions, and daily notes all live in one place the agent can query. More setup than claude-mem, but you get an actual browsable knowledge base out of it, not just agent memory — worth it if you already take notes or want to.

---

## Extra free Google tools worth knowing about

- **Jules** (`jules.google`) — Google's free async coding agent. Assign it a GitHub issue, it clones your repo into a cloud VM, writes a plan, makes the change, and opens a PR for you to review. Reported free tier: 15 tasks/day, 3 concurrent, running on a Gemini Flash-class model. This is genuinely useful for exactly the kind of small, tedious task that otherwise eats your interactive Antigravity quota for no good reason.
- **Google Stitch** (`stitch.withgoogle.com`) — free AI UI design tool: turns a prompt or rough sketch into a UI design plus exportable frontend code (HTML/Tailwind/React/Vue/Flutter/SwiftUI). Around 350 free generations a month in standard mode, with a smaller allowance in a higher-quality experimental mode. Connects directly to Jules for a design-to-PR handoff. Only relevant if you're doing frontend/UI work; skip it otherwise.

---

## Quality of life: alarms & routines

Your "ezsnippet" reference traces to a real thing — a developer on X who shared a script for what's usually called a **Claude Code "wake-up" script**: a scheduled job (cron, a GitHub Action, or a LaunchAgent) that pings Claude Code every few hours to keep its usage window pre-warmed, so you're less likely to hit a session limit mid-task. Several open implementations of this exist (search "claude code wake up" on GitHub) if that's what you meant.

If instead you meant "notify me when a long agent run finishes" — that's a different, also-common pattern: Claude Code supports **hooks** that fire on events like session-stop, which you can wire to a simple shell command (`afplay` on macOS, `notify-send` on Linux) to play a sound or pop a notification. There's also a newer built-in **Routines** feature for scheduling agent runs on a timer or trigger, which may cover both use cases natively depending on your Claude Code version — worth checking directly in-app since this is a recent addition.

---

## Open questions for you

- Can you paste (or re-share access to) the **skills/agents folder** from your repo? That's the single highest-value thing I'm missing — it would let me map this doc onto your actual existing skills instead of proposing generic replacements.
- What does your **DayPilot task manager** actually track, and how do your agents read/write to it? If it's something a GitHub-Issues-plus-MCP setup could reasonably replicate, I can sketch that out.
- What's in **`working.md`**? My best guess is it's a per-session scratch/working-memory file distinct from your more permanent handoff docs — but I'd rather confirm than assume.

---

## Suggested install order — week one

1. Antigravity (if not already running) → wire up GitHub MCP + Sequential Thinking MCP from the built-in store.
2. Drop in the Karpathy CLAUDE.md and ponytail — five minutes, immediate effect on every session after.
3. Install OpenCode as your terminal companion; get one free model (OpenRouter free tier is the easiest starting point) working end to end.
4. Add OmniRoute once you've felt Antigravity's rate limit at least once — you'll want it by day two or three anyway.
5. Add Headroom once a single session has felt expensive/slow from re-reading large files or logs.
6. Pick claude-mem _or_ Obsidian — don't set up both in the same week.
7. Everything else (Jules, Stitch, Strix, Antimetal, Task Observer) — add one at a time, only when a specific task actually calls for it.

---

## Sources checked

- Antigravity: antigravity.google/docs/mcp, antigravity.google/docs/cli/mcp, and current 2026 reviews (petronellatech.com, aitrendtool.com, ortemtech.com, agentdeals.dev)
- MCP setup specifics: composio.dev, glama.ai (GitHub MCP install guide), Google Cloud Community (Medium)
- Free/open-weight model landscape: morphllm.com, mindstudio.ai, felloai.com, howaiworks.ai, hypereal.cloud
- OmniRoute: github.com/diegosouzapw/OmniRoute, devtoollab.com, rohitraj.tech
- Headroom: ai.plainenglish.io, explainx.ai, ai-engineering-trend (Medium)
- ponytail: github.com/DietrichGebert/ponytail, dev.to (yashddesai), martianlee.github.io
- Karpathy skills: github.com/multica-ai/andrej-karpathy-skills (fetched directly)
- Antimetal: github.com/antimetal/skills, antimetal.com/resources/blog
- Strix: github.com/usestrix/strix, helpnetsecurity.com
- claude-mem: github.com/thedotmack/claude-mem, github.com/customable/claude-mem
- Obsidian second brain: dev.to (mibii), nxcode.io, glama.ai (Obsidian Claude Code MCP)
- Task Observer: claudecodehq.com/playbooks/task-observer, claudemarketplaces.com
- Jules / Stitch / Google AI tools: github.com/Moh4696/list-of-free-google-ai-tools, moda.app, manofmany.com
- OpenCode: opencode.ai, github.com/sst/opencode, developersdigest.tech
- Kaggle: huggingface.co (Kaggle for Deep Learning and LLM Workflows), logicity.in
- Lovable: nocode.mba, axonbuild.com
- Claude Code MCP/subagent patterns: code.claude.com/docs/en/mcp, systemprompt.io, ayautomate.com
