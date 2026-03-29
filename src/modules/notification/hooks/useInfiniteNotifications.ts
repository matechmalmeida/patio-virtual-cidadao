import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { notificationsService } from '../services/notification.service';
import type { NotificationsListParams } from '../types/notification';
import { NOTIFICATIONS_QUERY_KEY } from './useNotifications';

const DEFAULT_LIMIT = 20;

export function useInfiniteNotifications(params: Omit<NotificationsListParams, 'page'> = {}) {
  const limit = params.limit || DEFAULT_LIMIT;

  const query = useInfiniteQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      notificationsService.list({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    staleTime: 60000,
  });

  const notifications = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data?.pages],
  );

  const meta = query.data?.pages[0]?.meta;

  return {
    ...query,
    notifications,
    unreadCount: meta?.unreadCount ?? 0,
    total: meta?.total ?? 0,
  };
}
