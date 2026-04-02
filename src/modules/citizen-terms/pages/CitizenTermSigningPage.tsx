import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCitizenTerms, useSignCitizenTerm } from '../hooks/useCitizenTerms';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronDown } from 'lucide-react';

export default function CitizenTermSigningPage() {
  const { termId } = useParams<{ termId: string }>();
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useCitizenTerms();
  const signMutation = useSignCitizenTerm();

  const term = data?.terms.find((t) => t.id === termId);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setHasScrolled(true);
    }
  }, []);

  const handleSign = async () => {
    if (!termId) return;
    await signMutation.mutateAsync(termId);
    navigate('/app/cidadao/termos');
  };

  if (isLoading) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError || !term) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div className="text-center py-12 space-y-3">
          <p className="text-sm text-muted-foreground">Termo nao encontrado.</p>
          <Button variant="outline" onClick={() => navigate('/app/cidadao/termos')}>
            Ver termos
          </Button>
        </div>
      </div>
    );
  }

  if (term.signed) {
    return (
      <div className="px-4 py-5 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div className="text-center py-12 space-y-3">
          <p className="text-lg font-semibold text-green-600">Termo ja assinado</p>
          <p className="text-sm text-muted-foreground">
            Assinado em {new Date(term.signedAt!).toLocaleString('pt-BR')}
          </p>
          <Button variant="outline" onClick={() => navigate('/app/cidadao/termos')}>
            Voltar aos termos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-4 flex flex-col h-full">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
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
