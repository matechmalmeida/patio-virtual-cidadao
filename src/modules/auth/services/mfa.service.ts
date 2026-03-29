import { httpGet, httpPost } from '@/services/http/http-client';
import type {
  TOTPStatus,
  EnrollResult,
  EnableTOTPResponse,
  RegenerateBackupCodesResponse,
} from '../types/auth';

const TOTP_URL = '/v1/profile/totp';

export const mfaService = {
  async getTOTPStatus(): Promise<TOTPStatus> {
    return httpGet<TOTPStatus>(`${TOTP_URL}/status`);
  },

  async getTOTPFactors(): Promise<TOTPStatus> {
    return httpGet<TOTPStatus>(`${TOTP_URL}/factors`);
  },

  async setupTOTP(reauthToken: string): Promise<EnrollResult> {
    return httpPost<EnrollResult>(`${TOTP_URL}/setup`, undefined, {
      headers: { 'X-Reauth-Token': reauthToken },
    });
  },

  async enableTOTP(verificationCode: string, reauthToken: string): Promise<EnableTOTPResponse> {
    return httpPost<EnableTOTPResponse>(
      `${TOTP_URL}/enable`,
      { verificationCode },
      { headers: { 'X-Reauth-Token': reauthToken } },
    );
  },

  async disableTOTP(reauthToken: string): Promise<{ message: string }> {
    return httpPost<{ message: string }>(`${TOTP_URL}/disable`, undefined, {
      headers: { 'X-Reauth-Token': reauthToken },
    });
  },

  async regenerateBackupCodes(reauthToken: string): Promise<RegenerateBackupCodesResponse> {
    return httpPost<RegenerateBackupCodesResponse>(
      `${TOTP_URL}/regenerate-backup-codes`,
      undefined,
      { headers: { 'X-Reauth-Token': reauthToken } },
    );
  },
};
