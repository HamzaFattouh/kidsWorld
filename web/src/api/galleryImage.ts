import { api } from './index';

export interface Gallery {
  id: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateGalleryPayload = Omit<Gallery, 'id' | 'createdAt' | 'updatedAt'>;

export const galleryImageApi = {
  getMany: async () => {
    const response = await api.get<{ data: Gallery[] }>('/auto/galleryImage');
    return response.data;
  },

  createOne: async (data: CreateGalleryPayload) => {
    const response = await api.post<{ data: Gallery }>('/auto/galleryImage', data);
    return response.data;
  },
};
