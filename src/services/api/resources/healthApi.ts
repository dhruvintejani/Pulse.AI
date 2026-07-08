import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { ApiHealthResponse } from '@/types/api';

export const healthApi = {
  getHealth: () => apiClient.get<ApiHealthResponse>(API_ENDPOINTS.health, { skipAuth: true }),
};
