import { useCallback, useMemo } from 'react';
import { useCases } from '@/modules/process';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  markBatchAsRead,
  deleteBatch,
} from '../services/notification.service';
import { getApiErrorMessage } from '@/services/http/api-error';
import type { Notification } from '../types/notification';

type Filter = 'todos' | 'importantes' | 'pendentes';

export function useNotifications() {
  const { currentCase, updateCase } = useCases();

  const notifications: Notification[] = currentCase?.notifications ?? [];

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      if (!currentCase) return;
      const updated = await markAsRead(currentCase, notificationId);
      updateCase(currentCase.id, { notifications: updated });
    },
    [currentCase, updateCase]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!currentCase) return;
    const updated = await markAllAsRead(currentCase);
    updateCase(currentCase.id, { notifications: updated });
  }, [currentCase, updateCase]);

  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      if (!currentCase) return;
      const updated = await deleteNotification(currentCase, notificationId);
      updateCase(currentCase.id, { notifications: updated });
    },
    [currentCase, updateCase]
  );

  const handleMarkBatchAsRead = useCallback(
    async (ids: string[]) => {
      if (!currentCase) return;
      const updated = await markBatchAsRead(currentCase, ids);
      updateCase(currentCase.id, { notifications: updated });
    },
    [currentCase, updateCase]
  );

  const handleDeleteBatch = useCallback(
    async (ids: string[]) => {
      if (!currentCase) return;
      const updated = await deleteBatch(currentCase, ids);
      updateCase(currentCase.id, { notifications: updated });
    },
    [currentCase, updateCase]
  );

  const getFiltered = useCallback(
    (filter: Filter): Notification[] => {
      if (filter === 'importantes') return notifications.filter((n) => n.type === 'critical' || n.type === 'alert');
      if (filter === 'pendentes') return notifications.filter((n) => !n.read);
      return notifications;
    },
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    markBatchAsRead: handleMarkBatchAsRead,
    deleteBatch: handleDeleteBatch,
    getFiltered,
  };
}
