export type NotificationType = 'info' | 'success' | 'warning' | 'alert' | 'announcement';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export interface UserNotificationData {
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

export interface UserNotificationRaw {
  id: string;
  userId: string;
  notificationId: string;
  isRead: boolean;
  readAt: string | null;
  acknowledgedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  notification: UserNotificationData;
}

export interface UserNotification {
  id: string;
  notificationId: string;
  isRead: boolean;
  readAt: string | null;
  acknowledgedAt: string | null;
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

export interface NotificationsListParams {
  isRead?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  requiresAcknowledgment?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationsListResponse {
  data: UserNotification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    unreadCount: number;
    pendingAcknowledgmentCount: number;
  };
}

export const notificationTypeLabels: Record<NotificationType, string> = {
  info: 'Informacao',
  success: 'Sucesso',
  warning: 'Aviso',
  alert: 'Alerta',
  announcement: 'Comunicado',
};

export const notificationIconColors: Record<NotificationType, string> = {
  info: 'text-sky-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  alert: 'text-rose-500',
  announcement: 'text-violet-500',
};

export const notificationBorderColors: Record<NotificationType, string> = {
  info: 'border-l-sky-500',
  success: 'border-l-emerald-500',
  warning: 'border-l-amber-500',
  alert: 'border-l-rose-500',
  announcement: 'border-l-violet-500',
};

export const notificationDotColors: Record<NotificationType, string> = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  alert: 'bg-rose-500',
  announcement: 'bg-violet-500',
};

export const notificationPriorityLabels: Record<NotificationPriority, string> = {
  low: 'Baixa',
  normal: 'Normal',
  high: 'Alta',
  critical: 'Critica',
};

export const notificationPriorityColors: Record<NotificationPriority, string> = {
  low: 'text-muted-foreground',
  normal: 'text-muted-foreground',
  high: 'text-amber-600 dark:text-amber-400',
  critical: 'text-rose-600 dark:text-rose-400',
};
