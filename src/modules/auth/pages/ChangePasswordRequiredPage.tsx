import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChangePassword, getChangePasswordErrorMessage } from '../hooks/usePasswordSecurity';
import { ApiError } from '@/services/http/api-error';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordStrengthBar } from '../components/PasswordStrengthBar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const changePasswordRequiredSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual.'),
    newPassword: z
      .string()
      .min(10, 'A senha deve ter no mínimo 10 caracteres.')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
      .regex(/[^a-zA-Z0-9\s]/, 'A senha deve conter pelo menos um caractere especial.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof changePasswordRequiredSchema>;

export default function ChangePasswordRequiredPage() {
  const navigate = useNavigate();
  const { state, refreshUserData, logout } = useAuth();
  const changePasswordMutation = useChangePassword();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(changePasswordRequiredSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const passwordValue = form.watch('newPassword');

  useEffect(() => {
    if (state.user && !state.user.requirePasswordChange) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [state.user, navigate]);

  useEffect(() => {
    if (rateLimitSeconds <= 0) return;
    const timer = setInterval(() => {
      setRateLimitSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitSeconds]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (errorMessage) setErrorMessage(null);
      if (rateLimitSeconds > 0) setRateLimitSeconds(0);
    });
    return () => subscription.unsubscribe();
  }, [form, errorMessage, rateLimitSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (rateLimitSeconds > 0) return;

    changePasswordMutation.mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        keepCurrentSession: true,
      },
      {
        onSuccess: async () => {
          const refreshed = await refreshUserData();

          if (refreshed) {
            toast.success('Senha alterada com sucesso');
            navigate('/app/dashboard', { replace: true });
          } else {
            await logout();
            toast.success('Senha alterada. Faça login novamente.');
            navigate('/acesso', { replace: true });
          }
        },
        onError: (error: Error) => {
          if (error instanceof ApiError && error.status === 429) {
            const details = error.details as Record<string, unknown> | undefined;
            const retryAfter =
              (details && typeof details.retryAfter === 'number' && details.retryAfter) ||
              (details && typeof details.retryAfterMs === 'number' && Math.ceil(details.retryAfterMs / 1000)) ||
              60;
            setRateLimitSeconds(retryAfter);
            setErrorMessage('Muitas tentativas. Aguarde para tentar novamente.');
            return;
          }

          if (error instanceof ApiError && error.status === 401) {
            setErrorMessage('Senha atual incorreta.');
            return;
          }

          if (error instanceof ApiError) {
            const data = error.details as Record<string, unknown> | null;
            if (data && Array.isArray(data.errors)) {
              const compromised = (data.errors as { validator?: string }[]).find(
                (e) => e.validator === 'PasswordCompromiseValidator',
              );
              if (compromised) {
                setErrorMessage('Esta senha foi encontrada em vazamentos de dados e não pode ser utilizada.');
                return;
              }
              const reused = (data.errors as { validator?: string }[]).find(
                (e) => e.validator === 'PasswordHistoryValidator',
              );
              if (reused) {
                setErrorMessage('Esta senha já foi utilizada anteriormente. Escolha uma senha diferente.');
                return;
              }
            }
          }

          setErrorMessage(getChangePasswordErrorMessage(error));
        },
      },
    );
  });

  return (
    <AuthLayout>
      <div className="text-center space-y-2">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Alterar senha</h2>
        <p className="text-sm text-muted-foreground">
          Você está usando uma senha temporária. Por segurança, altere sua senha antes de continuar.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            {rateLimitSeconds > 0
              ? `Muitas tentativas. Aguarde ${formatTime(rateLimitSeconds)} para tentar novamente.`
              : errorMessage}
          </p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha atual</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha atual"
                      autoComplete="current-password"
                      className="h-12 text-base pl-10 pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua nova senha"
                      autoComplete="new-password"
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

          <PasswordStrengthBar password={passwordValue} />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar nova senha</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua nova senha"
                      autoComplete="new-password"
                      className="h-12 text-base pl-10 pr-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={changePasswordMutation.isPending || rateLimitSeconds > 0}
          >
            {changePasswordMutation.isPending
              ? 'Alterando senha...'
              : rateLimitSeconds > 0
                ? `Aguarde ${formatTime(rateLimitSeconds)}`
                : 'Alterar senha'}
          </Button>
        </form>
      </Form>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Conexão segura</span>
      </div>
    </AuthLayout>
  );
}
