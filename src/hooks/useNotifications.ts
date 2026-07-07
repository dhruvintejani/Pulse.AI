import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { notificationService } from '@/services/notifications/notificationService';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationService.getNotifications,
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });

  const notifications = notificationsQuery.data ?? [];

  return {
    notifications,
    unreadCount: notifications.filter((notification) => notification.unread).length,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    markAllRead: markAllReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    isMarkingAllRead: markAllReadMutation.isPending,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};
