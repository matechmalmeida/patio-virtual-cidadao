import { executeMockRequest } from './http/mock-adapter';
import { mockHistoricalCases } from '@/data/mockCases';
import type { HistoricalCase } from '@/types/case';

export async function getHistoricalCases(): Promise<HistoricalCase[]> {
  return executeMockRequest(
    () => JSON.parse(JSON.stringify(mockHistoricalCases)) as HistoricalCase[],
    { delayMs: 220 }
  );
}
