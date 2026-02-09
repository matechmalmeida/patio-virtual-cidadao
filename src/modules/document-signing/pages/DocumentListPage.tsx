import { useAuth } from '@/modules/auth';
import { DocumentCard } from '../components/DocumentCard';
import { AlertBanner } from '@/components/AlertBanner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DocumentListPage() {
  const { currentCase } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!currentCase) return null;

  const { terms } = currentCase;
  const pendingCount = terms.filter((term) => term.status === 'pendente').length;
  const allSigned = pendingCount === 0;

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('common.back')}
      </Button>

      <div>
        <h1 className="text-xl font-bold">{t('document.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {allSigned
            ? t('document.allSigned')
            : t('document.pendingCount', { count: pendingCount })}
        </p>
      </div>

      {allSigned && (
        <AlertBanner variant="success">
          {t('document.allSigned')}
        </AlertBanner>
      )}

      <div className="space-y-3">
        {terms.map((term) => (
          <DocumentCard key={term.id} term={term} />
        ))}
      </div>
    </div>
  );
}
