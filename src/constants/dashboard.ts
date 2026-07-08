export type DashboardActivityType = 'chat' | 'document' | 'workspace' | 'billing' | 'system';

export const dashboardOverview = [
  { label: 'Messages Today', value: '247', change: '+12%', trend: 'up', metric: 247 },
  { label: 'Docs Analyzed', value: '18', change: '+5%', trend: 'up', metric: 18 },
  { label: 'Hours Saved', value: '8.4', change: '+34%', trend: 'up', metric: 8.4 },
  { label: 'AI Score', value: '94', change: '+2pt', trend: 'up', metric: 94 },
] as const;

export const dashboardRecentChats = [
  { id: 'chat-1', title: 'Market Research Q3 2025', model: 'GPT-4o', messages: 24, status: 'Active', updatedAt: '2 minutes ago', owner: 'Alex' },
  { id: 'chat-2', title: 'React Architecture Review', model: 'Claude 3.5', messages: 18, status: 'Pinned', updatedAt: '3 hours ago', owner: 'Noah' },
  { id: 'chat-3', title: 'Launch Announcement Ideas', model: 'GPT-4o', messages: 12, status: 'Favorite', updatedAt: 'Yesterday', owner: 'Sarah' },
  { id: 'chat-4', title: 'Sales Forecast Breakdown', model: 'Gemini Pro', messages: 9, status: 'Active', updatedAt: '2 days ago', owner: 'Maya' },
  { id: 'chat-5', title: 'Technical Blog Outline', model: 'Claude 3.5', messages: 15, status: 'Archived', updatedAt: 'Last week', owner: 'Alex' },
] as const;

export const dashboardRecentDocuments = [
  { id: 'doc-1', name: 'Product Roadmap.pdf', type: 'PDF', owner: 'Alex', size: '2.4 MB', pages: 45, status: 'Analyzed', updatedAt: '1 hour ago' },
  { id: 'doc-2', name: 'Q3 Financial Report.xlsx', type: 'Sheet', owner: 'Maya', size: '890 KB', pages: 12, status: 'Processing', updatedAt: '5 hours ago' },
  { id: 'doc-3', name: 'Brand Guidelines 2025.pdf', type: 'PDF', owner: 'Sarah', size: '12.4 MB', pages: 120, status: 'Analyzed', updatedAt: '3 days ago' },
  { id: 'doc-4', name: 'Customer Interview Notes.md', type: 'Markdown', owner: 'Priya', size: '132 KB', pages: 9, status: 'Analyzed', updatedAt: '1 week ago' },
  { id: 'doc-5', name: 'Investor Update Draft.doc', type: 'Doc', owner: 'Alex', size: '760 KB', pages: 16, status: 'Draft', updatedAt: '2 weeks ago' },
] as const;

export const dashboardAnalyticsCards = [
  { label: 'Completion Rate', value: '92%', change: '+6%', detail: 'Across AI tasks' },
  { label: 'Avg. Response Time', value: '0.8s', change: '-18%', detail: 'Last 7 days' },
  { label: 'Knowledge Coverage', value: '78%', change: '+11%', detail: 'Indexed docs' },
] as const;

export const dashboardUsageTrend = [
  { day: 'Mon', chats: 42, documents: 8, automations: 12 },
  { day: 'Tue', chats: 68, documents: 12, automations: 16 },
  { day: 'Wed', chats: 55, documents: 10, automations: 18 },
  { day: 'Thu', chats: 89, documents: 18, automations: 24 },
  { day: 'Fri', chats: 76, documents: 15, automations: 20 },
  { day: 'Sat', chats: 34, documents: 6, automations: 9 },
  { day: 'Sun', chats: 28, documents: 5, automations: 7 },
] as const;

export const dashboardModelUsage = [
  { name: 'GPT-4o', value: 68, requests: 892 },
  { name: 'Claude 3.5', value: 26, requests: 341 },
  { name: 'Gemini Pro', value: 6, requests: 78 },
] as const;

export const dashboardAiUsage = [
  { label: 'Messages', used: 247, total: 999, unit: '', color: '#E9A24C' },
  { label: 'Documents', used: 18, total: 50, unit: '', color: '#3B82F6' },
  { label: 'Storage', used: 4.2, total: 10, unit: 'GB', color: '#8B5CF6' },
] as const;

export const dashboardWorkspaceSummary = [
  { id: 'workspace-1', name: 'Product Strategy Q4', members: 6, tasksDone: 18, tasksTotal: 24, status: 'Active', updatedAt: '2 hours ago' },
  { id: 'workspace-2', name: 'Engineering Architecture', members: 4, tasksDone: 21, tasksTotal: 32, status: 'Active', updatedAt: '5 hours ago' },
  { id: 'workspace-3', name: 'Marketing Campaign H2', members: 8, tasksDone: 35, tasksTotal: 47, status: 'Active', updatedAt: '1 day ago' },
  { id: 'workspace-4', name: 'Customer Research Hub', members: 3, tasksDone: 8, tasksTotal: 15, status: 'Paused', updatedAt: '3 days ago' },
] as const;

export const dashboardActivityTimeline = [
  { id: 'activity-1', type: 'chat' as DashboardActivityType, title: 'Started Market Research Q3 2025', detail: 'GPT-4o generated a competitive landscape summary.', time: '2m ago' },
  { id: 'activity-2', type: 'document' as DashboardActivityType, title: 'Analyzed Product Roadmap.pdf', detail: '45 pages indexed with 12 action items.', time: '1h ago' },
  { id: 'activity-3', type: 'workspace' as DashboardActivityType, title: 'Updated Product Strategy Q4', detail: '3 tasks completed by the team.', time: '3h ago' },
  { id: 'activity-4', type: 'system' as DashboardActivityType, title: 'Model preference updated', detail: 'GPT-4o set as default for new chats.', time: '5h ago' },
] as const;

export const dashboardRecentNotifications = [
  { id: 'notification-1', title: 'Document analysis complete', type: 'Document', priority: 'High', unread: true, time: '8m ago' },
  { id: 'notification-2', title: 'Workspace task assigned', type: 'Workspace', priority: 'Medium', unread: true, time: '32m ago' },
  { id: 'notification-3', title: 'Billing cycle starts tomorrow', type: 'Billing', priority: 'Low', unread: false, time: '3h ago' },
  { id: 'notification-4', title: 'Weekly AI usage report ready', type: 'Analytics', priority: 'Medium', unread: false, time: 'Yesterday' },
] as const;
