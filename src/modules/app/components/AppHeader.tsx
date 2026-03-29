import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/modules/auth';
import { useBrand } from '@/contexts/BrandContext';
import { NotificationBadge } from '@/modules/notification';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Car, Moon, Sun, Bell, Wifi, PanelLeft } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

interface AppHeaderProps {
  onToggleSidebar?: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const { t } = useTranslation();
  const { state, logout } = useAuth();
  const user = state.user;
  const { brand } = useBrand();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    setAvatarUrl(localStorage.getItem('pv-avatar'));

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'pv-avatar') setAvatarUrl(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/acesso');
  };

  const initials = user?.name ? getInitials(user.name) : '??';

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 min-w-0 lg:hidden">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 overflow-hidden">
            {brand?.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.appName} className="h-8 w-8 object-contain" />
            ) : (
              <Car className="h-4 w-4 text-primary-foreground" />
            )}
          </div>
        </div>

        {onToggleSidebar && (
          <div className="hidden lg:flex items-center">
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-9 w-9">
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 cursor-default">
            <Wifi className="h-4 w-4 text-green-500" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={() => navigate('/app/notifications')}
          >
            <Bell className="h-4 w-4" />
            <NotificationBadge className="absolute -top-0.5 -right-0.5" />
          </Button>

          <LanguageSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors max-w-[200px]">
                <Avatar className="h-8 w-8 shrink-0">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={user?.name ?? ''} />}
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                {user?.name && (
                  <span className="hidden lg:block text-sm truncate pr-1">{user.name}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs text-muted-foreground leading-none">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleTheme}>
                {theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {theme === 'dark' ? t('theme.light', 'Tema claro') : t('theme.dark', 'Tema escuro')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('auth.logout', 'Sair')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
