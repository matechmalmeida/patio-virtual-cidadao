import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface BatchActionBarProps {
  selectedCount: number;
  hasUnreadInSelection: boolean;
  onMarkRead: () => void;
  onDelete: () => void;
  onDeselectAll: () => void;
  loading?: boolean;
}

export function BatchActionBar({
  selectedCount,
  hasUnreadInSelection,
  onMarkRead,
  onDelete,
  onDeselectAll,
  loading,
}: BatchActionBarProps) {
  const { t } = useTranslation();

  return (
    <div className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur p-3 flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium mr-auto">
        {t('notificationsPage.selectedCount', { count: selectedCount })}
      </span>
      <Button variant="outline" size="sm" onClick={onDeselectAll} disabled={loading}>
        {t('notificationsPage.deselectAll')}
      </Button>
      {hasUnreadInSelection && (
        <Button variant="secondary" size="sm" onClick={onMarkRead} disabled={loading}>
          {t('notificationsPage.batchMarkRead')}
        </Button>
      )}
      <Button variant="destructive" size="sm" onClick={onDelete} disabled={loading}>
        {t('notificationsPage.batchDelete')}
      </Button>
    </div>
  );
}
