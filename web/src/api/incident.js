import { api } from './index';














export const incidentApi = {
  getMany: async () => {
    const response = await api.get('/auto/incident');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/incident', data);
    return response.data;
  }
};