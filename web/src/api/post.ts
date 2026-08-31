import { api } from './index';

export interface Post {
  id: string;
  titleEn: string;
  contentEn: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePostPayload = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

export const postApi = {
  getMany: async () => {
    const response = await api.get<{ data: Post[] }>('/auto/post');
    return response.data;
  },

  createOne: async (data: CreatePostPayload) => {
    const response = await api.post<{ data: Post }>('/auto/post', data);
    return response.data;
  },
};
