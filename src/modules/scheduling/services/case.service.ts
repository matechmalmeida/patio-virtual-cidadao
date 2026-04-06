import type { Appointment, CaseData, ScheduleLocation, ScheduleSlot } from '@/types/case';

export async function createAppointment(
  _caseData: CaseData | null,
  selectedLocation: ScheduleLocation,
  selectedSlot: ScheduleSlot
): Promise<{ appointment: Appointment; status: CaseData['status'] }> {
  const appointment: Appointment = {
    id: `apt_${Date.now()}`,
    code: '',
    location: selectedLocation,
    date: new Date(`${selectedSlot.date}T12:00:00`).toLocaleDateString('pt-BR'),
    time: selectedSlot.time,
  };

  return { appointment, status: 'aguardando_retirada' };
}
