import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { AppSidebar } from './AppSidebar';
import { useIsDesktop } from '../hooks/useIsDesktop';

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const isDesktop = useIsDesktop();
  const [collapsed, setCollapsed] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/acesso" replace />;
  }

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background">
        <AppSidebar collapsed={collapsed} />
        <div className={`${collapsed ? 'ml-14' : 'ml-64'} transition-all duration-200`}>
          <AppHeader onToggleSidebar={() => setCollapsed((prev) => !prev)} />
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
