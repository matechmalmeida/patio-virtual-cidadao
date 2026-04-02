import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMySeizures } from '../hooks/useSeizure';
import { SeizureCard } from '../components/SeizureCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertBanner } from '@/components/AlertBanner';
import { PullToRefresh } from '@/components/PullToRefresh';
import { RefreshCw, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react';
import { getApiErrorMessage } from '@/services/http/api-error';

export default function SeizureListPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error, refetch } = useMySeizures(page);

  return (
    <PullToRefresh onRefresh={() => refetch()}>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t('seizureList.title')}</h1>
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isFetching} className="hidden lg:inline-flex">
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        )}

        {isError && (
          <AlertBanner variant="error">
            {getApiErrorMessage(error, t('seizureList.loadError'))}
          </AlertBanner>
        )}

        {data && data.data.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t('seizureList.empty')}</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <>
            <div className="space-y-3">
              {data.data.map((item) => (
                <SeizureCard key={item.id} item={item} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label={t('seizureList.prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {t('seizureList.pageInfo', { page: data.meta.page, total: data.meta.totalPages })}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label={t('seizureList.next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </PullToRefresh>
  );
}
