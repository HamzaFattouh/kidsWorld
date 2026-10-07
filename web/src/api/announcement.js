import { api } from'./index';













export const announcementApi = {
  getMany: async () => {
    const response = await api.get('/auto/announcement');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/cms/announcements', data);
    return response.data;
  },

  deleteOne: async (id) => {
    const response = await api.delete(`/auto/announcement/${id}`);
    return response.data;
  }
};