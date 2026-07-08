import type { LucideIcon } from 'lucide-react';

export type NotificationType = 'ai' | 'chat' | 'doc' | 'team' | 'system' | 'billing';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
  id: string;
  type: NotificationType;
  category: string;
  priority: NotificationPriority;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  action: string;
}
