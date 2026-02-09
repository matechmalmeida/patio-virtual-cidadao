import { useAuth } from '@/contexts/AuthContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertBanner } from '@/components/AlertBanner';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
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
        title: 'Notificações ativadas!',
        description: 'Você receberá alertas sobre o andamento do seu processo.',
      });
    }
  };

  const handleTest = () => {
    sendLocalNotification('Pátio Virtual', {
      body: `Atualização no processo ${currentCase?.code ?? ''}: seu documento foi aprovado!`,
      tag: 'test-notification',
    });
    toast({
      title: 'Notificação de teste enviada',
      description: 'Verifique a barra de notificações do seu dispositivo.',
    });
  };

  const notificationTypes = [
    {
      label: 'Mudança de status',
      description: 'Quando o status do processo mudar',
      enabled: true,
    },
    {
      label: 'Documentos analisados',
      description: 'Quando um comprovante for aprovado ou reprovado',
      enabled: true,
    },
    {
      label: 'Prazo de pendência',
      description: 'Lembrete antes do vencimento de uma pendência',
      enabled: true,
    },
    {
      label: 'Alerta de movimentação',
      description: 'Se o veículo sair da área permitida',
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
        Voltar
      </Button>

      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notificações Push
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Receba alertas sobre o andamento do seu processo diretamente no celular.
        </p>
      </div>

      {/* Permission status */}
      {!isSupported ? (
        <AlertBanner variant="warning" title="Navegador não suportado">
          Seu navegador não suporta notificações push. Tente usar o Chrome ou o Safari no celular.
        </AlertBanner>
      ) : isDenied ? (
        <AlertBanner variant="error" title="Notificações bloqueadas">
          Você bloqueou as notificações. Para reativar, acesse as configurações do navegador e
          permita notificações para este site.
        </AlertBanner>
      ) : isGranted ? (
        <AlertBanner variant="success" title="Notificações ativas">
          <div className="flex items-center justify-between">
            <span>Você receberá alertas sobre o seu processo.</span>
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
                <p className="text-sm font-semibold">Ativar notificações</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Fique por dentro de cada atualização do processo — aprovações, prazos e alertas
                  importantes.
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
                  Solicitando...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Permitir notificações
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notification types */}
      {isGranted && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-5 space-y-1">
            <h2 className="text-sm font-semibold mb-3">Tipos de notificação</h2>
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

      {/* Test notification */}
      {isGranted && (
        <Button variant="outline" className="w-full" onClick={handleTest}>
          <BellRing className="h-4 w-4" />
          Enviar notificação de teste
        </Button>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <p>
          As notificações push funcionam mesmo com o navegador fechado. Você pode desativá-las a
          qualquer momento nas configurações do dispositivo.
        </p>
      </div>
    </div>
  );
}
