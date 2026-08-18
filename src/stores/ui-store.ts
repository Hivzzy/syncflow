import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isCreateTaskModalOpen: boolean;
  isCommandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setCreateTaskModalOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isCreateTaskModalOpen: false,
  isCommandPaletteOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setCreateTaskModalOpen: (open) => set({ isCreateTaskModalOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));
