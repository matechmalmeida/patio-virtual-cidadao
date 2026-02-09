import { createContext, useContext, useEffect, useMemo, useReducer, useCallback, type ReactNode } from 'react';
import type { CaseData } from '@/types/case';
import { requestOtp, verifyOtpCode } from '@/services/auth.service';
import {
  initialSessionState,
  loadPersistedSession,
  persistSession,
  sessionReducer,
} from '@/store/session-store';

interface AuthContextType {
  isAuthenticated: boolean;
  caseCode: string;
  phone: string;
  activeCases: CaseData[];
  selectedCaseId: string | null;
  currentCase: CaseData | null;
  login: (code: string, phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  logout: () => void;
  selectCase: (caseId: string) => void;
  updateCase: (caseId: string, updates: Partial<CaseData>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

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

  const login = useCallback(async (code: string, phone: string) => {
    const challenge = await requestOtp(code, phone);

    dispatch({
      type: 'LOGIN_REQUESTED',
      payload: {
        caseCode: code,
        phone,
        otpChallengeId: challenge.challengeId,
      },
    });
  }, []);

  const verifyOTP = useCallback(
    async (otp: string) => {
      if (!state.otpChallengeId) {
        return false;
      }

      const verified = await verifyOtpCode(state.otpChallengeId, otp);

      dispatch({
        type: 'OTP_VERIFIED',
        payload: {
          token: verified.token,
          activeCases: verified.activeCases,
        },
      });

      return true;
    },
    [state.otpChallengeId]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const selectCase = useCallback((caseId: string) => {
    dispatch({
      type: 'SELECT_CASE',
      payload: { caseId },
    });
  }, []);

  const updateCase = useCallback((caseId: string, updates: Partial<CaseData>) => {
    dispatch({
      type: 'UPDATE_CASE',
      payload: { caseId, updates },
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        caseCode: state.caseCode,
        phone: state.phone,
        activeCases: state.activeCases,
        selectedCaseId: state.selectedCaseId,
        currentCase,
        login,
        verifyOTP,
        logout,
        selectCase,
        updateCase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
