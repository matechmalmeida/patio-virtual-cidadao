import { useAuth } from '@/modules/auth';
import { TimelineItem } from '@/components/TimelineItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TimelinePage() {
  const { currentCase } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!currentCase) return null;

  const completedCount = currentCase.timeline.filter((e) => e.completed).length;
  const totalCount = currentCase.timeline.length;

  return (
    <div className="px-4 py-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <h1 className="text-xl font-bold mb-1">{t('timeline.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {t('timeline.progress', { completed: completedCount, total: totalCount })}
      </p>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-muted mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Timeline */}
      <div className="pl-1">
        {currentCase.timeline.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={index === currentCase.timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
