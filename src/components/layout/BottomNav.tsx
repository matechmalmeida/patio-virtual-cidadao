import { NavLink } from '@/components/NavLink';
import { Home, FileText, MapPin, Bell, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { useTranslation } from 'react-i18next';

export function BottomNav() {
  const { currentCase } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { to: '/dashboard', label: t('nav.process'), icon: Home },
    { to: '/pendencias', label: t('nav.pendencies'), icon: FileText },
    { to: '/timeline', label: t('nav.timeline'), icon: MapPin },
    { to: '/notificacoes', label: t('nav.alerts'), icon: Bell },
    { to: '/suporte', label: t('nav.more'), icon: MoreHorizontal },
  ];

  const unreadCount = currentCase?.notifications.filter((n) => !n.read).length ?? 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-muted-foreground transition-colors"
            activeClassName="text-primary"
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.to === '/notificacoes' && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[1rem] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
