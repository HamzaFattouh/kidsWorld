import { api } from './index';

export interface Attendance {
  id: string;
  childId: string;
  date: string;
  status: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAttendancePayload = Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>;

export const attendanceRecordApi = {
  getMany: async () => {
    const response = await api.get<{ data: Attendance[] }>('/auto/attendanceRecord');
    return response.data;
  },

  createOne: async (data: CreateAttendancePayload) => {
    const response = await api.post<{ data: Attendance }>('/auto/attendanceRecord', data);
    return response.data;
  },
};
