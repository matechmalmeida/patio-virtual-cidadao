import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/http/api-error';
import { notificationsService } from '../services/notification.service';
import type { NotificationsListParams } from '../types/notification';

export const NOTIFICATIONS_QUERY_KEY = 'notifications';
export const UNREAD_COUNT_QUERY_KEY = 'notifications-unread-count';
export const PENDING_ACK_QUERY_KEY = 'notifications-pending-acknowledgments';

export function useNotifications(params: NotificationsListParams = {}) {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => notificationsService.list(params),
    staleTime: 60000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: [UNREAD_COUNT_QUERY_KEY],
    queryFn: () => notificationsService.getUnreadCount(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function usePendingAcknowledgments() {
  return useQuery({
    queryKey: [PENDING_ACK_QUERY_KEY],
    queryFn: () => notificationsService.getPendingAcknowledgments(),
    staleTime: 60000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onMutate: async () => {
      queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], (old: { count: number } | undefined) => {
        const currentCount = old?.count || 0;
        return { count: Math.max(0, currentCount - 1) };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PENDING_ACK_QUERY_KEY] });
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
      toast({
        variant: 'destructive',
        title: 'Erro ao marcar como lida',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onMutate: async () => {
      queryClient.setQueryData([UNREAD_COUNT_QUERY_KEY], { count: 0 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
      toast({
        variant: 'destructive',
        title: 'Erro ao marcar todas como lidas',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useAcknowledgeNotification() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => notificationsService.acknowledge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PENDING_ACK_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao confirmar notificacao',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => notificationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PENDING_ACK_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir notificacao',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}

export function useDeleteAllRead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => notificationsService.deleteAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir notificacoes',
        description: error instanceof ApiError ? error.userMessage : 'Tente novamente.',
      });
    },
  });
}
