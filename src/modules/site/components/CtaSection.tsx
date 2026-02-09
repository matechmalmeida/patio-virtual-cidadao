import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, ArrowRight } from 'lucide-react';
import type { SiteCta } from '@/types/site';

interface CtaSectionProps {
  cta: SiteCta;
}

export default function CtaSection({ cta }: CtaSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
      <Card className="border-0 shadow-2xl bg-primary overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <CardContent className="relative pt-10 pb-10 md:pt-16 md:pb-16 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-5">
            <Car className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground mb-3">
            {cta.title}
          </h2>
          <p className="text-primary-foreground/80 text-sm md:text-base max-w-md mx-auto mb-8">
            {cta.description}
          </p>
          <Button
            size="lg"
            className="h-13 px-10 text-base font-bold bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
            asChild
          >
            <Link to="/acesso">
              {t('landing.accessCase')}
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
