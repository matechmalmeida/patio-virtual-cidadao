import { httpGet, httpPost } from '@/services/http/http-client';
import type { CitizenTermsResponse, CitizenSignTermResponse } from '../types/citizen-term';

export async function getInstallationTerms(): Promise<CitizenTermsResponse> {
  const params = new URLSearchParams({ step: 'instalacao-equipamento', status: 'active' });
  return httpGet<CitizenTermsResponse>(`/v1/cidadao/terms?${params}`);
}

export async function signCitizenTerm(termId: string): Promise<CitizenSignTermResponse> {
  return httpPost<CitizenSignTermResponse>(`/v1/cidadao/terms/${termId}/sign`, {
    accepted: true,
  });
}
