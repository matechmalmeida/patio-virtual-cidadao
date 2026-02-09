import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getLegalContent } from '@/services/legal.service';
import { queryKeys } from '@/lib/query-keys';
import type { LegalPageContent } from '@/types/legal';

export function useLegalContent(slug: string) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const { data, isPending, error } = useQuery<LegalPageContent | null>({
    queryKey: queryKeys.legal.content(slug, lang),
    queryFn: () => getLegalContent(slug, lang),
  });

  return {
    data: data ?? null,
    loading: isPending,
    error: error?.message ?? null,
  };
}
