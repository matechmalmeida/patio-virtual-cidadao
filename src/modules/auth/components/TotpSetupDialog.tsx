import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { CheckCircle, ShieldCheck, ShieldOff } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';
import { mfaService } from '../services/mfa.service';
import { useAuth } from '../contexts/AuthContext';
import type { EnrollResult } from '../types/auth';

export function TotpSetupDialog({ reauthToken }: { reauthToken?: string }) {
  const { state } = useAuth();
  const user = state.user;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'idle' | 'qr' | 'confirm' | 'done' | 'disable'>('idle');
  const [setupData, setSetupData] = useState<EnrollResult | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleSetup = async () => {
    if (!reauthToken) return;
    setLoading(true);
    setError('');
    try {
      const data = await mfaService.setupTOTP(reauthToken);
      setSetupData(data);
      setStep('qr');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (code.length !== 6 || !reauthToken) return;
    setLoading(true);
    setError('');
    try {
      const result = await mfaService.enableTOTP(code, reauthToken);
      setBackupCodes(result.backupCodes);
      setStep('done');
    } catch (err) {
      setError(getApiErrorMessage(err));
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!reauthToken) return;
    setLoading(true);
    setError('');
    try {
      await mfaService.disableTOTP(reauthToken);
      setStep('done');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setStep('idle');
      setSetupData(null);
      setCode('');
      setError('');
      setBackupCodes([]);
    }
  };

  const totpEnabled = user?.permissions?.includes('totp:enabled') ?? false;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          {totpEnabled ? (
            <>
              <ShieldOff className="h-4 w-4" />
              {t('auth.totp.setup.disableTitle')}
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              {t('auth.totp.setup.title')}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>
            {totpEnabled
              ? t('auth.totp.setup.disableTitle')
              : t('auth.totp.setup.title')}
          </DialogTitle>
        </DialogHeader>

        {step === 'idle' && !totpEnabled && (
          <div className="space-y-4">
            <Button onClick={handleSetup} className="w-full" disabled={loading || !reauthToken}>
              {t('auth.totp.setup.title')}
            </Button>
          </div>
        )}

        {step === 'idle' && totpEnabled && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('auth.totp.setup.disableDesc')}</p>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button
              onClick={handleDisable}
              variant="destructive"
              className="w-full"
              disabled={loading || !reauthToken}
            >
              {t('auth.totp.setup.disableSubmit')}
            </Button>
          </div>
        )}

        {step === 'qr' && setupData && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('auth.totp.setup.scanQR')}</p>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img
                src={setupData.qrCodeDataUrl}
                alt="QR Code"
                className="h-48 w-48"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('auth.totp.setup.secretLabel')}</Label>
              <Input value={setupData.secret} readOnly className="font-mono text-center" />
            </div>
            <Button onClick={() => setStep('confirm')} className="w-full">
              {t('auth.totp.setup.confirmCode')}
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t('auth.totp.setup.confirmCode')}</p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button
              onClick={handleConfirm}
              className="w-full"
              disabled={code.length !== 6 || loading}
            >
              {t('auth.totp.setup.submit')}
            </Button>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="font-semibold">{t('auth.totp.setup.successTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('auth.totp.setup.successDesc')}</p>
            {backupCodes.length > 0 && (
              <div className="space-y-2 text-left">
                <p className="text-sm font-medium">Codigos de recuperacao:</p>
                <div className="grid grid-cols-2 gap-1 font-mono text-sm bg-muted p-3 rounded-lg">
                  {backupCodes.map((bc) => (
                    <span key={bc}>{bc}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Guarde estes codigos em local seguro. Eles nao serao exibidos novamente.
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
