import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { AnalyticsOverviewResponse } from '@/types/api';

export const analyticsApi = {
  overview: () => apiClient.get<AnalyticsOverviewResponse>(API_ENDPOINTS.analytics.overview),
  usage: <TResponse = Record<string, unknown>>() => apiClient.get<TResponse>(API_ENDPOINTS.analytics.usage),
  tokens: <TResponse = Record<string, unknown>>() => apiClient.get<TResponse>(API_ENDPOINTS.analytics.tokens),
  workspaces: <TResponse = Record<string, unknown>>() => apiClient.get<TResponse>(API_ENDPOINTS.analytics.workspaces),
};
