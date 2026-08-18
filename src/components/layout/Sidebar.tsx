'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  CheckCircle2,
  Settings,
  Plus,
  Flame,
  Layers,
  ChevronDown,
  Sparkles,
  Command,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { UserNav } from './UserNav';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [boardsOpen, setBoardsOpen] = useState(true);

  const sampleBoards = [
    { id: '1', name: 'Core Platform Sprint', identifier: 'ENG', color: 'bg-sky-500' },
    { id: '2', name: 'Product Redesign 2.0', identifier: 'DES', color: 'bg-purple-500' },
    { id: '3', name: 'Q3 Marketing Pipeline', identifier: 'MKT', color: 'bg-emerald-500' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#070a11] border-r border-slate-800/60 flex flex-col justify-between select-none shrink-0">
      {/* Top Header & Workspace Switcher */}
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">SyncFlow</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
            v1.0
          </span>
        </div>

        <WorkspaceSwitcher />

        {/* Quick Action Button */}
        <button className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 rounded-xl transition-all shadow-sm hover:border-slate-700 active:scale-98 group">
          <div className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Issue</span>
          </div>
          <kbd className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            C
          </kbd>
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {/* Workspace Level Links */}
        <div className="space-y-0.5">
          <Link
            href="/my-tasks"
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === '/my-tasks'
                ? 'bg-sky-500/10 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>My Issues</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 rounded-full bg-slate-800 text-slate-400">
              5
            </span>
          </Link>

          <Link
            href="/inbox"
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          </Link>
        </div>

        {/* Boards Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <button
              onClick={() => setBoardsOpen(!boardsOpen)}
              className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
            >
              <ChevronDown
                className={`w-3 h-3 transition-transform ${boardsOpen ? '' : '-rotate-90'}`}
              />
              <span>Boards</span>
            </button>
            <button className="hover:text-slate-300 p-0.5 rounded hover:bg-slate-800 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {boardsOpen && (
            <div className="space-y-0.5 pl-2">
              {sampleBoards.map((board) => (
                <Link
                  key={board.id}
                  href={`/board/${board.id}`}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    pathname.includes(`/board/${board.id}`)
                      ? 'bg-sky-500/10 text-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-2 h-2 rounded-full ${board.color} shrink-0 ring-2 ring-slate-950`}
                    />
                    <span className="truncate">{board.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 px-1 rounded bg-slate-900 border border-slate-800/60">
                    {board.identifier}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Views / Filters Section */}
        <div className="space-y-1">
          <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Views
          </div>
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors text-left">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Urgent Priority</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors text-left">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>All Active Issues</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer / User Profile & Settings */}
      <div className="p-3 border-t border-slate-800/60 space-y-1">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            pathname === '/settings'
              ? 'bg-sky-500/10 text-sky-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <UserNav />
      </div>
    </aside>
  );
};
