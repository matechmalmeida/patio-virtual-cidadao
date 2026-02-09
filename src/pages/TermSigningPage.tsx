import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertBanner } from '@/components/AlertBanner';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  ScrollText,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signTerm } from '@/services/case.service';
import { getApiErrorMessage } from '@/services/http/api-error';

export default function TermSigningPage() {
  const { t } = useTranslation();
  const { termId } = useParams<{ termId: string }>();
  const navigate = useNavigate();
  const { currentCase, updateCase } = useAuth();
  const { toast } = useToast();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const term = currentCase?.terms.find((t) => t.id === termId);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const threshold = 20;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;

    if (isAtBottom && !hasScrolledToEnd) {
      setHasScrolledToEnd(true);
    }
  }, [hasScrolledToEnd]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check if content doesn't need scrolling (shorter than container)
    if (el.scrollHeight <= el.clientHeight + 20) {
      setHasScrolledToEnd(true);
    }
  }, [term]);

  const handleSign = useCallback(() => {
    if (!currentCase || !term) return;

    setIsSigning(true);
    signTerm(currentCase, term.id)
      .then((updatedTerms) => {
        updateCase(currentCase.id, { terms: updatedTerms });

        toast({
          title: t('term.signSuccess'),
          description: t('term.signSuccessDesc', { title: term.title }),
        });

        setIsSigning(false);
        navigate('/dashboard');
      })
      .catch((err) => {
        toast({
          title: t('term.signError'),
          description: getApiErrorMessage(err, t('term.signErrorDesc')),
          variant: 'destructive',
        });
        setIsSigning(false);
      });
  }, [currentCase, term, updateCase, toast, navigate]);

  if (!currentCase || !term) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground">{t('term.notFound')}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard')}>
          {t('term.backToProcess')}
        </Button>
      </div>
    );
  }

  // Already signed
  if (term.status === 'assinado') {
    return (
      <div className="px-4 py-5 space-y-5">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </button>

        <AlertBanner variant="success" title={t('term.alreadySigned')}>
          {t('term.signedAt')}{' '}
          {new Date(term.signedAt!).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          .
        </AlertBanner>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-5">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {term.title}
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line text-xs leading-relaxed max-h-[50vh] overflow-y-auto">
              {term.content}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </button>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          {term.title}
        </h1>
        <p className="text-sm text-muted-foreground">{term.description}</p>
      </div>

      {/* Vehicle reference */}
      <div className="flex items-center gap-2 text-xs bg-muted/50 rounded-lg px-3 py-2">
        <span className="font-semibold">{currentCase.plate}</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">{currentCase.vehicle}</span>
      </div>

      {/* Document content with scroll detection */}
      <Card className="border-0 shadow-md relative">
        <CardContent className="pt-5 pb-3">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[45vh] overflow-y-auto pr-2 scroll-smooth"
          >
            <div className="whitespace-pre-line text-xs leading-relaxed text-foreground/80">
              {term.content}
            </div>
          </div>

          {/* Scroll indicator */}
          {!hasScrolledToEnd && (
            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center pointer-events-none">
              <div className="h-16 w-full bg-gradient-to-t from-card to-transparent" />
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium animate-bounce bg-card px-3 py-1.5 rounded-full shadow-sm">
                <ChevronDown className="h-3.5 w-3.5" />
                {t('term.scrollToRead')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agreement section */}
      <div className="space-y-4">
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
            hasScrolledToEnd
              ? 'bg-card cursor-pointer hover:bg-muted/50'
              : 'bg-muted/30 opacity-60 cursor-not-allowed'
          }`}
        >
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
            disabled={!hasScrolledToEnd}
            className="mt-0.5"
          />
          <span className="text-sm leading-snug">
            {t('term.agreeLabel')}
          </span>
        </label>

        {!hasScrolledToEnd && (
          <p className="text-xs text-muted-foreground text-center">
            {t('term.readFirst')}
          </p>
        )}

        <Button
          className="w-full h-12 font-semibold text-base"
          disabled={!isChecked || isSigning}
          onClick={handleSign}
        >
          {isSigning ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              {t('term.signing')}
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              {t('term.sign')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
