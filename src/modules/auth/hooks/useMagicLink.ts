import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { getFingerprint } from '../store/fingerprint-store';
import type {
  MagicLinkRequest,
  MagicLinkResponse,
  VerifyMagicLinkRequest,
  VerifyMagicLinkResponse,
  ConfirmMagicLinkRequest,
  ConfirmMagicLinkResponse,
} from '../types/auth';

export function useRequestMagicLink() {
  return useMutation<MagicLinkResponse, Error, Omit<MagicLinkRequest, 'fingerprint' | 'callbackUrl'>>({
    mutationFn: async (data) => {
      const fingerprint = getFingerprint();
      const callbackUrl = `${window.location.origin}/acesso/link-magico/verificar`;
      return authService.requestMagicLink({
        ...data,
        callbackUrl,
        fingerprint: fingerprint || undefined,
      });
    },
  });
}

export function useVerifyMagicLink() {
  return useMutation<VerifyMagicLinkResponse, Error, VerifyMagicLinkRequest>({
    mutationFn: (data) => authService.verifyMagicLink(data),
  });
}

export function useConfirmMagicLink() {
  return useMutation<ConfirmMagicLinkResponse, Error, Omit<ConfirmMagicLinkRequest, 'fingerprint'>>({
    mutationFn: async (data) => {
      const fingerprint = getFingerprint();
      return authService.confirmMagicLink({
        ...data,
        fingerprint: fingerprint || undefined,
      });
    },
  });
}
