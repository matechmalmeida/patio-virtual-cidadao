import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';
import { useCaseDispatch } from '@/modules/process';
import { login } from '../services/auth.service';
import { useAuthDispatch } from '../contexts/AuthContext';
import { setRememberMe, getRememberMe } from '../store/session-store';
import { AuthLayout } from '../components/AuthLayout';

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(getRememberMe);
  const dispatch = useAuthDispatch();
  const caseDispatch = useCaseDispatch();
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
    setRememberMe(remember);

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
        caseDispatch({ type: 'SET_CASES', payload: result.session.activeCases });
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.login.email')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('auth.login.emailPlaceholder')}
              className="h-12 text-base pl-10"
              {...register('email')}
            />
          </div>
          {fieldErrors.email && (
            <p role="alert" className="text-xs text-destructive">{t('auth.login.errors.invalidCredentials')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.login.password')}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t('auth.login.passwordPlaceholder')}
              className="h-12 text-base pl-10 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              {t('auth.login.rememberMe')}
            </Label>
          </div>
          <Link to="/acesso/esqueci-senha" className="text-sm text-primary hover:underline">
            {t('auth.login.forgotPassword')}
          </Link>
        </div>

        {error && <p role="alert" className="text-sm text-destructive font-medium">{error}</p>}

        <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading} aria-busy={loading}>
          {t('auth.login.submit')}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-border" />
        <span className="text-xs text-muted-foreground">{t('auth.login.or')}</span>
        <hr className="flex-1 border-border" />
      </div>

      <Button
        variant="outline"
        className="w-full h-12 text-base font-semibold bg-[hsl(220,30%,12%)] text-white border-transparent hover:bg-[hsl(220,30%,18%)] hover:text-white"
        asChild
      >
        <Link to="/acesso/link-magico">
          <Mail className="h-4 w-4 mr-2" />
          {t('auth.login.magicLinkButton')}
        </Link>
      </Button>
    </AuthLayout>
  );
}
