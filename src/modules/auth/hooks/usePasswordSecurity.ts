import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { ApiError } from '@/services/http/api-error';
import type {
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
} from '../types/auth';

function getErrorMsg(error: Error, fallback: string): string {
  if (error instanceof ApiError) {
    return error.userMessage || fallback;
  }
  return error.message || fallback;
}

export function useVerifyCurrentPassword() {
  return useMutation<VerifyCurrentPasswordResponse, Error, VerifyCurrentPasswordRequest>({
    mutationFn: (data) => authService.verifyCurrentPassword(data),
  });
}

export function useCheckPassword() {
  return useMutation<CheckPasswordResponse, Error, CheckPasswordRequest>({
    mutationFn: (data) => authService.checkPassword(data),
  });
}

export function getVerifyPasswordErrorMessage(error: Error): string {
  return getErrorMsg(error, 'Erro ao verificar senha.');
}

export function getCheckPasswordErrorMessage(error: Error): string {
  return getErrorMsg(error, 'Erro ao verificar senha.');
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationFn: (data) => authService.changePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function getChangePasswordErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    const data = error.details as Record<string, unknown> | null;
    if (data && Array.isArray(data.errors)) {
      const historyError = data.errors.find((item) => {
        if (!item || typeof item !== 'object') return false;
        return (item as { validator?: string }).validator === 'PasswordHistoryValidator';
      }) as { message?: string } | undefined;
      if (historyError?.message) {
        return historyError.message;
      }
    }
  }
  return getErrorMsg(error, 'Erro ao alterar senha.');
}

export function useChangeName() {
  const queryClient = useQueryClient();

  return useMutation<ChangeNameResponse, Error, ChangeNameRequest>({
    mutationFn: (data) => authService.changeName(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function getChangeNameErrorMessage(error: Error): string {
  return getErrorMsg(error, 'Erro ao alterar nome.');
}

export function useInitiateEmailChange() {
  return useMutation<InitiateEmailChangeResponse, Error, InitiateEmailChangeRequest>({
    mutationFn: (data) => authService.initiateEmailChange(data),
  });
}

export function useConfirmEmailChange() {
  const queryClient = useQueryClient();

  return useMutation<ConfirmEmailChangeResponse, Error, ConfirmEmailChangeRequest>({
    mutationFn: (data) => authService.confirmEmailChange(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function getChangeEmailErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    const msg = error.userMessage;
    if (msg?.includes('ja esta em uso') || msg?.includes('ja esta em uso')) {
      return 'Este e-mail ja esta em uso por outro usuario.';
    }
  }
  return getErrorMsg(error, 'Erro ao alterar e-mail.');
}

export function useChangePhone() {
  const queryClient = useQueryClient();

  return useMutation<ChangePhoneResponse, Error, ChangePhoneRequest>({
    mutationFn: (data) => authService.changePhone(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function getChangePhoneErrorMessage(error: Error): string {
  return getErrorMsg(error, 'Erro ao alterar telefone.');
}

export function useChangeCpf() {
  const queryClient = useQueryClient();

  return useMutation<ChangeCpfResponse, Error, ChangeCpfRequest>({
    mutationFn: (data) => authService.changeCpf(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function getChangeCpfErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    return error.userMessage || 'Nao foi possivel alterar o CPF.';
  }
  return 'Nao foi possivel alterar o CPF.';
}

export function useChangeBirthDate() {
  const queryClient = useQueryClient();

  return useMutation<ChangeBirthDateResponse, Error, ChangeBirthDateRequest>({
    mutationFn: (data) => authService.changeBirthDate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function getChangeBirthDateErrorMessage(error: Error): string {
  if (error instanceof ApiError) {
    return error.userMessage || 'Nao foi possivel alterar a data de nascimento.';
  }
  return 'Nao foi possivel alterar a data de nascimento.';
}

export function isReauthRequiredError(error: Error): boolean {
  if (!(error instanceof ApiError) || error.status !== 401) {
    return false;
  }
  const message = error.userMessage;
  return (
    message?.includes('Re-autenticacao') ||
    message?.includes('Token de re-autenticacao') ||
    false
  );
}
