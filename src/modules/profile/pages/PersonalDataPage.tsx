import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getProfile, updateProfile } from '../services/profile.service';

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(14),
  cpf: z.string().min(14),
});

type FormData = z.infer<typeof schema>;

export default function PersonalDataPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getProfile().then((p) => {
      setValue('name', p.name);
      setValue('email', p.email);
      setValue('phone', p.phone);
      setValue('cpf', p.cpf);
      setLoading(false);
    });
  }, [setValue]);

  const phoneValue = watch('phone');
  const cpfValue = watch('cpf');

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile({ name: data.name, phone: data.phone, cpf: data.cpf });
      toast({ title: t('profile.personal.saveSuccess') });
      navigate('/app/profile');
    } catch {
      toast({ title: t('profile.personal.saveError'), variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/app/profile')}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <h1 className="text-xl font-bold">{t('profile.personal.title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('profile.personal.name')}</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{t('profile.personal.errors.nameRequired')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.login.email')}</Label>
          <Input id="email" {...register('email')} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('profile.personal.phone')}</Label>
          <Input
            id="phone"
            {...register('phone')}
            value={phoneValue || ''}
            onChange={(e) => setValue('phone', maskPhone(e.target.value), { shouldValidate: true })}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{t('profile.personal.errors.phoneInvalid')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpf">{t('profile.personal.cpf')}</Label>
          <Input
            id="cpf"
            {...register('cpf')}
            value={cpfValue || ''}
            onChange={(e) => setValue('cpf', maskCpf(e.target.value), { shouldValidate: true })}
          />
          {errors.cpf && (
            <p className="text-xs text-destructive">{t('profile.personal.errors.cpfInvalid')}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('common.loading') : t('common.save')}
        </Button>
      </form>
    </div>
  );
}
