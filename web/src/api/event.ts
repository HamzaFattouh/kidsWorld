import { api } from './index';

export interface Event {
  id: string;
  titleEn: string;
  titleAr: string;
  eventDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateEventPayload = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

export const eventApi = {
  getMany: async () => {
    const response = await api.get<{ data: Event[] }>('/auto/event');
    return response.data;
  },

  createOne: async (data: CreateEventPayload) => {
    const response = await api.post<{ data: Event }>('/auto/event', data);
    return response.data;
  },
};
