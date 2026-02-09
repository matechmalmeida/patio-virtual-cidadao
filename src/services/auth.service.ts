import { ApiError } from './http/api-error';
import { executeMockRequest } from './http/mock-adapter';
import { mockActiveCases } from '@/data/mockCases';
import type { CaseData } from '@/types/case';

export interface OtpChallenge {
  challengeId: string;
}

export interface VerifiedSession {
  token: string;
  activeCases: CaseData[];
}

function cloneCases(): CaseData[] {
  return JSON.parse(JSON.stringify(mockActiveCases)) as CaseData[];
}

function generateToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function requestOtp(code: string, phone: string): Promise<OtpChallenge> {
  return executeMockRequest(() => {
    const normalizedCode = code.trim();
    const normalizedPhone = phone.replace(/\D/g, '');

    if (!normalizedCode || normalizedPhone.length < 10) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid login payload',
        userMessage: 'Código do caso ou telefone inválido.',
      });
    }

    return {
      challengeId: `otp_${normalizedCode}_${Date.now()}`,
    };
  });
}

export async function verifyOtpCode(
  challengeId: string,
  otp: string
): Promise<VerifiedSession> {
  return executeMockRequest(() => {
    if (!challengeId) {
      throw new ApiError({
        code: 'UNAUTHORIZED',
        status: 401,
        message: 'Missing OTP challenge',
        userMessage: 'Sua sessão expirou. Solicite um novo código.',
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      throw new ApiError({
        code: 'VALIDATION',
        status: 400,
        message: 'Invalid OTP code format',
        userMessage: 'Digite um código válido de 6 dígitos.',
      });
    }

    return {
      token: generateToken(),
      activeCases: cloneCases(),
    };
  });
}
