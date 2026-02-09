import { ApiError } from '@/services/http/api-error';
import { executeMockRequest } from '@/services/http/mock-adapter';
import type { Notification } from '../types/notification';
import type { CaseData } from '@/types/case';

function ensureCase(caseData: CaseData | null): asserts caseData is CaseData {
  if (!caseData) {
    throw new ApiError({
      code: 'NOT_FOUND',
      status: 404,
      message: 'Case not found',
      userMessage: 'Caso não encontrado.',
    });
  }
}

export async function fetchNotifications(
  caseData: CaseData | null
): Promise<Notification[]> {
  return executeMockRequest(() => {
    ensureCase(caseData);
    return caseData.notifications;
  }, { delayMs: 150 });
}

export async function markAsRead(
  caseData: CaseData | null,
  notificationId: string
): Promise<Notification[]> {
  return executeMockRequest(() => {
    ensureCase(caseData);
    return caseData.notifications.map((item) =>
      item.id === notificationId ? { ...item, read: true } : item
    );
  }, { delayMs: 180 });
}

export async function markAllAsRead(
  caseData: CaseData | null
): Promise<Notification[]> {
  return executeMockRequest(() => {
    ensureCase(caseData);
    return caseData.notifications.map((item) => ({ ...item, read: true }));
  }, { delayMs: 200 });
}
