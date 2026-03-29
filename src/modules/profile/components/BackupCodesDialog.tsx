import { memo } from 'react';
import { Shield, Download, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BackupCodesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codes: string[];
}

function BackupCodesDialogComponent({ open, onOpenChange, codes }: BackupCodesDialogProps) {
  const { toast } = useToast();

  const downloadCodes = () => {
    const text = codes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Códigos baixados', description: 'Os códigos de recuperação foram salvos.' });
  };

  const copyCodes = async () => {
    let success = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(codes.join('\n'));
        success = true;
      } catch {
        // fallback below
      }
    }
    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = codes.join('\n');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }
    toast({
      variant: success ? undefined : 'destructive',
      title: success ? 'Códigos copiados' : 'Erro ao copiar',
      description: success
        ? 'Os códigos foram copiados para a área de transferência.'
        : 'Não foi possível copiar. Copie manualmente.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Códigos de Recuperação
            </span>
          </DialogTitle>
          <DialogDescription>
            Guarde estes códigos em local seguro. Use-os para acessar sua conta se perder o
            dispositivo autenticador.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg text-center">
            {codes.map((code, i) => (
              <code key={i} className="text-sm font-mono">
                {code}
              </code>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadCodes} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            <Button variant="outline" onClick={copyCodes} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>

          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Concluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const BackupCodesDialog = memo(BackupCodesDialogComponent);
