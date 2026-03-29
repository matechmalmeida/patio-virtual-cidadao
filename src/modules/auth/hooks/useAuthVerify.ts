import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useFingerprint } from '../contexts/FingerprintContext';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { ApiError } from '@/services/http/api-error';
import type { CodeType, VerifyRequest, ResendCodeRequest } from '../types/auth';

const RESEND_COOLDOWN_SECONDS = 90;
const ERROR_CLEAR_DELAY_MS = 4000;
const CODE_EXPIRY_WARNING_SECONDS = 120;
const MAX_ATTEMPTS = 5;
const WARNING_THRESHOLD = 3;
const INPUT_DISABLE_DELAY_MS = 1500;

function isRateLimitError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 429;
}

function getRetryAfter(error: unknown): number {
  if (!(error instanceof ApiError)) return 60;
  const details = error.details as Record<string, unknown> | undefined;
  if (details && typeof details.retryAfter === 'number') return details.retryAfter;
  if (details && typeof details.retryAfterMs === 'number') return Math.ceil(details.retryAfterMs / 1000);
  return 60;
}

function isAttemptsExceededError(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  const msg = error.message.toLowerCase();
  return msg.includes('tentativas') && (msg.includes('maximo') || msg.includes('excedid'));
}

export function useAuthVerify() {
  const { state, verify, resendCode, clearPendingVerification } = useAuth();
  const { fingerprint } = useFingerprint();
  const navigate = useNavigate();
  const { vibrateError, vibrateSuccess } = useHapticFeedback();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);
  const [trustDevice, setTrustDevice] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [attemptsExceeded, setAttemptsExceeded] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [verifyRateLimitSeconds, setVerifyRateLimitSeconds] = useState(0);
  const [resendRateLimitSeconds, setResendRateLimitSeconds] = useState(0);
  const [codeTimeLeft, setCodeTimeLeft] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<CodeType | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disableTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pending = state.pendingVerification;
  const pendingToken = pending?.pendingToken;
  const maskedEmail = pending?.maskedEmail;
  const expiresAt = pending?.expiresAt;
  const primaryMethod = pending?.verificationType ?? 'email';

  const currentMethod = selectedMethod ?? primaryMethod;
  const isBackupMethod = currentMethod === 'backup';
  const isTOTPMethod = currentMethod === 'totp';
  const isEmailMethod = currentMethod === 'email';
  const isCodeExpired = codeTimeLeft !== null && codeTimeLeft <= 0;
  const isCodeExpiring = codeTimeLeft !== null && codeTimeLeft > 0 && codeTimeLeft <= CODE_EXPIRY_WARNING_SECONDS;
  const isVerifyRateLimited = verifyRateLimitSeconds > 0;
  const remainingAttempts = MAX_ATTEMPTS - attemptCount;
  const showAttemptsWarning = attemptCount >= WARNING_THRESHOLD && !attemptsExceeded;
  const resendWaitSeconds = Math.max(resendCooldown, resendRateLimitSeconds);
  const canResend = resendWaitSeconds <= 0 && isEmailMethod;

  const verifyMutation = useMutation({
    mutationFn: (data: VerifyRequest) => verify(data),
    onSuccess: () => {
      vibrateSuccess();
      setVerifyRateLimitSeconds(0);
    },
    onError: (err: Error) => {
      if (isAttemptsExceededError(err)) {
        setAttemptsExceeded(true);
        setError('Limite de tentativas excedido. Faca login novamente.');
        return;
      }

      if (isRateLimitError(err)) {
        setVerifyRateLimitSeconds(getRetryAfter(err));
        return;
      }

      if (err instanceof ApiError && err.status === 401) {
        setShakeError(true);
        setAttemptCount((prev) => prev + 1);
        setInputDisabled(true);
        vibrateError();

        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
        if (disableTimeoutRef.current) clearTimeout(disableTimeoutRef.current);

        shakeTimeoutRef.current = setTimeout(() => {
          setCode('');
          setShakeError(false);
        }, 800);

        disableTimeoutRef.current = setTimeout(() => {
          setInputDisabled(false);
          requestAnimationFrame(() => inputRef.current?.focus());
        }, INPUT_DISABLE_DELAY_MS);
        return;
      }

      setError(err instanceof ApiError ? err.userMessage : 'Erro ao verificar codigo.');
    },
  });

  const resendMutation = useMutation({
    mutationFn: (data: ResendCodeRequest) => resendCode(data),
    onSuccess: () => {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setAttemptCount(0);
      setAttemptsExceeded(false);
      setError(null);
      setCode('');
      verifyMutation.reset();
    },
    onError: (err: Error) => {
      if (isRateLimitError(err)) {
        setResendRateLimitSeconds(getRetryAfter(err));
        return;
      }
      setError(err instanceof ApiError ? err.userMessage : 'Erro ao reenviar codigo.');
    },
  });

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  useEffect(() => {
    if (!state.isLoading && !pendingToken && !state.isAuthenticated) {
      navigate('/acesso', { replace: true });
    }
  }, [pendingToken, state.isLoading, state.isAuthenticated, navigate]);

  useEffect(() => {
    if (!selectedMethod && primaryMethod) {
      setSelectedMethod(primaryMethod);
    }
  }, [primaryMethod, selectedMethod]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (verifyRateLimitSeconds <= 0) return;
    const timer = setInterval(() => setVerifyRateLimitSeconds((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, [verifyRateLimitSeconds]);

  useEffect(() => {
    if (resendRateLimitSeconds <= 0) return;
    const timer = setInterval(() => setResendRateLimitSeconds((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendRateLimitSeconds]);

  useEffect(() => {
    if (!expiresAt || !isEmailMethod) return;
    const update = () => setCodeTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, isEmailMethod]);

  useEffect(() => {
    const hasError = error || verifyMutation.isError;
    if (!hasError || isVerifyRateLimited) return;

    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
      if (verifyMutation.isError) verifyMutation.reset();
    }, ERROR_CLEAR_DELAY_MS);

    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [error, verifyMutation.isError, isVerifyRateLimited]);

  useEffect(() => {
    return () => {
      [shakeTimeoutRef, disableTimeoutRef, errorTimeoutRef].forEach((ref) => {
        if (ref.current) clearTimeout(ref.current);
      });
    };
  }, []);

  const handleVerify = useCallback(
    (codeValue: string) => {
      if (!pendingToken || attemptsExceeded || verifyMutation.isPending || inputDisabled || isVerifyRateLimited) return;

      verifyMutation.mutate({
        pendingToken,
        code: codeValue,
        codeType: currentMethod,
        fingerprint: fingerprint || undefined,
        trustDevice: isBackupMethod ? false : trustDevice,
      });
    },
    [pendingToken, attemptsExceeded, verifyMutation, inputDisabled, isVerifyRateLimited, currentMethod, fingerprint, isBackupMethod, trustDevice],
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      if (error) setError(null);
      if (verifyMutation.isError) verifyMutation.reset();

      const expectedLength = isBackupMethod ? 8 : 6;
      if (value.length === expectedLength && pendingToken && (!isEmailMethod || !isCodeExpired)) {
        handleVerify(value);
      }
    },
    [error, verifyMutation, isBackupMethod, pendingToken, isEmailMethod, isCodeExpired, handleVerify],
  );

  const handleResend = useCallback(() => {
    if (!pendingToken || resendMutation.isPending || resendWaitSeconds > 0) return;
    resendMutation.mutate({ pendingToken });
  }, [pendingToken, resendMutation, resendWaitSeconds]);

  const handleMethodChange = useCallback(
    (method: CodeType) => {
      if (method === currentMethod || verifyMutation.isPending) return;
      setSelectedMethod(method);
      setCode('');
      setError(null);
      setAttemptCount(0);
      setAttemptsExceeded(false);
      setResendCooldown(0);
      setResendRateLimitSeconds(0);
      verifyMutation.reset();
    },
    [currentMethod, verifyMutation],
  );

  const handleBack = useCallback(() => {
    clearPendingVerification();
    navigate('/acesso', { replace: true });
  }, [clearPendingVerification, navigate]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const verifyRateLimitMessage = isVerifyRateLimited
    ? `Muitas tentativas. Aguarde ${formatTime(verifyRateLimitSeconds)}.`
    : null;

  const resendRateLimitMessage = resendRateLimitSeconds > 0
    ? `Reenvio bloqueado. Aguarde ${formatTime(resendRateLimitSeconds)}.`
    : null;

  const inlineErrorMessage =
    verifyRateLimitMessage ||
    resendRateLimitMessage ||
    error ||
    (verifyMutation.isError ? 'Codigo invalido ou expirado.' : null);

  return {
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
    verifyIsPending: verifyMutation.isPending,
    resendIsPending: resendMutation.isPending,
    resendWaitSeconds,
    canResend,
    inlineErrorMessage,
    handleCodeChange,
    handleBack,
    handleResend,
    handleMethodChange,
    formatTime,
  };
}
