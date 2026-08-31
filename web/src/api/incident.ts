import { api } from './index';

export interface Incident {
  id: string;
  childId: string;
  date: string;
  time: string;
  severity: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateIncidentPayload = Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>;

export const incidentApi = {
  getMany: async () => {
    const response = await api.get<{ data: Incident[] }>('/auto/incident');
    return response.data;
  },

  createOne: async (data: CreateIncidentPayload) => {
    const response = await api.post<{ data: Incident }>('/auto/incident', data);
    return response.data;
  },
};
