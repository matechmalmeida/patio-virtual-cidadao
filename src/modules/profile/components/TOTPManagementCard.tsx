import { memo, useState, useEffect, useCallback, useRef } from 'react';
import {
  Shield,
  Loader2,
  Smartphone,
  Trash2,
  AlertTriangle,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mfaService } from '@/modules/auth/services/mfa.service';
import { ReauthDialog } from '@/modules/auth';
import { ApiError } from '@/services/http/api-error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { BackupCodesDialog } from './BackupCodesDialog';

interface EnrollData {
  secret: string;
  qrCodeDataUrl: string;
  qrCodeUri: string;
}

function TOTPManagementCardComponent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [totpEnabled, setTotpEnabled] = useState(false);
  const [showCodesDialog, setShowCodesDialog] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reauthDialogOpen, setReauthDialogOpen] = useState(false);
  const [pendingReauthAction, setPendingReauthAction] = useState<'generate' | 'disable' | 'setup' | null>(null);

  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrollData, setEnrollData] = useState<EnrollData | null>(null);
  const [enrollStep, setEnrollStep] = useState<'qr' | 'verify' | 'backup-codes'>('qr');
  const [verifyCode, setVerifyCode] = useState('');
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [currentReauthToken, setCurrentReauthToken] = useState<string | null>(null);

  const { data: totpStatus } = useQuery({
    queryKey: ['mfa', 'totp-status'],
    queryFn: () => mfaService.getTOTPStatus(),
    retry: false,
  });

  const { data: totpFactors } = useQuery({
    queryKey: ['mfa', 'totp-factors'],
    queryFn: () => mfaService.getTOTPFactors(),
    retry: false,
    enabled: totpEnabled,
  });

  useEffect(() => {
    if (totpStatus) {
      setTotpEnabled(totpStatus.totpEnabled);
    }
  }, [totpStatus]);

  const setupMutation = useMutation({
    mutationFn: (reauthToken: string) => mfaService.setupTOTP(reauthToken),
    onSuccess: (data) => {
      setEnrollData(data);
      setEnrollDialogOpen(true);
      setEnrollStep('qr');
    },
    onError: (err: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar QR Code',
        description: err instanceof ApiError ? err.userMessage : 'Tente novamente.',
      });
    },
  });

  const enableMutation = useMutation({
    mutationFn: ({ code, reauthToken }: { code: string; reauthToken: string }) =>
      mfaService.enableTOTP(code, reauthToken),
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes);
      setEnrollStep('backup-codes');
      queryClient.invalidateQueries({ queryKey: ['mfa', 'totp-status'] });
      queryClient.invalidateQueries({ queryKey: ['mfa', 'totp-factors'] });
    },
    onError: (err: Error) => {
      setEnrollError(err instanceof ApiError ? err.userMessage : 'Código inválido');
    },
  });

  const generateBackupCodesMutation = useMutation({
    mutationFn: (reauthToken: string) => mfaService.regenerateBackupCodes(reauthToken),
    onSuccess: (data) => {
      setGeneratedCodes(data.backupCodes);
      setShowCodesDialog(true);
      queryClient.invalidateQueries({ queryKey: ['mfa', 'totp-factors'] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar códigos',
        description: 'Não foi possível gerar os códigos de recuperação.',
      });
    },
  });

  const disableTOTPMutation = useMutation({
    mutationFn: (reauthToken: string) => mfaService.disableTOTP(reauthToken),
    onSuccess: () => {
      toast({ title: 'TOTP desativado', description: 'O autenticador foi removido com sucesso.' });
      setDeleteDialogOpen(false);
      setTotpEnabled(false);
      queryClient.invalidateQueries({ queryKey: ['mfa', 'totp-status'] });
      queryClient.invalidateQueries({ queryKey: ['mfa', 'totp-factors'] });
    },
    onError: (err: Error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao remover autenticador',
        description: err instanceof ApiError ? err.userMessage : 'Tente novamente.',
      });
    },
  });

  const handleSwitchChange = useCallback(
    (checked: boolean) => {
      if (checked && !totpEnabled) {
        setPendingReauthAction('setup');
        setReauthDialogOpen(true);
      } else if (!checked && totpEnabled) {
        setDeleteDialogOpen(true);
      }
    },
    [totpEnabled],
  );

  const handleConfirmDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setPendingReauthAction('disable');
    setReauthDialogOpen(true);
  }, []);

  const handleReauthSuccess = useCallback(
    (token: string) => {
      setReauthDialogOpen(false);
      if (pendingReauthAction === 'generate') {
        setPendingReauthAction(null);
        generateBackupCodesMutation.mutate(token);
      } else if (pendingReauthAction === 'disable') {
        setPendingReauthAction(null);
        disableTOTPMutation.mutate(token);
      } else if (pendingReauthAction === 'setup') {
        setPendingReauthAction(null);
        setCurrentReauthToken(token);
        setupMutation.mutate(token);
      }
    },
    [pendingReauthAction, generateBackupCodesMutation, disableTOTPMutation, setupMutation],
  );

  const handleVerifyEnroll = (code = verifyCode) => {
    if (!code || code.length !== 6 || !currentReauthToken) return;
    setEnrollError(null);
    enableMutation.mutate({ code, reauthToken: currentReauthToken });
  };

  const copySecretRef = useRef(false);
  const copySecret = async () => {
    if (!enrollData?.secret || copySecretRef.current) return;
    try {
      await navigator.clipboard.writeText(enrollData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao copiar' });
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyBackupCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      toast({ title: 'Códigos copiados' });
    } catch {
      toast({ variant: 'destructive', title: 'Erro ao copiar' });
    }
  };

  const handleCloseEnrollDialog = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setEnrollStep('qr');
      setEnrollData(null);
      setBackupCodes([]);
      setVerifyCode('');
      setEnrollError(null);
      setCurrentReauthToken(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Autenticador (TOTP)
              </CardTitle>
              <CardDescription>
                Proteja sua conta com um código temporário gerado pelo app autenticador.
              </CardDescription>
            </div>
            {totpEnabled ? (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                Ativado
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                Desativado
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!totpEnabled && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-4 mb-4">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Aumente a segurança da sua conta
                  </p>
                  <p className="text-blue-800 dark:text-blue-200">
                    Habilite o autenticador TOTP para adicionar uma camada extra de proteção usando
                    códigos temporários gerados por um aplicativo.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {totpEnabled ? 'Desativar autenticador TOTP' : 'Ativar autenticador TOTP'}
              </p>
              <p className="text-xs text-muted-foreground">
                {totpEnabled
                  ? 'Remover a proteção de dois fatores da sua conta.'
                  : 'Adicionar uma camada extra de segurança com códigos temporários.'}
              </p>
            </div>
            <Switch checked={totpEnabled} onCheckedChange={handleSwitchChange} />
          </div>

          {totpEnabled && totpFactors && (
            <div className="space-y-4 pt-2">
              <div className="h-px bg-border" />

              <div>
                <h4 className="text-sm font-medium mb-3">Dispositivos configurados</h4>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Authenticator App</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {totpFactors.backupCodesRemaining} código
                          {totpFactors.backupCodesRemaining !== 1 ? 's' : ''} de backup
                        </p>
                        {totpFactors.shouldRegenerateBackupCodes && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-600/30">
                            Regenerar códigos
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <h4 className="text-sm font-medium mb-3">Códigos de recuperação</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Use códigos de backup para acessar sua conta caso perca o dispositivo autenticador.
                </p>
                <Button
                  onClick={() => {
                    setPendingReauthAction('generate');
                    setReauthDialogOpen(true);
                  }}
                  disabled={generateBackupCodesMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  {generateBackupCodesMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando códigos...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Gerar novos códigos de recuperação
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <BackupCodesDialog
        open={showCodesDialog}
        onOpenChange={setShowCodesDialog}
        codes={generatedCodes}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle className="text-xl">Remover autenticador TOTP?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base pt-2 text-justify">
              Esta ação irá desabilitar a autenticação de dois fatores na sua conta. Você não poderá
              mais usar códigos temporários para fazer login até que configure novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <div className="flex justify-between w-full">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sim, remover
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={enrollDialogOpen} onOpenChange={handleCloseEnrollDialog}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {enrollStep === 'qr' && (
                <span className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Configurar Autenticação TOTP
                </span>
              )}
              {enrollStep === 'verify' && 'Verificar Código'}
              {enrollStep === 'backup-codes' && (
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Códigos de Recuperação
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {enrollStep === 'qr' && 'Configure a autenticação de dois fatores usando um aplicativo autenticador'}
              {enrollStep === 'verify' && 'Digite o código de 6 dígitos do seu app'}
              {enrollStep === 'backup-codes' && 'Guarde estes códigos em local seguro. Use-os para acessar sua conta se perder o dispositivo autenticador.'}
            </DialogDescription>
          </DialogHeader>

          {enrollStep === 'qr' && enrollData && (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Passo 1: Instale um aplicativo autenticador
                </Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Google Authenticator', 'Microsoft Authenticator', 'Authy', '1Password'].map((name) => (
                    <div key={name} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                        <Smartphone className="h-3 w-3 text-primary" />
                      </div>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-border" />

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Passo 2: Escaneie o QR Code</Label>
                <p className="text-xs text-muted-foreground">
                  Abra o aplicativo autenticador e escaneie o código abaixo
                </p>
                <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <img src={enrollData.qrCodeDataUrl} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Ou insira manualmente</Label>
                <div className="flex items-center justify-center gap-2">
                  <code className="p-3 text-xs bg-muted rounded-md font-mono break-all text-center">
                    {enrollData.secret}
                  </code>
                  <Button variant="outline" size="icon" onClick={copySecret}>
                    {copiedSecret ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={() => setEnrollStep('verify')} className="w-full">
                Próximo
              </Button>
            </div>
          )}

          {enrollStep === 'verify' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Digite o código de 6 dígitos exibido no seu aplicativo autenticador
                </p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verifyCode}
                    onChange={(value) => {
                      setVerifyCode(value);
                      if (enrollError) setEnrollError(null);
                      if (value.length === 6) {
                        handleVerifyEnroll(value);
                      }
                    }}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {enrollError && <p className="text-center text-sm text-destructive">{enrollError}</p>}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => handleVerifyEnroll()}
                  className="w-full"
                  disabled={verifyCode.length !== 6 || enableMutation.isPending}
                >
                  {enableMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  Ativar TOTP
                </Button>
                <Button variant="ghost" onClick={() => setEnrollStep('qr')} className="w-full">
                  Voltar ao QR Code
                </Button>
              </div>
            </div>
          )}

          {enrollStep === 'backup-codes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg text-center">
                {backupCodes.map((code, i) => (
                  <code key={i} className="text-sm font-mono">
                    {code}
                  </code>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadBackupCodes} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
                <Button variant="outline" onClick={copyBackupCodes} className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setEnrollDialogOpen(false);
                  toast({ title: 'TOTP ativado', description: 'A autenticação de dois fatores foi ativada.' });
                }}
              >
                Concluir
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ReauthDialog
        open={reauthDialogOpen}
        onOpenChange={(open) => {
          setReauthDialogOpen(open);
          if (!open) setPendingReauthAction(null);
        }}
        onSuccess={handleReauthSuccess}
        title="Confirmar identidade"
      />
    </>
  );
}

export const TOTPManagementCard = memo(TOTPManagementCardComponent);
