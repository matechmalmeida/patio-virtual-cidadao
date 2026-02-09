import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import HowItWorksSection from '../components/HowItWorksSection';
import AdvantagesSection from '../components/AdvantagesSection';
import ComparisonSection from '../components/ComparisonSection';
import FaqSection from '../components/FaqSection';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';
import SitePageSkeleton from '../components/SitePageSkeleton';
import { useSiteContent } from '../hooks/useSiteContent';

export default function SitePage() {
  const { t } = useTranslation();
  const { data, loading, error } = useSiteContent();
  const { hash } = useLocation();

  useEffect(() => {
    if (!data || !hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data, hash]);

  if (loading) {
    return <SitePageSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive text-sm">{error ?? t('common.loadError')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection hero={data.hero} />
      <StatsBar stats={data.stats} />
      <HowItWorksSection steps={data.steps} />
      <AdvantagesSection advantages={data.advantages} />
      <ComparisonSection
        traditional={data.comparison.traditional}
        virtual={data.comparison.virtual}
      />
      <FaqSection faqs={data.faqs} />
      <CtaSection cta={data.cta} />
      <Footer copyright={data.footerCopyright} />
    </div>
  );
}
