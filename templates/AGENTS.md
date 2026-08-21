# AGENTS.md — Behavioral Invariants & Operating Guidelines

## 1. Affirm Single-Task Contract
- **1 Task → 1 Agent Session → 1 PR**: Keep every unit of work strictly bounded and verifiable.
- Never add unrequested features or bundle multiple tasks into a single session.
- Respect explicit human checkpoints: Plan approval before coding, diff review before merging.

## 2. Ponytail Anti-Bloat Ladder
Before writing any new function, class, or abstraction, verify:
1. **YAGNI**: Does this code really need to exist? If not, delete it.
2. **Stdlib**: Does standard library do it? (`pathlib`, `itertools`, `crypto`, `fetch`).
3. **Platform**: Is there a native browser or OS feature?
4. **Existing Dependency**: Check `pyproject.toml` or `package.json` before adding packages.
5. **One-Liner**: Can it be written in a single clean expression?
6. **Minimal Code**: Write only the simplest code that makes tests pass.

## 3. Karpathy Surgical Execution
- **Think First**: State assumptions explicitly. Surface tradeoffs before editing. Stop and ask if ambiguous.
- **Surgical Edits**: Touch ONLY lines necessary for the active task. Never reformat adjacent code, modify unrelated comments, or delete untouched dead code.
- **Goal-Driven**: Always define or run the targeted failing test before implementing the patch.

## 4. Deterministic Verification
- Run `./scripts/verify.ps1` before declaring any task complete.
- Every task must pass with 0 errors, 0 failed tests, and 0 type warnings.
- Bounded fix limit: Max 3 retry rounds before escalating to human.

## 5. Ephemeral Memory (`WORKING.md`)
- Keep `WORKING.md` updated with the active objective, test failure traces, hypotheses, and blockers.
