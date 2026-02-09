import { ApiError } from './http/api-error';
import { executeMockRequest } from './http/mock-adapter';
import type { Appointment, CaseData, Pendency, ScheduleLocation, ScheduleSlot, Term } from '@/types/case';

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

export async function createAppointment(
  caseData: CaseData | null,
  selectedLocation: ScheduleLocation,
  selectedSlot: ScheduleSlot
): Promise<{ appointment: Appointment; status: CaseData['status'] }> {
  return executeMockRequest(() => {
    ensureCase(caseData);

    const appointment: Appointment = {
      id: `apt_${Date.now()}`,
      code: `AGD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      location: selectedLocation,
      date: new Date(`${selectedSlot.date}T12:00:00`).toLocaleDateString('pt-BR'),
      time: selectedSlot.time,
    };

    return {
      appointment,
      status: 'aguardando_retirada',
    };
  }, { delayMs: 380 });
}
