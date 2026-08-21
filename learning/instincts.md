# Antigravity Autonomous Engineering Instincts & Learnings

### [2026-08-21] Global-First Scaffolding & Zero-Boilerplate Invariant
- **Correction**: User instructed not to add Ponytail, Karpathy rules, duplicate skills, or empty `.agents/` folders during project initialization.
- **Root Cause**: Scaffolder was previously creating `.agents/rules` and `.agents/skills` with copies of global rules in every target repository.
- **New Invariant**: Always use global rules and skills (`~/.gemini/config/`) as the single source of truth. Never scaffold duplicate global rules or empty `.agents/` directories in new projects. Local `.agents/` is reserved strictly as a fallback for repository-specific custom overrides when an absolute need arises.
