import { create } from 'zustand';
import { persist } from 'zustand/middleware';






export const useParentStore = create()(
  persist(
    (set) => ({
      selectedChildId: null,
      setSelectedChildId: (id) => set({ selectedChildId: id })
    }),
    {
      name: 'parent-storage'
    }
  )
);