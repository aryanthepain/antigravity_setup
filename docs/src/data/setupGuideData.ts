export interface SetupStep {
  step: number;
  title: string;
  category: string;
  description: string;
  codeSnippet?: string;
  language?: string;
  notes?: string;
}

export const SETUP_STEPS: SetupStep[] = [
  {
    step: 1,
    title: "Obtain Free Model API Keys",
    category: "Prerequisites",
    description: "Acquire your 100% free tier API keys for Google AI Studio (1.5k RPD), Groq Cloud (1k RPD), Mistral AI, OpenRouter, and GitHub.",
    codeSnippet: `# PowerShell (Windows)
[System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your_gemini_key', 'User')
[System.Environment]::SetEnvironmentVariable('GROQ_API_KEY', 'your_groq_key', 'User')
[System.Environment]::SetEnvironmentVariable('MISTRAL_API_KEY', 'your_mistral_key', 'User')
[System.Environment]::SetEnvironmentVariable('OPENROUTER_API_KEY', 'your_openrouter_key', 'User')
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'your_github_token', 'User')`,
    language: "powershell",
    notes: "Restart your terminal after setting User environment variables."
  },
  {
    step: 2,
    title: "Deploy Global Behavioral Rules",
    category: "Invariants",
    description: "Install global behavioral invariants (Affirm 1-Task 1-PR, Ultra-Lean Orchestrator, Ponytail Laziness Ladder, Karpathy Disciplines) into ~/.gemini/config/rules/global_rules.md.",
    codeSnippet: `# Check or create global rules directory
mkdir -p ~/.gemini/config/rules
cp ./config/global_rules.md ~/.gemini/config/rules/global_rules.md`,
    language: "bash",
    notes: "Antigravity inherits all behavioral rules globally without needing duplicate files in every repo."
  },
  {
    step: 3,
    title: "Configure OmniRoute Local Gateway",
    category: "Proxy Router",
    description: "Configure OmniRoute proxy on localhost:20128 with RTK context compression and automated multi-provider fallback.",
    codeSnippet: `# ~/.omniroute/config.yaml
server:
  host: "127.0.0.1"
  port: 20128
compression:
  strategy: "rtk-context"
  enabled: true
fallback_chain:
  - "gemini"
  - "groq"
  - "mistral"
  - "openrouter"`,
    language: "yaml",
    notes: "OmniRoute pools free quotas and reduces token usage by up to 90%."
  },
  {
    step: 4,
    title: "Configure Global MCP Servers",
    category: "Tooling",
    description: "Register all 14 global MCP servers (filesystem, github, sequential-thinking, memory, sqlite, playwright, fetch, notion) in ~/.gemini/config/mcp_config.json.",
    codeSnippet: `# Verify global MCP configuration
cat ~/.gemini/config/mcp_config.json`,
    language: "bash",
    notes: "Tools are automatically loaded as eager or lazy tools in the IDE and CLI."
  },
  {
    step: 5,
    title: "Run Deterministic Verification Gate",
    category: "Verification",
    description: "Execute the PowerShell verification gate to validate type checkers, lints, and test suites.",
    codeSnippet: `pwsh -File .\\scripts\\verify.ps1`,
    language: "powershell",
    notes: "Guarantees deterministic verification with 0 token waste."
  }
];
