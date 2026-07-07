import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, MessageSquare, FileText, Star, Clock, Edit2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import Skeleton from '@/components/ui/Skeleton';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { profileActivity, profileStats, profileSummary } from '@/constants/mockData';
import { queryKeys } from '@/constants/queryKeys';
import { useMockResource } from '@/hooks/useMockResource';

const statIcons = [MessageSquare, FileText, Clock, Star];

const ProfilePage = () => {
  const navigate = useNavigate();
  const profileQuery = useMockResource({ queryKey: queryKeys.profile, data: { summary: profileSummary, stats: profileStats, activity: profileActivity } });
  const profile = profileQuery.data?.summary ?? profileSummary;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profileSummary);

  const activityColumns: DataTableColumn<(typeof profileActivity)[number]>[] = [
    { id: 'action', header: 'Action', accessor: (item) => item.action, sortable: true, render: (item) => <span className="font-medium text-[#666]">{item.action}</span> },
    { id: 'detail', header: 'Detail', accessor: (item) => item.detail, sortable: true, render: (item) => <span className="font-semibold text-[#1F1F1F]">{item.detail}</span> },
    { id: 'category', header: 'Category', accessor: (item) => item.category, sortable: true, filterable: true, filterOptions: ['Chat', 'Document', 'Workspace', 'AI', 'Settings'].map((item) => ({ label: item, value: item })), render: (item) => <Badge variant="neutral" size="sm">{item.category}</Badge> },
    { id: 'time', header: 'Time', accessor: (item) => item.time, sortable: true },
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-2xl mx-auto p-6 pb-32 space-y-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#FFFDF8] to-[#F8F4EC] rounded-3xl p-7 border border-[rgba(0,0,0,0.05)] shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[rgba(233,162,76,0.08)] blur-2xl" />
          <div className="relative z-10">
            {profileQuery.isLoading ? (
              <div className="space-y-4"><Skeleton className="h-20 rounded-2xl" /><Skeleton className="h-16 rounded-2xl" /><Skeleton className="h-8 rounded-2xl" /></div>
            ) : (
              <>
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative">
                    <Avatar name={editing ? draft.name : profile.name} size="xl" online={true} />
                    <button onClick={() => setEditing(true)} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-card border border-[rgba(0,0,0,0.08)] flex items-center justify-center hover:border-[rgba(233,162,76,0.4)] transition-all"><Edit2 size={12} className="text-[#666]" /></button>
                  </div>
                  <div className="flex-1">
                    {editing ? (
                      <div className="space-y-2">
                        <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="w-full bg-white/70 rounded-xl px-3 py-2 text-sm font-bold text-[#1F1F1F] outline-none border border-[rgba(0,0,0,0.06)] focus:border-[rgba(233,162,76,0.4)]" />
                        <input value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} className="w-full bg-white/70 rounded-xl px-3 py-2 text-sm text-[#666] outline-none border border-[rgba(0,0,0,0.06)] focus:border-[rgba(233,162,76,0.4)]" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1"><h1 className="text-xl font-black text-[#1F1F1F]">{draft.name}</h1><Badge variant="accent" size="sm">Pro</Badge></div>
                        <p className="text-sm text-[#666] mb-1">{draft.email}</p>
                      </>
                    )}
                    <p className="text-sm text-[#999] mt-2">{draft.role} · {draft.company}</p>
                    <p className="text-xs text-[#BBB] mt-1">Joined {draft.joined}</p>
                  </div>
                  {editing ? (
                    <Button variant="primary" size="sm" icon={<Save size={14} />} onClick={() => setEditing(false)}>Save</Button>
                  ) : (
                    <Button variant="secondary" size="sm" icon={<Settings size={14} />} onClick={() => navigate('/dashboard/settings')}>Settings</Button>
                  )}
                </div>

                {editing ? (
                  <textarea value={draft.bio} onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))} rows={3} className="input-premium w-full rounded-xl px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-[#999] resize-none mb-5" />
                ) : (
                  <p className="text-sm text-[#666] leading-relaxed mb-5">{draft.bio}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {draft.tags.map((tag) => <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[rgba(233,162,76,0.1)] text-[#C17F2A] border border-[rgba(233,162,76,0.2)]">{tag}</span>)}
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {profileQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)}
          {!profileQuery.isLoading && (profileQuery.data?.stats ?? []).map((stat, i) => {
            const Icon = statIcons[i] ?? Star;
            return (
              <motion.div key={stat.label} whileHover={{ y: -3 }} className="bg-[#FFFDF8] rounded-2xl p-4 border border-[rgba(0,0,0,0.05)] shadow-card text-center">
                <Icon size={18} className="text-[#E9A24C] mx-auto mb-2" />
                <p className="text-xl font-black text-[#1F1F1F]">{stat.value}</p>
                <p className="text-[11px] text-[#999] font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DataTable
            data={profileQuery.data?.activity ?? []}
            columns={activityColumns}
            getRowId={(item) => item.id}
            loading={profileQuery.isLoading}
            searchPlaceholder="Search profile activity..."
            emptyTitle="No activity found"
            emptyDescription="Try another category or search term."
            pageSize={4}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-[#FFFDF8] rounded-2xl p-5 border border-[rgba(0,0,0,0.05)] shadow-card">
          <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Achievements</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'Early Adopter', earned: true },
              { label: '7-Day Streak', earned: true },
              { label: 'Power User', earned: true },
              { label: 'Doc Master', earned: true },
              { label: 'Speed', earned: false },
              { label: 'Top 1%', earned: false },
            ].map((badge) => (
              <motion.div key={badge.label} whileHover={{ scale: 1.1, y: -3 }} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border ${badge.earned ? 'bg-[rgba(233,162,76,0.08)] border-[rgba(233,162,76,0.2)]' : 'bg-[rgba(0,0,0,0.02)] border-[rgba(0,0,0,0.06)] opacity-40'}`}>
                <Star size={20} className={badge.earned ? 'text-[#E9A24C] fill-[#E9A24C]' : 'text-[#CCC]'} />
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
