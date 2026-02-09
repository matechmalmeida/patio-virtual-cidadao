import { useAuth } from '@/modules/auth';
import { useNotifications } from '@/modules/notification';
import { VehicleCard } from '@/components/VehicleCard';
import { SeizureInfo } from '@/components/SeizureInfo';
import { LocationMap } from '@/components/LocationMap';
import { StatusCard } from '@/components/StatusCard';
import { AlertBanner } from '@/components/AlertBanner';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { ProcessStepper } from '@/components/ProcessStepper';
import { SummaryStatCard } from '@/components/SummaryStatCard';
import { PendenciesOverview } from '@/components/PendenciesOverview';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  CalendarDays,
  Clock,
  ChevronRight,
  Bell,
  Car,
  ScrollText,
  ClipboardList,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentCase, activeCases, selectCase } = useAuth();
  const { unreadCount } = useNotifications();
  const { t } = useTranslation();
  const { isOpen: showOnboarding, complete: completeOnboarding } = useOnboarding();

  if (!currentCase) return null;

  const pendingCount = currentCase.pendencies.filter(
    (p) => p.status === 'pendente' || p.status === 'reprovado'
  ).length;

  const approvedCount = currentCase.pendencies.filter(
    (p) => p.status === 'aprovado'
  ).length;

  const pendingTerms = currentCase.terms?.filter((t) => t.status === 'pendente') ?? [];
  const hasPendingTerms = pendingTerms.length > 0;
  const pendingTermCount = pendingTerms.length;

  const showPendenciesAction = ['pendencias_regularizar', 'custodia_domiciliar'].includes(
    currentCase.status
  );
  const showScheduleAction = currentCase.status === 'apto_retirada';
  const showWaitingMessage = currentCase.status === 'aguardando_validacao';

  const hasMultipleCases = activeCases.length > 1;

  return (
    <div className="px-4 py-5">
      <OnboardingTutorial isOpen={showOnboarding} onComplete={completeOnboarding} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vehicle selector / header — full width */}
        <div className="lg:col-span-2">
          {hasMultipleCases ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5" />
                {t('dashboard.activeRemovals')} ({activeCases.length})
              </p>
              <div className="space-y-2">
                {activeCases.map((c) => (
                  <VehicleCard
                    key={c.id}
                    caseData={c}
                    isSelected={c.id === currentCase.id}
                    onClick={() => selectCase(c.id)}
                    compact
                  />
                ))}
              </div>
            </div>
          ) : (
            <VehicleCard caseData={currentCase} isSelected />
          )}
        </div>

        {/* Process Stepper — full width */}
        <div className="lg:col-span-2">
          <ProcessStepper status={currentCase.status} />
        </div>

        {/* Summary Stats — 3 columns */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-3">
          <SummaryStatCard
            value={`${approvedCount}/${currentCase.pendencies.length}`}
            label={t('dashboard.pendenciesResolved')}
            icon={ClipboardList}
            variant={pendingCount > 0 ? 'warning' : 'success'}
            to={`/app/process/${currentCase.id}/pendencias`}
          />
          <SummaryStatCard
            value={pendingTermCount}
            label={t('dashboard.documentsToSignShort')}
            icon={FileText}
            variant={pendingTermCount > 0 ? 'info' : 'muted'}
            to="/app/documentos"
          />
          <SummaryStatCard
            value={unreadCount}
            label={t('dashboard.unreadNotifications')}
            icon={Bell}
            variant={unreadCount > 0 ? 'warning' : 'muted'}
            to="/app/notifications"
          />
        </div>

        {/* Next Action CTA */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5 space-y-4">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {t('dashboard.howToResolve')}
            </h2>

            {showPendenciesAction && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.pendenciesToResolve', {
                    count: pendingCount,
                    label: t('dashboard.pendenciesCount', { count: pendingCount }),
                  }).replace(/<\/?strong>/g, '')}
                </p>
                <Button asChild className="w-full h-11 font-semibold">
                  <Link to={`/app/process/${currentCase.id}/pendencias`}>
                    <FileText className="h-4 w-4" />
                    {t('dashboard.viewPendencies')}
                  </Link>
                </Button>
                {pendingTermCount > 0 && (
                  <Button asChild variant="outline" className="w-full h-11 font-semibold">
                    <Link to="/app/documentos">
                      <ScrollText className="h-4 w-4" />
                      {t('dashboard.viewDocuments')}
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {showScheduleAction && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.allClear')}
                </p>
                <Button asChild className="w-full h-11 font-semibold">
                  <Link to="/agendamento">
                    <CalendarDays className="h-4 w-4" />
                    {t('dashboard.scheduleRemoval')}
                  </Link>
                </Button>
              </div>
            )}

            {showWaitingMessage && (
              <AlertBanner variant="info">
                {t('dashboard.waitingValidation')}
              </AlertBanner>
            )}

            {currentCase.status === 'aguardando_retirada' && currentCase.appointment && (
              <AlertBanner variant="success" title={t('dashboard.appointmentConfirmed')}>
                {t('dashboard.appointmentDetails', {
                  location: currentCase.appointment.location.name,
                  date: currentCase.appointment.date,
                  time: currentCase.appointment.time,
                }).replace(/<\/?strong>/g, '')}
              </AlertBanner>
            )}

            {currentCase.status === 'finalizado' && (
              <AlertBanner variant="success" title={t('dashboard.vehicleReleased')}>
                {t('dashboard.vehicleReleasedText')}
              </AlertBanner>
            )}
          </CardContent>
        </Card>

        {/* Pendencies Overview */}
        <PendenciesOverview
          pendencies={currentCase.pendencies}
          caseId={currentCase.id}
        />

        {/* Pending terms alerts — full width if present */}
        {hasPendingTerms && (
          <div className="lg:col-span-2 space-y-3">
            {pendingTerms.map((term) => (
              <Link key={term.id} to={`/app/documentos/${term.id}`} className="block">
                <AlertBanner variant="warning" className="cursor-pointer hover:opacity-90 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScrollText className="h-4 w-4" />
                      <div>
                        <span className="font-semibold text-sm block">{term.title}</span>
                        <span className="text-xs opacity-80">{t('dashboard.pendingTerm')}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  </div>
                </AlertBanner>
              </Link>
            ))}
          </div>
        )}

        {/* Seizure Info */}
        <SeizureInfo
          reason={currentCase.seizureReason}
          seizureLocation={currentCase.seizureLocation}
        />

        {/* Vehicle Location */}
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5">
            <h2 className="text-base font-semibold mb-4">{t('dashboard.vehicleLocation')}</h2>
            <LocationMap location={currentCase.vehicleLocation} />
          </CardContent>
        </Card>

        {/* Current status — full width */}
        <div className="lg:col-span-2">
          <StatusCard
            status={currentCase.status}
            timeRemainingMinutes={currentCase.timeRemainingMinutes}
          />
        </div>
      </div>
    </div>
  );
}
