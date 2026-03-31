import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useMySeizures } from '@/modules/seizure/hooks/useSeizure';
import { getScheduleLocations, getScheduleSlots } from '@/modules/scheduling/services/schedule.service';
import { useCreateReturnRequest } from '../hooks/useReturnTransfer';
import type { SeizureListItem } from '@/modules/seizure/types/seizure';
import type { ScheduleLocation, ScheduleSlot } from '@/types/case';
import { AlertBanner } from '@/components/AlertBanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  Car,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { queryKeys } from '@/lib/query-keys';

type WizardStep = 'seizure' | 'location' | 'datetime' | 'review';

export default function ReturnTransferWizardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const preSelectedSeizureId = searchParams.get('seizureId');

  const [step, setStep] = useState<WizardStep>(preSelectedSeizureId ? 'location' : 'seizure');
  const [selectedSeizure, setSelectedSeizure] = useState<SeizureListItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ScheduleLocation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const { data: seizuresData, isLoading: seizuresLoading } = useMySeizures(1);
  const createMutation = useCreateReturnRequest();

  const eligibleSeizures = useMemo(() => {
    if (!seizuresData?.data) return [];
    return seizuresData.data.filter((s) => s.status.slug === 'custodia-virtual');
  }, [seizuresData]);

  useEffect(() => {
    if (preSelectedSeizureId && eligibleSeizures.length > 0 && !selectedSeizure) {
      const found = eligibleSeizures.find((s) => s.id === preSelectedSeizureId);
      if (found) setSelectedSeizure(found);
    }
  }, [preSelectedSeizureId, eligibleSeizures, selectedSeizure]);

  const { data: locations = [], isPending: locationsLoading } = useQuery<ScheduleLocation[]>({
    queryKey: queryKeys.schedule.locations(),
    queryFn: getScheduleLocations,
    enabled: step === 'location' || step === 'datetime' || step === 'review',
  });

  const { data: slots = [], isPending: slotsLoading } = useQuery<ScheduleSlot[]>({
    queryKey: [...queryKeys.schedule.slots(), selectedLocation?.id],
    queryFn: () => getScheduleSlots(selectedLocation?.id),
    enabled: !!selectedLocation && (step === 'datetime' || step === 'review'),
  });

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return slots.filter((s) => s.date === dateStr);
  }, [selectedDate, slots]);

  const availableDates = useMemo(() => {
    const dates = new Set(slots.filter((s) => s.available).map((s) => s.date));
    return Array.from(dates).map((d) => new Date(d + 'T12:00:00'));
  }, [slots]);

  const selectedSlotData = slots.find((s) => s.id === selectedSlot);

  const handleBack = () => {
    setError('');
    if (step === 'review') { setStep('datetime'); return; }
    if (step === 'datetime') { setStep('location'); return; }
    if (step === 'location') {
      if (preSelectedSeizureId) { navigate(-1); return; }
      setStep('seizure');
      return;
    }
    navigate(-1);
  };

  const handleSelectSeizure = (seizure: SeizureListItem) => {
    setSelectedSeizure(seizure);
    setStep('location');
  };

  const handleSelectLocation = (location: ScheduleLocation) => {
    setSelectedLocation(location);
    setSelectedDate(undefined);
    setSelectedSlot(null);
    setStep('datetime');
  };

  const handleConfirm = async () => {
    if (!selectedSeizure || !selectedLocation || !selectedSlotData) return;
    setError('');

    const vehicleDesc = [selectedSeizure.vehicle.brand, selectedSeizure.vehicle.model, selectedSeizure.vehicle.color]
      .filter(Boolean)
      .join(' ');

    try {
      const result = await createMutation.mutateAsync({
        notes: notes || undefined,
        parameters: {
          seizureId: selectedSeizure.id,
          vehiclePlate: selectedSeizure.vehicle.plate,
          vehicleDescription: vehicleDesc,
          scheduleLocationId: selectedLocation.id,
          locationName: selectedLocation.name,
          locationAddress: selectedLocation.address ?? '',
          scheduledDate: selectedSlotData.date,
          scheduledTime: selectedSlotData.time,
        },
      });
      navigate(`/app/translado-retorno/${result.id}`, { replace: true });
    } catch {
      setError(t('returnTransfer.confirmError'));
    }
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <h1 className="text-xl font-bold">{t('returnTransfer.wizardTitle')}</h1>

      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      {step === 'seizure' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('returnTransfer.selectSeizure')}</p>

          {seizuresLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          )}

          {!seizuresLoading && eligibleSeizures.length === 0 && (
            <AlertBanner variant="info">{t('returnTransfer.noEligible')}</AlertBanner>
          )}

          <div className="space-y-3">
            {eligibleSeizures.map((seizure) => (
              <button
                key={seizure.id}
                onClick={() => handleSelectSeizure(seizure)}
                className="w-full text-left p-4 rounded-xl border bg-card transition-all hover:border-primary/50"
              >
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-mono font-bold">{seizure.vehicle.plate}</p>
                    {seizure.vehicle.brand && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {seizure.vehicle.brand} {seizure.vehicle.model} - {seizure.vehicle.color}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">N. {seizure.number}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'location' && (
        <div className="space-y-4">
          {selectedSeizure && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
              <Car className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium font-mono">{selectedSeizure.vehicle.plate}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground">{t('returnTransfer.selectLocation')}</p>

          {locationsLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          )}

          <div className="space-y-3">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border bg-card transition-all',
                  selectedLocation?.id === loc.id
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'hover:border-primary/50',
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
          {selectedSeizure && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
              <Car className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium font-mono">{selectedSeizure.vehicle.plate}</span>
            </div>
          )}

          {selectedLocation && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-medium">{selectedLocation.name}</span>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold mb-3">{t('returnTransfer.selectDate')}</h3>
            {slotsLoading ? (
              <Skeleton className="h-72 w-full rounded-xl" />
            ) : (
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
                      !availableDates.some((d) => d.toDateString() === date.toDateString())
                    }
                    className="pointer-events-auto"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {selectedDate && (
            <div>
              <h3 className="text-sm font-semibold mb-3">{t('returnTransfer.selectTime')}</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.length === 0 ? (
                  <p className="col-span-3 text-sm text-muted-foreground py-4 text-center">
                    {t('returnTransfer.noSlots')}
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
            <Button onClick={() => setStep('review')} className="w-full h-12 font-semibold">
              {t('returnTransfer.continue')}
            </Button>
          )}
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-5">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-5 space-y-4">
              <h3 className="text-sm font-semibold">{t('returnTransfer.reviewTitle')}</h3>

              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('returnTransfer.vehicle')}</p>
                  <p className="text-sm font-semibold font-mono">{selectedSeizure?.vehicle.plate}</p>
                  {selectedSeizure?.vehicle.brand && (
                    <p className="text-xs text-muted-foreground">
                      {selectedSeizure.vehicle.brand} {selectedSeizure.vehicle.model}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('returnTransfer.location')}</p>
                  <p className="text-sm font-semibold">{selectedLocation?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedLocation?.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('returnTransfer.dateTime')}</p>
                  <p className="text-sm font-semibold">
                    {selectedSlotData?.date} - {selectedSlotData?.time}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-semibold">{t('returnTransfer.notesLabel')}</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('returnTransfer.notesPlaceholder')}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">{notes.length}/200</p>
          </div>

          <Button
            onClick={handleConfirm}
            disabled={createMutation.isPending}
            className="w-full h-12 font-semibold"
          >
            <CheckCircle2 className="h-4 w-4" />
            {createMutation.isPending ? t('returnTransfer.submitting') : t('returnTransfer.confirm')}
          </Button>
        </div>
      )}
    </div>
  );
}
