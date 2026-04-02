import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RequireAuth() {
  const { state } = useAuth();

  if (state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/acesso" replace />;
  }

  if (state.user?.requirePasswordChange) {
    return <Navigate to="/acesso/alterar-senha" replace />;
  }

  return <Outlet />;
}
