import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Bell,
  FileText,
  KeyRound,
  Layers,
  Lock,
  MessageSquare,
  ScrollText,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type AdminSectionKey = 'dashboard' | 'users' | 'chats' | 'documents' | 'analytics' | 'logs' | 'feedback' | 'notifications' | 'roles' | 'permissions' | 'settings';

interface AdminSection {
  id: AdminSectionKey;
  label: string;
  icon: LucideIcon;
  description: string;
}

const sections: AdminSection[] = [
  { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck, description: 'Platform health and admin overview' },
  { id: 'users', label: 'Users', icon: Users, description: 'Accounts, roles, and status' },
  { id: 'chats', label: 'Chats', icon: MessageSquare, description: 'Conversation moderation and insights' },
  { id: 'documents', label: 'Documents', icon: FileText, description: 'Uploads, storage, and metadata' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Usage, activity, and growth' },
  { id: 'logs', label: 'System Logs', icon: ScrollText, description: 'Operational events and errors' },
  { id: 'feedback', label: 'Feedback', icon: Activity, description: 'User feedback and product signals' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Broadcasts, unread state, categories' },
  { id: 'roles', label: 'Roles', icon: Layers, description: 'Role assignment and access tiers' },
  { id: 'permissions', label: 'Permissions', icon: KeyRound, description: 'Capability matrix' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Admin configuration' },
];

const metrics = [
  { label: 'Total Users', value: '2,481', change: '+12%', trend: 'up' },
  { label: 'Active Chats', value: '18,492', change: '+8%', trend: 'up' },
  { label: 'Documents', value: '6,204', change: '+19%', trend: 'up' },
  { label: 'Open Feedback', value: '37', change: '-6%', trend: 'down' },
];

const users = [
  { name: 'Alex Morgan', email: 'alex@pulse.ai', role: 'Owner', status: 'Active', joined: 'Today' },
  { name: 'Maya Chen', email: 'maya@pulse.ai', role: 'Admin', status: 'Active', joined: '2 days ago' },
  { name: 'Noah Patel', email: 'noah@pulse.ai', role: 'Member', status: 'Active', joined: '1 week ago' },
  { name: 'Sarah Kim', email: 'sarah@pulse.ai', role: 'Viewer', status: 'Suspended', joined: '2 weeks ago' },
];

const chats = [
  { title: 'Market Research Q3', owner: 'Alex', messages: 42, status: 'Active', model: 'GPT-4o' },
  { title: 'Launch Plan Review', owner: 'Maya', messages: 18, status: 'Pinned', model: 'Claude' },
  { title: 'Invoice Analysis', owner: 'Noah', messages: 12, status: 'Favorite', model: 'Gemini' },
];

const documents = [
  { title: 'Product Roadmap.pdf', kind: 'PDF', size: '2.4 MB', category: 'Strategy', status: 'Ready' },
  { title: 'Customer Notes.docx', kind: 'DOCX', size: '840 KB', category: 'Research', status: 'Ready' },
  { title: 'Revenue Export.csv', kind: 'CSV', size: '220 KB', category: 'Finance', status: 'Processing' },
];

const logs = [
  { level: 'info', source: 'api', message: 'Dashboard API completed successfully', time: '2m ago' },
  { level: 'warning', source: 'documents', message: 'Large upload validation rejected', time: '19m ago' },
  { level: 'error', source: 'notifications', message: 'Provider transport not configured', time: '1h ago' },
];

const feedback = [
  { type: 'Feature', message: 'Add shared prompt templates for teams.', status: 'Open', rating: 5 },
  { type: 'Bug', message: 'Markdown table preview wraps on mobile.', status: 'Reviewed', rating: 4 },
  { type: 'General', message: 'The new dashboard feels much faster.', status: 'Closed', rating: 5 },
];

const notifications = [
  { title: 'Document analysis complete', category: 'Success', status: 'Unread', target: 'All users' },
  { title: 'Billing cycle starts tomorrow', category: 'Billing', status: 'Read', target: 'Admins' },
  { title: 'Workspace invite accepted', category: 'Info', status: 'Unread', target: 'Team' },
];

const roles = [
  { role: 'Owner', users: 1, permissions: 16, scope: 'Full platform access' },
  { role: 'Admin', users: 3, permissions: 14, scope: 'Operational access' },
  { role: 'Viewer', users: 12, permissions: 7, scope: 'Read-only access' },
];

const permissions = [
  'admin.access',
  'dashboard.read',
  'users.read',
  'users.write',
  'chats.read',
  'documents.read',
  'analytics.read',
  'logs.read',
  'feedback.write',
  'notifications.write',
  'roles.write',
  'settings.write',
];

const settingsRows = [
  { label: 'Environment', value: 'Production-ready' },
  { label: 'Storage', value: 'Cloudinary ready' },
  { label: 'Auth Provider', value: 'Clerk only' },
  { label: 'Real-time', value: 'SSE ready' },
];

const AdminCard = memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28 }}
    className={cn('rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-5 shadow-card', className)}
  >
    {children}
  </motion.section>
));
AdminCard.displayName = 'AdminCard';

const SectionHeader = memo(({ section }: { section: AdminSection }) => {
  const Icon = section.icon;
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(233,162,76,0.1)] text-[#E9A24C]">
          <Icon size={20} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-[#1F1F1F]">{section.label}</h2>
          <p className="text-sm text-[#999]">{section.description}</p>
        </div>
      </div>
      <Button size="sm" variant="secondary" icon={<SlidersHorizontal size={14} />}>Manage</Button>
    </div>
  );
});
SectionHeader.displayName = 'SectionHeader';

const MetricGrid = memo(() => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {metrics.map((metric) => (
      <AdminCard key={metric.label} className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#999]">{metric.label}</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-2xl font-black text-[#1F1F1F]">{metric.value}</p>
          <Badge variant={metric.trend === 'up' ? 'success' : 'warning'} size="sm">{metric.change}</Badge>
        </div>
      </AdminCard>
    ))}
  </div>
));
MetricGrid.displayName = 'MetricGrid';

const SimpleTable = memo(({ headers, rows }: { headers: string[]; rows: Array<Array<React.ReactNode>> }) => (
  <div className="overflow-x-auto rounded-2xl border border-[rgba(0,0,0,0.05)]">
    <table className="min-w-full text-left text-sm">
      <thead>
        <tr className="bg-[rgba(233,162,76,0.04)]">
          {headers.map((header) => (
            <th key={header} className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#999]">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t border-[rgba(0,0,0,0.05)]">
            {row.map((cell, cellIndex) => (
              <td key={`${rowIndex}-${cellIndex}`} className="whitespace-nowrap px-4 py-3 text-[#666]">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));
SimpleTable.displayName = 'SimpleTable';

const SectionContent = memo(({ activeSection }: { activeSection: AdminSectionKey }) => {
  if (activeSection === 'dashboard') {
    return (
      <div className="space-y-5">
        <MetricGrid />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <AdminCard>
            <h3 className="mb-3 text-sm font-bold text-[#1F1F1F]">System Health</h3>
            <div className="space-y-3">
              {settingsRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl bg-[rgba(233,162,76,0.04)] px-4 py-3">
                  <span className="text-sm font-medium text-[#666]">{row.label}</span>
                  <Badge variant="success" size="sm">{row.value}</Badge>
                </div>
              ))}
            </div>
          </AdminCard>
          <AdminCard>
            <h3 className="mb-3 text-sm font-bold text-[#1F1F1F]">Admin Activity</h3>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.message} className="rounded-xl border border-[rgba(0,0,0,0.04)] bg-white/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={log.level === 'error' ? 'danger' : log.level === 'warning' ? 'warning' : 'neutral'} size="sm">{log.level}</Badge>
                    <span className="text-xs text-[#999]">{log.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-[#1F1F1F]">{log.message}</p>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    );
  }

  if (activeSection === 'users') {
    return <SimpleTable headers={['Name', 'Email', 'Role', 'Status', 'Joined']} rows={users.map((user) => [user.name, user.email, <Badge key="role" variant="accent" size="sm">{user.role}</Badge>, user.status, user.joined])} />;
  }

  if (activeSection === 'chats') {
    return <SimpleTable headers={['Title', 'Owner', 'Messages', 'Status', 'Model']} rows={chats.map((chat) => [chat.title, chat.owner, chat.messages, chat.status, chat.model])} />;
  }

  if (activeSection === 'documents') {
    return <SimpleTable headers={['Title', 'Kind', 'Size', 'Category', 'Status']} rows={documents.map((document) => [document.title, document.kind, document.size, document.category, document.status])} />;
  }

  if (activeSection === 'analytics') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {['AI requests', 'Tokens used', 'Workspace activity'].map((item, index) => (
          <AdminCard key={item} className="p-4">
            <p className="text-sm font-bold text-[#1F1F1F]">{item}</p>
            <div className="mt-4 flex h-28 items-end gap-2">
              {[42, 68, 54, 88, 73, 96].map((value, barIndex) => (
                <div key={`${item}-${barIndex}`} className="flex-1 rounded-t-xl bg-[rgba(233,162,76,0.14)]" style={{ height: `${Math.max(18, value - index * 8)}%` }} />
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
    );
  }

  if (activeSection === 'logs') {
    return <SimpleTable headers={['Level', 'Source', 'Message', 'Time']} rows={logs.map((log) => [log.level, log.source, log.message, log.time])} />;
  }

  if (activeSection === 'feedback') {
    return <SimpleTable headers={['Type', 'Message', 'Status', 'Rating']} rows={feedback.map((item) => [item.type, item.message, item.status, `${item.rating}/5`])} />;
  }

  if (activeSection === 'notifications') {
    return <SimpleTable headers={['Title', 'Category', 'Status', 'Target']} rows={notifications.map((item) => [item.title, item.category, item.status, item.target])} />;
  }

  if (activeSection === 'roles') {
    return <SimpleTable headers={['Role', 'Users', 'Permissions', 'Scope']} rows={roles.map((role) => [role.role, role.users, role.permissions, role.scope])} />;
  }

  if (activeSection === 'permissions') {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {permissions.map((permission) => (
          <div key={permission} className="flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.05)] bg-white/60 p-3">
            <KeyRound size={15} className="text-[#E9A24C]" aria-hidden="true" />
            <span className="text-sm font-semibold text-[#666]">{permission}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {settingsRows.map((row) => (
        <AdminCard key={row.label} className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#999]">{row.label}</p>
          <p className="mt-2 text-base font-bold text-[#1F1F1F]">{row.value}</p>
        </AdminCard>
      ))}
    </div>
  );
});
SectionContent.displayName = 'SectionContent';

const AdminPage = () => {
  const { currentUser } = useCurrentUser();
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('dashboard');
  const section = useMemo(() => sections.find((item) => item.id === activeSection) ?? sections[0], [activeSection]);

  if (!currentUser?.isAdmin) {
    return (
      <div className="h-full overflow-y-auto no-scrollbar">
        <div className="mx-auto flex min-h-full max-w-3xl items-center justify-center p-4 pb-32 sm:p-6">
          <AdminCard className="w-full text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(233,162,76,0.1)] text-[#E9A24C]">
              <Lock size={24} aria-hidden="true" />
            </div>
            <EmptyState
              title="Admin access required"
              description="This area is protected. Only users with owner or admin role can access the Pulse AI admin panel."
            />
          </AdminCard>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-7xl p-4 pb-32 sm:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"
        >
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="accent" size="sm" dot>Admin</Badge>
              <Badge variant="neutral" size="sm">MongoDB backed</Badge>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#1F1F1F] sm:text-3xl">Admin Panel</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#999]">Manage users, content, analytics, system operations, notifications, roles, permissions, and settings from one secure area.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={<Bell size={14} />}>Broadcast</Button>
            <Button variant="primary" size="sm" icon={<ShieldCheck size={14} />}>Run audit</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <AdminCard className="p-2 lg:sticky lg:top-4 lg:self-start">
            <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1" aria-label="Admin sections">
              {sections.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      'flex min-w-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 focus-ring',
                      active ? 'bg-[rgba(233,162,76,0.12)] text-[#1F1F1F]' : 'text-[#666] hover:bg-[rgba(233,162,76,0.06)]'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={16} className={cn('shrink-0', active ? 'text-[#E9A24C]' : 'text-[#999]')} aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </AdminCard>

          <AdminCard>
            <SectionHeader section={section} />
            <SectionContent activeSection={activeSection} />
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminPage);
