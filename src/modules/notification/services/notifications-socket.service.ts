import { io, type Socket } from 'socket.io-client';
import { tryRefresh } from '@/services/http/http-client';
import type {
  NotificationsSocketConfig,
  NotificationAuthenticatedPayload,
  NotificationNewPayload,
  NotificationReadPayload,
  NotificationCountPayload,
  NotificationDeletedPayload,
  NotificationAcknowledgedPayload,
} from '../types/websocket';

const NOTIFICATIONS_NAMESPACE = '/notifications';

function getWsUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL || '';
  const url = base.replace(/\/api\/?$/, '');
  if (!url) {
    return `${window.location.protocol}//${window.location.hostname}:8010`;
  }
  return url;
}

class NotificationsSocketService {
  private socket: Socket | null = null;
  private config: NotificationsSocketConfig | null = null;
  private authRefreshAttempts = 0;
  private static readonly MAX_AUTH_REFRESH_ATTEMPTS = 3;

  connect(config: NotificationsSocketConfig): void {
    if (this.socket?.connected) return;

    this.config = config;

    this.socket = io(`${getWsUrl()}${NOTIFICATIONS_NAMESPACE}`, {
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      transports: ['websocket', 'polling'],
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.removeEventListeners();
      this.socket = null;
      this.config = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  private setupEventListeners(): void {
    if (!this.socket || !this.config) return;

    this.socket.on('connect', () => {
      this.authRefreshAttempts = 0;
    });

    this.socket.io.on('reconnect', () => {
      this.authRefreshAttempts = 0;
    });

    this.socket.on('authenticated', (data: NotificationAuthenticatedPayload) => {
      this.config?.onAuthenticated?.(data);
    });

    this.socket.on('notification:new', (data: NotificationNewPayload) => {
      this.config?.onNewNotification?.(data);
    });

    this.socket.on('notification:read', (data: NotificationReadPayload) => {
      this.config?.onNotificationRead?.(data);
    });

    this.socket.on('notification:count', (data: NotificationCountPayload) => {
      this.config?.onCountUpdate?.(data);
    });

    this.socket.on('notification:deleted', (data: NotificationDeletedPayload) => {
      this.config?.onNotificationDeleted?.(data);
    });

    this.socket.on('notification:acknowledged', (data: NotificationAcknowledgedPayload) => {
      this.config?.onNotificationAcknowledged?.(data);
    });

    this.socket.on('connect_error', (error) => {
      const isAuthError =
        error.message.includes('Authentication') ||
        error.message.includes('token') ||
        error.message.includes('Unauthorized');

      if (isAuthError) {
        this.refreshTokenOnly();
      }
    });

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        this.refreshTokenAndReconnect();
      }
    });
  }

  private async refreshTokenOnly(): Promise<void> {
    if (this.authRefreshAttempts >= NotificationsSocketService.MAX_AUTH_REFRESH_ATTEMPTS) return;
    this.authRefreshAttempts++;
    await tryRefresh();
  }

  private async refreshTokenAndReconnect(): Promise<void> {
    if (this.authRefreshAttempts >= NotificationsSocketService.MAX_AUTH_REFRESH_ATTEMPTS) return;
    this.authRefreshAttempts++;

    const refreshed = await tryRefresh();
    if (refreshed && this.socket && !this.socket.connected) {
      this.socket.connect();
    }
  }

  private removeEventListeners(): void {
    if (!this.socket) return;

    this.socket.off('connect');
    this.socket.io.off('reconnect');
    this.socket.off('authenticated');
    this.socket.off('notification:new');
    this.socket.off('notification:read');
    this.socket.off('notification:count');
    this.socket.off('notification:deleted');
    this.socket.off('notification:acknowledged');
    this.socket.off('connect_error');
    this.socket.off('disconnect');
    this.socket.off('error');
  }
}

export const notificationsSocketService = new NotificationsSocketService();
