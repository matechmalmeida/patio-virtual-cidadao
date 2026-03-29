import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/http/api-error';
import { devicesService } from '../services/devices.service';

const DEVICES_QUERY_KEY = ['devices'];
const DEVICES_CURRENT_KEY = ['devices', 'current'];

export function useDevices() {
  return useQuery({
    queryKey: DEVICES_QUERY_KEY,
    queryFn: () => devicesService.list(),
    staleTime: 30000,
  });
}

export function useCurrentDevice() {
  return useQuery({
    queryKey: DEVICES_CURRENT_KEY,
    queryFn: () => devicesService.getCurrent(),
    staleTime: 60000,
  });
}

export function useRenameDevice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      devicesService.rename(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      toast({ title: 'Dispositivo renomeado', description: 'O nome foi alterado com sucesso.' });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao renomear',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useTrustDevice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reauthToken }: { id: string; reauthToken: string }) =>
      devicesService.trust(id, reauthToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      toast({ title: 'Dispositivo confiavel', description: 'O dispositivo foi marcado como confiavel.' });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao marcar como confiavel',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useUntrustDevice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, reauthToken }: { id: string; reauthToken: string }) =>
      devicesService.untrust(id, reauthToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      toast({ title: 'Confianca removida', description: 'O dispositivo nao e mais confiavel.' });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover confianca',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useRevokeDevice() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => devicesService.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      toast({ title: 'Dispositivo revogado', description: 'O dispositivo foi desconectado.' });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao revogar dispositivo',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useRevokeAllDevices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => devicesService.revokeAll(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY });
      toast({
        title: 'Dispositivos revogados',
        description: `${data.revokedCount} dispositivo(s) foram desconectados.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao revogar dispositivos',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}
