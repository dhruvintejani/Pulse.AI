import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  Bot,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogIn,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import EmptyState from '@/components/ui/EmptyState';
import { DASHBOARD_PATHS, ROUTES } from '@/constants/routes';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  keywords: string;
  shortcut?: string;
  icon: typeof Search;
  run: () => void;
}

const CommandPalette = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut(
    (event) => (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k',
    () => setOpen((current) => !current),
    { ignoreInputFields: false }
  );

  useKeyboardShortcut(
    (event) => event.key === '?' && !event.shiftKey,
    () => setOpen(true)
  );

  const commands = useMemo<CommandItem[]>(() => [
    { id: 'home', label: 'Open landing page', description: 'Go to the public marketing website.', keywords: 'home landing public website', shortcut: 'G H', icon: Home, run: () => navigate(ROUTES.HOME) },
    { id: 'dashboard', label: 'Open dashboard', description: 'Return to your AI workspace overview.', keywords: 'dashboard overview home analytics usage', shortcut: 'G D', icon: LayoutDashboard, run: () => navigate(DASHBOARD_PATHS.ROOT) },
    { id: 'chat', label: 'Open AI chat', description: 'Start or continue an intelligent conversation.', keywords: 'chat assistant conversation prompt ai', shortcut: 'G C', icon: Bot, run: () => navigate(DASHBOARD_PATHS.CHAT) },
    { id: 'documents', label: 'Open documents', description: 'Search, upload, preview, and analyze files.', keywords: 'documents upload files pdf docx csv', shortcut: 'G F', icon: FileText, run: () => navigate(DASHBOARD_PATHS.DOCUMENTS) },
    { id: 'analytics', label: 'Open analytics', description: 'Review usage, charts, and productivity insights.', keywords: 'analytics charts metrics usage', shortcut: 'G A', icon: BarChart3, run: () => navigate(DASHBOARD_PATHS.ANALYTICS) },
    { id: 'notifications', label: 'Open notifications', description: 'Manage alerts, unread items, and preferences.', keywords: 'notifications alerts unread inbox', shortcut: 'G N', icon: Bell, run: () => navigate(DASHBOARD_PATHS.NOTIFICATIONS) },
    { id: 'settings', label: 'Open settings', description: 'Manage account, appearance, security, and theme.', keywords: 'settings preferences account theme security', shortcut: 'G S', icon: Settings, run: () => navigate(DASHBOARD_PATHS.SETTINGS) },
    { id: 'profile', label: 'Open profile', description: 'Edit your profile, skills, and activity.', keywords: 'profile account activity social links', shortcut: 'G P', icon: User, run: () => navigate(DASHBOARD_PATHS.PROFILE) },
    { id: 'team', label: 'Open team', description: 'Review collaborators and workspace members.', keywords: 'team members collaborators workspace', icon: Users, run: () => navigate(DASHBOARD_PATHS.TEAM) },
    { id: 'billing', label: 'Open billing', description: 'Manage plan, usage, and invoices.', keywords: 'billing plan invoice subscription payment', icon: CreditCard, run: () => navigate(DASHBOARD_PATHS.BILLING) },
    { id: 'toggle-theme', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', description: 'Toggle the app appearance instantly.', keywords: 'theme appearance dark light mode', shortcut: '⌘ J', icon: theme === 'dark' ? Sun : Moon, run: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
    { id: 'signin', label: 'Open sign in', description: 'Go to the authentication screen.', keywords: 'login sign in authentication', icon: LogIn, run: () => navigate(ROUTES.LOGIN) },
  ], [navigate, setTheme, theme]);

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => `${command.label} ${command.description} ${command.keywords}`.toLowerCase().includes(normalized));
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 80);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runCommand = (command: CommandItem) => {
    command.run();
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % Math.max(filteredCommands.length, 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + Math.max(filteredCommands.length, 1)) % Math.max(filteredCommands.length, 1));
    } else if (event.key === 'Enter' && filteredCommands[activeIndex]) {
      event.preventDefault();
      runCommand(filteredCommands[activeIndex]);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Jump anywhere, run actions, and move faster with keyboard shortcuts."
      size="lg"
      className="overflow-visible"
    >
      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">Search commands</span>
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-color-subtle)]" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            type="search"
            placeholder="Search commands, pages, settings..."
            aria-activedescendant={filteredCommands[activeIndex]?.id ? `command-${filteredCommands[activeIndex].id}` : undefined}
            className="ds-control w-full py-3 pl-10 pr-10 text-sm font-semibold placeholder:text-[var(--ds-color-subtle)]"
          />
          {query && (
            <button type="button" aria-label="Clear command search" onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--ds-color-subtle)] hover:bg-[var(--ds-color-accent-soft)] ds-focus-ring">
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="flex flex-wrap gap-2" aria-label="Command shortcuts">
          <Badge variant="accent" size="sm">⌘K command</Badge>
          <Badge variant="neutral" size="sm">? shortcuts</Badge>
          <Badge variant="neutral" size="sm">↑↓ navigate</Badge>
          <Badge variant="neutral" size="sm">Enter run</Badge>
        </div>

        <div className="max-h-[22rem] overflow-y-auto pr-1 ds-scrollbar" role="listbox" aria-label="Available commands">
          <AnimatePresence mode="popLayout">
            {filteredCommands.length ? (
              filteredCommands.map((command, index) => {
                const Icon = command.icon;
                const active = index === activeIndex;
                return (
                  <motion.button
                    id={`command-${command.id}`}
                    key={command.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runCommand(command)}
                    className={cn('mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ds-focus-ring', active ? 'bg-[var(--ds-color-accent-soft)]' : 'hover:bg-[var(--ds-color-surface-muted)]')}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--ds-color-surface)] text-[var(--ds-color-accent)] shadow-[var(--ds-shadow-xs)]">
                      <Icon size={17} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-[var(--ds-color-text)]">{command.label}</p>
                      <p className="truncate text-xs text-[var(--ds-color-subtle)]">{command.description}</p>
                    </div>
                    {command.shortcut && <kbd className="shrink-0 rounded-lg border border-[var(--ds-color-border)] px-2 py-1 text-[10px] font-black text-[var(--ds-color-subtle)]">{command.shortcut}</kbd>}
                  </motion.button>
                );
              })
            ) : (
              <EmptyState title="No commands found" description="Try searching for a page, setting, or workspace action." icon={<Sparkles size={18} />} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(CommandPalette);
