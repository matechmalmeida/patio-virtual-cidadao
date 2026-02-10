import { getStorage } from '@/modules/auth/store/session-store';
import type { CaseState, CaseAction } from '../types/case-context';

const CASES_KEY = 'pv-cases-v1';

export const initialCaseState: CaseState = {
  activeCases: [],
  selectedCaseId: null,
};

export function caseReducer(state: CaseState, action: CaseAction): CaseState {
  switch (action.type) {
    case 'SET_CASES': {
      const cases = action.payload;
      const preferredId =
        state.selectedCaseId && cases.some((c) => c.id === state.selectedCaseId)
          ? state.selectedCaseId
          : (cases[0]?.id ?? null);
      return { activeCases: cases, selectedCaseId: preferredId };
    }

    case 'SELECT_CASE':
      return { ...state, selectedCaseId: action.payload };

    case 'UPDATE_CASE':
      return {
        ...state,
        activeCases: state.activeCases.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.data } : c
        ),
      };

    case 'CLEAR':
      return initialCaseState;

    default:
      return state;
  }
}

export function loadPersistedCases(): CaseState {
  if (typeof window === 'undefined') return initialCaseState;

  try {
    const storage = getStorage();
    const raw = storage.getItem(CASES_KEY);
    if (!raw) return initialCaseState;

    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray((parsed as CaseState).activeCases)
    ) {
      return initialCaseState;
    }

    return parsed as CaseState;
  } catch {
    return initialCaseState;
  }
}

export function persistCases(state: CaseState): void {
  if (typeof window === 'undefined') return;

  const storage = getStorage();

  if (state.activeCases.length === 0) {
    window.sessionStorage.removeItem(CASES_KEY);
    window.localStorage.removeItem(CASES_KEY);
    return;
  }

  storage.setItem(CASES_KEY, JSON.stringify(state));
}
