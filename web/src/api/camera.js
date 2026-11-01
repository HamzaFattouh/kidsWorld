import { api } from './index';

export const cameraApi = {
  // Get all active cameras accessible to the authenticated user (Parent / Teacher / Admin)
  getAccessibleCameras: async () => {
    const response = await api.get('/cameras');
    return response.data;
  },

  // Update camera details (name, streamUrl, classId, isActive) and embedded schedule
  updateCamera: async (id, data) => {
    const response = await api.put(`/cameras/${id}`, data);
    return response.data;
  },

  // Request a signed WebRTC streaming token & endpoint for a specific camera
  requestCameraAccess: async (cameraId) => {
    const response = await api.post(`/cameras/${cameraId}/access`);
    return response.data;
  },

  // Permissions Management
  getPermissionsMatrix: async () => {
    const response = await api.get('/cameras/permissions');
    return response.data;
  },

  updateUserPermissions: async (userId, overrides) => {
    const response = await api.put(`/cameras/permissions/${userId}`, { overrides });
    return response.data;
  },

  resetUserPermissions: async (userId) => {
    const response = await api.post(`/cameras/permissions/reset/${userId}`);
    return response.data;
  },

  // Legacy auto CRUD for backwards compatibility
  getMany: async () => {
    const response = await api.get('/cameras');
    return response.data;
  },

  createOne: async (data) => {
    const response = await api.post('/auto/camera', data);
    return response.data;
  },

  updateOne: async (id, data) => {
    const response = await api.put(`/cameras/${id}`, data);
    return response.data;
  },

  deleteOne: async (id) => {
    const response = await api.delete(`/auto/camera/${id}`);
    return response.data;
  }
};