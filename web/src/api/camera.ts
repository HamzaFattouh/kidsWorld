import { api } from './index';

export interface Camera {
  id: string;
  name: string;
  streamUrl: string;
  classId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCameraPayload = Omit<Camera, 'id' | 'createdAt' | 'updatedAt'>;

export const cameraApi = {
  getMany: async () => {
    const response = await api.get<{ data: Camera[] }>('/auto/camera');
    return response.data;
  },

  createOne: async (data: CreateCameraPayload) => {
    const response = await api.post<{ data: Camera }>('/auto/camera', data);
    return response.data;
  },
};
