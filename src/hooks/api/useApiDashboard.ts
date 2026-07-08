import { analyticsApi, dashboardApi, workspaceApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiQuery } from '@/hooks/useApiQuery';

export const useApiDashboardOverview = (enabled = false) => useApiQuery(
  queryKeys.api.dashboard,
  dashboardApi.overview,
  { enabled }
);

export const useApiAnalyticsOverview = (enabled = false) => useApiQuery(
  queryKeys.api.analytics,
  analyticsApi.overview,
  { enabled }
);

export const useApiWorkspaceSummary = (enabled = false) => useApiQuery(
  queryKeys.api.workspace,
  workspaceApi.getSummary,
  { enabled }
);
