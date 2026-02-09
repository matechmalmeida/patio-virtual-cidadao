import type { SeizureReason } from '@/types/case';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Scale } from 'lucide-react';

interface SeizureInfoProps {
  reason: SeizureReason;
  seizureLocation: string;
}

export function SeizureInfo({ reason, seizureLocation }: SeizureInfoProps) {
  return (
    <Card className="border-0 shadow-md bg-destructive/5 border-l-4 border-l-destructive/40">
      <CardContent className="pt-4 pb-4 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-foreground">Motivo da apreensão</h3>
            <p className="text-sm text-foreground/80 mt-1">{reason.description}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-1">
          <Scale className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">{reason.legalBasis}</p>
        </div>

        <div className="pt-1 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Local da apreensão:</span> {seizureLocation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
