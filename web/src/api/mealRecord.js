import { api } from './index';












export const mealRecordApi = {
  getMany: async () => {
    const response = await api.get('/auto/mealRecord');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/mealRecord', data);
    return response.data;
  }
};