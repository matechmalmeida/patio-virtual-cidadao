export { AuthProvider, useAuth } from './contexts/AuthContext';
export { FingerprintProvider, useFingerprint } from './contexts/FingerprintContext';
export { RequireAuth } from './components/RequireAuth';
export { ReauthDialog } from './components/ReauthDialog';
export { TotpSetupDialog } from './components/TotpSetupDialog';
export { PasswordStrengthBar } from './components/PasswordStrengthBar';
export { authService } from './services/auth.service';
export { mfaService } from './services/mfa.service';
export {
  useVerifyCurrentPassword,
  useCheckPassword,
  useChangePassword,
  useChangeName,
  useInitiateEmailChange,
  useConfirmEmailChange,
  useChangePhone,
  useChangeCpf,
  useChangeBirthDate,
  getVerifyPasswordErrorMessage,
  getCheckPasswordErrorMessage,
  getChangePasswordErrorMessage,
  getChangeNameErrorMessage,
  getChangeEmailErrorMessage,
  getChangePhoneErrorMessage,
  getChangeCpfErrorMessage,
  getChangeBirthDateErrorMessage,
  isReauthRequiredError,
} from './hooks/usePasswordSecurity';
export type {
  AuthUser,
  AuthState,
  LoginRequest,
  LoginResponse,
  VerifyRequest,
  VerifyResponse,
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
  CheckPasswordRequest,
  CheckPasswordResponse,
  UploadAvatarResponse,
  DeleteAvatarResponse,
} from './types/auth';
