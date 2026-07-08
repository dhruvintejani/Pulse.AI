import { INITIAL_NOTIFICATIONS } from '@/constants/notifications';
import type { AppNotification } from '@/types/notification';

let notificationStore: AppNotification[] = [...INITIAL_NOTIFICATIONS];

export const notificationService = {
  getNotifications: async () => notificationStore,
  markRead: async (notificationId: string) => {
    notificationStore = notificationStore.map((notification) => (
      notification.id === notificationId ? { ...notification, unread: false } : notification
    ));
    return notificationStore;
  },
  markAllRead: async () => {
    notificationStore = notificationStore.map((notification) => ({ ...notification, unread: false }));
    return notificationStore;
  },
  deleteNotification: async (notificationId: string) => {
    notificationStore = notificationStore.filter((notification) => notification.id !== notificationId);
    return notificationStore;
  },
  clearAll: async () => {
    notificationStore = [];
    return notificationStore;
  },
};
