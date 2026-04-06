import { httpGet, httpPost } from '@/services/http/http-client';
import type {
  ReturnTransferRequest,
  ReturnTransferListResponse,
  CreateReturnTransferInput,
  WithdrawalAppointment,
  WithdrawalAppointmentDetail,
  WithdrawalAppointmentListResponse,
} from '../types/return-transfer';

export async function listMyReturnRequests(page = 1): Promise<ReturnTransferListResponse> {
  const params = new URLSearchParams({ type: 'return', page: String(page), limit: '10' });
  return httpGet<ReturnTransferListResponse>(`/v1/me/requests?${params}`);
}

export async function getMyReturnRequest(id: string): Promise<ReturnTransferRequest> {
  return httpGet<ReturnTransferRequest>(`/v1/me/requests/${id}`);
}

export async function listMyWithdrawalAppointments(page = 1): Promise<WithdrawalAppointmentListResponse> {
  const params = new URLSearchParams({ page: String(page) });
  return httpGet<WithdrawalAppointmentListResponse>(`/v1/seizures/citizen/withdrawal-appointments?${params}`);
}

export async function getWithdrawalAppointment(id: string): Promise<WithdrawalAppointmentDetail> {
  return httpGet<WithdrawalAppointmentDetail>(`/v1/seizures/citizen/withdrawal-appointments/${id}`);
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

export async function requestWithdrawal(seizureId: string, slotId: string, notes?: string): Promise<WithdrawalAppointment> {
  return httpPost<WithdrawalAppointment>(`/v1/seizures/citizen/${seizureId}/request-withdrawal`, { slotId, notes });
}

export async function requestTransfer(
  seizureId: string,
  data: { departureAt: string; destinationAddress: string; destinationLat: number; destinationLng: number; destinationRadiusMeters?: number; notes?: string }
) {
  return httpPost(`/v1/seizures/citizen/${seizureId}/request-transfer`, data);
}
