import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useMarkAllAsRead, useDeleteAllRead } from '../hooks/useNotifications';
import { useInfiniteNotifications } from '../hooks/useInfiniteNotifications';
import { NotificationItem } from './NotificationItem';

function NotificationSkeleton() {
  return (
    <div className="px-4 py-3 border-l-2 border-l-transparent">
      <div className="flex gap-3 items-start">
        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationListProps {
  onClose?: () => void;
  compact?: boolean;
}

export function NotificationList({ onClose, compact = false }: NotificationListProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteNotifications({
      isRead: filter === 'unread' ? false : undefined,
      limit: 20,
    });

  const handleFilterChange = (newFilter: 'all' | 'unread') => {
    if (newFilter !== filter) {
      setIsTransitioning(true);
      setFilter(newFilter);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteAllReadMutation = useDeleteAllRead();

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  return (
    <div className={cn('flex flex-col', compact && 'h-[500px]')}>
      <div className={cn('space-y-3', compact ? 'p-4 pb-3 border-b' : 'pb-3')}>
        {compact && (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">Notificações</h3>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Tabs value={filter} onValueChange={(v) => handleFilterChange(v as 'all' | 'unread')} className="flex-1">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="unread" className="text-xs">
                Não lidas
                {unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                Todas
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="h-9 w-9 shrink-0"
              title="Marcar todas como lidas"
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCheck className="h-4 w-4" />
              )}
            </Button>
          )}
          {filter === 'all' && notifications.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteAllReadMutation.isPending}
              className="h-9 w-9 shrink-0 text-destructive hover:text-destructive"
              title="Excluir lidas"
            >
              {deleteAllReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading || isTransitioning ? (
          <div className="divide-y animate-pulse">
            {[...Array(5)].map((_, i) => (
              <NotificationSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </p>
          </div>
        ) : (
          <div className={cn('divide-y', isTransitioning && 'opacity-50 transition-opacity')}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}

            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {isFetchingNextPage ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : hasNextPage ? (
                <span className="text-xs text-muted-foreground">Carregar mais...</span>
              ) : notifications.length > 0 ? (
                <span className="text-xs text-muted-foreground">Fim das notificações</span>
              ) : null}
            </div>
          </div>
        )}
      </ScrollArea>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir todas as notificações lidas?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as notificações marcadas como lidas serão
              removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex justify-between w-full">
              <AlertDialogCancel disabled={deleteAllReadMutation.isPending}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deleteAllReadMutation.mutate(undefined, {
                    onSuccess: () => setShowDeleteDialog(false),
                  });
                }}
                disabled={deleteAllReadMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteAllReadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
