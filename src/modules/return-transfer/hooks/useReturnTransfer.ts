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

export function useMyWithdrawalAppointments(page = 1) {
  return useQuery({
    queryKey: KEYS.list(page),
    queryFn: () => service.listMyWithdrawalAppointments(page),
  });
}

export function useWithdrawalAppointmentDetail(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => service.getWithdrawalAppointment(id),
    enabled: !!id,
  });
}

export function useCreateReturnRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReturnTransferInput) => service.createReturnRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Solicitação criada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar solicitação. Tente novamente.');
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
      toast.success('Solicitação cancelada');
    },
    onError: () => {
      toast.error('Erro ao cancelar solicitação. Tente novamente.');
    },
  });
}

export function useRequestWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seizureId, slotId, notes }: { seizureId: string; slotId: string; notes?: string }) =>
      service.requestWithdrawal(seizureId, slotId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['seizure'] });
      toast.success('Solicitação de retirada enviada');
    },
    onError: () => {
      toast.error('Erro ao solicitar retirada. Tente novamente.');
    },
  });
}

export function useRequestTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seizureId,
      data,
    }: {
      seizureId: string;
      data: { departureAt: string; destinationAddress: string; destinationLat: number; destinationLng: number; destinationRadiusMeters?: number; notes?: string };
    }) => service.requestTransfer(seizureId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['seizure'] });
      toast.success('Solicitação de translado enviada');
    },
    onError: () => {
      toast.error('Erro ao solicitar translado. Tente novamente.');
    },
  });
}
