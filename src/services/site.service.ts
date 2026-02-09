import { executeMockRequest } from './http/mock-adapter';
import { buildSiteContent } from '@/data/mockSite';
import type { SiteContent } from '@/types/site';

export async function getSiteContent(lang: string): Promise<SiteContent> {
  return executeMockRequest(
    () => buildSiteContent(lang),
    { delayMs: 250 }
  );
}
