import type { SessionState, SessionAction } from '../types/auth';

const SESSION_KEY = 'pv-session-v2';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

export const initialSessionState: SessionState = {
  isAuthenticated: false,
  user: null,
  sessionToken: null,
  totpPending: false,
  totpTempToken: null,
  totpEmail: null,
  activeCases: [],
  selectedCaseId: null,
  expiresAt: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      const cases = action.payload.activeCases;
      const preferredCaseId =
        state.selectedCaseId && cases.some((item) => item.id === state.selectedCaseId)
          ? state.selectedCaseId
          : (cases[0]?.id ?? null);

      return {
        ...initialSessionState,
        isAuthenticated: true,
        user: action.payload.user,
        sessionToken: action.payload.token,
        activeCases: cases,
        selectedCaseId: preferredCaseId,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
    }

    case 'TOTP_PENDING':
      return {
        ...state,
        totpPending: true,
        totpTempToken: action.payload.tempToken,
        totpEmail: action.payload.email,
      };

    case 'LOGOUT':
      return initialSessionState;

    case 'SELECT_CASE':
      return {
        ...state,
        selectedCaseId: action.payload,
      };

    case 'UPDATE_CASE':
      return {
        ...state,
        activeCases: state.activeCases.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };

    default:
      return state;
  }
}

function isValidSessionShape(value: unknown): value is SessionState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SessionState>;
  return (
    typeof candidate.isAuthenticated === 'boolean' &&
    Array.isArray(candidate.activeCases)
  );
}

export function loadPersistedSession(): SessionState {
  if (typeof window === 'undefined') {
    return initialSessionState;
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return initialSessionState;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isValidSessionShape(parsed)) {
      return initialSessionState;
    }

    const now = Date.now();
    if (!parsed.expiresAt || parsed.expiresAt < now) {
      window.sessionStorage.removeItem(SESSION_KEY);
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

  if (!state.isAuthenticated || !state.sessionToken) {
    window.sessionStorage.removeItem(SESSION_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
}
