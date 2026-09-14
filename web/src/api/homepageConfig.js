import { api } from './index';

export const homepageConfigApi = {
  getMany: async () => {
    const response = await api.get('/cms/homepage-config');
    return response.data;
  },

  updateSection: async (data) => {
    const response = await api.post('/cms/homepage-config', data);
    return response.data;
  }
};
