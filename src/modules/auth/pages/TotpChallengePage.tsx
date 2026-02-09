import { useState } from 'react';
import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { getApiErrorMessage } from '@/services/http/api-error';
import { verifyTotp } from '../services/auth.service';
import { useAuthDispatch } from '../contexts/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

export default function TotpChallengePage() {
  const location = useLocation();
  const tempToken = (location.state as { tempToken?: string } | null)?.tempToken;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!tempToken) {
    return <Navigate to="/acesso" replace />;
  }

  const handleVerify = async () => {
    setError('');
    if (code.length !== 6) {
      setError(t('auth.totp.errors.invalid'));
      return;
    }

    setLoading(true);
    try {
      const session = await verifyTotp(tempToken, code);
      dispatch({ type: 'LOGIN_SUCCESS', payload: session });
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, t('auth.totp.errors.generic')));
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('auth.totp.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('auth.totp.subtitle')}</p>
      </div>

      <div className="flex justify-center">
        <InputOTP maxLength={6} value={code} onChange={setCode} inputMode="numeric">
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

      {error && <p role="alert" className="text-sm text-destructive font-medium text-center">{error}</p>}

      <Button
        onClick={handleVerify}
        className="w-full h-12 text-base font-semibold"
        disabled={code.length !== 6 || loading}
        aria-busy={loading}
      >
        {t('auth.totp.submit')}
      </Button>

      <div className="text-center">
        <Link to="/acesso" className="text-sm text-primary hover:underline">
          {t('auth.totp.backToLogin')}
        </Link>
      </div>
    </AuthLayout>
  );
}
