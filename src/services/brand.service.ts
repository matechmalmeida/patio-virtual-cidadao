import { httpGet } from './http/http-client';
import { fetchBrandConfig } from '@/data/mockBrand';
import type { BrandConfig } from '@/types/brand';

export async function getBrandConfig(): Promise<BrandConfig> {
  try {
    return await httpGet<BrandConfig>('/public/brand-configs');
  } catch {
    return fetchBrandConfig();
  }
}
