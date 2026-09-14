import { api } from './index';












export const eventApi = {
  getMany: async () => {
    const response = await api.get('/cms/events');
    return response.data;
  },

  createOne: async (data) => {
    // data is expected to be FormData since it contains an image
    const response = await api.post('/cms/events', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};