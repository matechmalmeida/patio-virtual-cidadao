import { cn } from '@/lib/utils';
import type { TimelineEvent } from '@/types/case';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
};

const lineBg = {
  info: 'bg-info/30',
  success: 'bg-success/30',
  warning: 'bg-warning/30',
  error: 'bg-destructive/30',
};

interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
}

export function TimelineItem({ event, isLast }: TimelineItemProps) {
  const Icon = event.completed ? typeIcons[event.type] : Circle;
  const colorClass = event.completed ? typeColors[event.type] : 'text-muted-foreground/40';

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn('mt-0.5', colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
        {!isLast && (
          <div
            className={cn(
              'w-0.5 flex-1 min-h-[2rem] mt-1',
              event.completed ? lineBg[event.type] : 'bg-border'
            )}
          />
        )}
      </div>

      <div className={cn('pb-6 flex-1', !event.completed && 'opacity-50')}>
        <p className="text-sm font-semibold leading-tight">{event.title}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {event.description}
        </p>
        {event.timestamp && (
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            {format(new Date(event.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        )}
        {event.link && event.linkLabel && (
          <Link
            to={event.link}
            className="text-xs text-primary font-medium mt-1 inline-block hover:underline"
          >
            {event.linkLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
