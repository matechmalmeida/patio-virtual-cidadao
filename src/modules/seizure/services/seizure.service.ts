import { httpGet, httpPost } from '@/services/http/http-client';
import type { SeizureTermResponse, GeofenceStatus, GeofenceCheckResult, SeizureListResponse, SeizureDetailResponse } from '../types/seizure';

// === LIST ===

export async function listMySeizures(page = 1): Promise<SeizureListResponse> {
  const params = new URLSearchParams({ page: String(page), limit: '10' });
  return httpGet<SeizureListResponse>(`/v1/seizures/citizen?${params}`);
}

// === DETAIL ===

export async function getSeizureById(id: string): Promise<SeizureDetailResponse> {
  return httpGet<SeizureDetailResponse>(`/v1/seizures/citizen/${id}`);
}

// === TERMS ===

export async function getTermForSeizure(seizureId: string): Promise<SeizureTermResponse> {
  return httpGet<SeizureTermResponse>(`/v1/terms/seizure/${seizureId}`);
}

export async function signTerm(
  seizureId: string,
  accepted: boolean,
  refusalReason?: string,
): Promise<SeizureTermResponse> {
  return httpPost<SeizureTermResponse>(`/v1/terms/seizure/${seizureId}/sign`, {
    accepted,
    refusalReason,
  });
}

// === GEOFENCE ===

export async function getGeofenceStatus(seizureId: string): Promise<GeofenceStatus> {
  return httpGet<GeofenceStatus>(`/v1/geofences/seizure/${seizureId}`);
}

export async function checkPosition(
  seizureId: string,
  latitude: number,
  longitude: number,
): Promise<GeofenceCheckResult> {
  return httpPost<GeofenceCheckResult>(`/v1/geofences/seizure/${seizureId}/check`, {
    latitude,
    longitude,
  });
}

export async function setGeofence(
  seizureId: string,
  data: {
    latitude: number;
    longitude: number;
    radiusMeters?: number;
    address?: string;
    deadlineHours: number;
  },
) {
  return httpPost(`/v1/geofences/seizure/${seizureId}`, data);
}
