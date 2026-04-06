import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car } from 'lucide-react';

interface FooterProps {
  copyright: string;
}

export default function Footer({ copyright }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-card">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">{t('app.name')}</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm text-muted-foreground">
            <a href="/#como-funciona" className="hover:text-foreground transition-colors">{t('landing.howItWorks')}</a>
            <a href="/#vantagens" className="hover:text-foreground transition-colors">{t('landing.advantages')}</a>
            <a href="/#faq" className="hover:text-foreground transition-colors">{t('landing.faq')}</a>
            <Link to="/acesso" className="hover:text-foreground transition-colors">{t('landing.accessCase')}</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground/60">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
