import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';
import { useAuth } from '../contexts/AuthContext';
import { useFingerprint } from '../contexts/FingerprintContext';
import { MagicLinkDialog } from '../components/MagicLinkDialog';
import { AuthLayout } from '../components/AuthLayout';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Por favor, informe seu e-mail.')
    .email('O e-mail informado não é válido.'),
  password: z.string().min(1, 'Por favor, informe sua senha.'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMagicLinkDialog, setShowMagicLinkDialog] = useState(false);
  const { login } = useAuth();
  const { fingerprint } = useFingerprint();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const locationState = location.state as { openMagicLink?: boolean } | null;
    if (locationState?.openMagicLink) {
      setShowMagicLinkDialog(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);

    try {
      const result = await login({
        username: data.email,
        password: data.password,
        fingerprint: fingerprint || undefined,
      });

      if (result.requiresVerification) {
        navigate('/acesso/verificar', { replace: true });
      } else {
        navigate('/app/dashboard', { replace: true });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, t('auth.login.errors.generic')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('auth.login.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('auth.login.subtitle')}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      autoComplete="email"
                      className="h-12 text-base pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="******"
                      autoComplete="current-password"
                      className="h-12 text-base pl-10 pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Link to="/acesso/esqueci-senha" className="text-sm text-primary hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>

          {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading} aria-busy={loading}>
            Entrar
          </Button>
        </form>
      </Form>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-border" />
        <span className="text-xs text-muted-foreground">OU</span>
        <hr className="flex-1 border-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 text-base font-semibold bg-[hsl(220,30%,12%)] text-white border-transparent hover:bg-[hsl(220,30%,18%)] hover:text-white"
        onClick={() => setShowMagicLinkDialog(true)}
        disabled={loading}
      >
        <Mail className="h-4 w-4 mr-2" />
        Receber link por email
      </Button>

      <MagicLinkDialog open={showMagicLinkDialog} onOpenChange={setShowMagicLinkDialog} />
    </AuthLayout>
  );
}
