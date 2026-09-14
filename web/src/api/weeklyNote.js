import { api } from './index';












export const weeklyNoteApi = {
  getMany: async () => {
    const response = await api.get('/auto/weeklyNote');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/weeklyNote', data);
    return response.data;
  }
};