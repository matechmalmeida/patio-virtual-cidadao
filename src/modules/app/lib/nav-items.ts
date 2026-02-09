import { Home, FileText, MapPin, Bell, User, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.process', icon: Home },
  { to: '/pendencias', labelKey: 'nav.pendencies', icon: FileText },
  { to: '/timeline', labelKey: 'nav.timeline', icon: MapPin },
  { to: '/notificacoes', labelKey: 'nav.alerts', icon: Bell },
  { to: '/app/profile', labelKey: 'nav.profile', icon: User },
];
