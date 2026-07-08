import { memo, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import MeshBackground from '@/components/backgrounds/MeshBackground';
import { useSidebar } from '@/hooks/useSidebar';

const DashboardLayout = () => {
  const { mobileSidebarOpen, openMobileSidebar, closeMobileSidebar } = useSidebar();

  const handleOpenMobileSidebar = useCallback(() => {
    openMobileSidebar();
  }, [openMobileSidebar]);

  const handleCloseMobileSidebar = useCallback(() => {
    closeMobileSidebar();
  }, [closeMobileSidebar]);

  return (
    <div className="relative flex h-dvh min-h-dvh min-w-0 overflow-hidden bg-[#F8F4EC]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-[#1F1F1F] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-float">
        Skip to main content
      </a>
      <MeshBackground />

      <div className="relative z-10 hidden shrink-0 md:flex">
        <DashboardSidebar />
      </div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseMobileSidebar}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm focus:outline-none md:hidden"
            />
            <motion.div
              id="dashboard-mobile-navigation"
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-dvh max-w-[86vw] shadow-float md:hidden"
            >
              <DashboardSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.06)] bg-[#FFFDF8]/80 px-4 py-3 backdrop-blur-lg md:hidden">
          <button
            type="button"
            onClick={handleOpenMobileSidebar}
            aria-label="Open navigation menu"
            aria-expanded={mobileSidebarOpen}
            aria-controls="dashboard-mobile-navigation"
            className="rounded-xl p-2 transition-colors hover:bg-[rgba(233,162,76,0.08)] focus-ring"
          >
            <Menu size={20} className="text-[#666]" aria-hidden="true" />
          </button>
          <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
          <div className="w-9" aria-hidden="true" />
        </div>

        <main className="min-w-0 flex-1 overflow-hidden focus:outline-none" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default memo(DashboardLayout);
