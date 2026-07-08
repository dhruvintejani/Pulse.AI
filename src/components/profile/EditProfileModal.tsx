import { memo, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, Link2, Plus, X } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { ProfileDetails } from '@/types/profile';

interface EditProfileModalProps {
  open: boolean;
  draft: ProfileDetails;
  errors: Partial<Record<keyof ProfileDetails | 'skillsText' | 'socialsText', string>>;
  saving: boolean;
  saved: boolean;
  onClose: () => void;
  onChange: (patch: Partial<ProfileDetails>) => void;
  onSave: () => void;
}

const EditProfileModal = ({ open, draft, errors, saving, saved, onClose, onChange, onSave }: EditProfileModalProps) => {
  const skillsText = useMemo(() => draft.skills.join(', '), [draft.skills]);
  const socialsText = useMemo(() => draft.socials.map((social) => `${social.label}: ${social.url}`).join('\n'), [draft.socials]);

  const updateSkills = (value: string) => {
    onChange({ skills: value.split(',').map((skill) => skill.trim()).filter(Boolean) });
  };

  const updateSocials = (value: string) => {
    onChange({
      socials: value
        .split('\n')
        .map((line, index) => {
          const [label, ...urlParts] = line.split(':');
          return {
            id: `${label.trim().toLowerCase() || 'social'}-${index}`,
            label: label.trim() || 'Social',
            url: urlParts.join(':').trim(),
          };
        })
        .filter((social) => social.url),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Edit profile"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl bg-[#FFFDF8] border border-[rgba(0,0,0,0.06)] shadow-float"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 p-5 border-b border-[rgba(0,0,0,0.05)] bg-[#FFFDF8]/90 backdrop-blur-xl">
              <div>
                <h2 className="text-lg font-black text-[#1F1F1F]">Edit Profile</h2>
                <p className="text-xs text-[#999] mt-0.5">Update your public identity and workspace profile.</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close edit profile modal" className="p-2 rounded-xl text-[#999] hover:text-[#666] hover:bg-[rgba(0,0,0,0.04)] transition-colors focus-ring">
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[rgba(233,162,76,0.04)] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-fit">
                  <Avatar name={draft.name} size="xl" online />
                  <button type="button" aria-label="Change profile picture" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-card border border-[rgba(0,0,0,0.08)] flex items-center justify-center hover:border-[rgba(233,162,76,0.4)] transition-all focus-ring">
                    <Camera size={13} className="text-[#666]" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F1F1F]">Profile Picture</p>
                  <p className="text-xs text-[#999] mt-1 max-w-md">Frontend-only photo control. Backend image upload can be connected later without changing this UI.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Name" value={draft.name} onChange={(event) => onChange({ name: event.target.value })} error={errors.name} />
                <Input label="Email" type="email" value={draft.email} onChange={(event) => onChange({ email: event.target.value })} error={errors.email} />
                <Input label="Company" value={draft.company} onChange={(event) => onChange({ company: event.target.value })} error={errors.company} />
                <Input label="Role" value={draft.role} onChange={(event) => onChange({ role: event.target.value })} error={errors.role} />
                <Input label="Location" value={draft.location} onChange={(event) => onChange({ location: event.target.value })} error={errors.location} />
                <Input label="Timezone" value={draft.timezone} onChange={(event) => onChange({ timezone: event.target.value })} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-[#1F1F1F]">Social Links</span>
                  <textarea
                    value={socialsText}
                    onChange={(event) => updateSocials(event.target.value)}
                    rows={4}
                    placeholder="LinkedIn: linkedin.com/in/name"
                    className={cn('input-premium w-full rounded-xl px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-[#999] resize-none', errors.socialsText && 'border-red-400')}
                  />
                  {errors.socialsText && <p className="text-xs text-red-500">{errors.socialsText}</p>}
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-[#1F1F1F]">Skills</span>
                  <textarea
                    value={skillsText}
                    onChange={(event) => updateSkills(event.target.value)}
                    rows={4}
                    placeholder="AI/ML, Product Strategy, Design Systems"
                    className={cn('input-premium w-full rounded-xl px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-[#999] resize-none', errors.skillsText && 'border-red-400')}
                  />
                  {errors.skillsText && <p className="text-xs text-red-500">{errors.skillsText}</p>}
                </label>
              </div>

              <label className="space-y-1.5 block">
                <span className="text-sm font-medium text-[#1F1F1F]">Biography</span>
                <textarea
                  value={draft.biography}
                  onChange={(event) => onChange({ biography: event.target.value })}
                  rows={5}
                  className={cn('input-premium w-full rounded-xl px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-[#999] resize-none', errors.biography && 'border-red-400')}
                  placeholder="Tell your team what you are working on..."
                />
                <div className="flex justify-between gap-3">
                  {errors.biography ? <p className="text-xs text-red-500">{errors.biography}</p> : <p className="text-xs text-[#999]">Minimum 20 characters.</p>}
                  <span className="text-xs text-[#CCC]">{draft.biography.length}/320</span>
                </div>
              </label>

              {saved && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  <Check size={15} aria-hidden="true" /> Profile saved successfully
                </motion.div>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-3 p-5 border-t border-[rgba(0,0,0,0.05)] bg-[#FFFDF8]/90 backdrop-blur-xl">
              <div className="hidden sm:flex items-center gap-2 text-xs text-[#999]"><Link2 size={13} className="text-[#E9A24C]" aria-hidden="true" /> Profile changes are stored in frontend state.</div>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="secondary" size="md" onClick={onClose}>Cancel</Button>
                <Button variant="primary" size="md" icon={saved ? <Check size={15} /> : <Plus size={15} />} loading={saving} onClick={onSave}>{saved ? 'Saved' : 'Save profile'}</Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(EditProfileModal);
