import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  Clock,
  FileText,
  Layers,
  MessageSquare,
  Plus,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import { DashboardPanel } from '@/components/dashboard';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  dashboardActivityTimeline,
  dashboardAiUsage,
  dashboardAnalyticsCards,
  dashboardModelUsage,
  dashboardOverview,
  dashboardRecentChats,
  dashboardRecentDocuments,
  dashboardRecentNotifications,
  dashboardUsageTrend,
  dashboardWorkspaceSummary,
} from '@/constants/dashboard';
import { queryKeys } from '@/constants/queryKeys';
import { DASHBOARD_PATHS } from '@/constants/routes';
import { useMockResource } from '@/hooks/useMockResource';
import { useTheme } from '@/hooks/useTheme';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
type RecentChat = (typeof dashboardRecentChats)[number];
type RecentDocument = (typeof dashboardRecentDocuments)[number];
type TimelineType = (typeof dashboardActivityTimeline)[number]['type'];

const dashboardMockData = {
  overview: dashboardOverview,
  recentChats: dashboardRecentChats,
  recentDocuments: dashboardRecentDocuments,
  analyticsCards: dashboardAnalyticsCards,
  usageTrend: dashboardUsageTrend,
  modelUsage: dashboardModelUsage,
  aiUsage: dashboardAiUsage,
  workspaceSummary: dashboardWorkspaceSummary,
  activityTimeline: dashboardActivityTimeline,
  recentNotifications: dashboardRecentNotifications,
};

const quickActions = [
  { icon: MessageSquare, label: 'New Chat', desc: 'Start a conversation', color: 'from-orange-100 to-amber-50', iconColor: 'text-[#E9A24C]', path: DASHBOARD_PATHS.CHAT },
  { icon: FileText, label: 'Upload Doc', desc: 'Analyze a document', color: 'from-blue-50 to-indigo-50', iconColor: 'text-blue-500', path: DASHBOARD_PATHS.DOCUMENTS },
  { icon: BarChart3, label: 'Analytics', desc: 'View insights', color: 'from-purple-50 to-pink-50', iconColor: 'text-purple-500', path: DASHBOARD_PATHS.ANALYTICS },
  { icon: Zap, label: 'Workflows', desc: 'Automate tasks', color: 'from-emerald-50 to-green-50', iconColor: 'text-emerald-500', path: DASHBOARD_PATHS.WORKSPACE },
];

const statIcons = [MessageSquare, FileText, Clock, Activity];
const modelColors = ['#E9A24C', '#8B5CF6', '#3B82F6'];

const timelineIcons: Record<TimelineType, typeof MessageSquare> = {
  chat: MessageSquare,
  document: FileText,
  workspace: Layers,
  billing: Star,
  system: Sparkles,
};

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }} className={className}>
    {children}
  </motion.div>
);

const getStatusVariant = (status: string): BadgeVariant => {
  if (['Active', 'Analyzed', 'High'].includes(status)) return 'success';
  if (['Processing', 'Medium', 'Pinned'].includes(status)) return 'warning';
  if (['Paused', 'Archived', 'Low'].includes(status)) return 'neutral';
  return 'accent';
};

const DashboardHome = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeModel, setActiveModel] = useState('GPT-4o');
  const dashboardQuery = useMockResource({ queryKey: queryKeys.dashboard, data: dashboardMockData });
  const dashboardData = dashboardQuery.data ?? dashboardMockData;

  const chartAxisColor = isDark ? '#9E907F' : '#999999';
  const chartGridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tooltipStyle = useMemo(() => ({
    background: isDark ? 'rgba(23,19,15,0.96)' : '#FFFDF8',
    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
    borderRadius: 14,
    color: isDark ? '#F7EBDD' : '#1F1F1F',
    boxShadow: isDark ? '0 18px 48px rgba(0,0,0,0.34)' : '0 12px 30px rgba(0,0,0,0.08)',
  }), [isDark]);

  const chatColumns = useMemo<DataTableColumn<RecentChat>[]>(() => [
    {
      id: 'title',
      header: 'Conversation',
      accessor: (row) => row.title,
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[#1F1F1F]">{row.title}</p>
          <p className="text-xs text-[#999] mt-0.5">{row.owner} · {row.updatedAt}</p>
        </div>
      ),
    },
    { id: 'model', header: 'Model', accessor: (row) => row.model, sortable: true, filterOptions: ['GPT-4o', 'Claude 3.5', 'Gemini Pro'].map((value) => ({ label: value, value })) },
    { id: 'messages', header: 'Messages', accessor: (row) => row.messages, sortable: true },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.status,
      sortable: true,
      filterOptions: ['Active', 'Pinned', 'Favorite', 'Archived'].map((value) => ({ label: value, value })),
      render: (row) => <Badge variant={getStatusVariant(row.status)} size="sm" dot>{row.status}</Badge>,
    },
  ], []);

  const documentColumns = useMemo<DataTableColumn<RecentDocument>[]>(() => [
    {
      id: 'name',
      header: 'Document',
      accessor: (row) => row.name,
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-[#1F1F1F]">{row.name}</p>
          <p className="text-xs text-[#999] mt-0.5">{row.owner} · {row.updatedAt}</p>
        </div>
      ),
    },
    { id: 'type', header: 'Type', accessor: (row) => row.type, sortable: true, filterOptions: ['PDF', 'Sheet', 'Markdown', 'Doc'].map((value) => ({ label: value, value })) },
    { id: 'pages', header: 'Pages', accessor: (row) => row.pages, sortable: true },
    { id: 'size', header: 'Size', accessor: (row) => row.size, sortable: true },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => row.status,
      sortable: true,
      filterOptions: ['Analyzed', 'Processing', 'Draft'].map((value) => ({ label: value, value })),
      render: (row) => <Badge variant={getStatusVariant(row.status)} size="sm" dot>{row.status}</Badge>,
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-32 space-y-6">
        <FadeIn className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" aria-hidden="true">👋</span>
              <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight">Good morning, Alex</h1>
            </div>
            <p className="text-sm text-[#999]">Here's what's happening in your workspace today.</p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={() => navigate(DASHBOARD_PATHS.CHAT)} className="w-full sm:w-auto sm:flex">New Chat</Button>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-live="polite">
            {dashboardQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}
            {!dashboardQuery.isLoading && dashboardData.overview.map((stat, i) => {
              const Icon = statIcons[i] ?? Activity;
              return (
                <motion.div key={stat.label} whileHover={{ y: -3, scale: 1.01 }} className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center"><Icon size={16} className="text-[#E9A24C]" aria-hidden="true" /></div>
                    <Badge variant="success" size="sm" dot>{stat.change}</Badge>
                  </div>
                  <p className="text-2xl font-black text-[#1F1F1F]">{stat.value}</p>
                  <p className="text-xs text-[#999] font-medium mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <DashboardPanel title="Quick Actions">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <motion.button key={action.label} type="button" whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(action.path)} className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-left border border-white/80 hover:shadow-card transition-shadow duration-200 focus-ring`}>
                    <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center mb-3"><Icon size={17} className={action.iconColor} aria-hidden="true" /></div>
                    <p className="text-sm font-bold text-[#1F1F1F]">{action.label}</p>
                    <p className="text-[11px] text-[#999] mt-0.5">{action.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </DashboardPanel>
        </FadeIn>

        <div className="grid xl:grid-cols-3 gap-5">
          <FadeIn delay={0.1} className="xl:col-span-2">
            <DashboardPanel title="Analytics Overview" description="AI activity across chats, documents, and automations." className="h-full">
              {dashboardQuery.isLoading ? (
                <Skeleton className="h-72 rounded-2xl" />
              ) : (
                <div className="h-72" role="img" aria-label="Weekly AI activity chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.usageTrend} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chatUsage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E9A24C" stopOpacity={0.34} />
                          <stop offset="95%" stopColor="#E9A24C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: chartAxisColor, fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: chartAxisColor, fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                      <Area type="monotone" dataKey="chats" stroke="#E9A24C" strokeWidth={3} fill="url(#chatUsage)" name="Chats" />
                      <Area type="monotone" dataKey="documents" stroke="#3B82F6" strokeWidth={2} fill="transparent" name="Documents" />
                      <Area type="monotone" dataKey="automations" stroke="#8B5CF6" strokeWidth={2} fill="transparent" name="Automations" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.12} className="space-y-5">
            <DashboardPanel title="Analytics Cards" description="Key operating signals." className="h-full">
              <div className="space-y-3">
                {dashboardQuery.isLoading && Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-20 rounded-xl" />)}
                {!dashboardQuery.isLoading && dashboardData.analyticsCards.map((card) => (
                  <div key={card.label} className="rounded-xl border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.02)] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#999] font-medium">{card.label}</p>
                        <p className="text-xl font-black text-[#1F1F1F] mt-1">{card.value}</p>
                      </div>
                      <Badge variant={card.change.startsWith('-') ? 'success' : 'accent'} size="sm">{card.change}</Badge>
                    </div>
                    <p className="text-[11px] text-[#999] mt-2">{card.detail}</p>
                  </div>
                ))}
              </div>
            </DashboardPanel>
          </FadeIn>
        </div>

        <div className="grid xl:grid-cols-3 gap-5">
          <FadeIn delay={0.14} className="xl:col-span-2">
            <DashboardPanel title="Recent Chats" description="Search, sort, filter, and paginate recent conversations." action={<button type="button" onClick={() => navigate(DASHBOARD_PATHS.CHAT)} className="text-xs text-[#E9A24C] font-semibold hover:underline flex items-center gap-1 rounded-md focus-ring">Open chats <ArrowRight size={12} aria-hidden="true" /></button>}>
              <DataTable
                data={dashboardData.recentChats}
                columns={chatColumns}
                getRowId={(row) => row.id}
                searchPlaceholder="Search conversations..."
                loading={dashboardQuery.isLoading}
                emptyTitle="No conversations found"
                emptyDescription="Try a different conversation, model, or status filter."
                pageSize={3}
                ariaLabel="Recent chats table"
                className="shadow-none border-[rgba(0,0,0,0.04)]"
              />
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.16}>
            <DashboardPanel title="AI Usage" description="Current monthly allocation." className="h-full">
              {dashboardQuery.isLoading ? (
                <div className="space-y-4"><Skeleton className="h-10 rounded-xl" /><Skeleton className="h-10 rounded-xl" /><Skeleton className="h-10 rounded-xl" /><Skeleton className="h-52 rounded-2xl" /></div>
              ) : (
                <>
                  <div className="space-y-4">
                    {dashboardData.aiUsage.map((usage) => {
                      const percent = Math.round((usage.used / usage.total) * 100);
                      return (
                        <div key={usage.label}>
                          <div className="flex justify-between text-xs mb-1.5"><span className="text-[#666] font-medium">{usage.label}</span><span className="text-[#999]">{usage.used}{usage.unit} / {usage.total}{usage.unit}</span></div>
                          <div className="h-1.5 rounded-full bg-[rgba(0,0,0,0.06)]" role="progressbar" aria-label={`${usage.label} usage`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: usage.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-52 mt-6" role="img" aria-label="AI model usage chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dashboardData.modelUsage} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={4} stroke="none">
                          {dashboardData.modelUsage.map((entry, index) => <Cell key={entry.name} fill={modelColors[index % modelColors.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </DashboardPanel>
          </FadeIn>
        </div>

        <div className="grid xl:grid-cols-3 gap-5">
          <FadeIn delay={0.18} className="xl:col-span-2">
            <DashboardPanel title="Recent Documents" description="Search, sort, filter, and paginate recent document activity." action={<button type="button" onClick={() => navigate(DASHBOARD_PATHS.DOCUMENTS)} className="text-xs text-[#E9A24C] font-semibold hover:underline flex items-center gap-1 rounded-md focus-ring">Open docs <ArrowRight size={12} aria-hidden="true" /></button>}>
              <DataTable
                data={dashboardData.recentDocuments}
                columns={documentColumns}
                getRowId={(row) => row.id}
                searchPlaceholder="Search documents..."
                loading={dashboardQuery.isLoading}
                emptyTitle="No documents found"
                emptyDescription="Try a different file name, type, or status filter."
                pageSize={3}
                ariaLabel="Recent documents table"
                className="shadow-none border-[rgba(0,0,0,0.04)]"
              />
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.2}>
            <DashboardPanel title="Workspace Summary" description="Team progress by workspace." className="h-full">
              <div className="space-y-3">
                {dashboardData.workspaceSummary.map((workspace) => {
                  const percent = Math.round((workspace.tasksDone / workspace.tasksTotal) * 100);
                  return (
                    <motion.button key={workspace.id} type="button" whileHover={{ x: 2 }} onClick={() => navigate(DASHBOARD_PATHS.WORKSPACE)} className="w-full text-left rounded-xl border border-[rgba(0,0,0,0.05)] p-3 hover:bg-[rgba(233,162,76,0.04)] transition-colors focus-ring">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#1F1F1F] truncate">{workspace.name}</p>
                          <p className="text-xs text-[#999] mt-0.5 flex items-center gap-1"><Users size={12} aria-hidden="true" />{workspace.members} members · {workspace.updatedAt}</p>
                        </div>
                        <Badge variant={getStatusVariant(workspace.status)} size="sm" dot>{workspace.status}</Badge>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] text-[#999] mb-1.5"><span>{workspace.tasksDone}/{workspace.tasksTotal} tasks</span><span>{percent}%</span></div>
                        <div className="h-1.5 rounded-full bg-[rgba(0,0,0,0.06)]"><div className="h-full rounded-full bg-[#E9A24C]" style={{ width: `${percent}%` }} /></div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </DashboardPanel>
          </FadeIn>
        </div>

        <div className="grid xl:grid-cols-3 gap-5">
          <FadeIn delay={0.22}>
            <DashboardPanel title="Active Model" description="Choose the model used for new chats." className="h-full bg-[#1F1F1F] text-white border-transparent" titleClassName="text-white" descriptionClassName="text-white/50">
              <div className="flex items-center gap-2 mb-4"><Brain size={16} className="text-[#E9A24C]" aria-hidden="true" /><h2 className="text-sm font-bold text-white">Model routing</h2></div>
              <div className="space-y-2" role="radiogroup" aria-label="Active model">
                {dashboardData.modelUsage.map((model) => (
                  <button key={model.name} type="button" role="radio" aria-checked={activeModel === model.name} onClick={() => setActiveModel(model.name)} className={`w-full flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all focus-ring ${activeModel === model.name ? 'bg-[rgba(233,162,76,0.15)] border border-[rgba(233,162,76,0.3)]' : 'hover:bg-white/5'}`}>
                    <div className="flex items-center gap-2.5"><div className={`w-2 h-2 rounded-full ${activeModel === model.name ? 'bg-[#E9A24C]' : 'bg-white/20'}`} aria-hidden="true" /><span className="text-sm font-medium text-white">{model.name}</span></div>
                    <Badge variant={activeModel === model.name ? 'accent' : 'neutral'} size="sm">{model.requests}</Badge>
                  </button>
                ))}
              </div>
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.24}>
            <DashboardPanel title="Activity Timeline" description="Latest workspace events." className="h-full">
              <div className="space-y-3">
                {dashboardData.activityTimeline.map((item) => {
                  const Icon = timelineIcons[item.type];
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center shrink-0"><Icon size={15} className="text-[#E9A24C]" aria-hidden="true" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-bold text-[#1F1F1F] leading-snug">{item.title}</p>
                          <span className="text-[10px] text-[#BBB] shrink-0">{item.time}</span>
                        </div>
                        <p className="text-xs text-[#999] mt-1 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.26}>
            <DashboardPanel title="Recent Notifications" description="Unread items and product updates." className="h-full" action={<Bell size={15} className="text-[#E9A24C]" aria-hidden="true" />}>
              <div className="space-y-2">
                {dashboardData.recentNotifications.map((notification) => (
                  <motion.button key={notification.id} type="button" whileHover={{ x: 2 }} onClick={() => navigate(DASHBOARD_PATHS.NOTIFICATIONS)} className="w-full text-left rounded-xl border border-[rgba(0,0,0,0.05)] p-3 hover:bg-[rgba(233,162,76,0.04)] transition-colors focus-ring">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full ${notification.unread ? 'bg-[#E9A24C]' : 'bg-[rgba(0,0,0,0.12)]'}`} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1F1F1F] truncate">{notification.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusVariant(notification.priority)} size="sm">{notification.priority}</Badge>
                          <span className="text-[11px] text-[#999]">{notification.type} · {notification.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </DashboardPanel>
          </FadeIn>
        </div>

        <FadeIn delay={0.28}>
          <DashboardPanel title="Suggested for you" action={<Sparkles size={15} className="text-[#E9A24C]" aria-hidden="true" />}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {['Summarize my latest documents', 'Draft a product announcement', 'Research competitor landscape', 'Generate 10 blog post ideas', 'Analyze my sales data trends', 'Write a technical blog post'].map((prompt) => (
                <motion.button key={prompt} type="button" whileHover={{ scale: 1.01, x: 2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(DASHBOARD_PATHS.CHAT)} className="text-left text-sm text-[#444] px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.06)] hover:border-[rgba(233,162,76,0.3)] hover:bg-[rgba(233,162,76,0.04)] transition-all duration-150 font-medium focus-ring">
                  {prompt}
                </motion.button>
              ))}
            </div>
          </DashboardPanel>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.button type="button" whileHover={{ scale: 1.01 }} className="w-full bg-gradient-to-br from-[#E9A24C] to-[#D4853A] rounded-2xl p-5 text-white cursor-pointer text-left focus-ring" onClick={() => navigate(DASHBOARD_PATHS.BILLING)}>
            <div className="flex items-center gap-2 mb-2"><Star size={15} className="text-white/80" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-wider text-white/80">Upgrade</span></div>
            <p className="text-sm font-bold mb-3">Unlock unlimited AI access</p>
            <span className="inline-flex items-center justify-center select-none cursor-pointer btn-secondary rounded-xl px-3 py-1.5 text-xs font-medium gap-1.5 w-full">
              View Enterprise plans <ArrowRight size={13} className="ml-1" aria-hidden="true" />
            </span>
          </motion.button>
        </FadeIn>
      </div>
    </div>
  );
};

export default DashboardHome;
