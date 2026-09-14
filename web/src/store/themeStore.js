import { create } from 'zustand';
import { persist } from 'zustand/middleware';








export const useThemeStore = create()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'theme-storage'
    }
  )
);

// Helper to actually apply the theme to the document
export const applyTheme = (theme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(theme);
};