import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notificationsSocketService } from '../services/notifications-socket.service';
import { useAuth } from '@/modules/auth/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  NOTIFICATIONS_QUERY_KEY,
  UNREAD_COUNT_QUERY_KEY,
  PENDING_ACK_QUERY_KEY,
} from '../hooks/useNotifications';
import type {
  NotificationNewPayload,
  NotificationReadPayload,
  NotificationCountPayload,
  NotificationDeletedPayload,
  NotificationAcknowledgedPayload,
} from '../types/websocket';

export function NotificationsSocketProvider({ children }: { children: ReactNode }) {
  const { state } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const connectionAttempted = useRef(false);

  const handleNewNotification = useCallback(
    (data: NotificationNewPayload) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });

      queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], (old: { count: number } | undefined) => {
        return { count: (old?.count || 0) + 1 };
      });

      if (data.requiresAcknowledgment) {
        queryClient.invalidateQueries({ queryKey: [PENDING_ACK_QUERY_KEY] });
      }

      const isCritical = data.priority === 'critical' || data.priority === 'high';

      toast({
        title: data.title,
        description: data.content.substring(0, 120) + (data.content.length > 120 ? '...' : ''),
        variant: isCritical ? 'destructive' : 'default',
      });
    },
    [queryClient, toast],
  );

  const handleNotificationRead = useCallback(
    (_data: NotificationReadPayload) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], (old: { count: number } | undefined) => {
        return { count: Math.max(0, (old?.count || 0) - 1) };
      });
    },
    [queryClient],
  );

  const handleCountUpdate = useCallback(
    (data: NotificationCountPayload) => {
      queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], { count: data.unreadCount });
    },
    [queryClient],
  );

  const handleNotificationDeleted = useCallback(
    (_data: NotificationDeletedPayload) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
    [queryClient],
  );

  const handleNotificationAcknowledged = useCallback(
    (_data: NotificationAcknowledgedPayload) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PENDING_ACK_QUERY_KEY] });
    },
    [queryClient],
  );

  useEffect(() => {
    const { isAuthenticated } = state;

    if (isAuthenticated) {
      if (!connectionAttempted.current) {
        connectionAttempted.current = true;
        notificationsSocketService.connect({
          onNewNotification: handleNewNotification,
          onNotificationRead: handleNotificationRead,
          onCountUpdate: handleCountUpdate,
          onNotificationDeleted: handleNotificationDeleted,
          onNotificationAcknowledged: handleNotificationAcknowledged,
        });
      }
    } else if (!isAuthenticated && connectionAttempted.current) {
      notificationsSocketService.disconnect();
      connectionAttempted.current = false;
    }

    return () => {
      if (!isAuthenticated) {
        notificationsSocketService.disconnect();
        connectionAttempted.current = false;
      }
    };
  }, [
    state,
    handleNewNotification,
    handleNotificationRead,
    handleCountUpdate,
    handleNotificationDeleted,
    handleNotificationAcknowledged,
  ]);

  return <>{children}</>;
}
