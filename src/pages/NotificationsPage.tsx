import { useState } from 'react';
import { useAuth } from '@/modules/auth';
import { NotificationItem } from '@/components/NotificationItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { markNotificationAsRead } from '@/services/case.service';
import { getApiErrorMessage } from '@/services/http/api-error';
import { AlertBanner } from '@/components/AlertBanner';
import { useTranslation } from 'react-i18next';

type Filter = 'todos' | 'importantes' | 'pendentes';

export default function NotificationsPage() {
  const { currentCase, updateCase } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('todos');
  const [error, setError] = useState('');

  if (!currentCase) return null;

  const handleMarkRead = async (id: string) => {
    if (!currentCase) return;
    setError('');

    try {
      const updated = await markNotificationAsRead(currentCase, id);
      updateCase(currentCase.id, { notifications: updated });
    } catch (err) {
      setError(getApiErrorMessage(err, t('notificationsPage.updateError')));
    }
  };

  const filtered = currentCase.notifications.filter((n) => {
    if (filter === 'importantes') return n.type === 'critical' || n.type === 'alert';
    if (filter === 'pendentes') return !n.read;
    return true;
  });

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

      <h1 className="text-xl font-bold">{t('notificationsPage.title')}</h1>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
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

      {/* Notifications */}
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
            />
          ))
        )}
      </div>
    </div>
  );
}
