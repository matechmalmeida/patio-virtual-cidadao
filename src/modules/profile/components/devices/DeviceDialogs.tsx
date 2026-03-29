import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RenameDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
  onDeviceNameChange: (name: string) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function RenameDeviceDialog({
  open,
  onOpenChange,
  deviceName,
  onDeviceNameChange,
  onConfirm,
  isPending,
}: RenameDeviceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear Dispositivo</DialogTitle>
          <DialogDescription>
            Digite um novo nome para identificar este dispositivo
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="device-name">Nome do dispositivo</Label>
          <Input
            id="device-name"
            value={deviceName}
            onChange={(e) => onDeviceNameChange(e.target.value)}
            placeholder="Ex: Meu celular"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onConfirm} disabled={isPending || !deviceName.trim()}>
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RevokeDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCurrentDevice: boolean;
  onConfirm: () => void;
  isPending: boolean;
}

export function RevokeDeviceDialog({
  open,
  onOpenChange,
  isCurrentDevice,
  onConfirm,
  isPending,
}: RevokeDeviceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            {isCurrentDevice ? 'Revogar e Sair' : 'Revogar Dispositivo'}
          </DialogTitle>
          <DialogDescription>
            {isCurrentDevice
              ? 'Voce esta prestes a revogar o dispositivo atual. Isso encerrara sua sessao.'
              : 'Tem certeza que deseja revogar o acesso deste dispositivo?'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2 text-sm text-muted-foreground">
          {isCurrentDevice ? (
            <>
              <p>Ao revogar este dispositivo:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Sua sessao sera encerrada imediatamente</li>
                <li>Voce sera redirecionado para a tela de login</li>
              </ul>
            </>
          ) : (
            <>
              <p>Ao revogar este dispositivo:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Todas as sessoes deste dispositivo serao encerradas</li>
                <li>Sera necessario fazer login novamente neste dispositivo</li>
              </ul>
            </>
          )}
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
              {isPending ? 'Revogando...' : isCurrentDevice ? 'Revogar e Sair' : 'Revogar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface RevokeAllDevicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function RevokeAllDevicesDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: RevokeAllDevicesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Revogar Todos os Dispositivos
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja revogar o acesso de todos os outros dispositivos?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2 text-sm text-muted-foreground">
          <p>Ao revogar todos os dispositivos:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Todos os dispositivos exceto este serao desconectados</li>
            <li>Sera necessario fazer login novamente nos outros dispositivos</li>
            <li>Este dispositivo permanecera conectado</li>
          </ul>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
              {isPending ? 'Revogando...' : 'Revogar Todos'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
