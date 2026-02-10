import type { CaseData } from '@/types/case';

export type CaseAction =
  | { type: 'SET_CASES'; payload: CaseData[] }
  | { type: 'SELECT_CASE'; payload: string }
  | { type: 'UPDATE_CASE'; payload: { id: string; data: Partial<CaseData> } }
  | { type: 'CLEAR' };

export interface CaseState {
  activeCases: CaseData[];
  selectedCaseId: string | null;
}
