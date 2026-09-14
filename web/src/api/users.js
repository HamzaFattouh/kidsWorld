import { api } from '../lib/api';



























export const usersApi = {
  getUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  }
};