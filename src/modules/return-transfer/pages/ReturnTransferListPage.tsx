import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMyReturnRequests } from '../hooks/useReturnTransfer';
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

const STATUS_COLORS: Record<string, string> = {
  'pendente': 'bg-amber-100 text-amber-700',
  'aprovada': 'bg-blue-100 text-blue-700',
  'em-andamento': 'bg-indigo-100 text-indigo-700',
  'concluida': 'bg-green-100 text-green-700',
  'rejeitada': 'bg-red-100 text-red-700',
  'cancelada': 'bg-gray-100 text-gray-500',
};

export default function ReturnTransferListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useMyReturnRequests(page);

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
            {data.data.map((request) => (
              <Card
                key={request.id}
                className="cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors"
                onClick={() => navigate(`/app/translado-retorno/${request.id}`)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">
                      {request.parameters?.vehiclePlate ?? '---'}
                    </span>
                    <Badge className={`text-xs ${STATUS_COLORS[request.status.slug] ?? ''}`}>
                      {request.status.name}
                    </Badge>
                  </div>

                  {request.parameters?.vehicleDescription && (
                    <p className="text-xs text-muted-foreground">
                      {request.parameters.vehicleDescription}
                    </p>
                  )}

                  {request.parameters?.locationName && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{request.parameters.locationName}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {request.parameters?.scheduledDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{request.parameters.scheduledDate}</span>
                      </div>
                    )}
                    {request.parameters?.scheduledTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{request.parameters.scheduledTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>{t('returnTransfer.createdAt')}</span>
                    <span>{format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
