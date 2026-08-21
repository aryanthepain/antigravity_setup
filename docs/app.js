// Antigravity Skills & Workflow Directory Data & Logic

const SKILLS_DATA = [
  // Core Engineering & Rules
  {
    name: "global_rules",
    category: "core",
    badge: "Always On",
    trigger: "Always active in every Antigravity session.",
    description: "Enforces Affirm 1-Task 1-PR delivery contract, single-agent default, Ponytail ladder, Karpathy surgical edits, and Fleet loop 3-retry bounds.",
    command: "Always active (~/.gemini/config/rules/global_rules.md)",
    details: "1. Affirm Contract: 1 Task -> 1 Agent Session -> 1 PR.\n2. Single Agent Default: 1 agent for normal tasks; subagents only for parallelism/sandbox.\n3. Ponytail Ladder: YAGNI -> Stdlib -> Platform -> Dependency -> One-Liner -> Minimal Code.\n4. Karpathy Grounding: Think first, surgical edits, goal-driven tests.\n5. Deterministic Verification: verify.ps1 with max 3 retry attempts."
  },
  {
    name: "ponytail",
    category: "core",
    badge: "Anti-Bloat",
    trigger: "Before writing any code, adding dependencies, or creating abstractions.",
    description: "Enforces the 'laziest senior developer' decision ladder to eliminate over-engineering and dependency bloat.",
    command: "Rule / Skill",
    details: "Climbs 6 levels before writing code:\n- Level 1: Does this need to exist? (YAGNI)\n- Level 2: Does Python/JS standard library do it?\n- Level 3: Is there a native browser or platform feature?\n- Level 4: Is there an existing project package?\n- Level 5: Can it be a clean one-liner?\n- Level 6: Minimal surgical implementation."
  },
  {
    name: "karpathy-skills",
    category: "core",
    badge: "Behavioral",
    trigger: "When writing, reviewing, or refactoring code to prevent LLM sloppiness.",
    description: "Encodes Andrej Karpathy's 4 core disciplines: Think before coding, Simplicity first, Surgical changes, and Goal-driven verification.",
    command: "Rule / Skill",
    details: "- Think Before Coding: State assumptions explicitly. Surface tradeoffs before editing. Stop and ask if ambiguous.\n- Simplicity First: Minimum code that solves the issue. No speculative configurability.\n- Surgical Changes: Touch ONLY lines necessary for the test. Never reformat adjacent code.\n- Goal-Driven Execution: Transform tasks into automated tests."
  },
  {
    name: "code-review",
    category: "core",
    badge: "Static Review",
    trigger: "Before finalizing PRs or diffs to catch regressions and unnecessary code.",
    description: "Adversarial code review pass verifying compliance with Ponytail simplicity, Karpathy surgical constraints, and clean diffs.",
    command: "/code-review",
    details: "Performs AST and line-by-line review of git diffs, checking for:\n- Orphaned imports or unreferenced variables\n- Speculative abstractions or wrapper bloat\n- Accidental formatting churn\n- Missing edge-case test coverage"
  },
  {
    name: "subagent-orchestrator",
    category: "core",
    badge: "Orchestration",
    trigger: "When large tasks benefit from parallelism across isolated git worktrees.",
    description: "Decomposes complex epics into parallel subagents running in isolated physical directories.",
    command: "/subagent-orchestrator",
    details: "Spawns scoped subagents with fresh contexts and narrow toolsets. Never run parallel agents on a dirty single branch."
  },

  // Workflow & Planning
  {
    name: "grill-me",
    category: "workflow",
    badge: "Specification",
    trigger: "When clarifying a new feature brief, resolving ambiguous requirements, or stress-testing a design.",
    description: "Relentless Socratic interview walking down the decision tree one-by-one with recommended answers before code is touched.",
    command: "/grill-me",
    details: "Walks down each branch of the design tree, resolving dependencies between decisions one-by-one. Captured decisions are written to brief/grilling outcomes for downstream PRD authoring."
  },
  {
    name: "write-a-brief",
    category: "workflow",
    badge: "Scoping",
    trigger: "When initiating a new feature, phase, or weekly sprint milestone.",
    description: "Generates structured first-person scoping memos in briefs/<N>-<slug>.md with frontmatter handoff contracts.",
    command: "Skill / Workflow",
    details: "Asks 3-5 focused questions, creates brief frontmatter (slug, title, stage, branch, prd), and sets initial stage to 'new'."
  },
  {
    name: "write-a-prd",
    category: "workflow",
    badge: "PRD",
    trigger: "When turning a grilled brief into a complete Product Requirements Document.",
    description: "Authors comprehensive PRDs in prd/<slug>.md with assumptions, problem statements, extensive user stories, and testing decisions.",
    command: "Skill / Workflow",
    details: "Follows grilling outcomes to draft assumptions, solution architecture, deep module interfaces, and testing decisions."
  },
  {
    name: "critique",
    category: "workflow",
    badge: "Review",
    trigger: "When stress-testing a newly drafted PRD before breaking it into actionable issues.",
    description: "Acts as an LLM-as-a-judge on freshly written PRDs to identify logical gaps, missing edge cases, and architectural risks.",
    command: "Skill / Workflow",
    details: "Emits a structured gaps file that can be reviewed and applied back to the PRD."
  },
  {
    name: "prd-to-issues",
    category: "workflow",
    badge: "Issue Breakdown",
    trigger: "When decomposing an approved PRD into independently workable atomic issues.",
    description: "Transforms PRD user stories into atomic markdown issues in issues/NNN-<slug>.md with AFK/HITL classification.",
    command: "Skill / Workflow",
    details: "Numbers issues sequentially and writes acceptance criteria, target test commands, and dependency blocks."
  },

  // Testing & Verification
  {
    name: "fleet-loop",
    category: "testing",
    badge: "Adaptive Loop",
    trigger: "When executing code changes and running test-fix cycles autonomously.",
    description: "Bounded 4-stage adaptive verification ladder (Static/Types -> Targeted Tests -> Full Suite -> AST Diff) with 3-retry circuit breaker.",
    command: "/fleet-loop",
    details: "1. Red: Run targeted failing test.\n2. Green: Apply minimal surgical patch.\n3. Verify: tsc/mypy -> targeted pytest/vitest -> full regression suite.\n4. Circuit Breaker: Max 3 retry attempts. If attempt 3 fails, stops and escalates to human."
  },
  {
    name: "tdd",
    category: "testing",
    badge: "TDD",
    trigger: "When building features or fixing bugs using strict test-driven development.",
    description: "Enforces Red -> Green -> Refactor cycle for both Python backend and TypeScript/React frontend.",
    command: "/tdd",
    details: "Forces writing or running the failing test first, implementing the minimal code to pass, and refactoring cleanly."
  },
  {
    name: "verify.ps1",
    category: "testing",
    badge: "Deterministic Gate",
    trigger: "Local CLI test gate verifying Python or TypeScript projects with zero token cost.",
    description: "PowerShell script detecting repository type and executing static typing and test suites.",
    command: "pwsh -File ./scripts/verify.ps1 [-Quick]",
    details: "Runs mypy/tsc static analysis followed by pytest/npm test. Returns exit code 0 on success, 1 on failure."
  },

  // Security & Sandboxing
  {
    name: "security-sandbox-review",
    category: "security",
    badge: "Sandbox Pen-Test",
    trigger: "When modifying auth, tokens, crypto, API endpoints, SQL queries, or file uploads.",
    description: "Autonomous vulnerability assessment using SAST tooling and Strix AI penetration testing agent in an isolated worktree.",
    command: "/security-review",
    details: "Spins up an isolated git worktree, runs SAST scans, executes Strix AI dynamic exploit simulations, validates PoCs, and verifies surgical patches."
  },
  {
    name: "accidental-data-loss-prevention",
    category: "security",
    badge: "Safety Gate",
    trigger: "Before executing irreversible operations (DROP, TRUNCATE, broad DELETE, gsutil rm, project delete).",
    description: "Stop-and-verify safety guardrail requiring explicit human confirmation before destructive data operations.",
    command: "Always active rule",
    details: "Blocks destructive SQL, cloud storage deletion, and infrastructure destruction without explicit confirmation."
  },
  {
    name: "gcs-security-assessment",
    category: "security",
    badge: "Cloud Security",
    trigger: "When assessing security posture, IAM permissions, and SAIF compliance for Google Cloud Storage.",
    description: "Assesses security posture, public access prevention, and SAIF compliance for Cloud Storage buckets.",
    command: "Skill",
    details: "Scans GCS bucket IAM policies, public access settings, encryption configurations, and lifecycle rules."
  },

  // Task & Notion Sync
  {
    name: "notion-sync",
    category: "integration",
    badge: "Notion Kanban",
    trigger: "When syncing tasks, sprint statuses, branches, and PR links with Notion.",
    description: "Bidirectional synchronization between local tasks/briefs/WORKING.md and your Notion Task Board Kanban via Notion MCP.",
    command: "Skill / Notion MCP",
    details: "Maps Notion Kanban stages: Backlog -> Ready -> In Progress -> In Review -> Done. Terminal state for agent is 'In Review'; only human merges and moves to 'Done'."
  },
  {
    name: "create-task",
    category: "integration",
    badge: "Task Capture",
    trigger: "When capturing a new task, idea, or bug into the task board.",
    description: "Creates and categorizes a new task card with sizing (S/M/L) and mode (AFK/HITL).",
    command: "Skill",
    details: "Writes a structured task card with acceptance criteria and links to the Notion database."
  },
  {
    name: "agent-alarm",
    category: "integration",
    badge: "Notifications",
    trigger: "When running long background tasks and wanting timer notifications instead of polling.",
    description: "Sets one-shot timer or recurring cron notifications via /schedule tool.",
    command: "/schedule",
    details: "Eliminates token-wasting polling loops by scheduling reactive notifications on task completion."
  },

  // Project Scaffolding
  {
    name: "init-project",
    category: "scaffolding",
    badge: "Scaffolder",
    trigger: "When creating a new project or onboarding an existing repository to Antigravity.",
    description: "One-command bootstrapping for AGENTS.md, CONSTITUTION.md, WORKING.md, .agents/rules, and git pre-commit verification hooks.",
    command: "pwsh -File ./scripts/init-project.ps1",
    details: "Scaffolds complete directory structure, links global rules, copies verification scripts, and configures core.hooksPath = .githooks."
  },
  {
    name: "commit-and-push",
    category: "scaffolding",
    badge: "Git Flow",
    trigger: "When staging, committing, or pushing code safely to remote branches.",
    description: "Groups changes into logically scoped, conventional commits and pushes safely with upstream configuration.",
    command: "Skill",
    details: "Never force pushes without explicit confirmation. Enforces conventional commit formatting."
  },

  // Data & Google Cloud
  {
    name: "bigquery-sql",
    category: "cloud",
    badge: "SQL Tuning",
    trigger: "When optimizing BigQuery SQL queries, partitioning, clustering, or reducing query scan costs.",
    description: "BigQuery SQL query optimization, execution best practices, and performance tuning rules.",
    command: "Skill",
    details: "Optimizes query slot usage, prevents full-table scans with partition filters, and avoids SELECT *."
  },
  {
    name: "bigquery-ai-ml",
    category: "cloud",
    badge: "ML & GenAI",
    trigger: "When writing BigQuery ML forecasting, outlier detection, or Gemini SQL models.",
    description: "BigQuery built-in machine learning and GenAI capabilities for in-database analytics.",
    command: "Skill",
    details: "Generates CREATE MODEL statements, ARIMA_PLUS time series forecasts, and ML.GENERATE_TEXT queries."
  },
  {
    name: "dataform-bigquery",
    category: "cloud",
    badge: "Dataform",
    trigger: "When creating or modifying Dataform SQLX pipeline definitions for BigQuery ELT.",
    description: "Generates clean, correct Dataform SQLX transformations, assertions, and source declarations.",
    command: "Skill",
    details: "Configures workflow_settings.yaml, creates incremental models, and writes automated data quality assertions."
  },
  {
    name: "dbt-bigquery",
    category: "cloud",
    badge: "dbt",
    trigger: "When authoring, optimizing, or debugging dbt models on BigQuery.",
    description: "Expert guidance for creating and troubleshooting dbt projects and Jinja models on BigQuery.",
    command: "Skill",
    details: "Configures dbt_project.yml, writes schema.yml tests, and optimizes incremental materializations."
  },
  {
    name: "gcp-data-pipelines",
    category: "cloud",
    badge: "Orchestration",
    trigger: "When designing data pipelines across Dataflow, Spark, Dataform, or Cloud Composer.",
    description: "Primary entry point for architecting and orchestrating GCP data ingestion and transformation pipelines.",
    command: "Skill",
    details: "Guides selection between Beam/Dataflow, Spark/Dataproc, Dataform, and Composer DAGs."
  },
  {
    name: "gcp-spark",
    category: "cloud",
    badge: "Spark",
    trigger: "When writing PySpark or Scala Spark jobs on Dataproc Serverless or Clusters.",
    description: "Develops and executes Spark ETL and ML code using BigLake Iceberg catalogs and BigQuery.",
    command: "Skill",
    details: "Configures Dataproc Serverless batches, optimizes shuffle partitions, and debugs Spark OOM errors."
  },
  {
    name: "gcp-dataflow",
    category: "cloud",
    badge: "Apache Beam",
    trigger: "When building streaming or batch Apache Beam pipelines on Google Cloud Dataflow.",
    description: "Guides packaging, executing, and troubleshooting Apache Beam pipelines and Flex Templates.",
    command: "Skill",
    details: "Diagnoses streaming job backpressure, watermarks, autoscaling limits, and windowing triggers."
  },
  {
    name: "discovering-gcp-data-assets",
    category: "cloud",
    badge: "Data Discovery",
    trigger: "When finding, exploring, or inspecting datasets, BigQuery tables, or Spanner schemas in GCP.",
    description: "Inspects metadata, schemas, and governance policies for Google Cloud data assets.",
    command: "Skill",
    details: "Retrieves table schemas, column descriptions, and partitioning information without expensive CLI queries."
  },

  // Web & Chrome DevTools
  {
    name: "chrome-devtools",
    category: "devtools",
    badge: "DevTools MCP",
    trigger: "When debugging web pages, inspecting network traffic, or automating browser tests.",
    description: "Uses Chrome DevTools via MCP for live page inspection, console debugging, and network analysis.",
    command: "Skill / MCP",
    details: "Inspects live DOM, captures screenshots, monitors network payloads, and evaluates JS expressions."
  },
  {
    name: "a11y-debugging",
    category: "devtools",
    badge: "Accessibility",
    trigger: "When testing accessibility (a11y), ARIA labels, contrast, and keyboard navigation.",
    description: "Performs accessibility audits based on web.dev and WCAG 2.2 guidelines using DevTools.",
    command: "Skill",
    details: "Checks color contrast ratios, focus rings, screen reader landmarks, and touch target sizes."
  },
  {
    name: "debug-optimize-lcp",
    category: "devtools",
    badge: "Performance",
    trigger: "When optimizing Largest Contentful Paint (LCP), Core Web Vitals, or page load speed.",
    description: "Diagnoses and optimizes Largest Contentful Paint and rendering bottlenecks.",
    command: "Skill",
    details: "Identifies LCP element, resource load delays, render-blocking scripts, and image fetch priorities."
  },
  {
    name: "memory-leak-debugging",
    category: "devtools",
    badge: "Memory",
    trigger: "When diagnosing high memory usage, Node.js/JS memory leaks, or heap snapshots.",
    description: "Analyzes heap snapshots, retained DOM elements, and uncleaned event listeners.",
    command: "Skill",
    details: "Guides heap differential analysis, identifying detached DOM nodes and closure memory leaks."
  },
  {
    name: "modern-web-guidance",
    category: "devtools",
    badge: "Frontend Best Practices",
    trigger: "When building modern HTML/CSS/JS interfaces, animations, container queries, or dialogs.",
    description: "Authoritative reference for modern CSS (subgrid, :has, popovers) and client-side web APIs.",
    command: "Skill",
    details: "Prevents outdated CSS patterns; guides View Transitions, container queries, and native popover APIs."
  },
  {
    name: "chrome-extensions",
    category: "devtools",
    badge: "Extensions",
    trigger: "When creating, debugging, or publishing Chrome Extensions with Manifest V3.",
    description: "Manifest V3 best practices, service workers, content scripts, and Web Store publishing guidance.",
    command: "Skill",
    details: "Configures manifest.json, declarativeNetRequest, side panels, and handles Chrome Web Store reviews."
  },

  // Flutter & Dart
  {
    name: "dart-run-static-analysis",
    category: "flutter",
    badge: "Dart Analysis",
    trigger: "When running dart analyze or dart fix across Flutter/Dart codebases.",
    description: "Executes static analysis to identify warnings and applies mechanical lint fixes.",
    command: "Skill",
    details: "Runs dart analyze and dart fix --apply to resolve lints before committing."
  },
  {
    name: "dart-add-unit-test",
    category: "flutter",
    badge: "Dart Tests",
    trigger: "When writing unit tests for Dart classes and business logic using package:test.",
    description: "Structures unit tests for functions, state models, and services.",
    command: "Skill",
    details: "Uses package:test and package:checks to create regression-free test suites."
  },
  {
    name: "flutter-add-widget-test",
    category: "flutter",
    badge: "Widget Testing",
    trigger: "When validating UI component rendering and interactions with WidgetTester.",
    description: "Component-level testing verifying widget rendering, taps, scrolls, and text inputs.",
    command: "Skill",
    details: "Uses testWidgets, find.byType, and tester.pumpAndSettle to assert widget state."
  },
  {
    name: "flutter-fix-layout-issues",
    category: "flutter",
    badge: "Layout Fixes",
    trigger: "When resolving 'RenderFlex overflowed' or unbounded height/width constraints.",
    description: "Fixes Flutter constraint layout errors, viewport exceptions, and overflow bugs.",
    command: "Skill",
    details: "Applies Flexible, Expanded, SingleChildScrollView, and LayoutBuilder to solve overflow issues."
  },
  {
    name: "flutter-build-responsive-layout",
    category: "flutter",
    badge: "Responsive UI",
    trigger: "When adapting Flutter layouts across mobile, tablet, desktop, and web screen sizes.",
    description: "Architects adaptive Flutter UI using MediaQuery, LayoutBuilder, and breakpoint systems.",
    command: "Skill",
    details: "Implements clean multi-column layouts and adaptive scaffold navigation bars."
  },

  // Science & Bio
  {
    name: "alphafold-database-fetch-and-analyze",
    category: "science",
    badge: "AlphaFold",
    trigger: "When analyzing AlphaFold 3D protein structures by UniProt Accession ID.",
    description: "Fetches and analyzes structural confidence (pLDDT) and domain boundaries from AlphaFold DB.",
    command: "Skill",
    details: "Retrieves mmCIF structures, calculates mean pLDDT per domain, and identifies disordered regions."
  },
  {
    name: "alphagenome-single-variant-analysis",
    category: "science",
    badge: "Genomics",
    trigger: "When analyzing genetic variant effects on gene expression, chromatin, and splicing.",
    description: "AlphaGenome API integration for predicting non-coding variant functional impact.",
    command: "Skill",
    details: "Analyzes variants in chr:pos:ref>alt format across tissue-specific UBERON ontologies."
  },
  {
    name: "chembl-database",
    category: "science",
    badge: "Cheminformatics",
    trigger: "When querying bioactive molecules, IC50/Ki values, drug targets, or SMILES structures.",
    description: "Queries the ChEMBL bioactivity database for target assays and approved compounds.",
    command: "Skill",
    details: "Performs substructure/similarity searches, fetches bioactivity records, and maps mechanism of action."
  },
  {
    name: "clinical-trials-database",
    category: "science",
    badge: "Clinical Trials",
    trigger: "When searching clinical trials by condition, drug, NCT ID, phase, or sponsor.",
    description: "Queries ClinicalTrials.gov API v2 for trial eligibility criteria and recruitment status.",
    command: "Skill",
    details: "Filters trials by phase, recruitment status, intervention name, and retrieves protocol details."
  },
  {
    name: "pdb-database",
    category: "science",
    badge: "Structural Bio",
    trigger: "When downloading or searching experimental 3D macromolecular structures (PDB).",
    description: "Searches the Protein Data Bank (PDB) by sequence similarity, ligands, or resolution.",
    command: "Skill",
    details: "Retrieves crystallographic/cryo-EM metadata, bound ligands, and coordinates in mmCIF format."
  },
  {
    name: "pubchem-database",
    category: "science",
    badge: "Chemistry",
    trigger: "When looking up chemical properties, SMILES, CID, IUPAC names, or molecular weights.",
    description: "Queries PubChem database for compound safety data, 2D/3D structures, and synonyms.",
    command: "Skill",
    details: "Fetches physicochemical properties, molecular formulas, and related bioassays."
  },
  {
    name: "pubmed-database",
    category: "science",
    badge: "Literature",
    trigger: "When searching biomedical literature, citations, or NCBI PubMed abstracts.",
    description: "Queries NCBI PubMed and PMC for peer-reviewed medical and life sciences research.",
    command: "Skill",
    details: "Performs MeSH term searches, retrieves PMC open-access full text, and extracts citation metadata."
  }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  const skillsGrid = document.getElementById('skillsGrid');
  const skillSearch = document.getElementById('skillSearch');
  const categoryPills = document.querySelectorAll('.category-pills .pill');
  const totalSkillsBadge = document.getElementById('totalSkillsBadge');
  const noResults = document.getElementById('noResults');

  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalBody = document.getElementById('modalBody');

  let activeCategory = 'all';
  let activeQuery = '';

  // Render Total Count
  totalSkillsBadge.textContent = `${SKILLS_DATA.length} Available Skills`;

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

  // Render Cards
  function renderSkills() {
    skillsGrid.innerHTML = '';
    const filtered = SKILLS_DATA.filter(skill => {
      const matchCategory = activeCategory === 'all' || skill.category === activeCategory;
      const q = activeQuery.toLowerCase().trim();
      const matchQuery = !q || 
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.trigger.toLowerCase().includes(q) ||
        skill.command.toLowerCase().includes(q);
      
      return matchCategory && matchQuery;
    });

    if (filtered.length === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
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
              <strong>When to use:</strong>
              ${skill.trigger}
            </div>
          </div>
          <div class="card-bottom">
            <span class="command-tag">${skill.command}</span>
            <span class="view-link">Details →</span>
          </div>
        `;
        card.addEventListener('click', () => openSkillModal(skill));
        skillsGrid.appendChild(card);
      });
    }
  }

  // Open Modal
  function openSkillModal(skill) {
    modalTitle.textContent = skill.name;
    modalCategory.textContent = skill.badge;
    modalBody.innerHTML = `
      <h4>Overview</h4>
      <p>${skill.description}</p>
      
      <h4>Trigger Condition</h4>
      <p><code>${skill.trigger}</code></p>
      
      <h4>Command / Invocation</h4>
      <pre><code>${skill.command}</code></pre>
      
      <h4>Implementation Details & Rules</h4>
      <pre><code>${skill.details}</code></pre>
    `;
    modalBackdrop.classList.add('open');
  }

  // Close Modal
  modalClose.addEventListener('click', () => {
    modalBackdrop.classList.remove('open');
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('open');
    }
  });

  // Filter Categories
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      renderSkills();
    });
  });

  // Search Input
  skillSearch.addEventListener('input', (e) => {
    activeQuery = e.target.value;
    renderSkills();
  });

  // Global Quick Query Helper
  window.filterByQuery = (q) => {
    skillSearch.value = q;
    activeQuery = q;
    renderSkills();
    skillSearch.focus();
  };

  // Reset Filters Helper
  window.resetFilters = () => {
    skillSearch.value = '';
    activeQuery = '';
    activeCategory = 'all';
    categoryPills.forEach(p => p.classList.remove('active'));
    categoryPills[0].classList.add('active');
    renderSkills();
  };

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrop.classList.remove('open');
    }
    if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && document.activeElement !== skillSearch) {
      e.preventDefault();
      skillSearch.focus();
      skillSearch.select();
    }
  });

  // Initial Render
  renderSkills();
});
