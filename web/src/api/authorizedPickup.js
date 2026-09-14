import { api } from './index';












export const authorizedPickupApi = {
  getMany: async () => {
    const response = await api.get('/auto/authorizedPickup');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/authorizedPickup', data);
    return response.data;
  }
};