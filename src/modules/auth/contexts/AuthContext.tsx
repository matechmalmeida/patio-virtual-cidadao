import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { CaseData } from '@/types/case';
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
  currentCase: CaseData | null;
  activeCases: CaseData[];
  selectedCaseId: string | null;
  selectCase: (id: string) => void;
  updateCase: (id: string, data: Partial<CaseData>) => void;
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

  const currentCase = useMemo(
    () => state.activeCases.find((item) => item.id === state.selectedCaseId) ?? null,
    [state.activeCases, state.selectedCaseId]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const selectCase = useCallback((id: string) => {
    dispatch({ type: 'SELECT_CASE', payload: id });
  }, []);

  const updateCase = useCallback((id: string, data: Partial<CaseData>) => {
    dispatch({ type: 'UPDATE_CASE', payload: { id, data } });
  }, []);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthContext.Provider
        value={{
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          currentCase,
          activeCases: state.activeCases,
          selectedCaseId: state.selectedCaseId,
          selectCase,
          updateCase,
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
