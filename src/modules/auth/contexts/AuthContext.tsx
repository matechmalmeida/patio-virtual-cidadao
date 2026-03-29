import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { configureHttpClient, setCsrfToken } from '@/services/http/http-client';
import { authService } from '../services/auth.service';
import {
  hasActiveSession,
  setActiveSession,
  clearSession,
} from '../store/session-store';
import type {
  AuthUser,
  AuthState,
  LoginRequest,
  LoginResponse,
  VerifyRequest,
  VerifyResponse,
  ResendCodeRequest,
  ResendCodeResponse,
  MeResponse,
} from '../types/auth';

interface AuthContextValue {
  state: AuthState;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  verify: (data: VerifyRequest) => Promise<VerifyResponse>;
  resendCode: (data: ResendCodeRequest) => Promise<ResendCodeResponse>;
  logout: () => Promise<void>;
  clearPendingVerification: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function createUserFromMe(me: MeResponse): AuthUser {
  return {
    id: me.id,
    email: me.email,
    name: me.name,
    avatarUrl: me.avatarUrl,
    permissions: me.permissions,
    requirePasswordChange: me.requirePasswordChange,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    pendingVerification: null,
  });

  const initializingRef = useRef(false);

  useEffect(() => {
    configureHttpClient({
      baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
      onUnauthorized: () => {
        setCsrfToken(null);
        clearSession();
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          pendingVerification: null,
        });
      },
    });
  }, []);

  const initializeAuth = useCallback(async () => {
    if (initializingRef.current) return;

    if (!hasActiveSession()) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        pendingVerification: null,
      });
      return;
    }

    initializingRef.current = true;
    try {
      const [meResponse, csrfToken] = await Promise.all([
        authService.getMe(),
        authService.fetchCsrfToken(),
      ]);
      setCsrfToken(csrfToken);
      const user = createUserFromMe(meResponse);

      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        pendingVerification: null,
      });
    } catch {
      clearSession();
      setCsrfToken(null);
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        pendingVerification: null,
      });
    } finally {
      initializingRef.current = false;
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authService.login(data);

    if (response.requiresVerification) {
      const expiresAt = Date.now() + response.expiresIn * 1000;
      setState((prev) => ({
        ...prev,
        pendingVerification: {
          pendingToken: response.pendingToken,
          expiresAt,
          maskedEmail: response.maskedEmail,
          verificationType: response.verificationType ?? 'email',
        },
      }));
    } else {
      const [meResponse, csrfToken] = await Promise.all([
        authService.getMe(),
        authService.fetchCsrfToken(),
      ]);
      setCsrfToken(csrfToken);
      const user = createUserFromMe(meResponse);
      setActiveSession();

      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        pendingVerification: null,
      });
    }

    return response;
  }, []);

  const verify = useCallback(async (data: VerifyRequest): Promise<VerifyResponse> => {
    const response = await authService.verify(data);

    const [meResponse, csrfToken] = await Promise.all([
      authService.getMe(),
      authService.fetchCsrfToken(),
    ]);
    setCsrfToken(csrfToken);
    const user = createUserFromMe(meResponse);
    setActiveSession();

    setState({
      isAuthenticated: true,
      isLoading: false,
      user,
      pendingVerification: null,
    });

    return response;
  }, []);

  const resendCode = useCallback(async (data: ResendCodeRequest): Promise<ResendCodeResponse> => {
    const response = await authService.resendCode(data);

    setState((prev) => ({
      ...prev,
      pendingVerification: prev.pendingVerification
        ? {
            ...prev.pendingVerification,
            pendingToken: response.pendingToken,
            expiresAt: Date.now() + response.expiresIn * 1000,
            maskedEmail: response.maskedEmail,
          }
        : null,
    }));

    return response;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // continue
    }

    setCsrfToken(null);
    clearSession();
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      pendingVerification: null,
    });
  }, []);

  const clearPendingVerification = useCallback(() => {
    setState((prev) => ({ ...prev, pendingVerification: null }));
  }, []);

  const refreshUserData = useCallback(async () => {
    try {
      const meResponse = await authService.getMe();
      const user = createUserFromMe(meResponse);
      setState((prev) => ({ ...prev, user }));
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        verify,
        resendCode,
        logout,
        clearPendingVerification,
        refreshUserData,
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
