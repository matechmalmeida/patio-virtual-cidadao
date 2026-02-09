import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LocationMap } from '@/components/LocationMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertBanner } from '@/components/AlertBanner';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Satellite,
  BatteryMedium,
  BatteryLow,
  BatteryFull,
  Signal,
  Radio,
  Clock,
  Activity,
  Zap,
  Move,
  Power,
  PowerOff,
  ShieldAlert,
} from 'lucide-react';
import { getGpsStatusByCase, type GPSDeviceData } from '@/services/gps.service';
import { getApiErrorMessage } from '@/services/http/api-error';

const eventIcons: Record<string, typeof Clock> = {
  heartbeat: Radio,
  ignition_on: Power,
  ignition_off: PowerOff,
  movement: Move,
  tamper: ShieldAlert,
  low_battery: BatteryLow,
};

const eventColors: Record<string, string> = {
  heartbeat: 'text-muted-foreground',
  ignition_on: 'text-warning',
  ignition_off: 'text-muted-foreground',
  movement: 'text-destructive',
  tamper: 'text-destructive',
  low_battery: 'text-warning',
};

function BatteryIcon({ level }: { level: number }) {
  if (level <= 20) return <BatteryLow className="h-5 w-5 text-destructive" />;
  if (level <= 50) return <BatteryMedium className="h-5 w-5 text-warning" />;
  return <BatteryFull className="h-5 w-5 text-success" />;
}

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimeFull(isoString: string) {
  return new Date(isoString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTimeAgo(isoString: string) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Agora mesmo';
  if (minutes < 60) return `Há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Há ${days} dia${days > 1 ? 's' : ''}`;
}

export default function GPSStatusPage() {
  const navigate = useNavigate();
  const { currentCase } = useAuth();
  const [gpsData, setGpsData] = useState<GPSDeviceData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentCase) {
      return;
    }

    let isMounted = true;
    getGpsStatusByCase(currentCase.id)
      .then((data) => {
        if (!isMounted) return;
        setGpsData(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(getApiErrorMessage(err, 'Não foi possível carregar o status do GPS.'));
      });

    return () => {
      isMounted = false;
    };
  }, [currentCase]);

  if (!currentCase) return null;
  if (error) {
    return (
      <div className="px-4 py-5">
        <AlertBanner variant="error">{error}</AlertBanner>
      </div>
    );
  }
  if (!gpsData) {
    return (
      <div className="px-4 py-5">
        <AlertBanner variant="info">Carregando status do dispositivo...</AlertBanner>
      </div>
    );
  }

  const statusConfig = {
    ativo: { label: 'Ativo', variant: 'default' as const, className: 'bg-success text-success-foreground' },
    inativo: { label: 'Inativo', variant: 'secondary' as const, className: 'bg-muted text-muted-foreground' },
    alerta: { label: 'Alerta', variant: 'destructive' as const, className: 'bg-destructive text-destructive-foreground' },
  };

  const signalConfig = {
    forte: { label: 'Forte', bars: 3 },
    moderado: { label: 'Moderado', bars: 2 },
    fraco: { label: 'Fraco', bars: 1 },
  };

  const status = statusConfig[gpsData.status];
  const signal = signalConfig[gpsData.signalStrength];

  const hasMovementAlert = gpsData.transmissionHistory.some(
    (t) => t.event === 'movement' || t.event === 'tamper'
  );

  return (
    <div className="px-4 py-5 space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary" />
          Status do Dispositivo GPS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoramento em tempo real do dispositivo instalado no {currentCase.vehicle}.
        </p>
      </div>

      {/* Movement alert */}
      {hasMovementAlert && (
        <AlertBanner variant="error" title="Movimentação detectada">
          Foi registrada uma movimentação do veículo. O veículo deve permanecer estacionado durante
          todo o processo.
        </AlertBanner>
      )}

      {/* Device overview */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Dispositivo</p>
              <p className="text-sm font-semibold font-mono">{gpsData.deviceId}</p>
            </div>
            <Badge className={status.className}>{status.label}</Badge>
          </div>

          {/* Battery */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BatteryIcon level={gpsData.batteryLevel} />
                <span className="text-sm font-medium">Bateria</span>
              </div>
              <span className="text-sm font-bold">{gpsData.batteryLevel}%</span>
            </div>
            <Progress
              value={gpsData.batteryLevel}
              className="h-2"
            />
          </div>

          {/* Signal */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Signal className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Sinal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-0.5 h-4">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1.5 rounded-sm ${
                      bar <= signal.bars ? 'bg-success' : 'bg-muted'
                    }`}
                    style={{ height: `${bar * 33}%` }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{signal.label}</span>
            </div>
          </div>

          {/* Last transmission */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Última transmissão</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {getTimeAgo(gpsData.lastTransmission)}
            </span>
          </div>

          {/* Installed at */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Instalado em</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTimeFull(gpsData.installedAt)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-5">
          <h2 className="text-base font-semibold mb-4">Localização atual</h2>
          <LocationMap location={gpsData.location} />
        </CardContent>
      </Card>

      {/* Transmission history */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-5">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Histórico de transmissões
          </h2>
          <div className="space-y-1">
            {gpsData.transmissionHistory.map((tx) => {
              const Icon = eventIcons[tx.event] ?? Radio;
              const color = eventColors[tx.event] ?? 'text-muted-foreground';
              const isAlert = tx.event === 'movement' || tx.event === 'tamper';

              return (
                <div
                  key={tx.id}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${
                    isAlert ? 'bg-destructive/5' : ''
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${isAlert ? 'font-semibold text-destructive' : 'font-medium'}`}>
                      {tx.eventLabel}
                    </p>
                    {tx.speed > 0 && (
                      <p className="text-xs text-destructive font-medium">
                        Velocidade: {tx.speed} km/h
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatTime(tx.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Firmware info */}
      <div className="text-center text-xs text-muted-foreground py-2">
        Firmware {gpsData.firmwareVersion} • Atualização a cada 30 min
      </div>
    </div>
  );
}
