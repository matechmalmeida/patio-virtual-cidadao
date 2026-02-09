import { Home, FileText, ClipboardList, Bell, User, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.process', icon: Home },
  { to: '/pendencias', labelKey: 'nav.pendencies', icon: FileText },
  { to: '/app/process', labelKey: 'nav.processes', icon: ClipboardList },
  { to: '/app/notifications', labelKey: 'nav.alerts', icon: Bell },
  { to: '/app/profile', labelKey: 'nav.profile', icon: User },
];
