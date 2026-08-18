# Graph Report - .  (2026-08-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 242 nodes · 231 edges · 50 communities (41 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa636d56`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- database.ts
- apiSuccess
- compilerOptions
- devDependencies
- package.json
- include
- migrate.js
- seed.js
- app/layout.tsx
- Button.tsx
- Input.tsx
- ui-store.ts
- next.config.ts
- postcss.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `apiSuccess()` - 18 edges
2. `compilerOptions` - 16 edges
3. `scripts` - 7 edges
4. `include` - 5 edges
5. `FullTask` - 4 edges
6. `FullBoardData` - 4 edges
7. `lib` - 4 edges
8. `GET()` - 4 edges
9. `apiError()` - 4 edges
10. `handleApiError()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `apiSuccess()`  [EXTRACTED]
  src/app/api/activity-logs/route.ts → src/lib/api-response.ts
- `POST()` --calls--> `apiSuccess()`  [EXTRACTED]
  src/app/api/columns/route.ts → src/lib/api-response.ts
- `GET()` --calls--> `apiSuccess()`  [EXTRACTED]
  src/app/api/labels/route.ts → src/lib/api-response.ts
- `PATCH()` --calls--> `apiSuccess()`  [EXTRACTED]
  src/app/api/tasks/[id]/move/route.ts → src/lib/api-response.ts
- `PATCH()` --calls--> `apiSuccess()`  [EXTRACTED]
  src/app/api/tasks/[id]/route.ts → src/lib/api-response.ts

## Import Cycles
- None detected.

## Communities (50 total, 9 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.06
Nodes (35): axios, class-variance-authority, clsx, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, dotenv (+27 more)

### Community 1 - "database.ts"
Cohesion: 0.08
Nodes (27): api, ApiError, axiosInstance, calculateNewPosition(), BoardState, useBoardStore, useWorkspaceStore, WorkspaceState (+19 more)

### Community 2 - "apiSuccess"
Cohesion: 0.16
Nodes (14): GET(), GET(), RouteContext, POST(), GET(), PATCH(), DELETE(), PATCH() (+6 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 4 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript, postcss (+5 more)

### Community 5 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, db:migrate, db:seed, dev, lint (+3 more)

### Community 6 - "include"
Cohesion: 0.25
Nodes (7): next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

## Knowledge Gaps
- **84 isolated node(s):** `nextConfig`, `config`, `sql`, `metadata`, `globalForDb` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `nextConfig`, `config`, `sql` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07563025210084033 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._