import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Bell, Shield, Cpu, Palette, Globe,
  ChevronRight, Check, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'ai', label: 'AI Preferences', icon: Cpu },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language & Region', icon: Globe },
];

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={cn(
      'relative w-10 h-5.5 h-[22px] rounded-full transition-all duration-300 focus:outline-none',
      checked ? 'bg-[#E9A24C]' : 'bg-[rgba(0,0,0,0.12)]'
    )}
  >
    <motion.div
      animate={{ x: checked ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
    />
  </button>
);

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    newModel: true,
    mentions: true,
  });
  const [aiPrefs, setAiPrefs] = useState({
    streaming: true,
    suggestions: true,
    codeHighlight: true,
    autoTitle: true,
    memory: false,
  });
  const [selectedTheme, setSelectedTheme] = useState('warm');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto p-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Settings</h1>
          <p className="text-sm text-[#999]">Manage your account and workspace preferences</p>
        </motion.div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-52 shrink-0 hidden md:block"
          >
            <div className="bg-[#FFFDF8] rounded-2xl p-2 border border-[rgba(0,0,0,0.05)] shadow-card">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left mb-0.5',
                      active
                        ? 'bg-[rgba(233,162,76,0.1)] text-[#E9A24C]'
                        : 'text-[#666] hover:bg-[rgba(0,0,0,0.03)]'
                    )}
                  >
                    <Icon size={16} className={active ? 'text-[#E9A24C]' : 'text-[#999]'} />
                    <span className={cn('text-sm', active ? 'font-bold' : 'font-medium')}>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex-1 space-y-4"
          >
            {activeSection === 'profile' && (
              <>
                <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card">
                  <h2 className="text-sm font-bold text-[#1F1F1F] mb-5">Personal Information</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar name="Alex Morgan" size="xl" />
                    <div>
                      <Button variant="secondary" size="sm">Change photo</Button>
                      <p className="text-xs text-[#CCC] mt-1.5">JPG, PNG or GIF. Max 4MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First name" defaultValue="Alex" />
                    <Input label="Last name" defaultValue="Morgan" />
                    <div className="col-span-2">
                      <Input label="Email address" type="email" defaultValue="alex@company.com" />
                    </div>
                    <div className="col-span-2">
                      <Input label="Company" defaultValue="Acme Corp" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#1F1F1F] mb-1.5">Bio</label>
                      <textarea
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-[#999] resize-none"
                        rows={3}
                        defaultValue="Product leader passionate about AI and design systems."
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Button variant="primary">Save changes</Button>
                  </div>
                </div>

                <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-[#1F1F1F]">Plan & Billing</h2>
                      <p className="text-xs text-[#999] mt-1">You're on the <strong>Pro plan</strong></p>
                    </div>
                    <Badge variant="accent" size="md" dot>Pro Active</Badge>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[rgba(233,162,76,0.08)] to-[rgba(215,185,142,0.05)] border border-[rgba(233,162,76,0.15)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#1F1F1F]">$19/month</p>
                        <p className="text-xs text-[#999]">Renews January 15, 2026</p>
                      </div>
                      <Button variant="outline" size="sm">Manage billing</Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card">
                <h2 className="text-sm font-bold text-[#1F1F1F] mb-5">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                    { key: 'push', label: 'Push notifications', desc: 'Browser & mobile alerts' },
                    { key: 'weekly', label: 'Weekly digest', desc: 'Weekly usage summary' },
                    { key: 'newModel', label: 'New AI models', desc: 'When new models are available' },
                    { key: 'mentions', label: 'Team mentions', desc: 'When someone mentions you' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.04)] last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-[#1F1F1F]">{item.label}</p>
                        <p className="text-xs text-[#999] mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="space-y-4">
                <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card">
                  <h2 className="text-sm font-bold text-[#1F1F1F] mb-4">Default AI Model</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'gpt-4o', name: 'GPT-4o', desc: 'Best reasoning', color: '#E9A24C' },
                      { id: 'claude-35', name: 'Claude 3.5', desc: 'Best writing', color: '#8B5CF6' },
                      { id: 'gemini-pro', name: 'Gemini Pro', desc: 'Best analysis', color: '#3B82F6' },
                      { id: 'llama-3', name: 'Llama 3', desc: 'Fastest', color: '#F59E0B' },
                    ].map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left',
                          selectedModel === model.id
                            ? 'border-[rgba(233,162,76,0.4)] bg-[rgba(233,162,76,0.06)]'
                            : 'border-[rgba(0,0,0,0.06)] hover:border-[rgba(233,162,76,0.2)]'
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${model.color}18` }}>
                          <Sparkles size={14} style={{ color: model.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1F1F1F]">{model.name}</p>
                          <p className="text-xs text-[#999]">{model.desc}</p>
                        </div>
                        {selectedModel === model.id && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-[#E9A24C] flex items-center justify-center">
                            <Check size={11} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card">
                  <h2 className="text-sm font-bold text-[#1F1F1F] mb-5">Chat Settings</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'streaming', label: 'Streaming responses', desc: 'Show AI responses as they generate' },
                      { key: 'suggestions', label: 'Smart suggestions', desc: 'Show prompt suggestions based on context' },
                      { key: 'codeHighlight', label: 'Code highlighting', desc: 'Syntax highlighting in code blocks' },
                      { key: 'autoTitle', label: 'Auto-title chats', desc: 'Automatically name conversations' },
                      { key: 'memory', label: 'Memory (Beta)', desc: 'Remember context across conversations' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-[rgba(0,0,0,0.04)] last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-[#1F1F1F]">{item.label}</p>
                          <p className="text-xs text-[#999] mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle
                          checked={aiPrefs[item.key as keyof typeof aiPrefs]}
                          onChange={() => setAiPrefs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof aiPrefs] }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card">
                <h2 className="text-sm font-bold text-[#1F1F1F] mb-5">Theme</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'warm', label: 'Warm', colors: ['#F8F4EC', '#E9A24C', '#1F1F1F'] },
                    { id: 'cool', label: 'Cool', colors: ['#F0F4F8', '#3B82F6', '#1E293B'] },
                    { id: 'dark', label: 'Dark', colors: ['#1F1F1F', '#E9A24C', '#FFFFFF'] },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all',
                        selectedTheme === theme.id
                          ? 'border-[#E9A24C] shadow-premium'
                          : 'border-[rgba(0,0,0,0.06)] hover:border-[rgba(233,162,76,0.3)]'
                      )}
                    >
                      <div className="flex gap-1.5 mb-3 justify-center">
                        {theme.colors.map((color, i) => (
                          <div key={i} className="w-5 h-5 rounded-full" style={{ background: color }} />
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-[#1F1F1F] text-center">{theme.label}</p>
                      {selectedTheme === theme.id && (
                        <div className="flex justify-center mt-2">
                          <Check size={12} className="text-[#E9A24C]" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-bold text-[#1F1F1F] mb-3">Font Size</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#999]">A</span>
                    <div className="flex-1 relative h-1.5 bg-[rgba(0,0,0,0.08)] rounded-full">
                      <div className="absolute left-[60%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E9A24C] shadow-premium-sm cursor-pointer" />
                      <div className="h-full w-[60%] bg-[#E9A24C] rounded-full" />
                    </div>
                    <span className="text-base text-[#999]">A</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#CCC] mt-1 px-5">
                    {['Small', 'Default', 'Large', 'XL'].map(s => <span key={s}>{s}</span>)}
                  </div>
                </div>
              </div>
            )}

            {(activeSection === 'security' || activeSection === 'language') && (
              <div className="bg-[#FFFDF8] rounded-2xl p-6 border border-[rgba(0,0,0,0.05)] shadow-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(233,162,76,0.1)] flex items-center justify-center mb-4">
                    <Sparkles size={24} className="text-[#E9A24C]" />
                  </div>
                  <h3 className="text-base font-bold text-[#1F1F1F] mb-2">
                    {activeSection === 'security' ? 'Security Settings' : 'Language & Region'}
                  </h3>
                  <p className="text-sm text-[#999] max-w-xs leading-relaxed">
                    {activeSection === 'security'
                      ? 'Manage 2FA, API keys, sessions, and security logs.'
                      : 'Configure language, timezone, date format, and currency preferences.'
                    }
                  </p>
                  <Button variant="primary" size="md" className="mt-5">
                    Configure <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
