import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type StatVariant = 'info' | 'warning' | 'success' | 'muted';

interface SummaryStatCardProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  variant?: StatVariant;
  to?: string;
  className?: string;
}

const variantStyles: Record<StatVariant, { card: string; icon: string; value: string }> = {
  info: {
    card: 'bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40',
    icon: 'text-blue-500',
    value: 'text-blue-700 dark:text-blue-300',
  },
  warning: {
    card: 'bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/40',
    icon: 'text-amber-500',
    value: 'text-amber-700 dark:text-amber-300',
  },
  success: {
    card: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40',
    icon: 'text-emerald-500',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  muted: {
    card: 'bg-muted/50 border-border',
    icon: 'text-muted-foreground',
    value: 'text-foreground',
  },
};

export function SummaryStatCard({
  value,
  label,
  icon: Icon,
  variant = 'muted',
  to,
  className,
}: SummaryStatCardProps) {
  const styles = variantStyles[variant];

  const content = (
    <div
      className={cn(
        'rounded-xl border p-3 flex flex-col items-center gap-1 transition-colors',
        styles.card,
        to && 'hover:opacity-80 cursor-pointer',
        className,
      )}
    >
      <Icon className={cn('h-4 w-4', styles.icon)} />
      <span className={cn('text-xl font-bold leading-none', styles.value)}>
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
        {label}
      </span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}
