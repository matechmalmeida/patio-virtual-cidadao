import { memo } from 'react';
import { Clock } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RevokeAllSessionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

function RevokeAllSessionsDialogComponent({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: RevokeAllSessionsDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Encerrar todas as sessões</AlertDialogTitle>
          <AlertDialogDescription className="text-justify">
            Isso encerrará todas as sessões ativas, inclusive a atual. Você precisará fazer login
            novamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex justify-between w-full">
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  Encerrando...
                </span>
              ) : (
                'Revogar Todas'
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const RevokeAllSessionsDialog = memo(RevokeAllSessionsDialogComponent);
