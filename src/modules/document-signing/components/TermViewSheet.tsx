import { useState, useRef, useCallback, useEffect } from 'react';
import { useSeizureTerms, useSignTerm } from '@/modules/seizure/hooks/useSeizure';
import { useQueryClient } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

interface TermViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seizureId: string;
  termTemplateId: string;
  vehiclePlate: string;
}

export function TermViewSheet({
  open,
  onOpenChange,
  seizureId,
  termTemplateId,
  vehiclePlate,
}: TermViewSheetProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useSeizureTerms(seizureId);
  const signMutation = useSignTerm();

  const term = data?.terms.find((t) => t.id === termTemplateId);

  useEffect(() => {
    if (!open) {
      setHasScrolled(false);
      setAccepted(false);
    }
  }, [open]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setHasScrolled(true);
    }
  }, []);

  const handleSign = async () => {
    await signMutation.mutateAsync({
      seizureId,
      termTemplateId,
      accepted: true,
    });
    queryClient.invalidateQueries({ queryKey: ['citizen-terms'] });
    queryClient.invalidateQueries({ queryKey: ['seizure', 'terms', seizureId] });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-2xl p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b shrink-0">
          {isLoading || !term ? (
            <>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <SheetTitle className="text-left">{term.title}</SheetTitle>
              <SheetDescription className="text-left flex items-center gap-2">
                <span>{vehiclePlate}</span>
                <span>-</span>
                <span>Versao {term.version}</span>
                {term.signed && (
                  <Badge variant="outline" className="bg-success/15 text-success border-success/30 text-xs">
                    Assinado
                  </Badge>
                )}
              </SheetDescription>
            </>
          )}
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 p-5 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : !term ? (
          <div className="flex-1 flex items-center justify-center p-5">
            <p className="text-sm text-muted-foreground">Termo nao encontrado.</p>
          </div>
        ) : (
          <>
            {term.signed && term.signedAt && (
              <div className="px-5 py-3 bg-success/10 border-b">
                <p className="text-xs text-success font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Assinado em{' '}
                  {new Date(term.signedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: term.content }}
            />

            {!term.signed && (
              <div className="shrink-0 border-t px-5 py-4 space-y-3 bg-background">
                {!hasScrolled && (
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground animate-bounce">
                    <ChevronDown className="h-4 w-4" />
                    <span>Role ate o final para continuar</span>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={accepted}
                    onCheckedChange={(checked) => setAccepted(!!checked)}
                    disabled={!hasScrolled}
                  />
                  <span className={`text-sm ${!hasScrolled ? 'text-muted-foreground' : ''}`}>
                    Li e concordo com os termos e condicoes acima
                  </span>
                </label>

                <Button
                  onClick={handleSign}
                  disabled={!accepted || !hasScrolled || signMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {signMutation.isPending ? 'Assinando...' : 'Assinar Termo'}
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
