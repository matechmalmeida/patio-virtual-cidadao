import type { BrandConfig } from '@/types/brand';

/**
 * Mock API that simulates fetching tenant brand config.
 * In production, this would be a real API call based on domain/subdomain.
 *
 * To test different themes, change the `activeTenant` variable below.
 */

const tenants: Record<string, BrandConfig> = {
  /** Default — Pátio Virtual original blue theme */
  default: {
    tenantId: 'default',
    appName: 'Pátio Virtual',
    appSubtitle: 'Portal do Cidadão',
    logoUrl: null,
    pwaIcon192: null,
    pwaIcon512: null,
    faviconUrl: null,
    colors: {},
    darkColors: {},
    supportPhone: '(85) 3452-1234',
    copyright: 'Pátio Virtual © 2026 — Todos os direitos reservados',
  },

  /** Example: Fortaleza — green/teal theme */
  fortaleza: {
    tenantId: 'fortaleza',
    appName: 'AMC Digital',
    appSubtitle: 'Autarquia Municipal de Trânsito',
    logoUrl: null,
    pwaIcon192: null,
    pwaIcon512: null,
    faviconUrl: null,
    colors: {
      primary: '160 65% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '160 20% 92%',
      secondaryForeground: '160 30% 25%',
      accent: '160 20% 92%',
      accentForeground: '160 30% 25%',
      ring: '160 65% 40%',
      info: '160 65% 40%',
      infoForeground: '0 0% 100%',
    },
    darkColors: {
      primary: '160 60% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '160 25% 20%',
      secondaryForeground: '160 25% 90%',
      accent: '160 25% 20%',
      accentForeground: '160 25% 90%',
      ring: '160 60% 50%',
      info: '160 60% 50%',
      infoForeground: '0 0% 100%',
    },
    supportPhone: '(85) 3452-5678',
    copyright: 'AMC Digital © 2026 — Prefeitura de Fortaleza',
  },

  /** Example: São Paulo — purple theme */
  saopaulo: {
    tenantId: 'saopaulo',
    appName: 'CET SP',
    appSubtitle: 'Companhia de Engenharia de Tráfego',
    logoUrl: null,
    pwaIcon192: null,
    pwaIcon512: null,
    faviconUrl: null,
    colors: {
      primary: '270 60% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '270 20% 93%',
      secondaryForeground: '270 30% 25%',
      accent: '270 20% 93%',
      accentForeground: '270 30% 25%',
      ring: '270 60% 50%',
      info: '270 60% 50%',
      infoForeground: '0 0% 100%',
    },
    darkColors: {
      primary: '270 55% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '270 25% 20%',
      secondaryForeground: '270 25% 90%',
      accent: '270 25% 20%',
      accentForeground: '270 25% 90%',
      ring: '270 55% 60%',
      info: '270 55% 60%',
      infoForeground: '0 0% 100%',
    },
    supportPhone: '(11) 1188-5678',
    copyright: 'CET SP © 2026 — Prefeitura de São Paulo',
  },
};

/** Change this to test different tenants: 'default' | 'fortaleza' | 'saopaulo' */
const activeTenant = 'default';

/**
 * Simulates an API call to fetch brand configuration.
 * In production, this would resolve based on window.location.hostname.
 */
export async function fetchBrandConfig(): Promise<BrandConfig> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return tenants[activeTenant] ?? tenants.default;
}
