import {
  Car,
  MapPin,
  FileCheck,
  CheckCircle2,
  Home,
  Wallet,
  Clock,
  ShieldCheck,
  Smartphone,
  CalendarDays,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Car,
  MapPin,
  FileCheck,
  CheckCircle2,
  Home,
  Wallet,
  Clock,
  ShieldCheck,
  Smartphone,
  CalendarDays,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? ShieldCheck;
}
