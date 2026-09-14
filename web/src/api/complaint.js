import { api } from './index';












export const complaintApi = {
  getMany: async () => {
    const response = await api.get('/auto/complaint');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/complaint', data);
    return response.data;
  }
};