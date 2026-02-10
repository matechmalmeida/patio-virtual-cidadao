import type { SessionState, SessionAction } from '../types/auth';

const SESSION_KEY = 'pv-session-v2';
const REMEMBER_KEY = 'pv-remember';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

export const initialSessionState: SessionState = {
  isAuthenticated: false,
  user: null,
  sessionToken: null,
  totpPending: false,
  totpTempToken: null,
  totpEmail: null,
  expiresAt: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...initialSessionState,
        isAuthenticated: true,
        user: action.payload.user,
        sessionToken: action.payload.token,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };

    case 'TOTP_PENDING':
      return {
        ...state,
        totpPending: true,
        totpTempToken: action.payload.tempToken,
        totpEmail: action.payload.email,
      };

    case 'LOGOUT':
      return initialSessionState;

    default:
      return state;
  }
}

function isValidSessionShape(value: unknown): value is SessionState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SessionState>;
  return typeof candidate.isAuthenticated === 'boolean';
}

export function getStorage(): Storage {
  if (typeof window === 'undefined') {
    return window.sessionStorage;
  }
  const remember = window.localStorage.getItem(REMEMBER_KEY);
  return remember === 'true' ? window.localStorage : window.sessionStorage;
}

export function setRememberMe(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    window.localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    window.localStorage.removeItem(REMEMBER_KEY);
  }
}

export function getRememberMe(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(REMEMBER_KEY) === 'true';
}

export function loadPersistedSession(): SessionState {
  if (typeof window === 'undefined') {
    return initialSessionState;
  }

  try {
    const storage = getStorage();
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) {
      return initialSessionState;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isValidSessionShape(parsed)) {
      return initialSessionState;
    }

    const now = Date.now();
    if (!parsed.expiresAt || parsed.expiresAt < now) {
      storage.removeItem(SESSION_KEY);
      return initialSessionState;
    }

    return parsed;
  } catch {
    return initialSessionState;
  }
}

export function persistSession(state: SessionState): void {
  if (typeof window === 'undefined') {
    return;
  }

  const storage = getStorage();

  if (!state.isAuthenticated || !state.sessionToken) {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  storage.setItem(SESSION_KEY, JSON.stringify(state));
}
