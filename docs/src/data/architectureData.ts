export interface RoutingTier {
  tier: number;
  name: string;
  model: string;
  provider: string;
  quota: string;
  latency: string;
  bestFor: string;
  color: string;
  badge: string;
}

export const ROUTING_TIERS: RoutingTier[] = [
  {
    tier: 1,
    name: "Architect & Orchestrator",
    model: "Google Gemini 3.7 Flash (Thinking) / Gemini 2.5 Flash",
    provider: "Google AI Studio",
    quota: "1,500 RPD (Free)",
    latency: "~1.2s",
    bestFor: "Chief orchestrator (<600 tokens active context), deep codebase surveys, architectural planning, and human checkpoints.",
    color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-400",
    badge: "1M Context"
  },
  {
    tier: 2,
    name: "Fast TDD & Sub-Second Loops",
    model: "Llama 3.3 70B Versatile",
    provider: "Groq Cloud LPU",
    quota: "1,000 RPD (Free)",
    latency: "~0.15s (500+ tok/s)",
    bestFor: "Iterative red-green TDD loops, rapid unit-test generation, quick single-file patches.",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400",
    badge: "500+ tok/s"
  },
  {
    tier: 3,
    name: "Precision Refactoring",
    model: "Mistral Codestral Latest",
    provider: "Mistral AI",
    quota: "Permanent Free Tier",
    latency: "~0.8s",
    bestFor: "Multi-file AST refactoring, TypeScript type fixing, Python type hints, lint auto-remediation.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400",
    badge: "Code Specialist"
  },
  {
    tier: 4,
    name: "Deep Reasoning & Edge Cases",
    model: "DeepSeek R1 / V3 Free",
    provider: "OpenRouter Community",
    quota: "Free Pool",
    latency: "~2.5s",
    bestFor: "Complex mathematical logic, algorithmic design, subtle concurrency bugs, edge-case analysis.",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-400",
    badge: "Open Reasoning"
  },
  {
    tier: 5,
    name: "Independent Adversarial Review",
    model: "Gemini 2.5 Pro / Claude 3.7 Sonnet",
    provider: "Google AI Studio / Anthropic",
    quota: "Free / Managed",
    latency: "~2.0s",
    bestFor: "Pre-merge architectural verification, security review, and PR final check.",
    color: "from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-400",
    badge: "Adversarial Gate"
  }
];

export const PONYTAIL_LADDER = [
  {
    level: 1,
    name: "YAGNI",
    question: "Does this code really need to exist?",
    action: "If not strictly requested, delete the requirement. Zero speculative features.",
    reduction: "-60% bloat"
  },
  {
    level: 2,
    name: "Stdlib",
    question: "Does Python / JS standard library already do it?",
    action: "Use standard libraries: pathlib, itertools, crypto, json, fetch, URL, FormData.",
    reduction: "-20% bloat"
  },
  {
    level: 3,
    name: "Platform / Browser",
    question: "Is there a native browser or OS capability?",
    action: "Use <dialog>, <details>, popover, [System.Media.SystemSounds], native CSS grid.",
    reduction: "-10% bloat"
  },
  {
    level: 4,
    name: "Existing Dependency",
    question: "Does an installed package in package.json or pyproject.toml do it?",
    action: "Re-use existing libraries. Never install duplicate single-use packages.",
    reduction: "-5% bloat"
  },
  {
    level: 5,
    name: "One-Liner",
    question: "Can it be written as a clean, idiomatic single expression?",
    action: "Write a clear, concise functional expression or pipeline instead of a verbose class.",
    reduction: "-3% bloat"
  },
  {
    level: 6,
    name: "Minimal Surgical Code",
    question: "Only now author code.",
    action: "Touch ONLY lines necessary. Zero adjacent formatting churn. Map directly to tests.",
    reduction: "Pure Value"
  }
];

export const BEHAVIORAL_INVARIANTS = [
  {
    title: "1 Task → 1 Agent Session → 1 PR",
    description: "Every unit of work is strictly bounded, modular, and verifiable. Explicit human checkpoints around planning approval (Gate 1) and PR review (Gate 2)."
  },
  {
    title: "Ultra-Lean Orchestrator (<600 Tokens)",
    description: "The Chief Orchestrator never ingests raw multi-file search results, long test logs, or massive stack traces. Delegates to specialized subagents."
  },
  {
    title: "Karpathy Grounding Disciplines",
    description: "Think before coding, state assumptions explicitly, simplicity first, surgical edits only, and goal-driven verification."
  },
  {
    title: "Deterministic Verification (Zero Token Waste)",
    description: "Never burn LLM tokens asking 'does this look right?'. Run local PowerShell / pytest / tsc test gates with a maximum of 3 test-fix attempts."
  }
];
