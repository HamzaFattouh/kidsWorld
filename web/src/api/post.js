import { api } from './index';











export const postApi = {
  getMany: async () => {
    const response = await api.get('/auto/post');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/post', data);
    return response.data;
  }
};