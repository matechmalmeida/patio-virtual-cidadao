import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { getIcon } from '../lib/icon-map';
import type { SiteStep } from '@/types/site';

interface HowItWorksSectionProps {
  steps: SiteStep[];
}

export default function HowItWorksSection({ steps }: HowItWorksSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="como-funciona" className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28 scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
          {t('landing.stepByStep')}
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          {t('landing.howItWorksTitle')}
        </h2>
        <p className="text-muted-foreground mt-3 text-sm md:text-base">
          {t('landing.howItWorksSubtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const Icon = getIcon(step.icon);
          return (
            <div key={step.number} className="relative group">
              <Card className="border-0 shadow-md h-full transition-shadow hover:shadow-xl">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-extrabold text-primary/20">{step.number}</span>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
