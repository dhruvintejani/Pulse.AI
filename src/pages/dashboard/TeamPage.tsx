import { motion } from 'framer-motion';
import { Users, Plus, Mail, MoreHorizontal, Crown, Shield, User, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';

const members = [
  { id: '1', name: 'Alex Morgan', email: 'alex@company.com', role: 'Owner', plan: 'Pro', online: true, joined: 'Nov 2024', messages: 1247 },
  { id: '2', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Admin', plan: 'Pro', online: true, joined: 'Dec 2024', messages: 892 },
  { id: '3', name: 'Marcus Rivera', email: 'marcus@company.com', role: 'Member', plan: 'Pro', online: false, joined: 'Dec 2024', messages: 567 },
  { id: '4', name: 'Priya Sharma', email: 'priya@company.com', role: 'Member', plan: 'Pro', online: true, joined: 'Jan 2025', messages: 421 },
  { id: '5', name: 'Tom Wilson', email: 'tom@company.com', role: 'Member', plan: 'Pro', online: false, joined: 'Jan 2025', messages: 238 },
  { id: '6', name: 'Emma Davis', email: 'emma@company.com', role: 'Viewer', plan: 'Free', online: false, joined: 'Feb 2025', messages: 45 },
];

const roleIcons = { Owner: Crown, Admin: Shield, Member: User, Viewer: User };
const roleColors = { Owner: 'text-[#E9A24C]', Admin: 'text-blue-500', Member: 'text-[#666]', Viewer: 'text-[#999]' };
const roleBg = { Owner: 'bg-[rgba(233,162,76,0.1)]', Admin: 'bg-blue-50', Member: 'bg-[rgba(0,0,0,0.04)]', Viewer: 'bg-[rgba(0,0,0,0.03)]' };

const TeamPage = () => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto p-6 pb-32 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Team</h1>
            <p className="text-sm text-[#999]">{members.length} members · Pro workspace</p>
          </div>
          <Button variant="primary" size="md" icon={<Plus size={15} />}>
            Invite member
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Members', value: '6', icon: Users, color: '#E9A24C' },
            { label: 'Online Now', value: '3', icon: Users, color: '#10B981' },
            { label: 'Seats Available', value: '4', icon: Users, color: '#3B82F6' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${stat.color}18` }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xl font-black text-[#1F1F1F]">{stat.value}</p>
                  <p className="text-xs text-[#999]">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search + filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CCC]" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.08)] text-[#1F1F1F] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.4)] shadow-card"
          />
        </motion.div>

        {/* Members list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#FFFDF8] rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-card overflow-hidden"
        >
          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.01)]">
            <span className="text-[11px] font-semibold text-[#BBB] uppercase tracking-wider flex-1">Member</span>
            <span className="text-[11px] font-semibold text-[#BBB] uppercase tracking-wider w-24 hidden sm:block">Role</span>
            <span className="text-[11px] font-semibold text-[#BBB] uppercase tracking-wider w-24 hidden md:block">Joined</span>
            <span className="text-[11px] font-semibold text-[#BBB] uppercase tracking-wider w-20 hidden lg:block">Messages</span>
            <span className="w-8" />
          </div>

          {/* Member rows */}
          <div>
            {members.map((member, i) => {
              const RoleIcon = roleIcons[member.role as keyof typeof roleIcons];
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  whileHover={{ backgroundColor: 'rgba(233,162,76,0.02)' }}
                  className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(0,0,0,0.04)] last:border-0 group transition-colors"
                >
                  {/* Member info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={member.name} size="sm" online={member.online} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1F1F1F] truncate">{member.name}</p>
                        {member.role === 'Owner' && (
                          <Crown size={12} className="text-[#E9A24C] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#999] truncate">{member.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="w-24 hidden sm:flex">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${roleBg[member.role as keyof typeof roleBg]}`}>
                      <RoleIcon size={11} className={roleColors[member.role as keyof typeof roleColors]} />
                      <span className={`text-xs font-semibold ${roleColors[member.role as keyof typeof roleColors]}`}>{member.role}</span>
                    </div>
                  </div>

                  {/* Joined */}
                  <span className="text-xs text-[#999] w-24 hidden md:block">{member.joined}</span>

                  {/* Messages */}
                  <span className="text-xs font-semibold text-[#1F1F1F] w-20 hidden lg:block">{member.messages.toLocaleString()}</span>

                  {/* Actions */}
                  <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[rgba(0,0,0,0.04)]">
                    <MoreHorizontal size={15} className="text-[#CCC]" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Invite section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[rgba(233,162,76,0.06)] to-[rgba(215,185,142,0.03)] rounded-2xl p-6 border border-[rgba(233,162,76,0.15)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail size={18} className="text-[#E9A24C]" />
            <h2 className="text-sm font-bold text-[#1F1F1F]">Invite teammates</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              className="flex-1 input-premium rounded-xl px-4 py-2.5 text-sm"
            />
            <Button variant="primary" size="md">Send invite</Button>
          </div>
          <p className="text-xs text-[#BBB] mt-3">
            Invites use 1 seat from your Pro plan (10 seats remaining).
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;
