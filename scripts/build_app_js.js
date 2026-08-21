const fs = require('fs');
const path = require('path');

const mcpRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/mcp_data.json'), 'utf8'));

// Augment MCP data with server descriptions, transport types, and remote servers
const serverMetadata = {
  'sequential-thinking': {
    type: 'stdio',
    badge: 'In-Context Reasoning',
    command: 'npx -y @modelcontextprotocol/server-sequential-thinking',
    description: 'Forces models to decompose multi-hop reasoning, revise earlier assumptions, and branch dynamically through iterative thought steps.'
  },
  'filesystem': {
    type: 'stdio',
    badge: 'Sandboxed I/O',
    command: 'npx -y @modelcontextprotocol/server-filesystem D:\\projects',
    description: 'Sandboxed filesystem read, write, directory traversal, search, and file info inspection bounded to allowed workspace roots.'
  },
  'memory': {
    type: 'stdio',
    badge: 'Knowledge Graph',
    command: 'npx -y @modelcontextprotocol/server-memory',
    description: 'Persistent entity-relation knowledge graph for tracking long-term architectural patterns, project invariants, and system facts.'
  },
  'github': {
    type: 'stdio',
    badge: 'Git & PR Ops',
    command: 'npx -y @modelcontextprotocol/server-github',
    description: 'Automated GitHub operations: repository search, issue triage, branch creation, commit history, and pull request generation.'
  },
  'notion': {
    type: 'stdio',
    badge: 'Task Board Sync',
    command: 'npx -y @modelcontextprotocol/server-notion',
    description: 'Bidirectional sync between local Kanban tasks/briefs and your Notion workspace databases and pages.'
  },
  'playwright': {
    type: 'stdio',
    badge: 'Browser Automation',
    command: 'npx -y @modelcontextprotocol/server-playwright',
    description: 'Headless browser automation for live page navigation, DOM inspection, form interaction, network request auditing, and screenshot capture.'
  },
  'strix-security': {
    type: 'stdio',
    badge: 'Autonomous SecOps',
    command: 'strix mcp',
    description: 'Automated penetration testing and vulnerability scanning (BOLA, IDOR, SQLi, SSRF, XSS) with verifiable PoC generation.'
  },
  'lovable': {
    type: 'http',
    badge: 'UI Scaffolding',
    command: 'https://mcp.lovable.dev/?src=settings',
    description: 'Instant UI component scaffolding, layout generation, and React template boilerplate via Lovable OAuth.'
  },
  'notebooks': {
    type: 'proxy',
    badge: 'Jupyter & Notebooks',
    command: 'node mcp_proxy_bundle.js notebooks-antigravityide',
    description: 'Jupyter notebook manipulation: cell insertion, markdown documentation, code execution, and cell output extraction.'
  },
  'data-agent-kit': {
    type: 'proxy',
    badge: 'GCP Data & Context',
    command: 'node mcp_proxy_bundle.js dataAgentKit-antigravityide',
    description: 'Google Cloud data context inspection, connection discovery, and dataset template cataloging.'
  },
  'visualization': {
    type: 'proxy',
    badge: 'Interactive Charts',
    command: 'node mcp_proxy_bundle.js visualization-antigravityide',
    description: 'Data visualization engine rendering interactive bar charts, time-series line graphs, scatter plots, and summary metrics.'
  },
  'sqlite': {
    type: 'stdio',
    badge: 'Local SQL DB',
    command: 'npx -y @modelcontextprotocol/server-sqlite --db-path D:\\projects\\antigravity_setup\\data\\app.db',
    description: 'Zero-overhead local SQLite database for persistent table storage, SQL analytics, and local agent cache.'
  },
  'fetch': {
    type: 'stdio',
    badge: 'Markdown Web Reader',
    command: 'npx -y @modelcontextprotocol/server-fetch',
    description: 'Extracts web pages and documentation directly into lean, token-efficient Markdown without browser overhead.'
  },
  'brave-search': {
    type: 'stdio',
    badge: 'Web Search Engine',
    command: 'npx -y @modelcontextprotocol/server-brave-search',
    description: 'Real-time web search and technical reference indexing for finding up-to-date documentation and release notes.'
  }
};

const fullMcpServers = mcpRaw.map(s => {
  const meta = serverMetadata[s.name] || {
    type: 'stdio',
    badge: 'MCP Server',
    command: s.name,
    description: `MCP Server providing ${s.toolCount} tools.`
  };
  return {
    id: s.id,
    name: s.name,
    type: meta.type,
    badge: meta.badge,
    command: meta.command,
    description: meta.description,
    toolCount: s.toolCount,
    tools: s.tools
  };
});

// Add remote GCP servers
fullMcpServers.push({
  id: 'datacloud_spanner_remote',
  name: 'datacloud_spanner_remote',
  type: 'cloud',
  badge: 'Google Spanner',
  command: 'https://spanner.googleapis.com/mcp',
  description: 'Remote Google Cloud Spanner MCP server for database instance inspection, schema exploration, and querying.',
  toolCount: 4,
  tools: [
    { name: 'list_spanner_instances', description: 'Lists Spanner instances in the active Google Cloud project.', required: [], properties: {} },
    { name: 'list_spanner_databases', description: 'Lists databases within a Spanner instance.', required: ['instanceId'], properties: { instanceId: { type: 'string', description: 'Spanner instance ID' } } },
    { name: 'get_spanner_schema', description: 'Retrieves DDL schema for tables in a Spanner database.', required: ['instanceId', 'databaseId'], properties: { instanceId: { type: 'string' }, databaseId: { type: 'string' } } },
    { name: 'execute_spanner_sql', description: 'Executes a read-only SQL query against Spanner.', required: ['instanceId', 'databaseId', 'query'], properties: { query: { type: 'string', description: 'SQL Query' } } }
  ]
});

fullMcpServers.push({
  id: 'datacloud_knowledge_catalog_remote',
  name: 'datacloud_knowledge_catalog_remote',
  type: 'cloud',
  badge: 'Google Dataplex',
  command: 'https://dataplex.googleapis.com/mcp',
  description: 'Remote Dataplex & Data Catalog MCP server for discovering enterprise assets, data governance rules, and column lineage.',
  toolCount: 3,
  tools: [
    { name: 'search_data_assets', description: 'Searches Dataplex and Knowledge Catalog for datasets and tables.', required: ['query'], properties: { query: { type: 'string', description: 'Asset search query' } } },
    { name: 'get_asset_metadata', description: 'Retrieves governance tags and schema metadata for an asset.', required: ['assetId'], properties: { assetId: { type: 'string' } } },
    { name: 'get_data_lineage', description: 'Retrieves upstream and downstream data lineage links.', required: ['assetId'], properties: { assetId: { type: 'string' } } }
  ]
});

const SKILLS_DATA = [
  // Core Engineering & Rules
  {
    name: "global_rules",
    category: "core",
    badge: "Always On",
    trigger: "Always active in every session. Triggers on any coding, planning, or execution task.",
    description: "Enforces Affirm 1-Task 1-PR delivery contract, single-agent default, Ponytail ladder, Karpathy surgical edits, and Fleet loop 3-retry bounds.",
    command: "Always active (~/.gemini/config/rules/global_rules.md)",
    details: "1. Affirm Contract: 1 Task -> 1 Agent Session -> 1 PR.\n2. Single Agent Default: 1 agent for normal tasks; subagents only for parallelism/sandbox.\n3. Ponytail Ladder: YAGNI -> Stdlib -> Platform -> Dependency -> One-Liner -> Minimal Code.\n4. Karpathy Grounding: Think first, surgical edits, goal-driven tests.\n5. Deterministic Verification: verify.ps1 with max 3 retry attempts.\n6. Skill Authoring: Natural language trigger descriptions."
  },
  {
    name: "ponytail",
    category: "core",
    badge: "Anti-Bloat",
    trigger: "Trigger on mentions of: 'ponytail', 'anti-bloat', 'make it minimal', 'simplest implementation', 'avoid over-engineering', 'YAGNI', 'use standard library', 'don't add dependencies', or 'keep diff small'.",
    description: "Enforces the 6-level 'laziest senior developer' decision ladder to eliminate code bloat, unnecessary dependencies, and speculative abstractions before writing code.",
    command: "Rule / Skill",
    details: "Climbs 6 levels before writing code:\n- Level 1: Does this need to exist? (YAGNI)\n- Level 2: Does Python/JS standard library do it?\n- Level 3: Is there a native browser or platform feature?\n- Level 4: Is there an existing project package?\n- Level 5: Can it be a clean one-liner?\n- Level 6: Minimal surgical implementation."
  },
  {
    name: "karpathy-skills",
    category: "core",
    badge: "Behavioral",
    trigger: "Trigger on mentions of: 'karpathy', 'think before coding', 'simplicity first', 'surgical changes', 'surgical edits', 'keep diffs small', 'avoid churn', or 'goal-driven execution'.",
    description: "Encodes Andrej Karpathy's 4 core disciplines: Think before coding, Simplicity first, Surgical changes, and Goal-driven verification.",
    command: "Rule / Skill",
    details: "- Think Before Coding: State assumptions explicitly. Surface tradeoffs before editing. Stop and ask if ambiguous.\n- Simplicity First: Minimum code that solves the issue. No speculative configurability.\n- Surgical Changes: Touch ONLY lines necessary for the test. Never reformat adjacent code.\n- Goal-Driven Execution: Transform tasks into automated tests."
  },
  {
    name: "code-review",
    category: "core",
    badge: "Static Review",
    trigger: "Trigger on mentions of: 'review this diff', 'code review', 'check for regressions', 'review PR', 'audit code changes', or 'look for code bloat'.",
    description: "Adversarial code review pass verifying compliance with Ponytail simplicity, Karpathy surgical constraints, and clean diffs.",
    command: "/code-review",
    details: "Performs AST and line-by-line review of git diffs, checking for:\n- Orphaned imports or unreferenced variables\n- Speculative abstractions or wrapper bloat\n- Accidental formatting churn\n- Missing edge-case test coverage"
  },
  {
    name: "task-observer",
    category: "core",
    badge: "Meta-Learning",
    trigger: "Trigger on mentions of: 'task observer', 'learn from this', '/learn', 'remember this', 'update the skill with this', 'don't do this again', 'save this as a rule', or 'observe and learn'.",
    description: "Meta-skill that continuously monitors session interactions, captures user corrections and critiques, and surgically evolves global rules and reusable skills.",
    command: "Skill / /learn",
    details: "1. Monitors conversation stream for human corrections ('don't do that', 'prefer X over Y').\n2. Distills feedback into permanent invariants (Trigger -> Mandatory Action -> Forbidden Anti-Pattern).\n3. Updates ~/.gemini/config/rules/global_rules.md, project CONSTITUTION.md, or target SKILL.md.\n4. Appends structured log to learning/instincts.md."
  },
  {
    name: "subagent-orchestrator",
    category: "core",
    badge: "Orchestration",
    trigger: "Trigger on mentions of: 'spawn subagents', 'run in parallel', 'split task into workers', 'parallelize this', or 'orchestrate squad'.",
    description: "Decomposes complex epics into parallel subagents running in isolated physical directories.",
    command: "/subagent-orchestrator",
    details: "Spawns scoped subagents with fresh contexts and narrow toolsets. Never run parallel agents on a dirty single branch."
  },
  {
    name: "superpowers",
    category: "core",
    badge: "Agent Harness",
    trigger: "Trigger on mentions of: 'superpowers', 'obra superpowers', 'agent skill chaining', 'cognitive harness', or 'advanced agent patterns'.",
    description: "Advanced agentic behavioral patterns, composable skill chains, and defensive verification harnesses from the obra/superpowers methodology.",
    command: "Skill",
    details: "1. Context Grounding: Never act on assumptions — inspect first.\n2. Defensive Verification: Every state mutation must have an observable proof of success.\n3. Composable Chains: Connect single-purpose skills into unified pipelines."
  },

  // Workflow & Planning
  {
    name: "grill-me",
    category: "workflow",
    badge: "Specification",
    trigger: "Trigger on mentions of: 'grill me', 'stress-test this plan', 'clarify requirements', 'interview me on this design', 'ask me questions about this feature', or 'refine the brief'.",
    description: "Relentless Socratic interview walking down the decision tree one-by-one with recommended answers before code is touched.",
    command: "/grill-me",
    details: "Walks down each branch of the design tree, resolving dependencies between decisions one-by-one. Captured decisions are written to brief/grilling outcomes for downstream PRD authoring."
  },
  {
    name: "write-a-brief",
    category: "workflow",
    badge: "Scoping",
    trigger: "Trigger on mentions of: 'write a brief', 'new brief', 'scope this work', 'kickoff memo', 'create scoping document', or 'start weekly phase'.",
    description: "Generates structured first-person scoping memos in briefs/<N>-<slug>.md with frontmatter handoff contracts.",
    command: "Skill / Workflow",
    details: "Asks 3-5 focused questions, creates brief frontmatter (slug, title, stage, branch, prd), and sets initial stage to 'new'."
  },
  {
    name: "write-a-prd",
    category: "workflow",
    badge: "PRD",
    trigger: "Trigger on mentions of: 'write a prd', 'generate prd', 'create product requirements', 'formalize spec', or 'turn brief into prd'.",
    description: "Authors comprehensive PRDs in prd/<slug>.md with assumptions, problem statements, extensive user stories, and testing decisions.",
    command: "Skill / Workflow",
    details: "Follows grilling outcomes to draft assumptions, solution architecture, deep module interfaces, and testing decisions."
  },
  {
    name: "critique",
    category: "workflow",
    badge: "Review",
    trigger: "Trigger on mentions of: 'critique this prd', 'find gaps in prd', 'review spec', 'stress test requirements', or 'judge prd'.",
    description: "Acts as an LLM-as-a-judge on freshly written PRDs to identify logical gaps, missing edge cases, and architectural risks.",
    command: "Skill / Workflow",
    details: "Emits a structured gaps file that can be reviewed and applied back to the PRD."
  },
  {
    name: "prd-to-issues",
    category: "workflow",
    badge: "Issue Breakdown",
    trigger: "Trigger on mentions of: 'break prd into issues', 'create issues from prd', 'generate atomic tasks', or 'split spec into tickets'.",
    description: "Transforms PRD user stories into atomic markdown issues in issues/NNN-<slug>.md with AFK/HITL classification.",
    command: "Skill / Workflow",
    details: "Numbers issues sequentially and writes acceptance criteria, target test commands, and dependency blocks."
  },
  {
    name: "planner-tasks",
    category: "workflow",
    badge: "Task Board",
    trigger: "Trigger on mentions of: 'planner tasks', 'task board sync', 'manage sprint tasks', 'triage backlog', or 'move card to in-review'.",
    description: "Folder-based task board workflow syncing tasks between local folders and Microsoft Planner/Notion.",
    command: "Skill / Workflow",
    details: "Manages cards flowing through waiting-to-pick-up -> hitl -> in-progress -> in-review -> done."
  },
  {
    name: "improve-codebase-architecture",
    category: "workflow",
    badge: "Architecture",
    trigger: "Trigger on mentions of: 'improve architecture', 'deepen shallow modules', 'refactor codebase', 'consolidate coupled modules', or 'make codebase ai navigable'.",
    description: "Explores a codebase to find opportunities for architectural improvement and deepens shallow modules.",
    command: "Skill / Workflow",
    details: "Identifies shallow wrapper classes, redundant abstraction layers, and tight couplings to create deeper, testable interfaces."
  },

  // Testing & Verification
  {
    name: "fleet-loop",
    category: "testing",
    badge: "Adaptive Loop",
    trigger: "Trigger on mentions of: 'fleet loop', 'run verification loop', 'fix until passing', 'bounded fix loop', 'auto test loop', 'red green loop', 'iterate on test errors', or 'verify and fix'.",
    description: "Bounded 4-stage adaptive verification ladder (Static/Types -> Targeted Tests -> Full Suite -> AST Diff) with 3-retry circuit breaker.",
    command: "/fleet-loop",
    details: "1. Red: Run targeted failing test.\n2. Green: Apply minimal surgical patch.\n3. Verify: tsc/mypy -> targeted pytest/vitest -> full regression suite.\n4. Circuit Breaker: Max 3 retry attempts. If attempt 3 fails, stops and escalates to human."
  },
  {
    name: "tdd",
    category: "testing",
    badge: "TDD",
    trigger: "Trigger on mentions of: 'tdd', 'test driven development', 'red green refactor', 'write tests first', or 'make tests pass'.",
    description: "Enforces Red -> Green -> Refactor cycle for both Python backend and TypeScript/React frontend.",
    command: "/tdd",
    details: "Forces writing or running the failing test first, implementing the minimal code to pass, and refactoring cleanly."
  },
  {
    name: "verify.ps1",
    category: "testing",
    badge: "Deterministic Gate",
    trigger: "Trigger on mentions of: 'run verify script', 'run local test gate', 'check types and tests', 'deterministic verify', or 'check project health'.",
    description: "PowerShell script detecting repository type and executing static typing and test suites.",
    command: "pwsh -File ./scripts/verify.ps1 [-Quick]",
    details: "Runs mypy/tsc static analysis followed by pytest/npm test. Returns exit code 0 on success, 1 on failure."
  },

  // Security & Sandboxing
  {
    name: "security-sandbox-review",
    category: "security",
    badge: "Sandbox Pen-Test",
    trigger: "Trigger on mentions of: 'security review', 'strix', 'audit security', 'pen-test this', 'vulnerability scan', 'check for vulnerabilities', 'sandbox security test', 'OWASP check', 'BOLA check', or 'test auth security'.",
    description: "Autonomous vulnerability assessment using SAST tooling and Strix AI penetration testing agent in an isolated worktree.",
    command: "/security-review",
    details: "Spins up an isolated git worktree, runs SAST scans, executes Strix AI dynamic exploit simulations, validates PoCs, and verifies surgical patches."
  },
  {
    name: "accidental-data-loss-prevention",
    category: "security",
    badge: "Safety Gate",
    trigger: "Trigger on mentions of: 'drop table', 'truncate', 'delete from without where', 'gsutil rm', 'gcloud projects delete', or destructive cloud operations.",
    description: "Stop-and-verify safety guardrail requiring explicit human confirmation before destructive data operations.",
    command: "Always active rule",
    details: "Blocks destructive SQL, cloud storage deletion, and infrastructure destruction without explicit confirmation."
  },
  {
    name: "gcs-security-assessment",
    category: "security",
    badge: "Cloud Security",
    trigger: "Trigger on mentions of: 'audit gcs bucket', 'check cloud storage security', 'gcs SAIF compliance', or 'bucket public access check'.",
    description: "Assesses security posture, public access prevention, and SAIF compliance for Cloud Storage buckets.",
    command: "Skill",
    details: "Scans GCS bucket IAM policies, public access settings, encryption configurations, and lifecycle rules."
  },

  // Task & Notion Sync
  {
    name: "notion-sync",
    category: "integration",
    badge: "Notion Kanban",
    trigger: "Trigger on mentions of: 'notion sync', 'sync with notion', 'update task board', 'pull tasks from notion', 'move notion card', 'update notion status', 'sync to-do list', or 'sync sprint backlog'.",
    description: "Bidirectional synchronization between local tasks/briefs/WORKING.md and your Notion Task Board Kanban via Notion MCP.",
    command: "Skill / Notion MCP",
    details: "Maps Notion Kanban stages: Backlog -> Ready -> In Progress -> In Review -> Done. Terminal state for agent is 'In Review'; only human merges and moves to 'Done'."
  },
  {
    name: "create-task",
    category: "integration",
    badge: "Task Capture",
    trigger: "Trigger on mentions of: 'create task', 'add to-do', 'log ticket', 'capture action item', or 'add task to board'.",
    description: "Creates and categorizes a new task card with sizing (S/M/L) and mode (AFK/HITL).",
    command: "Skill",
    details: "Writes a structured task card with acceptance criteria and links to the Notion database."
  },
  {
    name: "agent-alarm",
    category: "integration",
    badge: "Notifications",
    trigger: "Trigger on mentions of: 'notify me when done', 'set timer', 'alert when finished', 'remind me in 10 minutes', or 'schedule check'.",
    description: "Sets one-shot timer or recurring cron notifications via /schedule tool.",
    command: "/schedule",
    details: "Eliminates token-wasting polling loops by scheduling reactive notifications on task completion."
  },
  {
    name: "omniroute-config",
    category: "integration",
    badge: "Model Router",
    trigger: "Trigger on mentions of: 'omniroute', 'configure model router', 'setup free models', 'switch model fallback', or 'localhost:20128'.",
    description: "Manages OmniRoute local proxy configurations for seamless free-tier model cascading.",
    command: "Skill / Config",
    details: "Routes traffic to Gemini Flash, Groq, Mistral Codestral, and DeepSeek via OpenAI-compatible endpoints."
  },

  // Project Scaffolding
  {
    name: "init-project",
    category: "scaffolding",
    badge: "Scaffolder",
    trigger: "Trigger on mentions of: 'init project', 'initialize project', 'scaffold repo', 'setup new repo', 'bootstrap project', 'setup antigravity in this repo', or 'add agents.md and constitution'.",
    description: "One-command bootstrapping for AGENTS.md, CONSTITUTION.md, WORKING.md, .agents/rules, and git pre-commit verification hooks.",
    command: "pwsh -File ./scripts/init-project.ps1",
    details: "Scaffolds complete directory structure, links global rules, copies verification scripts, and configures core.hooksPath = .githooks."
  },
  {
    name: "commit-and-push",
    category: "scaffolding",
    badge: "Git Flow",
    trigger: "Trigger on mentions of: 'commit changes', 'push to branch', 'save work to git', 'commit and push', or 'ship it'.",
    description: "Groups changes into logically scoped, conventional commits and pushes safely with upstream configuration.",
    command: "Skill",
    details: "Never force pushes without explicit confirmation. Enforces conventional commit formatting."
  },
  {
    name: "agy-customizations",
    category: "scaffolding",
    badge: "Antigravity Custom",
    trigger: "Trigger on mentions of: 'antigravity customizations', 'create skill', 'create rule', 'plugin format', or 'mcp configuration syntax'.",
    description: "Authoritative reference for Antigravity skills, rules, plugins, and MCP schema definitions.",
    command: "Skill",
    details: "Guides writing SKILL.md, AGENTS.md, plugins, and MCP JSON schema definitions."
  },
  {
    name: "opencode-runner",
    category: "scaffolding",
    badge: "Headless TDD",
    trigger: "Trigger on mentions of: 'opencode', 'run opencode', 'headless tdd loop', 'terminal coding agent', or 'batch code runner'.",
    description: "Headless, fast terminal-based coding agent for executing rapid TDD test-and-fix loops, multi-file refactoring, and deterministic verification.",
    command: "opencode --model groq/llama-3.3-70b",
    details: "Executes ultra-fast headless test-fix loops and AST refactoring without UI overhead."
  },
  {
    name: "aider-pair",
    category: "scaffolding",
    badge: "Terminal Pair",
    trigger: "Trigger on mentions of: 'aider', 'run aider', 'pair program with aider', 'aider architect mode', or 'auto-commit coding'.",
    description: "Terminal AI pair programming harness supporting git worktrees, automatic conventional git commits, and architect/editor dual model setups.",
    command: "aider --model gemini/gemini-2.5-flash",
    details: "Automatically git-tracks every modification with structured conventional commit messages."
  },
  {
    name: "openhands-harness",
    category: "scaffolding",
    badge: "Autonomous Sandbox",
    trigger: "Trigger on mentions of: 'openhands', 'all-hands', 'run openhands', 'autonomous agent sandbox', or 'docker agent harness'.",
    description: "Open-source autonomous AI software development agent capable of executing complex multi-step engineering tasks inside Docker sandboxes.",
    command: "docker run ghcr.io/all-hands-ai/openhands",
    details: "Complete containerized sandbox where an agent plans, executes shell commands, inspects browser DOMs, and delivers PRs."
  },
  {
    name: "agent-reach",
    category: "scaffolding",
    badge: "Zero-Cost Scraping",
    trigger: "Trigger on mentions of: 'agent reach', 'jina reader', 'scrape url', 'read web page markdown', 'extract youtube transcript', 'yt-dlp', or 'fetch article without api'.",
    description: "Zero-cost web scraping, YouTube transcript extraction, and CLI intelligence using Jina Reader (r.jina.ai), yt-dlp, and GitHub CLI without paid API keys.",
    command: "curl https://r.jina.ai/<url>",
    details: "Prepend https://r.jina.ai/ to any URL to retrieve clean, token-efficient Markdown."
  },
  {
    name: "google-stitch",
    category: "scaffolding",
    badge: "UI Prototyping",
    trigger: "Trigger on mentions of: 'google stitch', 'stitch ui', 'scaffold frontend with stitch', 'lovable ui', or 'generate modern component mockup'.",
    description: "Rapid frontend UI layout generator and component prototyping tool using Google AI Studio Stitch and Lovable to scaffold production-ready interfaces.",
    command: "Skill / Stitch / Lovable",
    details: "Converts natural language briefs into responsive, themeable React/HTML components."
  },
  {
    name: "google-jules",
    category: "workflow",
    badge: "Cloud PR Agent",
    trigger: "Trigger on mentions of: 'google jules', 'jules agent', 'cloud pr generator', 'async github issue solver', or 'delegate issue to jules'.",
    description: "Google's asynchronous cloud development agent that automatically reads GitHub issues, clones repositories in Google Cloud VMs, and opens verified PRs.",
    command: "Cloud Agent / @google-jules",
    details: "Offloads background GitHub issue resolution and pull request generation directly onto Google's cloud runners."
  },
  {
    name: "kaggle-gpu-fallback",
    category: "workflow",
    badge: "Free Cloud GPU",
    trigger: "Trigger on mentions of: 'kaggle gpu', 'colab gpu fallback', 'qwen 32b tunnel', 'free gpu host', 'cloudflare tunnel llm', or 'pinggy ollama'.",
    description: "Configures and manages free cloud GPU runners on Kaggle or Google Colab (T4/P100 GPUs) hosting local models via Pinggy or Cloudflare Tunnels.",
    command: "ollama + pinggy tunnel",
    details: "Provides 30+ hours/week of free T4/P100 GPU compute on Kaggle/Colab running Qwen 2.5 Coder 32B or DeepSeek R1."
  },

  // Data & Google Cloud
  {
    name: "bigquery-sql",
    category: "cloud",
    badge: "SQL Tuning",
    trigger: "Trigger on mentions of: 'optimize sql', 'bigquery query tuning', 'reduce query scan cost', 'partition table', or 'cluster table'.",
    description: "BigQuery SQL query optimization, execution best practices, and performance tuning rules.",
    command: "Skill",
    details: "Optimizes query slot usage, prevents full-table scans with partition filters, and avoids SELECT *."
  },
  {
    name: "bigquery-ai-ml",
    category: "cloud",
    badge: "ML & GenAI",
    trigger: "Trigger on mentions of: 'bigquery ml', 'bqml forecasting', 'detect outliers in bigquery', or 'run gemini in sql'.",
    description: "BigQuery built-in machine learning and GenAI capabilities for in-database analytics.",
    command: "Skill",
    details: "Generates CREATE MODEL statements, ARIMA_PLUS time series forecasts, and ML.GENERATE_TEXT queries."
  },
  {
    name: "dataform-bigquery",
    category: "cloud",
    badge: "Dataform",
    trigger: "Trigger on mentions of: 'dataform', 'sqlx', 'dataform pipeline', 'bigquery transformation pipeline', or 'workflow_settings.yaml'.",
    description: "Generates clean, correct Dataform SQLX transformations, assertions, and source declarations.",
    command: "Skill",
    details: "Configures workflow_settings.yaml, creates incremental models, and writes automated data quality assertions."
  },
  {
    name: "dbt-bigquery",
    category: "cloud",
    badge: "dbt",
    trigger: "Trigger on mentions of: 'dbt model', 'dbt build', 'dbt bigquery', 'dbt test', or 'dbt_project.yml'.",
    description: "Expert guidance for creating and troubleshooting dbt projects and Jinja models on BigQuery.",
    command: "Skill",
    details: "Configures dbt_project.yml, writes schema.yml tests, and optimizes incremental materializations."
  },
  {
    name: "gcp-data-pipelines",
    category: "cloud",
    badge: "Orchestration",
    trigger: "Trigger on mentions of: 'design data pipeline', 'gcp etl architecture', 'choose pipeline tool', or 'ingest data to bigquery'.",
    description: "Primary entry point for architecting and orchestrating GCP data ingestion and transformation pipelines.",
    command: "Skill",
    details: "Guides selection between Beam/Dataflow, Spark/Dataproc, Dataform, and Composer DAGs."
  },
  {
    name: "gcp-spark",
    category: "cloud",
    badge: "Spark",
    trigger: "Trigger on mentions of: 'pyspark on gcp', 'dataproc serverless', 'spark iceberg', 'spark bigquery connector', or 'spark etl'.",
    description: "Develops and executes Spark ETL and ML code using BigLake Iceberg catalogs and BigQuery.",
    command: "Skill",
    details: "Configures Dataproc Serverless batches, optimizes shuffle partitions, and debugs Spark OOM errors."
  },
  {
    name: "gcp-dataflow",
    category: "cloud",
    badge: "Apache Beam",
    trigger: "Trigger on mentions of: 'apache beam', 'dataflow pipeline', 'dataflow flex template', 'streaming pipeline', or 'dataflow autoscaling'.",
    description: "Guides packaging, executing, and troubleshooting Apache Beam pipelines and Flex Templates.",
    command: "Skill",
    details: "Diagnoses streaming job backpressure, watermarks, autoscaling limits, and windowing triggers."
  },
  {
    name: "discovering-gcp-data-assets",
    category: "cloud",
    badge: "Data Discovery",
    trigger: "Trigger on mentions of: 'find dataset in gcp', 'inspect bigquery table schema', 'search spanner tables', or 'explore gcp data catalog'.",
    description: "Inspects metadata, schemas, and governance policies for Google Cloud data assets.",
    command: "Skill",
    details: "Retrieves table schemas, column descriptions, and partitioning information without expensive CLI queries."
  },

  // Web & Chrome DevTools
  {
    name: "chrome-devtools",
    category: "devtools",
    badge: "DevTools MCP",
    trigger: "Trigger on mentions of: 'inspect web page', 'chrome devtools', 'debug network request', 'evaluate javascript in browser', or 'take page screenshot'.",
    description: "Uses Chrome DevTools via MCP for live page inspection, console debugging, and network analysis.",
    command: "Skill / MCP",
    details: "Inspects live DOM, captures screenshots, monitors network payloads, and evaluates JS expressions."
  },
  {
    name: "a11y-debugging",
    category: "devtools",
    badge: "Accessibility",
    trigger: "Trigger on mentions of: 'accessibility audit', 'a11y test', 'check aria labels', 'contrast ratio check', or 'keyboard navigation audit'.",
    description: "Performs accessibility audits based on web.dev and WCAG 2.2 guidelines using DevTools.",
    command: "Skill",
    details: "Checks color contrast ratios, focus rings, screen reader landmarks, and touch target sizes."
  },
  {
    name: "debug-optimize-lcp",
    category: "devtools",
    badge: "Performance",
    trigger: "Trigger on mentions of: 'optimize lcp', 'page load too slow', 'core web vitals', 'largest contentful paint', or 'slow hero image'.",
    description: "Diagnoses and optimizes Largest Contentful Paint and rendering bottlenecks.",
    command: "Skill",
    details: "Identifies LCP element, resource load delays, render-blocking scripts, and image fetch priorities."
  },
  {
    name: "memory-leak-debugging",
    category: "devtools",
    badge: "Memory",
    trigger: "Trigger on mentions of: 'memory leak', 'high memory usage', 'analyze heap snapshot', 'oom error in node', or 'detached dom nodes'.",
    description: "Analyzes heap snapshots, retained DOM elements, and uncleaned event listeners.",
    command: "Skill",
    details: "Guides heap differential analysis, identifying detached DOM nodes and closure memory leaks."
  },
  {
    name: "modern-web-guidance",
    category: "devtools",
    badge: "Frontend Best Practices",
    trigger: "Trigger on mentions of: 'modern css', 'view transitions', 'container queries', ':has selector', 'native dialog', or 'popover api'.",
    description: "Authoritative reference for modern CSS (subgrid, :has, popovers) and client-side web APIs.",
    command: "Skill",
    details: "Prevents outdated CSS patterns; guides View Transitions, container queries, and native popover APIs."
  },
  {
    name: "chrome-extensions",
    category: "devtools",
    badge: "Extensions",
    trigger: "Trigger on mentions of: 'chrome extension', 'manifest v3', 'extension service worker', 'content script', 'extension popup', or 'publish extension'.",
    description: "Manifest V3 best practices, service workers, content scripts, and Web Store publishing guidance.",
    command: "Skill",
    details: "Configures manifest.json, declarativeNetRequest, side panels, and handles Chrome Web Store reviews."
  },

  // Flutter & Dart
  {
    name: "dart-run-static-analysis",
    category: "flutter",
    badge: "Dart Analysis",
    trigger: "Trigger on mentions of: 'dart analyze', 'dart fix', 'flutter analyze', 'resolve dart lints', or 'clean up dart warnings'.",
    description: "Executes static analysis to identify warnings and applies mechanical lint fixes.",
    command: "Skill",
    details: "Runs dart analyze and dart fix --apply to resolve lints before committing."
  },
  {
    name: "dart-add-unit-test",
    category: "flutter",
    badge: "Dart Tests",
    trigger: "Trigger on mentions of: 'write dart test', 'dart unit test', 'package:test', 'test dart class', or 'mock dart dependency'.",
    description: "Structures unit tests for functions, state models, and services.",
    command: "Skill",
    details: "Uses package:test and package:checks to create regression-free test suites."
  },
  {
    name: "flutter-add-widget-test",
    category: "flutter",
    badge: "Widget Testing",
    trigger: "Trigger on mentions of: 'flutter widget test', 'widgettester', 'test flutter ui', 'pump and settle', or 'verify widget renders'.",
    description: "Component-level testing verifying widget rendering, taps, scrolls, and text inputs.",
    command: "Skill",
    details: "Uses testWidgets, find.byType, and tester.pumpAndSettle to assert widget state."
  },
  {
    name: "flutter-fix-layout-issues",
    category: "flutter",
    badge: "Layout Fixes",
    trigger: "Trigger on mentions of: 'renderflex overflowed', 'unbounded height', 'flutter layout overflow', 'yellow and black stripe error', or 'viewport unbounded'.",
    description: "Fixes Flutter constraint layout errors, viewport exceptions, and overflow bugs.",
    command: "Skill",
    details: "Applies Flexible, Expanded, SingleChildScrollView, and LayoutBuilder to solve overflow issues."
  },
  {
    name: "flutter-build-responsive-layout",
    category: "flutter",
    badge: "Responsive UI",
    trigger: "Trigger on mentions of: 'responsive flutter', 'flutter tablet layout', 'adaptive ui flutter', 'layoutbuilder', or 'flutter screen size'.",
    description: "Architects adaptive Flutter UI using MediaQuery, LayoutBuilder, and breakpoint systems.",
    command: "Skill",
    details: "Implements clean multi-column layouts and adaptive scaffold navigation bars."
  },

  // Science & Bio
  {
    name: "alphafold-database-fetch-and-analyze",
    category: "science",
    badge: "AlphaFold",
    trigger: "Trigger on mentions of: 'alphafold', 'uniprot 3d structure', 'plddt score', 'predicted protein structure', or 'protein domain boundary'.",
    description: "Fetches and analyzes structural confidence (pLDDT) and domain boundaries from AlphaFold DB.",
    command: "Skill",
    details: "Retrieves mmCIF structures, calculates mean pLDDT per domain, and identifies disordered regions."
  },
  {
    name: "alphagenome-single-variant-analysis",
    category: "science",
    badge: "Genomics",
    trigger: "Trigger on mentions of: 'alphagenome', 'variant pathogenicity', 'non-coding variant effect', 'splicing disruption', or 'variant effect prediction'.",
    description: "AlphaGenome API integration for predicting non-coding variant functional impact.",
    command: "Skill",
    details: "Analyzes variants in chr:pos:ref>alt format across tissue-specific UBERON ontologies."
  },
  {
    name: "chembl-database",
    category: "science",
    badge: "Cheminformatics",
    trigger: "Trigger on mentions of: 'chembl', 'bioactive compound', 'ic50 value', 'ki affinity', 'drug target assay', or 'smiles search'.",
    description: "Queries the ChEMBL bioactivity database for target assays and approved compounds.",
    command: "Skill",
    details: "Performs substructure/similarity searches, fetches bioactivity records, and maps mechanism of action."
  },
  {
    name: "clinical-trials-database",
    category: "science",
    badge: "Clinical Trials",
    trigger: "Trigger on mentions of: 'clinical trials', 'search clinicaltrials.gov', 'nct id', 'trial inclusion criteria', or 'find recruiting trials'.",
    description: "Queries ClinicalTrials.gov API v2 for trial eligibility criteria and recruitment status.",
    command: "Skill",
    details: "Filters trials by phase, recruitment status, intervention name, and retrieves protocol details."
  },
  {
    name: "pdb-database",
    category: "science",
    badge: "Structural Bio",
    trigger: "Trigger on mentions of: 'pdb', 'protein data bank', 'macromolecular 3d structure', 'download pdb structure', or 'bound ligand structure'.",
    description: "Searches the Protein Data Bank (PDB) by sequence similarity, ligands, or resolution.",
    command: "Skill",
    details: "Retrieves crystallographic/cryo-EM metadata, bound ligands, and coordinates in mmCIF format."
  },
  {
    name: "pubchem-database",
    category: "science",
    badge: "Chemistry",
    trigger: "Trigger on mentions of: 'pubchem', 'chemical compound cid', 'smiles string', 'molecular weight', 'chemical safety sheet', or 'iupac name'.",
    description: "Queries PubChem database for compound safety data, 2D/3D structures, and synonyms.",
    command: "Skill",
    details: "Fetches physicochemical properties, molecular formulas, and related bioassays."
  },
  {
    name: "pubmed-database",
    category: "science",
    badge: "Literature",
    trigger: "Trigger on mentions of: 'pubmed search', 'biomedical literature', 'ncbi pubmed', 'pmc article', or 'find medical citations'.",
    description: "Queries NCBI PubMed and PMC for peer-reviewed medical and life sciences research.",
    command: "Skill",
    details: "Performs MeSH term searches, retrieves PMC open-access full text, and extracts citation metadata."
  }
];

const appJsContent = `// Antigravity 2026 Skills, MCP Servers & Architecture Data & Logic

const SKILLS_DATA = ${JSON.stringify(SKILLS_DATA, null, 2)};

const MCP_SERVERS_DATA = ${JSON.stringify(fullMcpServers, null, 2)};

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const viewSections = document.querySelectorAll('.view-section');
  let currentView = 'skillsView';

  // Global Search & Counts
  const globalSearch = document.getElementById('globalSearch');
  const itemCountBadge = document.getElementById('itemCountBadge');

  // Skill View Elements
  const skillsGrid = document.getElementById('skillsGrid');
  const skillCategoryPills = document.querySelectorAll('#skillCategoryPills .pill');
  const noSkillsResults = document.getElementById('noSkillsResults');
  let activeSkillCategory = 'all';
  let activeSkillQuery = '';

  // MCP View Elements
  const mcpGrid = document.getElementById('mcpGrid');
  const mcpCategoryPills = document.querySelectorAll('#mcpCategoryPills .pill');
  const noMcpResults = document.getElementById('noMcpResults');
  let activeMcpCategory = 'all';
  let activeMcpQuery = '';

  // Modal Elements
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalBody');

  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
  });

  // Tab Switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.getAttribute('data-view');
      
      viewSections.forEach(sec => sec.classList.remove('active'));
      document.getElementById(currentView).classList.add('active');
      
      updateBadgeCount();
      if (currentView === 'skillsView') renderSkills();
      if (currentView === 'mcpView') renderMcpServers();
    });
  });

  function updateBadgeCount() {
    if (currentView === 'skillsView') {
      itemCountBadge.textContent = \`\${SKILLS_DATA.length} Skills\`;
    } else if (currentView === 'mcpView') {
      const totalTools = MCP_SERVERS_DATA.reduce((acc, s) => acc + s.toolCount, 0);
      itemCountBadge.textContent = \`\${MCP_SERVERS_DATA.length} Servers (\${totalTools} Tools)\`;
    } else {
      itemCountBadge.textContent = 'Architecture';
    }
  }

  // ================= 1. RENDER SKILLS =================
  function renderSkills() {
    skillsGrid.innerHTML = '';
    const filtered = SKILLS_DATA.filter(skill => {
      const matchCategory = activeSkillCategory === 'all' || skill.category === activeSkillCategory;
      const q = activeSkillQuery.toLowerCase().trim();
      const matchQuery = !q || 
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.trigger.toLowerCase().includes(q) ||
        skill.command.toLowerCase().includes(q);
      
      return matchCategory && matchQuery;
    });

    if (filtered.length === 0) {
      noSkillsResults.style.display = 'block';
    } else {
      noSkillsResults.style.display = 'none';
      filtered.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = \`
          <div class="card-top">
            <div class="card-header-row">
              <span class="skill-name">\${skill.name}</span>
              <span class="badge">\${skill.badge}</span>
            </div>
            <div class="skill-trigger">
              <strong>Natural Language Trigger:</strong>
              \${skill.trigger}
            </div>
          </div>
          <div class="card-bottom">
            <span class="command-tag">\${skill.command}</span>
            <span class="view-link">View Spec →</span>
          </div>
        \`;
        card.addEventListener('click', () => openSkillModal(skill));
        skillsGrid.appendChild(card);
      });
    }
  }

  function openSkillModal(skill) {
    modalTitle.textContent = skill.name;
    modalCategory.textContent = skill.badge;
    modalCategory.className = 'badge';
    modalBody.innerHTML = \`
      <h4>Overview</h4>
      <p>\${skill.description}</p>
      
      <h4>Natural Language Trigger Condition</h4>
      <p><code>\${skill.trigger}</code></p>
      
      <h4>Command / Invocation</h4>
      <pre><code>\${skill.command}</code></pre>
      
      <h4>Implementation Details & Rules</h4>
      <pre><code>\${skill.details}</code></pre>
    \`;
    modalBackdrop.classList.add('open');
  }

  // ================= 2. RENDER MCP SERVERS =================
  function renderMcpServers() {
    mcpGrid.innerHTML = '';
    const filtered = MCP_SERVERS_DATA.filter(server => {
      const matchType = activeMcpCategory === 'all' || server.type === activeMcpCategory;
      const q = activeMcpQuery.toLowerCase().trim();
      const matchQuery = !q || 
        server.name.toLowerCase().includes(q) ||
        server.description.toLowerCase().includes(q) ||
        server.command.toLowerCase().includes(q) ||
        server.tools.some(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
      
      return matchType && matchQuery;
    });

    if (filtered.length === 0) {
      noMcpResults.style.display = 'block';
    } else {
      noMcpResults.style.display = 'none';
      filtered.forEach(server => {
        const card = document.createElement('div');
        card.className = 'mcp-server-card';
        
        const toolsSlice = server.tools.slice(0, 4);
        const remaining = server.tools.length - toolsSlice.length;
        const toolsChipsHtml = toolsSlice.map(t => \`<span class="tool-chip">\${t.name}</span>\`).join('') + 
          (remaining > 0 ? \`<span class="tool-chip more">+\${remaining} more</span>\` : '');

        card.innerHTML = \`
          <div class="card-top">
            <div class="card-header-row">
              <span class="server-name">\${server.name}</span>
              <span class="badge \${server.type}">\${server.type.toUpperCase()} (\${server.toolCount})</span>
            </div>
            <p class="server-description">\${server.description}</p>
            <div class="server-tools-preview">
              \${toolsChipsHtml}
            </div>
          </div>
          <div class="card-bottom">
            <span class="command-tag" title="\${server.command}">\${server.command}</span>
            <span class="view-link">Explore Tools →</span>
          </div>
        \`;
        card.addEventListener('click', () => openMcpModal(server));
        mcpGrid.appendChild(card);
      });
    }
  }

  function openMcpModal(server) {
    modalTitle.textContent = server.name;
    modalCategory.textContent = \`\${server.type.toUpperCase()} • \${server.toolCount} TOOLS\`;
    modalCategory.className = \`badge \${server.type}\`;

    const toolsAccordionHtml = server.tools.map(tool => {
      const requiredList = tool.required && tool.required.length > 0 
        ? tool.required.map(r => \`<strong style="color:var(--warning)">\${r}*</strong>\`).join(', ')
        : 'None (Optional)';
      
      const propsKeys = Object.keys(tool.properties || {});
      const propsHtml = propsKeys.length > 0
        ? propsKeys.map(k => \`<div><code>\${k}</code> (\${tool.properties[k].type || 'any'}): \${tool.properties[k].description || ''}</div>\`).join('')
        : '<div>No extra parameters required</div>';

      const exampleCall = JSON.stringify({
        ServerName: server.name,
        ToolName: tool.name,
        Arguments: propsKeys.reduce((acc, k) => {
          acc[k] = tool.properties[k].type === 'integer' ? 1 : (tool.properties[k].type === 'boolean' ? true : "example");
          return acc;
        }, {})
      }, null, 2);

      return \`
        <div class="tool-item">
          <div class="tool-item-header">
            <span class="tool-item-name">\${tool.name}</span>
            <button class="copy-btn" onclick="navigator.clipboard.writeText('\${tool.name}')">Copy Name</button>
          </div>
          <div class="tool-item-desc">\${tool.description}</div>
          <div class="tool-params-list">
            <div style="margin-bottom:4px;"><strong>Required Params:</strong> \${requiredList}</div>
            <div style="margin-bottom:6px;"><strong>Schema Properties:</strong></div>
            <div style="padding-left:8px; display:flex; flex-direction:column; gap:2px;">\${propsHtml}</div>
          </div>
        </div>
      \`;
    }).join('');

    modalBody.innerHTML = \`
      <h4>Server Description</h4>
      <p>\${server.description}</p>
      
      <h4>Transport & Command / URL</h4>
      <pre><code>\${server.command}</code></pre>
      
      <h4>Config JSON Snippet (~/.gemini/config/mcp_config.json)</h4>
      <pre><code>"\${server.name}": {
  "command": "\${server.command.split(' ')[0]}",
  "args": \${JSON.stringify(server.command.split(' ').slice(1))}
}</code></pre>

      <h4>Available Tools (\${server.toolCount})</h4>
      <div class="tools-accordion">
        \${toolsAccordionHtml}
      </div>
    \`;
    modalBackdrop.classList.add('open');
  }

  // Modal Close
  modalClose.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
  });

  // Global Search Handler
  globalSearch.addEventListener('input', (e) => {
    const val = e.target.value;
    if (currentView === 'skillsView') {
      activeSkillQuery = val;
      renderSkills();
    } else if (currentView === 'mcpView') {
      activeMcpQuery = val;
      renderMcpServers();
    }
  });

  // Skill Filters
  skillCategoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      skillCategoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeSkillCategory = pill.getAttribute('data-category');
      renderSkills();
    });
  });

  // MCP Filters
  mcpCategoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      mcpCategoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeMcpCategory = pill.getAttribute('data-mcp-category');
      renderMcpServers();
    });
  });

  // Quick Filter Helpers
  window.filterBySkillQuery = (q) => {
    if (currentView !== 'skillsView') {
      tabBtns[0].click();
    }
    globalSearch.value = q;
    activeSkillQuery = q;
    renderSkills();
    globalSearch.focus();
  };

  window.resetSkillFilters = () => {
    globalSearch.value = '';
    activeSkillQuery = '';
    activeSkillCategory = 'all';
    skillCategoryPills.forEach(p => p.classList.remove('active'));
    skillCategoryPills[0].classList.add('active');
    renderSkills();
  };

  window.resetMcpFilters = () => {
    globalSearch.value = '';
    activeMcpQuery = '';
    activeMcpCategory = 'all';
    mcpCategoryPills.forEach(p => p.classList.remove('active'));
    mcpCategoryPills[0].classList.add('active');
    renderMcpServers();
  };

  // Copy Master Workflow Prompt Helper
  const MASTER_PROMPT_TEXT = \`# MISSION BRIEFING & GLOBAL WORKFLOW ACTIVATION

You are operating as an elite, autonomous software engineering agent inside the Antigravity 2026 ecosystem. You are strictly bound by the Affirm Single-Task Contract, the Ponytail Laziness Ladder, Karpathy Grounding Disciplines, and our 17-server MCP stack.

## ACTIVE SYSTEM STACK & MCP TOPOLOGY
- Model Cascading (OmniRoute): Gemini 3.7/2.5 Flash (Architect) -> Groq Llama 3.3 70B (Fast TDD) -> Mistral Codestral (Code Precision) -> DeepSeek R1 (Deep Logic).
- In-Context Reasoning: sequential-thinking (sequentialthinking) for multi-hop hypotheses and design decomposition.
- Local Storage & Cache: sqlite (data/app.db) and sandboxed filesystem.
- Web & Research: fetch (Markdown scraper), brave-search (real-time indexing), and agent-reach (r.jina.ai / yt-dlp).
- Project & Task Sync: github MCP (@aryanthepain) for PRs/issues and notion MCP for Kanban sync.
- UI & Prototyping: lovable & google-stitch for React/Tailwind component generation.
- Testing & Security: playwright (browser tests), strix-security (pen-testing in worktrees), and antimetal (RCA diagnostics).
- Async Execution Harnesses: opencode-runner / aider-pair for TDD loops; google-jules for cloud PRs; kaggle-gpu-fallback for uncapped GPU compute.

## MANDATORY 6-PHASE EXECUTION PROTOCOL
1. PHASE 1: Socratic Grilling (/grill-me & write-a-brief) - Relentless Socratic interview walking down the decision tree branch-by-branch.
2. PHASE 2: Specification & PRD (write-a-prd + critique + prd-to-issues) - Formalize contracts, critique gaps, and split into atomic AFK/HITL cards.
3. PHASE 3: The Ponytail Anti-Bloat Gate (ponytail) - Climb Levels 1 to 6 (YAGNI -> Stdlib -> Platform -> Dependency -> One-Liner -> Minimal Code).
4. PHASE 4: Cognitive Reasoning & Surgical TDD (sequential-thinking & tdd) - Plan thought steps, write failing tests first, make surgical diffs.
5. PHASE 5: Deterministic Fleet Loop (verify.ps1 & fleet-loop) - mypy/tsc static checks, unit tests, max 3 test-fix retry circuit breaker.
6. PHASE 6: Safe Delivery & PR Opening (commit-and-push & github) - Atomic conventional commits and verified PR creation.

## MY GOAL / TASK:
[INSERT YOUR FEATURE, TASK, OR PROJECT DESCRIPTION HERE]\`;

  window.copyMasterPrompt = () => {
    navigator.clipboard.writeText(MASTER_PROMPT_TEXT).then(() => {
      const fb = document.getElementById('promptCopyFeedback');
      if (fb) {
        fb.style.display = 'inline';
        setTimeout(() => { fb.style.display = 'none'; }, 3000);
      }
    });
  };

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrop.classList.remove('open');
    }
    if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && document.activeElement !== globalSearch) {
      e.preventDefault();
      globalSearch.focus();
      globalSearch.select();
    }
  });

  // Initial Load
  updateBadgeCount();
  renderSkills();
});
`;

fs.writeFileSync(path.join(__dirname, '../docs/app.js'), appJsContent, 'utf8');
console.log('Successfully generated docs/app.js!');
