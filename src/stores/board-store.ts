import { create } from 'zustand';
import { FullBoardData, FullTask, Task } from '@/types/database';
import { api } from '@/lib/api-client';
import { calculateNewPosition } from '@/lib/fractional-index';

interface BoardState {
  boardData: FullBoardData | null;
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter States
  filters: {
    searchQuery: string;
    priority: number | null;
    assigneeId: string | null;
    labelId: string | null;
  };

  // Actions
  fetchBoard: (boardId: string) => Promise<void>;
  setSelectedTaskId: (taskId: string | null) => void;
  setFilter: (key: keyof BoardState['filters'], value: string | number | null) => void;
  clearFilters: () => void;

  // Optimistic Mutations
  moveTaskOptimistic: (
    taskId: string,
    sourceColumnId: string,
    targetColumnId: string,
    newIndex: number
  ) => Promise<void>;
  
  updateTaskOptimistic: (taskId: string, updates: Partial<Task>) => Promise<void>;
  createTaskOptimistic: (task: FullTask) => void;
  deleteTaskOptimistic: (taskId: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boardData: null,
  selectedTaskId: null,
  isLoading: false,
  error: null,

  filters: {
    searchQuery: '',
    priority: null,
    assigneeId: null,
    labelId: null,
  },

  fetchBoard: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.get<FullBoardData>(`/boards/${boardId}`);
      set({ boardData: data, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch board';
      set({ error: message, isLoading: false });
    }
  },

  setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  clearFilters: () =>
    set({
      filters: { searchQuery: '', priority: null, assigneeId: null, labelId: null },
    }),

  moveTaskOptimistic: async (taskId, sourceColumnId, targetColumnId, newIndex) => {
    const currentBoard = get().boardData;
    if (!currentBoard) return;

    // 1. Clone state for potential rollback
    const previousBoard = JSON.parse(JSON.stringify(currentBoard)) as FullBoardData;

    // 2. Find the task being moved
    const sourceCol = currentBoard.columns.find((c) => c.id === sourceColumnId);
    const targetCol = currentBoard.columns.find((c) => c.id === targetColumnId);
    if (!sourceCol || !targetCol) return;

    const taskIndex = sourceCol.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const [movedTask] = sourceCol.tasks.splice(taskIndex, 1);
    movedTask.column_id = targetColumnId;

    // 3. Calculate Fractional Index in target column
    const prevTask = targetCol.tasks[newIndex - 1];
    const nextTask = targetCol.tasks[newIndex];
    const newPosition = calculateNewPosition(prevTask?.position, nextTask?.position);
    movedTask.position = newPosition;

    // 4. Insert task at newIndex in target column
    targetCol.tasks.splice(newIndex, 0, movedTask);

    // 5. Update local state immediately (Optimistic Update)
    set({ boardData: { ...currentBoard } });

    // 6. Send update request to server in background
    try {
      await api.patch(`/tasks/${taskId}/move`, {
        target_column_id: targetColumnId,
        new_position: newPosition,
      });
    } catch (err) {
      console.error('Failed to move task on server, rolling back...', err);
      // Rollback to previous state on error
      set({ boardData: previousBoard });
    }
  },

  updateTaskOptimistic: async (taskId, updates) => {
    const currentBoard = get().boardData;
    if (!currentBoard) return;

    const previousBoard = JSON.parse(JSON.stringify(currentBoard)) as FullBoardData;

    // Apply updates locally
    for (const col of currentBoard.columns) {
      const task = col.tasks.find((t) => t.id === taskId);
      if (task) {
        Object.assign(task, updates);
        break;
      }
    }
    set({ boardData: { ...currentBoard } });

    try {
      await api.patch(`/tasks/${taskId}`, updates);
    } catch (err) {
      console.error('Failed to update task, rolling back...', err);
      set({ boardData: previousBoard });
    }
  },

  createTaskOptimistic: (newTask) => {
    const currentBoard = get().boardData;
    if (!currentBoard) return;

    const targetCol = currentBoard.columns.find((c) => c.id === newTask.column_id);
    if (targetCol) {
      targetCol.tasks.push(newTask);
      set({ boardData: { ...currentBoard } });
    }
  },

  deleteTaskOptimistic: async (taskId) => {
    const currentBoard = get().boardData;
    if (!currentBoard) return;

    const previousBoard = JSON.parse(JSON.stringify(currentBoard)) as FullBoardData;

    for (const col of currentBoard.columns) {
      const idx = col.tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        col.tasks.splice(idx, 1);
        break;
      }
    }
    set({ boardData: { ...currentBoard } });

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error('Failed to delete task, rolling back...', err);
      set({ boardData: previousBoard });
    }
  },
}));
