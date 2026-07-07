import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Settings, Search } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';
import type { NotificationType } from '@/types/notification';

const notificationFilters: Array<{ label: string; value: 'all' | 'unread' | NotificationType }> = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'AI', value: 'ai' },
  { label: 'Documents', value: 'doc' },
  { label: 'Billing', value: 'billing' },
];

const NotificationsPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    markAllRead,
    deleteNotification,
    isMarkingAllRead,
  } = useNotifications();

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return notifications.filter((notification) => {
      const matchesSearch = !normalizedSearch || `${notification.title} ${notification.desc} ${notification.action}`.toLowerCase().includes(normalizedSearch);
      const matchesFilter = filter === 'all' || (filter === 'unread' ? notification.unread : notification.type === filter);
      return matchesSearch && matchesFilter;
    });
  }, [filter, notifications, search]);

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-2xl mx-auto p-6 pb-32">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Notifications</h1>
            <p className="text-sm text-[#999]"><Badge variant="accent" size="sm" dot>{unreadCount} unread</Badge></p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Check size={14} />} loading={isMarkingAllRead} onClick={() => markAllRead()}>Mark all read</Button>
            <Button variant="ghost" size="sm" icon={<Settings size={14} />}>Preferences</Button>
          </div>
        </motion.div>

        <div className="bg-[#FFFDF8] rounded-2xl p-3 border border-[rgba(0,0,0,0.05)] shadow-card mb-4">
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCC]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.06)] text-[#1F1F1F] placeholder:text-[#CCC] outline-none focus:border-[rgba(233,162,76,0.4)]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {notificationFilters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${filter === item.value ? 'bg-[rgba(233,162,76,0.12)] text-[#E9A24C]' : 'text-[#999] hover:bg-[rgba(0,0,0,0.04)]'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)}
          </div>
        )}

        {isError && <div className="glass-card rounded-2xl p-4 text-sm text-red-500">Unable to load notifications.</div>}

        {!isLoading && !isError && filteredNotifications.length > 0 && (
          <div className="space-y-2">
            {filteredNotifications.map((notif, i) => {
              const Icon = notif.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 3 }}
                  className={`flex gap-4 p-4 rounded-2xl border transition-all duration-150 cursor-pointer group ${notif.unread ? 'bg-[rgba(233,162,76,0.04)] border-[rgba(233,162,76,0.15)] hover:border-[rgba(233,162,76,0.3)]' : 'bg-[#FFFDF8] border-[rgba(0,0,0,0.05)] hover:border-[rgba(233,162,76,0.15)]'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg}`}><Icon size={18} className={notif.iconColor} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-[#1F1F1F] leading-tight">{notif.title}</p>
                      {notif.unread && <div className="w-2 h-2 rounded-full bg-[#E9A24C] shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-[#666] leading-relaxed mb-2">{notif.desc}</p>
                    <div className="flex items-center gap-3"><span className="text-[11px] text-[#BBB]">{notif.time}</span><button className="text-[11px] font-semibold text-[#E9A24C] hover:underline">{notif.action}</button></div>
                  </div>
                  <button onClick={() => deleteNotification(notif.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 self-start"><Trash2 size={13} className="text-[#CCC] hover:text-red-400" /></button>
                </motion.div>
              );
            })}
          </div>
        )}

        {!isLoading && !isError && filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-[#FFFDF8] rounded-2xl border border-[rgba(0,0,0,0.05)] shadow-card">
            <p className="text-sm font-bold text-[#1F1F1F]">You're all caught up</p>
            <p className="text-xs text-[#999] mt-1">No notifications match the current search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
