import type { LegalPageContent } from '@/types/legal';
import pt from '@/i18n/locales/pt.json';
import en from '@/i18n/locales/en.json';
import es from '@/i18n/locales/es.json';

type TranslationData = typeof pt;

const translations: Record<string, TranslationData> = { pt, en, es };

const validSlugs = ['termos-de-uso', 'privacidade', 'cookies', 'lgpd'] as const;

function getTranslation(lang: string): TranslationData {
  return translations[lang] ?? translations.pt;
}

export function buildLegalContent(slug: string, lang: string): LegalPageContent | null {
  if (!validSlugs.includes(slug as (typeof validSlugs)[number])) {
    return null;
  }

  const t = getTranslation(lang);
  const page = t.legal[slug as keyof typeof t.legal];

  if (!page || typeof page === 'string' || !('sections' in page)) {
    return null;
  }

  const sections = Object.values(page.sections).map((s) => ({
    title: s.title,
    content: s.content,
  }));

  return {
    title: page.title,
    lastUpdated: page.lastUpdated,
    sections,
    footerCopyright: t.app.copyright,
  };
}
