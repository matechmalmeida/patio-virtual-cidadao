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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getAddress, updateAddress } from '../services/profile.service';

const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

function maskCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

const schema = z.object({
  cep: z.string().min(9),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string(),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().length(2),
});

type FormData = z.infer<typeof schema>;

export default function AddressPage() {
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
    defaultValues: { complement: '' },
  });

  useEffect(() => {
    getAddress().then((a) => {
      setValue('cep', a.cep);
      setValue('street', a.street);
      setValue('number', a.number);
      setValue('complement', a.complement);
      setValue('neighborhood', a.neighborhood);
      setValue('city', a.city);
      setValue('state', a.state);
      setLoading(false);
    });
  }, [setValue]);

  const cepValue = watch('cep');
  const stateValue = watch('state');

  const onSubmit = async (data: FormData) => {
    try {
      await updateAddress(data);
      toast({ title: t('profile.address.saveSuccess') });
      navigate('/app/profile');
    } catch {
      toast({ title: t('profile.address.saveError'), variant: 'destructive' });
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

      <h1 className="text-xl font-bold">{t('profile.address.title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cep">{t('profile.address.cep')}</Label>
          <Input
            id="cep"
            {...register('cep')}
            value={cepValue || ''}
            onChange={(e) => setValue('cep', maskCep(e.target.value), { shouldValidate: true })}
          />
          {errors.cep && (
            <p className="text-xs text-destructive">{t('profile.address.errors.cepInvalid')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">{t('profile.address.street')}</Label>
          <Input id="street" {...register('street')} />
          {errors.street && (
            <p className="text-xs text-destructive">{t('profile.address.errors.streetRequired')}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="number">{t('profile.address.number')}</Label>
            <Input id="number" {...register('number')} />
            {errors.number && (
              <p className="text-xs text-destructive">{t('profile.address.errors.numberRequired')}</p>
            )}
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="complement">{t('profile.address.complement')}</Label>
            <Input id="complement" {...register('complement')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="neighborhood">{t('profile.address.neighborhood')}</Label>
          <Input id="neighborhood" {...register('neighborhood')} />
          {errors.neighborhood && (
            <p className="text-xs text-destructive">{t('profile.address.errors.neighborhoodRequired')}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="city">{t('profile.address.city')}</Label>
            <Input id="city" {...register('city')} />
            {errors.city && (
              <p className="text-xs text-destructive">{t('profile.address.errors.cityRequired')}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t('profile.address.state')}</Label>
            <Select
              value={stateValue}
              onValueChange={(v) => setValue('state', v, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UF_LIST.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-xs text-destructive">{t('profile.address.errors.stateRequired')}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('common.loading') : t('common.save')}
        </Button>
      </form>
    </div>
  );
}
