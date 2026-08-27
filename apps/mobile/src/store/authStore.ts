import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { I18nManager } from 'react-native';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'TEACHER' | 'PARENT' | null;
  isAuthenticated: boolean;
  login: (token: string, role: 'ADMIN' | 'TEACHER' | 'PARENT') => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  isAuthenticated: false,

  login: async (token, role) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userRole', role);
    set({ token, role, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userRole');
    set({ token: null, role: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const role = await SecureStore.getItemAsync('userRole') as 'ADMIN' | 'TEACHER' | 'PARENT' | null;
      if (token && role) {
        set({ token, role, isAuthenticated: true });
      }
    } catch (e) {
      // ignore
    }
  }
}));
