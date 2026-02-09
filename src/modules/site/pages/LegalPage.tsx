import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LegalPageSkeleton from '../components/LegalPageSkeleton';
import { useLegalContent } from '../hooks/useLegalContent';

export default function LegalPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data, loading, error } = useLegalContent(slug);

  if (loading) {
    return <LegalPageSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-destructive text-sm">
            {error ?? t('legal.errorNotFound')}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('legal.backToHome')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('legal.backToHome')}
            </Link>
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {data.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('legal.lastUpdated')}: {data.lastUpdated}
          </p>

          <div className="mt-10 space-y-8">
            {data.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-muted-foreground leading-relaxed mb-3 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer copyright={data.footerCopyright} />
    </div>
  );
}
