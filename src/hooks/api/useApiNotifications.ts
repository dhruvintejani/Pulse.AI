import { useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/services/api';
import { queryKeys } from '@/constants/queryKeys';
import { useApiMutation } from '@/hooks/useApiMutation';
import { useApiQuery } from '@/hooks/useApiQuery';
import type { NotificationListRequest } from '@/types/api';

export const useApiNotifications = (request?: NotificationListRequest, enabled = false) => useApiQuery(
  [...queryKeys.api.notifications, request] as const,
  () => notificationsApi.list(request),
  { enabled }
);

export const useMarkApiNotificationRead = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (notificationId: string) => notificationsApi.markRead(notificationId),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.notifications }) }
  );
};

export const useMarkAllApiNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    notificationsApi.markAllRead,
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.notifications }) }
  );
};

export const useDeleteApiNotification = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    (notificationId: string) => notificationsApi.delete(notificationId),
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.notifications }) }
  );
};

export const useClearApiNotifications = () => {
  const queryClient = useQueryClient();
  return useApiMutation(
    notificationsApi.clearAll,
    { onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.api.notifications }) }
  );
};
