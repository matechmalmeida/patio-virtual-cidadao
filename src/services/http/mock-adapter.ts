import { ApiError } from './api-error';
import { requestWithPolicy, type RequestPolicy } from './client';

export interface MockRequestOptions extends RequestPolicy {
  delayMs?: number;
  failRate?: number;
}

export async function executeMockRequest<T>(
  operation: () => T | Promise<T>,
  options?: MockRequestOptions
): Promise<T> {
  const delayMs = options?.delayMs ?? 220;
  const failRate = options?.failRate ?? 0;

  return requestWithPolicy(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });

    if (failRate > 0 && Math.random() < failRate) {
      throw new ApiError({
        code: 'NETWORK',
        message: 'Simulated network failure',
        userMessage: 'Falha de rede temporária. Tente novamente.',
        retriable: true,
      });
    }

    return operation();
  }, options);
}
