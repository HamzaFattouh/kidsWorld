import { api } from'./index';










export const galleryImageApi = {
  getMany: async () => {
    const response = await api.get('/auto/galleryImage');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/cms/gallery', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteOne: async (id) => {
    const response = await api.delete(`/auto/galleryImage/${id}`);
    return response.data;
  }
};