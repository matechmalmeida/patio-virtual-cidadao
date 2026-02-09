import type { CaseData } from '@/types/case';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  totpEnabled: boolean;
}

export interface LoginResult {
  requiresTotp: boolean;
  tempToken: string | null;
  session: VerifiedSession | null;
}

export interface VerifiedSession {
  token: string;
  user: AuthUser;
  activeCases: CaseData[];
}

export interface TotpSetupData {
  secret: string;
  qrCodeUrl: string;
}

export type SessionAction =
  | { type: 'LOGIN_SUCCESS'; payload: VerifiedSession }
  | { type: 'TOTP_PENDING'; payload: { tempToken: string; email: string } }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_CASE'; payload: string }
  | { type: 'UPDATE_CASE'; payload: { id: string; data: Partial<CaseData> } };

export interface SessionState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  sessionToken: string | null;
  totpPending: boolean;
  totpTempToken: string | null;
  totpEmail: string | null;
  activeCases: CaseData[];
  selectedCaseId: string | null;
  expiresAt: number | null;
}
