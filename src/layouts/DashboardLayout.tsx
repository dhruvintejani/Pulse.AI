import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import MeshBackground from '@/components/backgrounds/MeshBackground';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/hooks/useSidebar';

const DashboardLayout = () => {
  const { mobileSidebarOpen, openMobileSidebar, closeMobileSidebar } = useSidebar();

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#F8F4EC]">
      <MeshBackground />
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex relative z-10">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileSidebar}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full z-50 md:hidden shadow-float"
            >
              <DashboardSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#FFFDF8]/80 backdrop-blur-lg border-b border-[rgba(0,0,0,0.06)]">
          <button
            onClick={openMobileSidebar}
            className="p-2 rounded-xl hover:bg-[rgba(233,162,76,0.08)] transition-colors"
          >
            <Menu size={20} className="text-[#666]" />
          </button>
          <span className="text-sm font-bold text-[#1F1F1F]">Pulse AI</span>
          <div className="w-9" />
        </div>

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
