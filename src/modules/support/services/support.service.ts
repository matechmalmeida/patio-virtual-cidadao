import { httpGet } from '@/services/http/http-client';
import type { FAQItem } from '@/types/case';

export async function getFaqItems(): Promise<FAQItem[]> {
  return httpGet<FAQItem[]>('/public/faqs');
}
