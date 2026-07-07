import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  FileText,
  Settings,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/dashboard/chat' },
  { id: 'pulse', label: 'Pulse', icon: Zap, path: '/dashboard', center: true },
  { id: 'docs', label: 'Docs', icon: FileText, path: '/dashboard/documents' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Don't show on auth pages
  if (['/login', '/signup', '/forgot-password', '/reset-password', '/verify'].some(p => location.pathname === p)) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        className="glass rounded-full px-3 py-2.5 shadow-float border border-white/60"
        style={{ backdropFilter: 'blur(30px)' }}
      >
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            if (item.center) {
              return (
                <motion.button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  className="relative mx-1"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    'bg-gradient-to-br from-[#E9A24C] to-[#D4853A]',
                    'shadow-[0_4px_20px_rgba(233,162,76,0.5)]',
                    'transition-all duration-200'
                  )}>
                    <Icon size={20} className="text-white" />
                  </div>
                  {active && (
                    <motion.div
                      layoutId="center-glow"
                      className="absolute inset-0 rounded-full glow-accent"
                    />
                  )}
                </motion.button>
              );
            }

            return (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-full transition-all duration-200',
                  active ? 'text-[#E9A24C]' : 'text-[#999] hover:text-[#666]'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-[rgba(233,162,76,0.1)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={18} className="relative z-10" strokeWidth={active ? 2.5 : 1.8} />
                <span className={cn(
                  'text-[10px] font-medium relative z-10 transition-all duration-200',
                  active ? 'opacity-100' : 'opacity-70'
                )}>
                  {item.label}
                </span>
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#E9A24C]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default BottomNav;
