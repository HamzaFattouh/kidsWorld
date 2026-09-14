import { api } from './index';













export const announcementApi = {
  getMany: async () => {
    const response = await api.get('/auto/announcement');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/announcement', data);
    return response.data;
  }
};