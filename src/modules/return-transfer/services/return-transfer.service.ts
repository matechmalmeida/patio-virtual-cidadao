import { httpGet, httpPost } from '@/services/http/http-client';
import type {
  ReturnTransferRequest,
  ReturnTransferListResponse,
  CreateReturnTransferInput,
} from '../types/return-transfer';

export async function listMyReturnRequests(page = 1): Promise<ReturnTransferListResponse> {
  const params = new URLSearchParams({ type: 'return', page: String(page), limit: '10' });
  return httpGet<ReturnTransferListResponse>(`/v1/me/requests?${params}`);
}

export async function getMyReturnRequest(id: string): Promise<ReturnTransferRequest> {
  return httpGet<ReturnTransferRequest>(`/v1/me/requests/${id}`);
}

export async function createReturnRequest(data: CreateReturnTransferInput): Promise<ReturnTransferRequest> {
  return httpPost<ReturnTransferRequest>('/v1/me/requests', {
    type: 'return',
    notes: data.notes,
    parameters: data.parameters,
    items: data.items,
  });
}

export async function cancelReturnRequest(id: string, reason: string): Promise<ReturnTransferRequest> {
  return httpPost<ReturnTransferRequest>(`/v1/me/requests/${id}/cancel`, { reason });
}
