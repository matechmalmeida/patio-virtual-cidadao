import { cn } from '@/lib/utils';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationBadgeProps {
  className?: string;
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const { unreadCount } = useNotifications();

  if (unreadCount === 0) return null;

  return (
    <span
      className={cn(
        'h-4 min-w-[1rem] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1',
        className
      )}
    >
      {unreadCount}
    </span>
  );
}
