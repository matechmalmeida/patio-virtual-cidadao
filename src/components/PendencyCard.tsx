import { cn } from '@/lib/utils';
import type { Pendency } from '@/types/case';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Upload, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PendencyCardProps {
  pendency: Pendency;
  className?: string;
}

export function PendencyCard({ pendency, className }: PendencyCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 space-y-3 animate-slide-up',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">{pendency.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {pendency.description}
          </p>
        </div>
        <StatusBadge
          status={pendency.status}
          label={t(`pendency.statusLabels.${pendency.status}`)}
          variant="pendency"
        />
      </div>

      {pendency.value != null && (
        <p className="text-lg font-bold">
          R$ {pendency.value.toFixed(2).replace('.', ',')}
        </p>
      )}

      {pendency.status === 'reprovado' && pendency.rejectionReason && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{t('pendency.rejectionReason')}</p>
            <p>{pendency.rejectionReason}</p>
          </div>
        </div>
      )}

      {(pendency.status === 'pendente' || pendency.status === 'reprovado') && (
        <div className="flex gap-2">
          {pendency.value != null && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => navigate(`/pendencias/${pendency.id}/pagamento`)}
            >
              <CreditCard className="h-3.5 w-3.5" />
              {t('pendency.pay')}
            </Button>
          )}
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={() => navigate(`/pendencias/${pendency.id}/upload`)}
          >
            <Upload className="h-3.5 w-3.5" />
            {t('pendency.sendProof')}
          </Button>
        </div>
      )}
    </div>
  );
}
