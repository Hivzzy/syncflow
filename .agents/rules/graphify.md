# 🧠 Graphify Rules for SyncFlow

This project maintains a graphify knowledge graph at `graphify-out/`.

Rules:
- For codebase or architecture questions, when `graphify-out/graph.json` exists, first run `graphify query "<question>"` (CLI).
- Use `graphify path "<A>" "<B>"` for tracing relationships and `graphify explain "<concept>"` for focused modules.
- After modifying code files in any session, run `graphify update . --code-only` to keep the graph current.
