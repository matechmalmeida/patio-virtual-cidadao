import { executeMockRequest } from './http/mock-adapter';
import { buildLegalContent } from '@/data/mockLegal';
import type { LegalPageContent } from '@/types/legal';

export async function getLegalContent(slug: string, lang: string): Promise<LegalPageContent | null> {
  return executeMockRequest(
    () => buildLegalContent(slug, lang),
    { delayMs: 250 }
  );
}
