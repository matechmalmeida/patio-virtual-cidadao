import { cn } from '@/lib/utils';
import type { Notification } from '../types/notification';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Info, AlertTriangle, AlertOctagon, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

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
  onDelete?: (id: string) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  selectionMode,
  selected,
  onToggleSelect,
}: NotificationItemProps) {
  const Icon = typeIcons[notification.type];

  const handleClick = () => {
    if (selectionMode) {
      onToggleSelect?.(notification.id);
    } else if (!notification.read) {
      onMarkRead?.(notification.id);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border border-l-4 bg-card p-4 transition-colors',
        typeStyles[notification.type],
        !notification.read && 'bg-primary/[0.03]',
        selectionMode && selected && 'ring-2 ring-primary/50'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        {selectionMode && (
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect?.(notification.id)}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 shrink-0"
          />
        )}
        <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', iconColors[notification.type])} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 pr-8">
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
      {!selectionMode && onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
