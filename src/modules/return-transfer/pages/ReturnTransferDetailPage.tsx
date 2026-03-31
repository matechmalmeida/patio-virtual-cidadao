import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReturnRequestDetail, useCancelReturnRequest } from '../hooks/useReturnTransfer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Car,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  XCircle,
  Navigation,
} from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  'pendente': 'bg-amber-100 text-amber-700',
  'aprovada': 'bg-blue-100 text-blue-700',
  'em-andamento': 'bg-indigo-100 text-indigo-700',
  'concluida': 'bg-green-100 text-green-700',
  'rejeitada': 'bg-red-100 text-red-700',
  'cancelada': 'bg-gray-100 text-gray-500',
};

export default function ReturnTransferDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: request, isLoading } = useReturnRequestDetail(requestId!);
  const cancelMutation = useCancelReturnRequest();

  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const isPending = request?.status.slug === 'pendente';

  const handleCancel = async () => {
    if (!request || !cancelReason.trim()) return;
    await cancelMutation.mutateAsync({ id: request.id, reason: cancelReason.trim() });
    setShowCancel(false);
    setCancelReason('');
  };

  if (isLoading) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!request) return null;

  const params = request.parameters;
  const locationLat = params?.scheduleLocationId ? undefined : undefined;
  const googleMapsUrl = params?.locationAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(params.locationAddress)}`
    : null;

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('returnTransfer.detailTitle')}</h1>
        <Badge className={`text-xs ${STATUS_COLORS[request.status.slug] ?? ''}`}>
          {request.status.name}
        </Badge>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start gap-3">
            <Car className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">{t('returnTransfer.vehicle')}</p>
              <p className="text-sm font-semibold font-mono">{params?.vehiclePlate ?? '---'}</p>
              {params?.vehicleDescription && (
                <p className="text-xs text-muted-foreground">{params.vehicleDescription}</p>
              )}
            </div>
          </div>

          {params?.locationName && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t('returnTransfer.location')}</p>
                <p className="text-sm font-semibold">{params.locationName}</p>
                {params.locationAddress && (
                  <p className="text-xs text-muted-foreground">{params.locationAddress}</p>
                )}
              </div>
            </div>
          )}

          {params?.scheduledDate && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t('returnTransfer.scheduledDate')}</p>
                <p className="text-sm font-semibold">{params.scheduledDate}</p>
              </div>
            </div>
          )}

          {params?.scheduledTime && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t('returnTransfer.scheduledTime')}</p>
                <p className="text-sm font-semibold">{params.scheduledTime}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {request.notes && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground mb-1">{t('returnTransfer.notes')}</p>
            <p className="text-sm">{request.notes}</p>
          </CardContent>
        </Card>
      )}

      {request.cancellationReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">{t('returnTransfer.cancellationReason')}</p>
            <p className="text-sm text-red-700 mt-1">{request.cancellationReason}</p>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {t('returnTransfer.createdAt')}: {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}
      </div>

      <div className="space-y-2">
        {googleMapsUrl && (
          <Button variant="outline" className="w-full h-11" asChild>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" />
              {t('returnTransfer.viewRoute')}
            </a>
          </Button>
        )}

        {isPending && (
          <Button
            variant="destructive"
            className="w-full h-11"
            onClick={() => setShowCancel(true)}
          >
            <XCircle className="h-4 w-4" />
            {t('returnTransfer.cancelRequest')}
          </Button>
        )}
      </div>

      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('returnTransfer.cancelDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('returnTransfer.cancelDialogDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder={t('returnTransfer.cancelReasonPlaceholder')}
            maxLength={200}
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.back')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? t('returnTransfer.cancelling') : t('returnTransfer.confirmCancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
