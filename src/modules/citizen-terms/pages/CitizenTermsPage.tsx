import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCitizenTerms } from '../hooks/useCitizenTerms';
import type { CitizenTerm } from '../types/citizen-term';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/AlertBanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  FileText,
  History,
  ScrollText,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function TermCard({ term }: { term: CitizenTerm }) {
  const navigate = useNavigate();

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
        onClick={() => navigate(`/app/cidadao/termos/${term.id}`)}
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

export default function CitizenTermsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCitizenTerms();

  const { pendingTerms, signedTerms } = useMemo(() => {
    const terms = data?.terms ?? [];
    return {
      pendingTerms: terms.filter((t) => !t.signed),
      signedTerms: terms.filter((t) => t.signed),
    };
  }, [data]);

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
    return (
      <div className="px-4 py-5 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div className="text-center py-12 space-y-3">
          <p className="text-sm text-muted-foreground">
            Nao foi possivel carregar os termos.
          </p>
          <Button variant="outline" onClick={() => navigate('/app/dashboard')}>
            Voltar ao inicio
          </Button>
        </div>
      </div>
    );
  }

  const allSigned = pendingTerms.length === 0;

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <div>
        <h1 className="text-xl font-bold">Termos de Instalacao</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {allSigned
            ? 'Todos os termos foram assinados.'
            : `${pendingTerms.length} termo(s) pendente(s) de assinatura.`}
        </p>
      </div>

      {allSigned && (
        <AlertBanner variant="success">
          Todos os termos foram assinados.
        </AlertBanner>
      )}

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1 gap-2">
            <FileText className="h-4 w-4" />
            Pendentes
            <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
              {pendingTerms.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 gap-2">
            <History className="h-4 w-4" />
            Assinados
            <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
              {signedTerms.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pendingTerms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum termo pendente.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingTerms.map((term) => (
                <TermCard key={term.id} term={term} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {signedTerms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum termo assinado.
            </p>
          ) : (
            <div className="space-y-3">
              {signedTerms.map((term) => (
                <TermCard key={term.id} term={term} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
