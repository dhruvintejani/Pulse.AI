import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { ApiUser, UpdateProfileRequest } from '@/types/api';

export const usersApi = {
  getCurrentUser: () => apiClient.get<ApiUser>(API_ENDPOINTS.users.current),
  updateProfile: (request: UpdateProfileRequest) => apiClient.patch<ApiUser, UpdateProfileRequest>(API_ENDPOINTS.users.profile, request),
  updateSettings: <TSettings extends Record<string, unknown>>(settings: TSettings) => apiClient.patch<TSettings, TSettings>(API_ENDPOINTS.users.settings, settings),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ApiUser, FormData>(API_ENDPOINTS.users.avatar, formData);
  },
};
