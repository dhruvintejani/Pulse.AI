import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { WorkspaceSummaryResponse } from '@/types/api';

export const workspaceApi = {
  getSummary: () => apiClient.get<WorkspaceSummaryResponse>(API_ENDPOINTS.workspace.summary),
  listMembers: <TMember = Record<string, unknown>>() => apiClient.get<TMember[]>(API_ENDPOINTS.workspace.members),
  listActivity: <TActivity = Record<string, unknown>>() => apiClient.get<TActivity[]>(API_ENDPOINTS.workspace.activity),
};
