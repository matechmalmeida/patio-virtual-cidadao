import { Home, ScrollText, ClipboardList, Car, Bell, User, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { to: '/app/dashboard', labelKey: 'nav.process', icon: Home },
  { to: '/app/apreensoes', labelKey: 'nav.seizures', icon: Car },
  { to: '/app/documentos', labelKey: 'nav.documents', icon: ScrollText },
  { to: '/app/notifications', labelKey: 'nav.alerts', icon: Bell },
  { to: '/app/profile', labelKey: 'nav.profile', icon: User },
];
