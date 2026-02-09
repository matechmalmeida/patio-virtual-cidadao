import { ApiError } from '@/services/http/api-error';
import { executeMockRequest } from '@/services/http/mock-adapter';
import type { CaseData, Pendency } from '@/types/case';

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

export async function submitPendencyFile(
  caseData: CaseData | null,
  pendencyId: string,
  fileName: string
): Promise<Pendency[]> {
  return executeMockRequest(() => {
    ensureCase(caseData);

    return caseData.pendencies.map((item) =>
      item.id === pendencyId
        ? { ...item, status: 'enviado' as const, uploadedFile: fileName }
        : item
    );
  }, { delayMs: 450 });
}

export async function confirmPendencyPayment(
  caseData: CaseData | null,
  pendencyId: string
): Promise<Pendency[]> {
  return executeMockRequest(() => {
    ensureCase(caseData);

    return caseData.pendencies.map((item) =>
      item.id === pendencyId ? { ...item, status: 'enviado' as const } : item
    );
  }, { delayMs: 450 });
}
