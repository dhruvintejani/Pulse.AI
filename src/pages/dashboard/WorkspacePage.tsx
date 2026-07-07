import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Plus, Users, MoreHorizontal, Star,
  Zap, Calendar, ChevronRight, Sparkles, Target,
  TrendingUp, CheckCircle2, Circle
} from 'lucide-react';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockTasks, mockWorkspaces } from '@/constants/mockData';
import { queryKeys } from '@/constants/queryKeys';
import { useMockResource } from '@/hooks/useMockResource';
import type { TaskPriority } from '@/constants/mockData';

const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} className={className}>
    {children}
  </motion.div>
);

const priorityColors: Record<TaskPriority, string> = {
  high: 'text-red-500 bg-red-50',
  medium: 'text-amber-600 bg-amber-50',
  low: 'text-gray-500 bg-gray-100',
};

const WorkspacePage = () => {
  const workspaceQuery = useMockResource({ queryKey: queryKeys.workspace, data: { workspaces: mockWorkspaces, tasks: mockTasks } });
  const [completedIds, setCompletedIds] = useState<string[]>(mockTasks.filter((task) => task.done).map((task) => task.id));
  const [starredIds, setStarredIds] = useState<string[]>(mockWorkspaces.filter((workspace) => workspace.starred).map((workspace) => workspace.id));

  const workspaces = useMemo(() => (
    (workspaceQuery.data?.workspaces ?? []).map((workspace) => ({ ...workspace, starred: starredIds.includes(workspace.id) }))
  ), [starredIds, workspaceQuery.data?.workspaces]);

  const tasks = useMemo(() => (
    (workspaceQuery.data?.tasks ?? []).map((task) => ({ ...task, done: completedIds.includes(task.id) }))
  ), [completedIds, workspaceQuery.data?.tasks]);

  const taskColumns: DataTableColumn<(typeof mockTasks)[number]>[] = [
    {
      id: 'title',
      header: 'Task',
      accessor: (task) => task.title,
      sortable: true,
      render: (task) => (
        <button
          onClick={() => setCompletedIds((current) => current.includes(task.id) ? current.filter((id) => id !== task.id) : [...current, task.id])}
          className="flex items-center gap-3 text-left"
        >
          {task.done ? <CheckCircle2 size={17} className="text-[#E9A24C]" /> : <Circle size={17} className="text-[#CCC]" />}
          <span className={task.done ? 'line-through text-[#BBB]' : 'font-medium text-[#1F1F1F]'}>{task.title}</span>
        </button>
      ),
    },
    { id: 'workspace', header: 'Workspace', accessor: (task) => task.workspace, sortable: true, filterable: true, filterOptions: mockWorkspaces.map((workspace) => ({ label: workspace.name, value: workspace.name })) },
    { id: 'assignee', header: 'Owner', accessor: (task) => task.assignee, sortable: true },
    {
      id: 'priority',
      header: 'Priority',
      accessor: (task) => task.priority,
      sortable: true,
      filterable: true,
      filterOptions: [{ label: 'High', value: 'high' }, { label: 'Medium', value: 'medium' }, { label: 'Low', value: 'low' }],
      render: (task) => <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize ${priorityColors[task.priority]}`}>{task.priority}</span>,
    },
    { id: 'due', header: 'Due', accessor: (task) => task.due, sortable: true, render: (task) => <span className="text-xs text-[#999] flex items-center gap-1"><Calendar size={10} /> {task.due}</span> },
    {
      id: 'status',
      header: 'Status',
      accessor: (task) => task.done ? 'done' : 'open',
      filterable: true,
      filterOptions: [{ label: 'Open', value: 'open' }, { label: 'Done', value: 'done' }],
      render: (task) => task.done ? <Badge variant="success" size="sm">Done</Badge> : <Badge variant="warning" size="sm">Open</Badge>,
    },
  ];

  const completedCount = tasks.filter((task) => task.done).length;
  const activeTaskCount = tasks.length - completedCount;

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-6 pb-32 space-y-6">
        <FadeIn className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Workspace</h1>
            <p className="text-sm text-[#999]">Organize projects, collaborate, and manage AI workflows</p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={15} />}>New Workspace</Button>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Workspaces', value: String(workspaces.length), icon: Layers, color: '#E9A24C' },
              { label: 'Team Members', value: String(workspaces.reduce((sum, item) => sum + item.members, 0)), icon: Users, color: '#3B82F6' },
              { label: 'Active Tasks', value: String(activeTaskCount), icon: Target, color: '#8B5CF6' },
              { label: 'Completed', value: String(completedCount), icon: CheckCircle2, color: '#10B981' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} whileHover={{ y: -3 }} className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${stat.color}18` }}><Icon size={18} style={{ color: stat.color }} /></div>
                  <div><p className="text-xl font-black text-[#1F1F1F]">{stat.value}</p><p className="text-xs text-[#999] font-medium">{stat.label}</p></div>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#1F1F1F]">Your Workspaces</h2>
            <button className="text-xs font-semibold text-[#E9A24C] hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {workspaceQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-44 rounded-2xl" />)}
            {!workspaceQuery.isLoading && workspaces.map((ws, i) => (
              <motion.div key={ws.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.06 }} whileHover={{ y: -5, scale: 1.01 }} className={`bg-gradient-to-br ${ws.color} rounded-2xl p-5 border border-white/80 shadow-card cursor-pointer group`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[#1F1F1F] truncate">{ws.name}</h3>
                      {ws.starred && <Star size={13} className="text-[#E9A24C] fill-[#E9A24C] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#666] leading-relaxed line-clamp-2">{ws.description}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setStarredIds((current) => current.includes(ws.id) ? current.filter((id) => id !== ws.id) : [...current, ws.id])} className="p-1.5 rounded-lg hover:bg-white/50"><Star size={14} className={ws.starred ? 'text-[#E9A24C] fill-[#E9A24C]' : 'text-[#999]'} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-white/50"><MoreHorizontal size={14} className="text-[#999]" /></button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-[#666] font-medium">Progress</span><span className="font-bold" style={{ color: ws.accentColor }}>{ws.tasks.done}/{ws.tasks.total}</span></div>
                  <div className="h-1.5 rounded-full bg-white/50"><motion.div className="h-full rounded-full" style={{ background: ws.accentColor }} initial={{ width: 0 }} animate={{ width: `${(ws.tasks.done / ws.tasks.total) * 100}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} /></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">{Array.from({ length: Math.min(ws.members, 4) }).map((_, j) => <div key={j} className="w-6 h-6 rounded-full border-2 border-white/80 flex items-center justify-center text-[9px] font-bold text-white" style={{ background: ws.accentColor }}>{String.fromCharCode(65 + j)}</div>)}</div>
                    <div className="flex gap-1">{ws.tags.map((tag) => <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/50 text-[#666]">{tag}</span>)}</div>
                  </div>
                  <span className="text-[10px] text-[#999]">{ws.updated}</span>
                </div>
              </motion.div>
            ))}
            <motion.button whileHover={{ y: -5 }} className="rounded-2xl p-5 border-2 border-dashed border-[rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-3 hover:border-[rgba(233,162,76,0.4)] transition-all duration-200 min-h-[180px] group">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(233,162,76,0.08)] group-hover:bg-[rgba(233,162,76,0.15)] flex items-center justify-center transition-all"><Plus size={20} className="text-[#E9A24C]" /></div>
              <div className="text-center"><p className="text-sm font-bold text-[#999] group-hover:text-[#666]">Create workspace</p><p className="text-xs text-[#CCC] mt-0.5">Start a new project space</p></div>
            </motion.button>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-5">
          <FadeIn delay={0.2} className="lg:col-span-3">
            <DataTable data={tasks} columns={taskColumns} getRowId={(task) => task.id} loading={workspaceQuery.isLoading} searchPlaceholder="Search tasks..." emptyTitle="No tasks found" emptyDescription="Try changing the workspace, priority, or status filter." pageSize={5} />
          </FadeIn>

          <FadeIn delay={0.25} className="lg:col-span-2">
            <div className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
              <div className="flex items-center gap-2 mb-4"><Zap size={15} className="text-[#E9A24C]" /><h2 className="text-sm font-bold text-[#1F1F1F]">AI Workflows</h2></div>
              <div className="space-y-3">
                {[
                  { name: 'Weekly Report Generator', runs: 24, icon: TrendingUp, active: true },
                  { name: 'Doc Summarizer', runs: 156, icon: Sparkles, active: true },
                  { name: 'Meeting Transcriber', runs: 8, icon: Users, active: false },
                  { name: 'Competitor Monitor', runs: 52, icon: Target, active: false },
                ].map((flow) => {
                  const Icon = flow.icon;
                  return (
                    <motion.button key={flow.name} whileHover={{ x: 3 }} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[rgba(0,0,0,0.05)] hover:border-[rgba(233,162,76,0.3)] transition-all text-left">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${flow.active ? 'bg-[rgba(233,162,76,0.12)]' : 'bg-[rgba(0,0,0,0.04)]'}`}><Icon size={16} className={flow.active ? 'text-[#E9A24C]' : 'text-[#CCC]'} /></div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-bold text-[#1F1F1F] truncate">{flow.name}</p><p className="text-[10px] text-[#999]">{flow.runs} runs</p></div>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${flow.active ? 'bg-emerald-400' : 'bg-[#DDD]'}`} />
                    </motion.button>
                  );
                })}
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-3"><Plus size={13} /> Create workflow</Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
