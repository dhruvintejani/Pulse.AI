import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Mail, MoreHorizontal, Plus, Search, Shield, User, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
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

const roleIcons: Record<TeamRole, LucideIcon> = { Owner: Crown, Admin: Shield, Member: User, Viewer: User };
const roleColors: Record<TeamRole, string> = { Owner: 'text-[#E9A24C]', Admin: 'text-blue-500', Member: 'text-[#666]', Viewer: 'text-[#999]' };
const roleBg: Record<TeamRole, string> = { Owner: 'bg-[rgba(233,162,76,0.1)]', Admin: 'bg-blue-50', Member: 'bg-[rgba(0,0,0,0.04)]', Viewer: 'bg-[rgba(0,0,0,0.03)]' };

const TeamPage = () => {
  const [search, setSearch] = useState('');
  const normalizedSearch = search.trim().toLowerCase();

  const filteredMembers = useMemo(() => (
    members.filter((member) => `${member.name} ${member.email} ${member.role} ${member.plan}`.toLowerCase().includes(normalizedSearch))
  ), [normalizedSearch]);

  const onlineCount = useMemo(() => members.filter((member) => member.online).length, []);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-4xl p-4 pb-32 sm:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"
        >
          <div>
            <h1 className="mb-1 text-2xl font-black tracking-tight text-[#1F1F1F]">Team</h1>
            <p className="text-sm text-[#999]">{members.length} members · Pro workspace</p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={15} />} className="w-full sm:w-auto">
            Invite member
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {[
            { label: 'Total Members', value: String(members.length), icon: Users, color: '#E9A24C' },
            { label: 'Online Now', value: String(onlineCount), icon: Users, color: '#10B981' },
            { label: 'Seats Available', value: '4', icon: Users, color: '#3B82F6' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-4 shadow-card"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${stat.color}18` }}>
                  <Icon size={16} style={{ color: stat.color }} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl font-black text-[#1F1F1F]">{stat.value}</p>
                  <p className="truncate text-xs text-[#999]">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC]" aria-hidden="true" />
          <label className="sr-only" htmlFor="team-search">Search team members</label>
          <input
            id="team-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members, roles, emails..."
            className="w-full rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[#FFFDF8] py-3 pl-11 pr-4 text-sm text-[#1F1F1F] outline-none placeholder:text-[#CCC] shadow-card transition-[border-color,box-shadow,background-color] focus:border-[rgba(233,162,76,0.4)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] shadow-card"
        >
          <div className="flex items-center gap-4 border-b border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.01)] px-4 py-3 sm:px-5">
            <span className="flex-1 text-[11px] font-bold uppercase tracking-widest text-[#BBB]">Member</span>
            <span className="hidden w-24 text-[11px] font-bold uppercase tracking-widest text-[#BBB] sm:block">Role</span>
            <span className="hidden w-24 text-[11px] font-bold uppercase tracking-widest text-[#BBB] md:block">Joined</span>
            <span className="hidden w-20 text-[11px] font-bold uppercase tracking-widest text-[#BBB] lg:block">Messages</span>
            <span className="w-8" aria-hidden="true" />
          </div>

          {filteredMembers.length > 0 ? (
            <div aria-live="polite">
              {filteredMembers.map((member, index) => {
                const RoleIcon = roleIcons[member.role];
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.04 }}
                    whileHover={{ backgroundColor: 'rgba(233,162,76,0.02)' }}
                    className="group flex items-center gap-4 border-b border-[rgba(0,0,0,0.04)] px-4 py-4 transition-colors last:border-0 sm:px-5"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar name={member.name} size="sm" online={member.online} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-bold text-[#1F1F1F]">{member.name}</p>
                          {member.role === 'Owner' && <Crown size={12} className="shrink-0 text-[#E9A24C]" aria-hidden="true" />}
                        </div>
                        <p className="truncate text-xs text-[#999]">{member.email}</p>
                      </div>
                    </div>

                    <div className="hidden w-24 sm:flex">
                      <div className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1', roleBg[member.role])}>
                        <RoleIcon size={11} className={roleColors[member.role]} aria-hidden="true" />
                        <span className={cn('text-xs font-semibold', roleColors[member.role])}>{member.role}</span>
                      </div>
                    </div>

                    <span className="hidden w-24 text-xs text-[#999] md:block">{member.joined}</span>
                    <span className="hidden w-20 text-xs font-semibold text-[#1F1F1F] lg:block">{member.messages.toLocaleString()}</span>

                    <button type="button" aria-label={`Open actions for ${member.name}`} className="rounded-lg p-1.5 text-[#CCC] opacity-100 transition-all hover:bg-[rgba(0,0,0,0.04)] hover:text-[#E9A24C] focus-ring sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                      <MoreHorizontal size={15} aria-hidden="true" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No members found" description="Try another name, role, email, or workspace keyword." icon={<Users size={19} />} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-[rgba(233,162,76,0.15)] bg-gradient-to-br from-[rgba(233,162,76,0.06)] to-[rgba(215,185,142,0.03)] p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <Mail size={18} className="text-[#E9A24C]" aria-hidden="true" />
            <h2 className="text-sm font-bold text-[#1F1F1F]">Invite teammates</h2>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="team-invite-email">Invite teammate email</label>
            <input
              id="team-invite-email"
              type="email"
              placeholder="Enter email address..."
              className="input-premium min-w-0 flex-1 rounded-xl px-4 py-2.5 text-sm"
            />
            <Button variant="primary" size="md" className="w-full sm:w-auto">Send invite</Button>
          </div>
          <p className="mt-3 text-xs text-[#BBB]">
            Invites use 1 seat from your Pro plan (10 seats remaining).
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;
