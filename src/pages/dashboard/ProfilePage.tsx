import { motion } from 'framer-motion';
import { Settings, MessageSquare, FileText, Star, Clock, ChevronRight, Edit2 } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Conversations', value: '1,247', icon: MessageSquare },
  { label: 'Documents', value: '89', icon: FileText },
  { label: 'Hours Saved', value: '847h', icon: Clock },
  { label: 'AI Score', value: '94/100', icon: Star },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-2xl mx-auto p-6 pb-32 space-y-5">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#FFFDF8] to-[#F8F4EC] rounded-3xl p-7 border border-[rgba(0,0,0,0.05)] shadow-card relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[rgba(233,162,76,0.08)] blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-start gap-5 mb-6">
              <div className="relative">
                <Avatar name="Alex Morgan" size="xl" online={true} />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-card border border-[rgba(0,0,0,0.08)] flex items-center justify-center hover:border-[rgba(233,162,76,0.4)] transition-all">
                  <Edit2 size={12} className="text-[#666]" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-black text-[#1F1F1F]">Alex Morgan</h1>
                  <Badge variant="accent" size="sm">Pro</Badge>
                </div>
                <p className="text-sm text-[#666] mb-1">alex@company.com</p>
                <p className="text-sm text-[#999]">Head of Product · Acme Corp</p>
                <p className="text-xs text-[#BBB] mt-1">Joined November 2024</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Settings size={14} />}
                onClick={() => navigate('/dashboard/settings')}
              >
                Settings
              </Button>
            </div>

            <p className="text-sm text-[#666] leading-relaxed mb-5">
              Product leader passionate about AI, design systems, and building products that people love.
              Currently exploring the intersection of AI and productivity.
            </p>

            <div className="flex flex-wrap gap-2">
              {['AI/ML', 'Product Strategy', 'Design Systems', 'Startups', 'Writing'].map((tag) => (
                <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[rgba(233,162,76,0.1)] text-[#C17F2A] border border-[rgba(233,162,76,0.2)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card text-center"
              >
                <Icon size={18} className="text-[#E9A24C] mx-auto mb-2" />
                <p className="text-xl font-black text-[#1F1F1F]">{stat.value}</p>
                <p className="text-[11px] text-[#999] font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#1F1F1F]">Recent Activity</h2>
            <button className="text-xs text-[#E9A24C] font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-1">
            {[
              { action: 'Started a new chat', detail: 'Market Research Analysis', time: '2m ago', color: 'bg-[rgba(233,162,76,0.1)]', dot: 'bg-[#E9A24C]' },
              { action: 'Uploaded document', detail: 'Q3 Financial Report.xlsx', time: '1h ago', color: 'bg-blue-50', dot: 'bg-blue-500' },
              { action: 'Created workspace', detail: 'Product Strategy Q4', time: '3h ago', color: 'bg-purple-50', dot: 'bg-purple-500' },
              { action: 'Analyzed document', detail: 'Brand Guidelines 2025.pdf', time: '1d ago', color: 'bg-emerald-50', dot: 'bg-emerald-500' },
              { action: 'Switched AI model', detail: 'Claude 3.5 → GPT-4o', time: '2d ago', color: 'bg-amber-50', dot: 'bg-amber-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[rgba(0,0,0,0.02)] transition-all"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-[#666] font-medium">{item.action}: </span>
                  <span className="text-xs text-[#1F1F1F] font-semibold">{item.detail}</span>
                </div>
                <span className="text-[11px] text-[#BBB] shrink-0">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card"
        >
          <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Achievements</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { emoji: '🚀', label: 'Early Adopter', earned: true },
              { emoji: '🔥', label: '7-Day Streak', earned: true },
              { emoji: '🧠', label: 'Power User', earned: true },
              { emoji: '📚', label: 'Doc Master', earned: true },
              { emoji: '⚡', label: 'Speed Demon', earned: false },
              { emoji: '🌟', label: 'Top 1%', earned: false },
            ].map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -3 }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border ${badge.earned ? 'bg-[rgba(233,162,76,0.08)] border-[rgba(233,162,76,0.2)]' : 'bg-[rgba(0,0,0,0.02)] border-[rgba(0,0,0,0.06)] opacity-40'}`}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <span className="text-[10px] font-medium text-center text-[#666] leading-tight">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
