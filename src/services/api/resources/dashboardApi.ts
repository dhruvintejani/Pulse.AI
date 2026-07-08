import { apiClient } from '../client';
import type { DashboardOverviewResponse } from '@/types/api';

export const dashboardApi = {
  overview: () => apiClient.get<DashboardOverviewResponse>('/dashboard/overview'),
};
