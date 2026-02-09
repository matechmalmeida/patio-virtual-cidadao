import { useState, useMemo, useCallback } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';
import { BatchActionBar } from '../components/BatchActionBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getApiErrorMessage } from '@/services/http/api-error';
import { AlertBanner } from '@/components/AlertBanner';
import { useTranslation } from 'react-i18next';

type Filter = 'todos' | 'importantes' | 'pendentes';

export default function NotificationsPage() {
  const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    markBatchAsRead,
    deleteBatch,
    getFiltered,
    unreadCount,
  } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('todos');
  const [error, setError] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const filtered = getFiltered(filter);

  const handleMarkRead = async (id: string) => {
    setError('');
    try {
      await markAsRead(id);
    } catch (err) {
      setError(getApiErrorMessage(err, t('notificationsPage.updateError')));
    }
  };

  const handleDelete = async (id: string) => {
    setError('');
    try {
      await deleteNotification(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      setError(getApiErrorMessage(err, t('notificationsPage.deleteError')));
    }
  };

  const handleMarkAllAsRead = async () => {
    setError('');
    try {
      await markAllAsRead();
    } catch (err) {
      setError(getApiErrorMessage(err, t('notificationsPage.batchError')));
    }
  };

  const handleFilterChange = (f: Filter) => {
    setFilter(f);
    setSelectedIds(new Set());
  };

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => {
    setSelectedIds(new Set(filtered.map((n) => n.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const hasUnreadInSelection = useMemo(
    () => filtered.some((n) => selectedIds.has(n.id) && !n.read),
    [filtered, selectedIds]
  );

  const handleBatchMarkRead = async () => {
    setError('');
    setLoading(true);
    try {
      await markBatchAsRead(Array.from(selectedIds));
      exitSelectionMode();
    } catch (err) {
      setError(getApiErrorMessage(err, t('notificationsPage.batchError')));
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    setError('');
    setLoading(true);
    try {
      await deleteBatch(Array.from(selectedIds));
      exitSelectionMode();
    } catch (err) {
      setError(getApiErrorMessage(err, t('notificationsPage.batchError')));
    } finally {
      setLoading(false);
    }
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'todos', label: t('notificationsPage.filterAll') },
    { key: 'importantes', label: t('notificationsPage.filterImportant') },
    { key: 'pendentes', label: t('notificationsPage.filterUnread') },
  ];

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('notificationsPage.title')}</h1>
        {selectionMode ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} / {filtered.length}
            </span>
            <Button variant="outline" size="sm" onClick={selectAll}>
              {t('notificationsPage.selectAll')}
            </Button>
            <Button variant="ghost" size="sm" onClick={exitSelectionMode}>
              <X className="h-4 w-4 mr-1" />
              {t('common.cancel')}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                {t('notificationsPage.markAllAsRead')}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setSelectionMode(true)}>
              <CheckSquare className="h-4 w-4 mr-1" />
              {t('notificationsPage.select')}
            </Button>
          </div>
        )}
      </div>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      <div className="flex gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
              filter === key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:bg-muted'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {t('notificationsPage.empty')}
          </div>
        ) : (
          filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
              selectionMode={selectionMode}
              selected={selectedIds.has(notification.id)}
              onToggleSelect={toggleSelect}
            />
          ))
        )}
      </div>

      {selectionMode && selectedIds.size > 0 && (
        <BatchActionBar
          selectedCount={selectedIds.size}
          hasUnreadInSelection={hasUnreadInSelection}
          onMarkRead={handleBatchMarkRead}
          onDelete={handleBatchDelete}
          onDeselectAll={deselectAll}
          loading={loading}
        />
      )}
    </div>
  );
}
