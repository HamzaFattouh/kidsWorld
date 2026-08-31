import { api } from './index';

export interface Meal {
  id: string;
  childId: string;
  type: string;
  consumed: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateMealPayload = Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>;

export const mealRecordApi = {
  getMany: async () => {
    const response = await api.get<{ data: Meal[] }>('/auto/mealRecord');
    return response.data;
  },

  createOne: async (data: CreateMealPayload) => {
    const response = await api.post<{ data: Meal }>('/auto/mealRecord', data);
    return response.data;
  },
};
