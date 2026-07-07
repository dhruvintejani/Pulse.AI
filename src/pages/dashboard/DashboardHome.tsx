import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, FileText, BarChart3, Zap, ArrowRight,
  Clock, Star, Plus, Sparkles, Brain,
  Activity, ChevronRight
} from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { dashboardStats, recentActivity } from '@/constants/mockData';
import { queryKeys } from '@/constants/queryKeys';
import { useMockResource } from '@/hooks/useMockResource';

const quickActions = [
  { icon: MessageSquare, label: 'New Chat', desc: 'Start a conversation', color: 'from-orange-100 to-amber-50', iconColor: 'text-[#E9A24C]', path: '/dashboard/chat' },
  { icon: FileText, label: 'Upload Doc', desc: 'Analyze a document', color: 'from-blue-50 to-indigo-50', iconColor: 'text-blue-500', path: '/dashboard/documents' },
  { icon: BarChart3, label: 'Analytics', desc: 'View insights', color: 'from-purple-50 to-pink-50', iconColor: 'text-purple-500', path: '/dashboard/analytics' },
  { icon: Zap, label: 'Workflows', desc: 'Automate tasks', color: 'from-emerald-50 to-green-50', iconColor: 'text-emerald-500', path: '/dashboard/workspace' },
];

const statIcons = [MessageSquare, FileText, Clock, Activity];

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }} className={className}>
    {children}
  </motion.div>
);

const DashboardHome = () => {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState('GPT-4o');
  const dashboardQuery = useMockResource({ queryKey: queryKeys.dashboard, data: { stats: dashboardStats, activity: recentActivity } });
  const dashboardData = dashboardQuery.data ?? { stats: [], activity: [] };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        <FadeIn className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" aria-hidden="true">👋</span>
              <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight">Good morning, Alex</h1>
            </div>
            <p className="text-sm text-[#999]">Here's what's happening in your workspace today.</p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={15} />} onClick={() => navigate('/dashboard/chat')} className="hidden sm:flex">New Chat</Button>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" aria-live="polite">
            {dashboardQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}
            {!dashboardQuery.isLoading && dashboardData.stats.map((stat, i) => {
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

        <FadeIn delay={0.1}>
          <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
            <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Quick Actions</h2>
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
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-5">
          <FadeIn delay={0.15} className="lg:col-span-2">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1F1F1F]">Recent Activity</h2>
                <button type="button" className="text-xs text-[#E9A24C] font-semibold hover:underline flex items-center gap-1 rounded-md focus-ring">View all <ChevronRight size={12} aria-hidden="true" /></button>
              </div>
              <div className="space-y-2" aria-live="polite">
                {dashboardQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-16 rounded-xl" />)}
                {!dashboardQuery.isLoading && dashboardData.activity.map((item) => (
                  <motion.button key={item.id} type="button" whileHover={{ x: 3 }} onClick={() => navigate(item.type === 'chat' ? '/dashboard/chat' : item.type === 'doc' ? '/dashboard/documents' : '/dashboard/workspace')} className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-[rgba(233,162,76,0.05)] cursor-pointer transition-all duration-150 group text-left focus-ring">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'chat' ? 'bg-[rgba(233,162,76,0.12)]' : item.type === 'doc' ? 'bg-blue-50' : 'bg-purple-50'}`}>
                      {item.type === 'chat' ? <MessageSquare size={15} className="text-[#E9A24C]" aria-hidden="true" /> : item.type === 'doc' ? <FileText size={15} className="text-blue-500" aria-hidden="true" /> : <Zap size={15} className="text-purple-500" aria-hidden="true" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1F1F1F] truncate group-hover:text-[#E9A24C] transition-colors">{item.title}</p>
                      <p className="text-xs text-[#999]">
                        {item.type === 'chat' ? `${item.model} · ${item.messages} messages` : item.type === 'doc' ? `${item.size} · ${item.pages} pages` : `${item.members} members · ${item.tasks} tasks`}
                      </p>
                    </div>
                    <div className="text-right shrink-0"><p className="text-[11px] text-[#BBB]">{item.time}</p></div>
                  </motion.button>
                ))}
                {!dashboardQuery.isLoading && dashboardData.activity.length === 0 && <p className="text-sm text-[#999] text-center py-8" role="status">No activity yet.</p>}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="space-y-5">
            <div className="bg-[#1F1F1F] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4"><Brain size={16} className="text-[#E9A24C]" aria-hidden="true" /><h2 className="text-sm font-bold">Active Model</h2></div>
              <div className="space-y-2" role="radiogroup" aria-label="Active model">
                {[
                  { name: 'GPT-4o', speed: 'Fast' },
                  { name: 'Claude 3.5', speed: 'Balanced' },
                  { name: 'Gemini Pro', speed: 'Precise' },
                ].map((model) => (
                  <button key={model.name} type="button" role="radio" aria-checked={activeModel === model.name} onClick={() => setActiveModel(model.name)} className={`w-full flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all focus-ring ${activeModel === model.name ? 'bg-[rgba(233,162,76,0.15)] border border-[rgba(233,162,76,0.3)]' : 'hover:bg-white/5'}`}>
                    <div className="flex items-center gap-2.5"><div className={`w-2 h-2 rounded-full ${activeModel === model.name ? 'bg-[#E9A24C]' : 'bg-white/20'}`} aria-hidden="true" /><span className="text-sm font-medium">{model.name}</span></div>
                    <Badge variant={activeModel === model.name ? 'accent' : 'neutral'} size="sm">{model.speed}</Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-bold text-[#1F1F1F]">Monthly Usage</h2><Badge variant="accent" size="sm">Pro</Badge></div>
              <div className="space-y-3">
                {[
                  { label: 'Messages', used: 247, total: 999, color: '#E9A24C' },
                  { label: 'Documents', used: 18, total: 50, color: '#3B82F6' },
                  { label: 'Storage', used: 4.2, total: 10, color: '#8B5CF6', suffix: 'GB' },
                ].map((u) => {
                  const percent = Math.round((u.used / u.total) * 100);
                  return (
                    <div key={u.label}>
                      <div className="flex justify-between text-xs mb-1.5"><span className="text-[#666] font-medium">{u.label}</span><span className="text-[#999]">{u.used}{u.suffix || ''} / {u.total}{u.suffix || ''}</span></div>
                      <div className="h-1.5 rounded-full bg-[rgba(0,0,0,0.06)]" role="progressbar" aria-label={`${u.label} usage`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ background: u.color }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <motion.button type="button" whileHover={{ scale: 1.01 }} className="w-full bg-gradient-to-br from-[#E9A24C] to-[#D4853A] rounded-2xl p-5 text-white cursor-pointer text-left focus-ring" onClick={() => navigate('/dashboard/billing')}>
              <div className="flex items-center gap-2 mb-2"><Star size={15} className="text-white/80" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-wider text-white/80">Upgrade</span></div>
              <p className="text-sm font-bold mb-3">Unlock unlimited AI access</p>
              <Button variant="secondary" size="sm" className="w-full">View Enterprise plans <ArrowRight size={13} className="ml-1" aria-hidden="true" /></Button>
            </motion.button>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
            <div className="flex items-center gap-2 mb-4"><Sparkles size={15} className="text-[#E9A24C]" aria-hidden="true" /><h2 className="text-sm font-bold text-[#1F1F1F]">Suggested for you</h2></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {['Summarize my latest documents', 'Draft a product announcement', 'Research competitor landscape', 'Generate 10 blog post ideas', 'Analyze my sales data trends', 'Write a technical blog post'].map((prompt) => (
                <motion.button key={prompt} type="button" whileHover={{ scale: 1.01, x: 2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard/chat')} className="text-left text-sm text-[#444] px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.06)] hover:border-[rgba(233,162,76,0.3)] hover:bg-[rgba(233,162,76,0.04)] transition-all duration-150 font-medium focus-ring">
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default DashboardHome;
