import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react';
import { configureHttpClient } from '@/services/http/http-client';
import type { AuthUser, SessionAction } from '../types/auth';
import {
  initialSessionState,
  loadPersistedSession,
  persistSession,
  sessionReducer,
} from '../store/session-store';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AuthDispatchContext = createContext<Dispatch<SessionAction> | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    sessionReducer,
    initialSessionState,
    () => loadPersistedSession()
  );

  useEffect(() => {
    persistSession(state);
  }, [state]);

  useEffect(() => {
    configureHttpClient({
      baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
      getToken: () => state.sessionToken,
      onUnauthorized: () => dispatch({ type: 'LOGOUT' }),
    });
  }, [state.sessionToken]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthContext.Provider
        value={{
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </AuthDispatchContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export function useAuthDispatch() {
  const ctx = useContext(AuthDispatchContext);
  if (!ctx) {
    throw new Error('useAuthDispatch must be used within AuthProvider');
  }
  return ctx;
}
