import { api } from './index';

export const cameraApi = {
  // Get all active cameras accessible to the authenticated user (Parent / Teacher / Admin)
  getAccessibleCameras: async () => {
    const response = await api.get('/cameras');
    return response.data;
  },

  // Request a signed WebRTC streaming token & endpoint for a specific camera
  requestCameraAccess: async (cameraId) => {
    const response = await api.post(`/cameras/${cameraId}/access`);
    return response.data;
  },

  // Admin CRUD operations (automated routes)
  getMany: async () => {
    const response = await api.get('/auto/camera');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/camera', data);
    return response.data;
  },

  updateOne: async (id, data) => {
    const response = await api.put(`/auto/camera/${id}`, data);
    return response.data;
  },

  deleteOne: async (id) => {
    const response = await api.delete(`/auto/camera/${id}`);
    return response.data;
  }
};