import { httpGet } from '@/services/http/http-client';
import { mockLocations, mockSlots } from '@/data/mockSchedule';
import type { ScheduleLocation, ScheduleSlot } from '@/types/case';

export async function getScheduleLocations(): Promise<ScheduleLocation[]> {
  try {
    return await httpGet<ScheduleLocation[]>('/public/schedule-locations');
  } catch {
    return JSON.parse(JSON.stringify(mockLocations)) as ScheduleLocation[];
  }
}

export async function getScheduleSlots(locationId?: string): Promise<ScheduleSlot[]> {
  try {
    if (locationId) {
      return await httpGet<ScheduleSlot[]>(`/public/schedule-locations/${locationId}/slots`);
    }
    return JSON.parse(JSON.stringify(mockSlots)) as ScheduleSlot[];
  } catch {
    return JSON.parse(JSON.stringify(mockSlots)) as ScheduleSlot[];
  }
}
