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
import { useAuth } from '@/modules/auth';
import type { CaseAction } from '../types/case-context';
import {
  initialCaseState,
  loadPersistedCases,
  persistCases,
  caseReducer,
} from '../store/case-store';

interface CaseContextType {
  activeCases: CaseData[];
  currentCase: CaseData | null;
  selectedCaseId: string | null;
  selectCase: (id: string) => void;
  updateCase: (id: string, data: Partial<CaseData>) => void;
}

const CaseContext = createContext<CaseContextType | null>(null);
const CaseDispatchContext = createContext<Dispatch<CaseAction> | null>(null);

export function CaseProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(
    caseReducer,
    initialCaseState,
    () => loadPersistedCases()
  );

  useEffect(() => {
    persistCases(state);
  }, [state]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR' });
    }
  }, [isAuthenticated]);

  const currentCase = useMemo(
    () => state.activeCases.find((c) => c.id === state.selectedCaseId) ?? null,
    [state.activeCases, state.selectedCaseId]
  );

  const selectCase = useCallback((id: string) => {
    dispatch({ type: 'SELECT_CASE', payload: id });
  }, []);

  const updateCase = useCallback((id: string, data: Partial<CaseData>) => {
    dispatch({ type: 'UPDATE_CASE', payload: { id, data } });
  }, []);

  return (
    <CaseDispatchContext.Provider value={dispatch}>
      <CaseContext.Provider
        value={{
          activeCases: state.activeCases,
          currentCase,
          selectedCaseId: state.selectedCaseId,
          selectCase,
          updateCase,
        }}
      >
        {children}
      </CaseContext.Provider>
    </CaseDispatchContext.Provider>
  );
}

export function useCases() {
  const ctx = useContext(CaseContext);
  if (!ctx) {
    throw new Error('useCases must be used within CaseProvider');
  }
  return ctx;
}

export function useCaseDispatch() {
  const ctx = useContext(CaseDispatchContext);
  if (!ctx) {
    throw new Error('useCaseDispatch must be used within CaseProvider');
  }
  return ctx;
}
