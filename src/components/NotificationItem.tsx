import { cn } from '@/lib/utils';
import type { Notification } from '@/types/case';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';

const typeIcons = {
  info: Info,
  alert: AlertTriangle,
  critical: AlertOctagon,
};

const typeStyles = {
  info: 'border-l-info',
  alert: 'border-l-warning',
  critical: 'border-l-destructive',
};

const iconColors = {
  info: 'text-info',
  alert: 'text-warning',
  critical: 'text-destructive',
};

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const Icon = typeIcons[notification.type];

  return (
    <div
      className={cn(
        'rounded-lg border border-l-4 bg-card p-4 transition-colors',
        typeStyles[notification.type],
        !notification.read && 'bg-primary/[0.03]'
      )}
      onClick={() => !notification.read && onMarkRead?.(notification.id)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', iconColors[notification.type])} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn('text-sm font-semibold', !notification.read && 'text-foreground')}>
              {notification.title}
            </h3>
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-muted-foreground/70">
              {format(new Date(notification.timestamp), "dd/MM 'às' HH:mm", { locale: ptBR })}
            </span>
            {notification.actionLink && notification.actionLabel && (
              <Link
                to={notification.actionLink}
                className="text-xs text-primary font-medium hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {notification.actionLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
