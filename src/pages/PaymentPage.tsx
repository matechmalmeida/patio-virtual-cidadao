import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertBanner } from '@/components/AlertBanner';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  CreditCard,
  QrCode,
  Copy,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { confirmPendencyPayment } from '@/services/case.service';
import { getApiErrorMessage } from '@/services/http/api-error';

type PaymentMethod = 'pix' | 'boleto' | null;

export default function PaymentPage() {
  const { pendencyId } = useParams<{ pendencyId: string }>();
  const navigate = useNavigate();
  const { currentCase, updateCase } = useAuth();
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  const pendency = currentCase?.pendencies.find((p) => p.id === pendencyId);

  // Mock PIX code
  const pixCode =
    '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540' +
    (pendency?.value?.toFixed(2) ?? '0.00') +
    '5802BR5925PATIO VIRTUAL AUTARQUIA6009FORTALEZA62070503***6304ABCD';

  const handleCopyPix = useCallback(() => {
    navigator.clipboard.writeText(pixCode).then(() => {
      setPixCopied(true);
      toast({ title: 'Código PIX copiado!' });
      setTimeout(() => setPixCopied(false), 3000);
    });
  }, [pixCode, toast]);

  const handleConfirmPayment = useCallback(() => {
    if (!currentCase || !pendency) return;

    setIsProcessing(true);

    confirmPendencyPayment(currentCase, pendency.id)
      .then((updatedPendencies) => {
        updateCase(currentCase.id, { pendencies: updatedPendencies });

        setIsProcessing(false);
        setPaymentConfirmed(true);

        toast({
          title: 'Pagamento registrado!',
          description: 'O comprovante será validado em até 24h.',
        });
      })
      .catch((err) => {
        setIsProcessing(false);
        toast({
          title: 'Erro ao registrar pagamento',
          description: getApiErrorMessage(err, 'Tente novamente em alguns instantes.'),
          variant: 'destructive',
        });
      });
  }, [currentCase, pendency, updateCase, toast]);

  if (!currentCase || !pendency) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground">Pendência não encontrada.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/pendencias')}>
          Voltar às pendências
        </Button>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="px-4 py-5 space-y-5">
        <div className="text-center py-8 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Pagamento registrado!</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Seu pagamento de{' '}
              <strong>R$ {pendency.value?.toFixed(2).replace('.', ',')}</strong> para{' '}
              <strong>{pendency.name}</strong> foi registrado com sucesso.
            </p>
          </div>
          <AlertBanner variant="info">
            O comprovante será analisado automaticamente. Você receberá uma notificação quando for
            aprovado.
          </AlertBanner>
          <Button className="w-full" onClick={() => navigate('/pendencias')}>
            Voltar às pendências
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Pagamento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{pendency.name}</p>
      </div>

      {/* Amount */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-5 text-center space-y-1">
          <p className="text-xs text-muted-foreground">Valor a pagar</p>
          <p className="text-3xl font-bold">
            R$ {pendency.value?.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentCase.plate} — {currentCase.vehicle}
          </p>
        </CardContent>
      </Card>

      {/* Payment methods */}
      <div className="space-y-3">
        <p className="text-sm font-semibold">Forma de pagamento</p>

        <button
          onClick={() => setSelectedMethod('pix')}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
            selectedMethod === 'pix'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'bg-card hover:bg-muted/50'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
            <QrCode className="h-5 w-5 text-success" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold">PIX</p>
            <p className="text-xs text-muted-foreground">Pagamento instantâneo, 24h</p>
          </div>
          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'pix' ? 'border-primary bg-primary' : 'border-muted-foreground/30'
            }`}
          >
            {selectedMethod === 'pix' && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
          </div>
        </button>

        <button
          onClick={() => setSelectedMethod('boleto')}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
            selectedMethod === 'boleto'
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'bg-card hover:bg-muted/50'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold">Boleto Bancário</p>
            <p className="text-xs text-muted-foreground">Compensação em até 3 dias úteis</p>
          </div>
          <div
            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
              selectedMethod === 'boleto'
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/30'
            }`}
          >
            {selectedMethod === 'boleto' && (
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            )}
          </div>
        </button>
      </div>

      {/* PIX details */}
      {selectedMethod === 'pix' && (
        <Card className="border-0 shadow-md animate-slide-up">
          <CardContent className="pt-5 space-y-4">
            <div className="text-center">
              <div className="mx-auto w-40 h-40 rounded-xl bg-foreground/5 border flex items-center justify-center mb-3">
                <QrCode className="h-24 w-24 text-foreground/20" />
              </div>
              <p className="text-xs text-muted-foreground">
                Escaneie o QR Code ou copie o código abaixo
              </p>
            </div>

            <div className="relative">
              <div className="bg-muted rounded-lg p-3 pr-12 break-all text-xs font-mono text-muted-foreground leading-relaxed">
                {pixCode.slice(0, 60)}...
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={handleCopyPix}
              >
                {pixCopied ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>Este código PIX é válido por 24 horas. Após o pagamento, clique em confirmar abaixo.</p>
            </div>

            <Button
              className="w-full h-11 font-semibold"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Já paguei — confirmar
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Boleto details */}
      {selectedMethod === 'boleto' && (
        <Card className="border-0 shadow-md animate-slide-up">
          <CardContent className="pt-5 space-y-4">
            <AlertBanner variant="info">
              O boleto será gerado e ficará disponível para download. A compensação pode levar até 3
              dias úteis.
            </AlertBanner>

            <Button className="w-full h-11 font-semibold">
              <ExternalLink className="h-4 w-4" />
              Gerar boleto
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>
                Após o pagamento do boleto, envie o comprovante na tela de pendências para agilizar
                a aprovação.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
