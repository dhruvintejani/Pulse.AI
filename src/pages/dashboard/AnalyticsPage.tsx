import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, MessageSquare, Clock, Brain, Zap, BarChart3,
  ArrowUp, Calendar, Database, Users, Layers, Activity
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { DashboardPanel } from '@/components/dashboard';
import {
  aiRequestTrend,
  analyticsOverviewCards,
  dailyActivityHeatmap,
  modelDistribution,
  monthlyActivity,
  requestCategories,
  tokenBreakdown,
  workspaceAnalytics,
} from '@/constants/analytics';
import { queryKeys } from '@/constants/queryKeys';
import { useMockResource } from '@/hooks/useMockResource';
import { useTheme } from '@/hooks/useTheme';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const statIcons = [MessageSquare, Database, Users, Clock];

type WorkspaceAnalytics = (typeof workspaceAnalytics)[number];

const statusVariant = (status: string) => {
  if (status === 'Healthy') return 'success' as const;
  if (status === 'Growing') return 'accent' as const;
  return 'warning' as const;
};

const AnalyticsPage = () => {
  const { isDark } = useTheme();
  const analyticsQuery = useMockResource({
    queryKey: queryKeys.analytics,
    data: {
      cards: analyticsOverviewCards,
      daily: aiRequestTrend,
      monthly: monthlyActivity,
      workspaces: workspaceAnalytics,
      models: modelDistribution,
      tokens: tokenBreakdown,
      heatmap: dailyActivityHeatmap,
      categories: requestCategories,
    },
  });
  const data = analyticsQuery.data ?? {
    cards: [],
    daily: [],
    monthly: [],
    workspaces: [],
    models: [],
    tokens: [],
    heatmap: [],
    categories: [],
  };

  const axisColor = isDark ? '#9E907F' : '#999999';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const tooltipStyle = useMemo(() => ({
    background: isDark ? 'rgba(23,19,15,0.96)' : '#FFFDF8',
    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
    borderRadius: 14,
    color: isDark ? '#F7EBDD' : '#1F1F1F',
    boxShadow: isDark ? '0 18px 48px rgba(0,0,0,0.34)' : '0 12px 30px rgba(0,0,0,0.08)',
    fontSize: 11,
  }), [isDark]);

  const workspaceColumns = useMemo<DataTableColumn<WorkspaceAnalytics>[]>(() => [
    {
      id: 'workspace',
      header: 'Workspace',
      accessor: (item) => item.workspace,
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-bold text-[#1F1F1F]">{item.workspace}</p>
          <p className="text-xs text-[#999] mt-0.5">{item.users} users · {item.documents} documents</p>
        </div>
      ),
    },
    { id: 'requests', header: 'Requests', accessor: (item) => item.requests, sortable: true },
    { id: 'tokens', header: 'Tokens', accessor: (item) => item.tokens, sortable: true, render: (item) => `${item.tokens}M` },
    {
      id: 'score',
      header: 'Score',
      accessor: (item) => item.score,
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 min-w-36">
          <div className="h-1.5 flex-1 rounded-full bg-[rgba(0,0,0,0.06)]">
            <div className="h-full rounded-full bg-[#E9A24C]" style={{ width: `${item.score}%` }} />
          </div>
          <span className="text-xs font-semibold text-[#666] w-8 text-right">{item.score}</span>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (item) => item.status,
      sortable: true,
      filterOptions: ['Healthy', 'Growing', 'Review'].map((status) => ({ label: status, value: status })),
      render: (item) => <Badge variant={statusVariant(item.status)} size="sm" dot>{item.status}</Badge>,
    },
  ], []);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-32 space-y-6">
        <FadeIn className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Analytics</h1>
            <p className="text-sm text-[#999]">AI usage, tokens, activity, and workspace intelligence</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-[#666] px-4 py-2.5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#FFFDF8] shadow-card hover:border-[rgba(233,162,76,0.3)] transition-all focus-ring">
            <Calendar size={15} aria-hidden="true" />
            Last 30 days
            <BarChart3 size={13} className="text-[#CCC] ml-1" aria-hidden="true" />
          </button>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-44 rounded-2xl" />)}
            {!analyticsQuery.isLoading && data.cards.map((stat, i) => {
              const Icon = statIcons[i] ?? TrendingUp;
              return (
                <motion.div key={stat.label} whileHover={{ y: -3 }} className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                      <Icon size={16} style={{ color: stat.color }} aria-hidden="true" />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      <ArrowUp size={10} strokeWidth={3} aria-hidden="true" />
                      <span className="text-[11px] font-bold">{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#1F1F1F] mb-0.5">{stat.value}</p>
                  <p className="text-xs text-[#999] font-medium">{stat.label}</p>
                  <p className="text-[11px] text-[#BBB] mt-2">{stat.detail}</p>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        <div className="grid xl:grid-cols-3 gap-5">
          <FadeIn delay={0.1} className="xl:col-span-2">
            <DashboardPanel title="Usage Charts" description="Daily AI requests, chats, and document analysis." className="h-full">
              <div className="h-80" role="img" aria-label="Daily AI usage area chart">
                {analyticsQuery.isLoading ? <Skeleton className="h-full rounded-2xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.daily} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E9A24C" stopOpacity={0.32} />
                          <stop offset="95%" stopColor="#E9A24C" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
                      <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                      <Area type="monotone" dataKey="requests" name="AI Requests" stroke="#E9A24C" strokeWidth={3} fill="url(#requestsGradient)" />
                      <Area type="monotone" dataKey="chats" name="Chats" stroke="#3B82F6" strokeWidth={2} fill="transparent" />
                      <Area type="monotone" dataKey="documents" name="Documents" stroke="#8B5CF6" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.12}>
            <DashboardPanel title="Tokens Used" description="Token volume by type." className="h-full">
              <div className="h-64" role="img" aria-label="Token usage pie chart">
                {analyticsQuery.isLoading ? <Skeleton className="h-full rounded-2xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.tokens} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={4} stroke="none">
                        {data.tokens.map((item) => <Cell key={item.name} fill={item.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="space-y-2">
                {data.tokens.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-[#666]"><span className="w-2 h-2 rounded-full" style={{ background: item.color }} />{item.name}</span>
                    <span className="font-semibold text-[#1F1F1F]">{item.value}M</span>
                  </div>
                ))}
              </div>
            </DashboardPanel>
          </FadeIn>
        </div>

        <div className="grid xl:grid-cols-3 gap-5">
          <FadeIn delay={0.14}>
            <DashboardPanel title="AI Requests" description="Requests by category." className="h-full">
              <div className="h-72" role="img" aria-label="AI requests bar chart">
                {analyticsQuery.isLoading ? <Skeleton className="h-full rounded-2xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.categories} layout="vertical" margin={{ top: 4, right: 12, left: 16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} width={78} />
                      <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                      <Bar dataKey="requests" radius={[0, 8, 8, 0]} fill="#E9A24C" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.16}>
            <DashboardPanel title="Daily Activity" description="Hourly engagement profile." className="h-full">
              <div className="h-72" role="img" aria-label="Daily activity line chart">
                {analyticsQuery.isLoading ? <Skeleton className="h-full rounded-2xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.heatmap} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                      <Line type="monotone" dataKey="activity" stroke="#3B82F6" strokeWidth={3} dot={{ r: 3, fill: '#3B82F6' }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </DashboardPanel>
          </FadeIn>

          <FadeIn delay={0.18}>
            <DashboardPanel title="Model Split" description="Request distribution by model." className="h-full">
              <div className="h-56" role="img" aria-label="Model usage pie chart">
                {analyticsQuery.isLoading ? <Skeleton className="h-full rounded-2xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.models} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={3} stroke="none">
                        {data.models.map((model) => <Cell key={model.name} fill={model.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="space-y-2">
                {data.models.map((model) => (
                  <div key={model.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-medium text-[#666]"><span className="w-2.5 h-2.5 rounded-full" style={{ background: model.color }} />{model.name}</span>
                    <span className="text-xs text-[#999]">{model.value}%</span>
                  </div>
                ))}
              </div>
            </DashboardPanel>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <DashboardPanel title="Monthly Activity" description="Requests, token volume, active users, and workspace growth.">
            <div className="h-80" role="img" aria-label="Monthly activity combined line chart">
              {analyticsQuery.isLoading ? <Skeleton className="h-full rounded-2xl" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: isDark ? '#F7EBDD' : '#1F1F1F' }} />
                    <Line yAxisId="left" type="monotone" dataKey="requests" name="Requests" stroke="#E9A24C" strokeWidth={3} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="tokens" name="Tokens (M)" stroke="#3B82F6" strokeWidth={3} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="workspaces" name="Workspaces" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </DashboardPanel>
        </FadeIn>

        <div className="grid xl:grid-cols-3 gap-5">
          <FadeIn delay={0.22} className="xl:col-span-2">
            <DataTable
              data={data.workspaces}
              columns={workspaceColumns}
              getRowId={(item) => item.id}
              loading={analyticsQuery.isLoading}
              searchPlaceholder="Search workspaces..."
              emptyTitle="No workspace analytics found"
              emptyDescription="Try changing your search or status filter."
              pageSize={5}
              ariaLabel="Workspace analytics table"
            />
          </FadeIn>

          <FadeIn delay={0.24}>
            <div className="bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] rounded-2xl p-5 text-white h-full">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={16} className="text-[#E9A24C]" aria-hidden="true" />
                <h2 className="text-sm font-bold">AI Productivity Score</h2>
              </div>
              <div className="relative w-32 h-32 mx-auto mb-5">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: 'Score', value: 94 }, { name: 'Remaining', value: 6 }]} dataKey="value" innerRadius={48} outerRadius={62} startAngle={90} endAngle={-270} stroke="none">
                      <Cell fill="#E9A24C" />
                      <Cell fill="rgba(255,255,255,0.08)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">94</span>
                  <span className="text-[10px] text-white/40">/ 100</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Response Quality', score: 97, icon: Brain },
                  { label: 'Task Completion', score: 91, icon: Activity },
                  { label: 'Workspace Adoption', score: 88, icon: Layers },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] text-white/60 flex items-center gap-1.5"><Icon size={11} aria-hidden="true" />{item.label}</span>
                        <span className="text-[11px] font-bold text-white">{item.score}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/8"><div className="h-full rounded-full bg-[#E9A24C]" style={{ width: `${item.score}%` }} /></div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="flex items-center gap-2 mb-1"><TrendingUp size={13} className="text-[#E9A24C]" aria-hidden="true" /><span className="text-xs font-semibold text-white">Top 8% of users</span></div>
                <p className="text-[11px] text-white/40">Mock benchmark showing strong AI adoption and productivity gains.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
