import { useMemo } from 'react';
import { useCases } from '@/modules/process';
import { DocumentCard } from '../components/DocumentCard';
import { AlertBanner } from '@/components/AlertBanner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DocumentListPage() {
  const { currentCase } = useCases();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!currentCase) return null;

  const { terms } = currentCase;

  const { pendingTerms, signedTerms } = useMemo(() => ({
    pendingTerms: terms.filter((term) => term.status === 'pendente'),
    signedTerms: terms.filter((term) => term.status === 'assinado'),
  }), [terms]);

  const allSigned = pendingTerms.length === 0;

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
            : t('document.pendingCount', { count: pendingTerms.length })}
        </p>
      </div>

      {allSigned && (
        <AlertBanner variant="success">
          {t('document.allSigned')}
        </AlertBanner>
      )}

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1 gap-2">
            <FileText className="h-4 w-4" />
            {t('document.tabPending')}
            <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
              {pendingTerms.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 gap-2">
            <History className="h-4 w-4" />
            {t('document.tabHistory')}
            <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
              {signedTerms.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pendingTerms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('document.emptyPending')}
            </p>
          ) : (
            <div className="space-y-3">
              {pendingTerms.map((term) => (
                <DocumentCard key={term.id} term={term} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {signedTerms.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('document.emptyHistory')}
            </p>
          ) : (
            <div className="space-y-3">
              {signedTerms.map((term) => (
                <DocumentCard key={term.id} term={term} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
