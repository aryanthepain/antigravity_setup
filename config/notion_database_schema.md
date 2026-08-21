# Notion Kanban Database Schema Specification (DayPilot V2 Replacement)

> **Purpose:** Standardized Notion Database configuration to track agentic engineering tasks, PR links, and stage transitions.

---

## 1. Database Properties Table

Create a new Database in Notion named **`Autonomous Engineering Tasks`** with the following exact property types and option values:

| Property Name | Property Type | Permitted Values / Configuration | Purpose |
|:---|:---|:---|:---|
| **Task Name** | Title | Freeform text (e.g. `feat(auth): add jwt middleware`) | Main card title |
| **Status** | Status / Select | `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`, `Blocked` | Stage in the engineering lifecycle |
| **Mode** | Select | `AFK` (Unattended), `HITL` (Human-in-the-loop), `Clarification` | Execution autonomy mode |
| **Size** | Select | `S` (Small <20 lines), `M` (Medium 20-150 lines), `L` (Large >150 lines) | Task sizing for planning |
| **Priority** | Select | `P0 (Critical)`, `P1 (High)`, `P2 (Medium)`, `P3 (Low)` | Sprint prioritization |
| **Branch** | Text | e.g. `brief/jwt-auth` | Git branch slug |
| **PR Link** | URL | e.g. `https://github.com/org/repo/pull/42` | Associated Pull Request |
| **Task ID** | Text | e.g. `task-042` | Deterministic local ID |
| **Last Synced** | Date | Auto-updated on sync | Timestamp of agent synchronization |

---

## 2. Notion Board Views Recommended

1. **Kanban by Status (Default Board)**:
   - Group by: `Status`
   - Columns: `Backlog` → `Ready` → `In Progress` → `In Review` → `Done` (Column `Blocked` collapsed or filtered).
   - Display properties: `Size`, `Mode`, `Priority`, `Branch`.

2. **AFK Queue (List View)**:
   - Filter: `Mode` = `AFK` and `Status` = `Ready`.
   - Sort: `Priority` ascending, `Last Synced` descending.

3. **HITL / Blocker Inbox (List View)**:
   - Filter: `Mode` in (`HITL`, `Clarification`) or `Status` = `Blocked`.
   - Purpose: Surface tasks requiring human answers.

---

## 3. Human Approval Invariants

- **The `Done` Gate**: The agent transitions cards to `In Review`. Only the human engineer transitions cards to `Done` after reviewing the code and merging the PR.
- **Sync Token**: Connect using your Notion Internal Integration Token (`NOTION_API_KEY`) and ensure the database is shared with your integration.
