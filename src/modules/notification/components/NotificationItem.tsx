import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Megaphone,
  MoreVertical,
  Trash2,
  CheckCheck,
  Loader2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  useMarkAsRead,
  useDeleteNotification,
  useAcknowledgeNotification,
} from '../hooks/useNotifications';
import {
  notificationIconColors,
  notificationBorderColors,
  notificationDotColors,
  notificationPriorityColors,
  notificationPriorityLabels,
  type UserNotification,
  type NotificationType,
} from '../types/notification';

interface NotificationItemProps {
  notification: UserNotification;
  onClose?: () => void;
}

const iconMap: Record<NotificationType, React.ElementType> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  alert: AlertCircle,
  announcement: Megaphone,
};

export function NotificationItem({ notification, onClose: _onClose }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const markAsReadMutation = useMarkAsRead();
  const deleteMutation = useDeleteNotification();
  const acknowledgeMutation = useAcknowledgeNotification();

  const Icon = iconMap[notification.type] || Info;

  const isProcessing =
    markAsReadMutation.isPending || deleteMutation.isPending || acknowledgeMutation.isPending;

  const handleClick = () => {
    if (isDropdownOpen) return;
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.notificationId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(notification.notificationId);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(notification.notificationId);
  };

  const handleAcknowledge = (e: React.MouseEvent) => {
    e.stopPropagation();
    acknowledgeMutation.mutate(notification.notificationId);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification.actionUrl) {
      try {
        const url = new URL(notification.actionUrl);
        navigate(url.pathname + url.search);
      } catch {
        navigate(notification.actionUrl);
      }
    }
  };

  return (
    <div
      className={cn(
        'group relative px-4 py-3 hover:bg-muted/70 transition-colors duration-200 cursor-pointer border-l-2',
        !notification.isRead ? notificationBorderColors[notification.type] : 'border-l-transparent',
        isProcessing && 'opacity-60 pointer-events-none',
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3 items-start">
        <Icon
          className={cn('h-5 w-5 mt-0.5 flex-shrink-0', notificationIconColors[notification.type])}
        />

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h4
                className={cn(
                  'text-sm line-clamp-1',
                  !notification.isRead ? 'font-semibold' : 'font-medium',
                )}
              >
                {notification.title}
              </h4>
              {!notification.isRead && (
                <div
                  className={cn(
                    'w-2 h-2 rounded-full flex-shrink-0',
                    notificationDotColors[notification.type],
                  )}
                />
              )}
            </div>

            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-7 w-7 transition-opacity duration-200',
                    isDropdownOpen || isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(true);
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => e.stopPropagation()}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {!notification.isRead && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(e);
                      setIsDropdownOpen(false);
                    }}
                    disabled={markAsReadMutation.isPending}
                  >
                    {markAsReadMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCheck className="h-4 w-4 mr-2" />
                    )}
                    Marcar como lida
                  </DropdownMenuItem>
                )}
                {notification.requiresAcknowledgment && !notification.acknowledgedAt && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcknowledge(e);
                      setIsDropdownOpen(false);
                    }}
                    disabled={acknowledgeMutation.isPending}
                  >
                    {acknowledgeMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Confirmar leitura
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(e);
                    setIsDropdownOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                  className="text-destructive"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {notification.content}
          </p>

          <div className="flex items-center justify-between gap-2 flex-wrap pt-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>

              {(notification.priority === 'high' || notification.priority === 'critical') && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      notificationPriorityColors[notification.priority],
                    )}
                  >
                    {notificationPriorityLabels[notification.priority]}
                  </span>
                </>
              )}

              {notification.requiresAcknowledgment && !notification.acknowledgedAt && (
                <Badge variant="destructive" className="text-xs font-normal ml-1">
                  Requer confirmação
                </Badge>
              )}
            </div>

            {notification.actionUrl && (
              <Button
                variant="default"
                size="sm"
                onClick={handleActionClick}
                className="h-7 px-3 text-xs font-medium gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                {notification.actionLabel || 'Ver detalhes'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
