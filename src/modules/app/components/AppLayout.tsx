import { useState, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { AppSidebar } from './AppSidebar';
import { useIsDesktop } from '../hooks/useIsDesktop';

const SIDEBAR_STORAGE_KEY = 'pv-sidebar-collapsed';

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  });

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/acesso" replace />;
  }

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background">
        <AppSidebar collapsed={collapsed} />
        <div className={`${collapsed ? 'ml-14' : 'ml-64'} transition-all duration-200`}>
          <AppHeader onToggleSidebar={toggleSidebar} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="pb-20 max-w-2xl mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
