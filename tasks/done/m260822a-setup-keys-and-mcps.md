---
title: "Setup API Keys and Verify Global MCP Integrations"
slug: "m260822a-setup-keys-and-mcps"
stage: "done"
stage_changed_at: "2026-08-22T03:20:00Z"
mode: "hitl"
category: "environment-setup"
tags: ["setup", "api-keys", "mcp", "global-config", "verified", "done"]
priority: "high"
due: null
assignee: "me"
source: "local"
source_kind: "manual"
source_id: "m260822a"
dedupe_key: "manual:m260822a"
created: "2026-08-22T00:10:00Z"
updated: "2026-08-22T03:20:00Z"
---

# Setup API Keys and Verify Global MCP Integrations

## Clean Objective
Populate remaining free-tier and provider API keys into Windows user environment variables, test the local MCP server stack, and run the automated audit gate to verify end-to-end readiness.

## Deliverables & Completion Status
- [x] 1. `GEMINI_API_KEY` configured & verified (Google AI Studio - 1,500 RPD tier).
- [x] 2. `GITHUB_TOKEN` & `GITHUB_PERSONAL_ACCESS_TOKEN` captured via GitHub CLI (`aryanthepain`) with `repo`, `workflow`, and `gist` scopes.
- [x] 3. `GROQ_API_KEY` configured & verified (Groq Console - 1,000 RPD fast TDD tier).
- [x] 4. `MISTRAL_API_KEY` configured & verified (Mistral Codestral tier).
- [x] 5. `NOTION_API_KEY` configured & verified (Notion Integration Token).
- [x] 6. `ANTHROPIC_API_KEY` configured & verified.
- [x] 7. Synchronized all 14 global MCP servers across `mcp_config.json`, IDE schemas, and CLI schemas.
- [x] 8. Authored `instructions.md` best-practice manuals across all 12 MCP server folders.
- [x] 9. Fixed `sequentialthinking.json` schema and verified live tool calls.
- [x] 10. Live verified MCP tool executions:
  - `github` -> `search_repositories` (Verified live GitHub API response)
  - `sequential-thinking` -> `sequentialthinking` (Verified thought sequencing)
  - `memory` -> `read_graph`, `create_entities` (Verified knowledge graph persistence)
  - `filesystem` -> `list_allowed_directories`, `list_directory` (Verified sandboxed file operations)
- [x] 11. Built and verified the interactive **Antigravity 2026 Control Center** web app (`docs/index.html` + `docs/app.js`).
- [x] 12. Ran deterministic test gate (`verify.ps1`) — All green.

## Stage History
- `2026-08-22T00:10:00Z` — waiting-to-pick-up (created)
- `2026-08-22T00:18:00Z` — in-review (MCP infrastructure complete)
- `2026-08-22T03:20:00Z` — done (All keys configured, GitHub authenticated, all MCP tools verified live)
