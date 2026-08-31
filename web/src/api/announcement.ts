import { api } from './index';

export interface Announcement {
  id: string;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  priority: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAnnouncementPayload = Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>;

export const announcementApi = {
  getMany: async () => {
    const response = await api.get<{ data: Announcement[] }>('/auto/announcement');
    return response.data;
  },

  createOne: async (data: CreateAnnouncementPayload) => {
    const response = await api.post<{ data: Announcement }>('/auto/announcement', data);
    return response.data;
  },
};
