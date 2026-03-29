import { httpGet } from '@/services/http/http-client';
import { buildSiteContent } from '@/data/mockSite';
import type { SiteContent } from '@/types/site';

interface ApiFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export async function getSiteContent(lang: string): Promise<SiteContent> {
  const content = buildSiteContent(lang);

  try {
    const apiFaqs = await httpGet<ApiFaqItem[]>('/public/faqs');
    if (apiFaqs.length > 0) {
      content.faqs = apiFaqs.map((f) => ({ question: f.question, answer: f.answer }));
    }
  } catch {
    // fallback para FAQs do i18n
  }

  return content;
}
