import { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Home, MessageSquare, Settings, Zap } from 'lucide-react';
import { AUTH_ROUTES, DASHBOARD_PATHS, ROUTES } from '@/constants/routes';
import { routePreloaders } from '@/routes/lazyPages';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, path: ROUTES.HOME, preload: routePreloaders.landing },
  { id: 'chat', label: 'Chat', icon: MessageSquare, path: DASHBOARD_PATHS.CHAT, preload: routePreloaders.chat },
  { id: 'pulse', label: 'Pulse', icon: Zap, path: DASHBOARD_PATHS.ROOT, center: true, preload: routePreloaders.dashboard },
  { id: 'docs', label: 'Docs', icon: FileText, path: DASHBOARD_PATHS.DOCUMENTS, preload: routePreloaders.documents },
  { id: 'settings', label: 'Settings', icon: Settings, path: DASHBOARD_PATHS.SETTINGS, preload: routePreloaders.settings },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenOnAuthPage = useMemo(() => AUTH_ROUTES.some((path) => location.pathname === path), [location.pathname]);

  const isActive = useCallback((path: string) => {
    if (path === ROUTES.HOME) return location.pathname === ROUTES.HOME;
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  if (hiddenOnAuthPage) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 sm:bottom-5 md:hidden">
      <motion.nav
        aria-label="Primary mobile navigation"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        className="pointer-events-auto max-w-full rounded-full border border-white/60 px-2 py-2 shadow-float glass"
        style={{ backdropFilter: 'blur(30px)' }}
      >
        <div className="flex max-w-[calc(100vw-1.5rem)] items-center gap-0.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            const handlePreload = () => void item.preload?.();

            if (item.center) {
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  aria-label="Open Pulse dashboard"
                  aria-current={active ? 'page' : undefined}
                  onMouseEnter={handlePreload}
                  onFocus={handlePreload}
                  onClick={() => handleNavigate(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  className="relative mx-1 shrink-0 rounded-full focus-ring"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#E9A24C] to-[#D4853A] shadow-[0_4px_20px_rgba(233,162,76,0.5)] transition-all duration-200">
                    <Icon size={20} className="text-white" aria-hidden="true" />
                  </div>
                  {active && <motion.div layoutId="center-glow" className="absolute inset-0 rounded-full glow-accent" />}
                </motion.button>
              );
            }

            return (
              <motion.button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={handlePreload}
                onFocus={handlePreload}
                onClick={() => handleNavigate(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                className={cn('relative flex min-w-14 shrink-0 flex-col items-center gap-0.5 rounded-full px-3 py-2 transition-all duration-200 focus-ring', active ? 'text-[#E9A24C]' : 'text-[#999] hover:text-[#666]')}
              >
                {active && <motion.div layoutId="nav-active" className="absolute inset-0 rounded-full bg-[rgba(233,162,76,0.1)]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                <Icon size={18} className="relative z-10" strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" />
                <span className={cn('relative z-10 text-[10px] font-medium transition-all duration-200', active ? 'opacity-100' : 'opacity-70')}>{item.label}</span>
                {active && <motion.div layoutId="nav-dot" className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#E9A24C]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
};

export default memo(BottomNav);
