import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';
import { seizureStatusConfig, type SeizureStatus } from '@/data/seizureStatusConfig';
import type { SeizureListItem } from '../types/seizure';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SeizureCardProps {
  item: SeizureListItem;
}

function fmtPlate(plate: string) {
  const c = plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  return c.length === 7 ? `${c.slice(0, 3)}-${c.slice(3)}` : plate;
}

export function SeizureCard({ item }: SeizureCardProps) {
  const navigate = useNavigate();
  const statusConfig = seizureStatusConfig[item.status.slug as SeizureStatus];

  const firstViolation = item.violations?.[0];

  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => navigate(`/app/apreensao/${item.id}/status`)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono font-bold text-sm">{item.number}</span>
          <Badge variant="outline" className={statusConfig?.className}>
            {item.status.name}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-muted">
              <Car className="h-3.5 w-3.5 text-foreground" />
            </div>
            <span className="font-mono font-semibold text-xs">{fmtPlate(item.vehicle.plate)}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        {firstViolation && (
          <div className="flex items-start gap-2">
            <div className="p-1.5 rounded-md bg-muted">
              <AlertTriangle className="h-3.5 w-3.5 text-foreground" />
            </div>
            <div className="min-w-0">
              <span className="font-mono font-semibold text-xs">{firstViolation.violationType.code}</span>
              {firstViolation.violationType.shortDescription && (
                <p className="text-[10px] text-muted-foreground truncate">{firstViolation.violationType.shortDescription}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="p-1.5 rounded-md bg-muted">
            <Calendar className="h-3.5 w-3.5 text-foreground" />
          </div>
          {format(new Date(item.createdAt), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })}
        </div>
      </CardContent>
    </Card>
  );
}
