import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/acesso" replace />;
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
