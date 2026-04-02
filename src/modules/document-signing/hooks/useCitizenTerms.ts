import { useQuery } from '@tanstack/react-query';
import { getCitizenTerms } from '../services/document.service';

export function useCitizenTerms() {
  return useQuery({
    queryKey: ['citizen-terms'],
    queryFn: getCitizenTerms,
  });
}
