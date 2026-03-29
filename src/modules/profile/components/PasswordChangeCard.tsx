import { memo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiError } from '@/services/http/api-error';
import {
  useCheckPassword,
  useChangePassword,
  getChangePasswordErrorMessage,
  PasswordStrengthBar,
} from '@/modules/auth';
import { profilePasswordSchema, type ProfilePasswordFormData } from '../schemas/profile.schemas';
import { useDebounce } from '../hooks/useDebounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

function PasswordChangeCardComponent() {
  const { toast } = useToast();
  const [passwordCompromised, setPasswordCompromised] = useState<{
    isCompromised: boolean;
    occurrences?: number;
  } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checkPasswordMutation = useCheckPassword();
  const changePasswordMutation = useChangePassword();

  const passwordForm = useForm<ProfilePasswordFormData>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedNewPassword = passwordForm.watch('newPassword');
  const debouncedNewPassword = useDebounce(watchedNewPassword, 500);

  useEffect(() => {
    if (debouncedNewPassword && debouncedNewPassword.length >= 10) {
      if (checkPasswordMutation.isPending) return;
      checkPasswordMutation.mutate(
        { password: debouncedNewPassword },
        {
          onSuccess: (result) => {
            setPasswordCompromised(result);
          },
          onError: () => {
            setPasswordCompromised(null);
          },
        },
      );
    } else {
      setPasswordCompromised(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNewPassword]);

  const executePasswordChange = async (data: ProfilePasswordFormData) => {
    try {
      const response = await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        keepCurrentSession: true,
      });

      const sessionsRevoked = response.sessionsRevoked || 0;
      toast({
        title: 'Senha alterada',
        description:
          sessionsRevoked > 0
            ? `Sua senha foi alterada com sucesso. ${sessionsRevoked} sessão(ões) encerrada(s).`
            : 'Sua senha foi alterada com sucesso.',
      });

      passwordForm.reset();
      setPasswordCompromised(null);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      if (error instanceof ApiError) {
        const details = error.details as Record<string, unknown> | null;
        if (details && Array.isArray(details.errors)) {
          const compromised = details.errors.find(
            (e) => e && typeof e === 'object' && (e as { validator?: string }).validator === 'PasswordCompromisedValidator',
          );
          if (compromised) {
            toast({
              variant: 'destructive',
              title: 'Senha comprometida',
              description: 'Esta senha foi encontrada em vazamentos de dados e não pode ser utilizada.',
            });
            return;
          }
          const reused = details.errors.find(
            (e) => e && typeof e === 'object' && (e as { validator?: string }).validator === 'PasswordHistoryValidator',
          );
          if (reused) {
            toast({
              variant: 'destructive',
              title: 'Senha reutilizada',
              description: 'Esta senha já foi utilizada anteriormente. Escolha uma senha diferente.',
            });
            return;
          }
        }
      }
      toast({
        variant: 'destructive',
        title: 'Erro ao alterar senha',
        description: getChangePasswordErrorMessage(error as Error),
      });
    }
  };

  const onChangePassword = async (data: ProfilePasswordFormData) => {
    if (passwordCompromised?.isCompromised) {
      toast({
        variant: 'destructive',
        title: 'Senha comprometida',
        description: 'Por favor, escolha uma senha que não tenha sido comprometida.',
      });
      return;
    }

    await executePasswordChange(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Atualize sua senha de acesso</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha atual</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="********"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="********"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <PasswordStrengthBar password={field.value} />
                  {passwordCompromised?.isCompromised && (
                    <p className="text-sm text-destructive">
                      Esta senha foi encontrada em {passwordCompromised.occurrences?.toLocaleString() || ''} vazamentos de dados.
                      Escolha outra senha.
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="********"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending || passwordCompromised?.isCompromised}
              >
                {changePasswordMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                {changePasswordMutation.isPending ? 'Alterando...' : 'Alterar senha'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const PasswordChangeCard = memo(PasswordChangeCardComponent);
