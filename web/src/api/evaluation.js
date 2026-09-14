import { api } from './index';













export const evaluationApi = {
  getMany: async () => {
    const response = await api.get('/auto/evaluation');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/evaluation', data);
    return response.data;
  }
};