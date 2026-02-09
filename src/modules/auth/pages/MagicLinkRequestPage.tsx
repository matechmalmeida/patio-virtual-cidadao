import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MailCheck } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';
import { requestMagicLink } from '../services/auth.service';
import { AuthLayout } from '../components/AuthLayout';

const schema = z.object({
  email: z.string().min(1).email(),
});

type FormData = z.infer<typeof schema>;

export default function MagicLinkRequestPage() {
  const [sent, setSent] = useState(false);
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

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    try {
      await requestMagicLink(data.email);
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, t('auth.magicLink.backToLogin')));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <MailCheck className="h-12 w-12 text-primary mx-auto" />
          <h2 className="text-lg font-semibold">{t('auth.magicLink.successTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('auth.magicLink.successDesc')}</p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/acesso">{t('auth.magicLink.backToLogin')}</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{t('auth.magicLink.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('auth.magicLink.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.magicLink.email')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t('auth.login.emailPlaceholder')}
              className="h-12 text-base pl-10"
              {...register('email')}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{t('auth.login.errors.invalidCredentials')}</p>
          )}
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
          {t('auth.magicLink.submit')}
        </Button>
      </form>

      <div className="text-center">
        <Link to="/acesso" className="text-sm text-primary hover:underline">
          {t('auth.magicLink.backToLogin')}
        </Link>
      </div>
    </AuthLayout>
  );
}
