import { create } from 'zustand';
import { persist } from 'zustand/middleware';




















export const useAuthStore = create()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      setAuth: (user, token) => set({ isAuthenticated: true, user, token: token || null }),
      clearAuth: () => set({ isAuthenticated: false, user: null, token: null })
    }),
    {
      name: 'auth-storage'
    }
  )
);