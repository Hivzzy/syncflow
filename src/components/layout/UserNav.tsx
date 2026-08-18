'use client';
import React, { useState } from 'react';
import { User, Settings, LogOut, Moon, Sparkles, ChevronRight } from 'lucide-react';

export const UserNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 transition-all group text-left border border-transparent hover:border-slate-800/40"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200">
              H
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
          <div className="truncate">
            <div className="text-xs font-medium text-slate-200 truncate group-hover:text-white transition-colors">
              Habbanma
            </div>
            <div className="text-[10px] text-slate-500 truncate">habban@syncflow.io</div>
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 w-56 p-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-xl shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1.5 border-b border-slate-800/80 mb-1">
              <div className="text-xs font-semibold text-slate-200">Habbanma</div>
              <div className="text-[10px] text-slate-400 truncate">habban@syncflow.io</div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/80 transition-colors text-xs text-slate-300 hover:text-white"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/80 transition-colors text-xs text-slate-300 hover:text-white"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Preferences</span>
            </button>

            <div className="my-1 border-t border-slate-800/80" />

            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-red-950/40 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
