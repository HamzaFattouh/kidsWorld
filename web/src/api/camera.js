import { api } from './index';












export const cameraApi = {
  getMany: async () => {
    const response = await api.get('/auto/camera');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/camera', data);
    return response.data;
  }
};