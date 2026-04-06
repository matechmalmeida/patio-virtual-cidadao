import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMyWithdrawalAppointments } from '../hooks/useReturnTransfer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  RotateCcw,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
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

export default function ReturnTransferListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useMyWithdrawalAppointments(page);

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('returnTransfer.title')}</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" onClick={() => navigate('/app/translado-retorno/novo')}>
            <Plus className="h-4 w-4 mr-1" />
            {t('returnTransfer.new')}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-8">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{t('returnTransfer.loadError')}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            {t('returnTransfer.retry')}
          </Button>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="text-center py-12">
          <RotateCcw className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t('returnTransfer.empty')}</p>
          <Button size="sm" className="mt-4" onClick={() => navigate('/app/translado-retorno/novo')}>
            <Plus className="h-4 w-4 mr-1" />
            {t('returnTransfer.createFirst')}
          </Button>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((appointment) => {
              const vehicle = appointment.seizure.vehicle;
              const vehicleDesc = [vehicle.brand, vehicle.model, vehicle.color ? `- ${vehicle.color}` : null]
                .filter(Boolean)
                .join(' ');

              return (
                <Card
                  key={appointment.id}
                  className="cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors"
                  onClick={() => navigate(`/app/translado-retorno/${appointment.id}`)}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold">
                        {fmtPlate(vehicle.plate)}
                      </span>
                      <Badge className={`text-xs ${STATUS_COLORS[appointment.status] ?? ''}`}>
                        {STATUS_LABELS[appointment.status] ?? appointment.status}
                      </Badge>
                    </div>

                    {vehicleDesc && (
                      <p className="text-xs text-muted-foreground">{vehicleDesc}</p>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{appointment.slot.location.name}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(appointment.slot.date + 'T12:00:00'), 'dd/MM/yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{appointment.slot.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{t('returnTransfer.createdAt')}</span>
                      <span>{format(new Date(appointment.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {t('returnTransfer.pagination', { current: data.meta.page, total: data.meta.totalPages })}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
