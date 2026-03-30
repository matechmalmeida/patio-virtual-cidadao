import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as seizureService from '../services/seizure.service';
import { toast } from 'sonner';

const SEIZURE_KEYS = {
  all: ['seizure'] as const,
  list: (page: number) => [...SEIZURE_KEYS.all, 'list', page] as const,
  term: (seizureId: string) => [...SEIZURE_KEYS.all, 'term', seizureId] as const,
  geofence: (seizureId: string) => [...SEIZURE_KEYS.all, 'geofence', seizureId] as const,
};

export function useMySeizures(page = 1) {
  return useQuery({
    queryKey: SEIZURE_KEYS.list(page),
    queryFn: () => seizureService.listMySeizures(page),
  });
}

export function useSeizureTerm(seizureId: string) {
  return useQuery({
    queryKey: SEIZURE_KEYS.term(seizureId),
    queryFn: () => seizureService.getTermForSeizure(seizureId),
    enabled: !!seizureId,
  });
}

export function useSignTerm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seizureId,
      accepted,
      refusalReason,
    }: {
      seizureId: string;
      accepted: boolean;
      refusalReason?: string;
    }) => seizureService.signTerm(seizureId, accepted, refusalReason),
    onSuccess: (_, { seizureId }) => {
      queryClient.invalidateQueries({ queryKey: SEIZURE_KEYS.term(seizureId) });
      queryClient.invalidateQueries({ queryKey: SEIZURE_KEYS.geofence(seizureId) });
      toast.success('Termo assinado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao assinar o termo');
    },
  });
}

export function useGeofenceStatus(seizureId: string) {
  return useQuery({
    queryKey: SEIZURE_KEYS.geofence(seizureId),
    queryFn: () => seizureService.getGeofenceStatus(seizureId),
    enabled: !!seizureId,
    refetchInterval: 30_000, // Poll every 30s
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
