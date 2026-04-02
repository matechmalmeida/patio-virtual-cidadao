import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeizureTerms, useSignTerm } from '../hooks/useSeizure';
import type { SeizureTermItem } from '../types/seizure';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/AlertBanner';
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  ScrollText,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function TermCard({
  term,
  onSelect,
}: {
  term: SeizureTermItem;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 animate-slide-up">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ScrollText
            className={cn(
              'h-4 w-4 shrink-0',
              term.signed ? 'text-success' : 'text-warning',
            )}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">{term.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Versao {term.version}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shrink-0',
            term.signed
              ? 'bg-success/15 text-success border-success/30'
              : 'bg-warning/15 text-warning border-warning/30',
          )}
        >
          {term.signed ? 'Assinado' : 'Pendente'}
        </span>
      </div>

      {term.signed && term.signedAt && (
        <p className="text-xs text-muted-foreground">
          Assinado em{' '}
          {new Date(term.signedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}

      <Button
        size="sm"
        variant={term.signed ? 'outline' : 'default'}
        className="w-full text-xs"
        onClick={() => onSelect(term.id)}
      >
        {term.signed ? (
          <>
            <FileText className="h-3.5 w-3.5" />
            Visualizar
          </>
        ) : (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Assinar
          </>
        )}
      </Button>
    </div>
  );
}

function TermSigningView({
  seizureId,
  term,
  onBack,
}: {
  seizureId: string;
  term: SeizureTermItem;
  onBack: () => void;
}) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const signMutation = useSignTerm();

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
      termTemplateId: term.id,
      accepted: true,
    });
    onBack();
  };

  if (term.signed) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div className="text-center py-12 space-y-3">
          <p className="text-lg font-semibold text-green-600">Termo ja assinado</p>
          <p className="text-sm text-muted-foreground">
            Assinado em {new Date(term.signedAt!).toLocaleString('pt-BR')}
          </p>
        </div>
        <div
          className="overflow-y-auto border rounded-lg p-4 bg-muted/30 max-h-[50vh] text-sm leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: term.content }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col h-full">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <h1 className="text-xl font-bold">{term.title}</h1>
      <p className="text-xs text-muted-foreground">Versao {term.version}</p>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto border rounded-lg p-4 bg-muted/30 max-h-[50vh] text-sm leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: term.content }}
      />

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
  );
}

export default function SeizureTermPage() {
  const { seizureId } = useParams<{ seizureId: string }>();
  const navigate = useNavigate();
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useSeizureTerms(seizureId!);

  if (isLoading) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    const message = (error as any)?.response?.data?.message || 'Nao foi possivel carregar os termos.';
    return (
      <div className="px-4 py-5 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div className="text-center py-12 space-y-3">
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button variant="outline" onClick={() => navigate('/app/apreensoes')}>
            Ver minhas apreensoes
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const selectedTerm = selectedTermId
    ? data.terms.find((t) => t.id === selectedTermId)
    : null;

  if (selectedTerm) {
    return (
      <div className="px-4 py-5">
        <TermSigningView
          seizureId={seizureId!}
          term={selectedTerm}
          onBack={() => setSelectedTermId(null)}
        />
      </div>
    );
  }

  if (data.allSigned) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <AlertBanner variant="success">
          Todos os termos foram assinados.
        </AlertBanner>
        <div className="space-y-3">
          {data.terms.map((term) => (
            <TermCard key={term.id} term={term} onSelect={setSelectedTermId} />
          ))}
        </div>
        <Button
          className="w-full"
          onClick={() => navigate(`/app/apreensao/${seizureId}/status`)}
        >
          Acompanhar status
        </Button>
      </div>
    );
  }

  const pendingTerms = data.terms.filter((t) => !t.signed);
  const signedTerms = data.terms.filter((t) => t.signed);

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <div>
        <h1 className="text-xl font-bold">Termos de Adesao</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingTerms.length} de {data.terms.length} termo(s) pendente(s)
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {signedTerms.length}/{data.terms.length}
        </Badge>
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(signedTerms.length / data.terms.length) * 100}%` }}
          />
        </div>
      </div>

      {pendingTerms.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Pendentes
          </p>
          {pendingTerms.map((term) => (
            <TermCard key={term.id} term={term} onSelect={setSelectedTermId} />
          ))}
        </div>
      )}

      {signedTerms.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Assinados
          </p>
          {signedTerms.map((term) => (
            <TermCard key={term.id} term={term} onSelect={setSelectedTermId} />
          ))}
        </div>
      )}
    </div>
  );
}
