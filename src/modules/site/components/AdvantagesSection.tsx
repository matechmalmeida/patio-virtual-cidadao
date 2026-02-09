import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { getIcon } from '../lib/icon-map';
import type { SiteAdvantage } from '@/types/site';

interface AdvantagesSectionProps {
  advantages: SiteAdvantage[];
}

export default function AdvantagesSection({ advantages }: AdvantagesSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="vantagens" className="bg-muted/50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success mb-4">
            {t('landing.benefitsLabel')}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {t('landing.benefitsTitle')}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            {t('landing.benefitsSubtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {advantages.map((adv) => {
            const Icon = getIcon(adv.icon);
            return (
              <Card key={adv.title} className="border-0 shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 pb-6">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold mb-1.5">{adv.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{adv.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
