import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { Button } from '@/components/ui/button';
import { LogOut, Car, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function AppHeader() {
  const { t } = useTranslation();
  const { currentCase, activeCases, logout } = useAuth();
  const { brand } = useBrand();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/acesso');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center justify-between px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 overflow-hidden">
            {brand?.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.appName} className="h-8 w-8 object-contain" />
            ) : (
              <Car className="h-4 w-4 text-primary-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">{brand?.appName ?? t('app.name')}</p>
            {currentCase && (
              <p className="text-[11px] text-muted-foreground truncate">
                {currentCase.plate} — {currentCase.vehicle}
                {activeCases.length > 1 && (
                  <span className="ml-1 text-primary font-medium">
                    +{activeCases.length - 1}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-9 w-9">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
