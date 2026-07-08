import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { userSettingsService } from '@/services/settings';
import type { UserSettingsPayload } from '@/types/settings';

export const useUserSettings = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: queryKeys.api.settings,
    queryFn: userSettingsService.getSettings,
    staleTime: 60_000,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (payload: UserSettingsPayload) => userSettingsService.updateSettings(payload),
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.api.settings, settings);
    },
  });

  return {
    settings: settingsQuery.data,
    isLoadingSettings: settingsQuery.isLoading,
    isUpdatingSettings: updateSettingsMutation.isPending,
    updateSettings: updateSettingsMutation.mutateAsync,
  };
};
