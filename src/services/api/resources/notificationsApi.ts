import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { PaginatedResponse } from '../types';
import type { ApiNotification, NotificationListRequest } from '@/types/api';

export const notificationsApi = {
  list: (request?: NotificationListRequest) => apiClient.get<PaginatedResponse<ApiNotification>>(API_ENDPOINTS.notifications.root, { params: request }),
  getById: (notificationId: string) => apiClient.get<ApiNotification>(API_ENDPOINTS.notifications.byId(notificationId)),
  markRead: (notificationId: string) => apiClient.patch<ApiNotification>(API_ENDPOINTS.notifications.markRead(notificationId)),
  markAllRead: () => apiClient.patch<{ success: boolean }>(API_ENDPOINTS.notifications.markAllRead),
  delete: (notificationId: string) => apiClient.delete<{ success: boolean }>(API_ENDPOINTS.notifications.byId(notificationId)),
  clearAll: () => apiClient.delete<{ success: boolean }>(API_ENDPOINTS.notifications.clearAll),
};
