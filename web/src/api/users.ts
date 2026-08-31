import { api } from '../lib/api';

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'PARENT';
  isActive: boolean;
  isVerified: boolean;
  requiresPasswordChange: boolean;
  name?: string | null;
  phone?: string | null;
  alternatePhone?: string | null;
  nationalId?: string | null;
  address?: string | null;
  locale: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password?: string;
  role: 'ADMIN' | 'TEACHER' | 'PARENT';
  isActive?: boolean;
  requiresPasswordChange?: boolean;
}

export const usersApi = {
  getUsers: async (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
    const response = await api.get<{ data: User[]; meta: { page: number; limit: number } }>('/users', { params });
    return response.data;
  },

  createUser: async (data: CreateUserPayload) => {
    const response = await api.post<{ data: User }>('/users', data);
    return response.data;
  },
};
