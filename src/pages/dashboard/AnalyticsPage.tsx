import { motion } from 'framer-motion';
import {
  TrendingUp, MessageSquare, FileText, Clock,
  Brain, Zap, BarChart3, ArrowUp, Calendar
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { analyticsStats, analyticsTrend, modelUsage, topTopics, weeklyUsage } from '@/constants/mockData';
import { queryKeys } from '@/constants/queryKeys';
import { useMockResource } from '@/hooks/useMockResource';

const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const statIcons = [MessageSquare, FileText, Clock, Brain];

const chartTooltipStyle = {
  background: '#1F1F1F',
  border: '0',
  borderRadius: '10px',
  color: '#fff',
  fontSize: '11px',
};

const AnalyticsPage = () => {
  const analyticsQuery = useMockResource({
    queryKey: queryKeys.analytics,
    data: { stats: analyticsStats, trend: analyticsTrend, weekly: weeklyUsage, models: modelUsage, topics: topTopics },
  });
  const data = analyticsQuery.data ?? { stats: [], trend: [], weekly: [], models: [], topics: [] };

  const topicColumns: DataTableColumn<(typeof topTopics)[number]>[] = [
    { id: 'topic', header: 'Topic', accessor: (item) => item.topic, sortable: true },
    { id: 'count', header: 'Count', accessor: (item) => item.count, sortable: true },
    {
      id: 'share',
      header: 'Share',
      accessor: (item) => item.percent,
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 min-w-40">
          <div className="h-1.5 flex-1 rounded-full bg-[rgba(0,0,0,0.05)]">
            <div className="h-full rounded-full" style={{ width: `${item.percent}%`, background: item.color }} />
          </div>
          <span className="text-xs text-[#999] w-8 text-right">{item.percent}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        <FadeIn className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Analytics</h1>
            <p className="text-sm text-[#999]">AI usage insights and productivity metrics</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-[#666] px-4 py-2.5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#FFFDF8] shadow-card hover:border-[rgba(233,162,76,0.3)] transition-all">
            <Calendar size={15} />
            Last 30 days
            <BarChart3 size={13} className="text-[#CCC] ml-1" />
          </button>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-52 rounded-2xl" />)}
            {!analyticsQuery.isLoading && data.stats.map((stat, i) => {
              const Icon = statIcons[i] ?? TrendingUp;
              return (
                <motion.div key={stat.label} whileHover={{ y: -3 }} className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}18` }}>
                      <Icon size={15} style={{ color: stat.color }} />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      <ArrowUp size={10} strokeWidth={3} />
                      <span className="text-[11px] font-bold">{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#1F1F1F] mb-0.5">{stat.value}</p>
                  <p className="text-xs text-[#999] font-medium mb-3">{stat.label}</p>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.trend} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                        <Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: stat.color, strokeOpacity: 0.12 }} />
                        <Area type="monotone" dataKey={stat.dataKey} stroke={stat.color} fill={stat.color} fillOpacity={0.12} strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-5">
          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-bold text-[#1F1F1F]">Weekly Message Volume</h2>
                  <p className="text-xs text-[#999] mt-0.5">Messages sent per day this week</p>
                </div>
                <Badge variant="success" size="sm" dot>+18% vs last week</Badge>
              </div>
              <div className="h-36">
                {analyticsQuery.isLoading ? <Skeleton className="h-full rounded-xl" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weekly} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#CCC', fontSize: 10 }} />
                      <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(233,162,76,0.08)' }} />
                      <Bar dataKey="messages" radius={[8, 8, 0, 0]} fill="#E9A24C" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Model Usage</h2>
              <div className="relative w-32 h-32 mx-auto mb-5">
                {analyticsQuery.isLoading ? <Skeleton className="h-32 w-32 rounded-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.models} dataKey="usage" innerRadius={44} outerRadius={60} paddingAngle={3} stroke="none">
                        {data.models.map((model) => <Cell key={model.name} fill={model.color} />)}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {!analyticsQuery.isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-[#1F1F1F]">1.3K</span>
                    <span className="text-[10px] text-[#999]">total</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {data.models.map((model) => (
                  <div key={model.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: model.color }} />
                      <span className="text-xs font-medium text-[#444]">{model.name}</span>
                    </div>
                    <span className="text-xs text-[#999]">{model.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FadeIn delay={0.2} className="lg:col-span-2">
            <DataTable
              data={data.topics}
              columns={topicColumns}
              getRowId={(item) => item.topic}
              loading={analyticsQuery.isLoading}
              searchPlaceholder="Search topics..."
              emptyTitle="No topics found"
              emptyDescription="Try a different query or date range."
              pageSize={4}
            />
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={16} className="text-[#E9A24C]" />
                <h2 className="text-sm font-bold">AI Productivity Score</h2>
              </div>
              <div className="relative w-28 h-28 mx-auto mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: 'Score', value: 94 }, { name: 'Remaining', value: 6 }]} dataKey="value" innerRadius={43} outerRadius={55} startAngle={90} endAngle={-270} stroke="none">
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
              <div className="space-y-2">
                {[
                  { label: 'Response Quality', score: 97 },
                  { label: 'Task Completion', score: 91 },
                  { label: 'Time Efficiency', score: 94 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-white/60">{item.label}</span>
                      <span className="text-[11px] font-bold text-white">{item.score}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/8"><div className="h-full rounded-full bg-[#E9A24C]" style={{ width: `${item.score}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="flex items-center gap-2 mb-1"><TrendingUp size={13} className="text-[#E9A24C]" /><span className="text-xs font-semibold text-white">Top 8% of users</span></div>
                <p className="text-[11px] text-white/40">Keep it up! You're outperforming 92% of Pulse AI users.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
