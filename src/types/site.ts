export interface SiteHero {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
}

export interface SiteStat {
  value: string;
  label: string;
}

export interface SiteStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface SiteAdvantage {
  title: string;
  description: string;
  icon: string;
}

export interface SiteComparisonColumn {
  title: string;
  items: string[];
}

export interface SiteFAQ {
  question: string;
  answer: string;
}

export interface SiteCta {
  title: string;
  description: string;
}

export interface SiteContent {
  hero: SiteHero;
  stats: SiteStat[];
  steps: SiteStep[];
  advantages: SiteAdvantage[];
  comparison: {
    traditional: SiteComparisonColumn;
    virtual: SiteComparisonColumn;
  };
  faqs: SiteFAQ[];
  cta: SiteCta;
  footerCopyright: string;
}
