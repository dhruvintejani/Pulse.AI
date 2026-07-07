import { motion } from 'framer-motion';
import {
  Layers, Plus, Users, MoreHorizontal, Star,
  Zap, Calendar, ChevronRight, Sparkles, Target,
  TrendingUp, Clock, CheckCircle2, Circle
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const workspaces = [
  {
    id: '1',
    name: 'Product Strategy Q4',
    description: 'Roadmap, research, and competitive analysis for Q4 2025',
    members: 6,
    tasks: { total: 24, done: 18 },
    color: 'from-orange-100 to-amber-50',
    accentColor: '#E9A24C',
    tags: ['Strategy', 'Q4'],
    updated: '2 hours ago',
    starred: true,
  },
  {
    id: '2',
    name: 'Engineering Architecture',
    description: 'System design docs, API specs, and tech debt tracking',
    members: 4,
    tasks: { total: 32, done: 21 },
    color: 'from-blue-50 to-indigo-50',
    accentColor: '#3B82F6',
    tags: ['Engineering', 'Docs'],
    updated: '5 hours ago',
    starred: false,
  },
  {
    id: '3',
    name: 'Marketing Campaign H2',
    description: 'Content calendar, campaign briefs, and performance tracking',
    members: 8,
    tasks: { total: 47, done: 35 },
    color: 'from-purple-50 to-pink-50',
    accentColor: '#8B5CF6',
    tags: ['Marketing', 'H2'],
    updated: '1 day ago',
    starred: true,
  },
  {
    id: '4',
    name: 'Customer Research Hub',
    description: 'Interview notes, survey results, and persona development',
    members: 3,
    tasks: { total: 15, done: 8 },
    color: 'from-emerald-50 to-green-50',
    accentColor: '#10B981',
    tags: ['Research', 'UX'],
    updated: '3 days ago',
    starred: false,
  },
];

const tasks = [
  { id: '1', title: 'Review Q3 market research report', done: true, priority: 'high', due: 'Today' },
  { id: '2', title: 'Draft product announcement copy', done: false, priority: 'high', due: 'Today' },
  { id: '3', title: 'Analyze competitor pricing strategy', done: false, priority: 'medium', due: 'Tomorrow' },
  { id: '4', title: 'Update team knowledge base', done: true, priority: 'low', due: 'This week' },
  { id: '5', title: 'Prepare board presentation slides', done: false, priority: 'high', due: 'Friday' },
  { id: '6', title: 'Run A/B test analysis with AI', done: false, priority: 'medium', due: 'Next week' },
];

const priorityColors = {
  high: 'text-red-500 bg-red-50',
  medium: 'text-amber-600 bg-amber-50',
  low: 'text-gray-500 bg-gray-100',
};

const WorkspacePage = () => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        {/* Header */}
        <FadeIn className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Workspace</h1>
            <p className="text-sm text-[#999]">Organize projects, collaborate, and manage AI workflows</p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={15} />}>
            New Workspace
          </Button>
        </FadeIn>

        {/* Overview Stats */}
        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Workspaces', value: '4', icon: Layers, color: '#E9A24C' },
              { label: 'Team Members', value: '21', icon: Users, color: '#3B82F6' },
              { label: 'Active Tasks', value: '18', icon: Target, color: '#8B5CF6' },
              { label: 'Completed', value: '82', icon: CheckCircle2, color: '#10B981' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${stat.color}18` }}>
                    <Icon size={18} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#1F1F1F]">{stat.value}</p>
                    <p className="text-xs text-[#999] font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        {/* Workspaces Grid */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#1F1F1F]">Your Workspaces</h2>
            <button className="text-xs font-semibold text-[#E9A24C] hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {workspaces.map((ws, i) => (
              <motion.div
                key={ws.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`bg-gradient-to-br ${ws.color} rounded-2xl p-5 border border-white/80 shadow-card cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[#1F1F1F] truncate">{ws.name}</h3>
                      {ws.starred && <Star size={13} className="text-[#E9A24C] fill-[#E9A24C] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#666] leading-relaxed line-clamp-2">{ws.description}</p>
                  </div>
                  <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50">
                    <MoreHorizontal size={14} className="text-[#999]" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#666] font-medium">Progress</span>
                    <span className="font-bold" style={{ color: ws.accentColor }}>
                      {ws.tasks.done}/{ws.tasks.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/50">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: ws.accentColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(ws.tasks.done / ws.tasks.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {Array.from({ length: Math.min(ws.members, 4) }).map((_, j) => (
                        <div key={j} className="w-6 h-6 rounded-full border-2 border-white/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ background: ws.accentColor }}>
                          {String.fromCharCode(65 + j)}
                        </div>
                      ))}
                      {ws.members > 4 && (
                        <div className="w-6 h-6 rounded-full border-2 border-white/80 bg-white/40 flex items-center justify-center text-[9px] font-bold text-[#666]">
                          +{ws.members - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {ws.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/50 text-[#666]">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#999] flex items-center gap-0.5">
                    <Clock size={10} />{ws.updated}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* New workspace card */}
            <motion.button
              whileHover={{ y: -5 }}
              className="rounded-2xl p-5 border-2 border-dashed border-[rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-3 hover:border-[rgba(233,162,76,0.4)] transition-all duration-200 min-h-[180px] group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[rgba(233,162,76,0.08)] group-hover:bg-[rgba(233,162,76,0.15)] flex items-center justify-center transition-all">
                <Plus size={20} className="text-[#E9A24C]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#999] group-hover:text-[#666]">Create workspace</p>
                <p className="text-xs text-[#CCC] mt-0.5">Start a new project space</p>
              </div>
            </motion.button>
          </div>
        </FadeIn>

        {/* Task list + AI Workflows */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Tasks */}
          <FadeIn delay={0.2} className="lg:col-span-3">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[#1F1F1F]">My Tasks</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">{tasks.filter(t => !t.done).length} pending</Badge>
                  <button className="p-1 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                    <Plus size={14} className="text-[#999]" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(0,0,0,0.02)] transition-colors group cursor-pointer"
                  >
                    <button className="shrink-0">
                      {task.done
                        ? <CheckCircle2 size={17} className="text-[#E9A24C]" />
                        : <Circle size={17} className="text-[#CCC] group-hover:text-[#E9A24C] transition-colors" />
                      }
                    </button>
                    <span className={`text-sm flex-1 ${task.done ? 'line-through text-[#BBB]' : 'text-[#1F1F1F] font-medium'}`}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-[#BBB] flex items-center gap-1">
                        <Calendar size={10} /> {task.due}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* AI Workflows */}
          <FadeIn delay={0.25} className="lg:col-span-2">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={15} className="text-[#E9A24C]" />
                <h2 className="text-sm font-bold text-[#1F1F1F]">AI Workflows</h2>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Weekly Report Generator', runs: 24, icon: TrendingUp, active: true },
                  { name: 'Doc Summarizer', runs: 156, icon: Sparkles, active: true },
                  { name: 'Meeting Transcriber', runs: 8, icon: Users, active: false },
                  { name: 'Competitor Monitor', runs: 52, icon: Target, active: false },
                ].map((flow, i) => {
                  const Icon = flow.icon;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ x: 3 }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-[rgba(233,162,76,0.3)] transition-all text-left"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${flow.active ? 'bg-[rgba(233,162,76,0.12)]' : 'bg-[rgba(0,0,0,0.04)]'}`}>
                        <Icon size={16} className={flow.active ? 'text-[#E9A24C]' : 'text-[#CCC]'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#1F1F1F] truncate">{flow.name}</p>
                        <p className="text-[10px] text-[#999]">{flow.runs} runs</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${flow.active ? 'bg-emerald-400' : 'bg-[#DDD]'}`} />
                    </motion.button>
                  );
                })}
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-3">
                <Plus size={13} /> Create workflow
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
