import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBrand } from '@/contexts/BrandContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTheme } from '@/hooks/useTheme';
import { Car, Moon, Sun, Menu, ArrowRight } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

export default function Navbar() {
  const { t } = useTranslation();
  const { brand } = useBrand();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/#como-funciona', label: t('landing.howItWorks') },
    { href: '/#vantagens', label: t('landing.advantages') },
    { href: '/#faq', label: t('landing.faq') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
            {brand?.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.appName} className="h-9 w-9 object-contain" />
            ) : (
              <Car className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          <span className="text-lg font-bold tracking-tight">{brand?.appName ?? t('app.name')}</span>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
          <div className="hidden md:flex items-center gap-1">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          <Button size="sm" className="font-semibold hidden md:inline-flex" asChild>
            <Link to="/acesso">{t('landing.login')}</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <VisuallyHidden.Root>
            <SheetTitle>{t('app.name')}</SheetTitle>
          </VisuallyHidden.Root>

          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
                {brand?.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.appName} className="h-8 w-8 object-contain" />
                ) : (
                  <Car className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
              <span className="font-bold">{brand?.appName ?? t('app.name')}</span>
            </div>

            <div className="flex-1 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-5 py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="border-t px-5 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
              <Button className="w-full font-semibold" asChild>
                <Link to="/acesso" onClick={() => setOpen(false)}>
                  {t('landing.login')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
