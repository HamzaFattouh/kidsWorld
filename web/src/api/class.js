import { api } from './index';












export const classApi = {
  getMany: async () => {
    const response = await api.get('/auto/class');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/class', data);
    return response.data;
  }
};