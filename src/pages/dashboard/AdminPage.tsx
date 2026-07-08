import { memo, useMemo, useState, type ReactNode } from 'react';
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
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { cn } from '@/lib/utils';

type AdminSectionKey = 'dashboard' | 'users' | 'chats' | 'documents' | 'analytics' | 'logs' | 'feedback' | 'notifications' | 'roles' | 'permissions' | 'settings';

interface AdminSection {
  id: AdminSectionKey;
  label: string;
  icon: LucideIcon;
  description: string;
}

const sections: AdminSection[] = [
  { id: 'dashboard', label: 'Dashboard', icon: ShieldCheck, description: 'Platform health, KPIs, and admin activity' },
  { id: 'users', label: 'Users', icon: Users, description: 'Accounts, roles, access, and status' },
  { id: 'chats', label: 'Chats', icon: MessageSquare, description: 'Conversation moderation and usage visibility' },
  { id: 'documents', label: 'Documents', icon: FileText, description: 'Uploads, storage, categories, and metadata' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Usage charts, AI activity, and product insights' },
  { id: 'logs', label: 'System Logs', icon: ScrollText, description: 'Operational events, warnings, and errors' },
  { id: 'feedback', label: 'Feedback', icon: Activity, description: 'Bug reports, ratings, and product feedback' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Unread state, broadcasts, categories, and preferences' },
  { id: 'roles', label: 'Roles', icon: Layers, description: 'Owner, admin, member, and viewer access tiers' },
  { id: 'permissions', label: 'Permissions', icon: KeyRound, description: 'Granular capability matrix for admin access' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'System configuration and integration status' },
];

const stats = [
  ['Users', '2,481', '+12%', 'success'],
  ['Chats', '18,492', '+8%', 'success'],
  ['Documents', '6,204', '+19%', 'success'],
  ['Open Feedback', '37', '-6%', 'warning'],
] as const;

const tableData: Record<Exclude<AdminSectionKey, 'dashboard' | 'analytics' | 'permissions' | 'settings'>, { headers: string[]; rows: string[][] }> = {
  users: {
    headers: ['Name', 'Email', 'Role', 'Status'],
    rows: [
      ['Alex Morgan', 'alex@pulse.ai', 'Owner', 'Active'],
      ['Maya Chen', 'maya@pulse.ai', 'Admin', 'Active'],
      ['Noah Patel', 'noah@pulse.ai', 'Member', 'Active'],
      ['Sarah Kim', 'sarah@pulse.ai', 'Viewer', 'Suspended'],
    ],
  },
  chats: {
    headers: ['Title', 'Owner', 'Messages', 'Model'],
    rows: [
      ['Market Research Q3', 'Alex', '42', 'GPT-4o'],
      ['Launch Plan Review', 'Maya', '18', 'Claude'],
      ['Invoice Analysis', 'Noah', '12', 'Gemini'],
    ],
  },
  documents: {
    headers: ['Title', 'Kind', 'Category', 'Status'],
    rows: [
      ['Product Roadmap.pdf', 'PDF', 'Strategy', 'Ready'],
      ['Customer Notes.docx', 'DOCX', 'Research', 'Ready'],
      ['Revenue Export.csv', 'CSV', 'Finance', 'Processing'],
    ],
  },
  logs: {
    headers: ['Level', 'Source', 'Message', 'Time'],
    rows: [
      ['info', 'api', 'Dashboard API completed successfully', '2m ago'],
      ['warning', 'documents', 'Large upload validation rejected', '19m ago'],
      ['error', 'notifications', 'Provider transport not configured', '1h ago'],
    ],
  },
  feedback: {
    headers: ['Type', 'Message', 'Status', 'Rating'],
    rows: [
      ['Feature', 'Add shared prompt templates for teams.', 'Open', '5/5'],
      ['Bug', 'Markdown table preview wraps on mobile.', 'Reviewed', '4/5'],
      ['General', 'The new dashboard feels much faster.', 'Closed', '5/5'],
    ],
  },
  notifications: {
    headers: ['Title', 'Category', 'Status', 'Target'],
    rows: [
      ['Document analysis complete', 'Success', 'Unread', 'All users'],
      ['Billing cycle starts tomorrow', 'Billing', 'Read', 'Admins'],
      ['Workspace invite accepted', 'Info', 'Unread', 'Team'],
    ],
  },
  roles: {
    headers: ['Role', 'Users', 'Permissions', 'Scope'],
    rows: [
      ['Owner', '1', '16', 'Full platform access'],
      ['Admin', '3', '14', 'Operational access'],
      ['Viewer', '12', '7', 'Read-only access'],
    ],
  },
};

const permissions = ['admin.access', 'dashboard.read', 'users.read', 'users.write', 'chats.read', 'documents.read', 'analytics.read', 'logs.read', 'feedback.write', 'notifications.write', 'roles.write', 'settings.write'];
const settingsRows = [['Environment', 'Production-ready'], ['Storage', 'Cloudinary ready'], ['Auth Provider', 'Clerk only'], ['Real-time', 'SSE ready']];

const AdminCard = memo(({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className={cn('rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-5 shadow-card', className)}>
    {children}
  </motion.section>
));
AdminCard.displayName = 'AdminCard';

const SimpleTable = memo(({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto rounded-2xl border border-[rgba(0,0,0,0.05)]">
    <table className="min-w-full text-left text-sm">
      <thead>
        <tr className="bg-[rgba(233,162,76,0.04)]">
          {headers.map((header) => <th key={header} className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#999]">{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-t border-[rgba(0,0,0,0.05)]">
            {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className="whitespace-nowrap px-4 py-3 text-[#666]">{cell}</td>)}
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value, change, variant]) => (
            <AdminCard key={label} className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#999]">{label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-2xl font-black text-[#1F1F1F]">{value}</p>
                <Badge variant={variant} size="sm">{change}</Badge>
              </div>
            </AdminCard>
          ))}
        </div>
        <SimpleTable headers={tableData.logs.headers} rows={tableData.logs.rows} />
      </div>
    );
  }

  if (activeSection === 'analytics') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {['AI requests', 'Tokens used', 'Workspace activity'].map((item, index) => (
          <AdminCard key={item} className="p-4">
            <p className="text-sm font-bold text-[#1F1F1F]">{item}</p>
            <div className="mt-4 flex h-28 items-end gap-2">
              {[42, 68, 54, 88, 73, 96].map((value, barIndex) => <div key={`${item}-${barIndex}`} className="flex-1 rounded-t-xl bg-[rgba(233,162,76,0.14)]" style={{ height: `${Math.max(18, value - index * 8)}%` }} />)}
            </div>
          </AdminCard>
        ))}
      </div>
    );
  }

  if (activeSection === 'permissions') {
    return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{permissions.map((permission) => <div key={permission} className="flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.05)] bg-white/60 p-3"><KeyRound size={15} className="text-[#E9A24C]" /><span className="text-sm font-semibold text-[#666]">{permission}</span></div>)}</div>;
  }

  if (activeSection === 'settings') {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{settingsRows.map(([label, value]) => <AdminCard key={label} className="p-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#999]">{label}</p><p className="mt-2 text-base font-bold text-[#1F1F1F]">{value}</p></AdminCard>)}</div>;
  }

  return <SimpleTable headers={tableData[activeSection].headers} rows={tableData[activeSection].rows} />;
});
SectionContent.displayName = 'SectionContent';

const AdminPage = () => {
  const { currentUser } = useCurrentUser();
  const [activeSection, setActiveSection] = useState<AdminSectionKey>('dashboard');
  const section = useMemo(() => sections.find((item) => item.id === activeSection) ?? sections[0], [activeSection]);
  const SectionIcon = section.icon;

  if (!currentUser?.isAdmin) {
    return (
      <div className="h-full overflow-y-auto no-scrollbar">
        <div className="mx-auto flex min-h-full max-w-3xl items-center justify-center p-4 pb-32 sm:p-6">
          <AdminCard className="w-full text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(233,162,76,0.1)] text-[#E9A24C]"><Lock size={24} /></div>
            <EmptyState title="Admin access required" description="Only users with owner or admin role can access the Pulse AI admin panel." />
          </AdminCard>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-7xl space-y-6 p-4 pb-32 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2"><Badge variant="accent" size="sm" dot>Admin</Badge><Badge variant="neutral" size="sm">MongoDB backed</Badge></div>
            <h1 className="text-2xl font-black tracking-tight text-[#1F1F1F] sm:text-3xl">Admin Panel</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#999]">Manage users, chats, documents, analytics, system logs, feedback, notifications, roles, permissions, and settings.</p>
          </div>
          <div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" icon={<Bell size={14} />}>Broadcast</Button><Button variant="primary" size="sm" icon={<ShieldCheck size={14} />}>Run audit</Button></div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <AdminCard className="p-2 lg:sticky lg:top-4 lg:self-start">
            <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1" aria-label="Admin sections">
              {sections.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button key={item.id} type="button" onClick={() => setActiveSection(item.id)} className={cn('flex min-w-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 focus-ring', active ? 'bg-[rgba(233,162,76,0.12)] text-[#1F1F1F]' : 'text-[#666] hover:bg-[rgba(233,162,76,0.06)]')} aria-current={active ? 'page' : undefined}>
                    <Icon size={16} className={cn('shrink-0', active ? 'text-[#E9A24C]' : 'text-[#999]')} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </AdminCard>

          <AdminCard>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(233,162,76,0.1)] text-[#E9A24C]"><SectionIcon size={20} /></div>
                <div><h2 className="text-lg font-black tracking-tight text-[#1F1F1F]">{section.label}</h2><p className="text-sm text-[#999]">{section.description}</p></div>
              </div>
              <Button size="sm" variant="secondary" icon={<SlidersHorizontal size={14} />}>Manage</Button>
            </div>
            <SectionContent activeSection={activeSection} />
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default memo(AdminPage);
