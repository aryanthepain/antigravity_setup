# Antigravity Autonomous Engineering Instincts & Learnings

### [2026-08-21] Global-First Scaffolding & Zero-Boilerplate Invariant
- **Correction**: User instructed not to add Ponytail, Karpathy rules, duplicate skills, or empty `.agents/` folders during project initialization.
- **Root Cause**: Scaffolder was previously creating `.agents/rules` and `.agents/skills` with copies of global rules in every target repository.
- **New Invariant**: Always use global rules and skills (`~/.gemini/config/`) as the single source of truth. Never scaffold duplicate global rules or empty `.agents/` directories in new projects. Local `.agents/` is reserved strictly as a fallback for repository-specific custom overrides when an absolute need arises.

### [2026-08-24] Default Subagent Orchestration, Mandatory User Grilling & Frontend Primitives
- **Correction**: Models were defaulting to monolithic single-turn reasoning instead of orchestrating subagents, jumping directly into implementation without grilling, and generating generic vibecoded UI without accessible primitives.
- **Root Cause**: Global rules previously permitted direct context ingestion and lacked explicit triggers for frontend primitives and mandatory user grilling gates.
- **New Invariant**:
  1. **Default Subagent Execution**: Chief Orchestrator stays ultra-lean (<600 tokens); all research (>30 lines), multi-file context, code synthesis, diff audits, and log compression MUST invoke `node ./scripts/subagent.js` by default.
  2. **Mandatory User Grilling (Gate 1)**: Any human-initiated prompt must be grilled and planned before code is touched. Worker subagents proceed without interactive grilling gates.
  3. **Primitives-First Frontend**: Never handcraft menus, dialogs, popovers, tabs, or tooltips from raw divs. Always use `shadcn/ui` (`ui.shadcn.com`), `Radix UI`, or `Base UI`.
  4. **Design Taste & Anti-Slop**: Enforce `taste-skill`, `web-design-guidelines`, `awesome-design`, `image-2-code`, and `playwright-cli` on all UI tasks.

### [2026-11-17] MCP Vault Isolation, Zero-Secret Invariant & CI Exposure Scanning
- **Correction**: User flagged an exposed Notion OAuth Bearer token in `.agents/mcp_config.json` that was committed to `main` on GitHub (`aryanthepain/antigravity_setup`), triggering GitHub Secret Scanning. User explicitly instructed to fix the exposure, scrub history, gate deployments in `deploy.yml`, and permanently learn never to expose secrets like that.
- **Root Cause**: When adding or syncing the Notion MCP server from the skill vault, the raw authorization header with live OAuth token was copied into the tracked workspace manifest (`.agents/mcp_config.json`) instead of keeping the credential isolated in the external vault (`~/.gemini/config/skills-vault/notion/token.json`) or referencing environment variables (`Bearer ${NOTION_TOKEN}`). Furthermore, `deploy.yml` lacked automated secret scanning before deployment.
- **New Invariant**:
  1. **MCP Header Placeholder Invariant**: Never write or copy raw credentials into `.agents/mcp_config.json` or `.agents/`. Always use dynamic placeholders (e.g. `"Authorization": "Bearer ${NOTION_TOKEN}"`).
  2. **External Vault Token Isolation**: Integration and OAuth tokens must reside exclusively outside Git in `~/.gemini/config/skills-vault/<pack>/token.json` or OS environment variables (`$env:NOTION_TOKEN`).
  3. **Runtime Credential Resolution**: Subagent scripts and MCP callers must resolve credentials dynamically in order: Environment Variable -> External Vault `token.json` -> Expanded MCP Header placeholder.
  4. **CI/CD Deployment Secret Scanning**: All deployment and CI workflows (`deploy.yml`) must run mandatory secret scanning (`gitleaks-action` and deterministic secret checks) on push and pull requests, failing and aborting deployment if any secret is exposed.
  5. **Deterministic Verification Gate**: `scripts/verify.ps1` and `scripts/test-secrets-exposure.ps1` must run locally and block commits/PRs whenever high-entropy tokens or raw Bearer strings are detected in tracked files.
- **Updated Artifacts**: `~/.gemini/config/rules/global_rules.md`, `.github/workflows/deploy.yml`, `scripts/test-secrets-exposure.ps1`, `scripts/verify.ps1`, `scripts/subagent.js`, `templates/subagent.js`, `learning/instincts.md`.

