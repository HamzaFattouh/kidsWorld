import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ParentState {
  selectedChildId: string | null;
  setSelectedChildId: (id: string) => void;
}

export const useParentStore = create<ParentState>()(
  persist(
    (set) => ({
      selectedChildId: null,
      setSelectedChildId: (id) => set({ selectedChildId: id }),
    }),
    {
      name: 'parent-storage',
    }
  )
);
