import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, FileText, BarChart3, Zap, ArrowRight,
  Clock, Star, Plus, Sparkles, Brain,
  Activity, ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const quickActions = [
  { icon: MessageSquare, label: 'New Chat', desc: 'Start a conversation', color: 'from-orange-100 to-amber-50', iconColor: 'text-[#E9A24C]', path: '/dashboard/chat' },
  { icon: FileText, label: 'Upload Doc', desc: 'Analyze a document', color: 'from-blue-50 to-indigo-50', iconColor: 'text-blue-500', path: '/dashboard/documents' },
  { icon: BarChart3, label: 'Analytics', desc: 'View insights', color: 'from-purple-50 to-pink-50', iconColor: 'text-purple-500', path: '/dashboard/analytics' },
  { icon: Zap, label: 'Workflows', desc: 'Automate tasks', color: 'from-emerald-50 to-green-50', iconColor: 'text-emerald-500', path: '/dashboard/workspace' },
];

const recentActivity = [
  { type: 'chat', title: 'Market Research Q3 2025', time: '2 minutes ago', model: 'GPT-4o', messages: 24 },
  { type: 'doc', title: 'Product Roadmap.pdf', time: '1 hour ago', size: '2.4 MB', pages: 45 },
  { type: 'chat', title: 'React Architecture Review', time: '3 hours ago', model: 'Claude 3.5', messages: 18 },
  { type: 'doc', title: 'Q3 Financial Report.xlsx', time: '5 hours ago', size: '890 KB', pages: 12 },
];

const stats = [
  { label: 'Messages Today', value: '247', change: '+12%', icon: MessageSquare, trend: 'up' },
  { label: 'Docs Analyzed', value: '18', change: '+5%', icon: FileText, trend: 'up' },
  { label: 'Hours Saved', value: '8.4', change: '+34%', icon: Clock, trend: 'up' },
  { label: 'AI Score', value: '94', change: '+2pt', icon: Activity, trend: 'up' },
];

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

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        {/* Header */}
        <FadeIn className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">👋</span>
              <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight">Good morning, Alex</h1>
            </div>
            <p className="text-sm text-[#999]">Here's what's happening in your workspace today.</p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={15} />}
            onClick={() => navigate('/dashboard/chat')}
            className="hidden sm:flex"
          >
            New Chat
          </Button>
        </FadeIn>

        {/* Stats Row */}
        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center">
                      <Icon size={16} className="text-[#E9A24C]" />
                    </div>
                    <Badge variant="success" size="sm" dot>{stat.change}</Badge>
                  </div>
                  <p className="text-2xl font-black text-[#1F1F1F]">{stat.value}</p>
                  <p className="text-xs text-[#999] font-medium mt-0.5">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={0.1}>
          <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
            <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(action.path)}
                    className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-left border border-white/80 hover:shadow-card transition-shadow duration-200`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center mb-3">
                      <Icon size={17} className={action.iconColor} />
                    </div>
                    <p className="text-sm font-bold text-[#1F1F1F]">{action.label}</p>
                    <p className="text-[11px] text-[#999] mt-0.5">{action.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Recent Activity */}
          <FadeIn delay={0.15} className="lg:col-span-2">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1F1F1F]">Recent Activity</h2>
                <button className="text-xs text-[#E9A24C] font-semibold hover:underline flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 3 }}
                    onClick={() => navigate(item.type === 'chat' ? '/dashboard/chat' : '/dashboard/documents')}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[rgba(233,162,76,0.05)] cursor-pointer transition-all duration-150 group"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'chat' ? 'bg-[rgba(233,162,76,0.12)]' : 'bg-blue-50'}`}>
                      {item.type === 'chat'
                        ? <MessageSquare size={15} className="text-[#E9A24C]" />
                        : <FileText size={15} className="text-blue-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1F1F1F] truncate group-hover:text-[#E9A24C] transition-colors">{item.title}</p>
                      <p className="text-xs text-[#999]">
                        {item.type === 'chat' ? `${item.model} · ${item.messages} messages` : `${item.size} · ${item.pages} pages`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-[#BBB]">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Right column */}
          <FadeIn delay={0.2} className="space-y-5">
            {/* AI Model selector */}
            <div className="bg-[#1F1F1F] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={16} className="text-[#E9A24C]" />
                <h2 className="text-sm font-bold">Active Model</h2>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'GPT-4o', active: true, speed: 'Fast' },
                  { name: 'Claude 3.5', active: false, speed: 'Balanced' },
                  { name: 'Gemini Pro', active: false, speed: 'Precise' },
                ].map((m, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${m.active ? 'bg-[rgba(233,162,76,0.15)] border border-[rgba(233,162,76,0.3)]' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${m.active ? 'bg-[#E9A24C]' : 'bg-white/20'}`} />
                      <span className="text-sm font-medium">{m.name}</span>
                    </div>
                    <Badge variant={m.active ? 'accent' : 'neutral'} size="sm">{m.speed}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage */}
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1F1F1F]">Monthly Usage</h2>
                <Badge variant="accent" size="sm">Pro</Badge>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Messages', used: 247, total: 999, color: '#E9A24C' },
                  { label: 'Documents', used: 18, total: 50, color: '#3B82F6' },
                  { label: 'Storage', used: 4.2, total: 10, color: '#8B5CF6', suffix: 'GB' },
                ].map((u, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#666] font-medium">{u.label}</span>
                      <span className="text-[#999]">{u.used}{u.suffix || ''} / {u.total}{u.suffix || ''}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(0,0,0,0.06)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(u.used / u.total) * 100}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ background: u.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro CTA */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-br from-[#E9A24C] to-[#D4853A] rounded-2xl p-5 text-white cursor-pointer"
              onClick={() => navigate('/dashboard/billing')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star size={15} className="text-white/80" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Upgrade</span>
              </div>
              <p className="text-sm font-bold mb-3">Unlock unlimited AI access</p>
              <Button variant="secondary" size="sm" className="w-full">
                View Enterprise plans <ArrowRight size={13} className="ml-1" />
              </Button>
            </motion.div>
          </FadeIn>
        </div>

        {/* Suggested Prompts */}
        <FadeIn delay={0.25}>
          <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={15} className="text-[#E9A24C]" />
              <h2 className="text-sm font-bold text-[#1F1F1F]">Suggested for you</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                '📊 Summarize my latest documents',
                '✍️ Draft a product announcement',
                '🔍 Research competitor landscape',
                '💡 Generate 10 blog post ideas',
                '📈 Analyze my sales data trends',
                '🚀 Write a technical blog post',
              ].map((prompt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/dashboard/chat')}
                  className="text-left text-sm text-[#444] px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.06)] hover:border-[rgba(233,162,76,0.3)] hover:bg-[rgba(233,162,76,0.04)] transition-all duration-150 font-medium"
                >
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
