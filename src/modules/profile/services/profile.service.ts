import { authService } from '@/modules/auth/services/auth.service';
import { httpGet, httpPatch } from '@/services/http/http-client';
import type { UserAddress, UserPreferences } from '../types/profile';
import type {
  MeResponse,
  Session,
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
  ChangePasswordRequest,
  ChangePasswordResponse,
  UploadAvatarResponse,
  DeleteAvatarResponse,
} from '@/modules/auth/types/auth';

export const profileService = {
  async getMe(): Promise<MeResponse> {
    return authService.getMe();
  },

  async changeName(data: ChangeNameRequest): Promise<ChangeNameResponse> {
    return authService.changeName(data);
  },

  async initiateEmailChange(
    data: InitiateEmailChangeRequest,
  ): Promise<InitiateEmailChangeResponse> {
    return authService.initiateEmailChange(data);
  },

  async confirmEmailChange(data: ConfirmEmailChangeRequest): Promise<ConfirmEmailChangeResponse> {
    return authService.confirmEmailChange(data);
  },

  async changePhone(data: ChangePhoneRequest): Promise<ChangePhoneResponse> {
    return authService.changePhone(data);
  },

  async changeCpf(data: ChangeCpfRequest): Promise<ChangeCpfResponse> {
    return authService.changeCpf(data);
  },

  async changeBirthDate(data: ChangeBirthDateRequest): Promise<ChangeBirthDateResponse> {
    return authService.changeBirthDate(data);
  },

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return authService.changePassword(data);
  },

  async uploadAvatar(file: File): Promise<UploadAvatarResponse> {
    return authService.uploadAvatar(file);
  },

  async deleteAvatar(): Promise<DeleteAvatarResponse> {
    return authService.deleteAvatar();
  },

  async getSessions(): Promise<Session[]> {
    return authService.getSessions();
  },

  async revokeSession(familyId: string): Promise<void> {
    return authService.revokeSession(familyId);
  },

  async revokeAllSessions(): Promise<void> {
    return authService.logoutAll();
  },

  async getAddress(): Promise<UserAddress> {
    return httpGet<UserAddress>('/v1/profile/address');
  },

  async updateAddress(data: Partial<UserAddress>): Promise<UserAddress> {
    return httpPatch<UserAddress>('/v1/profile/address', data);
  },

  async getPreferences(): Promise<UserPreferences> {
    return httpGet<UserPreferences>('/v1/profile/preferences');
  },

  async updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
    return httpPatch<UserPreferences>('/v1/profile/preferences', data);
  },
};
