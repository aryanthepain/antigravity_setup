export interface SituationArchetype {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  iconName: string;
  color: string;
  skills: string[];
  mcps: string[];
  modelTier: string;
  ponytailLevel: number;
  subagentPolicy: 'lean-orchestrator' | 'fast-path' | 'swarm-workers';
  gate1Grilling: boolean;
  gate2Review: boolean;
  audioAlarm: boolean;
  defaultGoal: string;
  guidelines: string[];
}

export const DEFAULT_ACTIVE_SKILLS = [
  'google-antigravity-sdk',
  'grill-me',
  'critique',
  'commit-and-push',
  'tdd',
  'global_rules',
  'ponytail',
  'karpathy-skills',
  'code-review',
  'task-observer',
  'subagent-orchestrator',
  'superpowers',
  'write-a-brief',
  'write-a-prd',
  'prd-to-issues',
  'fleet-loop',
  'agy-customizations'
];

export const DEFAULT_ACTIVE_MCPS = [
  'filesystem',
  'github',
  'memory',
  'sequential-thinking'
];

export const SITUATIONS_DATA: SituationArchetype[] = [
  {
    id: 'swarm-orchestrator',
    name: 'Ultra-Lean Swarm Orchestrator',
    badge: 'Default Orchestration',
    tagline: 'Keeps Root Agent context ultra-lean (<600 tokens) while dispatching specialized CLI worker subagents.',
    iconName: 'Zap',
    color: 'from-indigo-500 to-cyan-500',
    skills: DEFAULT_ACTIVE_SKILLS,
    mcps: DEFAULT_ACTIVE_MCPS,
    modelTier: 'gemini-flash',
    ponytailLevel: 6,
    subagentPolicy: 'lean-orchestrator',
    gate1Grilling: true,
    gate2Review: true,
    audioAlarm: true,
    defaultGoal: 'Orchestrate a complex multi-file architectural refactor across services while delegating file inspection and drafting to CLI workers.',
    guidelines: [
      'The Orchestrator NEVER ingests raw multi-file search results or test logs directly into primary context.',
      'Delegate all exploration and drafting to node ./scripts/subagent.js --task <research|code|review>.',
      'Enforce deterministic verification gates and alert the human upon completion.'
    ]
  },
  {
    id: 'web-architect',
    name: 'Fullstack Web & UI Architect',
    badge: 'UI & Design',
    tagline: 'Modern accessible web apps with headless primitives (Radix/shadcn), fluid motion & zero vibe-coding templates.',
    iconName: 'Layout',
    color: 'from-cyan-500 to-blue-600',
    skills: [
      ...DEFAULT_ACTIVE_SKILLS,
      'frontend-design',
      'modern-web-guidance',
      'a11y-debugging',
      'debug-optimize-lcp'
    ],
    mcps: ['filesystem', 'github', 'memory', 'sequential-thinking', 'playwright'],
    modelTier: 'gemini-flash',
    ponytailLevel: 5,
    subagentPolicy: 'fast-path',
    gate1Grilling: true,
    gate2Review: true,
    audioAlarm: true,
    defaultGoal: 'Design and implement a responsive, accessible dashboard with obsidian glassmorphism, fluid spring transitions, and Radix UI primitives.',
    guidelines: [
      'Use headless primitives (Radix, Base UI, shadcn/ui) instead of raw unaccessible divs.',
      'Enforce high contrast, distinct focus rings, and proper keyboard navigation.',
      'Ensure silky 60fps micro-animations using declarative spring physics (motion/anime.js).'
    ]
  },
  {
    id: 'bug-hunter',
    name: 'Autonomous Bug Hunter & TDD',
    badge: 'Reliability',
    tagline: 'Root cause isolation, failing regression test reproduction, and red-green-refactor loop execution.',
    iconName: 'Bug',
    color: 'from-emerald-500 to-teal-600',
    skills: [
      ...DEFAULT_ACTIVE_SKILLS,
      'improve-codebase-architecture',
      'memory-leak-debugging',
      'accidental-data-loss-prevention'
    ],
    mcps: DEFAULT_ACTIVE_MCPS,
    modelTier: 'mistral-codestral',
    ponytailLevel: 6,
    subagentPolicy: 'swarm-workers',
    gate1Grilling: true,
    gate2Review: true,
    audioAlarm: true,
    defaultGoal: 'Isolate the failing regression, author an automated reproduction test suite, apply a surgical fix, and verify green.',
    guidelines: [
      'Follow the red-green-refactor loop strictly: write the failing test BEFORE touching production code.',
      'Karpathy Simplicity First: write the absolute minimum code to pass the test.',
      'Never alter untouched dead code or reformat unrelated lines.'
    ]
  },
  {
    id: 'data-ml',
    name: 'Data & ML Pipeline Engineer',
    badge: 'Analytics',
    tagline: 'Enterprise ELT pipelines, BigQuery SQL optimization, dbt & Dataform workflows, and ML best practices.',
    iconName: 'Database',
    color: 'from-amber-500 to-orange-600',
    skills: [
      ...DEFAULT_ACTIVE_SKILLS,
      'bigquery-sql',
      'dbt-bigquery',
      'dataform-bigquery',
      'ml-best-practices',
      'discovering-gcp-data-assets',
      'managing-python-dependencies'
    ],
    mcps: ['filesystem', 'github', 'memory', 'sequential-thinking', 'sqlite', 'data-agent-kit', 'visualization'],
    modelTier: 'gemini-flash',
    ponytailLevel: 4,
    subagentPolicy: 'lean-orchestrator',
    gate1Grilling: true,
    gate2Review: true,
    audioAlarm: true,
    defaultGoal: 'Build an incremental dbt pipeline in BigQuery with partition pruning, deduplication, and statistical outlier detection.',
    guidelines: [
      'Always use partition filters and cluster keys to prevent high-cost full table scans in BigQuery.',
      'Isolate Python environments in dedicated virtual environments; never global pip install.',
      'Enforce idempotent pipeline runs and clean data lineage transformations.'
    ]
  },
  {
    id: 'bio-discovery',
    name: 'Bio & Scientific Discovery',
    badge: 'Science',
    tagline: 'Genomic variant analysis, AlphaFold 3D structure predictions, OpenTargets validation & ChEMBL bioactivity.',
    iconName: 'Dna',
    color: 'from-violet-500 to-purple-600',
    skills: [
      ...DEFAULT_ACTIVE_SKILLS,
      'alphafold-database-fetch-and-analyze',
      'opentargets-database',
      'pubchem-database',
      'clinvar-database',
      'ensembl-database',
      'literature-search-europepmc'
    ],
    mcps: ['filesystem', 'github', 'memory', 'sequential-thinking', 'fetch'],
    modelTier: 'claude-sonnet',
    ponytailLevel: 2,
    subagentPolicy: 'lean-orchestrator',
    gate1Grilling: true,
    gate2Review: false,
    audioAlarm: false,
    defaultGoal: 'Analyze missense variant pathogenicity for BRCA1/TP53, query ClinVar evidence, and retrieve AlphaFold pLDDT structural metrics.',
    guidelines: [
      'Always query authoritative databases (UniProt, ClinVar, Ensembl) for ground truth ID resolution.',
      'Report pLDDT structural confidence scores and disorder domain boundaries explicitly.',
      'Cite PubMed and Europe PMC PMCID references for clinical or therapeutic claims.'
    ]
  },
  {
    id: 'security-auditor',
    name: 'Pre-Merge Adversarial Auditor',
    badge: 'Security',
    tagline: 'Zero-token-waste diff inspections, accidental data loss checks, credential safety & SAIF posture audits.',
    iconName: 'ShieldAlert',
    color: 'from-rose-500 to-red-600',
    skills: [
      ...DEFAULT_ACTIVE_SKILLS,
      'accidental-data-loss-prevention',
      'gcs-security-assessment',
      'chrome-devtools'
    ],
    mcps: DEFAULT_ACTIVE_MCPS,
    modelTier: 'groq-llama',
    ponytailLevel: 1,
    subagentPolicy: 'swarm-workers',
    gate1Grilling: true,
    gate2Review: true,
    audioAlarm: true,
    defaultGoal: 'Perform an adversarial security, credential leak, and regression audit on the active git diff prior to PR merge.',
    guidelines: [
      'Stop and block any unconfirmed DROP/TRUNCATE/DELETE commands or credential exposures.',
      'Execute independent subagent review diff check via node ./scripts/subagent.js --task review --diff.',
      'Verify clean commit messages and proper upstream tracking.'
    ]
  }
];

export const PONYTAIL_LADDER = [
  { level: 1, name: 'Level 1: YAGNI', desc: 'Does this code need to exist? Delete unnecessary requirements.' },
  { level: 2, name: 'Level 2: Stdlib', desc: 'Does the standard library do it? (Python pathlib, JS fetch/crypto).' },
  { level: 3, name: 'Level 3: Platform / Browser', desc: 'Is there a native browser or OS API? (<dialog>, FormData).' },
  { level: 4, name: 'Level 4: Existing Dependency', desc: 'Does an installed package in package.json / pyproject.toml do it?' },
  { level: 5, name: 'Level 5: One-Liner / Idiomatic', desc: 'Can it be written as a clean, idiomatic single expression?' },
  { level: 6, name: 'Level 6: Minimal Surgical Code', desc: 'Write the absolute minimum code to solve the bounded task.' },
];

export const MODEL_TIERS = [
  { id: 'gemini-flash', name: 'Gemini 3.7 Flash (High)', provider: 'Google DeepMind', speed: 'Fastest (200k+ ctx)', cost: '$0.0001/1k' },
  { id: 'mistral-codestral', name: 'Codestral 25.01', provider: 'Mistral AI', speed: 'Ultra-Fast Code Engine', cost: '$0.0003/1k' },
  { id: 'groq-llama', name: 'Llama 3.3 70B (Groq LPU)', provider: 'Groq Cloud', speed: '300+ tok/sec LPU', cost: '$0.0005/1k' },
  { id: 'claude-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', speed: 'Deep Reasoning & Synthesis', cost: '$0.0030/1k' }
];
