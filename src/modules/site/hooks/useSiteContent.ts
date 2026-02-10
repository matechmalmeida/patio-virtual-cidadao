import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getSiteContent } from '../services/site.service';
import { queryKeys } from '@/lib/query-keys';
import type { SiteContent } from '@/types/site';

export function useSiteContent() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isPending, error } = useQuery<SiteContent>({
    queryKey: queryKeys.site.content(lang),
    queryFn: () => getSiteContent(lang),
  });

  return {
    data: data ?? null,
    loading: isPending,
    error: error?.message ?? null,
  };
}
