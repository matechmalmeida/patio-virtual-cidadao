import { cn } from '@/lib/utils';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'warning' | 'success' | 'error';

const variants: Record<AlertVariant, { bg: string; icon: typeof Info; iconColor: string }> = {
  info: { bg: 'bg-info/10 border-info/30', icon: Info, iconColor: 'text-info' },
  warning: { bg: 'bg-warning/10 border-warning/30', icon: AlertTriangle, iconColor: 'text-warning' },
  success: { bg: 'bg-success/10 border-success/30', icon: CheckCircle2, iconColor: 'text-success' },
  error: { bg: 'bg-destructive/10 border-destructive/30', icon: XCircle, iconColor: 'text-destructive' },
};

interface AlertBannerProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function AlertBanner({ variant = 'info', title, children, className }: AlertBannerProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-xl border p-4 flex items-start gap-3', config.bg, className)}>
      <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', config.iconColor)} />
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold mb-0.5">{title}</p>}
        <div className="text-xs text-foreground/80 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
