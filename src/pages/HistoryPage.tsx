import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Car, ChevronRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { HistoricalCase } from '@/types/case';
import { getHistoricalCases } from '@/services/history.service';
import { AlertBanner } from '@/components/AlertBanner';
import { getApiErrorMessage } from '@/services/http/api-error';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { activeCases } = useAuth();
  const [historicalCases, setHistoricalCases] = useState<HistoricalCase[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    getHistoricalCases()
      .then((items) => {
        if (!isMounted) return;
        setHistoricalCases(items);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(getApiErrorMessage(err, 'Não foi possível carregar o histórico de casos.'));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <h1 className="text-xl font-bold">Histórico de remoções</h1>
      <p className="text-sm text-muted-foreground">
        Remoções ativas e anteriores vinculadas ao seu cadastro.
      </p>
      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      {/* Active removals */}
      {activeCases.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-warning uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Remoções ativas ({activeCases.length})
          </p>
          {activeCases.map((c) => (
            <Card key={c.id} className="border-2 border-warning/30 shadow-md">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-warning" />
                      <span className="text-sm font-bold">{c.plate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.vehicle} — {c.vehicleColor}</p>
                    <p className="text-xs text-muted-foreground">Código: {c.code}</p>
                    <p className="text-xs text-muted-foreground">
                      Motivo: {c.seizureReason.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      Desde {format(new Date(c.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Historical cases */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Remoções anteriores
        </p>
        {historicalCases.length === 0 ? (
          <div className="text-center py-8">
            <Car className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma remoção anterior.</p>
          </div>
        ) : (
          historicalCases.map((c) => (
            <Card key={c.id} className="border-0 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold">{c.plate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.vehicle}</p>
                    <p className="text-xs text-muted-foreground">Motivo: {c.seizureReason}</p>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span className="font-medium">Finalizado</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70">
                      {format(new Date(c.createdAt), "dd/MM/yyyy", { locale: ptBR })} —{' '}
                      {format(new Date(c.finishedAt), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
