import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, Mail, Phone, CreditCard, Calendar, Camera, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { ReauthDialog } from '@/modules/auth/components/ReauthDialog';
import { AvatarCropperDialog } from '@/modules/auth/components/AvatarCropperDialog';
import { getHttpClient } from '@/services/http/http-client';
import { useProfile, useUploadAvatar, useDeleteAvatar } from '../hooks/useProfile';
import { useProfileBasicInfo } from '../hooks/useProfileBasicInfo';
import { EditableField } from '../components/EditableField';
import { formatPhone, formatCpf } from '../lib/formatters';

const MAX_SIZE = 5 * 1024 * 1024;

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function resolveAvatarUrl(url: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) {
    try {
      const baseUrl = getHttpClient()?.baseUrl ?? '';
      const origin = new URL(baseUrl).origin;
      return `${origin}${url}`;
    } catch {
      return url;
    }
  }
  return url;
}

export default function PersonalDataPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <PersonalDataForm
      profile={profile}
      onBack={() => navigate('/app/profile')}
      t={t}
    />
  );
}

function PersonalDataForm({
  profile,
  onBack,
  t,
}: {
  profile: {
    name: string;
    email: string;
    phone: string | null;
    cpf?: string;
    birthDate?: string;
    avatarUrl: string | null;
  };
  onBack: () => void;
  t: (key: string) => string;
}) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const basicInfo = useProfileBasicInfo({
    full_name: profile.name,
    email: profile.email,
    phone: profile.phone || '',
    cpf: profile.cpf || '',
    birth_date: profile.birthDate || '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      toast({ title: 'Arquivo muito grande. Maximo 5MB.', variant: 'destructive' });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ title: 'Formato invalido. Use JPG, PNG ou WebP.', variant: 'destructive' });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setCropperOpen(true);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], 'avatar.png', { type: 'image/png' });
    uploadAvatarMutation.mutate(file);
    setCropperOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleCropperClose = (open: boolean) => {
    if (!open && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setCropperOpen(open);
  };

  const initials = getInitials(profile.name || '?');
  const resolvedUrl = resolveAvatarUrl(profile.avatarUrl);
  const isUploading = uploadAvatarMutation.isPending;

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.personal.title')}</CardTitle>
          <CardDescription>Atualize suas informacoes de perfil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                {resolvedUrl && <AvatarImage src={resolvedUrl} alt={profile.name} />}
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              {profile.avatarUrl && (
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full"
                  onClick={() => deleteAvatarMutation.mutate()}
                  disabled={isUploading || deleteAvatarMutation.isPending}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                <Camera className="h-4 w-4 mr-2" />
                {isUploading ? 'Enviando...' : 'Adicionar foto'}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou WebP. Maximo 5MB.</p>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <hr className="border-border" />

          <EditableField
            label="Nome completo"
            icon={<User className="h-4 w-4" />}
            value={basicInfo.profileForm.getValues('full_name')}
            editingValue={basicInfo.name.value}
            isEditing={basicInfo.name.editing}
            isPending={basicInfo.name.isPending}
            placeholder="Seu nome completo"
            onStartEdit={basicInfo.name.onStartEdit}
            onCancelEdit={basicInfo.name.onCancelEdit}
            onSave={basicInfo.name.onSave}
            onValueChange={basicInfo.name.setValue}
          />

          <EditableField
            label="CPF"
            icon={<CreditCard className="h-4 w-4" />}
            value={basicInfo.profileForm.getValues('cpf') || ''}
            displayValue={formatCpf(basicInfo.profileForm.getValues('cpf') || '')}
            editingValue={basicInfo.cpf.value}
            isEditing={basicInfo.cpf.editing}
            isPending={basicInfo.cpf.isPending}
            placeholder="000.000.000-00"
            sensitive
            onStartEdit={basicInfo.cpf.onStartEdit}
            onCancelEdit={basicInfo.cpf.onCancelEdit}
            onSave={basicInfo.cpf.onSave}
            onValueChange={(v) => basicInfo.cpf.setValue(formatCpf(v))}
          />

          <EditableField
            label="Data de Nascimento"
            icon={<Calendar className="h-4 w-4" />}
            value={basicInfo.profileForm.getValues('birth_date') || ''}
            editingValue={basicInfo.birthDate.value}
            isEditing={basicInfo.birthDate.editing}
            isPending={basicInfo.birthDate.isPending}
            type="date"
            placeholder="dd/mm/aaaa"
            onStartEdit={basicInfo.birthDate.onStartEdit}
            onCancelEdit={basicInfo.birthDate.onCancelEdit}
            onSave={basicInfo.birthDate.onSave}
            onValueChange={basicInfo.birthDate.setValue}
          />

          {basicInfo.emailVerification.isPending ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Codigo enviado para {basicInfo.emailVerification.maskedEmail}
              </p>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={basicInfo.emailVerification.code}
                  onChange={(value) => {
                    basicInfo.emailVerification.setCode(value);
                    if (value.length === 6) {
                      basicInfo.emailVerification.onConfirm(value);
                    }
                  }}
                  disabled={basicInfo.emailVerification.isConfirming}
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
              {basicInfo.emailVerification.isConfirming && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando...</span>
                </div>
              )}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={basicInfo.emailVerification.onCancel}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <EditableField
              label="E-mail"
              icon={<Mail className="h-4 w-4" />}
              value={basicInfo.profileForm.getValues('email')}
              editingValue={basicInfo.email.value}
              isEditing={basicInfo.email.editing}
              isPending={basicInfo.email.isPending}
              placeholder="seu@email.com"
              sensitive
              onStartEdit={basicInfo.email.onStartEdit}
              onCancelEdit={basicInfo.email.onCancelEdit}
              onSave={basicInfo.email.onSave}
              onValueChange={basicInfo.email.setValue}
            />
          )}

          <EditableField
            label="Telefone"
            icon={<Phone className="h-4 w-4" />}
            value={basicInfo.profileForm.getValues('phone') || ''}
            displayValue={formatPhone(basicInfo.profileForm.getValues('phone') || '')}
            editingValue={basicInfo.phone.value}
            isEditing={basicInfo.phone.editing}
            isPending={basicInfo.phone.isPending}
            placeholder="(00) 00000-0000"
            sensitive
            onStartEdit={basicInfo.phone.onStartEdit}
            onCancelEdit={basicInfo.phone.onCancelEdit}
            onSave={basicInfo.phone.onSave}
            onValueChange={(v) => basicInfo.phone.setValue(formatPhone(v))}
          />

          <p className="text-xs text-destructive">
            ** Requer verificacao por codigo enviado ao e-mail
          </p>
        </CardContent>
      </Card>

      {previewUrl && (
        <AvatarCropperDialog
          open={cropperOpen}
          onOpenChange={handleCropperClose}
          imageSrc={previewUrl}
          onCropComplete={handleCropComplete}
          isUploading={isUploading}
        />
      )}

      <ReauthDialog
        open={basicInfo.reauthDialogOpen}
        onOpenChange={basicInfo.setReauthDialogOpen}
        onSuccess={basicInfo.handleReauthSuccess}
        title={basicInfo.getReauthTitle()}
      />
    </div>
  );
}
