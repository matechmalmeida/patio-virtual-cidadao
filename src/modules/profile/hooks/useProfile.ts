import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/http/api-error';
import { profileService } from '../services/profile.service';
import type { MeResponse, UploadAvatarResponse, DeleteAvatarResponse } from '@/modules/auth/types/auth';

export const PROFILE_QUERY_KEY = ['profile'];

export function useProfile() {
  return useQuery<MeResponse>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getMe(),
    staleTime: 30000,
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<UploadAvatarResponse, Error, File>({
    mutationFn: (file) => profileService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast({ title: 'Avatar atualizado', description: 'Seu avatar foi atualizado com sucesso.' });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar avatar',
        description:
          error instanceof ApiError
            ? error.userMessage
            : 'Nao foi possivel atualizar o avatar. Tente novamente.',
      });
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<DeleteAvatarResponse, Error, void>({
    mutationFn: () => profileService.deleteAvatar(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast({ title: 'Avatar removido', description: 'Seu avatar foi removido com sucesso.' });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover avatar',
        description:
          error instanceof ApiError
            ? error.userMessage
            : 'Nao foi possivel remover o avatar. Tente novamente.',
      });
    },
  });
}

export {
  useChangeName,
  useInitiateEmailChange,
  useConfirmEmailChange,
  useChangePhone,
  useChangeCpf,
  useChangeBirthDate,
  useChangePassword,
  useCheckPassword,
  useVerifyCurrentPassword,
  getChangeNameErrorMessage,
  getChangeEmailErrorMessage,
  getChangePhoneErrorMessage,
  getChangeCpfErrorMessage,
  getChangeBirthDateErrorMessage,
  getChangePasswordErrorMessage,
  getVerifyPasswordErrorMessage,
  getCheckPasswordErrorMessage,
  isReauthRequiredError,
} from '@/modules/auth/hooks/usePasswordSecurity';
