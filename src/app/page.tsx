import Link from "next/link";
import { LayoutDashboard, Zap, Shield, Database, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen justify-between p-8 md:p-24 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between w-full border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            SyncFlow
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/board"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-all shadow-md shadow-sky-600/20 active:scale-95"
          >
            Open Board <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="my-16 text-center md:text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-400 bg-sky-950/60 border border-sky-800/50 rounded-full">
          <Zap className="w-3.5 h-3.5" /> Next.js 15 & Pure Raw SQL Engine
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Real-Time Collaborative <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Workflow & Kanban Platform
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
          High-performance project management engineered with pure raw SQL, zero-overhead connection pooling, optimistic drag-and-drop UI, and fractional index reordering.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Zero-ORM Raw SQL</h3>
            <p className="text-sm text-slate-400">
              17 frozen relational tables with parameterized queries, composite indexes, and single-query JSON aggregations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-950 flex items-center justify-center text-indigo-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Fluid Drag & Drop</h3>
            <p className="text-sm text-slate-400">
              Powered by @dnd-kit and Zustand optimistic updates with zero-latency visual feedback and error rollbacks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">Fractional Indexing</h3>
            <p className="text-sm text-slate-400">
              O(1) database task reordering without cascading updates across adjacent rows.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© 2026 SyncFlow. Crafted by Habbanma.</span>
        <span>Built with Next.js 15, PostgreSQL & TypeScript</span>
      </footer>
    </main>
  );
}
