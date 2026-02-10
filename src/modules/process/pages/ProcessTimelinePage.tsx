import { useAuth } from '@/modules/auth';
import { TimelineItem } from '../components/TimelineItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProcessTimelinePage() {
  const { id } = useParams<{ id: string }>();
  const { activeCases } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const caseData = activeCases.find((c) => c.id === id);

  if (!caseData) {
    return (
      <div className="px-4 py-5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/app/process')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('common.back')}
        </Button>
        <p className="text-sm text-muted-foreground">{t('process.notFound')}</p>
      </div>
    );
  }

  const completedCount = caseData.timeline.filter((e) => e.completed).length;
  const totalCount = caseData.timeline.length;

  return (
    <div className="px-4 py-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/app/process/${id}`)}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <h1 className="text-xl font-bold mb-1">{t('timeline.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {t('timeline.progress', { completed: completedCount, total: totalCount })}
      </p>

      <div className="h-2 w-full rounded-full bg-muted mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="pl-1">
        {caseData.timeline.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={index === caseData.timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
