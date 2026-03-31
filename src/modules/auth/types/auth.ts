export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  permissions: string[];
  requirePasswordChange?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  fingerprint?: string;
}

export interface LoginResponseRequiresVerification {
  message: string;
  requiresVerification: true;
  pendingToken: string;
  expiresIn: number;
  maskedEmail: string;
  verificationType?: 'email' | 'totp';
}

export interface LoginResponseSkip2FA {
  message: string;
  requiresVerification: false;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    requirePasswordChange?: boolean;
  };
  deviceId?: string;
  isNewDevice?: boolean;
  isTrustedDevice?: boolean;
}

export type LoginResponse = LoginResponseRequiresVerification | LoginResponseSkip2FA;

export type CodeType = 'email' | 'totp' | 'backup';

export interface VerifyRequest {
  pendingToken: string;
  code: string;
  codeType: CodeType;
  fingerprint?: string;
  trustDevice?: boolean;
}

export interface VerifyResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    requirePasswordChange?: boolean;
  };
  expiresIn: number;
  deviceId?: string;
  isNewDevice?: boolean;
  isTrustedDevice?: boolean;
}

export interface ResendCodeRequest {
  pendingToken: string;
}

export interface ResendCodeResponse {
  message: string;
  pendingToken: string;
  expiresIn: number;
  maskedEmail: string;
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpf?: string;
  birthDate?: string;
  avatarUrl: string | null;
  permissions: string[];
  requirePasswordChange?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface Session {
  familyId: string;
  deviceName: string | null;
  createdAt: string;
  lastActivity?: string;
  ipAddress: string | null;
  userAgent: string | null;
  isCurrent: boolean;
  expiresAt?: string;
  device?: {
    id: string;
    fingerprint: string;
    name: string;
    type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
    os: string | null;
    osVersion: string | null;
    browser: string | null;
    browserVersion: string | null;
    isTrusted: boolean;
    lastSeenAt: string | null;
  } | null;
}

export interface VerifyCurrentPasswordRequest {
  password: string;
}

export interface VerifyCurrentPasswordResponse {
  message: string;
  reauthToken: string;
  expiresIn: number;
}

export interface CheckPasswordRequest {
  password: string;
}

export interface CheckPasswordResponse {
  isCompromised: boolean;
  occurrences?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  keepCurrentSession?: boolean;
  reauthToken?: string;
}

export interface ChangePasswordResponse {
  message: string;
  sessionsRevoked?: number;
}

export interface ChangeNameRequest {
  newName: string;
}

export interface ChangeNameResponse {
  message: string;
  name: string;
}

export interface InitiateEmailChangeRequest {
  newEmail: string;
  reauthToken: string;
}

export interface InitiateEmailChangeResponse {
  message: string;
  pendingToken: string;
  expiresIn: number;
  maskedEmail: string;
}

export interface ConfirmEmailChangeRequest {
  pendingToken: string;
  code: string;
}

export interface ConfirmEmailChangeResponse {
  message: string;
  email: string;
}

export interface ChangePhoneRequest {
  newPhone: string;
  reauthToken: string;
}

export interface ChangePhoneResponse {
  message: string;
  phone: string;
}

export interface ChangeCpfRequest {
  newCpf: string;
  reauthToken: string;
}

export interface ChangeCpfResponse {
  message: string;
  cpf: string;
}

export interface ChangeBirthDateRequest {
  newBirthDate: string;
}

export interface ChangeBirthDateResponse {
  message: string;
  birthDate: string;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
  message: string;
}

export interface DeleteAvatarResponse {
  message: string;
}

export interface InitiateReauthTotpResponse {
  method: 'totp';
}

export interface InitiateReauthEmailResponse {
  method: 'email';
  pendingToken: string;
  expiresIn: number;
  maskedEmail: string;
}

export type InitiateReauthResponse = InitiateReauthTotpResponse | InitiateReauthEmailResponse;

export interface VerifyReauthTotpRequest {
  totpCode: string;
}

export interface VerifyReauthEmailRequest {
  pendingToken: string;
  code: string;
}

export interface VerifyReauthBackupCodeRequest {
  backupCode: string;
}

export interface ResendReauthCodeRequest {
  pendingToken: string;
}

export interface ReauthTokenResponse {
  message: string;
  reauthToken: string;
  expiresIn: number;
}

export interface ResendReauthCodeResponse {
  message: string;
  pendingToken: string;
  expiresIn: number;
  maskedEmail: string;
}

export interface TOTPStatus {
  totpEnabled: boolean;
  backupCodesRemaining: number;
  shouldRegenerateBackupCodes: boolean;
}

export interface EnrollResult {
  secret: string;
  qrCodeDataUrl: string;
  qrCodeUri: string;
}

export interface EnableTOTPResponse {
  message: string;
  backupCodes: string[];
  totpEnabled: boolean;
}

export interface RegenerateBackupCodesResponse {
  message: string;
  backupCodes: string[];
}

export interface MagicLinkRequest {
  email: string;
  callbackUrl: string;
  fingerprint?: string;
}

export interface MagicLinkResponse {
  message: string;
}

export interface VerifyMagicLinkRequest {
  token: string;
}

export interface VerifyMagicLinkResponse {
  valid: boolean;
  email?: string;
}

export interface ConfirmMagicLinkRequest {
  token: string;
  fingerprint?: string;
}

export interface ConfirmMagicLinkResponse {
  requiresVerification: true;
  mfaMethod: 'totp';
  pendingToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  pendingVerification: {
    pendingToken: string;
    expiresAt: number;
    maskedEmail: string;
    verificationType: 'email' | 'totp';
  } | null;
}
