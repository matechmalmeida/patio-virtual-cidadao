import { useCases } from '@/modules/process';
import { PendencyCard } from '../components/PendencyCard';
import { AlertBanner } from '@/components/AlertBanner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PendenciesPage() {
  const { id } = useParams<{ id: string }>();
  const { activeCases } = useCases();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const caseData = activeCases.find((c) => c.id === id);

  if (!caseData) return null;

  const { pendencies } = caseData;
  const pendingCount = pendencies.filter(
    (p) => p.status === 'pendente' || p.status === 'reprovado'
  ).length;
  const allResolved = pendingCount === 0;

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/app/process/${id}`)}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div>
        <h1 className="text-xl font-bold">{t('pendency.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {allResolved
            ? t('pendency.allResolved')
            : t('pendency.pendingCount', { count: pendingCount })}
        </p>
      </div>

      {allResolved && (
        <AlertBanner variant="success" title={t('pendency.congrats')}>
          {t('pendency.allResolvedBanner')}
        </AlertBanner>
      )}

      <div className="space-y-3">
        {pendencies.map((pendency) => (
          <PendencyCard key={pendency.id} pendency={pendency} />
        ))}
      </div>
    </div>
  );
}
