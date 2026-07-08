import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { notificationService } from '@/services/notifications/notificationService';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationService.getNotifications,
  });

  const invalidateNotifications = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
  };

  const markReadMutation = useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: invalidateNotifications,
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: invalidateNotifications,
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: invalidateNotifications,
  });

  const clearAllMutation = useMutation({
    mutationFn: notificationService.clearAll,
    onSuccess: invalidateNotifications,
  });

  const notifications = notificationsQuery.data ?? [];

  return {
    notifications,
    unreadCount: notifications.filter((notification) => notification.unread).length,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    clearAll: clearAllMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
    isClearingAll: clearAllMutation.isPending,
  };
};
