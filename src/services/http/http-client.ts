import { ApiError, toApiError } from './api-error';
import { requestWithPolicy, type RequestPolicy } from './client';
import { getFingerprint } from '@/modules/auth/store/fingerprint-store';

export interface HttpClientConfig {
  baseUrl: string;
  onUnauthorized: () => void;
  onForbidden?: () => void;
}

export interface HttpRequestOptions extends RequestPolicy {
  headers?: Record<string, string>;
  skipCsrf?: boolean;
  skipAuthRefresh?: boolean;
}

let globalConfig: HttpClientConfig | null = null;
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export function configureHttpClient(config: HttpClientConfig): void {
  globalConfig = config;
}

export function getHttpClient(): HttpClientConfig | null {
  return globalConfig;
}

let storedCsrfToken: string | null = null;

export function getCsrfToken(): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrf_token='));
  if (match) {
    return decodeURIComponent(match.split('=')[1]);
  }
  return storedCsrfToken;
}

export function setCsrfToken(token: string | null): void {
  storedCsrfToken = token;
}

function buildHeaders(method: string, options?: HttpRequestOptions): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const needsCsrf = !options?.skipCsrf && !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());
  if (needsCsrf) {
    const csrf = getCsrfToken();
    if (csrf) {
      headers['x-csrf-token'] = csrf;
    }
  }

  return headers;
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const msg = (body as { message: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  return fallback;
}

function handleResponseError(status: number, body: unknown): never {
  if (status === 401) {
    const message = extractMessage(body, 'Credenciais invalidas.');
    throw new ApiError({
      code: 'UNAUTHORIZED',
      status: 401,
      message,
      userMessage: message,
      details: body,
    });
  }

  if (status === 403) {
    globalConfig?.onForbidden?.();
    const message = extractMessage(body, 'Voce nao tem permissao para esta acao.');
    throw new ApiError({
      code: 'FORBIDDEN',
      status: 403,
      message,
      userMessage: message,
      details: body,
    });
  }

  if (status === 404) {
    throw new ApiError({
      code: 'NOT_FOUND',
      status: 404,
      message: 'Not found',
      userMessage: 'Recurso nao encontrado.',
    });
  }

  if (status === 400) {
    const detail = extractMessage(body, 'Dados invalidos.');
    throw new ApiError({
      code: 'VALIDATION',
      status: 400,
      message: detail,
      userMessage: detail,
      details: body,
    });
  }

  if (status === 429) {
    const message = extractMessage(body, 'Muitas tentativas. Aguarde e tente novamente.');
    throw new ApiError({
      code: 'VALIDATION',
      status: 429,
      message,
      userMessage: message,
      details: body,
    });
  }

  if (status >= 500) {
    throw new ApiError({
      code: 'SERVER',
      status,
      message: 'Server error',
      userMessage: 'Erro no servidor. Tente novamente mais tarde.',
      retriable: true,
    });
  }

  throw new ApiError({
    code: 'UNKNOWN',
    status,
    message: `Unexpected status ${status}`,
    userMessage: 'Ocorreu um erro inesperado.',
  });
}

export async function tryRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const baseUrl = globalConfig?.baseUrl ?? '';
      const response = await fetch(`${baseUrl}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(getFingerprint() ? { fingerprint: getFingerprint() } : {}),
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  options?: HttpRequestOptions,
): Promise<T> {
  const baseUrl = globalConfig?.baseUrl ?? '';
  const fullUrl = `${baseUrl}${url}`;
  const headers = buildHeaders(method, options);

  return requestWithPolicy(async () => {
    let response: Response;

    try {
      response = await fetch(fullUrl, {
        method,
        headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      throw toApiError(error);
    }

    if (response.status === 401 && !options?.skipAuthRefresh) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        try {
          const retryHeaders = buildHeaders(method, options);
          response = await fetch(fullUrl, {
            method,
            headers: retryHeaders,
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
          });
        } catch (error) {
          throw toApiError(error);
        }
      }
    }

    if (!response.ok) {
      if (response.status === 401 && !options?.skipAuthRefresh) {
        globalConfig?.onUnauthorized();
      }

      let responseBody: unknown = null;
      try {
        responseBody = await response.json();
      } catch {
        // ignore parse error
      }
      handleResponseError(response.status, responseBody);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }, options);
}

export function httpGet<T>(url: string, options?: HttpRequestOptions): Promise<T> {
  return request<T>('GET', url, undefined, options);
}

export function httpPost<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
  return request<T>('POST', url, body, options);
}

export function httpPut<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
  return request<T>('PUT', url, body, options);
}

export function httpPatch<T>(url: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
  return request<T>('PATCH', url, body, options);
}

export function httpDelete<T>(url: string, options?: HttpRequestOptions): Promise<T> {
  return request<T>('DELETE', url, undefined, options);
}
