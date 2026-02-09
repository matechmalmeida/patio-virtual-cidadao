import { cn } from '@/lib/utils';
import type { CaseStatus, PendencyStatus } from '@/types/case';

const caseStatusStyles: Record<CaseStatus, string> = {
  em_deslocamento: 'bg-info/15 text-info border-info/30',
  custodia_domiciliar: 'bg-warning/15 text-warning border-warning/30',
  pendencias_regularizar: 'bg-warning/15 text-warning border-warning/30',
  aguardando_validacao: 'bg-info/15 text-info border-info/30',
  apto_retirada: 'bg-success/15 text-success border-success/30',
  aguardando_retirada: 'bg-success/15 text-success border-success/30',
  finalizado: 'bg-muted text-muted-foreground border-border',
};

const pendencyStyles: Record<PendencyStatus, string> = {
  pendente: 'bg-warning/15 text-warning border-warning/30',
  enviado: 'bg-info/15 text-info border-info/30',
  em_analise: 'bg-info/15 text-info border-info/30',
  aprovado: 'bg-success/15 text-success border-success/30',
  reprovado: 'bg-destructive/15 text-destructive border-destructive/30',
};

interface StatusBadgeProps {
  status: CaseStatus | PendencyStatus;
  label: string;
  variant?: 'case' | 'pendency';
  className?: string;
}

export function StatusBadge({ status, label, variant = 'case', className }: StatusBadgeProps) {
  const styles = variant === 'case'
    ? caseStatusStyles[status as CaseStatus]
    : pendencyStyles[status as PendencyStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}
