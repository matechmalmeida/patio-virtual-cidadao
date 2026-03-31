import { useState, useRef, useEffect } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRequestMagicLink } from '../hooks/useMagicLink';
import { ApiError } from '@/services/http/api-error';

interface MagicLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MagicLinkDialog({ open, onOpenChange }: MagicLinkDialogProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const requestMagicLink = useRequestMagicLink();
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    if (!email || email.length > 254) return false;
    const atIndex = email.indexOf('@');
    if (atIndex < 1) return false;
    if (email.lastIndexOf('@') !== atIndex) return false;
    const local = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1);
    if (!local || !domain || !domain.includes('.')) return false;
    if (email.includes(' ') || email.includes('\t') || email.includes('\n')) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Por favor, informe seu e-mail.');
      return;
    }

    if (!validateEmail(email)) {
      setError('O e-mail informado não é válido.');
      return;
    }

    if (!canResend) {
      setError(`Aguarde ${countdown} segundos para reenviar.`);
      return;
    }

    requestMagicLink.mutate(
      { email },
      {
        onSuccess: () => {
          setSuccess(true);
          setError(null);
          startCountdown();
        },
        onError: (err: Error) => {
          if (err instanceof ApiError && err.status === 429) {
            setError('Muitas tentativas. Tente novamente em 5 minutos.');
          } else {
            setError(err.message || 'Erro ao enviar link. Tente novamente.');
          }
          setSuccess(false);
        },
      },
    );
  };

  const startCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCanResend(false);
    setCountdown(60);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setEmail('');
      setError(null);
      setSuccess(false);
      setCanResend(true);
      setCountdown(0);
    }
    onOpenChange(isOpen);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Verifique seu e-mail
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                Se o e-mail estiver cadastrado, você receberá um link de acesso em alguns minutos.
                <br />
                Verifique sua caixa de entrada e clique no link para fazer login.
                <br />
                <br />
                <strong>O link expira em 10 minutos.</strong>
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Fechar
              </Button>
              <Button onClick={handleSubmit} disabled={!canResend || requestMagicLink.isPending}>
                {!canResend
                  ? `Reenviar (${countdown}s)`
                  : requestMagicLink.isPending
                    ? 'Enviando...'
                    : 'Reenviar'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Login sem senha
          </DialogTitle>
          <DialogDescription>
            Receba um link de acesso seguro no seu e-mail.
            A autenticação de dois fatores (TOTP) deve estar habilitada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="magic-link-email">E-mail</Label>
            <Input
              id="magic-link-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              autoFocus
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={requestMagicLink.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={requestMagicLink.isPending || !canResend}>
              {requestMagicLink.isPending ? 'Enviando...' : 'Enviar link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
