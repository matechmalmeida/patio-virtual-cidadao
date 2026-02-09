import { useAuth } from '@/modules/auth';
import { useNotifications } from '@/modules/notification';
import { VehicleCard } from '@/components/VehicleCard';
import { SeizureInfo } from '@/components/SeizureInfo';
import { LocationMap } from '@/components/LocationMap';
import { StatusCard } from '@/components/StatusCard';
import { AlertBanner } from '@/components/AlertBanner';
import { OnboardingTutorial } from '@/components/OnboardingTutorial';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useBrand } from '@/contexts/BrandContext';
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
  Phone,
  MessageCircle,
  Car,
  ScrollText,
  Satellite,
  Settings,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentCase, activeCases, selectCase } = useAuth();
  const { unreadCount } = useNotifications();
  const { t } = useTranslation();
  const { isOpen: showOnboarding, complete: completeOnboarding } = useOnboarding();
  const { brand } = useBrand();

  if (!currentCase) return null;

  const pendingCount = currentCase.pendencies.filter(
    (p) => p.status === 'pendente' || p.status === 'reprovado'
  ).length;

  const pendingTerms = currentCase.terms?.filter((t) => t.status === 'pendente') ?? [];
  const hasPendingTerms = pendingTerms.length > 0;

  const showPendenciesAction = ['pendencias_regularizar', 'custodia_domiciliar'].includes(
    currentCase.status
  );
  const showScheduleAction = currentCase.status === 'apto_retirada';
  const showWaitingMessage = currentCase.status === 'aguardando_validacao';

  const hasMultipleCases = activeCases.length > 1;

  return (
    <div className="px-4 py-5 space-y-5">
      <OnboardingTutorial isOpen={showOnboarding} onComplete={completeOnboarding} />
      {/* Vehicle selector when multiple cases */}
      {hasMultipleCases && (
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
      )}

      {/* Vehicle card — single case or selected */}
      {!hasMultipleCases && (
        <VehicleCard caseData={currentCase} isSelected />
      )}

      {/* Current status */}
      <StatusCard
        status={currentCase.status}
        timeRemainingMinutes={currentCase.timeRemainingMinutes}
      />

      {/* Pending terms — requires immediate attention */}
      {hasPendingTerms && (
        <div className="space-y-2">
          {pendingTerms.map((term) => (
            <Link key={term.id} to={`/termo/${term.id}`}>
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

      {/* Seizure reason — why was it seized */}
      <SeizureInfo
        reason={currentCase.seizureReason}
        seizureLocation={currentCase.seizureLocation}
      />

      {/* Notifications banner */}
      {unreadCount > 0 && (
        <Link to="/app/notifications">
          <AlertBanner variant="warning" className="cursor-pointer hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="font-medium">
                  {t('dashboard.newAlert', { count: unreadCount })}
                </span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </AlertBanner>
        </Link>
      )}

      {/* What to do now */}
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
                <Link to="/pendencias">
                  <FileText className="h-4 w-4" />
                  {t('dashboard.viewPendencies')}
                </Link>
              </Button>
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

      {/* Vehicle Location */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-5">
          <h2 className="text-base font-semibold mb-4">{t('dashboard.vehicleLocation')}</h2>
          <LocationMap location={currentCase.vehicleLocation} />
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="space-y-2">
        <Link to="/gps" className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <Satellite className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{t('dashboard.gpsStatus')}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link to={`/app/process/${currentCase.id}/timeline`} className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{t('dashboard.processTimeline')}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link to="/historico" className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{t('dashboard.removalHistory')}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link to="/app/notifications/settings" className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{t('dashboard.pushSettings')}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      {/* Support footer */}
      <Card className="border-0 shadow-sm bg-muted/50">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground font-medium mb-3">{t('dashboard.needHelp')}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
              <Link to="/suporte">
                <MessageCircle className="h-3.5 w-3.5" />
                {t('dashboard.support')}
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Phone className="h-3.5 w-3.5" />
              {brand?.supportPhone ?? '(85) 3452-1234'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
