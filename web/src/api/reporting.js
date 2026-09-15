import { api } from './index';

export const reportingApi = {
  getAdminDashboardStats: async () => {
    const response = await api.get('/reporting/admin/dashboard-stats');
    return response.data;
  },
};
