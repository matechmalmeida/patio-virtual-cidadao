import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertBanner } from '@/components/AlertBanner';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
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
import { confirmPendencyPayment } from '../services/pendency.service';
import { getApiErrorMessage } from '@/services/http/api-error';

type PaymentMethod = 'pix' | 'boleto' | null;

export default function PaymentPage() {
  const { id, pendencyId } = useParams<{ id: string; pendencyId: string }>();
  const navigate = useNavigate();
  const { activeCases, updateCase } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);

  const caseData = activeCases.find((c) => c.id === id) ?? null;
  const pendency = caseData?.pendencies.find((p) => p.id === pendencyId);

  const pixCode =
    '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540' +
    (pendency?.value?.toFixed(2) ?? '0.00') +
    '5802BR5925PATIO VIRTUAL AUTARQUIA6009FORTALEZA62070503***6304ABCD';

  const handleCopyPix = useCallback(() => {
    navigator.clipboard.writeText(pixCode).then(() => {
      setPixCopied(true);
      toast({ title: t('payment.pixCopied') });
      setTimeout(() => setPixCopied(false), 3000);
    });
  }, [pixCode, toast, t]);

  const handleConfirmPayment = useCallback(() => {
    if (!caseData || !pendency) return;

    setIsProcessing(true);

    confirmPendencyPayment(caseData, pendency.id)
      .then((updatedPendencies) => {
        updateCase(caseData.id, { pendencies: updatedPendencies });

        setIsProcessing(false);
        setPaymentConfirmed(true);

        toast({
          title: t('payment.registered'),
          description: t('payment.validationNote'),
        });
      })
      .catch((err) => {
        setIsProcessing(false);
        toast({
          title: t('payment.paymentError'),
          description: getApiErrorMessage(err, t('payment.tryAgainLater')),
          variant: 'destructive',
        });
      });
  }, [caseData, pendency, updateCase, toast, t]);

  if (!caseData || !pendency) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-muted-foreground">{t('upload.notFound')}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(`/app/process/${id}/pendencias`)}>
          {t('payment.backToPendencies')}
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
            <h1 className="text-xl font-bold">{t('payment.registered')}</h1>
            <p
              className="text-sm text-muted-foreground mt-2"
              dangerouslySetInnerHTML={{ __html: t('payment.registeredText', { value: pendency.value?.toFixed(2).replace('.', ','), name: pendency.name }) }}
            />
          </div>
          <AlertBanner variant="info">
            {t('payment.proofNote')}
          </AlertBanner>
          <Button className="w-full" onClick={() => navigate(`/app/process/${id}/pendencias`)}>
            {t('payment.backToPendencies')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          {t('payment.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{pendency.name}</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-5 text-center space-y-1">
          <p className="text-xs text-muted-foreground">{t('payment.amountToPay')}</p>
          <p className="text-3xl font-bold">
            R$ {pendency.value?.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-muted-foreground">
            {caseData.plate} — {caseData.vehicle}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-semibold">{t('payment.paymentMethod')}</p>

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
            <p className="text-sm font-semibold">{t('payment.pix')}</p>
            <p className="text-xs text-muted-foreground">{t('payment.pixDesc')}</p>
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
            <p className="text-sm font-semibold">{t('payment.boleto')}</p>
            <p className="text-xs text-muted-foreground">{t('payment.boletoDesc')}</p>
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

      {selectedMethod === 'pix' && (
        <Card className="border-0 shadow-md animate-slide-up">
          <CardContent className="pt-5 space-y-4">
            <div className="text-center">
              <div className="mx-auto w-40 h-40 rounded-xl bg-foreground/5 border flex items-center justify-center mb-3">
                <QrCode className="h-24 w-24 text-foreground/20" />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('payment.scanQR')}
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
              <p>{t('payment.pixValid')}</p>
            </div>

            <Button
              className="w-full h-11 font-semibold"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t('payment.processing')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t('payment.alreadyPaid')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedMethod === 'boleto' && (
        <Card className="border-0 shadow-md animate-slide-up">
          <CardContent className="pt-5 space-y-4">
            <AlertBanner variant="info">
              {t('payment.boletoNote')}
            </AlertBanner>

            <Button className="w-full h-11 font-semibold">
              <ExternalLink className="h-4 w-4" />
              {t('payment.generateBoleto')}
            </Button>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <p>
                {t('payment.boletoNote')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
