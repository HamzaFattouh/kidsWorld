import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-app-client': 'web'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized, we should clear the local auth state
    // and let the ProtectedRoute component redirect to login.
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);