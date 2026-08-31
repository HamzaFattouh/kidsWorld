import { api } from './index';

export interface Pickup {
  id: string;
  name: string;
  phone: string;
  childId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePickupPayload = Omit<Pickup, 'id' | 'createdAt' | 'updatedAt'>;

export const authorizedPickupApi = {
  getMany: async () => {
    const response = await api.get<{ data: Pickup[] }>('/auto/authorizedPickup');
    return response.data;
  },

  createOne: async (data: CreatePickupPayload) => {
    const response = await api.post<{ data: Pickup }>('/auto/authorizedPickup', data);
    return response.data;
  },
};
