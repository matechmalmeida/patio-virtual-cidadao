import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/modules/auth';
import {
  useProfileSessions,
  useRevokeProfileSession,
  useRevokeAllProfileSessions,
} from '../hooks/useProfileSessions';
import { SessionItem } from '../components/sessions/SessionItem';
import { RevokeSessionDialog } from '../components/sessions/RevokeSessionDialog';
import { RevokeAllSessionsDialog } from '../components/sessions/RevokeAllSessionsDialog';

export default function SessionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: sessions, isLoading } = useProfileSessions();
  const revokeSessionMutation = useRevokeProfileSession();
  const revokeAllMutation = useRevokeAllProfileSessions();

  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokeAllDialogOpen, setRevokeAllDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    familyId: string;
    isCurrent: boolean;
  } | null>(null);

  const handleRevoke = (familyId: string) => {
    const session = sessions?.find((s) => s.familyId === familyId);
    setSelectedSession({
      familyId,
      isCurrent: session?.isCurrent ?? false,
    });
    setRevokeDialogOpen(true);
  };

  const handleConfirmRevoke = () => {
    if (!selectedSession) return;
    revokeSessionMutation.mutate(selectedSession.familyId, {
      onSuccess: () => {
        setRevokeDialogOpen(false);
        setSelectedSession(null);
        if (selectedSession.isCurrent) {
          logout();
          navigate('/acesso');
        }
      },
    });
  };

  const handleConfirmRevokeAll = () => {
    revokeAllMutation.mutate(undefined, {
      onSuccess: () => {
        setRevokeAllDialogOpen(false);
        logout();
        navigate('/acesso');
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
              <CardTitle>Sessoes</CardTitle>
              <CardDescription>Gerencie suas sessoes conectadas</CardDescription>
            </div>
            {sessions && sessions.length > 1 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setRevokeAllDialogOpen(true)}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Encerrar todas
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Nenhuma sessao ativa encontrada.
            </p>
          ) : (
            <div className="space-y-3">
              {sessions
                .sort((a, b) => (a.isCurrent ? -1 : b.isCurrent ? 1 : 0))
                .map((session) => (
                  <SessionItem
                    key={session.familyId}
                    session={session}
                    onRevoke={handleRevoke}
                    isRevoking={
                      revokeSessionMutation.isPending &&
                      selectedSession?.familyId === session.familyId
                    }
                  />
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RevokeSessionDialog
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
        onConfirm={handleConfirmRevoke}
        isCurrentSession={selectedSession?.isCurrent ?? false}
        isPending={revokeSessionMutation.isPending}
      />

      <RevokeAllSessionsDialog
        open={revokeAllDialogOpen}
        onOpenChange={setRevokeAllDialogOpen}
        onConfirm={handleConfirmRevokeAll}
        isPending={revokeAllMutation.isPending}
      />
    </div>
  );
}
