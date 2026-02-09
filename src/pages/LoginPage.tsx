import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBrand } from '@/contexts/BrandContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Car, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getApiErrorMessage } from '@/services/http/api-error';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function LoginPage() {
  const [caseCode, setCaseCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { brand } = useBrand();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanCode = caseCode.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanCode) {
      setError(t('login.errors.emptyCode'));
      return;
    }
    if (cleanPhone.length < 10) {
      setError(t('login.errors.invalidPhone'));
      return;
    }

    try {
      await login(cleanCode, phone);
      navigate('/otp');
    } catch (err) {
      setError(getApiErrorMessage(err, t('login.errors.invalidPhone')));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center relative">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        <div className="h-16 w-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 overflow-hidden">
          {brand?.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.appName} className="h-16 w-16 object-contain" />
          ) : (
            <Car className="h-8 w-8 text-primary-foreground" />
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{brand?.appName ?? t('app.name')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('app.subtitle')}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 pb-8">
        <Card className="max-w-md mx-auto border-0 shadow-lg">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold">{t('login.title')}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t('login.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caseCode">{t('login.caseCode')}</Label>
                <Input
                  id="caseCode"
                  placeholder={t('login.caseCodePlaceholder')}
                  value={caseCode}
                  onChange={(e) => setCaseCode(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('login.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('login.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="h-12 text-base"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                {t('login.submit')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-lg bg-muted p-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
              <p>{t('login.securityNote')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Help link */}
        <div className="text-center mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                <HelpCircle className="h-4 w-4" />
                {t('login.whatIs')}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>{t('login.whatIs')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>{t('login.whatIsText1')}</p>
                <p>{t('login.whatIsText2')}</p>
                <p className="font-medium text-foreground">{t('login.whatIsText3')}</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-muted-foreground/60">
        {brand?.copyright ?? t('app.copyright')}
      </footer>
    </div>
  );
}
