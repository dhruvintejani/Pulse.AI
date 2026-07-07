import { motion } from 'framer-motion';
import { Check, Trash2, Settings } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    markAllRead,
    deleteNotification,
    isMarkingAllRead,
  } = useNotifications();

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="max-w-2xl mx-auto p-6 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-black text-[#1F1F1F] tracking-tight mb-1">Notifications</h1>
            <p className="text-sm text-[#999]">
              <Badge variant="accent" size="sm" dot>{unreadCount} unread</Badge>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Check size={14} />}
              loading={isMarkingAllRead}
              onClick={() => markAllRead()}
            >
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" icon={<Settings size={14} />}>Preferences</Button>
          </div>
        </motion.div>

        {isLoading && (
          <div className="glass-card rounded-2xl p-4 text-sm text-[#999]">Loading notifications...</div>
        )}

        {isError && (
          <div className="glass-card rounded-2xl p-4 text-sm text-red-500">Unable to load notifications.</div>
        )}

        {/* Notification list */}
        {!isLoading && !isError && (
          <div className="space-y-2">
            {notifications.map((notif, i) => {
              const Icon = notif.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 3 }}
                  className={`flex gap-4 p-4 rounded-2xl border transition-all duration-150 cursor-pointer group ${
                    notif.unread
                      ? 'bg-[rgba(233,162,76,0.04)] border-[rgba(233,162,76,0.15)] hover:border-[rgba(233,162,76,0.3)]'
                      : 'bg-[#FFFDF8] border-[rgba(0,0,0,0.05)] hover:border-[rgba(233,162,76,0.15)]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                    <Icon size={18} className={notif.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-[#1F1F1F] leading-tight">{notif.title}</p>
                      {notif.unread && (
                        <div className="w-2 h-2 rounded-full bg-[#E9A24C] shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-[#666] leading-relaxed mb-2">{notif.desc}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#BBB]">{notif.time}</span>
                      <button className="text-[11px] font-semibold text-[#E9A24C] hover:underline">{notif.action}</button>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 self-start"
                  >
                    <Trash2 size={13} className="text-[#CCC] hover:text-red-400" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state hint */}
        <div className="text-center mt-8">
          <p className="text-xs text-[#CCC]">You're all caught up! 🎉</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
