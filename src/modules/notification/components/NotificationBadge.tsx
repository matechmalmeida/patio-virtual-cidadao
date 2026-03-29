import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUnreadCount } from '../hooks/useNotifications';
import { NotificationList } from './NotificationList';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className={cn(
                'absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1',
              )}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end" sideOffset={8}>
        <NotificationList onClose={() => setOpen(false)} compact />
      </PopoverContent>
    </Popover>
  );
}

export function NotificationBadge({ className }: { className?: string }) {
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;

  if (unreadCount === 0) return null;

  return (
    <span className={cn(
      'min-w-[18px] h-[18px] bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1',
      className,
    )}>
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}
