import type { BrandConfig } from '@/types/brand';

export async function getBrandConfig(): Promise<BrandConfig> {
  return {
    tenantId: 'default',
    appName: 'Patio Virtual',
    appSubtitle: 'Custodia Virtual de Veiculos',
    logoUrl: null,
    pwaIcon192: null,
    pwaIcon512: null,
    faviconUrl: null,
    colors: {},
    darkColors: {},
    supportPhone: '',
    copyright: '',
  };
}
