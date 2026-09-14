import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';







export const useThemeStore = create((set) => ({
  theme: 'system',

  setTheme: async (theme) => {
    await AsyncStorage.setItem('userTheme', theme);
    set({ theme });
  },

  hydrate: async () => {
    try {
      const theme = await AsyncStorage.getItem('userTheme');
      if (theme) {
        set({ theme });
      }
    } catch (e) {

      // ignore
    }}
}));

export const getActiveTheme = (theme) => {
  if (theme === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return theme;
};