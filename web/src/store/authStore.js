import { create } from 'zustand';
import { persist } from 'zustand/middleware';




















export const useAuthStore = create()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setAuth: (user) => set({ isAuthenticated: true, user }),
      clearAuth: () => set({ isAuthenticated: false, user: null })
    }),
    {
      name: 'auth-storage'
    }
  )
);