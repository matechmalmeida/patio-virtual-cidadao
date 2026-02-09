import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';
import { verifyMagicLink } from '../services/auth.service';
import { useAuthDispatch } from '../contexts/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

export default function MagicLinkVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(true);
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      setError(t('auth.magicLink.errorDesc'));
      setVerifying(false);
      return;
    }

    let cancelled = false;

    verifyMagicLink(token)
      .then((session) => {
        if (cancelled) return;
        dispatch({ type: 'LOGIN_SUCCESS', payload: session });
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getApiErrorMessage(err, t('auth.magicLink.errorDesc')));
        setVerifying(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, dispatch, navigate, t]);

  if (verifying) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">{t('auth.magicLink.verifying')}</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-lg font-semibold">{t('auth.magicLink.errorTitle')}</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button asChild className="w-full">
          <Link to="/acesso/link-magico">{t('auth.magicLink.requestNew')}</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
