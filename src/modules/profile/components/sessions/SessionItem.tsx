import { memo } from 'react';
import {
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  HelpCircle,
  ShieldCheck,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Session } from '@/modules/auth/types/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const deviceTypeLabels: Record<NonNullable<Session['device']>['type'], string> = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
  unknown: 'Desconhecido',
};

const deviceTypeIcons: Record<NonNullable<Session['device']>['type'], typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: HelpCircle,
};

function formatLastUsed(date: string | null | undefined): string {
  if (!date) return 'indisponível';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'indisponível';
  return formatDistanceToNow(parsed, { addSuffix: true, locale: ptBR });
}

function formatDeviceSummary(device: NonNullable<Session['device']>) {
  const osVersion = device.osVersion ? ` ${device.osVersion}` : '';
  const os = device.os ? `${device.os}${osVersion}` : null;
  const browserVersion = device.browserVersion ? ` ${device.browserVersion}` : '';
  const browser = device.browser ? `${device.browser}${browserVersion}` : null;
  return [browser, os].filter(Boolean).join(' - ');
}

function isRecentSession(createdAt: string): boolean {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return new Date(createdAt).getTime() > oneDayAgo;
}

interface SessionItemProps {
  session: Session;
  onRevoke: (familyId: string) => void;
  isRevoking: boolean;
}

function SessionItemComponent({ session, onRevoke, isRevoking }: SessionItemProps) {
  const deviceType = session.device?.type ?? 'unknown';
  const DeviceIcon = deviceTypeIcons[deviceType];
  const isRecent = isRecentSession(session.createdAt);
  const isCurrent = session.isCurrent;

  return (
    <div
      className={cn(
        'flex items-start justify-between p-4 border rounded-lg',
        isCurrent && 'border-primary bg-primary/5',
      )}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
            isCurrent ? 'bg-primary/10' : 'bg-muted',
          )}
        >
          <DeviceIcon
            className={cn('w-6 h-6', isCurrent ? 'text-primary' : 'text-muted-foreground')}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">
              {session.device?.name || session.deviceName || 'Sessão sem dispositivo'}
            </span>
            {isCurrent && (
              <Badge variant="default" className="text-xs">
                Sessão atual
              </Badge>
            )}
            {isRecent && !isCurrent && (
              <Badge variant="secondary" className="text-xs">
                Nova
              </Badge>
            )}
            {session.device?.isTrusted && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Confiável
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {session.device
              ? formatDeviceSummary(session.device) || deviceTypeLabels[deviceType]
              : deviceTypeLabels[deviceType]}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Último uso: {formatLastUsed(session.lastActivity || session.createdAt)}
            </span>
            {session.ipAddress && <span>IP: {session.ipAddress}</span>}
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onRevoke(session.familyId)}
            disabled={isRevoking}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isCurrent ? 'Encerrar e sair' : 'Encerrar sessão'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const SessionItem = memo(SessionItemComponent);
