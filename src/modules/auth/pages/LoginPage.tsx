import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';
import { login } from '../services/auth.service';
import { useAuthDispatch } from '../contexts/AuthContext';
import { AuthLayout } from '../components/AuthLayout';

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);

    try {
      const result = await login(data.email, data.password);

      if (result.requiresTotp && result.tempToken) {
        dispatch({
          type: 'TOTP_PENDING',
          payload: { tempToken: result.tempToken, email: data.email },
        });
        navigate('/acesso/2fa', { state: { tempToken: result.tempToken } });
        return;
      }

      if (result.session) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.session });
        navigate('/dashboard', { replace: true });
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.login.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('auth.login.emailPlaceholder')}
            className="h-12 text-base"
            {...register('email')}
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{t('auth.login.errors.invalidCredentials')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.login.password')}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t('auth.login.passwordPlaceholder')}
            className="h-12 text-base"
            {...register('password')}
          />
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
          {t('auth.login.submit')}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2 text-sm">
        <Link to="/acesso/esqueci-senha" className="text-primary hover:underline">
          {t('auth.login.forgotPassword')}
        </Link>
        <Link to="/acesso/link-magico" className="text-primary hover:underline">
          {t('auth.login.magicLink')}
        </Link>
      </div>
    </AuthLayout>
  );
}
