// Antigravity 2026 Skills, MCP Servers & Architecture Data & Logic

const SKILLS_DATA = [
  {
    "name": "global_rules",
    "category": "core",
    "badge": "Always On",
    "trigger": "Always active in every session. Triggers on any coding, planning, or execution task.",
    "description": "Enforces Affirm 1-Task 1-PR delivery contract, single-agent default, Ponytail ladder, Karpathy surgical edits, and Fleet loop 3-retry bounds.",
    "command": "Always active (~/.gemini/config/rules/global_rules.md)",
    "details": "1. Affirm Contract: 1 Task -> 1 Agent Session -> 1 PR.\n2. Single Agent Default: 1 agent for normal tasks; subagents only for parallelism/sandbox.\n3. Ponytail Ladder: YAGNI -> Stdlib -> Platform -> Dependency -> One-Liner -> Minimal Code.\n4. Karpathy Grounding: Think first, surgical edits, goal-driven tests.\n5. Deterministic Verification: verify.ps1 with max 3 retry attempts.\n6. Skill Authoring: Natural language trigger descriptions."
  },
  {
    "name": "ponytail",
    "category": "core",
    "badge": "Anti-Bloat",
    "trigger": "Trigger on mentions of: 'ponytail', 'anti-bloat', 'make it minimal', 'simplest implementation', 'avoid over-engineering', 'YAGNI', 'use standard library', 'don't add dependencies', or 'keep diff small'.",
    "description": "Enforces the 6-level 'laziest senior developer' decision ladder to eliminate code bloat, unnecessary dependencies, and speculative abstractions before writing code.",
    "command": "Rule / Skill",
    "details": "Climbs 6 levels before writing code:\n- Level 1: Does this need to exist? (YAGNI)\n- Level 2: Does Python/JS standard library do it?\n- Level 3: Is there a native browser or platform feature?\n- Level 4: Is there an existing project package?\n- Level 5: Can it be a clean one-liner?\n- Level 6: Minimal surgical implementation."
  },
  {
    "name": "karpathy-skills",
    "category": "core",
    "badge": "Behavioral",
    "trigger": "Trigger on mentions of: 'karpathy', 'think before coding', 'simplicity first', 'surgical changes', 'surgical edits', 'keep diffs small', 'avoid churn', or 'goal-driven execution'.",
    "description": "Encodes Andrej Karpathy's 4 core disciplines: Think before coding, Simplicity first, Surgical changes, and Goal-driven verification.",
    "command": "Rule / Skill",
    "details": "- Think Before Coding: State assumptions explicitly. Surface tradeoffs before editing. Stop and ask if ambiguous.\n- Simplicity First: Minimum code that solves the issue. No speculative configurability.\n- Surgical Changes: Touch ONLY lines necessary for the test. Never reformat adjacent code.\n- Goal-Driven Execution: Transform tasks into automated tests."
  },
  {
    "name": "code-review",
    "category": "core",
    "badge": "Static Review",
    "trigger": "Trigger on mentions of: 'review this diff', 'code review', 'check for regressions', 'review PR', 'audit code changes', or 'look for code bloat'.",
    "description": "Adversarial code review pass verifying compliance with Ponytail simplicity, Karpathy surgical constraints, and clean diffs.",
    "command": "/code-review",
    "details": "Performs AST and line-by-line review of git diffs, checking for:\n- Orphaned imports or unreferenced variables\n- Speculative abstractions or wrapper bloat\n- Accidental formatting churn\n- Missing edge-case test coverage"
  },
  {
    "name": "task-observer",
    "category": "core",
    "badge": "Meta-Learning",
    "trigger": "Trigger on mentions of: 'task observer', 'learn from this', '/learn', 'remember this', 'update the skill with this', 'don't do this again', 'save this as a rule', or 'observe and learn'.",
    "description": "Meta-skill that continuously monitors session interactions, captures user corrections and critiques, and surgically evolves global rules and reusable skills.",
    "command": "Skill / /learn",
    "details": "1. Monitors conversation stream for human corrections ('don't do that', 'prefer X over Y').\n2. Distills feedback into permanent invariants (Trigger -> Mandatory Action -> Forbidden Anti-Pattern).\n3. Updates ~/.gemini/config/rules/global_rules.md, project CONSTITUTION.md, or target SKILL.md.\n4. Appends structured log to learning/instincts.md."
  },
  {
    "name": "subagent-orchestrator",
    "category": "core",
    "badge": "Orchestration",
    "trigger": "Trigger on mentions of: 'spawn subagents', 'run in parallel', 'split task into workers', 'parallelize this', or 'orchestrate squad'.",
    "description": "Decomposes complex epics into parallel subagents running in isolated physical directories.",
    "command": "/subagent-orchestrator",
    "details": "Spawns scoped subagents with fresh contexts and narrow toolsets. Never run parallel agents on a dirty single branch."
  },
  {
    "name": "superpowers",
    "category": "core",
    "badge": "Agent Harness",
    "trigger": "Trigger on mentions of: 'superpowers', 'obra superpowers', 'agent skill chaining', 'cognitive harness', or 'advanced agent patterns'.",
    "description": "Advanced agentic behavioral patterns, composable skill chains, and defensive verification harnesses from the obra/superpowers methodology.",
    "command": "Skill",
    "details": "1. Context Grounding: Never act on assumptions — inspect first.\n2. Defensive Verification: Every state mutation must have an observable proof of success.\n3. Composable Chains: Connect single-purpose skills into unified pipelines."
  },
  {
    "name": "grill-me",
    "category": "workflow",
    "badge": "Specification",
    "trigger": "Trigger on mentions of: 'grill me', 'stress-test this plan', 'clarify requirements', 'interview me on this design', 'ask me questions about this feature', or 'refine the brief'.",
    "description": "Relentless Socratic interview walking down the decision tree one-by-one with recommended answers before code is touched.",
    "command": "/grill-me",
    "details": "Walks down each branch of the design tree, resolving dependencies between decisions one-by-one. Captured decisions are written to active plans or WORKING.md."
  },
  {
    "name": "improve-codebase-architecture",
    "category": "workflow",
    "badge": "Architecture",
    "trigger": "Trigger on mentions of: 'improve architecture', 'deepen shallow modules', 'refactor codebase', 'consolidate coupled modules', or 'make codebase ai navigable'.",
    "description": "Explores a codebase to find opportunities for architectural improvement and deepens shallow modules.",
    "command": "Skill / Workflow",
    "details": "Identifies shallow wrapper classes, redundant abstraction layers, and tight couplings to create deeper, testable interfaces."
  },
  {
    "name": "fleet-loop",
    "category": "testing",
    "badge": "Adaptive Loop",
    "trigger": "Trigger on mentions of: 'fleet loop', 'run verification loop', 'fix until passing', 'bounded fix loop', 'auto test loop', 'red green loop', 'iterate on test errors', or 'verify and fix'.",
    "description": "Bounded 4-stage adaptive verification ladder (Static/Types -> Targeted Tests -> Full Suite -> AST Diff) with 3-retry circuit breaker.",
    "command": "/fleet-loop",
    "details": "1. Red: Run targeted failing test.\n2. Green: Apply minimal surgical patch.\n3. Verify: tsc/mypy -> targeted pytest/vitest -> full regression suite.\n4. Circuit Breaker: Max 3 retry attempts. If attempt 3 fails, stops and escalates to human."
  },
  {
    "name": "tdd",
    "category": "testing",
    "badge": "TDD",
    "trigger": "Trigger on mentions of: 'tdd', 'test driven development', 'red green refactor', 'write tests first', or 'make tests pass'.",
    "description": "Enforces Red -> Green -> Refactor cycle for both Python backend and TypeScript/React frontend.",
    "command": "/tdd",
    "details": "Forces writing or running the failing test first, implementing the minimal code to pass, and refactoring cleanly."
  },
  {
    "name": "verify.ps1",
    "category": "testing",
    "badge": "Deterministic Gate",
    "trigger": "Trigger on mentions of: 'run verify script', 'run local test gate', 'check types and tests', 'deterministic verify', or 'check project health'.",
    "description": "PowerShell script detecting repository type and executing static typing and test suites.",
    "command": "pwsh -File ./scripts/verify.ps1 [-Quick]",
    "details": "Runs mypy/tsc static analysis followed by pytest/npm test. Returns exit code 0 on success, 1 on failure."
  },
  {
    "name": "security-sandbox-review",
    "category": "security",
    "badge": "Sandbox Pen-Test",
    "trigger": "Trigger on mentions of: 'security review', 'strix', 'audit security', 'pen-test this', 'vulnerability scan', 'check for vulnerabilities', 'sandbox security test', 'OWASP check', 'BOLA check', or 'test auth security'.",
    "description": "Autonomous vulnerability assessment using SAST tooling and Strix AI penetration testing agent in an isolated worktree.",
    "command": "/security-review",
    "details": "Spins up an isolated git worktree, runs SAST scans, executes Strix AI dynamic exploit simulations, validates PoCs, and verifies surgical patches."
  },
  {
    "name": "accidental-data-loss-prevention",
    "category": "security",
    "badge": "Safety Gate",
    "trigger": "Trigger on mentions of: 'drop table', 'truncate', 'delete from without where', 'gsutil rm', 'gcloud projects delete', or destructive cloud operations.",
    "description": "Stop-and-verify safety guardrail requiring explicit human confirmation before destructive data operations.",
    "command": "Always active rule",
    "details": "Blocks destructive SQL, cloud storage deletion, and infrastructure destruction without explicit confirmation."
  },
  {
    "name": "gcs-security-assessment",
    "category": "security",
    "badge": "Cloud Security",
    "trigger": "Trigger on mentions of: 'audit gcs bucket', 'check cloud storage security', 'gcs SAIF compliance', or 'bucket public access check'.",
    "description": "Assesses security posture, public access prevention, and SAIF compliance for Cloud Storage buckets.",
    "command": "Skill",
    "details": "Scans GCS bucket IAM policies, public access settings, encryption configurations, and lifecycle rules."
  },
  {
    "name": "notion-sync",
    "category": "integration",
    "badge": "Notion Kanban",
    "trigger": "Trigger on mentions of: 'notion sync', 'sync with notion', 'update task board', 'pull tasks from notion', 'move notion card', 'update notion status', 'sync to-do list', or 'sync sprint backlog'.",
    "description": "Bidirectional synchronization between local tasks/briefs/WORKING.md and your Notion Task Board Kanban via Notion MCP.",
    "command": "Skill / Notion MCP",
    "details": "Maps Notion Kanban stages: Backlog -> Ready -> In Progress -> In Review -> Done. Terminal state for agent is 'In Review'; only human merges and moves to 'Done'."
  },
  {
    "name": "agent-alarm",
    "category": "integration",
    "badge": "Notifications",
    "trigger": "Trigger on mentions of: 'notify me when done', 'set timer', 'alert when finished', 'remind me in 10 minutes', or 'schedule check'.",
    "description": "Sets one-shot timer or recurring cron notifications via /schedule tool.",
    "command": "/schedule",
    "details": "Eliminates token-wasting polling loops by scheduling reactive notifications on task completion."
  },
  {
    "name": "omniroute-config",
    "category": "integration",
    "badge": "Model Router",
    "trigger": "Trigger on mentions of: 'omniroute', 'configure model router', 'setup free models', 'switch model fallback', or 'localhost:20128'.",
    "description": "Manages OmniRoute local proxy configurations for seamless free-tier model cascading.",
    "command": "Skill / Config",
    "details": "Routes traffic to Gemini Flash, Groq, Mistral Codestral, and DeepSeek via OpenAI-compatible endpoints."
  },
  {
    "name": "init-project",
    "category": "scaffolding",
    "badge": "Scaffolder",
    "trigger": "Trigger on mentions of: 'init project', 'initialize project', 'scaffold repo', 'setup new repo', 'bootstrap project', 'setup antigravity in this repo', or 'add agents.md and constitution'.",
    "description": "One-command bootstrapping for AGENTS.md, CONSTITUTION.md, WORKING.md, .agents/rules, and git pre-commit verification hooks.",
    "command": "pwsh -File ./scripts/init-project.ps1",
    "details": "Scaffolds complete directory structure, links global rules, copies verification scripts, and configures core.hooksPath = .githooks."
  },
  {
    "name": "commit-and-push",
    "category": "scaffolding",
    "badge": "Git Flow",
    "trigger": "Trigger on mentions of: 'commit changes', 'push to branch', 'save work to git', 'commit and push', or 'ship it'.",
    "description": "Groups changes into logically scoped, conventional commits and pushes safely with upstream configuration.",
    "command": "Skill",
    "details": "Never force pushes without explicit confirmation. Enforces conventional commit formatting."
  },
  {
    "name": "agy-customizations",
    "category": "scaffolding",
    "badge": "Antigravity Custom",
    "trigger": "Trigger on mentions of: 'antigravity customizations', 'create skill', 'create rule', 'plugin format', or 'mcp configuration syntax'.",
    "description": "Authoritative reference for Antigravity skills, rules, plugins, and MCP schema definitions.",
    "command": "Skill",
    "details": "Guides writing SKILL.md, AGENTS.md, plugins, and MCP JSON schema definitions."
  },
  {
    "name": "opencode-runner",
    "category": "scaffolding",
    "badge": "Headless TDD",
    "trigger": "Trigger on mentions of: 'opencode', 'run opencode', 'headless tdd loop', 'terminal coding agent', or 'batch code runner'.",
    "description": "Headless, fast terminal-based coding agent for executing rapid TDD test-and-fix loops, multi-file refactoring, and deterministic verification.",
    "command": "opencode --model groq/llama-3.3-70b",
    "details": "Executes ultra-fast headless test-fix loops and AST refactoring without UI overhead."
  },
  {
    "name": "aider-pair",
    "category": "scaffolding",
    "badge": "Terminal Pair",
    "trigger": "Trigger on mentions of: 'aider', 'run aider', 'pair program with aider', 'aider architect mode', or 'auto-commit coding'.",
    "description": "Terminal AI pair programming harness supporting git worktrees, automatic conventional git commits, and architect/editor dual model setups.",
    "command": "aider --model gemini/gemini-2.5-flash",
    "details": "Automatically git-tracks every modification with structured conventional commit messages."
  },
  {
    "name": "openhands-harness",
    "category": "scaffolding",
    "badge": "Autonomous Sandbox",
    "trigger": "Trigger on mentions of: 'openhands', 'all-hands', 'run openhands', 'autonomous agent sandbox', or 'docker agent harness'.",
    "description": "Open-source autonomous AI software development agent capable of executing complex multi-step engineering tasks inside Docker sandboxes.",
    "command": "docker run ghcr.io/all-hands-ai/openhands",
    "details": "Complete containerized sandbox where an agent plans, executes shell commands, inspects browser DOMs, and delivers PRs."
  },
  {
    "name": "agent-reach",
    "category": "scaffolding",
    "badge": "Zero-Cost Scraping",
    "trigger": "Trigger on mentions of: 'agent reach', 'jina reader', 'scrape url', 'read web page markdown', 'extract youtube transcript', 'yt-dlp', or 'fetch article without api'.",
    "description": "Zero-cost web scraping, YouTube transcript extraction, and CLI intelligence using Jina Reader (r.jina.ai), yt-dlp, and GitHub CLI without paid API keys.",
    "command": "curl https://r.jina.ai/<url>",
    "details": "Prepend https://r.jina.ai/ to any URL to retrieve clean, token-efficient Markdown."
  },
  {
    "name": "google-stitch",
    "category": "scaffolding",
    "badge": "UI Prototyping",
    "trigger": "Trigger on mentions of: 'google stitch', 'stitch ui', 'scaffold frontend with stitch', 'lovable ui', or 'generate modern component mockup'.",
    "description": "Rapid frontend UI layout generator and component prototyping tool using Google AI Studio Stitch and Lovable to scaffold production-ready interfaces.",
    "command": "Skill / Stitch / Lovable",
    "details": "Converts natural language briefs into responsive, themeable React/HTML components."
  },
  {
    "name": "google-jules",
    "category": "workflow",
    "badge": "Cloud PR Agent",
    "trigger": "Trigger on mentions of: 'google jules', 'jules agent', 'cloud pr generator', 'async github issue solver', or 'delegate issue to jules'.",
    "description": "Google's asynchronous cloud development agent that automatically reads GitHub issues, clones repositories in Google Cloud VMs, and opens verified PRs.",
    "command": "Cloud Agent / @google-jules",
    "details": "Offloads background GitHub issue resolution and pull request generation directly onto Google's cloud runners."
  },
  {
    "name": "kaggle-gpu-fallback",
    "category": "workflow",
    "badge": "Free Cloud GPU",
    "trigger": "Trigger on mentions of: 'kaggle gpu', 'colab gpu fallback', 'qwen 32b tunnel', 'free gpu host', 'cloudflare tunnel llm', or 'pinggy ollama'.",
    "description": "Configures and manages free cloud GPU runners on Kaggle or Google Colab (T4/P100 GPUs) hosting local models via Pinggy or Cloudflare Tunnels.",
    "command": "ollama + pinggy tunnel",
    "details": "Provides 30+ hours/week of free T4/P100 GPU compute on Kaggle/Colab running Qwen 2.5 Coder 32B or DeepSeek R1."
  },
  {
    "name": "bigquery-sql",
    "category": "cloud",
    "badge": "SQL Tuning",
    "trigger": "Trigger on mentions of: 'optimize sql', 'bigquery query tuning', 'reduce query scan cost', 'partition table', or 'cluster table'.",
    "description": "BigQuery SQL query optimization, execution best practices, and performance tuning rules.",
    "command": "Skill",
    "details": "Optimizes query slot usage, prevents full-table scans with partition filters, and avoids SELECT *."
  },
  {
    "name": "bigquery-ai-ml",
    "category": "cloud",
    "badge": "ML & GenAI",
    "trigger": "Trigger on mentions of: 'bigquery ml', 'bqml forecasting', 'detect outliers in bigquery', or 'run gemini in sql'.",
    "description": "BigQuery built-in machine learning and GenAI capabilities for in-database analytics.",
    "command": "Skill",
    "details": "Generates CREATE MODEL statements, ARIMA_PLUS time series forecasts, and ML.GENERATE_TEXT queries."
  },
  {
    "name": "dataform-bigquery",
    "category": "cloud",
    "badge": "Dataform",
    "trigger": "Trigger on mentions of: 'dataform', 'sqlx', 'dataform pipeline', 'bigquery transformation pipeline', or 'workflow_settings.yaml'.",
    "description": "Generates clean, correct Dataform SQLX transformations, assertions, and source declarations.",
    "command": "Skill",
    "details": "Configures workflow_settings.yaml, creates incremental models, and writes automated data quality assertions."
  },
  {
    "name": "dbt-bigquery",
    "category": "cloud",
    "badge": "dbt",
    "trigger": "Trigger on mentions of: 'dbt model', 'dbt build', 'dbt bigquery', 'dbt test', or 'dbt_project.yml'.",
    "description": "Expert guidance for creating and troubleshooting dbt projects and Jinja models on BigQuery.",
    "command": "Skill",
    "details": "Configures dbt_project.yml, writes schema.yml tests, and optimizes incremental materializations."
  },
  {
    "name": "gcp-data-pipelines",
    "category": "cloud",
    "badge": "Orchestration",
    "trigger": "Trigger on mentions of: 'design data pipeline', 'gcp etl architecture', 'choose pipeline tool', or 'ingest data to bigquery'.",
    "description": "Primary entry point for architecting and orchestrating GCP data ingestion and transformation pipelines.",
    "command": "Skill",
    "details": "Guides selection between Beam/Dataflow, Spark/Dataproc, Dataform, and Composer DAGs."
  },
  {
    "name": "gcp-spark",
    "category": "cloud",
    "badge": "Spark",
    "trigger": "Trigger on mentions of: 'pyspark on gcp', 'dataproc serverless', 'spark iceberg', 'spark bigquery connector', or 'spark etl'.",
    "description": "Develops and executes Spark ETL and ML code using BigLake Iceberg catalogs and BigQuery.",
    "command": "Skill",
    "details": "Configures Dataproc Serverless batches, optimizes shuffle partitions, and debugs Spark OOM errors."
  },
  {
    "name": "gcp-dataflow",
    "category": "cloud",
    "badge": "Apache Beam",
    "trigger": "Trigger on mentions of: 'apache beam', 'dataflow pipeline', 'dataflow flex template', 'streaming pipeline', or 'dataflow autoscaling'.",
    "description": "Guides packaging, executing, and troubleshooting Apache Beam pipelines and Flex Templates.",
    "command": "Skill",
    "details": "Diagnoses streaming job backpressure, watermarks, autoscaling limits, and windowing triggers."
  },
  {
    "name": "discovering-gcp-data-assets",
    "category": "cloud",
    "badge": "Data Discovery",
    "trigger": "Trigger on mentions of: 'find dataset in gcp', 'inspect bigquery table schema', 'search spanner tables', or 'explore gcp data catalog'.",
    "description": "Inspects metadata, schemas, and governance policies for Google Cloud data assets.",
    "command": "Skill",
    "details": "Retrieves table schemas, column descriptions, and partitioning information without expensive CLI queries."
  },
  {
    "name": "chrome-devtools",
    "category": "devtools",
    "badge": "DevTools MCP",
    "trigger": "Trigger on mentions of: 'inspect web page', 'chrome devtools', 'debug network request', 'evaluate javascript in browser', or 'take page screenshot'.",
    "description": "Uses Chrome DevTools via MCP for live page inspection, console debugging, and network analysis.",
    "command": "Skill / MCP",
    "details": "Inspects live DOM, captures screenshots, monitors network payloads, and evaluates JS expressions."
  },
  {
    "name": "a11y-debugging",
    "category": "devtools",
    "badge": "Accessibility",
    "trigger": "Trigger on mentions of: 'accessibility audit', 'a11y test', 'check aria labels', 'contrast ratio check', or 'keyboard navigation audit'.",
    "description": "Performs accessibility audits based on web.dev and WCAG 2.2 guidelines using DevTools.",
    "command": "Skill",
    "details": "Checks color contrast ratios, focus rings, screen reader landmarks, and touch target sizes."
  },
  {
    "name": "debug-optimize-lcp",
    "category": "devtools",
    "badge": "Performance",
    "trigger": "Trigger on mentions of: 'optimize lcp', 'page load too slow', 'core web vitals', 'largest contentful paint', or 'slow hero image'.",
    "description": "Diagnoses and optimizes Largest Contentful Paint and rendering bottlenecks.",
    "command": "Skill",
    "details": "Identifies LCP element, resource load delays, render-blocking scripts, and image fetch priorities."
  },
  {
    "name": "memory-leak-debugging",
    "category": "devtools",
    "badge": "Memory",
    "trigger": "Trigger on mentions of: 'memory leak', 'high memory usage', 'analyze heap snapshot', 'oom error in node', or 'detached dom nodes'.",
    "description": "Analyzes heap snapshots, retained DOM elements, and uncleaned event listeners.",
    "command": "Skill",
    "details": "Guides heap differential analysis, identifying detached DOM nodes and closure memory leaks."
  },
  {
    "name": "modern-web-guidance",
    "category": "devtools",
    "badge": "Frontend Best Practices",
    "trigger": "Trigger on mentions of: 'modern css', 'view transitions', 'container queries', ':has selector', 'native dialog', or 'popover api'.",
    "description": "Authoritative reference for modern CSS (subgrid, :has, popovers) and client-side web APIs.",
    "command": "Skill",
    "details": "Prevents outdated CSS patterns; guides View Transitions, container queries, and native popover APIs."
  },
  {
    "name": "chrome-extensions",
    "category": "devtools",
    "badge": "Extensions",
    "trigger": "Trigger on mentions of: 'chrome extension', 'manifest v3', 'extension service worker', 'content script', 'extension popup', or 'publish extension'.",
    "description": "Manifest V3 best practices, service workers, content scripts, and Web Store publishing guidance.",
    "command": "Skill",
    "details": "Configures manifest.json, declarativeNetRequest, side panels, and handles Chrome Web Store reviews."
  },
  {
    "name": "dart-run-static-analysis",
    "category": "flutter",
    "badge": "Dart Analysis",
    "trigger": "Trigger on mentions of: 'dart analyze', 'dart fix', 'flutter analyze', 'resolve dart lints', or 'clean up dart warnings'.",
    "description": "Executes static analysis to identify warnings and applies mechanical lint fixes.",
    "command": "Skill",
    "details": "Runs dart analyze and dart fix --apply to resolve lints before committing."
  },
  {
    "name": "dart-add-unit-test",
    "category": "flutter",
    "badge": "Dart Tests",
    "trigger": "Trigger on mentions of: 'write dart test', 'dart unit test', 'package:test', 'test dart class', or 'mock dart dependency'.",
    "description": "Structures unit tests for functions, state models, and services.",
    "command": "Skill",
    "details": "Uses package:test and package:checks to create regression-free test suites."
  },
  {
    "name": "flutter-add-widget-test",
    "category": "flutter",
    "badge": "Widget Testing",
    "trigger": "Trigger on mentions of: 'flutter widget test', 'widgettester', 'test flutter ui', 'pump and settle', or 'verify widget renders'.",
    "description": "Component-level testing verifying widget rendering, taps, scrolls, and text inputs.",
    "command": "Skill",
    "details": "Uses testWidgets, find.byType, and tester.pumpAndSettle to assert widget state."
  },
  {
    "name": "flutter-fix-layout-issues",
    "category": "flutter",
    "badge": "Layout Fixes",
    "trigger": "Trigger on mentions of: 'renderflex overflowed', 'unbounded height', 'flutter layout overflow', 'yellow and black stripe error', or 'viewport unbounded'.",
    "description": "Fixes Flutter constraint layout errors, viewport exceptions, and overflow bugs.",
    "command": "Skill",
    "details": "Applies Flexible, Expanded, SingleChildScrollView, and LayoutBuilder to solve overflow issues."
  },
  {
    "name": "flutter-build-responsive-layout",
    "category": "flutter",
    "badge": "Responsive UI",
    "trigger": "Trigger on mentions of: 'responsive flutter', 'flutter tablet layout', 'adaptive ui flutter', 'layoutbuilder', or 'flutter screen size'.",
    "description": "Architects adaptive Flutter UI using MediaQuery, LayoutBuilder, and breakpoint systems.",
    "command": "Skill",
    "details": "Implements clean multi-column layouts and adaptive scaffold navigation bars."
  },
  {
    "name": "alphafold-database-fetch-and-analyze",
    "category": "science",
    "badge": "AlphaFold",
    "trigger": "Trigger on mentions of: 'alphafold', 'uniprot 3d structure', 'plddt score', 'predicted protein structure', or 'protein domain boundary'.",
    "description": "Fetches and analyzes structural confidence (pLDDT) and domain boundaries from AlphaFold DB.",
    "command": "Skill",
    "details": "Retrieves mmCIF structures, calculates mean pLDDT per domain, and identifies disordered regions."
  },
  {
    "name": "alphagenome-single-variant-analysis",
    "category": "science",
    "badge": "Genomics",
    "trigger": "Trigger on mentions of: 'alphagenome', 'variant pathogenicity', 'non-coding variant effect', 'splicing disruption', or 'variant effect prediction'.",
    "description": "AlphaGenome API integration for predicting non-coding variant functional impact.",
    "command": "Skill",
    "details": "Analyzes variants in chr:pos:ref>alt format across tissue-specific UBERON ontologies."
  },
  {
    "name": "chembl-database",
    "category": "science",
    "badge": "Cheminformatics",
    "trigger": "Trigger on mentions of: 'chembl', 'bioactive compound', 'ic50 value', 'ki affinity', 'drug target assay', or 'smiles search'.",
    "description": "Queries the ChEMBL bioactivity database for target assays and approved compounds.",
    "command": "Skill",
    "details": "Performs substructure/similarity searches, fetches bioactivity records, and maps mechanism of action."
  },
  {
    "name": "clinical-trials-database",
    "category": "science",
    "badge": "Clinical Trials",
    "trigger": "Trigger on mentions of: 'clinical trials', 'search clinicaltrials.gov', 'nct id', 'trial inclusion criteria', or 'find recruiting trials'.",
    "description": "Queries ClinicalTrials.gov API v2 for trial eligibility criteria and recruitment status.",
    "command": "Skill",
    "details": "Filters trials by phase, recruitment status, intervention name, and retrieves protocol details."
  },
  {
    "name": "pdb-database",
    "category": "science",
    "badge": "Structural Bio",
    "trigger": "Trigger on mentions of: 'pdb', 'protein data bank', 'macromolecular 3d structure', 'download pdb structure', or 'bound ligand structure'.",
    "description": "Searches the Protein Data Bank (PDB) by sequence similarity, ligands, or resolution.",
    "command": "Skill",
    "details": "Retrieves crystallographic/cryo-EM metadata, bound ligands, and coordinates in mmCIF format."
  },
  {
    "name": "pubchem-database",
    "category": "science",
    "badge": "Chemistry",
    "trigger": "Trigger on mentions of: 'pubchem', 'chemical compound cid', 'smiles string', 'molecular weight', 'chemical safety sheet', or 'iupac name'.",
    "description": "Queries PubChem database for compound safety data, 2D/3D structures, and synonyms.",
    "command": "Skill",
    "details": "Fetches physicochemical properties, molecular formulas, and related bioassays."
  },
  {
    "name": "pubmed-database",
    "category": "science",
    "badge": "Literature",
    "trigger": "Trigger on mentions of: 'pubmed search', 'biomedical literature', 'ncbi pubmed', 'pmc article', or 'find medical citations'.",
    "description": "Queries NCBI PubMed and PMC for peer-reviewed medical and life sciences research.",
    "command": "Skill",
    "details": "Performs MeSH term searches, retrieves PMC open-access full text, and extracts citation metadata."
  }
];

const MCP_SERVERS_DATA = [
  {
    "id": "antimetal",
    "name": "antimetal",
    "type": "stdio",
    "badge": "MCP Server",
    "command": "antimetal",
    "description": "MCP Server providing 2 tools.",
    "toolCount": 2,
    "tools": [
      {
        "name": "analyze_trace",
        "description": "Analyze execution trace or crash log to diagnose root cause",
        "required": "trace",
        "properties": {
          "language": {
            "type": "string",
            "description": "Programming language or runtime"
          },
          "trace": {
            "type": "string",
            "description": "Error trace or stack trace"
          }
        }
      },
      {
        "name": "query_metrics",
        "description": "Query system telemetry and performance metrics",
        "required": "metric_name",
        "properties": {
          "time_range": {
            "type": "string",
            "description": "Time range filter"
          },
          "metric_name": {
            "type": "string",
            "description": "Name of metric to query"
          }
        }
      }
    ]
  },
  {
    "id": "brave-search",
    "name": "brave-search",
    "type": "stdio",
    "badge": "Web Search Engine",
    "command": "npx -y @modelcontextprotocol/server-brave-search",
    "description": "Real-time web search and technical reference indexing for finding up-to-date documentation and release notes.",
    "toolCount": 2,
    "tools": [
      {
        "name": "brave_local_search",
        "description": "Searches for local points of interest and regional information.",
        "required": "query",
        "properties": {
          "query": {
            "type": "string",
            "description": "Local search query"
          }
        }
      },
      {
        "name": "brave_web_search",
        "description": "Performs real-time web search via Brave Search API for queries, technical documentation, library releases, and error traces.",
        "required": "query",
        "properties": {
          "count": {
            "type": "integer",
            "description": "Number of results (1-20, default 10)"
          },
          "query": {
            "type": "string",
            "description": "Search query"
          }
        }
      }
    ]
  },
  {
    "id": "data-agent-kit",
    "name": "data-agent-kit",
    "type": "proxy",
    "badge": "GCP Data & Context",
    "command": "node mcp_proxy_bundle.js dataAgentKit-antigravityide",
    "description": "Google Cloud data context inspection, connection discovery, and dataset template cataloging.",
    "toolCount": 4,
    "tools": [
      {
        "name": "get_active_editor_context",
        "description": "CRITICAL active editor context entry point: Returns what the user is currently looking at or focusing in the IDE. Inspects the focused active editor tab and returns the active editor text file path, open SQL code/content, highlighted line/selection ranges, OR open cloud webview resource URIs for databases (BigQuery bq://..., Spanner spanner://..., AlloyDB alloydb://..., Cloud SQL cloudsql://..., Lakehouse lakehouse://...), GCS Storage (gcs://..., gs://...), and Dataproc Spark webview tabs (cluster spark://clusters/{clusterName}, job spark://clusters/{clusterName}/jobs/{jobId}, batch spark://serverless/batches/{batchId}, session spark://serverless/sessions/{sessionId}, runtime spark://serverless/runtimes/{templateId}). ALWAYS query this first when the user asks questions like \"tell me about this job\", \"tell me about this batch\", \"what am I looking at\", \"explain this query\", or \"tell me about this table\".",
        "required": null,
        "properties": {}
      },
      {
        "name": "get_active_gcp_connection",
        "description": "CRITICAL connection entry point: Returns active GCP workspace connection configuration currently selected in the IDE. Contains the active GCP project ID, default region ID, billing quota project ID, BigQuery location (e.g. US, EU), and Cloud Composer environment settings. Use this to resolve default project ID, region, or environment when inspecting GCP or Dataproc Spark resources.",
        "required": null,
        "properties": {}
      },
      {
        "name": "list_resource_templates",
        "description": "Lists all supported resource URI templates by Data Agent Kit MCP.",
        "required": null,
        "properties": {}
      },
      {
        "name": "read_resource",
        "description": "Reads an MCP resource by its URI (e.g. bq://projects/{projectId}/datasets/{datasetId}/tables/{tableId}, spark://clusters/{clusterName}/jobs/{jobId} or workspace://active-editor).",
        "required": null,
        "properties": {
          "resourceUri": {
            "type": "string",
            "description": null
          },
          "url": {
            "type": "string",
            "description": null
          },
          "uri": {
            "type": "string",
            "description": null
          }
        }
      }
    ]
  },
  {
    "id": "fetch",
    "name": "fetch",
    "type": "stdio",
    "badge": "Markdown Web Reader",
    "command": "npx -y @modelcontextprotocol/server-fetch",
    "description": "Extracts web pages and documentation directly into lean, token-efficient Markdown without browser overhead.",
    "toolCount": 1,
    "tools": [
      {
        "name": "fetch",
        "description": "Fetches a URL and extracts its content as clean Markdown, stripping HTML tags, scripts, and unnecessary boilerplate for minimal token consumption.",
        "required": "url",
        "properties": {
          "raw": {
            "type": "boolean",
            "description": "If true, return raw HTML instead of Markdown"
          },
          "url": {
            "type": "string",
            "description": "The web URL to fetch"
          }
        }
      }
    ]
  },
  {
    "id": "filesystem",
    "name": "filesystem",
    "type": "stdio",
    "badge": "Sandboxed I/O",
    "command": "npx -y @modelcontextprotocol/server-filesystem D:\\projects",
    "description": "Sandboxed filesystem read, write, directory traversal, search, and file info inspection bounded to allowed workspace roots.",
    "toolCount": 14,
    "tools": [
      {
        "name": "create_directory",
        "description": "Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. If the directory already exists, this operation will succeed silently. Perfect for setting up directory structures for projects or ensuring required paths exist. Only works within allowed directories.",
        "required": "path",
        "properties": {
          "path": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "directory_tree",
        "description": "Get a recursive tree view of files and directories as a JSON structure. Each entry includes 'name', 'type' (file/directory), and 'children' for directories. Files have no children array, while directories always have a children array (which may be empty). The output is formatted with 2-space indentation for readability. Only works within allowed directories.",
        "required": "path",
        "properties": {
          "excludePatterns": {
            "type": "array",
            "description": null
          },
          "path": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "edit_file",
        "description": "Make line-based edits to a text file. Each edit replaces exact line sequences with new content. Returns a git-style diff showing the changes made. Only works within allowed directories.",
        "required": [
          "path",
          "edits"
        ],
        "properties": {
          "dryRun": {
            "type": "boolean",
            "description": "Preview changes using git-style diff format"
          },
          "edits": {
            "type": "array",
            "description": null
          },
          "path": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "get_file_info",
        "description": "Retrieve detailed metadata about a file or directory. Returns comprehensive information including size, creation time, last modified time, permissions, and type. This tool is perfect for understanding file characteristics without reading the actual content. Only works within allowed directories.",
        "required": "path",
        "properties": {
          "path": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "list_allowed_directories",
        "description": "Returns the list of directories that this server is allowed to access. Subdirectories within these allowed directories are also accessible. Use this to understand which directories and their nested paths are available before trying to access files.",
        "required": null,
        "properties": {}
      },
      {
        "name": "list_directory_with_sizes",
        "description": "Get a detailed listing of all files and directories in a specified path, including sizes. Results clearly distinguish between files and directories with [FILE] and [DIR] prefixes. This tool is useful for understanding directory structure and finding specific files within a directory. Only works within allowed directories.",
        "required": "path",
        "properties": {
          "path": {
            "type": "string",
            "description": null
          },
          "sortBy": {
            "type": "string",
            "description": "Sort entries by name or size"
          }
        }
      },
      {
        "name": "list_directory",
        "description": "Get a detailed listing of all files and directories in a specified path. Results clearly distinguish between files and directories with [FILE] and [DIR] prefixes. This tool is essential for understanding directory structure and finding specific files within a directory. Only works within allowed directories.",
        "required": "path",
        "properties": {
          "path": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "move_file",
        "description": "Move or rename files and directories. Can move files between directories and rename them in a single operation. If the destination exists, the operation will fail. Works across different directories and can be used for simple renaming within the same directory. Both source and destination must be within allowed directories.",
        "required": [
          "source",
          "destination"
        ],
        "properties": {
          "source": {
            "type": "string",
            "description": null
          },
          "destination": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "read_file",
        "description": "Read the complete contents of a file as text. DEPRECATED: Use read_text_file instead.",
        "required": "path",
        "properties": {
          "head": {
            "type": "number",
            "description": "If provided, returns only the first N lines of the file"
          },
          "path": {
            "type": "string",
            "description": null
          },
          "tail": {
            "type": "number",
            "description": "If provided, returns only the last N lines of the file"
          }
        }
      },
      {
        "name": "read_media_file",
        "description": "Read a file and return it as a base64-encoded content block with its MIME type. Image and audio files are returned as image/audio content; any other file type is returned as an embedded resource. Only works within allowed directories.",
        "required": "path",
        "properties": {
          "path": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "read_multiple_files",
        "description": "Read the contents of multiple files simultaneously. This is more efficient than reading files one by one when you need to analyze or compare multiple files. Each file's content is returned with its path as a reference. Failed reads for individual files won't stop the entire operation. Only works within allowed directories.",
        "required": "paths",
        "properties": {
          "paths": {
            "type": "array",
            "description": "Array of file paths to read. Each path must be a string pointing to a valid file within allowed directories."
          }
        }
      },
      {
        "name": "read_text_file",
        "description": "Read the complete contents of a file from the file system as text. Handles various text encodings and provides detailed error messages if the file cannot be read. Use this tool when you need to examine the contents of a single file. Use the 'head' parameter to read only the first N lines of a file, or the 'tail' parameter to read only the last N lines of a file. Operates on the file as text regardless of extension. Only works within allowed directories.",
        "required": "path",
        "properties": {
          "head": {
            "type": "number",
            "description": "If provided, returns only the first N lines of the file"
          },
          "path": {
            "type": "string",
            "description": null
          },
          "tail": {
            "type": "number",
            "description": "If provided, returns only the last N lines of the file"
          }
        }
      },
      {
        "name": "search_files",
        "description": "Recursively search for files and directories matching a pattern. The patterns should be glob-style patterns that match paths relative to the working directory. Use pattern like '*.ext' to match files in current directory, and '**/*.ext' to match files in all subdirectories. Returns full paths to all matching items. Great for finding files when you don't know their exact location. Only searches within allowed directories.",
        "required": [
          "path",
          "pattern"
        ],
        "properties": {
          "pattern": {
            "type": "string",
            "description": null
          },
          "path": {
            "type": "string",
            "description": null
          },
          "excludePatterns": {
            "type": "array",
            "description": null
          }
        }
      },
      {
        "name": "write_file",
        "description": "Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories.",
        "required": [
          "path",
          "content"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": null
          },
          "content": {
            "type": "string",
            "description": null
          }
        }
      }
    ]
  },
  {
    "id": "github",
    "name": "github",
    "type": "stdio",
    "badge": "Git & PR Ops",
    "command": "npx -y @modelcontextprotocol/server-github",
    "description": "Automated GitHub operations: repository search, issue triage, branch creation, commit history, and pull request generation.",
    "toolCount": 26,
    "tools": [
      {
        "name": "add_issue_comment",
        "description": "Add a comment to an existing issue",
        "required": [
          "owner",
          "repo",
          "issue_number",
          "body"
        ],
        "properties": {
          "issue_number": {
            "type": "number",
            "description": null
          },
          "owner": {
            "type": "string",
            "description": null
          },
          "body": {
            "type": "string",
            "description": null
          },
          "repo": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "create_branch",
        "description": "Create a new branch in a GitHub repository",
        "required": [
          "owner",
          "repo",
          "branch"
        ],
        "properties": {
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "from_branch": {
            "type": "string",
            "description": "Optional: source branch to create from (defaults to the repository's default branch)"
          },
          "branch": {
            "type": "string",
            "description": "Name for the new branch"
          }
        }
      },
      {
        "name": "create_issue",
        "description": "Create a new issue in a GitHub repository",
        "required": [
          "owner",
          "repo",
          "title"
        ],
        "properties": {
          "assignees": {
            "type": "array",
            "description": null
          },
          "labels": {
            "type": "array",
            "description": null
          },
          "body": {
            "type": "string",
            "description": null
          },
          "milestone": {
            "type": "number",
            "description": null
          },
          "repo": {
            "type": "string",
            "description": null
          },
          "owner": {
            "type": "string",
            "description": null
          },
          "title": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "create_or_update_file",
        "description": "Create or update a single file in a GitHub repository",
        "required": [
          "owner",
          "repo",
          "path",
          "content",
          "message",
          "branch"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Path where to create/update the file"
          },
          "content": {
            "type": "string",
            "description": "Content of the file"
          },
          "message": {
            "type": "string",
            "description": "Commit message"
          },
          "branch": {
            "type": "string",
            "description": "Branch to create/update the file in"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "sha": {
            "type": "string",
            "description": "SHA of the file being replaced (required when updating existing files)"
          }
        }
      },
      {
        "name": "create_pull_request_review",
        "description": "Create a review on a pull request",
        "required": [
          "owner",
          "repo",
          "pull_number",
          "body",
          "event"
        ],
        "properties": {
          "comments": {
            "type": "array",
            "description": "Comments to post as part of the review (specify either position or line, not both)"
          },
          "body": {
            "type": "string",
            "description": "The body text of the review"
          },
          "commit_id": {
            "type": "string",
            "description": "The SHA of the commit that needs a review"
          },
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "event": {
            "type": "string",
            "description": "The review action to perform"
          }
        }
      },
      {
        "name": "create_pull_request",
        "description": "Create a new pull request in a GitHub repository",
        "required": [
          "owner",
          "repo",
          "title",
          "head",
          "base"
        ],
        "properties": {
          "draft": {
            "type": "boolean",
            "description": "Whether to create the pull request as a draft"
          },
          "base": {
            "type": "string",
            "description": "The name of the branch you want the changes pulled into"
          },
          "head": {
            "type": "string",
            "description": "The name of the branch where your changes are implemented"
          },
          "body": {
            "type": "string",
            "description": "Pull request body/description"
          },
          "maintainer_can_modify": {
            "type": "boolean",
            "description": "Whether maintainers can modify the pull request"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "title": {
            "type": "string",
            "description": "Pull request title"
          }
        }
      },
      {
        "name": "create_repository",
        "description": "Create a new GitHub repository in your account",
        "required": "name",
        "properties": {
          "name": {
            "type": "string",
            "description": "Repository name"
          },
          "description": {
            "type": "string",
            "description": "Repository description"
          },
          "private": {
            "type": "boolean",
            "description": "Whether the repository should be private"
          },
          "autoInit": {
            "type": "boolean",
            "description": "Initialize with README.md"
          }
        }
      },
      {
        "name": "fork_repository",
        "description": "Fork a GitHub repository to your account or specified organization",
        "required": [
          "owner",
          "repo"
        ],
        "properties": {
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "organization": {
            "type": "string",
            "description": "Optional: organization to fork to (defaults to your personal account)"
          }
        }
      },
      {
        "name": "get_file_contents",
        "description": "Get the contents of a file or directory from a GitHub repository",
        "required": [
          "owner",
          "repo",
          "path"
        ],
        "properties": {
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "path": {
            "type": "string",
            "description": "Path to the file or directory"
          },
          "branch": {
            "type": "string",
            "description": "Branch to get contents from"
          }
        }
      },
      {
        "name": "get_issue",
        "description": "Get details of a specific issue in a GitHub repository.",
        "required": [
          "owner",
          "repo",
          "issue_number"
        ],
        "properties": {
          "issue_number": {
            "type": "number",
            "description": null
          },
          "owner": {
            "type": "string",
            "description": null
          },
          "repo": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "get_pull_request_comments",
        "description": "Get the review comments on a pull request",
        "required": [
          "owner",
          "repo",
          "pull_number"
        ],
        "properties": {
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          }
        }
      },
      {
        "name": "get_pull_request_files",
        "description": "Get the list of files changed in a pull request",
        "required": [
          "owner",
          "repo",
          "pull_number"
        ],
        "properties": {
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          }
        }
      },
      {
        "name": "get_pull_request_reviews",
        "description": "Get the reviews on a pull request",
        "required": [
          "owner",
          "repo",
          "pull_number"
        ],
        "properties": {
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          }
        }
      },
      {
        "name": "get_pull_request_status",
        "description": "Get the combined status of all status checks for a pull request",
        "required": [
          "owner",
          "repo",
          "pull_number"
        ],
        "properties": {
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          }
        }
      },
      {
        "name": "get_pull_request",
        "description": "Get details of a specific pull request",
        "required": [
          "owner",
          "repo",
          "pull_number"
        ],
        "properties": {
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          }
        }
      },
      {
        "name": "list_commits",
        "description": "Get list of commits of a branch in a GitHub repository",
        "required": [
          "owner",
          "repo"
        ],
        "properties": {
          "perPage": {
            "type": "number",
            "description": null
          },
          "owner": {
            "type": "string",
            "description": null
          },
          "page": {
            "type": "number",
            "description": null
          },
          "repo": {
            "type": "string",
            "description": null
          },
          "sha": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "list_issues",
        "description": "List issues in a GitHub repository with filtering options",
        "required": [
          "owner",
          "repo"
        ],
        "properties": {
          "since": {
            "type": "string",
            "description": null
          },
          "labels": {
            "type": "array",
            "description": null
          },
          "per_page": {
            "type": "number",
            "description": null
          },
          "direction": {
            "type": "string",
            "description": null
          },
          "state": {
            "type": "string",
            "description": null
          },
          "repo": {
            "type": "string",
            "description": null
          },
          "page": {
            "type": "number",
            "description": null
          },
          "owner": {
            "type": "string",
            "description": null
          },
          "sort": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "list_pull_requests",
        "description": "List and filter repository pull requests",
        "required": [
          "owner",
          "repo"
        ],
        "properties": {
          "per_page": {
            "type": "number",
            "description": "Results per page (max 100)"
          },
          "base": {
            "type": "string",
            "description": "Filter by base branch name"
          },
          "head": {
            "type": "string",
            "description": "Filter by head user or head organization and branch name"
          },
          "direction": {
            "type": "string",
            "description": "The direction of the sort"
          },
          "state": {
            "type": "string",
            "description": "State of the pull requests to return"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "page": {
            "type": "number",
            "description": "Page number of the results"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "sort": {
            "type": "string",
            "description": "What to sort results by"
          }
        }
      },
      {
        "name": "merge_pull_request",
        "description": "Merge a pull request",
        "required": [
          "owner",
          "repo",
          "pull_number"
        ],
        "properties": {
          "merge_method": {
            "type": "string",
            "description": "Merge method to use"
          },
          "commit_message": {
            "type": "string",
            "description": "Extra detail to append to automatic commit message"
          },
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "commit_title": {
            "type": "string",
            "description": "Title for the automatic commit message"
          }
        }
      },
      {
        "name": "push_files",
        "description": "Push multiple files to a GitHub repository in a single commit",
        "required": [
          "owner",
          "repo",
          "branch",
          "files",
          "message"
        ],
        "properties": {
          "files": {
            "type": "array",
            "description": "Array of files to push"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "message": {
            "type": "string",
            "description": "Commit message"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          },
          "branch": {
            "type": "string",
            "description": "Branch to push to (e.g., 'main' or 'master')"
          }
        }
      },
      {
        "name": "search_code",
        "description": "Search for code across GitHub repositories",
        "required": "q",
        "properties": {
          "per_page": {
            "type": "number",
            "description": null
          },
          "page": {
            "type": "number",
            "description": null
          },
          "order": {
            "type": "string",
            "description": null
          },
          "q": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "search_issues",
        "description": "Search for issues and pull requests across GitHub repositories",
        "required": "q",
        "properties": {
          "per_page": {
            "type": "number",
            "description": null
          },
          "page": {
            "type": "number",
            "description": null
          },
          "order": {
            "type": "string",
            "description": null
          },
          "sort": {
            "type": "string",
            "description": null
          },
          "q": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "search_repositories",
        "description": "Search for GitHub repositories",
        "required": "query",
        "properties": {
          "perPage": {
            "type": "number",
            "description": "Number of results per page (default: 30, max: 100)"
          },
          "page": {
            "type": "number",
            "description": "Page number for pagination (default: 1)"
          },
          "query": {
            "type": "string",
            "description": "Search query (see GitHub search syntax)"
          }
        }
      },
      {
        "name": "search_users",
        "description": "Search for users on GitHub",
        "required": "q",
        "properties": {
          "per_page": {
            "type": "number",
            "description": null
          },
          "page": {
            "type": "number",
            "description": null
          },
          "order": {
            "type": "string",
            "description": null
          },
          "sort": {
            "type": "string",
            "description": null
          },
          "q": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "update_issue",
        "description": "Update an existing issue in a GitHub repository",
        "required": [
          "owner",
          "repo",
          "issue_number"
        ],
        "properties": {
          "assignees": {
            "type": "array",
            "description": null
          },
          "title": {
            "type": "string",
            "description": null
          },
          "labels": {
            "type": "array",
            "description": null
          },
          "body": {
            "type": "string",
            "description": null
          },
          "milestone": {
            "type": "number",
            "description": null
          },
          "repo": {
            "type": "string",
            "description": null
          },
          "issue_number": {
            "type": "number",
            "description": null
          },
          "owner": {
            "type": "string",
            "description": null
          },
          "state": {
            "type": "string",
            "description": null
          }
        }
      },
      {
        "name": "update_pull_request_branch",
        "description": "Update a pull request branch with the latest changes from the base branch",
        "required": [
          "owner",
          "repo",
          "pull_number"
        ],
        "properties": {
          "pull_number": {
            "type": "number",
            "description": "Pull request number"
          },
          "expected_head_sha": {
            "type": "string",
            "description": "The expected SHA of the pull request's HEAD ref"
          },
          "owner": {
            "type": "string",
            "description": "Repository owner (username or organization)"
          },
          "repo": {
            "type": "string",
            "description": "Repository name"
          }
        }
      }
    ]
  },
  {
    "id": "lovable",
    "name": "lovable",
    "type": "http",
    "badge": "UI Scaffolding",
    "command": "https://mcp.lovable.dev/?src=settings",
    "description": "Instant UI component scaffolding, layout generation, and React template boilerplate via Lovable OAuth.",
    "toolCount": 2,
    "tools": [
      {
        "name": "create_component",
        "description": "Generate frontend UI component code with styling and layout",
        "required": "prompt",
        "properties": {
          "prompt": {
            "type": "string",
            "description": "Component description or user requirements"
          },
          "framework": {
            "type": "string",
            "description": "Target UI framework"
          }
        }
      },
      {
        "name": "scaffold_app",
        "description": "Scaffold full-stack web application structure with routes and components",
        "required": [
          "project_name",
          "spec"
        ],
        "properties": {
          "spec": {
            "type": "string",
            "description": "Application specification or features list"
          },
          "project_name": {
            "type": "string",
            "description": "Project or module name"
          }
        }
      }
    ]
  },
  {
    "id": "memory",
    "name": "memory",
    "type": "stdio",
    "badge": "Knowledge Graph",
    "command": "npx -y @modelcontextprotocol/server-memory",
    "description": "Persistent entity-relation knowledge graph for tracking long-term architectural patterns, project invariants, and system facts.",
    "toolCount": 9,
    "tools": [
      {
        "name": "add_observations",
        "description": "Add new observations to existing entities in the knowledge graph",
        "required": "observations",
        "properties": {
          "observations": {
            "type": "array",
            "description": null
          }
        }
      },
      {
        "name": "create_entities",
        "description": "Create multiple new entities in the knowledge graph",
        "required": "entities",
        "properties": {
          "entities": {
            "type": "array",
            "description": null
          }
        }
      },
      {
        "name": "create_relations",
        "description": "Create multiple new relations between entities in the knowledge graph. Relations should be in active voice",
        "required": "relations",
        "properties": {
          "relations": {
            "type": "array",
            "description": null
          }
        }
      },
      {
        "name": "delete_entities",
        "description": "Delete multiple entities and their associated relations from the knowledge graph",
        "required": "entityNames",
        "properties": {
          "entityNames": {
            "type": "array",
            "description": "An array of entity names to delete"
          }
        }
      },
      {
        "name": "delete_observations",
        "description": "Delete specific observations from entities in the knowledge graph",
        "required": "deletions",
        "properties": {
          "deletions": {
            "type": "array",
            "description": null
          }
        }
      },
      {
        "name": "delete_relations",
        "description": "Delete multiple relations from the knowledge graph",
        "required": "relations",
        "properties": {
          "relations": {
            "type": "array",
            "description": "An array of relations to delete"
          }
        }
      },
      {
        "name": "open_nodes",
        "description": "Open specific nodes in the knowledge graph by their names",
        "required": "names",
        "properties": {
          "names": {
            "type": "array",
            "description": "An array of entity names to retrieve"
          }
        }
      },
      {
        "name": "read_graph",
        "description": "Read the entire knowledge graph",
        "required": null,
        "properties": {}
      },
      {
        "name": "search_nodes",
        "description": "Search for nodes in the knowledge graph based on a query",
        "required": "query",
        "properties": {
          "query": {
            "type": "string",
            "description": "The search query to match against entity names, types, and observation content"
          }
        }
      }
    ]
  },
  {
    "id": "notebooks",
    "name": "notebooks",
    "type": "proxy",
    "badge": "Jupyter & Notebooks",
    "command": "node mcp_proxy_bundle.js notebooks-antigravityide",
    "description": "Jupyter notebook manipulation: cell insertion, markdown documentation, code execution, and cell output extraction.",
    "toolCount": 11,
    "tools": [
      {
        "name": "create_notebook",
        "description": "Create a new notebook file in the workspace and open it.",
        "required": [
          "directory",
          "filename"
        ],
        "properties": {
          "directory": {
            "type": "string",
            "description": "Absolute path to the directory where the notebook should be created."
          },
          "filename": {
            "type": "string",
            "description": "Name of the notebook file (without extension)."
          }
        }
      },
      {
        "name": "delete_cell",
        "description": "Delete a cell at the given index from a Jupyter notebook (.ipynb) using the Notebook API.",
        "required": [
          "path",
          "index"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "index": {
            "type": "integer",
            "description": "0-based index of the cell to delete."
          }
        }
      },
      {
        "name": "get_cell_outputs",
        "description": "Read outputs from a code cell by index: execution summary and output items.",
        "required": [
          "path",
          "index"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "index": {
            "type": "integer",
            "description": "0-based index of the cell to inspect."
          }
        }
      },
      {
        "name": "get_cell_range",
        "description": "Read a range of cells from a notebook, from start_index to end_index (inclusive).",
        "required": [
          "path",
          "start_index",
          "end_index"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "start_index": {
            "type": "integer",
            "description": "0-based start index (inclusive)."
          },
          "end_index": {
            "type": "integer",
            "description": "0-based end index (inclusive)."
          }
        }
      },
      {
        "name": "get_notebook_info",
        "description": "Get high-level information about a notebook: cell counts, type distribution, kernel metadata, and last modified time.",
        "required": "path",
        "properties": {
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          }
        }
      },
      {
        "name": "insert_code_cell",
        "description": "Insert a code cell into a Jupyter notebook (.ipynb) at a given index using the Notebook API.",
        "required": [
          "path",
          "index",
          "code"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "languageId": {
            "type": "string",
            "description": "Language ID for the cell (e.g., \"python\", \"sql\", \"javascript\"). Defaults to \"python\"."
          },
          "code": {
            "type": "string",
            "description": "Code content of the new cell."
          },
          "index": {
            "type": "integer",
            "description": "0-based index where the new cell should be inserted."
          }
        }
      },
      {
        "name": "insert_markdown_cell",
        "description": "Insert a markdown cell into a Jupyter notebook (.ipynb) at a given index using the Notebook API.",
        "required": [
          "path",
          "index",
          "markdown"
        ],
        "properties": {
          "markdown": {
            "type": "string",
            "description": "Markdown content of the new cell."
          },
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "index": {
            "type": "integer",
            "description": "0-based index where the new cell should be inserted."
          }
        }
      },
      {
        "name": "list_cells",
        "description": "List cells in a notebook with index, type, source preview, and execution status.",
        "required": "path",
        "properties": {
          "preview_length": {
            "type": "integer",
            "description": "Optional max characters in preview (default 80)."
          },
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "type_filter": {
            "type": "string",
            "description": "Optional filter by cell type (code, markdown, all). Defaults to all."
          }
        }
      },
      {
        "name": "read_cell",
        "description": "Read a specific cell by index: type, source, execution info, and outputs (for code cells).",
        "required": [
          "path",
          "index"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "index": {
            "type": "integer",
            "description": "0-based index of the cell to read."
          }
        }
      },
      {
        "name": "replace_cell",
        "description": "Replace the content (and optionally language) of an existing cell at the given index in a Jupyter notebook (.ipynb) using the Notebook API.",
        "required": [
          "path",
          "index",
          "code"
        ],
        "properties": {
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "languageId": {
            "type": "string",
            "description": "Optional new language ID for the cell (e.g., \"python\", \"sql\", \"markdown\"). If not provided, retains the existing language."
          },
          "code": {
            "type": "string",
            "description": "New code or markdown content for the cell."
          },
          "index": {
            "type": "integer",
            "description": "0-based index of the cell to edit."
          }
        }
      },
      {
        "name": "search_cells",
        "description": "Search notebook cells for text, optionally filtering by cell type.",
        "required": [
          "path",
          "query"
        ],
        "properties": {
          "type_filter": {
            "type": "string",
            "description": "Optional filter by cell type (code, markdown, all). Defaults to all."
          },
          "case_sensitive": {
            "type": "boolean",
            "description": "Whether the search should be case-sensitive (default false)."
          },
          "path": {
            "type": "string",
            "description": "Absolute path to the .ipynb file on disk."
          },
          "preview_length": {
            "type": "integer",
            "description": "Optional max characters in preview (default 80)."
          },
          "query": {
            "type": "string",
            "description": "Text to search for in cell sources."
          }
        }
      }
    ]
  },
  {
    "id": "notion",
    "name": "notion",
    "type": "stdio",
    "badge": "Task Board Sync",
    "command": "npx -y @modelcontextprotocol/server-notion",
    "description": "Bidirectional sync between local Kanban tasks/briefs and your Notion workspace databases and pages.",
    "toolCount": 8,
    "tools": [
      {
        "name": "append_block_children",
        "description": "Append new block children to a Notion page or block",
        "required": [
          "block_id",
          "children"
        ],
        "properties": {
          "block_id": {
            "type": "string",
            "description": "The ID of the parent block or page"
          },
          "children": {
            "type": "array",
            "description": "Array of block objects to append"
          }
        }
      },
      {
        "name": "create_page",
        "description": "Create a new page in a database or parent page in Notion",
        "required": [
          "parent",
          "properties"
        ],
        "properties": {
          "parent": {
            "type": "object",
            "description": "Parent object containing either database_id or page_id"
          },
          "children": {
            "type": "array",
            "description": "Page content blocks"
          },
          "properties": {
            "type": "object",
            "description": "Properties values conforming to the parent database schema"
          }
        }
      },
      {
        "name": "get_block_children",
        "description": "Retrieve the child blocks contained within a Notion page or block",
        "required": "block_id",
        "properties": {
          "block_id": {
            "type": "string",
            "description": "The ID of the block or page"
          },
          "page_size": {
            "type": "number",
            "description": "Number of results to return (max 100)"
          },
          "start_cursor": {
            "type": "string",
            "description": "Pagination cursor"
          }
        }
      },
      {
        "name": "get_database",
        "description": "Retrieve a Notion database schema and properties by database ID",
        "required": "database_id",
        "properties": {
          "database_id": {
            "type": "string",
            "description": "The ID of the Notion database to retrieve"
          }
        }
      },
      {
        "name": "get_page",
        "description": "Retrieve a Notion page by its page ID",
        "required": "page_id",
        "properties": {
          "page_id": {
            "type": "string",
            "description": "The ID of the Notion page to retrieve"
          }
        }
      },
      {
        "name": "query_database",
        "description": "Query a Notion database with optional filters, sorts, and pagination",
        "required": "database_id",
        "properties": {
          "page_size": {
            "type": "number",
            "description": "Number of results to return (max 100)"
          },
          "database_id": {
            "type": "string",
            "description": "The ID of the Notion database to query"
          },
          "sorts": {
            "type": "array",
            "description": "Notion database sort criteria"
          },
          "filter": {
            "type": "object",
            "description": "Notion database filter object"
          },
          "start_cursor": {
            "type": "string",
            "description": "Pagination cursor"
          }
        }
      },
      {
        "name": "search",
        "description": "Search Notion pages and databases by title or query text",
        "required": null,
        "properties": {
          "sort": {
            "type": "object",
            "description": null
          },
          "page_size": {
            "type": "number",
            "description": "Number of results to return (max 100)"
          },
          "filter": {
            "type": "object",
            "description": null
          },
          "query": {
            "type": "string",
            "description": "Text query to search across Notion workspace"
          }
        }
      },
      {
        "name": "update_page",
        "description": "Update properties or archived status of an existing Notion page",
        "required": "page_id",
        "properties": {
          "page_id": {
            "type": "string",
            "description": "The ID of the Notion page to update"
          },
          "properties": {
            "type": "object",
            "description": "Property values to update"
          },
          "archived": {
            "type": "boolean",
            "description": "Whether to archive the page"
          }
        }
      }
    ]
  },
  {
    "id": "playwright",
    "name": "playwright",
    "type": "stdio",
    "badge": "Browser Automation",
    "command": "npx -y @modelcontextprotocol/server-playwright",
    "description": "Headless browser automation for live page navigation, DOM inspection, form interaction, network request auditing, and screenshot capture.",
    "toolCount": 24,
    "tools": [
      {
        "name": "browser_click",
        "description": "Perform click on a web page",
        "required": "target",
        "properties": {
          "doubleClick": {
            "type": "boolean",
            "description": "Whether to perform a double click instead of a single click"
          },
          "element": {
            "type": "string",
            "description": "Human-readable element description used to obtain permission to interact with the element"
          },
          "modifiers": {
            "type": "array",
            "description": "Modifier keys to press"
          },
          "button": {
            "type": "string",
            "description": "Button to click, defaults to left"
          },
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          }
        }
      },
      {
        "name": "browser_close",
        "description": "Close the page",
        "required": null,
        "properties": {}
      },
      {
        "name": "browser_console_messages",
        "description": "Returns all console messages",
        "required": "level",
        "properties": {
          "all": {
            "type": "boolean",
            "description": "Return all console messages since the beginning of the session, not just since the last navigation. Defaults to false."
          },
          "filename": {
            "type": "string",
            "description": "Filename to save the console messages to. If not provided, messages are returned as text."
          },
          "level": {
            "type": "string",
            "description": "Level of the console messages to return. Each level includes the messages of more severe levels. Defaults to \"info\"."
          }
        }
      },
      {
        "name": "browser_drag",
        "description": "Perform drag and drop between two elements",
        "required": [
          "startTarget",
          "endTarget"
        ],
        "properties": {
          "endTarget": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          },
          "startTarget": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          },
          "endElement": {
            "type": "string",
            "description": "Human-readable target element description used to obtain the permission to interact with the element"
          },
          "startElement": {
            "type": "string",
            "description": "Human-readable source element description used to obtain the permission to interact with the element"
          }
        }
      },
      {
        "name": "browser_drop",
        "description": "Drop files or MIME-typed data onto an element, as if dragged from outside the page. At least one of \"paths\" or \"data\" must be provided.",
        "required": "target",
        "properties": {
          "element": {
            "type": "string",
            "description": "Human-readable element description used to obtain permission to interact with the element"
          },
          "data": {
            "type": "object",
            "description": "Data to drop, as a map of MIME type to string value (e.g. {\"text/plain\": \"hello\", \"text/uri-list\": \"https://example.com\"})."
          },
          "paths": {
            "type": "array",
            "description": "Absolute paths to files to drop onto the element."
          },
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          }
        }
      },
      {
        "name": "browser_evaluate",
        "description": "Evaluate JavaScript expression on page or element",
        "required": "function",
        "properties": {
          "element": {
            "type": "string",
            "description": "Human-readable element description used to obtain permission to interact with the element"
          },
          "filename": {
            "type": "string",
            "description": "Filename to save the result to. If not provided, result is returned as text."
          },
          "function": {
            "type": "string",
            "description": "() => { /* code */ } or (element) => { /* code */ } when element is provided"
          },
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          }
        }
      },
      {
        "name": "browser_file_upload",
        "description": "Upload one or multiple files",
        "required": null,
        "properties": {
          "paths": {
            "type": "array",
            "description": "The absolute paths to the files to upload. Can be single file or multiple files. If omitted, file chooser is cancelled."
          }
        }
      },
      {
        "name": "browser_fill_form",
        "description": "Fill multiple form fields",
        "required": "fields",
        "properties": {
          "fields": {
            "type": "array",
            "description": "Fields to fill in"
          }
        }
      },
      {
        "name": "browser_find",
        "description": "Search the accessibility snapshot of the current page for text or a regular expression. Returns matching snapshot nodes with a few lines of surrounding context (like search snippets), each shown under its path from the root of the tree, which is cheaper than capturing the whole snapshot when you only need to locate an element and its ref.",
        "required": null,
        "properties": {
          "regex": {
            "type": "string",
            "description": "Regular expression to search for in the page snapshot. Matching is case-sensitive by default; wrap the pattern in slashes to add flags, e.g. \"/error/i\" for case-insensitive. Provide either text or regex, not both."
          },
          "text": {
            "type": "string",
            "description": "Plain text to search for in the page snapshot (case-insensitive substring match). Provide either text or regex, not both."
          }
        }
      },
      {
        "name": "browser_handle_dialog",
        "description": "Handle a dialog",
        "required": "accept",
        "properties": {
          "promptText": {
            "type": "string",
            "description": "The text of the prompt in case of a prompt dialog."
          },
          "accept": {
            "type": "boolean",
            "description": "Whether to accept the dialog."
          }
        }
      },
      {
        "name": "browser_hover",
        "description": "Hover over element on page",
        "required": "target",
        "properties": {
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          },
          "element": {
            "type": "string",
            "description": "Human-readable element description used to obtain permission to interact with the element"
          }
        }
      },
      {
        "name": "browser_navigate_back",
        "description": "Go back to the previous page in the history",
        "required": null,
        "properties": {}
      },
      {
        "name": "browser_navigate",
        "description": "Navigate to a URL",
        "required": "url",
        "properties": {
          "url": {
            "type": "string",
            "description": "The URL to navigate to"
          }
        }
      },
      {
        "name": "browser_network_request",
        "description": "Returns full details (headers and body) of a single network request, or a single part if `part` is set. Use the number from browser_network_requests.",
        "required": "index",
        "properties": {
          "part": {
            "type": "string",
            "description": "Return only this part of the request. Omit to return full details."
          },
          "filename": {
            "type": "string",
            "description": "Filename to save the result to. If not provided, output is returned as text."
          },
          "index": {
            "type": "integer",
            "description": "1-based index of the request, as printed by browser_network_requests."
          }
        }
      },
      {
        "name": "browser_network_requests",
        "description": "Returns a numbered list of network requests since loading the page. Use browser_network_request with the number to get full details.",
        "required": "static",
        "properties": {
          "filename": {
            "type": "string",
            "description": "Filename to save the network requests to. If not provided, requests are returned as text."
          },
          "static": {
            "type": "boolean",
            "description": "Whether to include successful static resources like images, fonts, scripts, etc. Defaults to false."
          },
          "filter": {
            "type": "string",
            "description": "Only return requests whose URL matches this regexp (e.g. \"/api/.*user\")."
          }
        }
      },
      {
        "name": "browser_press_key",
        "description": "Press a key on the keyboard",
        "required": "key",
        "properties": {
          "key": {
            "type": "string",
            "description": "Name of the key to press or a character to generate, such as `ArrowLeft` or `a`"
          }
        }
      },
      {
        "name": "browser_resize",
        "description": "Resize the browser window",
        "required": [
          "width",
          "height"
        ],
        "properties": {
          "width": {
            "type": "number",
            "description": "Width of the browser window"
          },
          "height": {
            "type": "number",
            "description": "Height of the browser window"
          }
        }
      },
      {
        "name": "browser_run_code_unsafe",
        "description": "Run a Playwright code snippet. Unsafe: executes arbitrary JavaScript in the Playwright server process and is RCE-equivalent.",
        "required": null,
        "properties": {
          "code": {
            "type": "string",
            "description": "A JavaScript function containing Playwright code to execute. It will be invoked with a single argument, page, which you can use for any page interaction. For example: `async (page) => { await page.getByRole('button', { name: 'Submit' }).click(); return await page.title(); }`"
          },
          "filename": {
            "type": "string",
            "description": "Load code from the specified file. If both code and filename are provided, code will be ignored."
          }
        }
      },
      {
        "name": "browser_select_option",
        "description": "Select an option in a dropdown",
        "required": [
          "target",
          "values"
        ],
        "properties": {
          "element": {
            "type": "string",
            "description": "Human-readable element description used to obtain permission to interact with the element"
          },
          "values": {
            "type": "array",
            "description": "Array of values to select in the dropdown. This can be a single value or multiple values."
          },
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          }
        }
      },
      {
        "name": "browser_snapshot",
        "description": "Capture accessibility snapshot of the current page, this is better than screenshot",
        "required": null,
        "properties": {
          "depth": {
            "type": "number",
            "description": "Limit the depth of the snapshot tree"
          },
          "filename": {
            "type": "string",
            "description": "Save snapshot to markdown file instead of returning it in the response."
          },
          "boxes": {
            "type": "boolean",
            "description": "Include each element's bounding box as [box=x,y,width,height] in the snapshot. Coordinates are viewport-relative, in CSS pixels (Element.getBoundingClientRect)"
          },
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          }
        }
      },
      {
        "name": "browser_tabs",
        "description": "List, create, close, or select a browser tab.",
        "required": "action",
        "properties": {
          "action": {
            "type": "string",
            "description": "Operation to perform"
          },
          "url": {
            "type": "string",
            "description": "URL to navigate to in the new tab, used for new."
          },
          "index": {
            "type": "number",
            "description": "Tab index, used for close/select. If omitted for close, current tab is closed."
          }
        }
      },
      {
        "name": "browser_take_screenshot",
        "description": "Take a screenshot of the current page. You can't perform actions based on the screenshot, use browser_snapshot for actions.",
        "required": "scale",
        "properties": {
          "filename": {
            "type": "string",
            "description": "File name to save the screenshot to. Defaults to `page-{timestamp}.{png|jpeg|webp}` if not specified. Prefer relative file names to stay within the output directory."
          },
          "element": {
            "type": "string",
            "description": "Human-readable element description used to obtain permission to interact with the element"
          },
          "fullPage": {
            "type": "boolean",
            "description": "When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Cannot be used with element screenshots."
          },
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          },
          "type": {
            "type": "string",
            "description": "Image format for the screenshot. If unset, inferred from the filename extension, otherwise png."
          },
          "scale": {
            "type": "string",
            "description": "Image resolution scale. \"css\" produces a screenshot sized in CSS pixels (smaller, consistent across devices). \"device\" produces a high-resolution screenshot using device pixels (larger, accounts for the device pixel ratio). Default is css."
          }
        }
      },
      {
        "name": "browser_type",
        "description": "Type text into editable element",
        "required": [
          "target",
          "text"
        ],
        "properties": {
          "element": {
            "type": "string",
            "description": "Human-readable element description used to obtain permission to interact with the element"
          },
          "text": {
            "type": "string",
            "description": "Text to type into the element"
          },
          "target": {
            "type": "string",
            "description": "Exact target element reference from the page snapshot, or a unique element selector"
          },
          "submit": {
            "type": "boolean",
            "description": "Whether to submit entered text (press Enter after)"
          },
          "slowly": {
            "type": "boolean",
            "description": "Whether to type one character at a time. Useful for triggering key handlers in the page. By default entire text is filled in at once."
          }
        }
      },
      {
        "name": "browser_wait_for",
        "description": "Wait for text to appear or disappear or a specified time to pass",
        "required": null,
        "properties": {
          "time": {
            "type": "number",
            "description": "The time to wait in seconds"
          },
          "text": {
            "type": "string",
            "description": "The text to wait for"
          },
          "textGone": {
            "type": "string",
            "description": "The text to wait for to disappear"
          }
        }
      }
    ]
  },
  {
    "id": "sequential-thinking",
    "name": "sequential-thinking",
    "type": "stdio",
    "badge": "In-Context Reasoning",
    "command": "npx -y @modelcontextprotocol/server-sequential-thinking",
    "description": "Forces models to decompose multi-hop reasoning, revise earlier assumptions, and branch dynamically through iterative thought steps.",
    "toolCount": 1,
    "tools": [
      {
        "name": "sequentialthinking",
        "description": "A detailed tool for dynamic and reflective problem-solving through thoughts.\nThis tool helps analyze problems through a flexible thinking process that can adapt and evolve.\nEach thought can build on, question, or revise previous insights as understanding deepens.\n\nWhen to use this tool:\n- Breaking down complex problems into steps\n- Planning and design with room for revision\n- Analysis that might need course correction\n- Problems where the full scope might not be clear initially\n- Problems that require a multi-step solution\n- Tasks that need to maintain context over multiple steps\n- Situations where irrelevant information needs to be filtered out\n\nKey features:\n- You can adjust total_thoughts up or down as you progress\n- You can question or revise previous thoughts\n- You can add more thoughts even after reaching what seemed like the end\n- You can express uncertainty and explore alternative approaches\n- Not every thought needs to build linearly - you can branch or backtrack\n- Generates a solution hypothesis\n- Verifies the hypothesis based on the Chain of Thought steps\n- Repeats the process until satisfied\n- Provides a correct answer\n\nParameters explained:\n- thought: Your current thinking step, which can include:\n  * Regular analytical steps\n  * Revisions of previous thoughts\n  * Questions about previous decisions\n  * Realizations about needing more analysis\n  * Changes in approach\n  * Hypothesis generation\n  * Hypothesis verification\n- nextThoughtNeeded: True if you need more thinking, even if at what seemed like the end\n- thoughtNumber: Current number in sequence (can go beyond initial total if needed)\n- totalThoughts: Current estimate of thoughts needed (can be adjusted up/down)\n- isRevision: A boolean indicating if this thought revises previous thinking\n- revisesThought: If is_revision is true, which thought number is being reconsidered\n- branchFromThought: If branching, which thought number is the branching point\n- branchId: Identifier for the current branch (if any)\n- needsMoreThoughts: If reaching end but realizing more thoughts needed\n\nYou should:\n1. Start with an initial estimate of needed thoughts, but be ready to adjust\n2. Feel free to question or revise previous thoughts\n3. Don't hesitate to add more thoughts if needed, even at the \"end\"\n4. Express uncertainty when present\n5. Mark thoughts that revise previous thinking or branch into new paths\n6. Ignore information that is irrelevant to the current step\n7. Generate a solution hypothesis when appropriate\n8. Verify the hypothesis based on the Chain of Thought steps\n9. Repeat the process until satisfied with the solution\n10. Provide a single, ideally correct answer as the final output\n11. Only set nextThoughtNeeded to false when truly done and a satisfactory answer is reached",
        "required": [
          "thought",
          "thoughtNumber",
          "totalThoughts"
        ],
        "properties": {
          "thoughtNumber": {
            "type": "integer",
            "description": "Current thought number (numeric value, e.g., 1, 2, 3)"
          },
          "thought": {
            "type": "string",
            "description": "Your current thinking step"
          },
          "totalThoughts": {
            "type": "integer",
            "description": "Estimated total thoughts needed (numeric value, e.g., 5, 10)"
          },
          "needsMoreThoughts": {
            "type": "boolean",
            "description": "If more thoughts are needed"
          },
          "revisesThought": {
            "type": "integer",
            "description": "Which thought is being reconsidered"
          },
          "isRevision": {
            "type": "boolean",
            "description": "Whether this revises previous thinking"
          },
          "branchId": {
            "type": "string",
            "description": "Branch identifier"
          },
          "nextThoughtNeeded": {
            "type": "boolean",
            "description": "Whether another thought step is needed"
          },
          "branchFromThought": {
            "type": "integer",
            "description": "Branching point thought number"
          }
        }
      }
    ]
  },
  {
    "id": "sqlite",
    "name": "sqlite",
    "type": "stdio",
    "badge": "Local SQL DB",
    "command": "npx -y @modelcontextprotocol/server-sqlite --db-path D:\\projects\\antigravity_setup\\data\\app.db",
    "description": "Zero-overhead local SQLite database for persistent table storage, SQL analytics, and local agent cache.",
    "toolCount": 5,
    "tools": [
      {
        "name": "create_table",
        "description": "Create a new table in the SQLite database.",
        "required": "query",
        "properties": {
          "query": {
            "type": "string",
            "description": "The CREATE TABLE SQL statement"
          }
        }
      },
      {
        "name": "describe_table",
        "description": "Get column schema and constraints for a specific table in SQLite.",
        "required": "tableName",
        "properties": {
          "tableName": {
            "type": "string",
            "description": "Name of the table to inspect"
          }
        }
      },
      {
        "name": "list_tables",
        "description": "List all tables in the SQLite database.",
        "required": null,
        "properties": {}
      },
      {
        "name": "read_query",
        "description": "Execute a SELECT query against the SQLite database.",
        "required": "query",
        "properties": {
          "query": {
            "type": "string",
            "description": "The SELECT SQL query to execute"
          }
        }
      },
      {
        "name": "write_query",
        "description": "Execute an INSERT, UPDATE, or DELETE query against the SQLite database.",
        "required": "query",
        "properties": {
          "query": {
            "type": "string",
            "description": "The modification SQL query to execute"
          }
        }
      }
    ]
  },
  {
    "id": "strix-security",
    "name": "strix-security",
    "type": "stdio",
    "badge": "Autonomous SecOps",
    "command": "strix mcp",
    "description": "Automated penetration testing and vulnerability scanning (BOLA, IDOR, SQLi, SSRF, XSS) with verifiable PoC generation.",
    "toolCount": 2,
    "tools": [
      {
        "name": "generate_poc",
        "description": "Generate verified reproduction proof-of-concept for detected vulnerability",
        "required": "vulnerability_id",
        "properties": {
          "details": {
            "type": "string",
            "description": "Context or trace details"
          },
          "vulnerability_id": {
            "type": "string",
            "description": "ID of detected vulnerability"
          }
        }
      },
      {
        "name": "scan",
        "description": "Run automated security audit and vulnerability scanning on target codebase or endpoint",
        "required": "target",
        "properties": {
          "scan_type": {
            "type": "string",
            "description": "Type of security scan"
          },
          "target": {
            "type": "string",
            "description": "Target directory path or URL to scan"
          }
        }
      }
    ]
  },
  {
    "id": "visualization",
    "name": "visualization",
    "type": "proxy",
    "badge": "Interactive Charts",
    "command": "node mcp_proxy_bundle.js visualization-antigravityide",
    "description": "Data visualization engine rendering interactive bar charts, time-series line graphs, scatter plots, and summary metrics.",
    "toolCount": 1,
    "tools": [
      {
        "name": "render_chart",
        "description": "Renders a complete Apache ECharts V5 specification object into an SVG chart and returns it as a local file link for display in the chat.",
        "required": "spec",
        "properties": {
          "height": {
            "type": "number",
            "description": "Optional height of the chart in pixels. Defaults to 500."
          },
          "spec": {
            "type": "object",
            "description": "The complete Apache ECharts V5 JSON specification object."
          },
          "width": {
            "type": "number",
            "description": "Optional width of the chart in pixels. Defaults to 800."
          }
        }
      }
    ]
  },
  {
    "id": "datacloud_spanner_remote",
    "name": "datacloud_spanner_remote",
    "type": "cloud",
    "badge": "Google Spanner",
    "command": "https://spanner.googleapis.com/mcp",
    "description": "Remote Google Cloud Spanner MCP server for database instance inspection, schema exploration, and querying.",
    "toolCount": 4,
    "tools": [
      {
        "name": "list_spanner_instances",
        "description": "Lists Spanner instances in the active Google Cloud project.",
        "required": [],
        "properties": {}
      },
      {
        "name": "list_spanner_databases",
        "description": "Lists databases within a Spanner instance.",
        "required": [
          "instanceId"
        ],
        "properties": {
          "instanceId": {
            "type": "string",
            "description": "Spanner instance ID"
          }
        }
      },
      {
        "name": "get_spanner_schema",
        "description": "Retrieves DDL schema for tables in a Spanner database.",
        "required": [
          "instanceId",
          "databaseId"
        ],
        "properties": {
          "instanceId": {
            "type": "string"
          },
          "databaseId": {
            "type": "string"
          }
        }
      },
      {
        "name": "execute_spanner_sql",
        "description": "Executes a read-only SQL query against Spanner.",
        "required": [
          "instanceId",
          "databaseId",
          "query"
        ],
        "properties": {
          "query": {
            "type": "string",
            "description": "SQL Query"
          }
        }
      }
    ]
  },
  {
    "id": "datacloud_knowledge_catalog_remote",
    "name": "datacloud_knowledge_catalog_remote",
    "type": "cloud",
    "badge": "Google Dataplex",
    "command": "https://dataplex.googleapis.com/mcp",
    "description": "Remote Dataplex & Data Catalog MCP server for discovering enterprise assets, data governance rules, and column lineage.",
    "toolCount": 3,
    "tools": [
      {
        "name": "search_data_assets",
        "description": "Searches Dataplex and Knowledge Catalog for datasets and tables.",
        "required": [
          "query"
        ],
        "properties": {
          "query": {
            "type": "string",
            "description": "Asset search query"
          }
        }
      },
      {
        "name": "get_asset_metadata",
        "description": "Retrieves governance tags and schema metadata for an asset.",
        "required": [
          "assetId"
        ],
        "properties": {
          "assetId": {
            "type": "string"
          }
        }
      },
      {
        "name": "get_data_lineage",
        "description": "Retrieves upstream and downstream data lineage links.",
        "required": [
          "assetId"
        ],
        "properties": {
          "assetId": {
            "type": "string"
          }
        }
      }
    ]
  }
];

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
      itemCountBadge.textContent = `${SKILLS_DATA.length} Skills`;
    } else if (currentView === 'mcpView') {
      const totalTools = MCP_SERVERS_DATA.reduce((acc, s) => acc + s.toolCount, 0);
      itemCountBadge.textContent = `${MCP_SERVERS_DATA.length} Servers (${totalTools} Tools)`;
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
        card.innerHTML = `
          <div class="card-top">
            <div class="card-header-row">
              <span class="skill-name">${skill.name}</span>
              <span class="badge">${skill.badge}</span>
            </div>
            <div class="skill-trigger">
              <strong>Natural Language Trigger:</strong>
              ${skill.trigger}
            </div>
          </div>
          <div class="card-bottom">
            <span class="command-tag">${skill.command}</span>
            <span class="view-link">View Spec →</span>
          </div>
        `;
        card.addEventListener('click', () => openSkillModal(skill));
        skillsGrid.appendChild(card);
      });
    }
  }

  function openSkillModal(skill) {
    modalTitle.textContent = skill.name;
    modalCategory.textContent = skill.badge;
    modalCategory.className = 'badge';
    modalBody.innerHTML = `
      <h4>Overview</h4>
      <p>${skill.description}</p>
      
      <h4>Natural Language Trigger Condition</h4>
      <p><code>${skill.trigger}</code></p>
      
      <h4>Command / Invocation</h4>
      <pre><code>${skill.command}</code></pre>
      
      <h4>Implementation Details & Rules</h4>
      <pre><code>${skill.details}</code></pre>
    `;
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
        const toolsChipsHtml = toolsSlice.map(t => `<span class="tool-chip">${t.name}</span>`).join('') + 
          (remaining > 0 ? `<span class="tool-chip more">+${remaining} more</span>` : '');

        card.innerHTML = `
          <div class="card-top">
            <div class="card-header-row">
              <span class="server-name">${server.name}</span>
              <span class="badge ${server.type}">${server.type.toUpperCase()} (${server.toolCount})</span>
            </div>
            <p class="server-description">${server.description}</p>
            <div class="server-tools-preview">
              ${toolsChipsHtml}
            </div>
          </div>
          <div class="card-bottom">
            <span class="command-tag" title="${server.command}">${server.command}</span>
            <span class="view-link">Explore Tools →</span>
          </div>
        `;
        card.addEventListener('click', () => openMcpModal(server));
        mcpGrid.appendChild(card);
      });
    }
  }

  function openMcpModal(server) {
    modalTitle.textContent = server.name;
    modalCategory.textContent = `${server.type.toUpperCase()} • ${server.toolCount} TOOLS`;
    modalCategory.className = `badge ${server.type}`;

    const toolsAccordionHtml = server.tools.map(tool => {
      const requiredList = tool.required && tool.required.length > 0 
        ? tool.required.map(r => `<strong style="color:var(--warning)">${r}*</strong>`).join(', ')
        : 'None (Optional)';
      
      const propsKeys = Object.keys(tool.properties || {});
      const propsHtml = propsKeys.length > 0
        ? propsKeys.map(k => `<div><code>${k}</code> (${tool.properties[k].type || 'any'}): ${tool.properties[k].description || ''}</div>`).join('')
        : '<div>No extra parameters required</div>';

      const exampleCall = JSON.stringify({
        ServerName: server.name,
        ToolName: tool.name,
        Arguments: propsKeys.reduce((acc, k) => {
          acc[k] = tool.properties[k].type === 'integer' ? 1 : (tool.properties[k].type === 'boolean' ? true : "example");
          return acc;
        }, {})
      }, null, 2);

      return `
        <div class="tool-item">
          <div class="tool-item-header">
            <span class="tool-item-name">${tool.name}</span>
            <button class="copy-btn" onclick="navigator.clipboard.writeText('${tool.name}')">Copy Name</button>
          </div>
          <div class="tool-item-desc">${tool.description}</div>
          <div class="tool-params-list">
            <div style="margin-bottom:4px;"><strong>Required Params:</strong> ${requiredList}</div>
            <div style="margin-bottom:6px;"><strong>Schema Properties:</strong></div>
            <div style="padding-left:8px; display:flex; flex-direction:column; gap:2px;">${propsHtml}</div>
          </div>
        </div>
      `;
    }).join('');

    modalBody.innerHTML = `
      <h4>Server Description</h4>
      <p>${server.description}</p>
      
      <h4>Transport & Command / URL</h4>
      <pre><code>${server.command}</code></pre>
      
      <h4>Config JSON Snippet (~/.gemini/config/mcp_config.json)</h4>
      <pre><code>"${server.name}": {
  "command": "${server.command.split(' ')[0]}",
  "args": ${JSON.stringify(server.command.split(' ').slice(1))}
}</code></pre>

      <h4>Available Tools (${server.toolCount})</h4>
      <div class="tools-accordion">
        ${toolsAccordionHtml}
      </div>
    `;
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
  const MASTER_PROMPT_TEXT = `# MISSION BRIEFING & GLOBAL WORKFLOW ACTIVATION

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
1. PHASE 1: Socratic Grilling (/grill-me & /gsd-spec-phase) - Relentless Socratic interview resolving ambiguities and edge cases before code.
2. PHASE 2: Phase Planning & Goal-Backward Verification (/gsd-plan-phase) - Generate wave-parallelized executable plans and verify against goals. User reviews and approves PLAN.md (Human Gate 1) before code authoring begins.
3. PHASE 3: The Ponytail Anti-Bloat Gate (ponytail) - Climb Levels 1 to 6 (YAGNI -> Stdlib -> Platform -> Dependency -> One-Liner -> Minimal Code).
4. PHASE 4: Cognitive Reasoning & Surgical TDD (sequential-thinking & tdd) - Plan thought steps, write failing tests first, make surgical diffs.
5. PHASE 5: Deterministic Fleet Loop (verify.ps1 & fleet-loop) - mypy/tsc static checks, unit tests, max 3 test-fix retry circuit breaker.
6. PHASE 6: Safe Delivery & PR Opening (commit-and-push & github) - Atomic conventional commits and verified PR creation.

## MY GOAL / TASK:
[INSERT YOUR FEATURE, TASK, OR PROJECT DESCRIPTION HERE]`;

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
