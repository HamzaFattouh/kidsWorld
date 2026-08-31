import { api } from './index';

export interface Complaint {
  id: string;
  parentId: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateComplaintPayload = Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>;

export const complaintApi = {
  getMany: async () => {
    const response = await api.get<{ data: Complaint[] }>('/auto/complaint');
    return response.data;
  },

  createOne: async (data: CreateComplaintPayload) => {
    const response = await api.post<{ data: Complaint }>('/auto/complaint', data);
    return response.data;
  },
};
