import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { ArrowLeft, ShieldCheck, Lock, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { brand } = useBrand();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const appName = brand?.appName ?? t('app.name');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-[hsl(220,30%,12%)] text-white flex-col justify-between p-10">
        <div />

        <div className="space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('auth.layout.backToSite')}
          </Link>

          <div className="flex items-center gap-3">
            <img src={brand?.logoUrl || '/favicon.svg'} alt={appName} className="h-12 w-12 rounded-xl" />
            <span className="text-xl font-bold">{appName}</span>
          </div>

          <div>
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
              {t('auth.layout.headline')}{' '}
              <span className="text-primary">{t('auth.layout.headlineHighlight1')}</span>
              {' e '}
              <span className="text-primary">{t('auth.layout.headlineHighlight2')}</span>
            </h1>
            <p className="mt-4 text-white/60 text-base leading-relaxed">
              {t('auth.layout.headlineDesc')}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t('auth.layout.badgeEncrypted')}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Lock className="h-4 w-4 text-primary" />
              {t('auth.layout.badgeLgpd')}
            </div>
          </div>
        </div>

        <p className="text-xs text-white/30">
          {brand?.copyright ?? t('app.copyright')}
        </p>
      </aside>

      <main className="flex-1 flex flex-col bg-background">
        <div className="flex items-center justify-between p-4 lg:justify-end">
          <div className="flex items-center gap-3 lg:hidden">
            <img src={brand?.logoUrl || '/favicon.svg'} alt={appName} className="h-10 w-10 rounded-xl" />
            <div>
              <p className="text-sm font-bold leading-tight">{appName}</p>
              <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            {children}
          </div>
        </div>

        <footer className="px-4 pb-4">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t('auth.layout.secureConnection')}
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              {t('auth.layout.dataProtected')}
            </span>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/60 lg:hidden">
            {brand?.copyright ?? t('app.copyright')}
          </p>
        </footer>
      </main>
    </div>
  );
}
