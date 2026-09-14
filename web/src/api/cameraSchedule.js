import { api } from './index';













export const cameraScheduleApi = {
  getMany: async () => {
    const response = await api.get('/auto/cameraSchedule');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/cameraSchedule', data);
    return response.data;
  }
};