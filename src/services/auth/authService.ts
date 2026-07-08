import { authApi } from '@/services/api';
import type { AuthSessionRequest } from '@/types/api';

export const authenticationService = {
  getCurrentUser: authApi.getMe,
  createSession: (request: AuthSessionRequest) => authApi.createSession(request),
  refreshSession: authApi.refreshSession,
  logout: authApi.logout,
};
