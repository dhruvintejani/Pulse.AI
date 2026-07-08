import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { ApiUser, AuthSessionRequest, AuthSessionResponse } from '@/types/api';

export const authApi = {
  getMe: () => apiClient.get<ApiUser>(API_ENDPOINTS.auth.me),
  createSession: (request: AuthSessionRequest) => apiClient.post<AuthSessionResponse, AuthSessionRequest>(API_ENDPOINTS.auth.session, request, { skipAuth: !request.token }),
  refreshSession: () => apiClient.post<AuthSessionResponse>(API_ENDPOINTS.auth.refresh),
  logout: () => apiClient.post<{ success: boolean }>(API_ENDPOINTS.auth.logout),
};
