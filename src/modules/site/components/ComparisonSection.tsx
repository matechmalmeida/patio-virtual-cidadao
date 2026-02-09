import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Home, CheckCircle2 } from 'lucide-react';
import type { SiteComparisonColumn } from '@/types/site';

interface ComparisonSectionProps {
  traditional: SiteComparisonColumn;
  virtual: SiteComparisonColumn;
}

export default function ComparisonSection({ traditional, virtual }: ComparisonSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
          {t('landing.comparisonTitle')}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Card className="border-2 border-destructive/20">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Car className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="font-bold text-destructive">{traditional.title}</h3>
            </div>
            {traditional.items.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <span className="text-destructive text-xs font-bold">&#x2715;</span>
                </span>
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-2 border-success/30 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-success text-success-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            {t('landing.recommended')}
          </div>
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Home className="h-4 w-4 text-success" />
              </div>
              <h3 className="font-bold text-success">{virtual.title}</h3>
            </div>
            {virtual.items.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <span className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                </span>
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
