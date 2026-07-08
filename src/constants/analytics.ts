export const analyticsOverviewCards = [
  { label: 'AI Requests', value: '48.2K', change: '+24%', color: '#E9A24C', detail: 'Across all workspaces' },
  { label: 'Tokens Used', value: '8.7M', change: '+18%', color: '#3B82F6', detail: 'Prompt + completion tokens' },
  { label: 'Daily Active Users', value: '1,284', change: '+12%', color: '#10B981', detail: '7-day average' },
  { label: 'Avg. Latency', value: '0.8s', change: '-16%', color: '#8B5CF6', detail: 'Median response time' },
];

export const aiRequestTrend = [
  { day: 'Mon', requests: 4200, tokens: 710000, chats: 620, documents: 84 },
  { day: 'Tue', requests: 5600, tokens: 980000, chats: 810, documents: 112 },
  { day: 'Wed', requests: 5100, tokens: 890000, chats: 760, documents: 96 },
  { day: 'Thu', requests: 7200, tokens: 1240000, chats: 1020, documents: 148 },
  { day: 'Fri', requests: 6800, tokens: 1180000, chats: 940, documents: 136 },
  { day: 'Sat', requests: 3600, tokens: 610000, chats: 420, documents: 54 },
  { day: 'Sun', requests: 3100, tokens: 560000, chats: 390, documents: 48 },
];

export const monthlyActivity = [
  { month: 'Jan', requests: 24000, tokens: 4.1, users: 820, workspaces: 18 },
  { month: 'Feb', requests: 28500, tokens: 4.8, users: 910, workspaces: 21 },
  { month: 'Mar', requests: 32200, tokens: 5.4, users: 980, workspaces: 23 },
  { month: 'Apr', requests: 38400, tokens: 6.2, users: 1080, workspaces: 27 },
  { month: 'May', requests: 42100, tokens: 7.1, users: 1160, workspaces: 31 },
  { month: 'Jun', requests: 48200, tokens: 8.7, users: 1284, workspaces: 36 },
];

export const workspaceAnalytics = [
  { id: 'ws-1', workspace: 'Product Strategy Q4', requests: 12840, tokens: 2.4, users: 18, documents: 87, score: 94, status: 'Healthy' },
  { id: 'ws-2', workspace: 'Engineering Architecture', requests: 10820, tokens: 1.9, users: 12, documents: 64, score: 91, status: 'Healthy' },
  { id: 'ws-3', workspace: 'Marketing Campaign H2', requests: 8420, tokens: 1.3, users: 21, documents: 52, score: 88, status: 'Growing' },
  { id: 'ws-4', workspace: 'Customer Research Hub', requests: 6840, tokens: 1.1, users: 9, documents: 41, score: 83, status: 'Review' },
  { id: 'ws-5', workspace: 'Sales Enablement', requests: 5280, tokens: 0.8, users: 14, documents: 33, score: 79, status: 'Growing' },
  { id: 'ws-6', workspace: 'Finance Planning', requests: 4210, tokens: 0.6, users: 7, documents: 29, score: 86, status: 'Healthy' },
];

export const modelDistribution = [
  { name: 'GPT-4o', value: 54, requests: 26028, color: '#E9A24C' },
  { name: 'Claude 3.5', value: 31, requests: 14942, color: '#8B5CF6' },
  { name: 'Gemini Pro', value: 10, requests: 4820, color: '#3B82F6' },
  { name: 'Llama 3', value: 5, requests: 2410, color: '#10B981' },
];

export const tokenBreakdown = [
  { name: 'Prompt', value: 5.4, color: '#E9A24C' },
  { name: 'Completion', value: 2.8, color: '#3B82F6' },
  { name: 'Embeddings', value: 0.5, color: '#8B5CF6' },
];

export const dailyActivityHeatmap = [
  { hour: '08:00', activity: 32 },
  { hour: '10:00', activity: 68 },
  { hour: '12:00', activity: 54 },
  { hour: '14:00', activity: 89 },
  { hour: '16:00', activity: 76 },
  { hour: '18:00', activity: 44 },
  { hour: '20:00', activity: 28 },
];

export const requestCategories = [
  { name: 'Research', requests: 12840 },
  { name: 'Writing', requests: 10420 },
  { name: 'Coding', requests: 9820 },
  { name: 'Analysis', requests: 8420 },
  { name: 'Documents', requests: 6700 },
];
