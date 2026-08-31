import { api } from './index';

export interface CameraSchedule {
  id: string;
  cameraId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCameraSchedulePayload = Omit<CameraSchedule, 'id' | 'createdAt' | 'updatedAt'>;

export const cameraScheduleApi = {
  getMany: async () => {
    const response = await api.get<{ data: CameraSchedule[] }>('/auto/cameraSchedule');
    return response.data;
  },

  createOne: async (data: CreateCameraSchedulePayload) => {
    const response = await api.post<{ data: CameraSchedule }>('/auto/cameraSchedule', data);
    return response.data;
  },
};
