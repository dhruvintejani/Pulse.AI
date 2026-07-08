import { useQueryClient } from '@tanstack/react-query';
import { billingApi, settingsApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import type { SettingsSectionRequest } from '@/types/api';

export const useApiSettings = (enabled = false) => useApiQuery(
  queryKeys.api.settings,
  settingsApi.getAll,
  { enabled }
);

export const useUpdateApiSettingsSection = <TSettings extends Record<string, unknown>>() => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (request: SettingsSectionRequest<TSettings>) => settingsApi.updateSection(request),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.settings }) }
  );
};

export const useApiBillingPlans = (enabled = false) => useApiQuery(
  [...queryKeys.api.billing, 'plans'] as const,
  billingApi.listPlans,
  { enabled }
);

export const useApiBillingSubscription = (enabled = false) => useApiQuery(
  [...queryKeys.api.billing, 'subscription'] as const,
  billingApi.getSubscription,
  { enabled }
);
