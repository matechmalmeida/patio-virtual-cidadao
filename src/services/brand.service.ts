import { ApiError } from './http/api-error';
import { executeMockRequest } from './http/mock-adapter';
import { fetchBrandConfig } from '@/data/mockBrand';
import type { BrandConfig } from '@/types/brand';

export async function getBrandConfig(): Promise<BrandConfig> {
  return executeMockRequest(async () => {
    const config = await fetchBrandConfig();

    if (!config?.tenantId) {
      throw new ApiError({
        code: 'NOT_FOUND',
        status: 404,
        message: 'Tenant brand config not found',
        userMessage: 'Não foi possível carregar a marca do portal.',
      });
    }

    return config;
  }, { delayMs: 150 });
}
