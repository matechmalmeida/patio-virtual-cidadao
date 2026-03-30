import { httpGet } from '@/services/http/http-client';
import { buildLegalContent } from '@/data/mockLegal';
import type { LegalPageContent } from '@/types/legal';

export async function getLegalContent(slug: string, lang: string): Promise<LegalPageContent | null> {
  try {
    return await httpGet<LegalPageContent>(`/public/legal-pages/${slug}/${lang}`);
  } catch {
    return buildLegalContent(slug, lang);
  }
}
