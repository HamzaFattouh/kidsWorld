import { api } from './index';












export const childApi = {
  getMany: async (params) => {
    const response = await api.get('/auto/child', { params });
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/child', data);
    return response.data;
  }
};