import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Bell,
  Building2,
  Check,
  CreditCard,
  Globe,
  Languages,
  Lock,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sparkles,
  Sun,
  User,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { profileDetails } from '@/constants/profile';
import { useTheme } from '@/hooks/useTheme';
import { useUserSettings } from '@/hooks/useUserSettings';
import { cn } from '@/lib/utils';
import type { UserSettingsPayload, UserSettingsResponse } from '@/types/settings';
import type { ThemeMode } from '@/types/theme';

type SettingsSectionId = 'general' | 'appearance' | 'notifications' | 'security' | 'account' | 'billing' | 'language' | 'profile' | 'theme';
type SaveStatus = 'idle' | 'loading' | 'success';

interface SettingsForms {
  general: { workspaceName: string; defaultHome: string; timezone: string; dateFormat: string };
  appearance: { density: string; sidebarBehavior: string; fontSize: string; animations: boolean; glassEffects: boolean };
  notifications: { email: boolean; push: boolean; weeklyDigest: boolean; productUpdates: boolean; teamMentions: boolean; billingAlerts: boolean };
  security: { currentPassword: string; newPassword: string; confirmPassword: string; twoFactor: boolean; sessionAlerts: boolean; deviceReview: boolean };
  account: { username: string; recoveryEmail: string; dataSharing: boolean; betaAccess: boolean };
  billing: { plan: string; billingEmail: string; taxId: string; autoRenew: boolean; invoiceEmails: boolean };
  language: { language: string; region: string; timezone: string; currency: string; autoTranslate: boolean };
  profile: { name: string; email: string; company: string; role: string; location: string; biography: string };
  theme: { accentColor: string; cornerRadius: string; contrast: string };
}

const settingsSections: Array<{ id: SettingsSectionId; label: string; icon: LucideIcon; description: string }> = [
  { id: 'general', label: 'General', icon: Settings, description: 'Workspace defaults' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Layout and motion' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts and digests' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Clerk and sessions' },
  { id: 'account', label: 'Account', icon: User, description: 'Identity and data' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Plan and invoices' },
  { id: 'language', label: 'Language', icon: Languages, description: 'Region settings' },
  { id: 'profile', label: 'Profile', icon: BadgeCheck, description: 'Public profile' },
  { id: 'theme', label: 'Theme', icon: Moon, description: 'Light and dark mode' },
];

const themeOptions: Array<{ id: ThemeMode; label: string; description: string; icon: LucideIcon; colors: string[] }> = [
  { id: 'light', label: 'Light', description: 'Warm bright interface', icon: Sun, colors: ['#F8F4EC', '#FFFDF8', '#E9A24C'] },
  { id: 'dark', label: 'Dark', description: 'Premium low-light mode', icon: Moon, colors: ['#0F0D0A', '#17130F', '#E9A24C'] },
  { id: 'system', label: 'System', description: 'Match your device', icon: Monitor, colors: ['#F8F4EC', '#1F1F1F', '#E9A24C'] },
];

const initialForms: SettingsForms = {
  general: { workspaceName: 'Pulse AI Workspace', defaultHome: 'Dashboard', timezone: 'Pacific Time', dateFormat: 'MMM DD, YYYY' },
  appearance: { density: 'Comfortable', sidebarBehavior: 'Expanded', fontSize: 'Default', animations: true, glassEffects: true },
  notifications: { email: true, push: true, weeklyDigest: true, productUpdates: true, teamMentions: true, billingAlerts: true },
  security: { currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: true, sessionAlerts: true, deviceReview: true },
  account: { username: 'alexmorgan', recoveryEmail: 'alex.recovery@company.com', dataSharing: false, betaAccess: true },
  billing: { plan: 'Pro', billingEmail: profileDetails.email, taxId: 'US-ACME-2026', autoRenew: true, invoiceEmails: true },
  language: { language: 'English', region: 'United States', timezone: profileDetails.timezone, currency: 'USD', autoTranslate: false },
  profile: { name: profileDetails.name, email: profileDetails.email, company: profileDetails.company, role: profileDetails.role, location: profileDetails.location, biography: profileDetails.biography },
  theme: { accentColor: 'Amber', cornerRadius: 'Rounded', contrast: 'Balanced' },
};

const initialSaveState: Record<SettingsSectionId, SaveStatus> = {
  general: 'idle',
  appearance: 'idle',
  notifications: 'idle',
  security: 'idle',
  account: 'idle',
  billing: 'idle',
  language: 'idle',
  profile: 'idle',
  theme: 'idle',
};

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const getRecord = (value: unknown) => (isRecord(value) ? value : {});
const getString = (record: Record<string, unknown>, key: string, fallback: string) => (typeof record[key] === 'string' ? record[key] : fallback);
const getBoolean = (record: Record<string, unknown>, key: string, fallback: boolean) => (typeof record[key] === 'boolean' ? record[key] : fallback);

const mergeSettingsIntoForms = (settings: UserSettingsResponse, current: SettingsForms): SettingsForms => {
  const metadata = getRecord(settings.metadata);
  const general = getRecord(metadata.general);
  const billing = getRecord(metadata.billing);
  const languageMeta = getRecord(metadata.language);
  const appearance = getRecord(settings.appearance_settings);
  const notifications = getRecord(settings.notification_preferences);
  const profile = getRecord(settings.profile_settings);
  const privacy = getRecord(settings.privacy_settings);
  const security = getRecord(settings.security_settings);
  const themeSettings = getRecord(metadata.theme);

  return {
    general: {
      workspaceName: getString(general, 'workspaceName', current.general.workspaceName),
      defaultHome: getString(general, 'defaultHome', current.general.defaultHome),
      timezone: settings.timezone || getString(general, 'timezone', current.general.timezone),
      dateFormat: getString(general, 'dateFormat', current.general.dateFormat),
    },
    appearance: {
      density: getString(appearance, 'density', current.appearance.density),
      sidebarBehavior: getString(appearance, 'sidebarBehavior', current.appearance.sidebarBehavior),
      fontSize: getString(appearance, 'fontSize', current.appearance.fontSize),
      animations: getBoolean(appearance, 'animations', current.appearance.animations),
      glassEffects: getBoolean(appearance, 'glassEffects', current.appearance.glassEffects),
    },
    notifications: {
      email: getBoolean(notifications, 'email', current.notifications.email),
      push: getBoolean(notifications, 'push', current.notifications.push),
      weeklyDigest: getBoolean(notifications, 'weeklyDigest', current.notifications.weeklyDigest),
      productUpdates: getBoolean(notifications, 'productUpdates', current.notifications.productUpdates),
      teamMentions: getBoolean(notifications, 'teamMentions', current.notifications.teamMentions),
      billingAlerts: getBoolean(notifications, 'billingAlerts', current.notifications.billingAlerts),
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactor: getBoolean(security, 'twoFactor', current.security.twoFactor),
      sessionAlerts: getBoolean(security, 'sessionAlerts', current.security.sessionAlerts),
      deviceReview: getBoolean(security, 'deviceReview', current.security.deviceReview),
    },
    account: {
      username: getString(privacy, 'username', current.account.username),
      recoveryEmail: getString(privacy, 'recoveryEmail', current.account.recoveryEmail),
      dataSharing: getBoolean(privacy, 'dataSharing', current.account.dataSharing),
      betaAccess: getBoolean(privacy, 'betaAccess', current.account.betaAccess),
    },
    billing: {
      plan: getString(billing, 'plan', current.billing.plan),
      billingEmail: getString(billing, 'billingEmail', current.billing.billingEmail),
      taxId: getString(billing, 'taxId', current.billing.taxId),
      autoRenew: getBoolean(billing, 'autoRenew', current.billing.autoRenew),
      invoiceEmails: getBoolean(billing, 'invoiceEmails', current.billing.invoiceEmails),
    },
    language: {
      language: settings.language || getString(languageMeta, 'language', current.language.language),
      region: getString(languageMeta, 'region', current.language.region),
      timezone: settings.timezone || getString(languageMeta, 'timezone', current.language.timezone),
      currency: getString(languageMeta, 'currency', current.language.currency),
      autoTranslate: getBoolean(languageMeta, 'autoTranslate', current.language.autoTranslate),
    },
    profile: {
      name: getString(profile, 'name', current.profile.name),
      email: getString(profile, 'email', current.profile.email),
      company: getString(profile, 'company', current.profile.company),
      role: getString(profile, 'role', current.profile.role),
      location: getString(profile, 'location', current.profile.location),
      biography: getString(profile, 'biography', current.profile.biography),
    },
    theme: {
      accentColor: getString(themeSettings, 'accentColor', current.theme.accentColor),
      cornerRadius: getString(themeSettings, 'cornerRadius', current.theme.cornerRadius),
      contrast: getString(themeSettings, 'contrast', current.theme.contrast),
    },
  };
};

const buildSettingsPayload = (section: SettingsSectionId, forms: SettingsForms, theme: ThemeMode): UserSettingsPayload => {
  const sharedMetadata = {
    general: forms.general,
    billing: forms.billing,
    language: forms.language,
    theme: forms.theme,
  };

  if (section === 'notifications') return { notification_preferences: forms.notifications };
  if (section === 'appearance') return { appearance_settings: forms.appearance };
  if (section === 'security') {
    return {
      security_settings: {
        twoFactor: forms.security.twoFactor,
        sessionAlerts: forms.security.sessionAlerts,
        deviceReview: forms.security.deviceReview,
      },
    };
  }
  if (section === 'account') return { privacy_settings: forms.account };
  if (section === 'profile') return { profile_settings: forms.profile };
  if (section === 'language') return { language: forms.language.language, timezone: forms.language.timezone, metadata: sharedMetadata };
  if (section === 'theme') return { theme, appearance_settings: forms.appearance, metadata: sharedMetadata };

  return { metadata: sharedMetadata };
};

const Toggle = ({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) => (
  <button type="button" onClick={onChange} aria-label={label} aria-pressed={checked} className={cn('relative h-[22px] w-10 rounded-full transition-all duration-300 focus-ring', checked ? 'bg-[#E9A24C]' : 'bg-[rgba(0,0,0,0.12)]')}>
    <motion.span animate={{ x: checked ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm" />
  </button>
);

const Panel = ({ title, description, icon: Icon, children }: { title: string; description: string; icon: LucideIcon; children: ReactNode }) => (
  <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-5 shadow-card sm:p-6">
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgba(233,162,76,0.1)]">
        <Icon size={18} className="text-[#E9A24C]" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-base font-black text-[#1F1F1F]">{title}</h2>
        <p className="mt-1 text-xs text-[#999]">{description}</p>
      </div>
    </div>
    {children}
  </motion.section>
);

const SelectField = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-[#1F1F1F]">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="input-premium w-full rounded-xl px-4 py-3 text-sm text-[#1F1F1F] outline-none">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const TextAreaField = ({ label, value, error, rows = 4, onChange }: { label: string; value: string; error?: string; rows?: number; onChange: (value: string) => void }) => (
  <label className="block space-y-1.5">
    <span className="text-sm font-medium text-[#1F1F1F]">{label}</span>
    <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className={cn('input-premium w-full resize-none rounded-xl px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-[#999]', error && 'border-red-400')} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </label>
);

const ToggleRow = ({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: () => void }) => (
  <div className="flex items-center justify-between gap-4 border-b border-[rgba(0,0,0,0.04)] py-3 last:border-0">
    <div>
      <p className="text-sm font-semibold text-[#1F1F1F]">{title}</p>
      <p className="mt-0.5 text-xs text-[#999]">{description}</p>
    </div>
    <Toggle checked={checked} onChange={onChange} label={title} />
  </div>
);

const SaveFooter = ({ status, error, onSave }: { status: SaveStatus; error?: string; onSave: () => void }) => (
  <div className="mt-6 flex flex-col justify-between gap-3 border-t border-[rgba(0,0,0,0.05)] pt-4 sm:flex-row sm:items-center">
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
          <Check size={15} aria-hidden="true" /> Saved to your account
        </motion.div>
      ) : error ? (
        <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-semibold text-red-500">{error}</motion.p>
      ) : (
        <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-[#999]">Changes persist to MongoDB through the settings API with local fallback.</motion.p>
      )}
    </AnimatePresence>
    <Button variant="primary" size="md" loading={status === 'loading'} icon={status === 'success' ? <Check size={15} /> : undefined} onClick={onSave}>
      {status === 'success' ? 'Saved' : 'Save changes'}
    </Button>
  </div>
);

const SettingsPage = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { settings, isLoadingSettings, isUpdatingSettings, updateSettings } = useUserSettings();
  const hydratedRef = useRef(false);
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general');
  const [forms, setForms] = useState<SettingsForms>(initialForms);
  const [saveState, setSaveState] = useState<Record<SettingsSectionId, SaveStatus>>(initialSaveState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!settings || hydratedRef.current) return;
    hydratedRef.current = true;
    setForms((current) => mergeSettingsIntoForms(settings, current));
    if (settings.theme && settings.theme !== theme) setTheme(settings.theme);
  }, [settings, setTheme, theme]);

  const activeSectionMeta = useMemo(() => settingsSections.find((section) => section.id === activeSection) ?? settingsSections[0], [activeSection]);
  const ActiveSectionIcon = activeSectionMeta.icon;

  const updateForm = useCallback(<Section extends keyof SettingsForms>(section: Section, patch: Partial<SettingsForms[Section]>) => {
    setForms((current) => ({ ...current, [section]: { ...current[section], ...patch } }));
    setSaveState((current) => ({ ...current, [section]: 'idle' }));
    setErrors({});
  }, []);

  const validateSection = useCallback((section: SettingsSectionId) => {
    const nextErrors: Record<string, string> = {};

    if (section === 'general' && !forms.general.workspaceName.trim()) nextErrors.workspaceName = 'Workspace name is required.';

    if (section === 'profile') {
      if (!forms.profile.name.trim()) nextErrors.name = 'Name is required.';
      if (!isValidEmail(forms.profile.email)) nextErrors.email = 'Enter a valid email address.';
      if (!forms.profile.company.trim()) nextErrors.company = 'Company is required.';
      if (!forms.profile.role.trim()) nextErrors.role = 'Role is required.';
      if (forms.profile.biography.trim().length < 20) nextErrors.biography = 'Biography must be at least 20 characters.';
    }

    if (section === 'security' && (forms.security.currentPassword || forms.security.newPassword || forms.security.confirmPassword)) {
      if (!forms.security.currentPassword.trim()) nextErrors.currentPassword = 'Current password is required.';
      if (forms.security.newPassword.length < 8) nextErrors.newPassword = 'New password must be at least 8 characters.';
      if (forms.security.newPassword !== forms.security.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    }

    if (section === 'account') {
      if (forms.account.username.trim().length < 3) nextErrors.username = 'Username must be at least 3 characters.';
      if (!isValidEmail(forms.account.recoveryEmail)) nextErrors.recoveryEmail = 'Enter a valid recovery email.';
    }

    if (section === 'billing' && !isValidEmail(forms.billing.billingEmail)) nextErrors.billingEmail = 'Enter a valid billing email.';

    if (section === 'language') {
      if (!forms.language.language.trim()) nextErrors.language = 'Language is required.';
      if (!forms.language.region.trim()) nextErrors.region = 'Region is required.';
      if (!forms.language.currency.trim()) nextErrors.currency = 'Currency is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [forms]);

  const handleSave = useCallback(async (section: SettingsSectionId) => {
    if (!validateSection(section)) return;
    setSaveState((current) => ({ ...current, [section]: 'loading' }));

    try {
      await updateSettings(buildSettingsPayload(section, forms, theme));
      setSaveState((current) => ({ ...current, [section]: 'success' }));
      window.setTimeout(() => setSaveState((current) => ({ ...current, [section]: 'idle' })), 1800);
    } catch {
      setErrors({ save: 'Unable to save right now. Please try again.' });
      setSaveState((current) => ({ ...current, [section]: 'idle' }));
    }
  }, [forms, theme, updateSettings, validateSection]);

  const renderSaveFooter = (section: SettingsSectionId) => <SaveFooter status={saveState[section]} error={errors.save} onSave={() => void handleSave(section)} />;

  const renderGeneral = () => (
    <Panel title="General" description="Configure workspace defaults and product behavior." icon={Settings}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Workspace name" value={forms.general.workspaceName} onChange={(event) => updateForm('general', { workspaceName: event.target.value })} error={errors.workspaceName} icon={<Building2 size={16} />} />
        <SelectField label="Default home" value={forms.general.defaultHome} options={['Dashboard', 'Chat', 'Documents', 'Workspace', 'Analytics']} onChange={(value) => updateForm('general', { defaultHome: value })} />
        <SelectField label="Timezone" value={forms.general.timezone} options={['Pacific Time', 'Eastern Time', 'UTC', 'India Standard Time', 'Central European Time']} onChange={(value) => updateForm('general', { timezone: value })} />
        <SelectField label="Date format" value={forms.general.dateFormat} options={['MMM DD, YYYY', 'DD MMM YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']} onChange={(value) => updateForm('general', { dateFormat: value })} />
      </div>
      {renderSaveFooter('general')}
    </Panel>
  );

  const renderAppearance = () => (
    <Panel title="Appearance" description="Adjust layout density, motion, and visual polish." icon={Palette}>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {['Compact', 'Comfortable', 'Spacious'].map((density) => (
          <button key={density} type="button" onClick={() => updateForm('appearance', { density })} className={cn('rounded-xl border p-4 text-left transition-all focus-ring', forms.appearance.density === density ? 'border-[#E9A24C] bg-[rgba(233,162,76,0.08)]' : 'border-[rgba(0,0,0,0.06)] hover:border-[rgba(233,162,76,0.3)]')}>
            <p className="text-sm font-bold text-[#1F1F1F]">{density}</p>
            <p className="mt-1 text-xs text-[#999]">{density === 'Compact' ? 'More content' : density === 'Comfortable' ? 'Balanced spacing' : 'Relaxed layout'}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Sidebar behavior" value={forms.appearance.sidebarBehavior} options={['Expanded', 'Collapsed', 'Auto collapse']} onChange={(value) => updateForm('appearance', { sidebarBehavior: value })} />
        <SelectField label="Font size" value={forms.appearance.fontSize} options={['Small', 'Default', 'Large', 'XL']} onChange={(value) => updateForm('appearance', { fontSize: value })} />
      </div>
      <div className="mt-5 rounded-2xl border border-[rgba(0,0,0,0.05)] p-4">
        <ToggleRow title="Beautiful animations" description="Enable smooth transitions and micro-interactions." checked={forms.appearance.animations} onChange={() => updateForm('appearance', { animations: !forms.appearance.animations })} />
        <ToggleRow title="Glass effects" description="Use premium translucent surfaces and blur." checked={forms.appearance.glassEffects} onChange={() => updateForm('appearance', { glassEffects: !forms.appearance.glassEffects })} />
      </div>
      {renderSaveFooter('appearance')}
    </Panel>
  );

  const renderNotifications = () => (
    <Panel title="Notifications" description="Control how Pulse AI alerts you across product events." icon={Bell}>
      <div className="rounded-2xl border border-[rgba(0,0,0,0.05)] p-4">
        <ToggleRow title="Email notifications" description="Receive important updates via email." checked={forms.notifications.email} onChange={() => updateForm('notifications', { email: !forms.notifications.email })} />
        <ToggleRow title="Push notifications" description="Browser and mobile alerts for real-time events." checked={forms.notifications.push} onChange={() => updateForm('notifications', { push: !forms.notifications.push })} />
        <ToggleRow title="Weekly digest" description="A weekly summary of chats, documents, and usage." checked={forms.notifications.weeklyDigest} onChange={() => updateForm('notifications', { weeklyDigest: !forms.notifications.weeklyDigest })} />
        <ToggleRow title="Product updates" description="New features, model releases, and changelogs." checked={forms.notifications.productUpdates} onChange={() => updateForm('notifications', { productUpdates: !forms.notifications.productUpdates })} />
        <ToggleRow title="Team mentions" description="When teammates mention you in workspaces." checked={forms.notifications.teamMentions} onChange={() => updateForm('notifications', { teamMentions: !forms.notifications.teamMentions })} />
        <ToggleRow title="Billing alerts" description="Invoices, plan changes, and usage warnings." checked={forms.notifications.billingAlerts} onChange={() => updateForm('notifications', { billingAlerts: !forms.notifications.billingAlerts })} />
      </div>
      {renderSaveFooter('notifications')}
    </Panel>
  );

  const renderSecurity = () => (
    <Panel title="Security" description="Clerk manages passwordless authentication; Pulse AI stores security preferences only." icon={Shield}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Current password" type="password" showPasswordToggle value={forms.security.currentPassword} onChange={(event) => updateForm('security', { currentPassword: event.target.value })} error={errors.currentPassword} icon={<Lock size={16} />} />
        <div className="hidden sm:block" />
        <Input label="New password" type="password" showPasswordToggle value={forms.security.newPassword} onChange={(event) => updateForm('security', { newPassword: event.target.value })} error={errors.newPassword} />
        <Input label="Confirm password" type="password" showPasswordToggle value={forms.security.confirmPassword} onChange={(event) => updateForm('security', { confirmPassword: event.target.value })} error={errors.confirmPassword} />
      </div>
      <div className="mt-5 rounded-2xl border border-[rgba(0,0,0,0.05)] p-4">
        <ToggleRow title="Two-factor authentication" description="Preference flag synced with the user settings API." checked={forms.security.twoFactor} onChange={() => updateForm('security', { twoFactor: !forms.security.twoFactor })} />
        <ToggleRow title="Session alerts" description="Notify me when a new device signs in." checked={forms.security.sessionAlerts} onChange={() => updateForm('security', { sessionAlerts: !forms.security.sessionAlerts })} />
        <ToggleRow title="Monthly device review" description="Remind me to review active sessions." checked={forms.security.deviceReview} onChange={() => updateForm('security', { deviceReview: !forms.security.deviceReview })} />
      </div>
      {renderSaveFooter('security')}
    </Panel>
  );

  const renderAccount = () => (
    <Panel title="Account" description="Manage login identity and data preferences." icon={User}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Username" value={forms.account.username} onChange={(event) => updateForm('account', { username: event.target.value })} error={errors.username} />
        <Input label="Recovery email" type="email" value={forms.account.recoveryEmail} onChange={(event) => updateForm('account', { recoveryEmail: event.target.value })} error={errors.recoveryEmail} />
      </div>
      <div className="mt-5 rounded-2xl border border-[rgba(0,0,0,0.05)] p-4">
        <ToggleRow title="Data sharing" description="Share anonymized usage data to improve Pulse AI." checked={forms.account.dataSharing} onChange={() => updateForm('account', { dataSharing: !forms.account.dataSharing })} />
        <ToggleRow title="Beta access" description="Enable early access to experimental features." checked={forms.account.betaAccess} onChange={() => updateForm('account', { betaAccess: !forms.account.betaAccess })} />
      </div>
      {renderSaveFooter('account')}
    </Panel>
  );

  const renderBilling = () => (
    <Panel title="Billing" description="Manage plan, invoices, and renewal preferences." icon={CreditCard}>
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-[rgba(233,162,76,0.18)] bg-gradient-to-r from-[rgba(233,162,76,0.1)] to-[rgba(215,185,142,0.05)] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-[#1F1F1F]">{forms.billing.plan} Plan</p>
          <p className="mt-1 text-xs text-[#999]">$19/month · Renews January 15, 2026</p>
        </div>
        <Badge variant="accent" size="md" dot>Active</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Plan" value={forms.billing.plan} options={['Starter', 'Pro', 'Team', 'Enterprise']} onChange={(value) => updateForm('billing', { plan: value })} />
        <Input label="Billing email" type="email" value={forms.billing.billingEmail} onChange={(event) => updateForm('billing', { billingEmail: event.target.value })} error={errors.billingEmail} />
        <Input label="Tax ID" value={forms.billing.taxId} onChange={(event) => updateForm('billing', { taxId: event.target.value })} />
      </div>
      <div className="mt-5 rounded-2xl border border-[rgba(0,0,0,0.05)] p-4">
        <ToggleRow title="Auto renew" description="Renew the current plan automatically." checked={forms.billing.autoRenew} onChange={() => updateForm('billing', { autoRenew: !forms.billing.autoRenew })} />
        <ToggleRow title="Invoice emails" description="Email invoices to the billing contact." checked={forms.billing.invoiceEmails} onChange={() => updateForm('billing', { invoiceEmails: !forms.billing.invoiceEmails })} />
      </div>
      {renderSaveFooter('billing')}
    </Panel>
  );

  const renderLanguage = () => (
    <Panel title="Language" description="Set localization, timezone, and regional preferences." icon={Globe}>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Language" value={forms.language.language} options={['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese']} onChange={(value) => updateForm('language', { language: value })} />
        <SelectField label="Region" value={forms.language.region} options={['United States', 'India', 'United Kingdom', 'Canada', 'Germany', 'Singapore']} onChange={(value) => updateForm('language', { region: value })} />
        <SelectField label="Timezone" value={forms.language.timezone} options={['Pacific Time', 'India Standard Time', 'UTC', 'Eastern Time', 'Central European Time']} onChange={(value) => updateForm('language', { timezone: value })} />
        <SelectField label="Currency" value={forms.language.currency} options={['USD', 'INR', 'EUR', 'GBP', 'CAD', 'SGD']} onChange={(value) => updateForm('language', { currency: value })} />
      </div>
      <div className="mt-5 rounded-2xl border border-[rgba(0,0,0,0.05)] p-4">
        <ToggleRow title="Auto translate" description="Translate shared content into my preferred language." checked={forms.language.autoTranslate} onChange={() => updateForm('language', { autoTranslate: !forms.language.autoTranslate })} />
      </div>
      {renderSaveFooter('language')}
    </Panel>
  );

  const renderProfile = () => (
    <Panel title="Profile" description="Edit profile fields shown across your workspace." icon={BadgeCheck}>
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[rgba(233,162,76,0.04)] p-4 sm:flex-row sm:items-center">
        <Avatar name={forms.profile.name} size="xl" online />
        <div>
          <p className="text-sm font-bold text-[#1F1F1F]">Profile picture</p>
          <p className="mt-1 text-xs text-[#999]">Avatar metadata is ready for future upload storage.</p>
          <Button variant="secondary" size="sm" className="mt-3">Change photo</Button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" value={forms.profile.name} onChange={(event) => updateForm('profile', { name: event.target.value })} error={errors.name} />
        <Input label="Email" type="email" value={forms.profile.email} onChange={(event) => updateForm('profile', { email: event.target.value })} error={errors.email} />
        <Input label="Company" value={forms.profile.company} onChange={(event) => updateForm('profile', { company: event.target.value })} error={errors.company} />
        <Input label="Role" value={forms.profile.role} onChange={(event) => updateForm('profile', { role: event.target.value })} error={errors.role} />
        <Input label="Location" value={forms.profile.location} onChange={(event) => updateForm('profile', { location: event.target.value })} />
      </div>
      <div className="mt-4">
        <TextAreaField label="Biography" value={forms.profile.biography} error={errors.biography} rows={5} onChange={(value) => updateForm('profile', { biography: value })} />
      </div>
      {renderSaveFooter('profile')}
    </Panel>
  );

  const renderTheme = () => (
    <Panel title="Theme" description="Control light mode, dark mode, system mode, and visual theme tokens." icon={Moon}>
      <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-[rgba(0,0,0,0.05)] p-4">
        <div>
          <p className="text-sm font-bold text-[#1F1F1F]">Current mode</p>
          <p className="mt-1 text-xs text-[#999]">{theme === 'system' ? `System (${resolvedTheme})` : theme}</p>
        </div>
        <Badge variant="accent" size="sm" dot>{resolvedTheme}</Badge>
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const selected = theme === option.id;
          return (
            <button key={option.id} type="button" onClick={() => { setTheme(option.id); setSaveState((current) => ({ ...current, theme: 'idle' })); }} className={cn('rounded-xl border-2 p-4 text-left transition-all focus-ring', selected ? 'border-[#E9A24C] bg-[rgba(233,162,76,0.06)] shadow-premium' : 'border-[rgba(0,0,0,0.06)] hover:border-[rgba(233,162,76,0.3)]')}>
              <div className="mb-3 flex justify-center gap-1.5">
                {option.colors.map((color) => <span key={color} className="h-5 w-5 rounded-full border border-white/70" style={{ background: color }} />)}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Icon size={13} className={selected ? 'text-[#E9A24C]' : 'text-[#999]'} aria-hidden="true" />
                <p className="text-center text-xs font-semibold text-[#1F1F1F]">{option.label}</p>
              </div>
              <p className="mt-1 text-center text-[10px] text-[#999]">{option.description}</p>
              {selected && <div className="mt-2 flex justify-center"><Check size={12} className="text-[#E9A24C]" strokeWidth={3} aria-hidden="true" /></div>}
            </button>
          );
        })}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Accent color" value={forms.theme.accentColor} options={['Amber', 'Blue', 'Purple', 'Green']} onChange={(value) => updateForm('theme', { accentColor: value })} />
        <SelectField label="Corner radius" value={forms.theme.cornerRadius} options={['Soft', 'Rounded', 'Pill']} onChange={(value) => updateForm('theme', { cornerRadius: value })} />
        <SelectField label="Contrast" value={forms.theme.contrast} options={['Balanced', 'High', 'Soft']} onChange={(value) => updateForm('theme', { contrast: value })} />
      </div>
      {renderSaveFooter('theme')}
    </Panel>
  );

  const renderSection = () => {
    if (activeSection === 'general') return renderGeneral();
    if (activeSection === 'appearance') return renderAppearance();
    if (activeSection === 'notifications') return renderNotifications();
    if (activeSection === 'security') return renderSecurity();
    if (activeSection === 'account') return renderAccount();
    if (activeSection === 'billing') return renderBilling();
    if (activeSection === 'language') return renderLanguage();
    if (activeSection === 'profile') return renderProfile();
    return renderTheme();
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-6xl p-4 pb-32 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="mb-1 text-2xl font-black tracking-tight text-[#1F1F1F]">Settings</h1>
            <p className="text-sm text-[#999]">Manage your account, profile, theme, billing, security, and preferences.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] px-3 py-2 shadow-card">
            <Sparkles size={15} className="text-[#E9A24C]" aria-hidden="true" />
            <span className="text-xs font-semibold text-[#666]">{isLoadingSettings ? 'Loading settings' : isUpdatingSettings ? 'Syncing' : 'MongoDB ready'}</span>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <motion.aside initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-6 lg:self-start">
            <div className="hidden rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-2 shadow-card lg:block">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;
                return (
                  <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} className={cn('mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150 focus-ring', active ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'text-[#666] hover:bg-[rgba(0,0,0,0.03)]')}>
                    <Icon size={16} className={active ? 'text-[#E9A24C]' : 'text-[#999]'} aria-hidden="true" />
                    <div className="min-w-0">
                      <span className={cn('block truncate text-sm', active ? 'font-bold' : 'font-medium')}>{section.label}</span>
                      <span className="block truncate text-[10px] text-[#999]">{section.description}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="overflow-x-auto pb-2 no-scrollbar lg:hidden">
              <div className="flex min-w-max gap-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.id;
                  return (
                    <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} className={cn('inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all focus-ring', active ? 'border-[rgba(233,162,76,0.35)] bg-[rgba(233,162,76,0.1)] text-[#E9A24C]' : 'border-[rgba(0,0,0,0.06)] bg-[#FFFDF8] text-[#666]')}>
                      <Icon size={13} aria-hidden="true" /> {section.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.aside>

          <main>
            <div className="mb-4 flex items-center gap-2">
              <ActiveSectionIcon size={16} className="text-[#E9A24C]" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#999]">{activeSectionMeta.label}</p>
            </div>
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
