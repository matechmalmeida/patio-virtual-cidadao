import { ApiError } from '@/services/http/api-error';
import { executeMockRequest } from '@/services/http/mock-adapter';
import type { CaseData, Term } from '@/types/case';

function ensureCase(caseData: CaseData | null): asserts caseData is CaseData {
  if (!caseData) {
    throw new ApiError({
      code: 'NOT_FOUND',
      status: 404,
      message: 'Case not found',
      userMessage: 'Caso não encontrado.',
    });
  }
}

export async function signTerm(caseData: CaseData | null, termId: string): Promise<Term[]> {
  return executeMockRequest(() => {
    ensureCase(caseData);

    return caseData.terms.map((item) =>
      item.id === termId
        ? { ...item, status: 'assinado' as const, signedAt: new Date().toISOString() }
        : item
    );
  }, { delayMs: 380 });
}
