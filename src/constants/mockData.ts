export const dashboardStats = [
  { label: 'Messages Today', value: '247', change: '+12%', trend: 12 },
  { label: 'Docs Analyzed', value: '18', change: '+5%', trend: 5 },
  { label: 'Hours Saved', value: '8.4', change: '+34%', trend: 34 },
  { label: 'AI Score', value: '94', change: '+2pt', trend: 2 },
];

export const recentActivity = [
  { id: 'act-1', type: 'chat', title: 'Market Research Q3 2025', time: '2 minutes ago', model: 'GPT-4o', messages: 24 },
  { id: 'act-2', type: 'doc', title: 'Product Roadmap.pdf', time: '1 hour ago', size: '2.4 MB', pages: 45 },
  { id: 'act-3', type: 'chat', title: 'React Architecture Review', time: '3 hours ago', model: 'Claude 3.5', messages: 18 },
  { id: 'act-4', type: 'doc', title: 'Q3 Financial Report.xlsx', time: '5 hours ago', size: '890 KB', pages: 12 },
  { id: 'act-5', type: 'workspace', title: 'Product Strategy Q4', time: '1 day ago', members: 6, tasks: 24 },
];

export type DocumentType = 'pdf' | 'xlsx' | 'doc' | 'md';

export interface MockDocument {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  sizeMb: number;
  pages: number;
  updatedAt: string;
  starred: boolean;
  tags: string[];
  analyzed: boolean;
  owner: string;
  folder: string;
}

export const mockDocuments: MockDocument[] = [
  { id: '1', name: 'Q3 Market Research Report', type: 'pdf', size: '4.2 MB', sizeMb: 4.2, pages: 87, updatedAt: '2 hours ago', starred: true, tags: ['Research', 'Q3'], analyzed: true, owner: 'Alex', folder: 'Research' },
  { id: '2', name: 'Financial Analysis 2025', type: 'xlsx', size: '1.8 MB', sizeMb: 1.8, pages: 24, updatedAt: '5 hours ago', starred: false, tags: ['Finance'], analyzed: true, owner: 'Maya', folder: 'Finance' },
  { id: '3', name: 'Product Roadmap v3', type: 'doc', size: '892 KB', sizeMb: 0.89, pages: 18, updatedAt: '1 day ago', starred: true, tags: ['Product', 'Strategy'], analyzed: false, owner: 'Alex', folder: 'Product' },
  { id: '4', name: 'Technical Architecture', type: 'md', size: '245 KB', sizeMb: 0.24, pages: 12, updatedAt: '2 days ago', starred: false, tags: ['Engineering'], analyzed: true, owner: 'Noah', folder: 'Engineering' },
  { id: '5', name: 'Brand Guidelines 2025', type: 'pdf', size: '12.4 MB', sizeMb: 12.4, pages: 120, updatedAt: '3 days ago', starred: false, tags: ['Design', 'Brand'], analyzed: false, owner: 'Sarah', folder: 'Marketing' },
  { id: '6', name: 'Sales Playbook', type: 'doc', size: '3.1 MB', sizeMb: 3.1, pages: 45, updatedAt: '1 week ago', starred: true, tags: ['Sales'], analyzed: true, owner: 'Liam', folder: 'Sales' },
  { id: '7', name: 'Customer Interview Notes', type: 'md', size: '132 KB', sizeMb: 0.13, pages: 9, updatedAt: '1 week ago', starred: false, tags: ['Research', 'UX'], analyzed: true, owner: 'Priya', folder: 'Research' },
  { id: '8', name: 'Investor Update Draft', type: 'doc', size: '760 KB', sizeMb: 0.76, pages: 16, updatedAt: '2 weeks ago', starred: false, tags: ['Finance', 'Strategy'], analyzed: false, owner: 'Alex', folder: 'Finance' },
];

export const mockFolders = [
  { name: 'Research', count: 12, color: 'bg-amber-100 text-amber-600' },
  { name: 'Engineering', count: 8, color: 'bg-blue-100 text-blue-600' },
  { name: 'Marketing', count: 15, color: 'bg-purple-100 text-purple-600' },
  { name: 'Finance', count: 6, color: 'bg-green-100 text-green-600' },
];

export const mockWorkspaces = [
  { id: '1', name: 'Product Strategy Q4', description: 'Roadmap, research, and competitive analysis for Q4 2025', members: 6, tasks: { total: 24, done: 18 }, color: 'from-orange-100 to-amber-50', accentColor: '#E9A24C', tags: ['Strategy', 'Q4'], updated: '2 hours ago', starred: true, status: 'active' },
  { id: '2', name: 'Engineering Architecture', description: 'System design docs, API specs, and tech debt tracking', members: 4, tasks: { total: 32, done: 21 }, color: 'from-blue-50 to-indigo-50', accentColor: '#3B82F6', tags: ['Engineering', 'Docs'], updated: '5 hours ago', starred: false, status: 'active' },
  { id: '3', name: 'Marketing Campaign H2', description: 'Content calendar, campaign briefs, and performance tracking', members: 8, tasks: { total: 47, done: 35 }, color: 'from-purple-50 to-pink-50', accentColor: '#8B5CF6', tags: ['Marketing', 'H2'], updated: '1 day ago', starred: true, status: 'active' },
  { id: '4', name: 'Customer Research Hub', description: 'Interview notes, survey results, and persona development', members: 3, tasks: { total: 15, done: 8 }, color: 'from-emerald-50 to-green-50', accentColor: '#10B981', tags: ['Research', 'UX'], updated: '3 days ago', starred: false, status: 'paused' },
];

export type TaskPriority = 'high' | 'medium' | 'low';

export const mockTasks = [
  { id: '1', title: 'Review Q3 market research report', done: true, priority: 'high' as TaskPriority, due: 'Today', workspace: 'Product Strategy Q4', assignee: 'Alex' },
  { id: '2', title: 'Draft product announcement copy', done: false, priority: 'high' as TaskPriority, due: 'Today', workspace: 'Marketing Campaign H2', assignee: 'Sarah' },
  { id: '3', title: 'Analyze competitor pricing strategy', done: false, priority: 'medium' as TaskPriority, due: 'Tomorrow', workspace: 'Product Strategy Q4', assignee: 'Maya' },
  { id: '4', title: 'Update team knowledge base', done: true, priority: 'low' as TaskPriority, due: 'This week', workspace: 'Engineering Architecture', assignee: 'Noah' },
  { id: '5', title: 'Prepare board presentation slides', done: false, priority: 'high' as TaskPriority, due: 'Friday', workspace: 'Product Strategy Q4', assignee: 'Alex' },
  { id: '6', title: 'Run A/B test analysis with AI', done: false, priority: 'medium' as TaskPriority, due: 'Next week', workspace: 'Marketing Campaign H2', assignee: 'Priya' },
  { id: '7', title: 'Summarize user interview notes', done: false, priority: 'low' as TaskPriority, due: 'Next week', workspace: 'Customer Research Hub', assignee: 'Liam' },
];

export const analyticsStats = [
  { label: 'Total Messages', value: '12,847', change: '+23%', color: '#E9A24C', dataKey: 'messages' },
  { label: 'Docs Analyzed', value: '234', change: '+41%', color: '#3B82F6', dataKey: 'documents' },
  { label: 'Hours Saved', value: '847h', change: '+67%', color: '#10B981', dataKey: 'hours' },
  { label: 'AI Accuracy', value: '97.2%', change: '+1.4%', color: '#8B5CF6', dataKey: 'accuracy' },
];

export const analyticsTrend = [
  { name: 'Jan', messages: 45, documents: 8, hours: 20, accuracy: 91 },
  { name: 'Feb', messages: 62, documents: 12, hours: 35, accuracy: 92 },
  { name: 'Mar', messages: 48, documents: 10, hours: 28, accuracy: 93 },
  { name: 'Apr', messages: 78, documents: 18, hours: 52, accuracy: 92 },
  { name: 'May', messages: 65, documents: 15, hours: 45, accuracy: 94 },
  { name: 'Jun', messages: 92, documents: 22, hours: 68, accuracy: 94 },
  { name: 'Jul', messages: 85, documents: 19, hours: 58, accuracy: 95 },
  { name: 'Aug', messages: 110, documents: 26, hours: 82, accuracy: 96 },
  { name: 'Sep', messages: 98, documents: 24, hours: 75, accuracy: 96 },
  { name: 'Oct', messages: 132, documents: 31, hours: 94, accuracy: 97 },
  { name: 'Nov', messages: 125, documents: 28, hours: 88, accuracy: 97 },
  { name: 'Dec', messages: 147, documents: 35, hours: 105, accuracy: 97 },
];

export const weeklyUsage = [
  { day: 'Mon', messages: 42 },
  { day: 'Tue', messages: 68 },
  { day: 'Wed', messages: 55 },
  { day: 'Thu', messages: 89 },
  { day: 'Fri', messages: 76 },
  { day: 'Sat', messages: 34 },
  { day: 'Sun', messages: 28 },
];

export const modelUsage = [
  { name: 'GPT-4o', usage: 892, percent: 68, color: '#E9A24C' },
  { name: 'Claude 3.5', usage: 341, percent: 26, color: '#8B5CF6' },
  { name: 'Gemini Pro', usage: 78, percent: 6, color: '#3B82F6' },
];

export const topTopics = [
  { topic: 'Market Research', count: 342, color: '#E9A24C', percent: 85 },
  { topic: 'Code Review & Debugging', count: 218, color: '#3B82F6', percent: 54 },
  { topic: 'Content Creation', count: 197, color: '#8B5CF6', percent: 49 },
  { topic: 'Data Analysis', count: 156, color: '#10B981', percent: 39 },
  { topic: 'Product Strategy', count: 98, color: '#F59E0B', percent: 24 },
];

export const profileSummary = {
  name: 'Alex Morgan',
  email: 'alex@company.com',
  role: 'Head of Product',
  company: 'Acme Corp',
  joined: 'November 2024',
  bio: 'Product leader passionate about AI, design systems, and building products that people love. Currently exploring the intersection of AI and productivity.',
  tags: ['AI/ML', 'Product Strategy', 'Design Systems', 'Startups', 'Writing'],
};

export const profileStats = [
  { label: 'Conversations', value: '1,247' },
  { label: 'Documents', value: '89' },
  { label: 'Hours Saved', value: '847h' },
  { label: 'AI Score', value: '94/100' },
];

export const profileActivity = [
  { id: '1', action: 'Started a new chat', detail: 'Market Research Analysis', time: '2m ago', category: 'Chat' },
  { id: '2', action: 'Uploaded document', detail: 'Q3 Financial Report.xlsx', time: '1h ago', category: 'Document' },
  { id: '3', action: 'Created workspace', detail: 'Product Strategy Q4', time: '3h ago', category: 'Workspace' },
  { id: '4', action: 'Analyzed document', detail: 'Brand Guidelines 2025.pdf', time: '1d ago', category: 'AI' },
  { id: '5', action: 'Switched AI model', detail: 'Claude 3.5 to GPT-4o', time: '2d ago', category: 'Settings' },
];

export const billingUsage = [
  { label: 'AI Messages', used: 2847, total: '∞', percent: 0, color: '#E9A24C' },
  { label: 'Document Storage', used: 4.2, total: 10, unit: 'GB', percent: 42, color: '#3B82F6' },
  { label: 'API Requests', used: 12400, total: 50000, percent: 24.8, color: '#8B5CF6' },
];

export const invoices = [
  { id: 'INV-2025-12', date: 'Dec 1, 2025', amount: 19, status: 'paid', method: 'Visa 4242' },
  { id: 'INV-2025-11', date: 'Nov 1, 2025', amount: 19, status: 'paid', method: 'Visa 4242' },
  { id: 'INV-2025-10', date: 'Oct 1, 2025', amount: 19, status: 'paid', method: 'Visa 4242' },
  { id: 'INV-2025-09', date: 'Sep 1, 2025', amount: 19, status: 'paid', method: 'Visa 4242' },
  { id: 'INV-2025-08', date: 'Aug 1, 2025', amount: 19, status: 'paid', method: 'Visa 4242' },
  { id: 'INV-2025-07', date: 'Jul 1, 2025', amount: 19, status: 'paid', method: 'Visa 4242' },
];

export const billingPlans = [
  { id: 'starter', name: 'Starter', price: 0, active: false, features: ['100 messages/month', '3 documents', 'Community support'] },
  { id: 'pro', name: 'Pro', price: 19, active: true, features: ['Unlimited messages', 'All AI models', '10GB storage', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 89, active: false, features: ['SSO', 'Custom models', 'Dedicated support', 'SLA'] },
];
