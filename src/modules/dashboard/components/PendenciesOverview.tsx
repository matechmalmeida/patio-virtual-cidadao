import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import type { Pendency } from '@/types/case';
import { cn } from '@/lib/utils';

interface PendenciesOverviewProps {
  pendencies: Pendency[];
  caseId: string;
  className?: string;
}

export function PendenciesOverview({ pendencies, caseId, className }: PendenciesOverviewProps) {
  const { t } = useTranslation();

  const approvedCount = pendencies.filter((p) => p.status === 'aprovado').length;
  const total = pendencies.length;
  const progress = total > 0 ? (approvedCount / total) * 100 : 0;

  return (
    <Card className={cn('border-0 shadow-md', className)}>
      <CardContent className="pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t('dashboard.pendenciesOverview')}</h3>
          <Link
            to={`/app/process/${caseId}/pendencias`}
            className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline"
          >
            {t('dashboard.viewAll')}
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {approvedCount}/{total} {t('dashboard.resolved')}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="space-y-2">
          {pendencies.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2">
              <span className="text-sm truncate">{p.name}</span>
              <StatusBadge
                status={p.status}
                label={t(`pendency.statusLabels.${p.status}`)}
                variant="pendency"
                className="text-[10px] px-2 py-0.5 flex-shrink-0"
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
