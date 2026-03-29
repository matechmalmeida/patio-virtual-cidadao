import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, AlertTriangle, Megaphone, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePendingAcknowledgments, useAcknowledgeNotification } from '../hooks/useNotifications';
import {
  notificationIconColors,
  notificationPriorityColors,
  notificationPriorityLabels,
  type NotificationType,
} from '../types/notification';

const iconMap: Record<NotificationType, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  alert: AlertCircle,
  announcement: Megaphone,
};

export function NotificationModal() {
  const { data: pendingNotifications = [], isLoading } = usePendingAcknowledgments();
  const acknowledgeMutation = useAcknowledgeNotification();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentNotification = pendingNotifications[currentIndex];
  const hasMore = currentIndex < pendingNotifications.length - 1;
  const isOpen = pendingNotifications.length > 0 && !isLoading;

  const handleAcknowledge = async () => {
    if (!currentNotification) return;

    try {
      await acknowledgeMutation.mutateAsync(currentNotification.notificationId);

      if (hasMore) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    } catch {
      // handled by mutation error toast
    }
  };

  const handleActionClick = () => {
    if (currentNotification?.actionUrl) {
      try {
        const url = new URL(currentNotification.actionUrl);
        navigate(url.pathname + url.search);
      } catch {
        navigate(currentNotification.actionUrl);
      }
      handleAcknowledge();
    }
  };

  useEffect(() => {
    if (pendingNotifications.length === 0) {
      setCurrentIndex(0);
    }
  }, [pendingNotifications.length]);

  if (!currentNotification) return null;

  const Icon = iconMap[currentNotification.type] || Info;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-lg"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-3 mb-4">
          <Icon
            className={cn(
              'h-6 w-6 flex-shrink-0',
              notificationIconColors[currentNotification.type],
            )}
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold leading-none tracking-tight">
              {currentNotification.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {(currentNotification.priority === 'high' ||
            currentNotification.priority === 'critical') && (
            <>
              <span
                className={cn(
                  'text-xs font-medium',
                  notificationPriorityColors[currentNotification.priority],
                )}
              >
                {notificationPriorityLabels[currentNotification.priority]}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
            </>
          )}
          {pendingNotifications.length > 1 && (
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} de {pendingNotifications.length}
            </span>
          )}
        </div>

        <div className="mb-6">
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {currentNotification.content}
          </p>
        </div>

        <DialogFooter
          className={cn(currentNotification.actionUrl ? 'flex-col sm:flex-row gap-2' : '')}
        >
          {currentNotification.actionUrl && (
            <Button
              variant="outline"
              onClick={handleActionClick}
              disabled={acknowledgeMutation.isPending}
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              {currentNotification.actionLabel || 'Ver detalhes'}
            </Button>
          )}
          <Button
            onClick={handleAcknowledge}
            disabled={acknowledgeMutation.isPending}
            className="w-full"
          >
            {acknowledgeMutation.isPending ? 'Confirmando...' : 'Confirmar leitura'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
