import { api } from './index';

export interface Class {
  id: string;
  name: string;
  capacity: number;
  ageGroup: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateClassPayload = Omit<Class, 'id' | 'createdAt' | 'updatedAt'>;

export const classApi = {
  getMany: async () => {
    const response = await api.get<{ data: Class[] }>('/auto/class');
    return response.data;
  },

  createOne: async (data: CreateClassPayload) => {
    const response = await api.post<{ data: Class }>('/auto/class', data);
    return response.data;
  },
};
