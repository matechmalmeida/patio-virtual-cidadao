import { httpGet } from '@/services/http/http-client';
import { buildSiteContent } from '@/data/mockSite';
import type { SiteContent } from '@/types/site';

export async function getSiteContent(lang: string): Promise<SiteContent> {
  try {
    return await httpGet<SiteContent>(`/public/site-contents/${lang}`);
  } catch {
    return buildSiteContent(lang);
  }
}
