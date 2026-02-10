import { executeMockRequest } from '@/services/http/mock-adapter';
import { mockFAQ } from '@/data/mockFAQ';
import type { FAQItem } from '@/types/case';

export async function getFaqItems(): Promise<FAQItem[]> {
  return executeMockRequest(
    () => JSON.parse(JSON.stringify(mockFAQ)) as FAQItem[],
    { delayMs: 220 }
  );
}
