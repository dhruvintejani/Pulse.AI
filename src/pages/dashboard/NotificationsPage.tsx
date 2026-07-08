import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, CheckCircle2, Filter, Inbox, Search, Settings, Sparkles, Trash2, X } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ContextMenu from '@/components/ui/ContextMenu';
import EmptyState from '@/components/ui/EmptyState';
import { useConfirmation } from '@/contexts/ConfirmationContext';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import type { AppNotification, NotificationPriority, NotificationType } from '@/types/notification';

type NotificationFilter = 'all' | 'unread' | NotificationType;

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';

const notificationFilters: Array<{ label: string; value: NotificationFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'AI', value: 'ai' },
  { label: 'Chats', value: 'chat' },
  { label: 'Documents', value: 'doc' },
  { label: 'Workspace', value: 'team' },
  { label: 'System', value: 'system' },
  { label: 'Billing', value: 'billing' },
];

const priorityVariant: Record<NotificationPriority, BadgeVariant> = {
  high: 'error',
  medium: 'warning',
  low: 'neutral',
};

const typeLabels: Record<NotificationType, string> = {
  ai: 'AI',
  chat: 'Chat',
  doc: 'Document',
  team: 'Workspace',
  system: 'System',
  billing: 'Billing',
};

const NotificationCard = ({
  notification,
  index,
  onMarkRead,
  onDelete,
}: {
  notification: AppNotification;
  index: number;
  onMarkRead: (notificationId: string) => void;
  onDelete: (notificationId: string) => void;
}) => {
  const Icon = notification.icon;

  return (
    <ContextMenu
      label={`${notification.title} actions`}
      items={[
        {
          id: 'read',
          label: notification.unread ? 'Mark as read' : 'Already read',
          icon: <CheckCircle2 size={14} />,
          disabled: !notification.unread,
          onSelect: () => onMarkRead(notification.id),
        },
        {
          id: 'delete',
          label: 'Delete notification',
          icon: <Trash2 size={14} />,
          destructive: true,
          onSelect: () => onDelete(notification.id),
        },
      ]}
    >
      <motion.article
        layout
        initial={{ opacity: 0, x: -18, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 18, scale: 0.98 }}
        transition={{ delay: index * 0.035, duration: 0.24 }}
        whileHover={{ y: -2, x: 2 }}
        className={cn(
          'group relative overflow-hidden rounded-2xl border p-4 shadow-card transition-all duration-200',
          notification.unread
            ? 'border-[rgba(233,162,76,0.2)] bg-[rgba(233,162,76,0.06)]'
            : 'border-[rgba(0,0,0,0.05)] bg-[#FFFDF8]'
        )}
      >
        {notification.unread && <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#E9A24C] to-[#D4853A]" aria-hidden="true" />}
        <div className="flex gap-3 sm:gap-4">
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', notification.iconBg)}>
            <Icon size={19} className={notification.iconColor} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-black leading-tight text-[#1F1F1F]">{notification.title}</h2>
                  {notification.unread && <span className="h-2 w-2 rounded-full bg-[#E9A24C] shadow-[0_0_0_4px_rgba(233,162,76,0.12)]" aria-label="Unread" />}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge variant="accent" size="sm">{notification.category}</Badge>
                  <Badge variant={priorityVariant[notification.priority]} size="sm">{notification.priority}</Badge>
                  <span className="text-[11px] text-[#BBB]">{notification.time}</span>
                </div>
              </div>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-[#666]">{notification.desc}</p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <button type="button" className="rounded-md text-xs font-bold text-[#E9A24C] transition-colors hover:text-[#D4853A] hover:underline focus-ring">
                {notification.action}
              </button>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                {notification.unread && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(notification.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#666] transition-colors hover:bg-[rgba(233,162,76,0.08)] hover:text-[#E9A24C] focus-ring"
                  >
                    <CheckCircle2 size={12} aria-hidden="true" /> Mark read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(notification.id)}
                  aria-label={`Delete ${notification.title}`}
                  className="rounded-lg p-1.5 text-[#CCC] transition-colors hover:bg-red-50 hover:text-red-400 focus-ring"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </ContextMenu>
  );
};

const NotificationsPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | NotificationPriority>('all');
  const { confirm } = useConfirmation();
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    markRead,
    markAllRead,
    deleteNotification,
    clearAll,
    isMarkingAllRead,
    isClearingAll,
  } = useNotifications();

  const categoryCounts = useMemo(() => {
    const counts: Record<NotificationFilter, number> = {
      all: notifications.length,
      unread: notifications.filter((notification) => notification.unread).length,
      ai: 0,
      chat: 0,
      doc: 0,
      team: 0,
      system: 0,
      billing: 0,
    };

    notifications.forEach((notification) => {
      counts[notification.type] += 1;
    });

    return counts;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return notifications.filter((notification) => {
      const searchable = `${notification.title} ${notification.desc} ${notification.action} ${notification.category} ${typeLabels[notification.type]}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
      const matchesType = filter === 'all' || (filter === 'unread' ? notification.unread : notification.type === filter);
      const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
      return matchesSearch && matchesType && matchesPriority;
    });
  }, [filter, notifications, priorityFilter, search]);

  const hasNotifications = notifications.length > 0;

  const confirmDelete = useCallback(async (notificationId: string) => {
    const target = notifications.find((notification) => notification.id === notificationId);
    const confirmed = await confirm({
      title: 'Delete notification?',
      description: target ? `Delete “${target.title}”? You can undo immediately after deletion.` : 'Delete this notification? You can undo immediately after deletion.',
      confirmLabel: 'Delete',
      tone: 'danger',
    });
    if (confirmed) deleteNotification(notificationId);
  }, [confirm, deleteNotification, notifications]);

  const confirmClearAll = useCallback(async () => {
    const confirmed = await confirm({
      title: 'Clear all notifications?',
      description: 'This removes every notification from the center. You will have a short undo window.',
      confirmLabel: 'Clear all',
      tone: 'danger',
    });
    if (confirmed) clearAll();
  }, [clearAll, confirm]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="mx-auto max-w-5xl p-4 pb-32 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-[#1F1F1F]">Notification Center</h1>
              {unreadCount > 0 && (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#E9A24C] px-2 py-0.5 text-xs font-black text-white shadow-premium-sm" aria-label={`${unreadCount} unread notifications`}>
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-[#999]">Search, filter, read, and manage workspace alerts with optimistic updates and undo.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Check size={14} />} loading={isMarkingAllRead} disabled={!unreadCount} onClick={() => markAllRead()}>Mark all read</Button>
            <Button variant="ghost" size="sm" icon={<Trash2 size={14} />} loading={isClearingAll} disabled={!hasNotifications} onClick={() => void confirmClearAll()}>Clear all</Button>
            <Button variant="ghost" size="sm" icon={<Settings size={14} />}>Preferences</Button>
          </div>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="mb-5 rounded-3xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-4 shadow-card">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CCC]" aria-hidden="true" />
              <label className="sr-only" htmlFor="notification-search">Search notifications</label>
              <input
                id="notification-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Search notifications, actions, categories..."
                className="w-full rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.03)] py-3 pl-10 pr-10 text-sm text-[#1F1F1F] outline-none placeholder:text-[#CCC] transition-colors focus:border-[rgba(233,162,76,0.4)]"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#CCC] hover:text-[#666] focus-ring">
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.03)] px-3 py-2.5">
                <Filter size={13} className="text-[#E9A24C]" aria-hidden="true" />
                <label className="sr-only" htmlFor="priority-filter">Filter by priority</label>
                <select id="priority-filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as 'all' | NotificationPriority)} className="bg-transparent text-xs font-semibold text-[#666] outline-none">
                  <option value="all">All priority</option>
                  <option value="high">High priority</option>
                  <option value="medium">Medium priority</option>
                  <option value="low">Low priority</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="Notification categories">
            {notificationFilters.map((item) => {
              const active = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.value)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all focus-ring',
                    active ? 'bg-[rgba(233,162,76,0.12)] text-[#E9A24C]' : 'text-[#999] hover:bg-[rgba(0,0,0,0.04)] hover:text-[#666]'
                  )}
                >
                  {item.label}
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[10px]', active ? 'bg-[#E9A24C] text-white' : 'bg-[rgba(0,0,0,0.05)] text-[#999]')}>
                    {categoryCounts[item.value]}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.section>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total', value: notifications.length, icon: Bell },
            { label: 'Unread', value: unreadCount, icon: Inbox },
            { label: 'High priority', value: notifications.filter((item) => item.priority === 'high').length, icon: Sparkles },
            { label: 'Categories', value: notificationFilters.length - 2, icon: Filter },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + index * 0.04 }} className="rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] p-4 shadow-card">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(233,162,76,0.1)]">
                  <Icon size={16} className="text-[#E9A24C]" aria-hidden="true" />
                </div>
                <p className="text-xl font-black text-[#1F1F1F]">{stat.value}</p>
                <p className="text-xs font-medium text-[#999]">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {isLoading && (
          <div className="space-y-3" aria-label="Loading notifications">
            {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-32 rounded-2xl" />)}
          </div>
        )}

        {isError && <div className="glass-card rounded-2xl p-4 text-sm text-red-500" role="alert">Unable to load notifications.</div>}

        {!isLoading && !isError && filteredNotifications.length > 0 && (
          <motion.div layout className="space-y-3">
            <AnimatePresence initial={false}>
              {filteredNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  index={index}
                  onMarkRead={(notificationId) => markRead(notificationId)}
                  onDelete={(notificationId) => void confirmDelete(notificationId)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && !isError && filteredNotifications.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[rgba(0,0,0,0.05)] bg-[#FFFDF8] px-6 py-14 text-center shadow-card">
            <EmptyState title="You're all caught up" description="No notifications match the current search, category, or priority filter." icon={<Inbox size={24} />} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
