import type { CaseData, Pendency } from '@/types/case';

export async function submitPendencyFile(
  _caseData: CaseData | null,
  _pendencyId: string,
  _fileName: string
): Promise<Pendency[]> {
  return [];
}

export async function confirmPendencyPayment(
  _caseData: CaseData | null,
  _pendencyId: string
): Promise<Pendency[]> {
  return [];
}
