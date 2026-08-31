import { api } from './index';

export interface Request {
  id: string;
  parentId: string;
  type: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateRequestPayload = Omit<Request, 'id' | 'createdAt' | 'updatedAt'>;

export const parentRequestApi = {
  getMany: async () => {
    const response = await api.get<{ data: Request[] }>('/auto/parentRequest');
    return response.data;
  },

  createOne: async (data: CreateRequestPayload) => {
    const response = await api.post<{ data: Request }>('/auto/parentRequest', data);
    return response.data;
  },
};
