import { httpGet, httpPut, httpDelete } from '@/services/http/http-client';
import type {
  UserNotification,
  UserNotificationRaw,
  NotificationsListParams,
  NotificationsListResponse,
} from '../types/notification';

const BASE_URL = '/v1/me/notifications';

interface RawNotificationsListResponse {
  data: UserNotificationRaw[];
  meta: NotificationsListResponse['meta'];
}

function transformUserNotification(raw: UserNotificationRaw): UserNotification {
  return {
    id: raw.id,
    notificationId: raw.notificationId,
    isRead: raw.isRead,
    readAt: raw.readAt,
    acknowledgedAt: raw.acknowledgedAt,
    title: raw.notification.title,
    content: raw.notification.content,
    type: raw.notification.type,
    priority: raw.notification.priority,
    requiresAcknowledgment: raw.notification.requiresAcknowledgment,
    metadata: raw.notification.metadata,
    actionUrl: raw.notification.actionUrl,
    actionLabel: raw.notification.actionLabel,
    createdAt: raw.notification.createdAt,
  };
}

export const notificationsService = {
  async list(params: NotificationsListParams = {}): Promise<NotificationsListResponse> {
    const searchParams = new URLSearchParams();

    if (params.isRead !== undefined) searchParams.set('isRead', String(params.isRead));
    if (params.type) searchParams.set('type', params.type);
    if (params.priority) searchParams.set('priority', params.priority);
    if (params.requiresAcknowledgment !== undefined) {
      searchParams.set('requiresAcknowledgment', String(params.requiresAcknowledgment));
    }
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;

    const response = await httpGet<RawNotificationsListResponse>(url);

    return {
      data: response.data.map(transformUserNotification),
      meta: response.meta,
    };
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return httpGet<{ count: number }>(`${BASE_URL}/unread-count`);
  },

  async getPendingAcknowledgments(): Promise<UserNotification[]> {
    const response = await httpGet<UserNotificationRaw[]>(`${BASE_URL}/pending-acknowledgments`);
    return response.map(transformUserNotification);
  },

  async markAsRead(id: string): Promise<void> {
    await httpPut(`${BASE_URL}/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    return httpPut(`${BASE_URL}/read-all`);
  },

  async acknowledge(id: string): Promise<void> {
    await httpPut(`${BASE_URL}/${id}/acknowledge`);
  },

  async delete(id: string): Promise<void> {
    return httpDelete(`${BASE_URL}/${id}`);
  },

  async deleteAllRead(): Promise<{ message: string; count: number }> {
    return httpDelete<{ message: string; count: number }>(`${BASE_URL}/all`);
  },
};
