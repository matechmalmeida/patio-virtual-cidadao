import { memo } from 'react';
import {
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  HelpCircle,
  ShieldCheck,
  ShieldX,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Device } from '../../types/device';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const deviceTypeIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: HelpCircle,
} as const;

const deviceTypeLabels = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
  unknown: 'Desconhecido',
} as const;

function formatLastSeen(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
}

function isRecentDevice(createdAt: string): boolean {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return new Date(createdAt).getTime() > oneDayAgo;
}

interface DeviceItemProps {
  device: Device;
  isCurrentDevice: boolean;
  onRename: (device: Device) => void;
  onToggleTrust: (device: Device) => void;
  onRevoke: (device: Device) => void;
}

function DeviceItemComponent({
  device,
  isCurrentDevice,
  onRename,
  onToggleTrust,
  onRevoke,
}: DeviceItemProps) {
  const DeviceIcon = deviceTypeIcons[device.type];
  const isRecent = isRecentDevice(device.createdAt);

  return (
    <div
      className={cn(
        'flex items-start justify-between p-4 border rounded-lg',
        isCurrentDevice && 'border-primary bg-primary/5',
      )}
    >
      <div className="flex gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center shrink-0',
            isCurrentDevice ? 'bg-primary/10' : 'bg-muted',
          )}
        >
          <DeviceIcon
            className={cn('w-6 h-6', isCurrentDevice ? 'text-primary' : 'text-muted-foreground')}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{device.name}</span>
            {isCurrentDevice && (
              <Badge variant="default" className="text-xs">
                Este dispositivo
              </Badge>
            )}
            {isRecent && !isCurrentDevice && (
              <Badge variant="secondary" className="text-xs">
                Novo
              </Badge>
            )}
            {device.isTrusted && (
              <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Confiavel
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {device.browser && device.os
              ? `${device.browser} ${device.browserVersion || ''} - ${device.os} ${device.osVersion || ''}`
              : deviceTypeLabels[device.type]}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Ultimo acesso: {formatLastSeen(device.lastSeenAt)}
            </span>
            {device.lastIp && <span>IP: {device.lastIp}</span>}
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
          <DropdownMenuItem onClick={() => onRename(device)}>
            <Pencil className="w-4 h-4 mr-2" />
            Renomear
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleTrust(device)}>
            {device.isTrusted ? (
              <>
                <ShieldX className="w-4 h-4 mr-2" />
                Remover confianca
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                Marcar como confiavel
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onRevoke(device)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isCurrentDevice ? 'Revogar e sair' : 'Revogar dispositivo'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const DeviceItem = memo(DeviceItemComponent);
