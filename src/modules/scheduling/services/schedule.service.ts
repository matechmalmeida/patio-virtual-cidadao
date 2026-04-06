import { httpGet } from '@/services/http/http-client';
import type { ScheduleLocation, ScheduleSlot } from '@/types/case';

export async function getScheduleLocations(): Promise<ScheduleLocation[]> {
  return httpGet<ScheduleLocation[]>('/public/schedule-locations');
}

export async function getScheduleSlots(locationId?: string): Promise<ScheduleSlot[]> {
  if (!locationId) return [];
  return httpGet<ScheduleSlot[]>(`/public/schedule-locations/${locationId}/slots`);
}
