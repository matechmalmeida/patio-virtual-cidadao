import { ApiError } from '@/services/http/api-error';
import { executeMockRequest } from '@/services/http/mock-adapter';
import type { Appointment, CaseData, ScheduleLocation, ScheduleSlot } from '@/types/case';

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
