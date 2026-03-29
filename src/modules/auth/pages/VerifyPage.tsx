import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Mail, Smartphone, Key, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { useAuthVerify } from '../hooks/useAuthVerify';
import { AuthLayout } from '../components/AuthLayout';
import type { CodeType } from '../types/auth';

function getMethodIcon(method: CodeType) {
  switch (method) {
    case 'email': return Mail;
    case 'totp': return Smartphone;
    case 'backup': return Key;
  }
}

export default function VerifyPage() {
  const { t } = useTranslation();
  const {
    code,
    shakeError,
    codeTimeLeft,
    trustDevice,
    setTrustDevice,
    attemptsExceeded,
    inputDisabled,
    inputRef,
    pendingToken,
    maskedEmail,
    primaryMethod,
    isCodeExpired,
    isCodeExpiring,
    isVerifyRateLimited,
    remainingAttempts,
    showAttemptsWarning,
    currentMethod,
    isBackupMethod,
    isTOTPMethod,
    isEmailMethod,
    verifyIsPending,
    resendIsPending,
    resendWaitSeconds,
    canResend,
    inlineErrorMessage,
    handleCodeChange,
    handleBack,
    handleResend,
    handleMethodChange,
    formatTime,
  } = useAuthVerify();

  if (!pendingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const MethodIcon = getMethodIcon(currentMethod);
  const expectedLength = isBackupMethod ? 8 : 6;

  return (
    <AuthLayout>
      <div className="text-center space-y-2">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <MethodIcon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">{t('auth.verify.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {isTOTPMethod && t('auth.verify.subtitleTotp')}
          {isEmailMethod && t('auth.verify.subtitleEmail', { email: maskedEmail ?? '' })}
          {isBackupMethod && t('auth.verify.subtitleBackup', 'Use um codigo de recuperacao')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className={shakeError ? 'animate-shake' : ''}>
            <Input
              ref={inputRef}
              type="text"
              inputMode={isBackupMethod ? 'text' : 'numeric'}
              autoComplete="one-time-code"
              autoFocus
              maxLength={isBackupMethod ? 10 : 9}
              placeholder={isBackupMethod ? 'XXXXXXXX' : t('auth.verify.codePlaceholder')}
              className={`h-14 text-center text-2xl tracking-[0.3em] font-mono ${isBackupMethod ? 'uppercase' : ''}`}
              value={code}
              onChange={(e) => {
                const val = isBackupMethod
                  ? e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                  : e.target.value.replace(/\D/g, '');
                handleCodeChange(val);
              }}
              disabled={inputDisabled || attemptsExceeded || isVerifyRateLimited || isCodeExpired}
            />
          </div>
          {code.length > 0 && code.length < expectedLength && !verifyIsPending && (
            <p className="text-xs text-muted-foreground text-center">
              {expectedLength - code.length} {expectedLength - code.length === 1 ? 'digito restante' : 'digitos restantes'}
            </p>
          )}
        </div>

        {verifyIsPending && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t('auth.verify.verifying', 'Verificando codigo...')}</span>
          </div>
        )}

        {inlineErrorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{inlineErrorMessage}</p>
          </div>
        )}

        {showAttemptsWarning && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              {remainingAttempts === 1
                ? t('auth.verify.lastAttempt', 'Ultima tentativa antes do bloqueio.')
                : t('auth.verify.attemptsRemaining', { count: remainingAttempts, defaultValue: `Restam ${remainingAttempts} tentativas.` })}
            </p>
          </div>
        )}

        {attemptsExceeded && !inlineErrorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">
              {t('auth.verify.attemptsExceeded', 'Limite de tentativas excedido. Volte ao login e tente novamente.')}
            </p>
          </div>
        )}

        {isEmailMethod && codeTimeLeft !== null && (
          <div className="text-center">
            {isCodeExpired ? (
              <p className="text-sm text-destructive font-medium">
                {t('auth.verify.codeExpired', 'Codigo expirado. Solicite um novo.')}
              </p>
            ) : isCodeExpiring ? (
              <div className="flex items-center justify-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{t('auth.verify.codeExpiring', { time: formatTime(codeTimeLeft), defaultValue: `Expira em ${formatTime(codeTimeLeft)}` })}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{t('auth.verify.codeValid', { time: formatTime(codeTimeLeft), defaultValue: `Valido por ${formatTime(codeTimeLeft)}` })}</span>
              </div>
            )}
          </div>
        )}

        {!isBackupMethod && (
          <div className="flex items-center justify-center gap-2">
            <Checkbox
              id="trustDevice"
              checked={trustDevice}
              onCheckedChange={(checked) => setTrustDevice(checked === true)}
              disabled={verifyIsPending || isCodeExpired || attemptsExceeded || isVerifyRateLimited}
            />
            <Label htmlFor="trustDevice" className="text-sm text-muted-foreground cursor-pointer">
              {t('auth.verify.trustDevice', 'Confiar neste dispositivo')}
            </Label>
          </div>
        )}

        {(primaryMethod as string) !== 'backup' && (
          <div className="flex justify-center text-sm">
            {!isBackupMethod && (
              <button
                type="button"
                onClick={() => handleMethodChange('backup')}
                disabled={verifyIsPending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {t('auth.verify.useBackupCode', 'Usar codigo de recuperacao')}
              </button>
            )}
            {isBackupMethod && (
              <button
                type="button"
                onClick={() => handleMethodChange(primaryMethod)}
                disabled={verifyIsPending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {primaryMethod === 'totp'
                  ? t('auth.verify.backToTotp', 'Voltar para autenticador')
                  : t('auth.verify.backToEmail', 'Voltar para email')}
              </button>
            )}
          </div>
        )}

        {isEmailMethod && (
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIsPending}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                {resendIsPending
                  ? t('auth.verify.resending')
                  : t('auth.verify.resendCode')}
              </button>
            ) : resendWaitSeconds > 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('auth.verify.resendIn', { time: formatTime(resendWaitSeconds), defaultValue: `Reenviar em ${formatTime(resendWaitSeconds)}` })}
              </p>
            ) : null}
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-muted-foreground hover:underline"
          >
            {t('auth.verify.backToLogin')}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
