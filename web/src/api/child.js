import { api } from '../lib/api';

export const childApi = {
  getMany: async (params) => {
    const response = await api.get('/auto/child', { params });
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/child', data);
    return response.data;
  },

  updateOne: async (id, updateData) => {
    const response = await api.put(`/auto/child/${id}`, updateData);
    return response.data;
  },

  deleteOne: async (id) => {
    const response = await api.delete(`/auto/child/${id}`);
    return response.data;
  },
};