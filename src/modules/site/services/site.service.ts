import type { SiteContent } from '@/types/site';

export async function getSiteContent(_lang: string): Promise<SiteContent> {
  return {
    hero: { badge: '', title: 'Patio Virtual', highlight: '', subtitle: '' },
    stats: [],
    steps: [],
    advantages: [],
    comparison: { traditional: { title: '', items: [] }, virtual: { title: '', items: [] } },
    faqs: [],
    cta: { title: '', description: '' },
    footerCopyright: '',
  };
}
