import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight, ChevronDown } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';
import type { SiteHero } from '@/types/site';

interface HeroSectionProps {
  hero: SiteHero;
}

export default function HeroSection({ hero }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative pt-16 overflow-hidden">
      <div className="absolute inset-0 top-16">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-background" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-20 md:pt-32 pb-20 md:pb-40">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur mb-6">
            <ShieldCheck className="h-3.5 w-3.5" />
            {hero.badge}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight">
            {hero.title}{' '}
            <span className="text-primary">{hero.highlight}</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-primary-foreground/80 leading-relaxed max-w-lg">
            {hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="h-13 px-8 text-base font-bold shadow-lg" asChild>
              <Link to="/acesso">
                {t('landing.accessCase')}
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-8 text-base font-semibold bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 hover:text-primary-foreground"
              asChild
            >
              <a href="#como-funciona">
                {t('landing.howItWorks')}
                <ChevronDown className="h-5 w-5 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
