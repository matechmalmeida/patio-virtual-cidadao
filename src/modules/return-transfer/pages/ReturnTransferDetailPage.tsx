import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWithdrawalAppointmentDetail } from '../hooks/useReturnTransfer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Car,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Navigation,
} from 'lucide-react';
import { format } from 'date-fns';

function fmtPlate(plate: string) {
  const c = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return c.length === 7 ? `${c.slice(0, 3)}-${c.slice(3)}` : plate;
}

const STATUS_COLORS: Record<string, string> = {
  pendente: 'bg-amber-100 text-amber-700',
  confirmado: 'bg-blue-100 text-blue-700',
  rejeitado: 'bg-red-100 text-red-700',
  concluido: 'bg-green-100 text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  rejeitado: 'Rejeitado',
  concluido: 'Concluído',
};

export default function ReturnTransferDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: appointment, isLoading } = useWithdrawalAppointmentDetail(requestId!);

  if (isLoading) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!appointment) return null;

  const vehicle = appointment.seizure.vehicle;
  const vehicleDesc = [vehicle.brand, vehicle.model].filter(Boolean).join(' ');
  const googleMapsUrl = appointment.slot.location.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.slot.location.address)}`
    : null;

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('returnTransfer.detailTitle')}</h1>
        <Badge className={`text-xs ${STATUS_COLORS[appointment.status] ?? ''}`}>
          {STATUS_LABELS[appointment.status] ?? appointment.status}
        </Badge>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start gap-3">
            <Car className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t('returnTransfer.vehicle')}</p>
              <p className="text-sm font-semibold font-mono">{fmtPlate(vehicle.plate)}</p>
              {vehicleDesc && (
                <p className="text-xs text-muted-foreground">{vehicleDesc}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t('returnTransfer.location')}</p>
              <p className="text-sm font-semibold">{appointment.slot.location.name}</p>
              {appointment.slot.location.address && (
                <p className="text-xs text-muted-foreground">{appointment.slot.location.address}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t('returnTransfer.scheduledDate')}</p>
              <p className="text-sm font-semibold">
                {format(new Date(appointment.slot.date + 'T12:00:00'), 'dd/MM/yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t('returnTransfer.scheduledTime')}</p>
              <p className="text-sm font-semibold">{appointment.slot.time}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {appointment.notes && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-1">{t('returnTransfer.notes')}</p>
            <p className="text-sm">{appointment.notes}</p>
          </CardContent>
        </Card>
      )}

      {appointment.status === 'rejeitado' && appointment.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">Motivo da rejeição</p>
            <p className="text-sm text-red-700 mt-1">{appointment.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {t('returnTransfer.createdAt')}: {format(new Date(appointment.createdAt), 'dd/MM/yyyy HH:mm')}
      </div>

      {googleMapsUrl && (
        <div className="space-y-2">
          <Button variant="outline" className="w-full h-11" asChild>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" />
              {t('returnTransfer.viewRoute')}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
