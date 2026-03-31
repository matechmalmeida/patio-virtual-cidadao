import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useVerifyMagicLink, useConfirmMagicLink } from '../hooks/useMagicLink';
import { ApiError } from '@/services/http/api-error';
import { AuthLayout } from '../components/AuthLayout';

type PageState =
  | 'loading'
  | 'verifying'
  | 'valid'
  | 'invalid'
  | 'expired'
  | 'no-totp';

export default function MagicLinkVerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  if (token) {
    window.history.replaceState({}, '', '/acesso/link-magico/verificar');
  }
  const navigate = useNavigate();

  const [pageState, setPageState] = useState<PageState>('loading');
  const hasVerified = useRef(false);
  const hasConfirmed = useRef(false);

  const { mutate: verifyMutate } = useVerifyMagicLink();
  const { mutate: confirmMutate } = useConfirmMagicLink();

  useEffect(() => {
    if (!token) {
      setPageState('invalid');
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;
    setPageState('verifying');

    verifyMutate(
      { token },
      {
        onSuccess: (response) => {
          setPageState(response.valid ? 'valid' : 'invalid');
        },
        onError: () => {
          setPageState('invalid');
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (pageState !== 'valid' || !token || hasConfirmed.current) return;

    hasConfirmed.current = true;
    setPageState('loading');

    confirmMutate(
      { token },
      {
        onSuccess: (response) => {
          navigate('/acesso/verificar', {
            state: {
              pendingToken: response.pendingToken,
              expiresAt: Date.now() + response.expiresIn * 1000,
              mfaMethod: 'totp',
            },
            replace: true,
          });
        },
        onError: (error: Error) => {
          hasConfirmed.current = false;

          if (error instanceof ApiError && error.status) {
            if (error.status === 401) {
              setPageState('expired');
            } else if (error.status === 403) {
              setPageState('no-totp');
            } else {
              setPageState('invalid');
            }
          } else {
            setPageState('invalid');
          }
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageState, token]);

  if (pageState === 'loading' || pageState === 'verifying') {
    return (
      <AuthLayout>
        <div className="text-center space-y-4 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Verificando link...</p>
        </div>
      </AuthLayout>
    );
  }

  if (pageState === 'no-totp') {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-semibold">TOTP Necessário</h2>
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 text-left">
            <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
              O login por link mágico requer autenticação de dois fatores (TOTP) habilitada.
              Habilite o TOTP nas configurações de segurança da sua conta ou faça login com senha.
            </AlertDescription>
          </Alert>
          <Link to="/acesso" className="block">
            <Button className="w-full h-12 text-base font-semibold">
              Fazer login com senha
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-lg font-semibold">Link Inválido</h2>
        <Alert variant="destructive" className="text-left">
          <AlertTitle>Este link de acesso:</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Já foi usado</li>
              <li>Expirou (válido por 10 minutos)</li>
              <li>É inválido</li>
            </ul>
          </AlertDescription>
        </Alert>
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => navigate('/acesso', { state: { openMagicLink: true } })}
        >
          Solicitar novo link
        </Button>
        <Link to="/acesso" className="block">
          <Button variant="outline" className="w-full h-12 text-base">
            Fazer login normal
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
