import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';











export const useAuthStore = create((set) => ({
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
      const role = await SecureStore.getItemAsync('userRole');
      if (token && role) {
        set({ token, role, isAuthenticated: true });
      }
    } catch (e) {

      // ignore
    }}
}));