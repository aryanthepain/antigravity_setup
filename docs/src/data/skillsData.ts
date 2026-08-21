export interface Skill {
  name: string;
  category: 'core' | 'workflow' | 'testing' | 'security' | 'integration' | 'scaffolding' | 'cloud' | 'devtools' | 'flutter' | 'science';
  badge: string;
  trigger: string;
  description: string;
  command: string;
  details: string;
  antiTriggers?: string;
  sourceFile?: string;
}

export const SKILL_CATEGORIES = [
  { id: 'all', label: 'All Skills', icon: '⚡' },
  { id: 'core', label: 'Core Engineering', icon: '🧠' },
  { id: 'workflow', label: 'Workflow & Planning', icon: '📋' },
  { id: 'testing', label: 'Testing & Verification', icon: '🧪' },
  { id: 'security', label: 'Security & Sandbox', icon: '🛡️' },
  { id: 'integration', label: 'Task & Notion Sync', icon: '🔄' },
  { id: 'scaffolding', label: 'Project Scaffolding', icon: '🏗️' },
  { id: 'cloud', label: 'Data & Google Cloud', icon: '☁️' },
  { id: 'devtools', label: 'Web & Chrome DevTools', icon: '🌐' },
  { id: 'flutter', label: 'Flutter & Dart', icon: '📱' },
  { id: 'science', label: 'Science & Bio', icon: '🔬' },
] as const;

export const SKILLS_DATA: Skill[] = [
  // CORE
  {
    name: "global_rules",
    category: "core",
    badge: "Always On",
    trigger: "Always active in every session. Triggers on any coding, planning, or execution task.",
    description: "Enforces Affirm 1-Task 1-PR delivery contract, single-agent default, Ponytail ladder, Karpathy surgical edits, and Fleet loop 3-retry bounds.",
    command: "Always active (~/.gemini/config/rules/global_rules.md)",
    details: "1. Affirm Contract: 1 Task -> 1 Agent Session -> 1 PR.\n2. Single Agent Default: 1 agent for normal tasks; subagents only for parallelism/sandbox.\n3. Ponytail Ladder: YAGNI -> Stdlib -> Platform -> Dependency -> One-Liner -> Minimal Code.\n4. Karpathy Grounding: Think first, surgical edits, goal-driven tests.\n5. Deterministic Verification: verify.ps1 with max 3 retry attempts.\n6. Skill Authoring: Natural language trigger descriptions.",
    antiTriggers: "Never disable global invariants.",
    sourceFile: "~/.gemini/config/rules/global_rules.md"
  },
  {
    name: "ponytail",
    category: "core",
    badge: "Anti-Bloat",
    trigger: "Trigger on mentions of: 'ponytail', 'anti-bloat', 'make it minimal', 'simplest implementation', 'avoid over-engineering', 'YAGNI', 'use standard library', 'don't add dependencies', or 'keep diff small'.",
    description: "Enforces the 6-level 'laziest senior developer' decision ladder to eliminate code bloat, unnecessary dependencies, and speculative abstractions before writing code.",
    command: "Rule / Skill",
    details: "Climbs 6 levels before writing code:\n- Level 1: Does this need to exist? (YAGNI)\n- Level 2: Does Python/JS standard library do it?\n- Level 3: Is there a native browser or platform feature?\n- Level 4: Is there an existing project package?\n- Level 5: Can it be a clean one-liner?\n- Level 6: Minimal surgical implementation.",
    antiTriggers: "Do NOT use when writing complex architectural blueprints that explicitly mandate external frameworks.",
    sourceFile: "~/.gemini/config/skills/ponytail/SKILL.md"
  },
  {
    name: "karpathy-skills",
    category: "core",
    badge: "Behavioral",
    trigger: "Trigger on mentions of: 'karpathy', 'think before coding', 'simplicity first', 'surgical changes', 'surgical edits', 'keep diffs small', 'avoid churn', or 'goal-driven execution'.",
    description: "Encodes Andrej Karpathy's 4 core disciplines: Think before coding, Simplicity first, Surgical changes, and Goal-driven verification.",
    command: "Rule / Skill",
    details: "- Think Before Coding: State assumptions explicitly. Surface tradeoffs before editing. Stop and ask if ambiguous.\n- Simplicity First: Minimum code that solves the issue. No speculative configurability.\n- Surgical Changes: Touch ONLY lines necessary for the test. Never reformat adjacent code.\n- Goal-Driven Execution: Transform tasks into automated tests.",
    sourceFile: "~/.gemini/config/skills/karpathy-skills/SKILL.md"
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

  // WORKFLOW
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

  // TESTING
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

  // SECURITY
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

  // INTEGRATION
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
    name: "commit-and-push",
    category: "integration",
    badge: "Git Flow",
    trigger: "Trigger on mentions of: 'commit changes', 'save to git', 'push to origin', 'commit and push', 'ship changes', or 'publish branch'.",
    description: "Surgically stages, commits with conventional commit messages, and pushes safe branch updates.",
    command: "Skill",
    details: "Verifies git status, ensures branch matches brief/<slug>, stages modified files, writes descriptive commit messages, and sets upstream."
  },

  // SCAFFOLDING
  {
    name: "google-antigravity-sdk",
    category: "scaffolding",
    badge: "Agent SDK",
    trigger: "Trigger on mentions of: 'google antigravity sdk', 'build agent with antigravity', 'multi-agent orchestration sdk', or 'antigravity python sdk'.",
    description: "Designs, implements, and debugs autonomous AI agents and multi-agent systems using the Google Antigravity (AGY) SDK.",
    command: "Skill",
    details: "Covers agent creation, tool registration, memory persistence, human-in-the-loop gates, and subagent hierarchies."
  },
  {
    name: "agy-customizations",
    category: "scaffolding",
    badge: "Customization System",
    trigger: "Trigger on mentions of: 'agy customizations', 'create a skill', 'write a rule', 'build a plugin', 'mcp config', or 'hook system'.",
    description: "Comprehensive guide for creating skills, rules, plugins, hooks, and MCP servers in Antigravity.",
    command: "Skill",
    details: "Explains global vs workspace roots, SKILL.md frontmatter syntax, natural language triggers, and plugin manifests."
  },
  {
    name: "workflow-skill-creator",
    category: "scaffolding",
    badge: "Skill Creator",
    trigger: "Trigger on mentions of: 'make this a skill', 'create a skill from what we did', 'package this workflow', or 'distill workflow into skill'.",
    description: "Distills a completed user workflow or interaction into a reusable, self-contained agent skill.",
    command: "Skill",
    details: "Extracts triggers, tool invocations, and invariants from session transcripts to write new SKILL.md packages."
  },

  // CLOUD
  {
    name: "bigquery-sql",
    category: "cloud",
    badge: "Query Optimization",
    trigger: "Trigger on mentions of: 'optimize bigquery sql', 'reduce bq cost', 'tune sql query', 'bigquery partition prune', or 'bigquery execution plan'.",
    description: "BigQuery SQL query optimization, partition pruning, clustering strategy, and cost-reduction best practices.",
    command: "Skill",
    details: "Guides SQL syntax, window functions, QUALIFY clause, materialized views, and partition filtering."
  },
  {
    name: "bigquery-ai-ml",
    category: "cloud",
    badge: "In-DB ML",
    trigger: "Trigger on mentions of: 'bigquery ml', 'bqml', 'train model in bigquery', 'time series forecast bigquery', or 'bigquery genai functions'.",
    description: "Leverages BigQuery's built-in ML and GenAI capabilities (ML.GENERATE_TEXT, ML.FORECAST, ML.DETECT_ANOMALIES).",
    command: "Skill",
    details: "Provides SQL patterns for training ARIMA_PLUS models, KMeans clustering, and calling Gemini endpoints directly from SQL."
  },
  {
    name: "data-autocleaning",
    category: "cloud",
    badge: "ETL Quality",
    trigger: "Trigger on mentions of: 'clean data pipeline', 'dataform auto cleaning', 'handle null values in bigquery', 'deduplicate bq table', or 'data quality check'.",
    description: "Automated data quality checks, schema casting, null imputation, and transformation pipelines for BigQuery/Dataform.",
    command: "Skill",
    details: "Implements idempotent SQL assertions, schema type enforcement, and automated outlier handling."
  },
  {
    name: "dataform-bigquery",
    category: "cloud",
    badge: "Dataform ELT",
    trigger: "Trigger on mentions of: 'dataform', 'sqlx', 'dataform pipeline', 'dataform assertions', or 'configure workflow_settings.yaml'.",
    description: "Expertise in generating clean, correct, and efficient Dataform pipeline code (SQLX) for BigQuery ELT.",
    command: "Skill",
    details: "Configures workflow_settings.yaml, dataform assertions, incremental tables, and dependency declarations."
  },
  {
    name: "dbt-bigquery",
    category: "cloud",
    badge: "dbt Core",
    trigger: "Trigger on mentions of: 'dbt bigquery', 'dbt model', 'dbt run', 'dbt macro', or 'configure dbt_project.yml'.",
    description: "Expert guidance for creating, modifying, and optimizing dbt pipelines targeting BigQuery.",
    command: "Skill",
    details: "Configures dbt profiles, incremental models, custom generic tests, and BigQuery partition configs."
  },
  {
    name: "gcp-dataflow",
    category: "cloud",
    badge: "Apache Beam",
    trigger: "Trigger on mentions of: 'dataflow', 'apache beam pipeline', 'dataflow flex template', 'streaming pipeline diagnostics', or 'beam python windowing'.",
    description: "Guides writing, packaging, executing, and troubleshooting Apache Beam pipelines on Google Cloud Dataflow.",
    command: "Skill",
    details: "Covers Java/Python/Go Beam SDKs, windowing strategies, side inputs, Flex Templates with Cloud Build, and autoscaling tuning."
  },
  {
    name: "gcp-spark",
    category: "cloud",
    badge: "Dataproc Serverless",
    trigger: "Trigger on mentions of: 'dataproc spark', 'pyspark gcp', 'dataproc serverless batch', 'query biglake iceberg with spark', or 'spark execution failure'.",
    description: "Develops and executes PySpark/Scala code on Dataproc Clusters and Dataproc Serverless.",
    command: "Skill",
    details: "Handles BigLake Iceberg catalogs, BigQuery connector optimization, Spark memory management, and debug logs."
  },
  {
    name: "building-data-apps",
    category: "cloud",
    badge: "Data Dashboards",
    trigger: "Trigger on mentions of: 'build data app', 'create analytics dashboard', 'streamlit gcp dashboard', 'react bigquery visualization', or 'chat with your data'.",
    description: "Builds modern data applications and interactive reports using React + Vite or Streamlit connected to GCP data sources.",
    command: "Skill",
    details: "Scaffolds interactive chart visualizations (ECharts/Recharts), BigQuery caching layers, and natural language query UI."
  },

  // DEVTOOLS
  {
    name: "modern-web-guidance",
    category: "devtools",
    badge: "Modern Web",
    trigger: "Trigger immediately for: Modern UI layout (dialogs, popovers, glassmorphism, container queries, :has()), View Transitions, Scroll-driven animations, CWV performance (LCP, INP), and Modern Web APIs.",
    description: "Search tool for modern web development best practices. Mandatory for HTML/CSS and client-side JS tasks.",
    command: "Skill",
    details: "Enforces 2026 web platform standards: CSS nesting, container queries, modern dialog elements, popover API, and zero unnecessary polyfills."
  },
  {
    name: "chrome-devtools",
    category: "devtools",
    badge: "DevTools MCP",
    trigger: "Trigger on mentions of: 'chrome devtools', 'inspect web page', 'inspect dom', 'capture console logs', 'take page screenshot', or 'debug web app'.",
    description: "Uses Chrome DevTools via MCP for real-time debugging, console inspection, performance profiling, and browser automation.",
    command: "Skill / Playwright MCP",
    details: "Inspects live DOM elements, captures browser screenshots, evaluates JavaScript, and audits network performance."
  },
  {
    name: "a11y-debugging",
    category: "devtools",
    badge: "Accessibility",
    trigger: "Trigger on mentions of: 'accessibility audit', 'a11y check', 'wcag compliance', 'aria labels test', 'keyboard navigation audit', or 'color contrast check'.",
    description: "Accessibility (a11y) auditing based on web.dev guidelines using Chrome DevTools MCP.",
    command: "Skill",
    details: "Evaluates screen reader compatibility, focus outlines, ARIA roles, tap target sizes, and WCAG AA/AAA contrast ratios."
  },
  {
    name: "debug-optimize-lcp",
    category: "devtools",
    badge: "Core Web Vitals",
    trigger: "Trigger on mentions of: 'lcp optimization', 'largest contentful paint', 'slow page load', 'core web vitals', or 'optimize hero render'.",
    description: "Diagnoses and optimizes Largest Contentful Paint (LCP) and render-blocking resources.",
    command: "Skill",
    details: "Identifies TTFB bottlenecks, resource load delays, render blocking CSS/JS, and applies fetchpriority and modern image formats."
  },
  {
    name: "memory-leak-debugging",
    category: "devtools",
    badge: "Heap Profiling",
    trigger: "Trigger on mentions of: 'memory leak', 'high memory usage', 'oom crash', 'analyze heap snapshot', 'javascript memory leak', or 'memlab audit'.",
    description: "Diagnoses and resolves memory leaks in JavaScript/Node.js applications using heap snapshots.",
    command: "Skill",
    details: "Takes and diffs V8 heap snapshots to identify detached DOM nodes, retained closures, and unbounded event listener arrays."
  },
  {
    name: "chrome-extensions",
    category: "devtools",
    badge: "Manifest V3",
    trigger: "Trigger on mentions of: 'chrome extension', 'manifest.json', 'content script', 'extension service worker', 'popup window', 'side panel api', or 'publish chrome extension'.",
    description: "Builds and publishes Chrome Extensions using modern Manifest V3 best practices.",
    command: "Skill",
    details: "Scaffolds background service workers, declarativeNetRequest rules, storage syncing, and Chrome Web Store packaging."
  },

  // FLUTTER & DART
  {
    name: "flutter-apply-architecture",
    category: "flutter",
    badge: "Flutter Architecture",
    trigger: "Trigger on mentions of: 'flutter architecture', 'flutter state management', 'flutter project structure', or 'flutter clean architecture'.",
    description: "Architects scalable Flutter apps using the recommended layered approach (UI -> Logic -> Data).",
    command: "Skill",
    details: "Separates presentation widgets, business logic state holders (BLoC/Riverpod/ChangeNotifier), and repository data layers."
  },
  {
    name: "flutter-add-widget-test",
    category: "flutter",
    badge: "Widget Tests",
    trigger: "Trigger on mentions of: 'flutter widget test', 'test widget rendering', 'widgettester tap test', or 'verify widget state'.",
    description: "Implements component-level tests using WidgetTester to verify UI rendering and user interactions.",
    command: "Skill",
    details: "Writes golden tests, tester.pumpAndSettle() routines, and validates finder matches."
  },
  {
    name: "flutter-fix-layout-issues",
    category: "flutter",
    badge: "RenderFlex Fix",
    trigger: "Trigger on mentions of: 'renderflex overflowed', 'unbounded height flutter', 'fix flutter overflow', or 'yellow black stripes flutter'.",
    description: "Fixes common Flutter layout errors (overflows, unbounded constraints) with surgical widget refactoring.",
    command: "Skill",
    details: "Wraps overflowing children with Expanded, Flexible, SingleChildScrollView, or LayoutBuilder."
  },
  {
    name: "dart-add-unit-test",
    category: "flutter",
    badge: "Dart Tests",
    trigger: "Trigger on mentions of: 'dart unit test', 'package:test', 'test dart class', or 'dart expect test'.",
    description: "Writes and organizes unit tests for Dart functions, methods, and classes using package:test.",
    command: "Skill",
    details: "Structures group() and test() suites with setup and teardown fixtures."
  },

  // SCIENCE & BIO
  {
    name: "alphafold-database-fetch",
    category: "science",
    badge: "Structural Bio",
    trigger: "Trigger on mentions of: 'alphafold structure', 'fetch plddt score', 'alphafold uniprot', or 'protein disorder prediction'.",
    description: "Retrieves and analyzes AlphaFold predicted structures and confidence metrics (pLDDT) for protein targets.",
    command: "Skill",
    details: "Queries AlphaFold DB API for 3D coordinates, domain boundaries, and per-residue confidence scores."
  },
  {
    name: "chembl-database",
    category: "science",
    badge: "Cheminformatics",
    trigger: "Trigger on mentions of: 'chembl query', 'bioactive molecules', 'drug target ic50', 'drug mechanism search', or 'chemical structure search'.",
    description: "Queries the ChEMBL database for bioactive molecules, drug targets, Ki/IC50 assays, and approved drugs.",
    command: "Skill",
    details: "Performs similarity and substructure searches, bioactivity filtering, and mechanism-of-action lookups."
  },
  {
    name: "pubmed-database",
    category: "science",
    badge: "Literature Search",
    trigger: "Trigger on mentions of: 'pubmed search', 'fetch scientific paper abstract', 'ncbi e-utilities', or 'biomedical literature query'.",
    description: "Searches PubMed for scientific publications, clinical trials, and extracts structured abstracts via NCBI E-utilities.",
    command: "Skill",
    details: "Builds MeSH term queries, retrieves PMIDs, fetches structured abstracts, and links citations to PubChem/UniProt."
  },
  {
    name: "literature-search-arxiv",
    category: "science",
    badge: "ArXiv Search",
    trigger: "Trigger on mentions of: 'arxiv search', 'search machine learning papers', 'fetch arxiv preprint', or 'arxiv id lookup'.",
    description: "Searches arXiv for scientific preprints, extracts metadata, abstracts, and provides direct PDF links.",
    command: "Skill",
    details: "Queries arXiv API with category filters (cs.AI, cs.LG, q-bio) and parses author affiliations and publication dates."
  }
];
