import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  token: null,
  role: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loginWithCredentials: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      const role = user.role;

      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userRole', role);
      
      set({ token, role, user, isAuthenticated: true, isLoading: false, error: null });
      return { success: true, role, user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  login: async (token, role) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userRole', role);
    set({ token, role, isAuthenticated: true, error: null });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout').catch(() => {});
    } catch (e) {
      // ignore
    }
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userRole');
    set({ token: null, role: null, user: null, isAuthenticated: false, error: null });
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
    }
  }
}));