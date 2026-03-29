import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Settings, LogOut, Shield, MonitorSmartphone, Laptop, HelpCircle } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileMenuCard } from '../components/ProfileMenuCard';
import { useProfile, useUploadAvatar, useDeleteAvatar } from '../hooks/useProfile';

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state: { user }, logout } = useAuth();
  const { data: profile } = useProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const deleteAvatarMutation = useDeleteAvatar();

  const handleLogout = () => {
    logout();
    navigate('/acesso');
  };

  const displayName = profile?.name ?? user?.name ?? '';
  const displayEmail = profile?.email ?? user?.email ?? '';
  const displayAvatar = profile?.avatarUrl ?? user?.avatarUrl ?? null;

  return (
    <div className="px-4 py-5 space-y-4">
      <h1 className="text-xl font-bold">{t('profile.title')}</h1>

      <ProfileHeader
        name={displayName}
        email={displayEmail}
        avatarUrl={displayAvatar}
        onUpload={(file) => uploadAvatarMutation.mutate(file)}
        onDelete={() => deleteAvatarMutation.mutate()}
        isUploading={uploadAvatarMutation.isPending}
      />

      <div className="space-y-2">
        <ProfileMenuCard
          icon={User}
          label={t('profile.personalData')}
          description={t('profile.personalDataDesc')}
          onClick={() => navigate('/app/profile/dados')}
        />
        <ProfileMenuCard
          icon={MapPin}
          label={t('profile.addressMenu')}
          description={t('profile.addressMenuDesc')}
          onClick={() => navigate('/app/profile/endereco')}
        />
        <ProfileMenuCard
          icon={Settings}
          label={t('profile.preferencesMenu')}
          description={t('profile.preferencesMenuDesc')}
          onClick={() => navigate('/app/profile/preferencias')}
        />
        <ProfileMenuCard
          icon={MonitorSmartphone}
          label="Sessoes"
          description="Gerencie suas sessoes conectadas"
          onClick={() => navigate('/app/profile/sessoes')}
        />
        <ProfileMenuCard
          icon={Shield}
          label="Seguranca"
          description="Altere sua senha de acesso"
          onClick={() => navigate('/app/profile/seguranca')}
        />
        <ProfileMenuCard
          icon={Laptop}
          label="Dispositivos"
          description="Gerencie seus dispositivos conectados"
          onClick={() => navigate('/app/profile/dispositivos')}
        />
        <ProfileMenuCard
          icon={HelpCircle}
          label={t('profile.support')}
          description={t('profile.supportDesc')}
          onClick={() => navigate('/app/suporte')}
        />
        <ProfileMenuCard
          icon={LogOut}
          label={t('profile.logout')}
          description={t('profile.logoutDesc')}
          onClick={handleLogout}
          variant="destructive"
        />
      </div>
    </div>
  );
}
