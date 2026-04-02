import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as seizureService from '../services/seizure.service';
import { toast } from 'sonner';

const SEIZURE_KEYS = {
  all: ['seizure'] as const,
  list: (page: number) => [...SEIZURE_KEYS.all, 'list', page] as const,
  terms: (seizureId: string) => [...SEIZURE_KEYS.all, 'terms', seizureId] as const,
  geofence: (seizureId: string) => [...SEIZURE_KEYS.all, 'geofence', seizureId] as const,
};

export function useMySeizures(page = 1) {
  return useQuery({
    queryKey: SEIZURE_KEYS.list(page),
    queryFn: () => seizureService.listMySeizures(page),
  });
}

export function useSeizureDetail(seizureId: string) {
  return useQuery({
    queryKey: [...SEIZURE_KEYS.all, 'detail', seizureId] as const,
    queryFn: () => seizureService.getSeizureById(seizureId),
    enabled: !!seizureId,
  });
}

export function useSeizureTerms(seizureId: string) {
  return useQuery({
    queryKey: SEIZURE_KEYS.terms(seizureId),
    queryFn: () => seizureService.getTermsForSeizure(seizureId),
    enabled: !!seizureId,
  });
}

export function useSignTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seizureId,
      termTemplateId,
      accepted,
      refusalReason,
    }: {
      seizureId: string;
      termTemplateId: string;
      accepted: boolean;
      refusalReason?: string;
    }) => seizureService.signTerm(seizureId, termTemplateId, accepted, refusalReason),
    onSuccess: (_, { seizureId }) => {
      queryClient.invalidateQueries({ queryKey: SEIZURE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['citizen-terms'] });
      toast.success('Termo assinado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao assinar o termo');
    },
  });
}

export function useCancelSeizure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ seizureId, reason }: { seizureId: string; reason: string }) =>
      seizureService.cancelSeizure(seizureId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SEIZURE_KEYS.all });
      toast.success('Apreensao cancelada');
    },
    onError: () => {
      toast.error('Erro ao cancelar a apreensao');
    },
  });
}

export function useGeofenceStatus(seizureId: string) {
  return useQuery({
    queryKey: SEIZURE_KEYS.geofence(seizureId),
    queryFn: () => seizureService.getGeofenceStatus(seizureId),
    enabled: !!seizureId,
    refetchInterval: 30_000,
  });
}

export function useCheckPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seizureId,
      latitude,
      longitude,
    }: {
      seizureId: string;
      latitude: number;
      longitude: number;
    }) => seizureService.checkPosition(seizureId, latitude, longitude),
    onSuccess: (result, { seizureId }) => {
      queryClient.invalidateQueries({ queryKey: SEIZURE_KEYS.geofence(seizureId) });
      if (result.status === 'custodia-violada') {
        toast.error(result.message);
      }
    },
  });
}
