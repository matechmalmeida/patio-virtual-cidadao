import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileMenuCard } from '../components/ProfileMenuCard';
import { getProfile } from '../services/profile.service';

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((p) => setAvatarUrl(p.avatarUrl));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/acesso');
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <h1 className="text-xl font-bold">{t('profile.title')}</h1>

      <ProfileHeader
        name={user?.name ?? ''}
        email={user?.email ?? ''}
        avatarUrl={avatarUrl}
        onAvatarChange={setAvatarUrl}
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
          icon={HelpCircle}
          label={t('profile.support')}
          description={t('profile.supportDesc')}
          onClick={() => navigate('/suporte')}
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
