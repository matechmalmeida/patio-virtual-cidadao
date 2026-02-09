import { useState } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';
import { resetPassword } from '../services/auth.service';
import { AuthLayout } from '../components/AuthLayout';

const schema = z
  .object({
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors: fieldErrors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return <Navigate to="/acesso" replace />;
  }

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      await resetPassword(token, data.password);
      setDone(true);
    } catch (err) {
      setError(getApiErrorMessage(err, t('auth.resetPassword.errors.generic')));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <h2 className="text-lg font-semibold">{t('auth.resetPassword.successTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('auth.resetPassword.successDesc')}</p>
          <Button asChild className="w-full">
            <Link to="/acesso">{t('auth.resetPassword.goToLogin')}</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('auth.resetPassword.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('auth.resetPassword.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.resetPassword.password')}</Label>
          <Input
            id="password"
            type="password"
            className="h-12 text-base"
            {...register('password')}
          />
          {fieldErrors.password && (
            <p className="text-xs text-destructive">{t('auth.resetPassword.errors.weak')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('auth.resetPassword.confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            className="h-12 text-base"
            {...register('confirmPassword')}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-destructive">{t('auth.resetPassword.errors.mismatch')}</p>
          )}
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
          {t('auth.resetPassword.submit')}
        </Button>
      </form>
    </AuthLayout>
  );
}
