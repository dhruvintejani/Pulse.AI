import { createContext, useMemo, useState, type ReactNode } from 'react';
import type { SidebarContextValue } from '@/types/sidebar';

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const value = useMemo<SidebarContextValue>(() => ({
    mobileSidebarOpen,
    openMobileSidebar: () => setMobileSidebarOpen(true),
    closeMobileSidebar: () => setMobileSidebarOpen(false),
    toggleMobileSidebar: () => setMobileSidebarOpen((current) => !current),
    collapsed,
    setCollapsed,
    toggleCollapsed: () => setCollapsed((current) => !current),
  }), [collapsed, mobileSidebarOpen]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
