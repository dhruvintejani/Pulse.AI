import { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  Bell,
  CreditCard,
  Users,
  Sparkles,
  ChevronRight,
  Plus,
  Hash,
  Star,
  Clock,
  Layers,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DASHBOARD_PATHS } from '@/constants/routes';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNotifications } from '@/hooks/useNotifications';
import { useConversations, useRecentChats } from '@/hooks/useChatHistory';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

type DashboardNavPath = (typeof DASHBOARD_PATHS)[keyof typeof DASHBOARD_PATHS];

interface SidebarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: DashboardNavPath;
  badge: string;
}

const mainNav: SidebarNavItem[] = [
  { id: 'chat', label: 'AI Chat', icon: MessageSquare, path: DASHBOARD_PATHS.CHAT, badge: '' },
  { id: 'documents', label: 'Documents', icon: FileText, path: DASHBOARD_PATHS.DOCUMENTS, badge: '' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: DASHBOARD_PATHS.ANALYTICS, badge: '' },
  { id: 'workspace', label: 'Workspace', icon: Layers, path: DASHBOARD_PATHS.WORKSPACE, badge: '' },
  { id: 'models', label: 'AI Models', icon: Cpu, path: DASHBOARD_PATHS.MODELS, badge: 'New' },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed, closeMobileSidebar } = useSidebar();
  const { currentUser } = useCurrentUser();
  const { unreadCount } = useNotifications();
  const { recentChats } = useRecentChats();
  const { createConversation, setActiveConversation } = useConversations();

  const secondaryNav = useMemo<SidebarNavItem[]>(() => {
    const items: SidebarNavItem[] = [
      {
        id: 'notifications',
        label: 'Notifications',
        icon: Bell,
        path: DASHBOARD_PATHS.NOTIFICATIONS,
        badge: unreadCount ? String(unreadCount) : '',
      },
      { id: 'billing', label: 'Billing', icon: CreditCard, path: DASHBOARD_PATHS.BILLING, badge: '' },
      { id: 'team', label: 'Team', icon: Users, path: DASHBOARD_PATHS.TEAM, badge: '' },
      { id: 'settings', label: 'Settings', icon: Settings, path: DASHBOARD_PATHS.SETTINGS, badge: '' },
    ];

    if (currentUser?.isAdmin) {
      items.splice(3, 0, {
        id: 'admin',
        label: 'Admin',
        icon: ShieldCheck,
        path: DASHBOARD_PATHS.ADMIN,
        badge: 'Admin',
      });
    }

    return items;
  }, [currentUser?.isAdmin, unreadCount]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);
  const displayName = useMemo(() => currentUser?.fullName || 'Alex Morgan', [currentUser?.fullName]);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
      closeMobileSidebar();
    },
    [closeMobileSidebar, navigate]
  );

  const handleNewConversation = useCallback(() => {
    void createConversation().then(() => {
      navigate(DASHBOARD_PATHS.CHAT);
      closeMobileSidebar();
    });
  }, [closeMobileSidebar, createConversation, navigate]);

  const handleRecentChatClick = useCallback(
    (chatId: string) => {
      void setActiveConversation(chatId).then(() => {
        navigate(DASHBOARD_PATHS.CHAT);
        closeMobileSidebar();
      });
    },
    [closeMobileSidebar, navigate, setActiveConversation]
  );

  const handleProfileClick = useCallback(() => {
    navigate(DASHBOARD_PATHS.PROFILE);
    closeMobileSidebar();
  }, [closeMobileSidebar, navigate]);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      aria-label="Dashboard sidebar"
      className={cn(
        'flex flex-col h-full bg-[#FFFDF8] border-r border-[rgba(0,0,0,0.06)]',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(0,0,0,0.05)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shadow-premium-sm shrink-0">
          <Sparkles size={16} className="text-white" aria-hidden="true" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[#1F1F1F] tracking-tight truncate">Pulse AI</span>
            <span className="text-[10px] text-[#999] font-medium truncate">Workspace</span>
          </motion.div>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <button
            type="button"
            onClick={handleNewConversation}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#E9A24C] to-[#D4853A] text-white text-sm font-medium hover:shadow-premium transition-all duration-200 hover:-translate-y-0.5 focus-ring"
          >
            <Plus size={15} aria-hidden="true" />
            New Conversation
          </button>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-0.5" aria-label="Dashboard sections">
        {mainNav.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              onClick={() => handleNavigate(item.path)}
              whileHover={{ x: 2 }}
              className={cn(
                'sidebar-item w-full flex items-center gap-3 px-3 py-2.5 text-left focus-ring',
                active ? 'active' : 'text-[#666]'
              )}
            >
              <Icon size={17} className={cn('shrink-0', active ? 'text-[#E9A24C]' : 'text-[#999]')} aria-hidden="true" />
              {!collapsed && (
                <>
                  <span className={cn('text-sm flex-1 truncate', active ? 'font-semibold text-[#1F1F1F]' : 'font-medium')}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <Badge variant={item.badge === 'New' ? 'accent' : 'neutral'} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </motion.button>
          );
        })}

        {!collapsed && (
          <div className="pt-4" aria-label="Recent chats">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-semibold text-[#999] uppercase tracking-widest">Recent</span>
              <button type="button" aria-label="View starred chats" className="text-[#999] hover:text-[#E9A24C] transition-colors focus-ring rounded-md">
                <Star size={12} aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-0.5">
              {recentChats.map((chat) => (
                <motion.button
                  key={chat.id}
                  type="button"
                  aria-label={`Open ${chat.title}`}
                  onClick={() => handleRecentChatClick(chat.id)}
                  whileHover={{ x: 2 }}
                  className="sidebar-item w-full flex items-center gap-2.5 px-3 py-2 text-left focus-ring"
                >
                  <Hash size={13} className="text-[#CCC] shrink-0" aria-hidden="true" />
                  <span className="text-xs text-[#666] flex-1 truncate">{chat.title}</span>
                  <span className="text-[10px] text-[#BBB] shrink-0 flex items-center gap-0.5">
                    <Clock size={10} aria-hidden="true" />
                    {chat.time}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="my-3 mx-3 border-t border-[rgba(0,0,0,0.05)]" />

        {secondaryNav.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              type="button"
              aria-label={item.badge && item.id === 'notifications' ? `${item.label}, ${item.badge} unread` : item.label}
              aria-current={active ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
              onClick={() => handleNavigate(item.path)}
              whileHover={{ x: 2 }}
              className={cn(
                'sidebar-item w-full flex items-center gap-3 px-3 py-2.5 text-left focus-ring',
                active ? 'active' : 'text-[#666]'
              )}
            >
              <div className="relative shrink-0">
                <Icon size={17} className={cn(active ? 'text-[#E9A24C]' : 'text-[#999]')} aria-hidden="true" />
                {item.badge && item.id === 'notifications' && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#E9A24C] text-white text-[9px] font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <>
                  <span className={cn('text-sm flex-1 truncate', active ? 'font-semibold text-[#1F1F1F]' : 'font-medium')}>
                    {item.label}
                  </span>
                  {item.id === 'admin' ? (
                    <Badge variant="accent" size="sm">
                      Admin
                    </Badge>
                  ) : (
                    <ChevronRight size={14} className="text-[#CCC]" aria-hidden="true" />
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={handleProfileClick}
          aria-label={`Open profile for ${displayName}`}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[rgba(233,162,76,0.06)] transition-all duration-200 focus-ring"
        >
          <Avatar src={currentUser?.imageUrl} name={displayName} size="sm" online={true} />
          {!collapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-[#1F1F1F] truncate">{displayName}</p>
              <p className="text-[11px] text-[#999] truncate">Pro Plan</p>
            </div>
          )}
          {!collapsed && (
            <div className="shrink-0">
              <Badge variant="accent" size="sm">
                Pro
              </Badge>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default memo(DashboardSidebar);
