import { cn } from '@/lib/utils';
import type { CaseStatus } from '@/types/case';
import { StatusBadge } from './StatusBadge';
import { useTranslation } from 'react-i18next';
import {
  Navigation,
  Home,
  FileWarning,
  Clock,
  CheckCircle2,
  CalendarCheck,
  PartyPopper,
} from 'lucide-react';

const statusIcons: Record<CaseStatus, React.ReactNode> = {
  em_deslocamento: <Navigation className="h-8 w-8" />,
  custodia_domiciliar: <Home className="h-8 w-8" />,
  pendencias_regularizar: <FileWarning className="h-8 w-8" />,
  aguardando_validacao: <Clock className="h-8 w-8" />,
  apto_retirada: <CheckCircle2 className="h-8 w-8" />,
  aguardando_retirada: <CalendarCheck className="h-8 w-8" />,
  finalizado: <PartyPopper className="h-8 w-8" />,
};

const statusCardStyles: Record<CaseStatus, string> = {
  em_deslocamento: 'border-info/30 bg-info/5',
  custodia_domiciliar: 'border-warning/30 bg-warning/5',
  pendencias_regularizar: 'border-warning/30 bg-warning/5',
  aguardando_validacao: 'border-info/30 bg-info/5',
  apto_retirada: 'border-success/30 bg-success/5',
  aguardando_retirada: 'border-success/30 bg-success/5',
  finalizado: 'border-success/30 bg-success/5',
};

const iconColor: Record<CaseStatus, string> = {
  em_deslocamento: 'text-info',
  custodia_domiciliar: 'text-warning',
  pendencias_regularizar: 'text-warning',
  aguardando_validacao: 'text-info',
  apto_retirada: 'text-success',
  aguardando_retirada: 'text-success',
  finalizado: 'text-success',
};

interface StatusCardProps {
  status: CaseStatus;
  timeRemainingMinutes?: number;
  className?: string;
}

export function StatusCard({ status, timeRemainingMinutes, className }: StatusCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-5 animate-slide-up',
        statusCardStyles[status],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('mt-0.5', iconColor[status])}>
          {statusIcons[status]}
        </div>
        <div className="flex-1 min-w-0">
          <StatusBadge status={status} label={t(`status.${status}`)} className="mb-2" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            {t(`status.desc_${status}`)}
          </p>

          {status === 'em_deslocamento' && timeRemainingMinutes != null && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">{t('status.timeRemaining')}</span>
                <span className="font-bold text-info">{timeRemainingMinutes} min</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-info transition-all duration-500"
                  style={{ width: `${Math.max(5, ((60 - timeRemainingMinutes) / 60) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
