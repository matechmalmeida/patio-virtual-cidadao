import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as citizenTermService from '../services/citizen-term.service';
import { toast } from 'sonner';

const CITIZEN_TERM_KEYS = {
  all: ['citizen-terms'] as const,
  installation: () => [...CITIZEN_TERM_KEYS.all, 'installation'] as const,
};

export function useCitizenTerms() {
  return useQuery({
    queryKey: CITIZEN_TERM_KEYS.installation(),
    queryFn: () => citizenTermService.getInstallationTerms(),
  });
}

export function useSignCitizenTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (termId: string) => citizenTermService.signCitizenTerm(termId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CITIZEN_TERM_KEYS.all });
      toast.success('Termo assinado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao assinar o termo');
    },
  });
}
