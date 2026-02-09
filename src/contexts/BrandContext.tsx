import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import type { BrandConfig, BrandColors } from '@/types/brand';
import { getBrandConfig } from '@/services/brand.service';
import { queryKeys } from '@/lib/query-keys';

interface BrandContextType {
  brand: BrandConfig | null;
  isLoading: boolean;
}

const BrandContext = createContext<BrandContextType>({
  brand: null,
  isLoading: true,
});

const COLOR_MAP: Record<keyof BrandColors, string> = {
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  destructiveForeground: '--destructive-foreground',
  success: '--success',
  successForeground: '--success-foreground',
  warning: '--warning',
  warningForeground: '--warning-foreground',
  info: '--info',
  infoForeground: '--info-foreground',
  background: '--background',
  foreground: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  border: '--border',
  input: '--input',
  ring: '--ring',
};

function applyColors(colors: Partial<BrandColors>, target: HTMLElement) {
  for (const [key, cssVar] of Object.entries(COLOR_MAP)) {
    const value = colors[key as keyof BrandColors];
    if (value) {
      target.style.setProperty(cssVar, value);
    }
  }
}

function applyBrandToDOM(brand: BrandConfig) {
  const root = document.documentElement;

  applyColors(brand.colors, root);

  if (Object.keys(brand.darkColors).length > 0) {
    let styleEl = document.getElementById('brand-dark-overrides');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'brand-dark-overrides';
      document.head.appendChild(styleEl);
    }

    const darkVars = Object.entries(COLOR_MAP)
      .map(([key, cssVar]) => {
        const value = brand.darkColors[key as keyof BrandColors];
        return value ? `  ${cssVar}: ${value};` : null;
      })
      .filter(Boolean)
      .join('\n');

    styleEl.textContent = `.dark {\n${darkVars}\n}`;
  }

  document.title = `${brand.appName} — ${brand.appSubtitle}`;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme && brand.colors.primary) {
    metaTheme.setAttribute(
      'content',
      `hsl(${brand.colors.primary})`
    );
  }

  if (brand.faviconUrl) {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = brand.faviconUrl;
  }

  if (brand.pwaIcon192) {
    const appleIcon = document.querySelector<HTMLLinkElement>(
      'link[rel="apple-touch-icon"]'
    );
    if (appleIcon) appleIcon.href = brand.pwaIcon192;
  }
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const { data: brand = null, isPending: isLoading } = useQuery({
    queryKey: queryKeys.brand.config(),
    queryFn: getBrandConfig,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (brand) {
      applyBrandToDOM(brand);
    }
  }, [brand]);

  return (
    <BrandContext.Provider value={{ brand, isLoading }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
