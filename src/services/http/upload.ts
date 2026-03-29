import { getCsrfToken, getHttpClient } from './http-client';
import { ApiError } from './api-error';

export interface UploadConfig {
  endpoint: string;
  fieldName: string;
  file: File;
}

export async function uploadFile<T>(config: UploadConfig): Promise<T> {
  const { endpoint, fieldName, file } = config;
  const formData = new FormData();
  formData.append(fieldName, file);

  const csrfToken = getCsrfToken();
  const headers: HeadersInit = {};

  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }

  const baseUrl = getHttpClient()?.baseUrl ?? '';

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao fazer upload' }));
    throw new ApiError({
      code: 'UNKNOWN',
      status: response.status,
      message: error.message || 'Erro ao fazer upload do arquivo',
      userMessage: error.message || 'Erro ao fazer upload do arquivo',
    });
  }

  return response.json();
}
