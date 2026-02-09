import { ApiError, toApiError } from './api-error';

export interface RequestPolicy {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

const DEFAULT_POLICY: Required<RequestPolicy> = {
  timeoutMs: 8000,
  retries: 1,
  retryDelayMs: 350,
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new ApiError({
          code: 'TIMEOUT',
          message: 'Request timeout',
          userMessage: 'A requisição demorou demais. Tente novamente.',
          retriable: true,
        })
      );
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation(), timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function requestWithPolicy<T>(
  operation: () => Promise<T>,
  policy?: RequestPolicy
): Promise<T> {
  const resolvedPolicy: Required<RequestPolicy> = {
    ...DEFAULT_POLICY,
    ...policy,
  };

  let attempt = 0;

  while (attempt <= resolvedPolicy.retries) {
    try {
      return await withTimeout(operation, resolvedPolicy.timeoutMs);
    } catch (error) {
      const apiError = toApiError(error);

      if (!apiError.retriable || attempt === resolvedPolicy.retries) {
        throw apiError;
      }

      attempt += 1;
      await sleep(resolvedPolicy.retryDelayMs * attempt);
    }
  }

  throw new ApiError({
    code: 'UNKNOWN',
    message: 'Retry loop exhausted unexpectedly',
    userMessage: 'Não foi possível concluir a operação. Tente novamente.',
  });
}
