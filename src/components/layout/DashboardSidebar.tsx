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
} from 'lucide-react';
import { DASHBOARD_PATHS } from '@/constants/routes';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNotifications } from '@/hooks/useNotifications';
import { useConversations, useRecentChats } from '@/hooks/useChatHistory';
import { useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const mainNav = [
  { id: 'chat', label: 'AI Chat', icon: MessageSquare, path: DASHBOARD_PATHS.CHAT, badge: '' },
  { id: 'documents', label: 'Documents', icon: FileText, path: DASHBOARD_PATHS.DOCUMENTS, badge: '' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: DASHBOARD_PATHS.ANALYTICS, badge: '' },
  { id: 'workspace', label: 'Workspace', icon: Layers, path: DASHBOARD_PATHS.WORKSPACE, badge: '' },
  { id: 'models', label: 'AI Models', icon: Cpu, path: DASHBOARD_PATHS.MODELS, badge: 'New' },
];

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed } = useSidebar();
  const { currentUser } = useCurrentUser();
  const { unreadCount } = useNotifications();
  const { recentChats } = useRecentChats();
  const { createConversation, setActiveConversation } = useConversations();

  const secondaryNav = [
    { id: 'notifications', label: 'Notifications', icon: Bell, path: DASHBOARD_PATHS.NOTIFICATIONS, badge: unreadCount ? String(unreadCount) : '' },
    { id: 'billing', label: 'Billing', icon: CreditCard, path: DASHBOARD_PATHS.BILLING, badge: '' },
    { id: 'team', label: 'Team', icon: Users, path: DASHBOARD_PATHS.TEAM, badge: '' },
    { id: 'settings', label: 'Settings', icon: Settings, path: DASHBOARD_PATHS.SETTINGS, badge: '' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const displayName = currentUser?.fullName || 'Alex Morgan';

  const handleNewConversation = () => {
    void createConversation().then(() => navigate(DASHBOARD_PATHS.CHAT));
  };

  const handleRecentChatClick = (chatId: string) => {
    void setActiveConversation(chatId).then(() => navigate(DASHBOARD_PATHS.CHAT));
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col h-full bg-[#FFFDF8] border-r border-[rgba(0,0,0,0.06)]',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(0,0,0,0.05)]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E9A24C] to-[#D4853A] flex items-center justify-center shadow-premium-sm shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold text-[#1F1F1F] tracking-tight">Pulse AI</span>
            <span className="text-[10px] text-[#999] font-medium">Workspace</span>
          </motion.div>
        )}
      </div>

      {/* New Chat button */}
      {!collapsed && (
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#E9A24C] to-[#D4853A] text-white text-sm font-medium hover:shadow-premium transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus size={15} />
            New Conversation
          </button>
        </div>
      )}

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-0.5">
        {mainNav.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 2 }}
              className={cn(
                'sidebar-item w-full flex items-center gap-3 px-3 py-2.5 text-left',
                active ? 'active' : 'text-[#666]'
              )}
            >
              <Icon size={17} className={cn('shrink-0', active ? 'text-[#E9A24C]' : 'text-[#999]')} />
              {!collapsed && (
                <>
                  <span className={cn('text-sm flex-1', active ? 'font-semibold text-[#1F1F1F]' : 'font-medium')}>{item.label}</span>
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

        {/* Recent Chats */}
        {!collapsed && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-semibold text-[#999] uppercase tracking-widest">Recent</span>
              <button className="text-[#999] hover:text-[#E9A24C] transition-colors">
                <Star size={12} />
              </button>
            </div>
            <div className="space-y-0.5">
              {recentChats.map((chat) => (
                <motion.button
                  key={chat.id}
                  onClick={() => handleRecentChatClick(chat.id)}
                  whileHover={{ x: 2 }}
                  className="sidebar-item w-full flex items-center gap-2.5 px-3 py-2 text-left"
                >
                  <Hash size={13} className="text-[#CCC] shrink-0" />
                  <span className="text-xs text-[#666] flex-1 truncate">{chat.title}</span>
                  <span className="text-[10px] text-[#BBB] shrink-0 flex items-center gap-0.5">
                    <Clock size={10} />
                    {chat.time}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-3 mx-3 border-t border-[rgba(0,0,0,0.05)]" />

        {/* Secondary Nav */}
        {secondaryNav.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              whileHover={{ x: 2 }}
              className={cn(
                'sidebar-item w-full flex items-center gap-3 px-3 py-2.5 text-left',
                active ? 'active' : 'text-[#666]'
              )}
            >
              <div className="relative shrink-0">
                <Icon size={17} className={cn(active ? 'text-[#E9A24C]' : 'text-[#999]')} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#E9A24C] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <>
                  <span className={cn('text-sm flex-1', active ? 'font-semibold text-[#1F1F1F]' : 'font-medium')}>{item.label}</span>
                  <ChevronRight size={14} className="text-[#CCC]" />
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-[rgba(0,0,0,0.05)]">
        <button
          onClick={() => navigate(DASHBOARD_PATHS.PROFILE)}
          className={cn(
            'w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[rgba(233,162,76,0.06)] transition-all duration-200',
          )}
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
              <Badge variant="accent" size="sm">Pro</Badge>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
