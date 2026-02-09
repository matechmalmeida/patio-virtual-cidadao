import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { BrandConfig, BrandColors } from '@/types/brand';
import { getBrandConfig } from '@/services/brand.service';
import { getApiErrorMessage } from '@/services/http/api-error';

interface BrandContextType {
  brand: BrandConfig | null;
  isLoading: boolean;
}

const BrandContext = createContext<BrandContextType>({
  brand: null,
  isLoading: true,
});

/** Map of BrandColors keys → CSS custom property names */
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

  // Apply light mode colors to :root
  applyColors(brand.colors, root);

  // Apply dark mode colors via a style tag
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

  // Update page title
  document.title = `${brand.appName} — ${brand.appSubtitle}`;

  // Update theme-color meta tag
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme && brand.colors.primary) {
    // Convert HSL string to actual color for meta tag
    metaTheme.setAttribute(
      'content',
      `hsl(${brand.colors.primary})`
    );
  }

  // Update favicon if provided
  if (brand.faviconUrl) {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) favicon.href = brand.faviconUrl;
  }

  // Update apple-touch-icon if provided
  if (brand.pwaIcon192) {
    const appleIcon = document.querySelector<HTMLLinkElement>(
      'link[rel="apple-touch-icon"]'
    );
    if (appleIcon) appleIcon.href = brand.pwaIcon192;
  }
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getBrandConfig()
      .then((config) => {
        setBrand(config);
        applyBrandToDOM(config);
      })
      .catch((err) => {
        console.error('Failed to load brand config:', err);
        console.error(getApiErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <BrandContext.Provider value={{ brand, isLoading }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
