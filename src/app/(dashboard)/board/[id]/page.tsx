import React from 'react';
import { Plus, MoreHorizontal, MessageSquare, CheckSquare, Flame, AlertCircle, ArrowUpCircle, HelpCircle } from 'lucide-react';

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Realistic mock dataset demonstrating the Kanban columns & cards
  const columns = [
    {
      id: 'backlog',
      name: 'Backlog',
      count: 2,
      color: 'bg-slate-500',
      tasks: [
        {
          id: 'ENG-105',
          title: 'Implement OAuth 2.0 Google & GitHub Login',
          priority: 'Medium',
          priorityColor: 'text-amber-400',
          labels: [{ name: 'Auth', color: 'bg-blue-950 text-blue-400 border-blue-800/60' }],
          assignee: 'H',
          comments: 0,
          checklist: '0/2',
          points: 3,
        },
      ],
    },
    {
      id: 'todo',
      name: 'To Do',
      count: 2,
      color: 'bg-sky-500',
      tasks: [
        {
          id: 'ENG-101',
          title: 'Design fluid drag-and-drop interaction with @dnd-kit',
          priority: 'High',
          priorityColor: 'text-orange-400',
          labels: [
            { name: 'Feature', color: 'bg-sky-950 text-sky-400 border-sky-800/60' },
            { name: 'UI', color: 'bg-purple-950 text-purple-400 border-purple-800/60' },
          ],
          assignee: 'H',
          comments: 3,
          checklist: '1/4',
          points: 5,
        },
        {
          id: 'ENG-104',
          title: 'Setup Redis Pub/Sub for multi-user presence broadcasting',
          priority: 'Urgent',
          priorityColor: 'text-red-400',
          labels: [{ name: 'Infra', color: 'bg-rose-950 text-rose-400 border-rose-800/60' }],
          assignee: 'S',
          comments: 1,
          checklist: null,
          points: 8,
        },
      ],
    },
    {
      id: 'in-progress',
      name: 'In Progress',
      count: 2,
      color: 'bg-amber-500',
      tasks: [
        {
          id: 'ENG-102',
          title: 'Configure PostgreSQL zero-overhead connection pool with postgres.js',
          priority: 'Urgent',
          priorityColor: 'text-red-400',
          labels: [{ name: 'Database', color: 'bg-emerald-950 text-emerald-400 border-emerald-800/60' }],
          assignee: 'H',
          comments: 4,
          checklist: '2/2',
          points: 5,
        },
        {
          id: 'ENG-103',
          title: 'Single-query board JSON aggregation using json_agg()',
          priority: 'High',
          priorityColor: 'text-orange-400',
          labels: [{ name: 'Backend', color: 'bg-indigo-950 text-indigo-400 border-indigo-800/60' }],
          assignee: 'A',
          comments: 2,
          checklist: null,
          points: 3,
        },
      ],
    },
    {
      id: 'in-review',
      name: 'In Review',
      count: 1,
      color: 'bg-purple-500',
      tasks: [
        {
          id: 'ENG-99',
          title: 'Fractional Indexing mathematical algorithm verification',
          priority: 'Medium',
          priorityColor: 'text-amber-400',
          labels: [{ name: 'Core', color: 'bg-slate-900 text-slate-300 border-slate-700' }],
          assignee: 'S',
          comments: 5,
          checklist: '3/3',
          points: 2,
        },
      ],
    },
    {
      id: 'done',
      name: 'Done',
      count: 3,
      color: 'bg-emerald-500',
      tasks: [
        {
          id: 'ENG-97',
          title: '17-Table Enterprise Normalized Schema Definition',
          priority: 'Low',
          priorityColor: 'text-blue-400',
          labels: [{ name: 'Schema', color: 'bg-teal-950 text-teal-400 border-teal-800/60' }],
          assignee: 'H',
          comments: 1,
          checklist: '4/4',
          points: 5,
        },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col p-6 min-w-max">
      {/* Board Columns Grid */}
      <div className="flex-1 flex gap-5 items-start">
        {columns.map((column) => (
          <div
            key={column.id}
            className="w-80 flex flex-col shrink-0 bg-slate-900/40 border border-slate-800/70 rounded-2xl p-3 max-h-[calc(100vh-7.5rem)] shadow-lg shadow-black/40 backdrop-blur-sm"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-800/50 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.color} ring-2 ring-slate-950`} />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{column.name}</h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-400 border border-slate-700/50">
                  {column.tasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <button className="p-1 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 hover:text-slate-300 hover:bg-slate-800 rounded-md transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Column Tasks List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="group p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all shadow-md shadow-black/30 hover:shadow-xl hover:shadow-black/50 cursor-grab active:cursor-grabbing space-y-2.5 relative"
                >
                  {/* Top: Ticket Key & Priority Icon */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-500 font-semibold group-hover:text-sky-400 transition-colors">
                      {task.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-medium ${task.priorityColor}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs font-medium text-slate-100 group-hover:text-white leading-snug">
                    {task.title}
                  </h3>

                  {/* Labels */}
                  {task.labels && task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {task.labels.map((lbl, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${lbl.color}`}
                        >
                          {lbl.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Footer: Metadata (Comments, Checklist, Assignee, Story Points) */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-slate-500 text-[11px]">
                    <div className="flex items-center gap-3">
                      {task.checklist && (
                        <div className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[10px]">{task.checklist}</span>
                        </div>
                      )}
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[10px]">{task.comments}</span>
                        </div>
                      )}
                      {task.points && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {task.points} pts
                        </span>
                      )}
                    </div>

                    {/* Assignee Avatar */}
                    <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white ring-1 ring-slate-800">
                      {task.assignee}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Add Card button at bottom of column */}
              <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-850/60 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>Add issue</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
