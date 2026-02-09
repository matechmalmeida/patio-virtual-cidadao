export type ApiErrorCode =
  | 'TIMEOUT'
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN';

export interface ApiErrorOptions {
  code: ApiErrorCode;
  status?: number;
  message: string;
  userMessage?: string;
  retriable?: boolean;
  details?: unknown;
}

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly userMessage: string;
  readonly retriable: boolean;
  readonly details?: unknown;

  constructor(options: ApiErrorOptions) {
    super(options.message);
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status;
    this.userMessage = options.userMessage ?? 'Não foi possível concluir a operação.';
    this.retriable = options.retriable ?? false;
    this.details = options.details;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return new ApiError({
      code: 'TIMEOUT',
      message: error.message,
      userMessage: 'A requisição demorou demais. Tente novamente.',
      retriable: true,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      code: 'UNKNOWN',
      message: error.message,
      userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
      retriable: false,
      details: error,
    });
  }

  return new ApiError({
    code: 'UNKNOWN',
    message: 'Unknown error',
    userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
    retriable: false,
    details: error,
  });
}

export function getApiErrorMessage(error: unknown, fallback = 'Não foi possível concluir a operação.'): string {
  if (error instanceof ApiError) {
    return error.userMessage;
  }
  return fallback;
}
