import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMySeizures } from '../hooks/useSeizure';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, RefreshCw, Car, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS: Record<string, string> = {
  'rascunho': 'bg-gray-100 text-gray-700',
  'aguardando-assinatura': 'bg-amber-100 text-amber-700',
  'aguardando-equipamento': 'bg-blue-100 text-blue-700',
  'em-deslocamento': 'bg-indigo-100 text-indigo-700',
  'custodia-virtual': 'bg-green-100 text-green-700',
  'custodia-violada': 'bg-red-100 text-red-700',
  'aguardando-retirada': 'bg-orange-100 text-orange-700',
  'finalizado': 'bg-emerald-100 text-emerald-700',
  'cancelado': 'bg-gray-100 text-gray-500',
};

export default function SeizureListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useMySeizures(page);

  const handleClick = (seizureId: string, statusSlug: string) => {
    if (statusSlug === 'aguardando-assinatura') {
      navigate(`/app/apreensao/${seizureId}/termo`);
    } else {
      navigate(`/app/apreensao/${seizureId}/status`);
    }
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Minhas Apreensoes</h1>
        <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-8">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Nao foi possivel carregar as apreensoes.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma apreensao encontrada.</p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((seizure) => (
              <Card
                key={seizure.id}
                className="cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors"
                onClick={() => handleClick(seizure.id, seizure.status.slug)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">{seizure.vehicle.plate}</span>
                    <Badge className={`text-xs ${STATUS_COLORS[seizure.status.slug] ?? ''}`}>
                      {seizure.status.name}
                    </Badge>
                  </div>
                  {seizure.vehicle.brand && (
                    <p className="text-xs text-muted-foreground">
                      {seizure.vehicle.brand} {seizure.vehicle.model} - {seizure.vehicle.color}
                    </p>
                  )}
                  {seizure.violations?.[0] && (
                    <p className="text-xs text-muted-foreground">
                      {seizure.violations[0].violationType.code} - {seizure.violations[0].violationType.shortDescription}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>N. {seizure.number}</span>
                    <span>{format(new Date(seizure.createdAt), 'dd/MM/yyyy HH:mm')}</span>
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
                Pagina {data.meta.page} de {data.meta.totalPages}
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
