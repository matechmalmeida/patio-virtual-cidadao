import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth';
import { AlertBanner } from '@/components/AlertBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ScheduleLocation, ScheduleSlot } from '@/types/case';
import { createAppointment } from '@/services/case.service';
import { getScheduleLocations, getScheduleSlots } from '@/services/schedule.service';
import { getApiErrorMessage } from '@/services/http/api-error';
import { queryKeys } from '@/lib/query-keys';

export default function SchedulingPage() {
  const { currentCase, updateCase } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: locations = [], isPending: isLocationsLoading } = useQuery<ScheduleLocation[]>({
    queryKey: queryKeys.schedule.locations(),
    queryFn: getScheduleLocations,
  });
  const { data: slots = [], isPending: isSlotsLoading } = useQuery<ScheduleSlot[]>({
    queryKey: queryKeys.schedule.slots(),
    queryFn: getScheduleSlots,
  });
  const isLoading = isLocationsLoading || isSlotsLoading;

  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<ScheduleLocation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'location' | 'datetime'>('location');

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return slots.filter((s) => s.date === dateStr);
  }, [selectedDate, slots]);

  const availableDates = useMemo(() => {
    const dates = new Set(slots.filter((s) => s.available).map((s) => s.date));
    return Array.from(dates).map((d) => new Date(d + 'T12:00:00'));
  }, [slots]);

  if (!currentCase) return null;

  const isApt = ['apto_retirada'].includes(currentCase.status);

  const pendingItems = currentCase.pendencies.filter(
    (p) => p.status !== 'aprovado'
  );

  const handleConfirm = async () => {
    if (!selectedLocation || !selectedSlot) return;
    setError('');
    const slot = slots.find((s) => s.id === selectedSlot);
    if (!slot) return;
    try {
      const result = await createAppointment(currentCase, selectedLocation, slot);
      updateCase(currentCase.id, result);
      navigate('/agendamento/confirmacao');
    } catch (err) {
      setError(getApiErrorMessage(err, t('scheduling.confirmError')));
    }
  };

  if (!isApt) {
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

        <h1 className="text-xl font-bold">{t('scheduling.title')}</h1>

        <AlertBanner variant="warning" title={t('scheduling.cannotSchedule')}>
          {t('scheduling.cannotScheduleDesc')}
        </AlertBanner>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-5 space-y-3">
            <h3 className="text-sm font-semibold">{t('scheduling.whatToResolve')}</h3>
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted"
              >
                <FileText className="h-4 w-4 text-warning" />
                <span>{item.name}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            ))}
            <Button
              onClick={() => navigate('/pendencias')}
              className="w-full mt-2"
            >
              {t('scheduling.goToPendencies')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          if (step === 'datetime') setStep('location');
          else navigate(-1);
        }}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <h1 className="text-xl font-bold">{t('scheduling.scheduleRemoval')}</h1>
      {error && <AlertBanner variant="error">{error}</AlertBanner>}
      {isLoading && <AlertBanner variant="info">{t('scheduling.loading')}</AlertBanner>}

      {step === 'location' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('scheduling.chooseLocation')}
          </p>

          <div className="space-y-3">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setSelectedLocation(loc);
                  setStep('datetime');
                }}
                className={cn(
                  'w-full text-left p-4 rounded-xl border bg-card transition-all',
                  selectedLocation?.id === loc.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{loc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{loc.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'datetime' && (
        <div className="space-y-5">
          {selectedLocation && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium">{selectedLocation.name}</span>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-3">{t('scheduling.chooseDate')}</h3>
            <Card className="border-0 shadow-md">
              <CardContent className="pt-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                  locale={ptBR}
                  disabled={(date) =>
                    !availableDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                  }
                  className="pointer-events-auto"
                />
              </CardContent>
            </Card>
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-sm font-semibold mb-3">{t('scheduling.availableSlots')}</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.length === 0 ? (
                  <p className="col-span-3 text-sm text-muted-foreground py-4 text-center">
                    {t('scheduling.noSlots')}
                  </p>
                ) : (
                  availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => slot.available && setSelectedSlot(slot.id)}
                      disabled={!slot.available}
                      className={cn(
                        'relative p-3 rounded-lg border text-sm font-medium transition-all',
                        !slot.available && 'opacity-40 cursor-not-allowed bg-muted line-through',
                        slot.available && selectedSlot === slot.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : slot.available && 'bg-card hover:border-primary/50',
                      )}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {slot.time}
                      </div>
                      {slot.recommended && slot.available && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center gap-0.5 bg-success text-success-foreground text-[9px] font-bold rounded-full px-1.5 py-0.5">
                          <Star className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {selectedSlot && (
            <Button
              onClick={handleConfirm}
              className="w-full h-12 font-semibold"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t('scheduling.confirm')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
