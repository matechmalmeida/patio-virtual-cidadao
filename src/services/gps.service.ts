import { executeMockRequest } from './http/mock-adapter';
import { getMockGPSData, type GPSDeviceData } from '@/data/mockGPS';

export type { GPSDeviceData };

export async function getGpsStatusByCase(caseId: string): Promise<GPSDeviceData> {
  return executeMockRequest(() => getMockGPSData(caseId), { delayMs: 300 });
}
