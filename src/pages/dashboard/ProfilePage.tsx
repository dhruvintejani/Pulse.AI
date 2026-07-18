import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  Briefcase,
  Building2,
  Clock,
  Edit2,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/data/DataTable';
import type { DataTableColumn } from '@/components/data/DataTable';
import { EditProfileModal } from '@/components/profile';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import {
  profileAchievements,
  profileDetails,
  profileRecentActivity,
  profileStatistics,
} from '@/constants/profile';
import { queryKeys } from '@/constants/queryKeys';
import { DASHBOARD_PATHS } from '@/constants/routes';
import { useMockResource } from '@/hooks/useMockResource';
import { cn } from '@/lib/utils';
import type { ProfileActivityItem, ProfileDetails } from '@/types/profile';

type ProfileErrors = Partial<Record<keyof ProfileDetails | 'skillsText' | 'socialsText', string>>;

const statIcons: LucideIcon[] = [MessageSquare, FileText, Clock, TrendingUp];

const getSocialIcon = (): LucideIcon => Globe;

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

const ProfilePage = () => {
  const navigate = useNavigate();
  const profileQuery = useMockResource({
    queryKey: queryKeys.profile,
    data: {
      details: profileDetails,
      stats: profileStatistics,
      activity: profileRecentActivity,
      achievements: profileAchievements,
    },
  });
  const stats = profileQuery.data?.stats ?? profileStatistics;
  const activity = profileQuery.data?.activity ?? profileRecentActivity;
  const achievements = profileQuery.data?.achievements ?? profileAchievements;
  const [profile, setProfile] = useState<ProfileDetails>(profileDetails);
  const [draft, setDraft] = useState<ProfileDetails>(profileDetails);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<ProfileErrors>({});

  const activityColumns = useMemo<DataTableColumn<ProfileActivityItem>[]>(() => [
    { id: 'action', header: 'Action', accessor: (item) => item.action, sortable: true, render: (item) => <span className="font-medium text-[#666]">{item.action}</span> },
    { id: 'detail', header: 'Detail', accessor: (item) => item.detail, sortable: true, render: (item) => <span className="font-semibold text-[#1F1F1F]">{item.detail}</span> },
    {
      id: 'category',
      header: 'Category',
      accessor: (item) => item.category,
      sortable: true,
      filterable: true,
      filterOptions: ['Chat', 'Document', 'Workspace', 'AI', 'Settings', 'Profile'].map((item) => ({ label: item, value: item })),
      render: (item) => <Badge variant="neutral" size="sm">{item.category}</Badge>,
    },
    { id: 'time', header: 'Time', accessor: (item) => item.time, sortable: true },
  ], []);

  const validateDraft = () => {
    const nextErrors: ProfileErrors = {};
    if (!draft.name.trim()) nextErrors.name = 'Name is required.';
    if (!isValidEmail(draft.email)) nextErrors.email = 'Enter a valid email address.';
    if (!draft.company.trim()) nextErrors.company = 'Company is required.';
    if (!draft.role.trim()) nextErrors.role = 'Role is required.';
    if (!draft.location.trim()) nextErrors.location = 'Location is required.';
    if (draft.biography.trim().length < 20) nextErrors.biography = 'Biography must be at least 20 characters.';
    if (draft.skills.length < 2) nextErrors.skillsText = 'Add at least two skills.';
    if (!draft.socials.length) nextErrors.socialsText = 'Add at least one social link.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const openEditModal = () => {
    setDraft(profile);
    setErrors({});
    setSaved(false);
    setEditOpen(true);
  };

  const handleDraftChange = (patch: Partial<ProfileDetails>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setSaved(false);
  };

  const handleSaveProfile = () => {
    if (!validateDraft()) return;
    setSaving(true);
    window.setTimeout(() => {
      setProfile(draft);
      setSaving(false);
      setSaved(true);
      window.setTimeout(() => setEditOpen(false), 750);
    }, 700);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-6xl p-4 pb-32 sm:p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#1F1F1F]">Profile</h1>
            <p className="mt-1 text-sm text-[#999]">Manage your identity, activity, and AI workspace profile.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={<Settings size={15} />} onClick={() => navigate(DASHBOARD_PATHS.SETTINGS)}>Settings</Button>
            <Button variant="primary" size="md" icon={<Edit2 size={15} />} onClick={openEditModal}>Edit Profile</Button>
          </div>
        </motion.div>

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative overflow-hidden rounded-3xl border border-[rgba(0,0,0,0.05)] bg-gradient-to-br from-[#FFFDF8] to-[#F8F4EC] p-5 shadow-card sm:p-7">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[rgba(233,162,76,0.1)] blur-3xl" aria-hidden="true" />
            <div className="relative z-10">
              {profileQuery.isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 rounded-2xl" />
                  <Skeleton className="h-20 rounded-2xl" />
                  <Skeleton className="h-10 rounded-2xl" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="relative w-fit">
                      <Avatar name={profile.name} size="xl" online />
                      <button type="button" onClick={openEditModal} aria-label="Edit profile picture" className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white shadow-card transition-all hover:border-[rgba(233,162,76,0.4)] focus-ring">
                        <Edit2 size={13} className="text-[#666]" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-black text-[#1F1F1F]">{profile.name}</h2>
                        <Badge variant="accent" size="sm" dot>{profile.plan}</Badge>
                      </div>
                      <div className="grid gap-2 text-sm text-[#666] sm:grid-cols-2">
                        <span className="flex items-center gap-2 min-w-0"><Mail size={14} className="text-[#E9A24C] shrink-0" aria-hidden="true" /><span className="truncate">{profile.email}</span></span>
                        <span className="flex items-center gap-2"><Briefcase size={14} className="text-[#E9A24C]" aria-hidden="true" />{profile.role}</span>
                        <span className="flex items-center gap-2"><Building2 size={14} className="text-[#E9A24C]" aria-hidden="true" />{profile.company}</span>
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-[#E9A24C]" aria-hidden="true" />{profile.location}</span>
                      </div>
                      <p className="mt-2 text-xs text-[#BBB]">Joined {profile.joined} · {profile.timezone}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-white/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles size={15} className="text-[#E9A24C]" aria-hidden="true" />
                      <p className="text-sm font-bold text-[#1F1F1F]">Biography</p>
                    </div>
                    <p className="text-sm leading-relaxed text-[#666]">{profile.biography}</p>
                  </div>

                  <div className="mt-5">
                    <p className="mb-3 text-sm font-bold text-[#1F1F1F]">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <motion.span key={skill} whileHover={{ y: -2 }} className="rounded-full border border-[rgba(233,162,76,0.2)] bg-[rgba(233,162,76,0.1)] px-3 py-1.5 text-xs font-semibold text-[#C17F2A]">
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-5 shadow-card sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-[#1F1F1F]">Social Links</h2>
                <p className="mt-1 text-xs text-[#999]">Public links shown on your profile.</p>
              </div>
              <Badge variant="neutral" size="sm">{profile.socials.length} links</Badge>
            </div>
            <div className="space-y-3">
              {profile.socials.map((social) => {
                const SocialIcon = getSocialIcon();
                return (
                  <motion.a key={social.id} href={`https://${social.url.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" whileHover={{ x: 3 }} className="flex items-center gap-3 rounded-2xl border border-[rgba(0,0,0,0.05)] p-3 transition-colors hover:bg-[rgba(233,162,76,0.04)] focus-ring">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(233,162,76,0.1)]">
                      <SocialIcon size={17} className="text-[#E9A24C]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#1F1F1F]">{social.label}</p>
                      <p className="truncate text-xs text-[#999]">{social.url}</p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#1F1F1F] to-[#2D2D2D] p-5 text-white">
              <div className="mb-4 flex items-center gap-2">
                <Award size={16} className="text-[#E9A24C]" aria-hidden="true" />
                <h3 className="text-sm font-bold text-white">Account Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Plan</p>
                  <p className="mt-1 text-lg font-black text-white">{profile.plan}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Timezone</p>
                  <p className="mt-1 text-lg font-black text-white">{profile.timezone}</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-[#1F1F1F]">Account Statistics</h2>
              <p className="mt-1 text-xs text-[#999]">Usage and productivity signals from mock data.</p>
            </div>
            <Badge variant="accent" size="sm" dot>Live mock</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {profileQuery.isLoading && Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)}
            {!profileQuery.isLoading && stats.map((stat, index) => {
              const Icon = statIcons[index] ?? Star;
              return (
                <motion.div key={stat.label} whileHover={{ y: -3, scale: 1.01 }} className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-4 shadow-card">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(233,162,76,0.1)]">
                      <Icon size={17} className="text-[#E9A24C]" aria-hidden="true" />
                    </div>
                    <Badge variant="success" size="sm">{stat.change}</Badge>
                  </div>
                  <p className="text-2xl font-black text-[#1F1F1F]">{stat.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-[#999]">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-[#1F1F1F]">Recent Activity</h2>
                <p className="mt-1 text-xs text-[#999]">Search, sort, filter, and paginate profile activity.</p>
              </div>
              <Activity size={17} className="text-[#E9A24C]" aria-hidden="true" />
            </div>
            <DataTable
              data={activity}
              columns={activityColumns}
              getRowId={(item) => item.id}
              loading={profileQuery.isLoading}
              searchPlaceholder="Search recent activity..."
              emptyTitle="No activity found"
              emptyDescription="Try another category or search term."
              pageSize={5}
              ariaLabel="Profile recent activity table"
            />
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-[#1F1F1F]">Achievements</h2>
                <p className="mt-1 text-xs text-[#999]">Progress milestones and badges.</p>
              </div>
              <Award size={17} className="text-[#E9A24C]" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
              {achievements.map((badge) => (
                <motion.div key={badge.label} whileHover={{ scale: 1.04, y: -3 }} className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 text-center', badge.earned ? 'border-[rgba(233,162,76,0.2)] bg-[rgba(233,162,76,0.08)]' : 'border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.02)] opacity-50')}>
                  <Star size={20} className={badge.earned ? 'fill-[#E9A24C] text-[#E9A24C]' : 'text-[#CCC]'} aria-hidden="true" />
                  <span className="text-xs font-semibold leading-tight text-[#666]">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        draft={draft}
        errors={errors}
        saving={saving}
        saved={saved}
        onClose={() => setEditOpen(false)}
        onChange={handleDraftChange}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
