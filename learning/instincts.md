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
