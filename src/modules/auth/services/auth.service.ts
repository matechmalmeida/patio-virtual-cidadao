import { ApiError } from '@/services/http/api-error';
import { executeMockRequest } from '@/services/http/mock-adapter';
import { mockActiveCases } from '@/data/mockCases';
import type { CaseData } from '@/types/case';
import type { AuthUser, LoginResult, VerifiedSession, TotpSetupData } from '../types/auth';

const mockUsers: AuthUser[] = [
  { id: 'usr_1', email: 'cidadao@email.com', name: 'Joao Silva', totpEnabled: false },
  { id: 'usr_2', email: '2fa@email.com', name: 'Maria Santos', totpEnabled: true },
];

const VALID_PASSWORD = '123456';
const VALID_TOTP = '000000';
const MOCK_MAGIC_TOKEN = 'magic_valid_token';
const MOCK_RESET_TOKEN = 'reset_valid_token';

function cloneCases(): CaseData[] {
  return JSON.parse(JSON.stringify(mockActiveCases)) as CaseData[];
}

function generateToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function findUser(email: string): AuthUser | undefined {
  return mockUsers.find((u) => u.email === email.toLowerCase().trim());
}

export async function login(email: string, password: string): Promise<LoginResult> {
  return executeMockRequest(() => {
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid email format',
        userMessage: 'Formato de email invalido.',
      });
    }

    if (password !== VALID_PASSWORD) {
      throw new ApiError({
        code: 'UNAUTHORIZED',
        status: 401,
        message: 'Invalid credentials',
        userMessage: 'Email ou senha incorretos.',
      });
    }

    const user = findUser(normalizedEmail) ?? {
      id: `usr_${Date.now()}`,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      totpEnabled: false,
    };

    if (user.totpEnabled) {
      return {
        requiresTotp: true,
        tempToken: `totp_${user.id}_${Date.now()}`,
        session: null,
      };
    }

    return {
      requiresTotp: false,
      tempToken: null,
      session: {
        token: generateToken(),
        user,
        activeCases: cloneCases(),
      },
    };
  });
}

export async function verifyTotp(tempToken: string, code: string): Promise<VerifiedSession> {
  return executeMockRequest(() => {
    if (!tempToken) {
      throw new ApiError({
        code: 'UNAUTHORIZED',
        status: 401,
        message: 'Missing temp token',
        userMessage: 'Sessao expirada. Faca login novamente.',
      });
    }

    if (code !== VALID_TOTP) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid TOTP code',
        userMessage: 'Codigo incorreto.',
      });
    }

    const user = mockUsers.find((u) => u.totpEnabled) ?? mockUsers[0];

    return {
      token: generateToken(),
      user,
      activeCases: cloneCases(),
    };
  });
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  return executeMockRequest(() => {
    return { message: 'Password reset email sent' };
  });
}

export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  return executeMockRequest(() => {
    if (token !== MOCK_RESET_TOKEN && !token.startsWith('reset_')) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid or expired reset token',
        userMessage: 'Link expirado ou invalido.',
      });
    }

    if (password.length < 8) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Password too weak',
        userMessage: 'A senha deve ter no minimo 8 caracteres.',
      });
    }

    return { message: 'Password reset successful' };
  });
}

export async function requestMagicLink(email: string): Promise<{ message: string }> {
  return executeMockRequest(() => {
    return { message: 'Magic link sent' };
  });
}

export async function verifyMagicLink(token: string): Promise<VerifiedSession> {
  return executeMockRequest(() => {
    if (token !== MOCK_MAGIC_TOKEN && !token.startsWith('magic_')) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid or expired magic link token',
        userMessage: 'Link invalido ou expirado.',
      });
    }

    return {
      token: generateToken(),
      user: mockUsers[0],
      activeCases: cloneCases(),
    };
  });
}

export async function setupTotp(sessionToken: string): Promise<TotpSetupData> {
  return executeMockRequest(() => {
    const secret = 'JBSWY3DPEHPK3PXP';
    return {
      secret,
      qrCodeUrl: `otpauth://totp/PatioVirtual:cidadao@email.com?secret=${secret}&issuer=PatioVirtual`,
    };
  });
}

export async function confirmTotpSetup(
  sessionToken: string,
  code: string
): Promise<{ message: string }> {
  return executeMockRequest(() => {
    if (code !== VALID_TOTP) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid TOTP code',
        userMessage: 'Codigo incorreto.',
      });
    }
    return { message: 'TOTP enabled' };
  });
}

export async function disableTotp(
  sessionToken: string,
  code: string
): Promise<{ message: string }> {
  return executeMockRequest(() => {
    if (code !== VALID_TOTP) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid TOTP code',
        userMessage: 'Codigo incorreto.',
      });
    }
    return { message: 'TOTP disabled' };
  });
}
