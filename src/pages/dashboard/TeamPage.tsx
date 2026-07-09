import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Mail, MoreHorizontal, Plus, Search, Shield, User, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type TeamRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  plan: string;
  online: boolean;
  joined: string;
  messages: number;
}

const members: TeamMember[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex@company.com', role: 'Owner', plan: 'Pro', online: true, joined: 'Nov 2024', messages: 1247 },
  { id: '2', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Admin', plan: 'Pro', online: true, joined: 'Dec 2024', messages: 892 },
  { id: '3', name: 'Marcus Rivera', email: 'marcus@company.com', role: 'Member', plan: 'Pro', online: false, joined: 'Dec 2024', messages: 567 },
  { id: '4', name: 'Priya Sharma', email: 'priya@company.com', role: 'Member', plan: 'Pro', online: true, joined: 'Jan 2025', messages: 421 },
  { id: '5', name: 'Tom Wilson', email: 'tom@company.com', role: 'Member', plan: 'Pro', online: false, joined: 'Jan 2025', messages: 238 },
  { id: '6', name: 'Emma Davis', email: 'emma@company.com', role: 'Viewer', plan: 'Free', online: false, joined: 'Feb 2025', messages: 45 },
];

const roleMeta: Record<TeamRole, { icon: LucideIcon; className: string }> = {
  Owner: { icon: Crown, className: 'bg-amber-50 text-amber-600 border-amber-100' },
  Admin: { icon: Shield, className: 'bg-blue-50 text-blue-600 border-blue-100' },
  Member: { icon: User, className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  Viewer: { icon: Users, className: 'bg-gray-50 text-gray-500 border-gray-100' },
};

const TeamPage = () => {
  const [query, setQuery] = useState('');

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return members;
    return members.filter((member) => (
      member.name.toLowerCase().includes(normalizedQuery) ||
      member.email.toLowerCase().includes(normalizedQuery) ||
      member.role.toLowerCase().includes(normalizedQuery)
    ));
  }, [query]);

  const onlineCount = useMemo(() => members.filter((member) => member.online).length, []);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-6xl space-y-6 p-4 pb-32 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#E9A24C]">Workspace access</p>
            <h1 className="text-2xl font-black tracking-tight text-[#1F1F1F] sm:text-3xl">Team</h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#999]">Manage collaborators, permissions, and workspace activity with a clean SaaS-ready interface.</p>
          </div>
          <Button variant="primary" icon={<Plus size={15} />} className="w-full sm:w-auto">Invite member</Button>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Members', value: members.length },
            { label: 'Online now', value: onlineCount },
            { label: 'Admins', value: members.filter((member) => member.role === 'Owner' || member.role === 'Admin').length },
          ].map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-4 shadow-card">
              <p className="text-2xl font-black text-[#1F1F1F]">{stat.value}</p>
              <p className="text-xs font-semibold text-[#999]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-4 shadow-card sm:p-5" aria-labelledby="team-members-title">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 id="team-members-title" className="text-base font-black text-[#1F1F1F]">Members</h2>
              <p className="text-xs text-[#999]">Search and review every collaborator in this workspace.</p>
            </div>
            <label className="relative w-full md:max-w-xs">
              <span className="sr-only">Search team members</span>
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search members..."
                className="w-full rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.03)] py-2.5 pl-9 pr-3 text-sm text-[#1F1F1F] outline-none transition-colors placeholder:text-[#BBB] focus:border-[rgba(233,162,76,0.4)]"
              />
            </label>
          </div>

          <div className="space-y-3">
            {filteredMembers.map((member, index) => {
              const meta = roleMeta[member.role];
              const RoleIcon = meta.icon;
              return (
                <motion.article key={member.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.035 }} className="group flex flex-col gap-4 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.015)] p-4 transition-all hover:border-[rgba(233,162,76,0.2)] hover:bg-[rgba(233,162,76,0.04)] sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={member.name} online={member.online} />
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-[#1F1F1F]">{member.name}</h3>
                      <p className="truncate text-xs text-[#999]">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold', meta.className)}>
                      <RoleIcon size={12} aria-hidden="true" /> {member.role}
                    </span>
                    <span className="rounded-full border border-[rgba(0,0,0,0.06)] bg-white px-2.5 py-1 text-xs font-bold text-[#999]">{member.plan}</span>
                    <span className="text-xs text-[#999]">Joined {member.joined}</span>
                    <button type="button" aria-label={`Open actions for ${member.name}`} className="rounded-xl p-2 text-[#CCC] opacity-100 transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#666] focus-ring sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                      <MoreHorizontal size={16} aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {filteredMembers.length === 0 && (
            <EmptyState title="No members found" description="Try another name, email, or role." icon={<Search size={18} />} />
          )}
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-3xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-5 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-black text-[#1F1F1F]">Invite by email</h2>
              <p className="mt-1 text-sm text-[#999]">Send a secure workspace invitation with a default member role.</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row md:max-w-lg">
              <label className="sr-only" htmlFor="team-invite-email">Invite email</label>
              <div className="relative min-w-0 flex-1">
                <Mail size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" aria-hidden="true" />
                <input id="team-invite-email" type="email" placeholder="teammate@company.com" className="w-full rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.03)] py-2.5 pl-9 pr-3 text-sm text-[#1F1F1F] outline-none transition-colors placeholder:text-[#BBB] focus:border-[rgba(233,162,76,0.4)]" />
              </div>
              <Button variant="secondary" className="w-full sm:w-auto">Send invite</Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default TeamPage;
