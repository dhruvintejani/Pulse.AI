import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { useUndoActions } from '@/contexts/UndoContext';
import { notificationService } from '@/services/notifications/notificationService';
import type { AppNotification } from '@/types/notification';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { registerUndo } = useUndoActions();
  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: notificationService.getNotifications,
  });

  const getSnapshot = () => queryClient.getQueryData<AppNotification[]>(queryKeys.notifications) ?? notificationsQuery.data ?? [];
  const restoreSnapshot = (snapshot: AppNotification[]) => queryClient.setQueryData(queryKeys.notifications, snapshot);

  const optimisticUpdate = async (
    update: (current: AppNotification[]) => AppNotification[],
    label: string,
    description: string
  ) => {
    await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
    const previous = getSnapshot();
    queryClient.setQueryData(queryKeys.notifications, update(previous));
    registerUndo({
      label,
      description,
      onUndo: () => restoreSnapshot(previous),
    });
    return previous;
  };

  const markReadMutation = useMutation({
    mutationFn: notificationService.markRead,
    onMutate: (notificationId: string) => optimisticUpdate(
      (current) => current.map((notification) => (
        notification.id === notificationId ? { ...notification, unread: false } : notification
      )),
      'Marked notification as read',
      'Unread state was updated optimistically.'
    ),
    onError: (_error, _notificationId, previous) => previous && restoreSnapshot(previous),
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllRead,
    onMutate: () => optimisticUpdate(
      (current) => current.map((notification) => ({ ...notification, unread: false })),
      'Marked all as read',
      'All unread notifications were updated instantly.'
    ),
    onError: (_error, _variables, previous) => previous && restoreSnapshot(previous),
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onMutate: (notificationId: string) => optimisticUpdate(
      (current) => current.filter((notification) => notification.id !== notificationId),
      'Deleted notification',
      'The notification was removed. Undo restores it locally.'
    ),
    onError: (_error, _notificationId, previous) => previous && restoreSnapshot(previous),
  });

  const clearAllMutation = useMutation({
    mutationFn: notificationService.clearAll,
    onMutate: () => optimisticUpdate(
      () => [],
      'Cleared all notifications',
      'The notification center was cleared with an undo window.'
    ),
    onError: (_error, _variables, previous) => previous && restoreSnapshot(previous),
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
