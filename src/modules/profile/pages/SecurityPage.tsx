import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordChangeCard } from '../components/PasswordChangeCard';
import { TOTPManagementCard } from '../components/TOTPManagementCard';

export default function SecurityPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

      <PasswordChangeCard />

      <TOTPManagementCard />
    </div>
  );
}
