import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/http/api-error';
import { profileService } from '../services/profile.service';
import type { Session } from '@/modules/auth/types/auth';

export const PROFILE_SESSIONS_QUERY_KEY = ['profile', 'sessions'];

export function useProfileSessions() {
  return useQuery<Session[]>({
    queryKey: PROFILE_SESSIONS_QUERY_KEY,
    queryFn: () => profileService.getSessions(),
    staleTime: 30000,
  });
}

export function useRevokeProfileSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, string>({
    mutationFn: (familyId: string) => profileService.revokeSession(familyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_SESSIONS_QUERY_KEY });
      toast({
        title: 'Sessao encerrada',
        description: 'O dispositivo foi desconectado com sucesso.',
      });
    },
    onError: (error: Error) => {
      let message = 'Ocorreu um erro ao encerrar a sessao. Por favor, tente novamente.';
      if (error instanceof ApiError) {
        if (error.status === 404) {
          message = 'Esta sessao ja foi encerrada ou nao existe mais.';
        } else if (error.status && error.status >= 500) {
          message = 'Nosso servidor esta com problemas. Por favor, tente novamente em alguns instantes.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Nao foi possivel encerrar a sessao',
        description: message,
      });
    },
  });
}

export function useRevokeAllProfileSessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, void>({
    mutationFn: () => profileService.revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_SESSIONS_QUERY_KEY });
      toast({
        title: 'Todas as sessoes encerradas',
        description: 'Todos os dispositivos foram desconectados com sucesso.',
      });
    },
    onError: (error: Error) => {
      let message = 'Ocorreu um erro ao encerrar as sessoes. Por favor, tente novamente.';
      if (error instanceof ApiError) {
        if (error.status && error.status >= 500) {
          message = 'Nosso servidor esta com problemas. Por favor, tente novamente em alguns instantes.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Nao foi possivel encerrar as sessoes',
        description: message,
      });
    },
  });
}
