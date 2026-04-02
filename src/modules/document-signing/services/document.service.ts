import { httpGet } from '@/services/http/http-client';

export interface CitizenTermItem {
  id: string;
  seizureId: string;
  seizureNumber: string;
  seizureStatus: string;
  vehiclePlate: string;
  vehicleDescription: string | null;
  termTemplateId: string;
  title: string;
  version: number;
  signed: boolean;
  signedAt: string | null;
  signedBy: { id: string; name: string } | null;
  refused: boolean;
  refusedAt: string | null;
  refusalReason: string | null;
}

export interface CitizenTermsResponse {
  terms: CitizenTermItem[];
}

export async function getCitizenTerms(): Promise<CitizenTermsResponse> {
  return httpGet<CitizenTermsResponse>('/v1/terms/citizen');
}
