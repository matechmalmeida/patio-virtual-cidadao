import { usePWAInstall } from '../hooks/usePWAInstall';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Download,
  Smartphone,
  Wifi,
  Zap,
  Bell,
  Share,
  PlusSquare,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function InstallPage() {
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useTranslation();

  const benefits = [
    { icon: Zap, title: t('install.quickAccess'), description: t('install.quickAccessDesc') },
    { icon: Wifi, title: t('install.offline'), description: t('install.offlineDesc') },
    { icon: Bell, title: t('install.notificationsLabel'), description: t('install.notificationsDesc') },
    { icon: Smartphone, title: t('install.fullscreen'), description: t('install.fullscreenDesc') },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">{t('install.title')}</h1>
        </div>

        {/* Hero */}
        <div className="text-center space-y-3 py-4">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Download className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">{t('install.appName')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('install.subtitle')}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-2">
                <benefit.icon className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{benefit.title}</p>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Install action */}
        {isInstalled ? (
          <Card className="border-0 shadow-md bg-primary/5">
            <CardContent className="p-5 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">{t('install.alreadyInstalled')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('install.alreadyInstalledDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : canInstall ? (
          <Button onClick={install} className="w-full h-12 font-semibold text-base" size="lg">
            <Download className="h-5 w-5" />
            {t('install.installNow')}
          </Button>
        ) : isIOS ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 space-y-4">
              <p className="text-sm font-semibold">{t('install.iosInstructions')}</p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    {t('install.iosStep1Tap')} <Share className="h-4 w-4 text-primary" /> <strong>{t('install.iosStep1Share')}</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    {t('install.iosStep2Select')} <PlusSquare className="h-4 w-4 text-primary" />{' '}
                    <strong>{t('install.iosStep2Add')}</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <p className="text-sm">
                    {t('install.iosStep3Tap')} <strong>{t('install.iosStep3Add')}</strong>
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 space-y-2">
              <p className="text-sm font-semibold">{t('install.genericInstructions')}</p>
              <p className="text-xs text-muted-foreground">
                {t('install.genericDesc')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA back */}
        <div className="text-center pt-2">
          <Link to="/acesso" className="text-sm text-primary font-medium hover:underline">
            {t('install.accessPortal')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
