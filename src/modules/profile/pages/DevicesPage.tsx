import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, ReauthDialog } from '@/modules/auth';
import {
  useDevices,
  useCurrentDevice,
  useRenameDevice,
  useTrustDevice,
  useUntrustDevice,
  useRevokeDevice,
  useRevokeAllDevices,
} from '../hooks/useDevices';
import type { Device } from '../types/device';
import { DeviceItem } from '../components/devices/DeviceItem';
import {
  RenameDeviceDialog,
  RevokeDeviceDialog,
  RevokeAllDevicesDialog,
} from '../components/devices/DeviceDialogs';

export default function DevicesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: devicesResponse, isLoading } = useDevices();
  const { data: currentDeviceData } = useCurrentDevice();
  const renameMutation = useRenameDevice();
  const trustMutation = useTrustDevice();
  const untrustMutation = useUntrustDevice();
  const revokeMutation = useRevokeDevice();
  const revokeAllMutation = useRevokeAllDevices();

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);
  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthAction, setReauthAction] = useState<'trust' | 'untrust' | null>(null);

  const currentDeviceId = currentDeviceData?.device?.id;
  const devices = devicesResponse?.data ?? [];

  const handleRename = (device: Device) => {
    setSelectedDevice(device);
    setRenameValue(device.name);
    setRenameOpen(true);
  };

  const handleConfirmRename = () => {
    if (!selectedDevice || !renameValue.trim()) return;
    renameMutation.mutate(
      { id: selectedDevice.id, name: renameValue.trim() },
      { onSuccess: () => { setRenameOpen(false); setSelectedDevice(null); } },
    );
  };

  const handleToggleTrust = (device: Device) => {
    setSelectedDevice(device);
    setReauthAction(device.isTrusted ? 'untrust' : 'trust');
    setReauthOpen(true);
  };

  const handleReauthSuccess = (reauthToken: string) => {
    if (!selectedDevice || !reauthAction) return;
    const mutation = reauthAction === 'trust' ? trustMutation : untrustMutation;
    mutation.mutate(
      { id: selectedDevice.id, reauthToken },
      { onSuccess: () => { setSelectedDevice(null); setReauthAction(null); } },
    );
  };

  const handleRevoke = (device: Device) => {
    setSelectedDevice(device);
    setRevokeOpen(true);
  };

  const handleConfirmRevoke = () => {
    if (!selectedDevice) return;
    const isCurrent = selectedDevice.id === currentDeviceId;
    revokeMutation.mutate(selectedDevice.id, {
      onSuccess: () => {
        setRevokeOpen(false);
        setSelectedDevice(null);
        if (isCurrent) {
          logout();
          navigate('/acesso');
        }
      },
    });
  };

  const handleConfirmRevokeAll = () => {
    revokeAllMutation.mutate(undefined, {
      onSuccess: () => {
        setRevokeAllOpen(false);
      },
    });
  };

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>Gerencie os dispositivos conectados a sua conta</CardDescription>
            </div>
            {devices.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setRevokeAllOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Revogar todos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : devices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Nenhum dispositivo encontrado.
            </p>
          ) : (
            <div className="space-y-3">
              {devices
                .sort((a, b) => {
                  if (a.id === currentDeviceId) return -1;
                  if (b.id === currentDeviceId) return 1;
                  return 0;
                })
                .map((device) => (
                  <DeviceItem
                    key={device.id}
                    device={device}
                    isCurrentDevice={device.id === currentDeviceId}
                    onRename={handleRename}
                    onToggleTrust={handleToggleTrust}
                    onRevoke={handleRevoke}
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RenameDeviceDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        deviceName={renameValue}
        onDeviceNameChange={setRenameValue}
        onConfirm={handleConfirmRename}
        isPending={renameMutation.isPending}
      />

      <RevokeDeviceDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        isCurrentDevice={selectedDevice?.id === currentDeviceId}
        onConfirm={handleConfirmRevoke}
        isPending={revokeMutation.isPending}
      />

      <RevokeAllDevicesDialog
        open={revokeAllOpen}
        onOpenChange={setRevokeAllOpen}
        onConfirm={handleConfirmRevokeAll}
        isPending={revokeAllMutation.isPending}
      />

      <ReauthDialog
        open={reauthOpen}
        onOpenChange={setReauthOpen}
        onSuccess={handleReauthSuccess}
        title={reauthAction === 'trust' ? 'Marcar como confiavel' : 'Remover confianca'}
      />
    </div>
  );
}
