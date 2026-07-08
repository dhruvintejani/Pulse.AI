import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { DashboardOverviewResponse } from '@/types/api';

export const dashboardApi = {
  overview: () => apiClient.get<DashboardOverviewResponse>(API_ENDPOINTS.dashboard.overview),
};
