import { executeMockRequest } from './http/mock-adapter';
import { mockLocations, mockSlots } from '@/data/mockSchedule';
import type { ScheduleLocation, ScheduleSlot } from '@/types/case';

export async function getScheduleLocations(): Promise<ScheduleLocation[]> {
  return executeMockRequest(
    () => JSON.parse(JSON.stringify(mockLocations)) as ScheduleLocation[],
    { delayMs: 250 }
  );
}

export async function getScheduleSlots(): Promise<ScheduleSlot[]> {
  return executeMockRequest(
    () => JSON.parse(JSON.stringify(mockSlots)) as ScheduleSlot[],
    { delayMs: 250 }
  );
}
