'use client';
import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Calendar,
  Sparkles,
  Share2,
  Filter,
  Plus,
  Users,
  Check,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [activeView, setActiveView] = useState<'board' | 'list' | 'timeline'>('board');

  const onlineMembers = [
    { name: 'Habbanma', avatar: 'H', color: 'from-sky-500 to-indigo-500' },
    { name: 'Sarah Chen', avatar: 'S', color: 'from-emerald-500 to-teal-500' },
    { name: 'Alex Rivera', avatar: 'A', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <header className="h-14 border-b border-slate-800/60 bg-[#090d16]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 select-none z-30 sticky top-0">
      {/* Left: Breadcrumbs & View Switcher */}
      <div className="flex items-center gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
            Acme Engineering
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 ring-2 ring-slate-950" />
            Core Platform Sprint
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="hidden md:flex items-center p-0.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
          <button
            onClick={() => setActiveView('board')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeView === 'board'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeView === 'list'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              activeView === 'timeline'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
        </div>
      </div>

      {/* Right: Search, Live Avatars & Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar Shortcut */}
        <button className="hidden sm:flex items-center gap-3 px-3 py-1.5 text-xs text-slate-400 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 rounded-lg transition-all group">
          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <span className="text-slate-500 group-hover:text-slate-400 transition-colors">
            Search or jump to...
          </span>
          <kbd className="text-[10px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
            ⌘K
          </kbd>
        </button>

        {/* Live Active Avatars */}
        <div className="flex items-center -space-x-1.5 overflow-hidden pl-2">
          {onlineMembers.map((m, idx) => (
            <div
              key={idx}
              title={`${m.name} (Online)`}
              className={`w-6 h-6 rounded-full bg-gradient-to-tr ${m.color} ring-2 ring-[#090d16] flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
            >
              {m.avatar}
            </div>
          ))}
        </div>

        {/* Filter Toggle Button */}
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 rounded-lg transition-all">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter</span>
        </button>

        {/* Create Issue Action */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-all shadow-md shadow-sky-600/20 active:scale-95">
          <Plus className="w-3.5 h-3.5" />
          <span>New Issue</span>
        </button>
      </div>
    </header>
  );
};
