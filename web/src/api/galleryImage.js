import { api } from './index';










export const galleryImageApi = {
  getMany: async () => {
    const response = await api.get('/auto/galleryImage');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/galleryImage', data);
    return response.data;
  }
};