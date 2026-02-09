export type NotificationType = 'info' | 'alert' | 'critical';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  actionLink?: string;
  actionLabel?: string;
}
