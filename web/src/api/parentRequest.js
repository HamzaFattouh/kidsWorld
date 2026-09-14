import { api } from './index';












export const parentRequestApi = {
  getMany: async () => {
    const response = await api.get('/auto/parentRequest');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/parentRequest', data);
    return response.data;
  }
};