import { ApiError, toApiError } from './api-error';
import { requestWithPolicy, type RequestPolicy } from './client';

export interface HttpClientConfig {
  baseUrl: string;
  getToken: () => string | null;
  onUnauthorized: () => void;
  onForbidden?: () => void;
}

export interface HttpRequestOptions extends RequestPolicy {
  headers?: Record<string, string>;
}

let globalConfig: HttpClientConfig | null = null;

export function configureHttpClient(config: HttpClientConfig): void {
  globalConfig = config;
}

export function getHttpClient(): HttpClientConfig | null {
  return globalConfig;
}

function buildHeaders(options?: HttpRequestOptions): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (globalConfig) {
    const token = globalConfig.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

function handleResponseError(status: number, body: unknown): never {
  if (status === 401) {
    globalConfig?.onUnauthorized();
    throw new ApiError({
      code: 'UNAUTHORIZED',
      status: 401,
      message: 'Unauthorized',
      userMessage: 'Sessao expirada. Faca login novamente.',
    });
  }

  if (status === 403) {
    globalConfig?.onForbidden?.();
    throw new ApiError({
      code: 'FORBIDDEN',
      status: 403,
      message: 'Forbidden',
      userMessage: 'Voce nao tem permissao para esta acao.',
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
    const detail = body && typeof body === 'object' && 'message' in body
      ? (body as { message: string }).message
      : 'Dados invalidos.';
    throw new ApiError({
      code: 'VALIDATION',
      status: 400,
      message: detail,
      userMessage: detail,
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

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  options?: HttpRequestOptions,
): Promise<T> {
  const baseUrl = globalConfig?.baseUrl ?? '';
  const fullUrl = `${baseUrl}${url}`;
  const headers = buildHeaders(options);

  return requestWithPolicy(async () => {
    let response: Response;

    try {
      response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      throw toApiError(error);
    }

    if (!response.ok) {
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
