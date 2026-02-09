import type { CaseData } from '@/types/case';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { statusLabels } from '@/data/statusConfig';
import { Car, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  caseData: CaseData;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function VehicleCard({ caseData, isSelected, onClick, compact }: VehicleCardProps) {
  return (
    <Card
      className={cn(
        'border-2 transition-all cursor-pointer hover:shadow-md',
        isSelected ? 'border-primary shadow-md' : 'border-transparent',
        compact && 'shadow-sm'
      )}
      onClick={onClick}
    >
      <CardContent className={cn('pt-4 pb-4', compact && 'pt-3 pb-3')}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'rounded-xl bg-muted flex items-center justify-center shrink-0',
              compact ? 'h-12 w-12' : 'h-16 w-16'
            )}
          >
            <Car className={cn('text-muted-foreground', compact ? 'h-6 w-6' : 'h-8 w-8')} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={cn('font-bold tracking-wide', compact ? 'text-sm' : 'text-lg')}>
                {caseData.plate}
              </span>
              <StatusBadge
                status={caseData.status}
                label={statusLabels[caseData.status]}
              />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {caseData.vehicle} — {caseData.vehicleColor}
            </p>
            {!compact && (
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                Código: {caseData.code}
              </p>
            )}
          </div>

          {onClick && <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />}
        </div>
      </CardContent>
    </Card>
  );
}
