import type { CaseData } from '@/types/case';

const SESSION_KEY = 'pv-session-v1';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8h

export interface SessionState {
  isAuthenticated: boolean;
  caseCode: string;
  phone: string;
  otpChallengeId: string | null;
  sessionToken: string | null;
  activeCases: CaseData[];
  selectedCaseId: string | null;
  expiresAt: number | null;
}

export type SessionAction =
  | { type: 'LOGIN_REQUESTED'; payload: { caseCode: string; phone: string; otpChallengeId: string } }
  | {
      type: 'OTP_VERIFIED';
      payload: { token: string; activeCases: CaseData[] };
    }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_CASE'; payload: { caseId: string } }
  | { type: 'UPDATE_CASE'; payload: { caseId: string; updates: Partial<CaseData> } };

export const initialSessionState: SessionState = {
  isAuthenticated: false,
  caseCode: '',
  phone: '',
  otpChallengeId: null,
  sessionToken: null,
  activeCases: [],
  selectedCaseId: null,
  expiresAt: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'LOGIN_REQUESTED':
      return {
        ...state,
        caseCode: action.payload.caseCode,
        phone: action.payload.phone,
        otpChallengeId: action.payload.otpChallengeId,
      };

    case 'OTP_VERIFIED': {
      const cases = action.payload.activeCases;
      const preferredCaseId = state.selectedCaseId && cases.some((item) => item.id === state.selectedCaseId)
        ? state.selectedCaseId
        : (cases[0]?.id ?? null);

      return {
        ...state,
        isAuthenticated: true,
        sessionToken: action.payload.token,
        activeCases: cases,
        selectedCaseId: preferredCaseId,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
    }

    case 'LOGOUT':
      return initialSessionState;

    case 'SELECT_CASE':
      return {
        ...state,
        selectedCaseId: action.payload.caseId,
      };

    case 'UPDATE_CASE':
      return {
        ...state,
        activeCases: state.activeCases.map((item) =>
          item.id === action.payload.caseId ? { ...item, ...action.payload.updates } : item
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
    typeof candidate.caseCode === 'string' &&
    typeof candidate.phone === 'string' &&
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
