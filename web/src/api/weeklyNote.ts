import { api } from './index';

export interface WeeklyNote {
  id: string;
  childId: string;
  weekStartDate: string;
  generalNotes: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateWeeklyNotePayload = Omit<WeeklyNote, 'id' | 'createdAt' | 'updatedAt'>;

export const weeklyNoteApi = {
  getMany: async () => {
    const response = await api.get<{ data: WeeklyNote[] }>('/auto/weeklyNote');
    return response.data;
  },

  createOne: async (data: CreateWeeklyNotePayload) => {
    const response = await api.post<{ data: WeeklyNote }>('/auto/weeklyNote', data);
    return response.data;
  },
};
