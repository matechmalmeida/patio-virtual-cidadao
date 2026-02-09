import type { ReactNode } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { brand } = useBrand();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-12 pb-8 px-6 text-center relative">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="h-16 w-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 overflow-hidden">
          {brand?.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.appName} className="h-16 w-16 object-contain" />
          ) : (
            <Car className="h-8 w-8 text-primary-foreground" />
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{brand?.appName ?? t('app.name')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('app.subtitle')}</p>
      </div>

      <div className="flex-1 px-4 pb-8">
        <Card className="max-w-sm mx-auto border-0 shadow-lg">
          <CardContent className="pt-6 space-y-6">
            {children}
          </CardContent>
        </Card>
      </div>

      <footer className="py-4 text-center text-[11px] text-muted-foreground/60">
        {brand?.copyright ?? t('app.copyright')}
      </footer>
    </div>
  );
}
