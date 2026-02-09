import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/hooks/useTheme';
import { useAuth, TotpSetupDialog } from '@/modules/auth';
import { getPreferences, updatePreferences } from '../services/profile.service';
import type { UserPreferences } from '../types/profile';

export default function PreferencesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);

  useEffect(() => {
    getPreferences().then(setPrefs);
  }, []);

  const handleLanguageChange = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await updatePreferences({ language: lang as UserPreferences['language'] });
    setPrefs((prev) => (prev ? { ...prev, language: lang as UserPreferences['language'] } : prev));
  };

  const handleThemeToggle = async () => {
    toggleTheme();
    const next = theme === 'dark' ? 'light' : 'dark';
    await updatePreferences({ theme: next });
    setPrefs((prev) => (prev ? { ...prev, theme: next } : prev));
  };

  if (!prefs) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/app/profile')}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <h1 className="text-xl font-bold">{t('profile.preferences.title')}</h1>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-semibold">{t('profile.preferences.language')}</Label>
          <RadioGroup
            value={i18n.language}
            onValueChange={handleLanguageChange}
            className="space-y-2"
          >
            {(['pt', 'en', 'es'] as const).map((lang) => (
              <div key={lang} className="flex items-center gap-3 p-3 rounded-lg border">
                <RadioGroupItem value={lang} id={`lang-${lang}`} />
                <Label htmlFor={`lang-${lang}`} className="cursor-pointer flex-1">
                  {t(`language.${lang}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div>
            <p className="text-sm font-semibold">{t('profile.preferences.theme')}</p>
            <p className="text-xs text-muted-foreground">
              {theme === 'dark'
                ? t('profile.preferences.themeDark')
                : t('profile.preferences.themeLight')}
            </p>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={handleThemeToggle} />
        </div>

        <Link
          to="/app/notifications/settings"
          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">
                {t('profile.preferences.pushNotifications')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('profile.preferences.configurePush')}
              </p>
            </div>
          </div>
        </Link>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-semibold">{t('profile.preferences.security')}</Label>
          </div>
          <div className="p-3 rounded-lg border space-y-3">
            <div>
              <p className="text-sm font-semibold">
                {t('profile.preferences.twoFactor')}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.totpEnabled
                  ? t('auth.totp.setup.successDesc')
                  : t('auth.totp.setup.title')}
              </p>
            </div>
            <TotpSetupDialog />
          </div>
        </div>
      </div>
    </div>
  );
}
