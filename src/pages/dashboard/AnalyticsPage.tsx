import { motion } from 'framer-motion';
import {
  TrendingUp, MessageSquare, FileText, Clock,
  Brain, Zap, BarChart3, ArrowUp, Calendar
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

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

// Simple bar chart
const BarChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((val, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group"
          style={{ background: color }}
          initial={{ height: 0 }}
          animate={{ height: `${(val / max) * 100}%` }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1F1F1F] text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {val}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Line chart SVG
const LineChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 60;
  const padding = 4;

  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * (width - 2 * padding),
    y: padding + ((max - val) / range) * (height - 2 * padding),
  }));

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 3;
    const cpx2 = point.x - (point.x - prev.x) / 3;
    return `${acc} C ${cpx1} ${prev.y} ${cpx2} ${point.y} ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaD}
        fill={`url(#grad-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="1.5"
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8 + i * 0.05 }}
        />
      ))}
    </svg>
  );
};

const topModels = [
  { name: 'GPT-4o', usage: 892, percent: 68, color: '#E9A24C' },
  { name: 'Claude 3.5', usage: 341, percent: 26, color: '#8B5CF6' },
  { name: 'Gemini Pro', usage: 78, percent: 6, color: '#3B82F6' },
];

const stats = [
  { label: 'Total Messages', value: '12,847', change: '+23%', icon: MessageSquare, color: '#E9A24C', data: [45, 62, 48, 78, 65, 92, 85, 110, 98, 132, 125, 147] },
  { label: 'Docs Analyzed', value: '234', change: '+41%', icon: FileText, color: '#3B82F6', data: [8, 12, 10, 18, 15, 22, 19, 26, 24, 31, 28, 35] },
  { label: 'Hours Saved', value: '847h', change: '+67%', icon: Clock, color: '#10B981', data: [20, 35, 28, 52, 45, 68, 58, 82, 75, 94, 88, 105] },
  { label: 'AI Accuracy', value: '97.2%', change: '+1.4%', icon: Brain, color: '#8B5CF6', data: [91, 92, 93, 92, 94, 94, 95, 96, 96, 97, 97, 97] },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekData = [42, 68, 55, 89, 76, 34, 28];

const AnalyticsPage = () => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        {/* Header */}
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

        {/* Main stats */}
        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card"
                >
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
                  <LineChart data={stat.data} color={stat.color} />
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Weekly usage chart */}
          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-bold text-[#1F1F1F]">Weekly Message Volume</h2>
                  <p className="text-xs text-[#999] mt-0.5">Messages sent per day this week</p>
                </div>
                <Badge variant="success" size="sm" dot>+18% vs last week</Badge>
              </div>
              <BarChart data={weekData} color="linear-gradient(180deg, #E9A24C 0%, #D7B98E 100%)" />
              <div className="flex justify-between mt-2">
                {weekDays.map((day, i) => (
                  <span key={i} className="flex-1 text-center text-[10px] text-[#CCC] font-medium">{day}</span>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Model usage */}
          <FadeIn delay={0.15}>
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Model Usage</h2>
              
              {/* Donut chart approximation */}
              <div className="relative w-32 h-32 mx-auto mb-5">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {topModels.reduce((acc, model, i) => {
                    const circumference = 2 * Math.PI * 15.9;
                    const offset = acc.offset;
                    const strokeDash = (model.percent / 100) * circumference;
                    const el = (
                      <motion.circle
                        key={i}
                        cx="18" cy="18" r="15.9"
                        fill="none"
                        stroke={model.color}
                        strokeWidth="3.2"
                        strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 100' }}
                        animate={{ strokeDasharray: `${strokeDash} ${circumference - strokeDash}` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.2 }}
                      />
                    );
                    acc.offset += strokeDash;
                    acc.elements.push(el);
                    return acc;
                  }, { offset: 0, elements: [] as React.ReactNode[] }).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-[#1F1F1F]">1.3K</span>
                  <span className="text-[10px] text-[#999]">total</span>
                </div>
              </div>

              <div className="space-y-3">
                {topModels.map((model, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: model.color }} />
                      <span className="text-xs font-medium text-[#444]">{model.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-[rgba(0,0,0,0.06)]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: model.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${model.percent}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs text-[#999] w-8 text-right">{model.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Bottom stats row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Top topics */}
          <FadeIn delay={0.2} className="lg:col-span-2">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Top Topics</h2>
              <div className="space-y-3">
                {[
                  { topic: 'Market Research', count: 342, color: '#E9A24C', percent: 85 },
                  { topic: 'Code Review & Debugging', count: 218, color: '#3B82F6', percent: 54 },
                  { topic: 'Content Creation', count: 197, color: '#8B5CF6', percent: 49 },
                  { topic: 'Data Analysis', count: 156, color: '#10B981', percent: 39 },
                  { topic: 'Product Strategy', count: 98, color: '#F59E0B', percent: 24 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-[#999] w-5 text-right">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold text-[#1F1F1F]">{item.topic}</span>
                        <span className="text-xs text-[#999]">{item.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[rgba(0,0,0,0.05)]">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 0.7, delay: 0.2 + i * 0.08 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Productivity score */}
          <FadeIn delay={0.25}>
            <div className="bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={16} className="text-[#E9A24C]" />
                <h2 className="text-sm font-bold">AI Productivity Score</h2>
              </div>
              
              {/* Score ring */}
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.2" />
                  <motion.circle
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke="url(#score-grad)"
                    strokeWidth="3.2"
                    strokeDasharray="0 100"
                    strokeLinecap="round"
                    animate={{ strokeDasharray: "94 100" }}
                    transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                  />
                  <defs>
                    <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#E9A24C" />
                      <stop offset="100%" stopColor="#D4853A" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-2xl font-black text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    94
                  </motion.span>
                  <span className="text-[10px] text-white/40">/ 100</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {[
                  { label: 'Response Quality', score: 97 },
                  { label: 'Task Completion', score: 91 },
                  { label: 'Time Efficiency', score: 94 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-white/60">{item.label}</span>
                      <span className="text-[11px] font-bold text-white">{item.score}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-[#E9A24C]"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={13} className="text-[#E9A24C]" />
                  <span className="text-xs font-semibold text-white">Top 8% of users</span>
                </div>
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
