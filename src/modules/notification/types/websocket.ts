import type { NotificationType, NotificationPriority } from './notification';

export interface NotificationAuthenticatedPayload {
  message: string;
  userId: string;
}

export interface NotificationNewPayload {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
  requiresAcknowledgment: boolean;
  metadata: Record<string, unknown> | null;
  actionUrl: string | null;
  actionLabel: string | null;
  createdAt: string;
}

export interface NotificationReadPayload {
  notificationId: string;
  readAt: string;
}

export interface NotificationCountPayload {
  unreadCount: number;
}

export interface NotificationDeletedPayload {
  notificationId: string;
}

export interface NotificationAcknowledgedPayload {
  notificationId: string;
  acknowledgedAt: string;
}

export interface NotificationsSocketConfig {
  onAuthenticated?: (data: NotificationAuthenticatedPayload) => void;
  onNewNotification?: (data: NotificationNewPayload) => void;
  onNotificationRead?: (data: NotificationReadPayload) => void;
  onCountUpdate?: (data: NotificationCountPayload) => void;
  onNotificationDeleted?: (data: NotificationDeletedPayload) => void;
  onNotificationAcknowledged?: (data: NotificationAcknowledgedPayload) => void;
}
