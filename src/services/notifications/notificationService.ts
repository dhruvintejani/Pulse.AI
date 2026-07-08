import { AlertTriangle, Bell, Check, CreditCard, FileText, MessageSquare, Shield, Users, Zap } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '@/constants/notifications';
import { apiClient } from '@/services/api';
import type { AppNotification, NotificationPriority, NotificationType } from '@/types/notification';

interface ApiPage<T> {
  items: T[];
}

interface ApiNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'billing' | 'system';
  status: 'unread' | 'read' | 'archived';
  title: string;
  message: string;
  action_url?: string | null;
  created_at: string;
  metadata?: Record<string, unknown>;
}

let notificationStore: AppNotification[] = [...INITIAL_NOTIFICATIONS];

const typeMap: Record<ApiNotification['type'], NotificationType> = {
  info: 'system',
  success: 'system',
  warning: 'system',
  error: 'system',
  billing: 'billing',
  system: 'system',
};

const priorityMap: Record<ApiNotification['type'], NotificationPriority> = {
  info: 'low',
  success: 'low',
  warning: 'medium',
  error: 'high',
  billing: 'medium',
  system: 'low',
};

const visualMap = {
  info: { icon: Bell, iconBg: 'bg-[rgba(0,0,0,0.04)]', iconColor: 'text-[#999]' },
  success: { icon: Check, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  warning: { icon: AlertTriangle, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
  error: { icon: Shield, iconBg: 'bg-red-50', iconColor: 'text-red-500' },
  billing: { icon: CreditCard, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
  system: { icon: Zap, iconBg: 'bg-[rgba(233,162,76,0.12)]', iconColor: 'text-[#E9A24C]' },
};

const categoryMap: Record<ApiNotification['type'], string> = {
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Security',
  billing: 'Billing',
  system: 'System',
};

const formatRelativeTime = (value: string) => {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'Recently';
  const diff = Date.now() - timestamp;
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const mapApiNotification = (notification: ApiNotification): AppNotification => {
  const visual = visualMap[notification.type];
  const metadataType = notification.metadata?.ui_type;
  const resolvedType = typeof metadataType === 'string' && ['ai', 'chat', 'doc', 'team', 'system', 'billing'].includes(metadataType)
    ? metadataType as NotificationType
    : typeMap[notification.type];

  return {
    id: notification.id,
    type: resolvedType,
    category: categoryMap[notification.type],
    priority: priorityMap[notification.type],
    icon: resolvedType === 'chat' ? MessageSquare : resolvedType === 'doc' ? FileText : resolvedType === 'team' ? Users : visual.icon,
    iconBg: visual.iconBg,
    iconColor: visual.iconColor,
    title: notification.title,
    desc: notification.message,
    time: formatRelativeTime(notification.created_at),
    unread: notification.status === 'unread',
    action: notification.action_url ? 'Open' : 'Details',
  };
};

const fallback = async <T>(request: () => Promise<T>, fallbackValue: T) => {
  try {
    return await request();
  } catch {
    return fallbackValue;
  }
};

export const notificationService = {
  getNotifications: async () => fallback(
    async () => {
      const response = await apiClient.get<ApiPage<ApiNotification>>('/notifications?size=100');
      notificationStore = response.items.map(mapApiNotification);
      return notificationStore;
    },
    notificationStore
  ),
  markRead: async (notificationId: string) => fallback(
    async () => {
      const response = await apiClient.patch<ApiNotification>(`/notifications/${notificationId}/read`);
      notificationStore = notificationStore.map((notification) => (
        notification.id === notificationId ? mapApiNotification(response) : notification
      ));
      return notificationStore;
    },
    notificationStore = notificationStore.map((notification) => (
      notification.id === notificationId ? { ...notification, unread: false } : notification
    ))
  ),
  markAllRead: async () => fallback(
    async () => {
      await apiClient.post('/notifications/mark-all-read');
      notificationStore = notificationStore.map((notification) => ({ ...notification, unread: false }));
      return notificationStore;
    },
    notificationStore = notificationStore.map((notification) => ({ ...notification, unread: false }))
  ),
  deleteNotification: async (notificationId: string) => fallback(
    async () => {
      await apiClient.delete(`/notifications/${notificationId}`);
      notificationStore = notificationStore.filter((notification) => notification.id !== notificationId);
      return notificationStore;
    },
    notificationStore = notificationStore.filter((notification) => notification.id !== notificationId)
  ),
  clearAll: async () => fallback(
    async () => {
      await apiClient.delete('/notifications/clear-all');
      notificationStore = [];
      return notificationStore;
    },
    notificationStore = []
  ),
};
