import { useAuth } from '@/modules/auth';
import { VehicleCard } from '@/components/VehicleCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProcessListPage() {
  const { activeCases } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const historicalCases: Array<{
    id: string;
    code: string;
    plate: string;
    vehicle: string;
    status: 'finalizado';
    createdAt: string;
    finishedAt: string;
    seizureReason: string;
  }> = [];

  return (
    <div className="px-4 py-5 space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('process.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('process.subtitle')}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5" />
          {t('process.active', { count: activeCases.length })}
        </p>

        {activeCases.map((c) => (
          <VehicleCard
            key={c.id}
            caseData={c}
            isSelected={false}
            onClick={() => navigate(`/app/process/${c.id}`)}
          />
        ))}

        {activeCases.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('process.noActive')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {historicalCases.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('process.history')}
          </p>

          {historicalCases.map((c) => (
            <Card key={c.id} className="opacity-70">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-muted flex items-center justify-center shrink-0 h-12 w-12">
                    <Car className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold tracking-wide">
                        {c.plate}
                      </span>
                      <StatusBadge status={c.status} label={t('status.finalizado')} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.vehicle}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                      {format(new Date(c.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      {' — '}
                      {format(new Date(c.finishedAt), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
