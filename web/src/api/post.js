import { api } from'./index';











export const postApi = {
  getMany: async () => {
    const response = await api.get('/auto/post');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/cms/posts', data);
    return response.data;
  },

  deleteOne: async (id) => {
    const response = await api.delete(`/auto/post/${id}`);
    return response.data;
  }
};