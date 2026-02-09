import type { SiteContent } from '@/types/site';
import pt from '@/i18n/locales/pt.json';
import en from '@/i18n/locales/en.json';
import es from '@/i18n/locales/es.json';

type TranslationData = typeof pt;

const translations: Record<string, TranslationData> = { pt, en, es };

function getTranslation(lang: string): TranslationData {
  return translations[lang] ?? translations.pt;
}

export function buildSiteContent(lang: string): SiteContent {
  const t = getTranslation(lang);
  const l = t.landing;

  return {
    hero: {
      badge: l.badge,
      title: l.heroTitle,
      highlight: l.heroHighlight,
      subtitle: l.heroSubtitle,
    },
    stats: [
      { value: 'R$ 0', label: l.statsNoTow },
      { value: 'R$ 0', label: l.statsNoDailyFee },
      { value: '100%', label: l.statsDigital },
    ],
    steps: [
      { number: '01', title: l.steps['1'].title, description: l.steps['1'].description, icon: 'Car' },
      { number: '02', title: l.steps['2'].title, description: l.steps['2'].description, icon: 'MapPin' },
      { number: '03', title: l.steps['3'].title, description: l.steps['3'].description, icon: 'FileCheck' },
      { number: '04', title: l.steps['4'].title, description: l.steps['4'].description, icon: 'CheckCircle2' },
    ],
    advantages: [
      { icon: 'Home', title: l.advantages_list['1'].title, description: l.advantages_list['1'].description },
      { icon: 'Wallet', title: l.advantages_list['2'].title, description: l.advantages_list['2'].description },
      { icon: 'Clock', title: l.advantages_list['3'].title, description: l.advantages_list['3'].description },
      { icon: 'ShieldCheck', title: l.advantages_list['4'].title, description: l.advantages_list['4'].description },
      { icon: 'Smartphone', title: l.advantages_list['5'].title, description: l.advantages_list['5'].description },
      { icon: 'CalendarDays', title: l.advantages_list['6'].title, description: l.advantages_list['6'].description },
    ],
    comparison: {
      traditional: {
        title: l.traditional,
        items: l.traditional_items,
      },
      virtual: {
        title: l.virtual,
        items: l.virtual_items,
      },
    },
    faqs: [
      { question: l.faqs['1'].q, answer: l.faqs['1'].a },
      { question: l.faqs['2'].q, answer: l.faqs['2'].a },
      { question: l.faqs['3'].q, answer: l.faqs['3'].a },
      { question: l.faqs['4'].q, answer: l.faqs['4'].a },
      { question: l.faqs['5'].q, answer: l.faqs['5'].a },
    ],
    cta: {
      title: l.ctaTitle,
      description: l.ctaSubtitle,
    },
    footerCopyright: t.app.copyright,
  };
}
