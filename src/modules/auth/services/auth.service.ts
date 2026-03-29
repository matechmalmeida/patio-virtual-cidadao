import { httpGet, httpPost, httpPatch, httpDelete } from '@/services/http/http-client';
import { uploadFile } from '@/services/http/upload';
import { getFingerprint } from '../store/fingerprint-store';
import type {
  LoginRequest,
  LoginResponse,
  VerifyRequest,
  VerifyResponse,
  ResendCodeRequest,
  ResendCodeResponse,
  MeResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  Session,
  VerifyCurrentPasswordRequest,
  VerifyCurrentPasswordResponse,
  CheckPasswordRequest,
  CheckPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ChangeNameRequest,
  ChangeNameResponse,
  InitiateEmailChangeRequest,
  InitiateEmailChangeResponse,
  ConfirmEmailChangeRequest,
  ConfirmEmailChangeResponse,
  ChangePhoneRequest,
  ChangePhoneResponse,
  ChangeCpfRequest,
  ChangeCpfResponse,
  ChangeBirthDateRequest,
  ChangeBirthDateResponse,
  UploadAvatarResponse,
  DeleteAvatarResponse,
  InitiateReauthResponse,
  VerifyReauthTotpRequest,
  ReauthTokenResponse,
  VerifyReauthEmailRequest,
  VerifyReauthBackupCodeRequest,
  ResendReauthCodeRequest,
  ResendReauthCodeResponse,
} from '../types/auth';

const BASE_URL = '/v1/auth';
const PROFILE_URL = '/v1/profile';
const SECURITY_URL = '/v1/security';

export const authService = {
  async fetchCsrfToken(): Promise<string> {
    const response = await httpGet<{ csrfToken: string }>(`${BASE_URL}/csrf-token`, {
      skipAuthRefresh: true,
    });
    return response.csrfToken;
  },

  async login(data: LoginRequest): Promise<LoginResponse> {
    return httpPost<LoginResponse>(`${BASE_URL}/login`, data, { skipAuthRefresh: true });
  },

  async verify(data: VerifyRequest): Promise<VerifyResponse> {
    return httpPost<VerifyResponse>(`${BASE_URL}/verify`, data, { skipAuthRefresh: true });
  },

  async resendCode(data: ResendCodeRequest): Promise<ResendCodeResponse> {
    return httpPost<ResendCodeResponse>(`${BASE_URL}/resend-code`, data, {
      skipAuthRefresh: true,
    });
  },

  async getMe(): Promise<MeResponse> {
    return httpGet<MeResponse>(`${BASE_URL}/me`);
  },

  async refresh(): Promise<void> {
    const fingerprint = getFingerprint();
    const body = fingerprint ? { fingerprint } : undefined;
    return httpPost(`${BASE_URL}/refresh`, body, { skipAuthRefresh: true });
  },

  async logout(): Promise<void> {
    return httpPost(`${BASE_URL}/logout`, undefined, { skipAuthRefresh: true });
  },

  async logoutAll(): Promise<void> {
    return httpPost(`${BASE_URL}/logout-all`, undefined, { skipAuthRefresh: true });
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return httpPost<ForgotPasswordResponse>(`${BASE_URL}/forgot-password`, data, {
      skipAuthRefresh: true,
    });
  },

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return httpPost<ResetPasswordResponse>(`${BASE_URL}/reset-password`, data, {
      skipAuthRefresh: true,
    });
  },

  async verifyCurrentPassword(
    data: VerifyCurrentPasswordRequest,
  ): Promise<VerifyCurrentPasswordResponse> {
    return httpPost<VerifyCurrentPasswordResponse>(`${BASE_URL}/verify-password`, data);
  },

  async checkPassword(data: CheckPasswordRequest): Promise<CheckPasswordResponse> {
    return httpPost<CheckPasswordResponse>(`${SECURITY_URL}/check-password`, data);
  },

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const { reauthToken, ...body } = data;
    return httpPost<ChangePasswordResponse>(`${PROFILE_URL}/change-password`, body, {
      headers: reauthToken ? { 'X-Reauth-Token': reauthToken } : undefined,
    });
  },

  async changeName(data: ChangeNameRequest): Promise<ChangeNameResponse> {
    return httpPatch<ChangeNameResponse>(`${PROFILE_URL}/name`, data);
  },

  async initiateEmailChange(
    data: InitiateEmailChangeRequest,
  ): Promise<InitiateEmailChangeResponse> {
    const { reauthToken, newEmail } = data;
    return httpPost<InitiateEmailChangeResponse>(
      `${PROFILE_URL}/email/initiate`,
      { newEmail },
      { headers: { 'X-Reauth-Token': reauthToken } },
    );
  },

  async confirmEmailChange(data: ConfirmEmailChangeRequest): Promise<ConfirmEmailChangeResponse> {
    return httpPost<ConfirmEmailChangeResponse>(`${PROFILE_URL}/email/confirm`, data);
  },

  async changePhone(data: ChangePhoneRequest): Promise<ChangePhoneResponse> {
    const { reauthToken, newPhone } = data;
    return httpPatch<ChangePhoneResponse>(
      `${PROFILE_URL}/phone`,
      { newPhone },
      { headers: { 'X-Reauth-Token': reauthToken } },
    );
  },

  async changeCpf(data: ChangeCpfRequest): Promise<ChangeCpfResponse> {
    const { reauthToken, ...body } = data;
    return httpPatch<ChangeCpfResponse>(`${PROFILE_URL}/cpf`, body, {
      headers: { 'X-Reauth-Token': reauthToken },
    });
  },

  async changeBirthDate(data: ChangeBirthDateRequest): Promise<ChangeBirthDateResponse> {
    return httpPatch<ChangeBirthDateResponse>(`${PROFILE_URL}/birth-date`, data);
  },

  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    return uploadFile<UploadAvatarResponse>({
      endpoint: `${PROFILE_URL}/avatar`,
      fieldName: 'avatar',
      file,
    });
  },

  async deleteAvatar(): Promise<DeleteAvatarResponse> {
    return httpDelete<DeleteAvatarResponse>(`${PROFILE_URL}/avatar`);
  },

  async getSessions(): Promise<Session[]> {
    return httpGet<Session[]>(`${BASE_URL}/sessions`);
  },

  async revokeSession(familyId: string): Promise<void> {
    return httpDelete(`${BASE_URL}/sessions/${familyId}`);
  },

  async initiateReauth(): Promise<InitiateReauthResponse> {
    return httpPost<InitiateReauthResponse>(`${BASE_URL}/reauth/initiate`);
  },

  async verifyReauthTotp(data: VerifyReauthTotpRequest): Promise<ReauthTokenResponse> {
    return httpPost<ReauthTokenResponse>(`${BASE_URL}/reauth/verify-totp`, data);
  },

  async verifyReauthEmail(data: VerifyReauthEmailRequest): Promise<ReauthTokenResponse> {
    return httpPost<ReauthTokenResponse>(`${BASE_URL}/reauth/verify-email`, data);
  },

  async verifyReauthBackupCode(data: VerifyReauthBackupCodeRequest): Promise<ReauthTokenResponse> {
    return httpPost<ReauthTokenResponse>(`${BASE_URL}/reauth/verify-backup`, data);
  },

  async resendReauthCode(data: ResendReauthCodeRequest): Promise<ResendReauthCodeResponse> {
    return httpPost<ResendReauthCodeResponse>(`${BASE_URL}/reauth/resend`, data);
  },
};
