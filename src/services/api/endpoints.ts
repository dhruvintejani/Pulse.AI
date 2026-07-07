export const API_ENDPOINTS = {
  health: '/health',
  auth: {
    me: '/auth/me',
    session: '/auth/session',
  },
  users: {
    current: '/users/me',
    profile: '/users/me/profile',
    settings: '/users/me/settings',
  },
  conversations: {
    root: '/conversations',
    byId: (conversationId: string) => `/conversations/${conversationId}`,
    messages: (conversationId: string) => `/conversations/${conversationId}/messages`,
    regenerate: (conversationId: string, messageId: string) => `/conversations/${conversationId}/messages/${messageId}/regenerate`,
  },
  documents: {
    root: '/documents',
    byId: (documentId: string) => `/documents/${documentId}`,
  },
  workspace: {
    root: '/workspace',
    members: '/workspace/members',
  },
  analytics: {
    overview: '/analytics/overview',
  },
  notifications: {
    root: '/notifications',
    markRead: (notificationId: string) => `/notifications/${notificationId}/read`,
  },
  billing: {
    plans: '/billing/plans',
    subscription: '/billing/subscription',
  },
} as const;
