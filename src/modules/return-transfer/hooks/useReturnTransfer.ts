import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as service from '../services/return-transfer.service';
import type { CreateReturnTransferInput } from '../types/return-transfer';

const KEYS = {
  all: ['returnTransfer'] as const,
  list: (page: number) => [...KEYS.all, 'list', page] as const,
  detail: (id: string) => [...KEYS.all, 'detail', id] as const,
};

export function useMyReturnRequests(page = 1) {
  return useQuery({
    queryKey: KEYS.list(page),
    queryFn: () => service.listMyReturnRequests(page),
  });
}

export function useReturnRequestDetail(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => service.getMyReturnRequest(id),
    enabled: !!id,
  });
}

export function useCreateReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReturnTransferInput) => service.createReturnRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Solicitacao criada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar solicitacao. Tente novamente.');
    },
  });
}

export function useCancelReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      service.cancelReturnRequest(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(id) });
      toast.success('Solicitacao cancelada');
    },
    onError: () => {
      toast.error('Erro ao cancelar solicitacao. Tente novamente.');
    },
  });
}
