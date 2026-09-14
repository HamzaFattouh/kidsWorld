import { api } from './index';













export const attendanceRecordApi = {
  getMany: async () => {
    const response = await api.get('/auto/attendanceRecord');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/attendanceRecord', data);
    return response.data;
  }
};