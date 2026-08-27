import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'system',
  
  setTheme: async (theme) => {
    await AsyncStorage.setItem('userTheme', theme);
    set({ theme });
  },

  hydrate: async () => {
    try {
      const theme = await AsyncStorage.getItem('userTheme') as 'light' | 'dark' | 'system' | null;
      if (theme) {
        set({ theme });
      }
    } catch (e) {
      // ignore
    }
  }
}));

export const getActiveTheme = (theme: 'light' | 'dark' | 'system') => {
  if (theme === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return theme;
};
