import { useState, useEffect, useCallback } from 'react';
import { Lock, Mail, Smartphone, Loader2, ShieldCheck, KeyRound } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ApiError } from '@/services/http/api-error';
import { authService } from '../services/auth.service';
import type {
  InitiateReauthResponse,
  InitiateReauthEmailResponse,
} from '../types/auth';

interface ReauthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (reauthToken: string) => void;
  title?: string;
  description?: string;
}

type ReauthStep = 'loading' | 'totp' | 'email' | 'backup';

function extractErrorMessage(err: Error, fallback: string): string {
  if (err instanceof ApiError) {
    return err.userMessage || fallback;
  }
  return err.message || fallback;
}

export function ReauthDialog({
  open,
  onOpenChange,
  onSuccess,
  title = 'Confirmar identidade',
  description,
}: ReauthDialogProps) {
  const [step, setStep] = useState<ReauthStep>('loading');
  const [previousStep, setPreviousStep] = useState<ReauthStep>('totp');
  const [code, setCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const initiateMutation = useMutation({
    mutationFn: () => authService.initiateReauth(),
    onSuccess: (data: InitiateReauthResponse) => {
      if (data.method === 'totp') {
        setStep('totp');
      } else {
        const emailData = data as InitiateReauthEmailResponse;
        setPendingToken(emailData.pendingToken);
        setMaskedEmail(emailData.maskedEmail);
        setStep('email');
      }
    },
    onError: (err: Error) => {
      setError(extractErrorMessage(err, 'Erro ao iniciar verificacao. Tente novamente.'));
    },
  });

  const verifyTotpMutation = useMutation({
    mutationFn: (totpCode: string) =>
      authService.verifyReauthTotp({ totpCode }),
    onSuccess: (data) => {
      resetState();
      onOpenChange(false);
      onSuccess(data.reauthToken);
    },
    onError: (err: Error) => {
      setError(extractErrorMessage(err, 'Codigo TOTP invalido'));
      triggerShake();
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (emailCode: string) =>
      authService.verifyReauthEmail({
        pendingToken: pendingToken ?? '',
        code: emailCode,
      }),
    onSuccess: (data) => {
      resetState();
      onOpenChange(false);
      onSuccess(data.reauthToken);
    },
    onError: (err: Error) => {
      setError(extractErrorMessage(err, 'Codigo invalido ou expirado'));
      triggerShake();
    },
  });

  const resendMutation = useMutation({
    mutationFn: () =>
      authService.resendReauthCode({ pendingToken: pendingToken ?? '' }),
    onSuccess: (data) => {
      setPendingToken(data.pendingToken);
      setMaskedEmail(data.maskedEmail);
      setCode('');
      setError(null);
      setResendCooldown(60);
    },
    onError: (err: Error) => {
      setError(extractErrorMessage(err, 'Erro ao reenviar codigo. Tente novamente.'));
    },
  });

  const verifyBackupMutation = useMutation({
    mutationFn: (bCode: string) =>
      authService.verifyReauthBackupCode({ backupCode: bCode }),
    onSuccess: (data) => {
      resetState();
      onOpenChange(false);
      onSuccess(data.reauthToken);
    },
    onError: (err: Error) => {
      setError(extractErrorMessage(err, 'Codigo de recuperacao invalido'));
      setBackupCode('');
    },
  });

  const triggerShake = useCallback(() => {
    setShake(true);
    setCode('');
    setTimeout(() => setShake(false), 500);
  }, []);

  const resetState = useCallback(() => {
    setStep('loading');
    setPreviousStep('totp');
    setCode('');
    setBackupCode('');
    setError(null);
    setShake(false);
    setPendingToken(null);
    setMaskedEmail(null);
    setResendCooldown(0);
  }, []);

  useEffect(() => {
    if (open) {
      resetState();
      initiateMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleCodeComplete = useCallback(
    (value: string) => {
      setCode(value);
      if (value.length === 6) {
        setError(null);
        if (step === 'totp') {
          verifyTotpMutation.mutate(value);
        } else if (step === 'email') {
          verifyEmailMutation.mutate(value);
        }
      }
    },
    [step, verifyTotpMutation, verifyEmailMutation],
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const isPending =
    initiateMutation.isPending ||
    verifyTotpMutation.isPending ||
    verifyEmailMutation.isPending ||
    verifyBackupMutation.isPending;

  const getDescription = () => {
    if (description) return description;
    if (step === 'totp') {
      return 'Digite o codigo de 6 digitos do seu aplicativo autenticador para confirmar sua identidade.';
    }
    if (step === 'email' && maskedEmail) {
      return `Enviamos um codigo de verificacao para ${maskedEmail}. Digite-o abaixo para continuar.`;
    }
    if (step === 'backup') {
      return 'Digite um dos seus codigos de recuperacao para confirmar sua identidade.';
    }
    return 'Verificando metodo de autenticacao...';
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Preparando verificacao...</p>
            </div>
          )}

          {step === 'totp' && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Aplicativo autenticador</span>
                </div>
              </div>
              <div className={`flex justify-center ${shake ? 'animate-shake' : ''}`}>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={handleCodeComplete}
                  disabled={verifyTotpMutation.isPending}
                >
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
              {verifyTotpMutation.isPending && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando...</span>
                </div>
              )}
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPreviousStep('totp');
                    setStep('backup');
                    setCode('');
                    setError(null);
                  }}
                  disabled={verifyTotpMutation.isPending}
                >
                  Usar codigo de recuperacao
                </Button>
              </div>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span>Codigo enviado por e-mail</span>
                </div>
              </div>
              <div className={`flex justify-center ${shake ? 'animate-shake' : ''}`}>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={handleCodeComplete}
                  disabled={verifyEmailMutation.isPending}
                >
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
              {verifyEmailMutation.isPending && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando...</span>
                </div>
              )}
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  disabled={resendCooldown > 0 || resendMutation.isPending}
                  onClick={() => resendMutation.mutate()}
                >
                  {resendMutation.isPending
                    ? 'Reenviando...'
                    : resendCooldown > 0
                      ? `Reenviar codigo (${resendCooldown}s)`
                      : 'Reenviar codigo'}
                </Button>
              </div>
            </div>
          )}

          {step === 'backup' && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span>Codigo de recuperacao</span>
                </div>
              </div>
              <div className="flex justify-center">
                <Input
                  value={backupCode}
                  onChange={(e) => {
                    setBackupCode(e.target.value.toUpperCase());
                    if (error) setError(null);
                  }}
                  placeholder="XXXX-XXXX"
                  className="text-center font-mono text-lg tracking-widest max-w-[200px]"
                  maxLength={9}
                  disabled={verifyBackupMutation.isPending}
                  autoFocus
                />
              </div>
              <Button
                type="button"
                className="w-full"
                disabled={backupCode.replace(/-/g, '').length < 8 || verifyBackupMutation.isPending}
                onClick={() => verifyBackupMutation.mutate(backupCode)}
              >
                {verifyBackupMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </Button>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep(previousStep);
                    setBackupCode('');
                    setError(null);
                  }}
                  disabled={verifyBackupMutation.isPending}
                >
                  {previousStep === 'totp' ? 'Voltar para Autenticador' : 'Voltar para E-mail'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
