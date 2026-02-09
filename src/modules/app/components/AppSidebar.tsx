import { NavLink } from '@/components/NavLink';
import { NotificationBadge } from '@/modules/notification';
import { useBrand } from '@/contexts/BrandContext';
import { useTranslation } from 'react-i18next';
import { Car } from 'lucide-react';
import { navItems } from '../lib/nav-items';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AppSidebarProps {
  collapsed: boolean;
}

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const { t } = useTranslation();
  const { brand } = useBrand();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 border-r bg-sidebar text-sidebar-foreground hidden lg:flex lg:flex-col transition-all duration-200 ${
        collapsed ? 'w-14 items-center' : 'w-64'
      }`}
    >
      <div className={`flex h-14 items-center shrink-0 ${collapsed ? 'justify-center' : 'px-3 gap-2'}`}>
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center overflow-hidden shrink-0">
          {brand?.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.appName} className="h-8 w-8 object-contain" />
          ) : (
            <Car className="h-4 w-4 text-sidebar-primary-foreground" />
          )}
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold truncate flex-1">{brand?.appName ?? t('app.name')}</span>
        )}
      </div>

      <nav className={`flex-1 flex flex-col gap-1 py-4 ${collapsed ? 'items-center' : 'px-2'}`}>
        {navItems.map((item) =>
          collapsed ? (
            <Tooltip key={item.to} delayDuration={300}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className="relative flex items-center justify-center h-10 w-10 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  activeClassName="bg-sidebar-accent text-sidebar-primary"
                >
                  <item.icon className="h-5 w-5" />
                  {item.to === '/app/notifications' && (
                    <NotificationBadge className="absolute -top-0.5 -right-0.5" />
                  )}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {t(item.labelKey)}
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex items-center gap-3 h-10 px-3 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-primary"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="text-sm truncate">{t(item.labelKey)}</span>
              {item.to === '/app/notifications' && (
                <NotificationBadge className="ml-auto h-5 min-w-[1.25rem] text-[11px] px-1.5" />
              )}
            </NavLink>
          )
        )}
      </nav>

      <div className={`py-3 ${collapsed ? '' : 'px-3'}`}>
        <p className="text-[10px] text-sidebar-foreground/40">v{__APP_VERSION__}</p>
      </div>
    </aside>
  );
}
