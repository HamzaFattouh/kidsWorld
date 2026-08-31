import { api } from './index';

export interface Evaluation {
  id: string;
  childId: string;
  term: string;
  learning: string;
  behavior: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateEvaluationPayload = Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt'>;

export const evaluationApi = {
  getMany: async () => {
    const response = await api.get<{ data: Evaluation[] }>('/auto/evaluation');
    return response.data;
  },

  createOne: async (data: CreateEvaluationPayload) => {
    const response = await api.post<{ data: Evaluation }>('/auto/evaluation', data);
    return response.data;
  },
};
