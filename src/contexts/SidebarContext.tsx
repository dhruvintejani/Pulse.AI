import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { SidebarContextValue } from '@/types/sidebar';

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);
  const toggleMobileSidebar = useCallback(() => setMobileSidebarOpen((current) => !current), []);
  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), []);

  const value = useMemo<SidebarContextValue>(() => ({
    mobileSidebarOpen,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
    collapsed,
    setCollapsed,
    toggleCollapsed,
  }), [collapsed, closeMobileSidebar, mobileSidebarOpen, openMobileSidebar, toggleCollapsed, toggleMobileSidebar]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
