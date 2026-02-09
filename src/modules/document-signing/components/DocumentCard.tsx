import { cn } from '@/lib/utils';
import type { Term } from '@/types/case';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DocumentCardProps {
  term: Term;
  className?: string;
}

export function DocumentCard({ term, className }: DocumentCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isSigned = term.status === 'assinado';

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 space-y-3 animate-slide-up',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ScrollText className={cn('h-4 w-4 shrink-0', isSigned ? 'text-success' : 'text-warning')} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">{term.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {term.description}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shrink-0',
            isSigned
              ? 'bg-success/15 text-success border-success/30'
              : 'bg-warning/15 text-warning border-warning/30'
          )}
        >
          {t(`document.statusLabels.${term.status}`)}
        </span>
      </div>

      {isSigned && term.signedAt && (
        <p className="text-xs text-muted-foreground">
          {t('document.signedAt')}{' '}
          {new Date(term.signedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}

      {!isSigned && (
        <Button
          size="sm"
          className="w-full text-xs"
          onClick={() => navigate(`/documentos/${term.id}`)}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {t('document.sign')}
        </Button>
      )}
    </div>
  );
}
