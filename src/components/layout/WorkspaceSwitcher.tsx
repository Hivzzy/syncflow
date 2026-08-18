'use client';
import React, { useState } from 'react';
import { Building2, ChevronDown, Check, Plus } from 'lucide-react';

export const WorkspaceSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Acme Engineering');

  const workspaces = [
    { id: '1', name: 'Acme Engineering', slug: 'acme-eng', role: 'Owner', color: 'from-sky-500 to-indigo-600' },
    { id: '2', name: 'Personal Projects', slug: 'personal', role: 'Admin', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-all border border-slate-800/40 group text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-sky-500/20 shrink-0">
            {selected.charAt(0)}
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
              {selected}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Free Plan</div>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1.5 w-60 p-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-800/90 rounded-xl shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Workspaces
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setSelected(ws.name);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 transition-colors text-left group text-xs text-slate-300 hover:text-white"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-5 h-5 rounded bg-gradient-to-tr ${ws.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {ws.name.charAt(0)}
                  </div>
                  <span className="truncate">{ws.name}</span>
                </div>
                {selected === ws.name && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
              </button>
            ))}
            <div className="my-1 border-t border-slate-800/80" />
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-xs text-slate-400 hover:text-slate-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Workspace</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
