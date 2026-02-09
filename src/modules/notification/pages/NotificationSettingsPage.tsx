import { useAuth } from '@/modules/auth';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertBanner } from '@/components/AlertBanner';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Bell,
  BellOff,
  BellRing,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const { currentCase } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const {
    isSupported,
    permission,
    isRequesting,
    requestPermission,
    sendLocalNotification,
  } = usePushNotifications();

  const isGranted = permission === 'granted';
  const isDenied = permission === 'denied';

  const handleEnable = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: t('notifications.enabled'),
        description: t('notifications.enabledDesc'),
      });
    }
  };

  const handleTest = () => {
    sendLocalNotification(t('app.name'), {
      body: t('notifications.testBody', { code: currentCase?.code ?? '' }),
      tag: 'test-notification',
    });
    toast({
      title: t('notifications.testSent'),
      description: t('notifications.testSentDesc'),
    });
  };

  const notificationTypes = [
    {
      label: t('notifications.typeLabels.statusChange'),
      description: t('notifications.typeLabels.statusChangeDesc'),
      enabled: true,
    },
    {
      label: t('notifications.typeLabels.docsAnalyzed'),
      description: t('notifications.typeLabels.docsAnalyzedDesc'),
      enabled: true,
    },
    {
      label: t('notifications.typeLabels.deadline'),
      description: t('notifications.typeLabels.deadlineDesc'),
      enabled: true,
    },
    {
      label: t('notifications.typeLabels.movementAlert'),
      description: t('notifications.typeLabels.movementAlertDesc'),
      enabled: true,
    },
  ];

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {t('notifications.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t('notifications.subtitle')}
        </p>
      </div>

      {!isSupported ? (
        <AlertBanner variant="warning" title={t('notifications.unsupported')}>
          {t('notifications.unsupportedDesc')}
        </AlertBanner>
      ) : isDenied ? (
        <AlertBanner variant="error" title={t('notifications.blocked')}>
          {t('notifications.blockedDesc')}
        </AlertBanner>
      ) : isGranted ? (
        <AlertBanner variant="success" title={t('notifications.active')}>
          <div className="flex items-center justify-between">
            <span>{t('notifications.activeDesc')}</span>
          </div>
        </AlertBanner>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <BellRing className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t('notifications.enable')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('notifications.enableDesc')}
                </p>
              </div>
            </div>
            <Button
              className="w-full h-11 font-semibold"
              onClick={handleEnable}
              disabled={isRequesting}
            >
              {isRequesting ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t('notifications.requesting')}
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  {t('notifications.allow')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {isGranted && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5 space-y-1">
            <h2 className="text-sm font-semibold mb-3">{t('notifications.types')}</h2>
            {notificationTypes.map((type, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium">{type.label}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
                <Switch defaultChecked={type.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isGranted && (
        <Button variant="outline" className="w-full" onClick={handleTest}>
          <BellRing className="h-4 w-4" />
          {t('notifications.testButton')}
        </Button>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <p>
          {t('notifications.info')}
        </p>
      </div>
    </div>
  );
}
