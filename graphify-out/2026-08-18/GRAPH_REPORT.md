# Graph Report - .  (2026-08-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 123 nodes · 116 edges · 28 communities (7 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7db0d8c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- database.ts
- devDependencies
- package.json
- include
- dependencies
- migrate.js
- seed.js
- layout.tsx
- postgres
- clsx
- date-fns
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
- dotenv
- lucide-react
- next
- next.config.ts
- react
- react-dom
- tailwind-merge
- zod
- zustand
- postcss.config.mjs
- db.ts
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 7 edges
3. `include` - 5 edges
4. `lib` - 4 edges
5. `@dnd-kit/core` - 2 edges
6. `@dnd-kit/sortable` - 2 edges
7. `@dnd-kit/utilities` - 2 edges
8. `class-variance-authority` - 2 edges
9. `clsx` - 2 edges
10. `date-fns` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (28 total, 21 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 1 - "database.ts"
Cohesion: 0.12
Nodes (18): ActivityLog, AppNotification, Board, BoardColumn, ColumnCategory, FullBoardData, FullColumn, FullTask (+10 more)

### Community 2 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript, postcss (+5 more)

### Community 3 - "package.json"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, db:migrate, db:seed, dev, lint (+3 more)

### Community 4 - "include"
Cohesion: 0.25
Nodes (7): next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

### Community 5 - "dependencies"
Cohesion: 0.40
Nodes (5): class-variance-authority, dependencies, class-variance-authority, tailwindcss-animate, tailwindcss-animate

## Knowledge Gaps
- **72 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `type` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`, `postgres`, `clsx`, `date-fns`, `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `dotenv`, `lucide-react`, `next`, `react`, `react-dom`, `tailwind-merge`, `zod`, `zustand`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `database.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._