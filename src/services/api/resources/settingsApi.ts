import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { SettingsSectionRequest } from '@/types/api';

export const settingsApi = {
  getAll: <TSettings = Record<string, unknown>>() => apiClient.get<TSettings>(API_ENDPOINTS.settings.root),
  getSection: <TSettings = Record<string, unknown>>(section: string) => apiClient.get<TSettings>(API_ENDPOINTS.settings.section(section)),
  updateSection: <TSettings extends Record<string, unknown>>(request: SettingsSectionRequest<TSettings>) => (
    apiClient.patch<TSettings, TSettings>(API_ENDPOINTS.settings.section(request.section), request.values)
  ),
};
