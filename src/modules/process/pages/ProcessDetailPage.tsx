import { useCases } from '@/modules/process';
import { VehicleCard } from '@/components/VehicleCard';
import { SeizureInfo } from '@/components/SeizureInfo';
import { LocationMap } from '@/components/LocationMap';
import { StatusCard } from '@/components/StatusCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Clock,
  ScrollText,
  FileText,
  Satellite,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';

export default function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { activeCases } = useCases();
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

  const pendingCount = caseData.pendencies.filter(
    (p) => p.status === 'pendente' || p.status === 'reprovado'
  ).length;

  const pendingTermCount = caseData.terms.filter(
    (t) => t.status === 'pendente'
  ).length;

  const completedSteps = caseData.timeline.filter((e) => e.completed).length;
  const totalSteps = caseData.timeline.length;

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/app/process')}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div>
        <h1 className="text-xl font-bold">{t('process.detail.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {caseData.code}
        </p>
      </div>

      <VehicleCard caseData={caseData} isSelected />

      <StatusCard
        status={caseData.status}
        timeRemainingMinutes={caseData.timeRemainingMinutes}
      />

      <SeizureInfo
        reason={caseData.seizureReason}
        seizureLocation={caseData.seizureLocation}
      />

      <Card className="border-0 shadow-md">
        <CardContent className="pt-5">
          <h2 className="text-base font-semibold mb-4">{t('process.detail.vehicleLocation')}</h2>
          <LocationMap location={caseData.vehicleLocation} />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('process.detail.sections')}
        </p>

        <button
          onClick={() => navigate(`/app/process/${id}/timeline`)}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium block">{t('process.detail.timeline')}</span>
              <span className="text-xs text-muted-foreground">
                {t('process.detail.timelineProgress', {
                  completed: completedSteps,
                  total: totalSteps,
                })}
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => navigate(`/app/process/${id}/pendencias`)}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium block">{t('process.detail.pendencies')}</span>
              {pendingCount > 0 && (
                <span className="text-xs text-warning">
                  {t('process.detail.pendingCount', { count: pendingCount })}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => navigate('/app/documentos')}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium block">{t('process.detail.documents')}</span>
              {pendingTermCount > 0 && (
                <span className="text-xs text-warning">
                  {t('process.detail.pendingDocCount', { count: pendingTermCount })}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => navigate('/app/gps')}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Satellite className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{t('process.detail.gpsStatus')}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {caseData.appointment && (
          <button
            onClick={() => navigate('/app/agendamento/confirmacao')}
            className="flex items-center justify-between w-full p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{t('process.detail.scheduling')}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
