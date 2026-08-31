import { api } from './index';

export interface Child {
  id: string;
  name: string;
  parentId: string;
  classId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateChildPayload = Omit<Child, 'id' | 'createdAt' | 'updatedAt'>;

export const childApi = {
  getMany: async (params?: any) => {
    const response = await api.get<{ data: Child[] }>('/auto/child', { params });
    return response.data;
  },

  createOne: async (data: CreateChildPayload) => {
    const response = await api.post<{ data: Child }>('/auto/child', data);
    return response.data;
  },
};
